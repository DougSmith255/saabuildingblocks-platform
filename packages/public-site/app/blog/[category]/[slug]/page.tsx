import { notFound } from 'next/navigation';
import { CategoryBlogPostTemplate, generateBreadcrumbSchema } from '@/components/blog';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';
import { extractFAQs, generateFAQSchema, stripFAQSection } from '@/lib/faq-utils';
import { extractTables, generateTableSchemas } from '@/lib/table-utils';
import { getCachedBlogPosts, findPostBySlug, getRelatedPosts } from '@/lib/blog-post-page';
import { STANDALONE_CATEGORIES, categoryToSlug, getPostUrl } from '@/lib/blog-post-urls';
import { buildBlogPostingSchema, buildVideoSchema } from '@/lib/blog-schema';
import type { Metadata } from 'next';

/**
 * Generate static params for all blog posts EXCEPT standalone categories.
 * Posts in about-exp-realty and exp-realty-sponsor are served by their own routes.
 */
export async function generateStaticParams() {
  const posts = getCachedBlogPosts();

  return posts
    .map((post) => {
      if (post.customUri) {
        const parts = post.customUri.split('/');
        if (parts.length >= 2) {
          return {
            category: parts[0],
            slug: parts[parts.length - 1],
          };
        }
      }
      const category = post.categories[0] || 'uncategorized';
      return {
        category: categoryToSlug(category),
        slug: post.slug,
      };
    })
    .filter((params) => !STANDALONE_CATEGORIES.includes(params.category));
}

/**
 * Generate metadata for each blog post
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug, category);

  if (!post) {
    return {
      title: 'Post Not Found | Smart Agent Alliance',
    };
  }

  // Rank Math SEO title for search results; falls back to post title
  const seoTitle = post.metaTitle || post.title;
  // Prefer Rank Math meta description, fallback to cleaned excerpt
  const description = post.metaDescription || cleanExcerpt(post.excerpt, 160);

  // Build OG images array with dimensions when available
  const ogImages = post.featuredImage?.url
    ? [{
        url: post.featuredImage.url,
        width: post.featuredImage.width || undefined,
        height: post.featuredImage.height || undefined,
        alt: post.featuredImage.alt || post.title,
      }]
    : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }];

  return {
    title: `${seoTitle} | Smart Agent Alliance`,
    description,
    keywords: post.categories,
    alternates: {
      canonical: `https://smartagentalliance.com/blog/${category}/${slug}`,
    },
    openGraph: {
      title: seoTitle,
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
      title: seoTitle,
      description,
      images: post.featuredImage?.url ? [post.featuredImage.url] : ['/og-image.jpg'],
    },
  };
}

/**
 * Blog Post Page Component
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug, category);

  if (!post) {
    notFound();
  }

  const resolvedCategory = post.categories[0] || 'uncategorized';
  const postUrl = getPostUrl(post);

  // Extract FAQs, strip FAQ section from content, generate schema
  const faqs = extractFAQs(post.content);
  const faqSchema = generateFAQSchema(faqs);
  const tables = extractTables(post.content);
  const tableSchemas = generateTableSchemas(tables, post.title);
  const strippedContent = faqs.length > 0 ? stripFAQSection(post.content) : post.content;
  const postForTemplate = { ...post, content: strippedContent };

  // Structured data
  const blogPostingSchema = buildBlogPostingSchema(post, postUrl);
  const videoSchema = buildVideoSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema(category, post.title);

  // Pre-filter related posts on server side to minimize client payload
  const relatedPosts = getRelatedPosts(posts, post);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {tableSchemas?.map((schema, i) => (
        <script
          key={`table-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CategoryBlogPostTemplate post={postForTemplate} category={category} relatedPosts={relatedPosts} faqs={faqs} />
    </main>
  );
}
