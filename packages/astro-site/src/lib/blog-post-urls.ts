import type { BlogPost } from './wordpress/types';

/**
 * Blog categories that live directly under their marketing pages
 * instead of under /blog/. Posts in these categories are served at
 * /{category}/{slug} rather than /blog/{category}/{slug}.
 */
export const STANDALONE_CATEGORIES = ['about-exp-realty', 'exp-realty-sponsor'];

/**
 * Convert a WordPress category name to a URL-safe slug
 * e.g. "About eXp Realty" -> "about-exp-realty"
 */
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/** All known category slugs (used to detect malformed customUri values) */
export const KNOWN_CATEGORY_SLUGS = [
  'about-exp-realty', 'exp-realty-sponsor', 'brokerage-comparison',
  'marketing-mastery', 'agent-career-info', 'winning-clients',
  'real-estate-schools', 'become-an-agent', 'industry-trends', 'fun-for-agents',
];

/**
 * Extract normalized category slug and post slug from a blog post.
 * Handles malformed customUri values by falling back to the post's category.
 */
export function getPostParts(post: BlogPost): { category: string; slug: string } {
  if (post.customUri) {
    const parts = post.customUri.split('/');
    const firstSegment = parts[0];
    if (KNOWN_CATEGORY_SLUGS.includes(firstSegment)) {
      return { category: firstSegment, slug: parts[parts.length - 1] };
    }
    // Malformed customUri - fall back to post's category
    return {
      category: categoryToSlug(post.categories[0] || 'uncategorized'),
      slug: parts[parts.length - 1] || post.slug,
    };
  }
  return {
    category: categoryToSlug(post.categories[0] || 'uncategorized'),
    slug: post.slug,
  };
}

/**
 * Build the canonical URL path for a blog post.
 * Posts in standalone categories get /{category}/{slug},
 * all others get /blog/{category}/{slug}.
 */
export function getPostUrl(post: BlogPost): string {
  let uri =
    post.customUri ||
    `${categoryToSlug(post.categories[0] || 'uncategorized')}/${post.slug}`;

  // Handle malformed customUri (e.g., "smartagentalliancecom/new-homes")
  const firstSegment = uri.split('/')[0];
  if (!KNOWN_CATEGORY_SLUGS.includes(firstSegment)) {
    const catSlug = categoryToSlug(post.categories[0] || 'uncategorized');
    const slug = uri.split('/').pop() || post.slug;
    uri = `${catSlug}/${slug}`;
  }

  if (STANDALONE_CATEGORIES.includes(uri.split('/')[0])) {
    return `/${uri}`;
  }

  return `/blog/${uri}`;
}
