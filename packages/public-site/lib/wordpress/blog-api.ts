/**
 * WordPress Blog API - Custom SAA Endpoint
 * Fetches blog posts from the custom /wp-json/saa/v1/blog/posts endpoint
 * Supports pagination and filtering
 */

import { cache } from 'react';
import type { BlogPost } from './types';

// WordPress Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://wp.saabuildingblocks.com';

/**
 * Response type from the SAA custom blog endpoint
 */
interface SAABlogResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Options for fetching blog posts
 */
export interface FetchBlogPostsOptions {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
}

/**
 * Fetches blog posts from the SAA custom WordPress API endpoint
 * Uses the /wp-json/saa/v1/blog/posts endpoint with pagination
 *
 * @param options - Pagination and filtering options
 * @returns Object with posts array and pagination metadata
 *
 * @example
 * const { posts, pagination } = await fetchBlogPosts({ page: 1, per_page: 9 });
 */
export const fetchBlogPosts = cache(async (
  options: FetchBlogPostsOptions = {}
): Promise<SAABlogResponse> => {
  try {
    const {
      page = 1,
      per_page = 9,
      category,
      search
    } = options;

    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });

    if (category) {
      params.set('category', category);
    }

    if (search) {
      params.set('search', search);
    }

    const url = `${WORDPRESS_URL}/wp-json/saa/v1/blog/posts?${params}`;

    console.log(`🔍 Fetching blog posts from SAA API: ${url}`);

    const response = await fetch(url, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 60 : 300
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SAA Blog API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data: SAABlogResponse = await response.json();

    console.log(
      `✅ Fetched ${data.posts.length} posts (page ${data.pagination.page}/${data.pagination.total_pages})`
    );

    return data;
  } catch (error) {
    console.error('❌ Error fetching blog posts from SAA API:', error);

    // Return empty result on error
    return {
      posts: [],
      pagination: {
        page: 1,
        per_page: options.per_page || 9,
        total: 0,
        total_pages: 0,
      },
    };
  }
});

/**
 * Gets the total number of pages available
 * @param per_page - Number of posts per page
 * @param category - Optional category filter
 * @returns Total number of pages
 */
export const getTotalPages = cache(async (
  per_page: number = 9,
  category?: string
): Promise<number> => {
  const { pagination } = await fetchBlogPosts({ page: 1, per_page, category });
  return pagination.total_pages;
});

/**
 * Validates if a page number is within valid range
 * @param page - Page number to validate
 * @param per_page - Posts per page
 * @param category - Optional category filter
 * @returns True if page is valid
 */
export const isValidPage = cache(async (
  page: number,
  per_page: number = 9,
  category?: string
): Promise<boolean> => {
  if (page < 1) return false;
  const totalPages = await getTotalPages(per_page, category);
  return page <= totalPages;
});
