/**
 * WordPress Pages REST API Client
 * Fetches pages from WordPress for static generation
 * Uses React cache for build-time optimization
 */

import { cache } from 'react';
import type { WordPressPage, WordPressPageRaw } from './types';

// WordPress Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://wp.saabuildingblocks.com';
const WORDPRESS_USER = process.env.WORDPRESS_USER || '';
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';

/**
 * Creates Basic Auth header for WordPress API
 * @returns Base64 encoded authorization header or undefined if credentials not configured
 */
function createAuthHeader(): string | undefined {
  if (!WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    console.warn('⚠️ WordPress credentials not configured. Using public API access (published pages only).');
    return undefined;
  }
  const credentials = `${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

/**
 * Transforms WordPress API response to our WordPressPage type
 * @param page - Raw WordPress page object
 * @returns Transformed WordPressPage object
 */
function transformPage(page: WordPressPageRaw): WordPressPage {
  const embedded = page._embedded;
  const featuredMedia = embedded?.['wp:featuredmedia']?.[0];
  const author = embedded?.author?.[0];

  return {
    id: page.id,
    slug: page.slug,
    title: page.title.rendered,
    content: page.content.rendered,
    excerpt: page.excerpt.rendered,
    date: page.date,
    modified: page.modified,
    status: page.status,
    featuredImage: featuredMedia && featuredMedia.media_details ? {
      url: featuredMedia.source_url,
      alt: featuredMedia.alt_text || '',
      width: featuredMedia.media_details.width,
      height: featuredMedia.media_details.height,
    } : undefined,
    author: {
      name: author?.name || 'SAA',
      avatar: author?.avatar_urls?.['96'],
    },
    template: page.template || '',
    parent: page.parent,
    menuOrder: page.menu_order,
  };
}

/**
 * Fetches all published pages from WordPress
 * Cached for build-time optimization
 * @returns Array of WordPressPage objects
 * @throws Error if API request fails
 */
export const fetchAllPages = cache(async (): Promise<WordPressPage[]> => {
  try {
    const authHeader = createAuthHeader();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/pages?_embed&per_page=100&status=publish`,
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
        `WordPress Pages API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const pages: WordPressPageRaw[] = await response.json();
    const transformedPages = pages.map(transformPage);

    console.log(`✅ Fetched ${transformedPages.length} pages from WordPress`);

    return transformedPages;
  } catch (error) {
    console.error('❌ Error fetching WordPress pages:', error);
    throw error;
  }
});

/**
 * Fetches a single page by slug
 * Cached for build-time optimization
 * @param slug - Page slug to fetch
 * @returns WordPressPage object or null if not found
 */
export const fetchPageBySlug = cache(async (slug: string): Promise<WordPressPage | null> => {
  try {
    const authHeader = createAuthHeader();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`,
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
        `WordPress Pages API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const pages: WordPressPageRaw[] = await response.json();

    if (pages.length === 0) {
      console.warn(`⚠️ Page not found: ${slug}`);
      return null;
    }

    const page = transformPage(pages[0]);
    console.log(`✅ Fetched page: ${slug}`);
    return page;
  } catch (error) {
    console.error(`❌ Error fetching page ${slug}:`, error);
    return null;
  }
});

/**
 * Fetches a single page by ID
 * Cached for build-time optimization
 * @param id - WordPress page ID
 * @returns WordPressPage object or null if not found
 */
export const fetchPageById = cache(async (id: number): Promise<WordPressPage | null> => {
  try {
    const authHeader = createAuthHeader();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/pages/${id}?_embed`,
      {
        headers,
        next: {
          revalidate: process.env.NODE_ENV === 'development' ? 300 : false
        },
      } as RequestInit & { next?: { revalidate: number | false } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`⚠️ Page not found: ${id}`);
        return null;
      }
      const errorText = await response.text();
      throw new Error(
        `WordPress Pages API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const page: WordPressPageRaw = await response.json();
    const transformedPage = transformPage(page);

    console.log(`✅ Fetched page ID: ${id}`);
    return transformedPage;
  } catch (error) {
    console.error(`❌ Error fetching page ID ${id}:`, error);
    return null;
  }
});

/**
 * Fetches child pages of a parent page
 * @param parentId - Parent page ID
 * @returns Array of child WordPressPage objects
 */
export const fetchChildPages = cache(async (parentId: number): Promise<WordPressPage[]> => {
  try {
    const allPages = await fetchAllPages();
    return allPages
      .filter(page => page.parent === parentId)
      .sort((a, b) => a.menuOrder - b.menuOrder);
  } catch (error) {
    console.error(`❌ Error fetching child pages for parent ${parentId}:`, error);
    return [];
  }
});

/**
 * Checks if WordPress Pages API is configured
 * @returns Boolean indicating if credentials are set
 */
export function isWordPressPagesConfigured(): boolean {
  return !!(WORDPRESS_USER && WORDPRESS_APP_PASSWORD);
}
