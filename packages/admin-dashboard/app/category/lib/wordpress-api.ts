/**
 * WordPress REST API Utilities
 * Phase 7.4: Component Implementation
 *
 * API functions for fetching WordPress data:
 * - Posts by category
 * - Error handling
 * - Type-safe responses
 */

import type { WordPressPost, FetchPostsOptions, WordPressAPIError } from '../types';

/**
 * WordPress API base URL
 * Uses environment variable with fallback
 */
const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://saabuildingblocks.com/wp-json/wp/v2';

/**
 * WordPress API Error Class
 */
export class WordPressError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500) {
    super(message);
    this.name = 'WordPressError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Fetch posts by category ID
 *
 * @param categoryId - WordPress category ID
 * @param options - Fetch options (pagination, ordering, embed)
 * @returns Promise<WordPressPost[]>
 * @throws WordPressError if API request fails
 *
 * @example
 * ```typescript
 * const posts = await fetchPostsByCategory(1641, {
 *   per_page: 200,
 *   _embed: true
 * });
 * ```
 */
export async function fetchPostsByCategory(
  categoryId: number,
  options: FetchPostsOptions = {}
): Promise<WordPressPost[]> {
  const {
    per_page = 200,
    page = 1,
    _embed = true,
    order = 'desc',
    orderby = 'date'
  } = options;

  // Build query parameters
  const params = new URLSearchParams({
    categories: categoryId.toString(),
    per_page: per_page.toString(),
    page: page.toString(),
    order,
    orderby,
    ..._embed && { _embed: 'true' }
  });

  const url = `${WP_API_BASE}/posts?${params.toString()}`;

  try {
    const response = await fetch(url, {
      // Revalidate every 5 minutes (ISR)
      next: { revalidate: 300 }
    });

    // Handle HTTP errors
    if (!response.ok) {
      // Try to parse WordPress error response
      try {
        const errorData: WordPressAPIError = await response.json();
        throw new WordPressError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 'HTTP_ERROR',
          response.status
        );
      } catch (parseError) {
        // If JSON parsing fails, throw generic error
        throw new WordPressError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }
    }

    // Parse successful response
    const posts: WordPressPost[] = await response.json();
    return posts;

  } catch (error) {
    // Re-throw WordPressError as-is
    if (error instanceof WordPressError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new WordPressError(
        'Network error: Unable to connect to WordPress API',
        'NETWORK_ERROR',
        0
      );
    }

    // Handle unknown errors
    throw new WordPressError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR',
      500
    );
  }
}

/**
 * Fetch all posts for a category (handles pagination automatically)
 *
 * @param categoryId - WordPress category ID
 * @param maxPosts - Maximum number of posts to fetch (default: 1000)
 * @returns Promise<WordPressPost[]>
 * @throws WordPressError if API request fails
 *
 * @example
 * ```typescript
 * const allPosts = await fetchAllPostsByCategory(1641);
 * ```
 */
export async function fetchAllPostsByCategory(
  categoryId: number,
  maxPosts: number = 1000
): Promise<WordPressPost[]> {
  const allPosts: WordPressPost[] = [];
  let page = 1;
  const perPage = 100; // WordPress max per page

  while (allPosts.length < maxPosts) {
    const posts = await fetchPostsByCategory(categoryId, {
      per_page: perPage,
      page,
      _embed: true
    });

    // No more posts
    if (posts.length === 0) {
      break;
    }

    allPosts.push(...posts);

    // Reached max posts
    if (allPosts.length >= maxPosts) {
      return allPosts.slice(0, maxPosts);
    }

    // Last page (fewer posts than perPage)
    if (posts.length < perPage) {
      break;
    }

    page++;
  }

  return allPosts;
}

/**
 * Validate WordPress API connection
 *
 * @returns Promise<boolean> - true if connection successful
 *
 * @example
 * ```typescript
 * const isConnected = await validateWordPressConnection();
 * ```
 */
export async function validateWordPressConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts?per_page=1`, {
      next: { revalidate: 0 } // No cache for validation
    });
    return response.ok;
  } catch {
    return false;
  }
}
