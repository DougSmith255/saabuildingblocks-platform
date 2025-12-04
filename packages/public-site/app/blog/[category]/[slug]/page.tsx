import { notFound } from 'next/navigation';
import { CategoryBlogPostTemplate } from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';
import type { Metadata } from 'next';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Number of blog post chunks available
// Updated to 29 chunks based on latest blog posts generation (261 posts)
const TOTAL_CHUNKS = 29;

/**
 * Load all blog posts from chunked JSON files
 * Uses fs.readFileSync for reliable build-time loading
 * (Dynamic imports with variable paths don't work well with Turbopack)
 */
function getAllBlogPosts(): BlogPost[] {
  const allPosts: BlogPost[] = [];
  const publicDir = join(process.cwd(), 'public');

  for (let i = 1; i <= TOTAL_CHUNKS; i++) {
    const chunkPath = join(publicDir, `blog-posts-chunk-${i}.json`);
    try {
      if (existsSync(chunkPath)) {
        const data = JSON.parse(readFileSync(chunkPath, 'utf-8'));
        allPosts.push(...data);
      } else {
        console.warn(`Chunk file not found: ${chunkPath}`);
      }
    } catch (error) {
      console.warn(`Failed to load blog-posts-chunk-${i}.json:`, error);
    }
  }

  console.log(`📚 Loaded ${allPosts.length} blog posts from ${TOTAL_CHUNKS} chunks`);
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
 * Generate static params for all blog posts
 * This pre-builds all blog post pages at build time
 */
export async function generateStaticParams() {
  const posts = getCachedBlogPosts();

  return posts.map((post) => {
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
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found | Smart Agent Alliance',
    };
  }

  // Strip HTML tags from excerpt for description
  const description = post.excerpt.replace(/<[^>]*>/g, '').trim();

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
 * Get related posts (same category, excluding current post)
 */
function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const primaryCategory = currentPost.categories[0];

  return allPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        post.categories.includes(primaryCategory)
    )
    .slice(0, limit);
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
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, posts);

  const category = post.categories[0] || 'uncategorized';

  return (
    <main>
      <CategoryBlogPostTemplate post={post} relatedPosts={relatedPosts} category={category} />
    </main>
  );
}
