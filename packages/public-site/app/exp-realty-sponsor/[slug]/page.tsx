import { notFound } from 'next/navigation';
import { CategoryBlogPostTemplate } from '@/components/blog';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';
import { extractFAQs, generateFAQSchema, transformFAQToRankMathMarkup } from '@/lib/faq-utils';
import { getCachedBlogPosts, findPostBySlug, getRelatedPosts } from '@/lib/blog-post-page';
import { getAuthorData } from '@/lib/author-data';
import { getPostUrl } from '@/lib/blog-post-urls';
import type { Metadata } from 'next';

/**
 * Generate static params for exp-realty-sponsor blog posts only.
 * These posts live at /exp-realty-sponsor/[slug] instead of /blog/exp-realty-sponsor/[slug].
 */
export async function generateStaticParams() {
  const posts = getCachedBlogPosts();

  return posts
    .filter((post) => post.customUri?.startsWith('exp-realty-sponsor/'))
    .map((post) => ({
      slug: post.customUri!.split('/').pop()!,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) {
    return { title: 'Post Not Found | Smart Agent Alliance' };
  }

  const description = post.metaDescription || cleanExcerpt(post.excerpt, 160);

  const ogImages = post.featuredImage?.url
    ? [{
        url: post.featuredImage.url,
        width: post.featuredImage.width || undefined,
        height: post.featuredImage.height || undefined,
        alt: post.featuredImage.alt || post.title,
      }]
    : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }];

  return {
    title: `${post.title} | Smart Agent Alliance`,
    description,
    keywords: post.categories,
    alternates: {
      canonical: `https://smartagentalliance.com/exp-realty-sponsor/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      section: post.categories[0],
      tags: post.categories,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.featuredImage?.url ? [post.featuredImage.url] : ['/og-image.jpg'],
    },
  };
}

export default async function ExpRealtySponsorPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) {
    notFound();
  }

  const category = post.categories[0] || 'uncategorized';
  const postUrl = getPostUrl(post);

  const transformedContent = transformFAQToRankMathMarkup(post.content);
  const postWithTransformedContent = { ...post, content: transformedContent };

  const faqs = extractFAQs(post.content);
  const faqSchema = generateFAQSchema(faqs);

  // BlogPosting structured data
  const authorData = getAuthorData(post.author.name);
  const author = authorData
    ? { '@type': 'Person' as const, name: authorData.name, url: authorData.profileUrl, jobTitle: authorData.jobTitle, sameAs: authorData.sameAs }
    : { '@type': 'Person' as const, name: post.author.name };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || cleanExcerpt(post.excerpt, 160),
    image: post.featuredImage?.url || 'https://smartagentalliance.com/og-image.jpg',
    datePublished: post.date,
    dateModified: post.modified,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'Smart Agent Alliance',
      '@id': 'https://smartagentalliance.com/#organization',
      logo: { '@type': 'ImageObject', url: 'https://smartagentalliance.com/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://smartagentalliance.com${postUrl}`,
    },
  };

  // Pre-filter related posts on server side
  const relatedPosts = getRelatedPosts(posts, post);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <CategoryBlogPostTemplate post={postWithTransformedContent} category={category} relatedPosts={relatedPosts} />
    </main>
  );
}
