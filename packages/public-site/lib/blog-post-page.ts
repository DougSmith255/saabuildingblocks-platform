/**
 * Shared server-side utilities for blog post pages.
 * Uses fs — must only be imported from server components / route handlers.
 */
import type { BlogPost } from '@/lib/wordpress/types';
import { categoryToSlug } from '@/lib/blog-post-urls';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Normalize WordPress author usernames to proper display names
const AUTHOR_NAME_MAP: Record<string, string> = {
  'karriehill': 'Karrie Hill',
  'dougsmart1': 'Doug Smart',
};
function normalizeAuthorName(post: BlogPost): BlogPost {
  const mapped = AUTHOR_NAME_MAP[post.author.name.toLowerCase()];
  if (mapped) {
    return { ...post, author: { ...post.author, name: mapped } };
  }
  return post;
}

/**
 * Load all blog posts from chunked JSON files.
 * Uses fs.readFileSync for reliable build-time loading.
 * Dynamically discovers chunk count from index file.
 */
export function getAllBlogPosts(): BlogPost[] {
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
        const data: BlogPost[] = JSON.parse(readFileSync(chunkPath, 'utf-8'));
        allPosts.push(...data.map(normalizeAuthorName));
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
export function getCachedBlogPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = getAllBlogPosts();
  }
  return cachedPosts;
}

/**
 * Get related posts for a given post, prioritizing same-category posts.
 * Returns lightweight post objects (content stripped) to minimize client payload.
 */
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 6
): BlogPost[] {
  const currentCategory = currentPost.categories[0];

  // Filter out current post
  const candidates = posts.filter((p) => p.id !== currentPost.id);

  // Prioritize same category
  const sameCategory = candidates.filter((p) =>
    p.categories.includes(currentCategory)
  );
  const other = candidates.filter(
    (p) => !p.categories.includes(currentCategory)
  );
  const sorted = [...sameCategory, ...other].slice(0, limit);

  // Strip content to keep RSC payload small
  return sorted.map((p) => ({
    ...p,
    content: '',
  }));
}

/**
 * Find a blog post by URL slug and category.
 * When category is provided, matches the full URI path to disambiguate
 * posts with the same slug in different categories (e.g. oklahoma).
 */
export function findPostBySlug(posts: BlogPost[], slug: string, category?: string): BlogPost | undefined {
  if (category) {
    // Match by WP category + slug
    const byCatSlug = posts.find((p) =>
      p.categories.some((c) => categoryToSlug(c) === category) && p.slug === slug
    );
    if (byCatSlug) return byCatSlug;
  }
  // Fallback: match by slug only
  return posts.find((p) => p.slug === slug);
}
