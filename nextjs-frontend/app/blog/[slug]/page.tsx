import { fetchAllPosts, fetchPostBySlug, fetchRelatedPosts } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { CTAButton } from '@/components/saa';
import { CategoryBadge, BlogContent, RelatedPosts, Breadcrumbs, ShareButtons } from '../components';
import { ensureFeaturedImage, ensureAuthor } from '@/lib/wordpress/fallbacks';

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    const posts = await fetchAllPosts();
    return posts.map(post => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate comprehensive metadata for SEO
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | SAA Building Blocks',
      description: 'The requested blog post could not be found.',
    };
  }

  // Strip HTML from excerpt for meta description (120-160 chars optimal)
  const description = post.excerpt
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim();

  const featuredImage = ensureFeaturedImage(post.featuredImage);
  const author = ensureAuthor(post.author);
  const canonicalUrl = `https://saabuildingblocks.com/blog/${post.slug}`;

  // Format category for OpenGraph section
  const primaryCategory = post.categories[0] || 'Blog';

  return {
    title: `${post.title} | SAA Building Blocks`,
    description,
    keywords: post.categories.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [author.name],
      section: primaryCategory,
      tags: post.categories,
      images: [
        {
          url: featuredImage.url,
          width: featuredImage.width,
          height: featuredImage.height,
          alt: featuredImage.alt,
        }
      ],
      siteName: 'SAA Building Blocks',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [featuredImage.url],
      creator: '@saabuildingblocks',
      site: '@saabuildingblocks',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await fetchPostBySlug(params.slug);

  // Handle missing post (404)
  if (!post) {
    notFound();
  }

  // Fetch related posts
  const relatedPosts = await fetchRelatedPosts(0, post.id, 4);

  // Apply fallbacks for missing data
  const featuredImage = ensureFeaturedImage(post.featuredImage);
  const author = ensureAuthor(post.author);

  // Get primary category for breadcrumbs
  const primaryCategory = post.categories[0];
  const primaryCategoryName = primaryCategory
    ? primaryCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : undefined;

  // Build JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // Article Schema
      {
        '@type': 'Article',
        '@id': `https://saabuildingblocks.com/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160),
        image: {
          '@type': 'ImageObject',
          url: featuredImage.url,
          width: featuredImage.width,
          height: featuredImage.height,
        },
        datePublished: post.date,
        dateModified: post.modified,
        author: {
          '@type': 'Person',
          name: author.name,
          url: 'https://saabuildingblocks.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SAA Building Blocks',
          url: 'https://saabuildingblocks.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://saabuildingblocks.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://saabuildingblocks.com/blog/${post.slug}`,
        },
        articleSection: primaryCategory || 'Blog',
        keywords: post.categories.join(', '),
      },
      // Organization Schema
      {
        '@type': 'Organization',
        '@id': 'https://saabuildingblocks.com/#organization',
        name: 'SAA Building Blocks',
        url: 'https://saabuildingblocks.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://saabuildingblocks.com/logo.png',
        },
        sameAs: [
          'https://twitter.com/saabuildingblocks',
          'https://facebook.com/saabuildingblocks',
          'https://linkedin.com/company/saabuildingblocks',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Back button with CTAButton */}
        <div className="mb-8">
          <CTAButton href="/blog">
            ← BACK TO BLOG
          </CTAButton>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          category={primaryCategoryName}
          categorySlug={primaryCategory}
          postTitle={post.title}
        />

        {/* Featured Image with Fallback - Optimized with Next.js Image */}
        <div className="relative mb-8 overflow-hidden rounded-lg border border-[#e5e4dd]/20 h-96">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Categories with SAA badges */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category, idx) => (
              <CategoryBadge key={idx} category={category} variant="featured" />
            ))}
          </div>
        )}

        {/* H1 Title - Auto-applies display font */}
        <h1 className="text-[clamp(2rem,2.5vw+0.5rem,3rem)] mb-6 text-[#e5e4dd]">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-[#dcdbd5]/70 pb-8 border-b border-[#e5e4dd]/20">
          <div className="flex items-center gap-2">
            <span className="text-[#ffd700]">By</span>
            <span className="text-[#e5e4dd]">{author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={post.date} className="text-[#dcdbd5]">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {/* Excerpt Callout */}
        {post.excerpt && (
          <div className="mb-8 p-6 border-l-4 border-[#ffd700] bg-[#ffd700]/5 rounded-r-lg">
            <div
              className="text-lg italic text-[#dcdbd5] font-[var(--font-amulya)]"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </div>
        )}

        {/* WordPress Content - Protocol Compliant */}
        <BlogContent content={post.content} />

        {/* Share Buttons */}
        <ShareButtons
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
        />

        {/* Related Posts */}
        <RelatedPosts
          posts={relatedPosts}
          currentPostId={post.id}
          currentCategory={primaryCategory}
          limit={4}
        />

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 border-t border-[#e5e4dd]/20 text-center">
          <p className="text-[#dcdbd5] mb-6 font-[var(--font-amulya)]">
            Want to read more articles?
          </p>
          <CTAButton href="/blog">
            VIEW ALL POSTS
          </CTAButton>
        </div>
      </article>
    </div>
  );
}
