import { notFound } from 'next/navigation';
import { CategoryBlogPostTemplate } from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';
import { cleanExcerpt } from '@/lib/wordpress/fallbacks';
import { extractFAQs, generateFAQSchema, transformFAQToRankMathMarkup } from '@/lib/faq-utils';
import type { Metadata } from 'next';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Load all blog posts from chunked JSON files
 * Uses fs.readFileSync for reliable build-time loading
 * Dynamically discovers chunk count from index file
 */
function getAllBlogPosts(): BlogPost[] {
  const allPosts: BlogPost[] = [];
  const publicDir = join(process.cwd(), 'public');

  // Read total chunks from index file
  const indexPath = join(publicDir, 'blog-posts-index.json');
  let totalChunks = 50; // generous upper bound as fallback
  try {
    if (existsSync(indexPath)) {
      const index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      totalChunks = index.totalChunks || totalChunks;
    }
  } catch {}

  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = join(publicDir, `blog-posts-chunk-${i}.json`);
    try {
      if (existsSync(chunkPath)) {
        const data = JSON.parse(readFileSync(chunkPath, 'utf-8'));
        allPosts.push(...data);
      }
    } catch (error) {
      console.warn(`Failed to load blog-posts-chunk-${i}.json:`, error);
    }
  }

  console.log(`📚 Loaded ${allPosts.length} blog posts from ${totalChunks} chunks`);
  return allPosts;
}

// Cache the posts since this runs multiple times during build
let cachedPosts: BlogPost[] | null = null;
function getCachedBlogPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = getAllBlogPosts();
  }
  return cachedPosts;
}

/**
 * Convert category name to URL slug
 */
function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Find a blog post by URL slug, checking custom URI first then WordPress slug
 */
function findPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  // First: match by custom URI slug (source of truth from Permalink Manager)
  const byUri = posts.find((p) => {
    if (!p.customUri) return false;
    const uriSlug = p.customUri.split('/').pop();
    return uriSlug === slug;
  });
  if (byUri) return byUri;
  // Fallback: match by WordPress post slug
  return findPostBySlug(posts, slug);
}

/**
 * Generate static params for all blog posts
 * Uses Permalink Manager custom URIs as source of truth for URL paths
 * Falls back to category/slug construction if no custom URI exists
 */
export async function generateStaticParams() {
  const posts = getCachedBlogPosts();

  return posts.map((post) => {
    // Use customUri from Permalink Manager as source of truth
    if (post.customUri) {
      const parts = post.customUri.split('/');
      if (parts.length >= 2) {
        return {
          category: parts[0],
          slug: parts[parts.length - 1],
        };
      }
    }
    // Fallback: construct from WordPress category + slug
    const category = post.categories[0] || 'uncategorized';
    return {
      category: categoryToSlug(category),
      slug: post.slug,
    };
  });
}

/**
 * Generate metadata for each blog post
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) {
    return {
      title: 'Post Not Found | Smart Agent Alliance',
    };
  }

  // Prefer Rank Math meta description, fallback to cleaned excerpt
  const description = post.metaDescription || cleanExcerpt(post.excerpt, 160);

  return {
    title: `${post.title} | Smart Agent Alliance`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      images: post.featuredImage?.url ? [post.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.featuredImage?.url ? [post.featuredImage.url] : [],
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
  const { slug } = await params;
  const posts = getCachedBlogPosts();
  const post = findPostBySlug(posts, slug);

  if (!post) {
    notFound();
  }

  const category = post.categories[0] || 'uncategorized';

  // Transform non-RankMath FAQ content to RankMath-style markup
  const transformedContent = transformFAQToRankMathMarkup(post.content);
  const postWithTransformedContent = {
    ...post,
    content: transformedContent
  };

  // Extract FAQs and generate schema
  const faqs = extractFAQs(post.content);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <main id="main-content">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <CategoryBlogPostTemplate post={postWithTransformedContent} category={category} />
    </main>
  );
}
