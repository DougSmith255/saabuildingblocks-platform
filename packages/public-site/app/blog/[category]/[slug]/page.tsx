import { notFound } from 'next/navigation';
import { BlogPostTemplate } from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';
import type { Metadata } from 'next';

// Number of blog post chunks available
// Updated to 29 chunks based on latest blog posts generation (261 posts)
const TOTAL_CHUNKS = 29;

/**
 * Load all blog posts from chunked JSON files
 */
async function getAllBlogPosts(): Promise<BlogPost[]> {
  const allPosts: BlogPost[] = [];

  for (let i = 1; i <= TOTAL_CHUNKS; i++) {
    try {
      // Dynamic import for each chunk
      const chunk = await import(`@/public/blog-posts-chunk-${i}.json`);
      allPosts.push(...(chunk.default || chunk));
    } catch (error) {
      console.warn(`Failed to load blog-posts-chunk-${i}.json:`, error);
    }
  }

  return allPosts;
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
  const posts = await getAllBlogPosts();

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
  const posts = await getAllBlogPosts();
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
  const posts = await getAllBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, posts);

  return (
    <main>
      <BlogPostTemplate post={post} relatedPosts={relatedPosts} />
    </main>
  );
}
