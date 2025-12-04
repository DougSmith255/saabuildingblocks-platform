/**
 * Dynamic Blog Post Page
 * Handles all blog post routes using catch-all segment [...slug]
 * Supports multi-level permalinks (e.g., /blog/category/subcategory/post-slug)
 *
 * Uses static generation via generateStaticParams to pre-render all ~200 posts
 * at build time for optimal performance on Cloudflare Pages.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { BlogPostTemplate } from '@/components/blog/BlogPostTemplate';
import { fetchBlogPosts } from '@/lib/wordpress/blog-api';
import type { BlogPost } from '@/lib/wordpress/types';

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saabuildingblocks.com';

/**
 * Extracts permalink path from WordPress full URL or returns path if already clean
 * @param permalink - Full URL or path (e.g., 'https://wp.saabuildingblocks.com/category/post/' or 'category/post')
 * @returns Clean permalink path (e.g., 'category/post')
 */
function extractPermalinkPath(permalink: string): string {
  try {
    // Check if it's a full URL
    if (permalink.startsWith('http://') || permalink.startsWith('https://')) {
      const url = new URL(permalink);
      // Return pathname without leading/trailing slashes
      return url.pathname.replace(/^\/+|\/+$/g, '');
    }
    // Already a clean path, just remove leading/trailing slashes
    return permalink.replace(/^\/+|\/+$/g, '');
  } catch {
    // If URL parsing fails, clean up the string directly
    return permalink.replace(/^\/+|\/+$/g, '');
  }
}

/**
 * Fetches ALL blog posts across all pages for static generation
 * Handles pagination automatically to get every post
 * Results are cached for efficient reuse across generateStaticParams, generateMetadata, and page render
 */
const fetchAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const allPosts: BlogPost[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const { posts, pagination } = await fetchBlogPosts({
      page: currentPage,
      per_page: 100, // Max per page to minimize requests
    });

    allPosts.push(...posts);
    totalPages = pagination.total_pages;
    currentPage++;

    console.log(`📄 Fetched page ${currentPage - 1}/${totalPages} (${posts.length} posts, ${allPosts.length} total)`);
  } while (currentPage <= totalPages);

  console.log(`✅ Total posts fetched for static generation: ${allPosts.length}`);
  return allPosts;
});

/**
 * Find a post by its permalink from the cached posts list
 * @param permalink - Clean permalink path (e.g., 'category/post')
 * @returns BlogPost or null if not found
 */
const findPostByPermalink = cache(async (permalink: string): Promise<BlogPost | null> => {
  const allPosts = await fetchAllBlogPosts();

  // Normalize the search permalink
  const normalizedSearch = permalink.replace(/^\/+|\/+$/g, '').toLowerCase();

  // Find post by matching extracted permalink
  const post = allPosts.find(p => {
    const postPermalink = extractPermalinkPath(p.permalink).toLowerCase();
    return postPermalink === normalizedSearch;
  });

  if (!post) {
    console.warn(`⚠️ Post not found: ${permalink}`);
    return null;
  }

  return post;
});

/**
 * Get related posts from the same category
 * @param currentPostId - ID of current post to exclude
 * @param categories - Categories to match
 * @param limit - Max number of related posts
 * @returns Array of related BlogPost objects
 */
const getRelatedPosts = cache(async (
  currentPostId: number,
  categories: string[],
  limit: number = 4
): Promise<BlogPost[]> => {
  const allPosts = await fetchAllBlogPosts();

  // Filter posts:
  // 1. Exclude current post
  // 2. Prioritize posts from same categories
  const relatedPosts = allPosts
    .filter(p => p.id !== currentPostId)
    .filter(p => p.categories.some(cat => categories.includes(cat)))
    .slice(0, limit);

  // If not enough posts from same category, fill with other posts
  if (relatedPosts.length < limit) {
    const otherPosts = allPosts
      .filter(p => p.id !== currentPostId)
      .filter(p => !relatedPosts.some(rp => rp.id === p.id))
      .slice(0, limit - relatedPosts.length);

    relatedPosts.push(...otherPosts);
  }

  return relatedPosts;
});

/**
 * Generate static params for all blog posts
 * This pre-renders every blog post at build time
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const posts = await fetchAllBlogPosts();

    const params = posts.map((post) => {
      // Extract clean path from full URL if needed
      // e.g., 'https://wp.saabuildingblocks.com/category/post/' -> 'category/post'
      const cleanPermalink = extractPermalinkPath(post.permalink);

      // Split permalink into segments for catch-all route
      // e.g., 'category/post' -> ['category', 'post']
      const slugSegments = cleanPermalink.split('/').filter(Boolean);

      return {
        slug: slugSegments,
      };
    });

    console.log(`📝 Generated ${params.length} static params for blog posts`);

    // Log a few examples for verification
    if (params.length > 0) {
      console.log('Sample permalinks:', params.slice(0, 3).map(p => p.slug.join('/')));
    }

    return params;
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const permalink = slug.join('/');
  const post = await findPostByPermalink(permalink);

  if (!post) {
    return {
      title: 'Post Not Found | Smart Agent Alliance',
      description: 'The requested blog post could not be found.',
    };
  }

  // Strip HTML tags from excerpt for meta description
  const plainExcerpt = post.excerpt
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
    .slice(0, 160);

  // Get primary category for OpenGraph
  const primaryCategory = post.categories[0] || 'Real Estate';

  return {
    title: `${post.title} | Smart Agent Alliance`,
    description: plainExcerpt || `Read about ${post.title} on the Smart Agent Alliance blog.`,
    keywords: [
      'real estate',
      'real estate agent',
      'eXp Realty',
      primaryCategory,
      ...post.categories,
    ],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: plainExcerpt,
      url: `${SITE_URL}/blog/${extractPermalinkPath(post.permalink)}`,
      siteName: 'Smart Agent Alliance',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage.url,
              width: post.featuredImage.width,
              height: post.featuredImage.height,
              alt: post.featuredImage.alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: plainExcerpt,
      images: post.featuredImage ? [post.featuredImage.url] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${extractPermalinkPath(post.permalink)}`,
    },
  };
}

/**
 * Blog Post Page Component
 * Fetches post data and renders BlogPostTemplate
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  // Join slug segments back into permalink path
  const permalink = slug.join('/');

  console.log(`🔍 Loading blog post: ${permalink}`);

  // Fetch the post by permalink from cached posts
  const post = await findPostByPermalink(permalink);

  // Return 404 if post not found
  if (!post) {
    console.warn(`⚠️ Blog post not found: ${permalink}`);
    notFound();
  }

  // Fetch related posts (from same category)
  const relatedPosts = await getRelatedPosts(post.id, post.categories, 4);

  console.log(`✅ Rendering blog post: ${post.title} with ${relatedPosts.length} related posts`);

  return (
    <BlogPostTemplate
      post={post}
      relatedPosts={relatedPosts}
    />
  );
}
