/**
 * WordPress REST API Client
 * Fetches blog posts from WordPress with Basic Auth
 * Uses React cache for build-time optimization
 */

import { cache } from 'react';
import type { BlogPost, WordPressPost } from './types';

// WordPress Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://wp.saabuildingblocks.com';
const WORDPRESS_USER = process.env.WORDPRESS_USER || '';
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';

// Allowed Category Slugs (12 categories total)
// Phase 7 category template categories
const ALLOWED_CATEGORIES = [
  'best-brokerage',
  'become-an-agent',
  'brokerage-comparison',
  'industry-trends',
  'marketing-mastery',
  'winning-clients',
  'fun-for-agents',
  'exp-realty-sponsor',
  'agent-career-info',
  'about-exp',
  'getting-license',
  'best-school'
] as const;

/**
 * Creates Basic Auth header for WordPress API
 * @returns Base64 encoded authorization header or undefined if credentials not configured
 *
 * Note: WordPress API is publicly accessible for reading published posts.
 * Authentication is only needed for accessing drafts or private content.
 */
function createAuthHeader(): string | undefined {
  if (!WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    console.warn('⚠️ WordPress credentials not configured. Using public API access (published posts only).');
    return undefined;
  }
  const credentials = `${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

/**
 * Transforms WordPress API response to our BlogPost type
 * @param post - Raw WordPress post object
 * @returns Transformed BlogPost object
 */
function transformPost(post: WordPressPost): BlogPost {
  const embedded = post._embedded;
  const featuredMedia = embedded?.['wp:featuredmedia']?.[0];
  const categories = embedded?.['wp:term']?.[0]?.map(cat => cat.slug) || [];
  const author = embedded?.author?.[0];

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    modified: post.modified,
    featuredImage: featuredMedia ? {
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || '',
      width: featuredMedia.media_details.width,
      height: featuredMedia.media_details.height,
    } : undefined,
    author: {
      name: author?.name || 'SAA',
      avatar: author?.avatar_urls?.['96'],
    },
    categories,
  };
}

/**
 * Fetches all published posts from WordPress
 * Cached for build-time optimization
 * @returns Array of BlogPost objects filtered by allowed categories
 * @throws Error if API request fails
 */
export const fetchAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const authHeader = createAuthHeader();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=100&status=publish`,
      {
        headers,
        next: {
          revalidate: process.env.NODE_ENV === 'development' ? 300 : false
        },
      } as RequestInit & { next?: { revalidate: number | false } }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const posts: WordPressPost[] = await response.json();

    // Transform and filter by allowed categories
    const transformedPosts = posts
      .map(transformPost)
      .filter(post => post.categories.some(cat => ALLOWED_CATEGORIES.includes(cat as any)));

    console.log(`✅ Fetched ${transformedPosts.length} posts from WordPress (${posts.length} total)`);

    return transformedPosts;
  } catch (error) {
    console.error('❌ Error fetching WordPress posts:', error);
    throw error;
  }
});

/**
 * Fetches a single post by slug
 * Cached for build-time optimization
 * @param slug - Post slug to fetch
 * @returns BlogPost object or null if not found
 */
export const fetchPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const authHeader = createAuthHeader();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        headers,
        next: {
          revalidate: process.env.NODE_ENV === 'development' ? 300 : false
        },
      } as RequestInit & { next?: { revalidate: number | false } }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const posts: WordPressPost[] = await response.json();

    if (posts.length === 0) {
      console.warn(`⚠️ Post not found: ${slug}`);
      return null;
    }

    const post = transformPost(posts[0]);

    // Verify post is in allowed categories
    if (!post.categories.some(cat => ALLOWED_CATEGORIES.includes(cat as any))) {
      console.warn(`⚠️ Post ${slug} not in allowed categories`);
      return null;
    }

    console.log(`✅ Fetched post: ${slug}`);
    return post;
  } catch (error) {
    console.error(`❌ Error fetching post ${slug}:`, error);
    return null;
  }
});

/**
 * Fetches posts by category slug
 * @param categorySlug - Category slug to filter by
 * @returns Array of BlogPost objects in that category
 */
export const fetchPostsByCategory = cache(async (categorySlug: string): Promise<BlogPost[]> => {
  if (!ALLOWED_CATEGORIES.includes(categorySlug as any)) {
    console.warn(`⚠️ Category not allowed: ${categorySlug}`);
    return [];
  }

  const allPosts = await fetchAllPosts();
  return allPosts.filter(post => post.categories.includes(categorySlug));
});

/**
 * Gets list of allowed categories
 * @returns Array of allowed category slugs
 */
export function getAllowedCategories(): readonly string[] {
  return ALLOWED_CATEGORIES;
}

/**
 * Checks if WordPress API is configured
 * @returns Boolean indicating if credentials are set
 */
export function isWordPressConfigured(): boolean {
  return !!(WORDPRESS_USER && WORDPRESS_APP_PASSWORD);
}

/**
 * Fetches related posts from the same category
 * Cached for build-time optimization
 * @param categoryId - WordPress category ID (not used, we use slug instead)
 * @param currentPostId - Current post ID to exclude
 * @param limit - Maximum number of posts to return (default 4)
 * @returns Array of BlogPost objects from same category
 */
export const fetchRelatedPosts = cache(async (
  categoryId: number,
  currentPostId: number,
  limit: number = 4
): Promise<BlogPost[]> => {
  try {
    // Fetch all posts first
    const allPosts = await fetchAllPosts();

    // Get current post to find its categories
    const currentPost = allPosts.find(p => p.id === currentPostId);

    if (!currentPost) {
      console.warn(`⚠️ Current post ${currentPostId} not found for related posts`);
      return [];
    }

    // Filter posts:
    // 1. Exclude current post
    // 2. Prioritize posts from same categories
    // 3. Limit results
    const relatedPosts = allPosts
      .filter(p => p.id !== currentPostId)
      .filter(p => {
        // Check if post shares any category with current post
        return p.categories.some(cat => currentPost.categories.includes(cat));
      })
      .slice(0, limit);

    // If not enough posts from same category, fill with other posts
    if (relatedPosts.length < limit) {
      const otherPosts = allPosts
        .filter(p => p.id !== currentPostId)
        .filter(p => !relatedPosts.some(rp => rp.id === p.id))
        .slice(0, limit - relatedPosts.length);

      relatedPosts.push(...otherPosts);
    }

    console.log(`✅ Fetched ${relatedPosts.length} related posts for post ${currentPostId}`);
    return relatedPosts;
  } catch (error) {
    console.error(`❌ Error fetching related posts for ${currentPostId}:`, error);
    return [];
  }
});

/**
 * Search posts by query string
 * Uses WordPress REST API search endpoint with full-text search
 * @param query - Search query string
 * @param options - Optional search filters
 * @returns Search results with pagination metadata
 */
export const searchPosts = cache(async (
  query: string,
  options?: {
    categories?: string[];
    orderBy?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
    page?: number;
    perPage?: number;
  }
): Promise<{
  results: BlogPost[];
  total: number;
  totalPages: number;
}> => {
  try {
    // Validate query
    if (!query || query.length < 2) {
      return { results: [], total: 0, totalPages: 0 };
    }

    const authHeader = createAuthHeader();
    const {
      categories = [],
      orderBy = 'relevance',
      order = 'desc',
      page = 1,
      perPage = 20
    } = options || {};

    // Build query params
    const params = new URLSearchParams({
      search: query,
      _embed: 'true',
      per_page: perPage.toString(),
      page: page.toString(),
      orderby: orderBy,
      status: 'publish',
    });

    // Add order parameter (except for relevance)
    if (orderBy !== 'relevance') {
      params.set('order', order);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?${params}`,
      {
        headers,
        next: {
          revalidate: 60 // Cache search results for 1 minute
        },
      } as RequestInit & { next?: { revalidate: number } }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const posts: WordPressPost[] = await response.json();
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

    // Transform posts
    let results = posts.map(transformPost);

    // Filter by allowed categories
    results = results.filter(p =>
      p.categories.some(cat => ALLOWED_CATEGORIES.includes(cat as any))
    );

    // Client-side category filter if specified
    if (categories.length > 0) {
      const validCategories = categories.filter(c => ALLOWED_CATEGORIES.includes(c as any));
      if (validCategories.length > 0) {
        results = results.filter(p =>
          p.categories.some(cat => validCategories.includes(cat))
        );
      }
    }

    console.log(`✅ Search "${query}": ${results.length} results (${total} total before filtering)`);

    return { results, total: results.length, totalPages: Math.ceil(results.length / perPage) };
  } catch (error) {
    console.error(`❌ Search error:`, error);
    return { results: [], total: 0, totalPages: 0 };
  }
});
