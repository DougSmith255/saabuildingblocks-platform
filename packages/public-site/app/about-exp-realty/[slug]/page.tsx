import { notFound } from 'next/navigation';
import { CategoryBlogPostTemplate, generateBreadcrumbSchema } from '@/components/blog';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';
import '../../styles/blog.css';
import { extractFAQs, generateFAQSchema, stripFAQSection } from '@/lib/faq-utils';
import { extractTables, generateTableSchemas } from '@/lib/table-utils';
import { getCachedBlogPosts, findPostBySlug, getRelatedPosts } from '@/lib/blog-post-page';
import { buildBlogPostingSchema, buildVideoSchema } from '@/lib/blog-schema';
import { getPostUrl } from '@/lib/blog-post-urls';
import type { Metadata } from 'next';

/**
 * Generate static params for about-exp-realty blog posts only.
 * These posts live at /about-exp-realty/[slug] instead of /blog/about-exp-realty/[slug].
 */
export async function generateStaticParams() {
  const posts = getCachedBlogPosts();

  return posts
    .filter((post) => post.customUri?.startsWith('about-exp-realty/'))
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
  const post = findPostBySlug(posts, slug, 'about-exp-realty');

  if (!post) {
    return { title: 'Post Not Found | Smart Agent Alliance' };
  }

  const seoTitle = post.metaTitle || post.title;
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
    title: `${seoTitle} | Smart Agent Alliance`,
    description,
    keywords: post.categories,
    alternates: {
      canonical: `https://smartagentalliance.com/about-exp-realty/${slug}`,
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

export default async function AboutExpRealtyPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug, 'about-exp-realty');

  if (!post) {
    notFound();
  }

  const category = post.categories[0] || 'uncategorized';
  const postUrl = getPostUrl(post);

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

  // Pre-filter related posts on server side
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
