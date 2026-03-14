import type { BlogPost } from '@/lib/wordpress/types';

/**
 * Blog categories that live directly under their marketing pages
 * instead of under /blog/. Posts in these categories are served at
 * /{category}/{slug} rather than /blog/{category}/{slug}.
 */
export const STANDALONE_CATEGORIES = ['about-exp-realty', 'exp-realty-sponsor'];

/**
 * Convert a WordPress category name to a URL-safe slug
 * e.g. "About eXp Realty" → "about-exp-realty"
 */
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Build the canonical URL path for a blog post.
 * Posts in standalone categories get /{category}/{slug},
 * all others get /blog/{category}/{slug}.
 */
export function getPostUrl(post: BlogPost): string {
  const uri =
    post.customUri ||
    `${categoryToSlug(post.categories[0] || 'uncategorized')}/${post.slug}`;

  // Check if the first segment is a standalone category
  const firstSegment = uri.split('/')[0];
  if (STANDALONE_CATEGORIES.includes(firstSegment)) {
    return `/${uri}`;
  }

  return `/blog/${uri}`;
}
