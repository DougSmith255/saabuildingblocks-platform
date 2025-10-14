/**
 * WordPress REST API Client
 *
 * A type-safe client library for interacting with WordPress REST API.
 * Supports pages, posts, media, categories, and tags with built-in
 * error handling, retries, and caching for static site generation.
 *
 * @module lib/wordpress
 * @see https://developer.wordpress.org/rest-api/reference/
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * WordPress page response from REST API
 */
export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: Record<string, any>;
  acf?: Record<string, any>; // Advanced Custom Fields support
  _embedded?: {
    author?: WPUser[];
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
}

/**
 * WordPress post response from REST API
 */
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  acf?: Record<string, any>;
  _embedded?: {
    author?: WPUser[];
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
}

/**
 * WordPress media/attachment response from REST API
 */
export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: Record<string, any>;
  description: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: 'image' | 'file' | 'video' | 'audio';
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    filesize?: number;
    sizes?: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
    image_meta?: Record<string, any>;
  };
  post: number | null;
  source_url: string;
}

/**
 * WordPress user response from REST API
 */
export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [size: string]: string;
  };
  meta: Record<string, any>;
}

/**
 * WordPress category/tag response from REST API
 */
export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag' | string;
  parent: number;
  meta: Record<string, any>;
}

/**
 * WordPress category response from REST API
 */
export interface WPCategory extends WPTerm {
  taxonomy: 'category';
}

/**
 * WordPress tag response from REST API
 */
export interface WPTag extends WPTerm {
  taxonomy: 'post_tag';
}

/**
 * Pagination information from WordPress API headers
 */
export interface WPPagination {
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

/**
 * Paginated response wrapper
 */
export interface WPPaginatedResponse<T> {
  data: T[];
  pagination: WPPagination;
}

/**
 * WordPress API error response
 */
export interface WPError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}

/**
 * Client configuration options
 */
export interface WordPressClientConfig {
  baseUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  cache?: boolean;
  cacheMaxAge?: number;
}

/**
 * Query parameters for WordPress API requests
 */
export interface WPQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  author?: number;
  author_exclude?: number[];
  before?: string;
  after?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string | string[];
  status?: string;
  categories?: number[];
  categories_exclude?: number[];
  tags?: number[];
  tags_exclude?: number[];
  sticky?: boolean;
  _embed?: boolean;
  [key: string]: any;
}

// ============================================================================
// WordPress Client Class
// ============================================================================

/**
 * WordPress REST API Client
 *
 * Provides type-safe methods for interacting with WordPress REST API endpoints.
 * Includes automatic retries, error handling, and caching for optimal performance
 * with Next.js static generation and ISR.
 *
 * @example
 * ```typescript
 * const wp = new WordPressClient({
 *   baseUrl: 'https://example.com/wp-json/wp/v2',
 *   maxRetries: 3,
 *   cache: true
 * });
 *
 * // Fetch a page by slug
 * const page = await wp.getPageBySlug('about');
 *
 * // Fetch posts with pagination
 * const { data: posts, pagination } = await wp.getPosts({ per_page: 10, page: 1 });
 * ```
 */
export class WordPressClient {
  private baseUrl: string;
  private maxRetries: number;
  private retryDelay: number;
  private timeout: number;
  private cache: boolean;
  private cacheMaxAge: number;
  private memoryCache: Map<string, { data: any; timestamp: number }>;

  /**
   * Creates a new WordPress API client
   *
   * @param config - Client configuration options
   */
  constructor(config: WordPressClientConfig = {}) {
    this.baseUrl = config.baseUrl || process.env['WORDPRESS_API_URL'] || 'https://saabuildingblocks.com/wp-json/wp/v2';
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
    this.timeout = config.timeout ?? 10000;
    this.cache = config.cache ?? true;
    this.cacheMaxAge = config.cacheMaxAge ?? 3600000; // 1 hour default
    this.memoryCache = new Map();
  }

  // ==========================================================================
  // Core Request Methods
  // ==========================================================================

  /**
   * Makes a request to the WordPress API with retry logic
   *
   * @param endpoint - API endpoint (without base URL)
   * @param params - Query parameters
   * @param retryCount - Current retry attempt
   * @returns API response data
   * @throws {Error} When all retry attempts fail
   *
   * @private
   */
  private async request<T>(
    endpoint: string,
    params: WPQueryParams = {},
    retryCount = 0
  ): Promise<T> {
    const cacheKey = `${endpoint}?${JSON.stringify(params)}`;

    // Check memory cache
    if (this.cache) {
      const cached = this.memoryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheMaxAge) {
        return cached.data as T;
      }
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        // Enable Next.js ISR caching
        next: {
          revalidate: this.cacheMaxAge / 1000, // Convert to seconds
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: WPError = await response.json();
        throw new Error(`WordPress API Error: ${error.message} (${error.code})`);
      }

      const data = await response.json();

      // Cache the response
      if (this.cache) {
        this.memoryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data as T;
    } catch (error) {
      // Retry logic
      if (retryCount < this.maxRetries) {
        await this.sleep(this.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, params, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Makes a paginated request to the WordPress API
   *
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Paginated response with data and pagination info
   *
   * @private
   */
  private async requestPaginated<T>(
    endpoint: string,
    params: WPQueryParams = {}
  ): Promise<WPPaginatedResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: this.cacheMaxAge / 1000,
      },
    });

    if (!response.ok) {
      const error: WPError = await response.json();
      throw new Error(`WordPress API Error: ${error.message} (${error.code})`);
    }

    const data = await response.json();
    const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    return {
      data: data as T[],
      pagination: {
        total,
        totalPages,
        page: params.page || 1,
        perPage: params.per_page || 10,
      },
    };
  }

  /**
   * Utility method to sleep for a specified duration
   *
   * @param ms - Milliseconds to sleep
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // Pages API
  // ==========================================================================

  /**
   * Fetches a WordPress page by slug
   *
   * @param slug - Page slug
   * @param embed - Include embedded resources (author, featured media)
   * @returns WordPress page or null if not found
   * @throws {Error} When API request fails
   *
   * @example
   * ```typescript
   * const page = await wp.getPageBySlug('about');
   * console.log(page?.title.rendered);
   * ```
   */
  async getPageBySlug(slug: string, embed = true): Promise<WPPage | null> {
    const pages = await this.request<WPPage[]>('/pages', {
      slug,
      _embed: embed,
    });

    return pages.length > 0 ? (pages[0] ?? null) : null;
  }

  /**
   * Fetches a WordPress page by ID
   *
   * @param id - Page ID
   * @param embed - Include embedded resources
   * @returns WordPress page
   * @throws {Error} When page not found or API request fails
   */
  async getPageById(id: number, embed = true): Promise<WPPage> {
    return this.request<WPPage>(`/pages/${id}`, {
      _embed: embed,
    });
  }

  /**
   * Fetches all WordPress pages
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with pages
   * @throws {Error} When API request fails
   *
   * @example
   * ```typescript
   * const { data: pages, pagination } = await wp.getAllPages({ per_page: 20 });
   * ```
   */
  async getAllPages(params: WPQueryParams = {}): Promise<WPPaginatedResponse<WPPage>> {
    return this.requestPaginated<WPPage>('/pages', {
      _embed: true,
      per_page: 100,
      ...params,
    });
  }

  // ==========================================================================
  // Posts API
  // ==========================================================================

  /**
   * Fetches a WordPress post by slug
   *
   * @param slug - Post slug
   * @param embed - Include embedded resources
   * @returns WordPress post or null if not found
   * @throws {Error} When API request fails
   */
  async getPostBySlug(slug: string, embed = true): Promise<WPPost | null> {
    const posts = await this.request<WPPost[]>('/posts', {
      slug,
      _embed: embed,
    });

    return posts.length > 0 ? (posts[0] ?? null) : null;
  }

  /**
   * Fetches a WordPress post by ID
   *
   * @param id - Post ID
   * @param embed - Include embedded resources
   * @returns WordPress post
   * @throws {Error} When post not found or API request fails
   */
  async getPostById(id: number, embed = true): Promise<WPPost> {
    return this.request<WPPost>(`/posts/${id}`, {
      _embed: embed,
    });
  }

  /**
   * Fetches WordPress posts with pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with posts
   * @throws {Error} When API request fails
   *
   * @example
   * ```typescript
   * const { data: posts, pagination } = await wp.getPosts({
   *   per_page: 10,
   *   page: 1,
   *   categories: [5],
   *   orderby: 'date',
   *   order: 'desc'
   * });
   * ```
   */
  async getPosts(params: WPQueryParams = {}): Promise<WPPaginatedResponse<WPPost>> {
    return this.requestPaginated<WPPost>('/posts', {
      _embed: true,
      per_page: 10,
      ...params,
    });
  }

  /**
   * Fetches all WordPress posts (for static generation)
   *
   * @param params - Query parameters
   * @returns All posts across all pages
   * @throws {Error} When API request fails
   */
  async getAllPosts(params: WPQueryParams = {}): Promise<WPPost[]> {
    const allPosts: WPPost[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getPosts({
        ...params,
        page,
        per_page: 100,
      });

      allPosts.push(...response.data);
      hasMore = page < response.pagination.totalPages;
      page++;
    }

    return allPosts;
  }

  // ==========================================================================
  // Media API
  // ==========================================================================

  /**
   * Fetches WordPress media/attachment by ID
   *
   * @param id - Media ID
   * @returns WordPress media object
   * @throws {Error} When media not found or API request fails
   *
   * @example
   * ```typescript
   * const media = await wp.getMediaById(123);
   * console.log(media.source_url);
   * ```
   */
  async getMediaById(id: number): Promise<WPMedia> {
    return this.request<WPMedia>(`/media/${id}`);
  }

  /**
   * Fetches multiple media items by IDs
   *
   * @param ids - Array of media IDs
   * @returns Array of media objects
   * @throws {Error} When API request fails
   */
  async getMediaByIds(ids: number[]): Promise<WPMedia[]> {
    if (ids.length === 0) return [];

    const response = await this.request<WPMedia[]>('/media', {
      include: ids,
      per_page: 100,
    });

    return response;
  }

  // ==========================================================================
  // Categories API
  // ==========================================================================

  /**
   * Fetches all WordPress categories
   *
   * @param params - Query parameters
   * @returns Paginated response with categories
   * @throws {Error} When API request fails
   */
  async getCategories(params: WPQueryParams = {}): Promise<WPPaginatedResponse<WPCategory>> {
    return this.requestPaginated<WPCategory>('/categories', {
      per_page: 100,
      ...params,
    });
  }

  /**
   * Fetches a category by ID
   *
   * @param id - Category ID
   * @returns WordPress category
   * @throws {Error} When category not found or API request fails
   */
  async getCategoryById(id: number): Promise<WPCategory> {
    return this.request<WPCategory>(`/categories/${id}`);
  }

  /**
   * Fetches a category by slug
   *
   * @param slug - Category slug
   * @returns WordPress category or null if not found
   * @throws {Error} When API request fails
   */
  async getCategoryBySlug(slug: string): Promise<WPCategory | null> {
    const categories = await this.request<WPCategory[]>('/categories', { slug });
    return categories.length > 0 ? (categories[0] ?? null) : null;
  }

  // ==========================================================================
  // Tags API
  // ==========================================================================

  /**
   * Fetches all WordPress tags
   *
   * @param params - Query parameters
   * @returns Paginated response with tags
   * @throws {Error} When API request fails
   */
  async getTags(params: WPQueryParams = {}): Promise<WPPaginatedResponse<WPTag>> {
    return this.requestPaginated<WPTag>('/tags', {
      per_page: 100,
      ...params,
    });
  }

  /**
   * Fetches a tag by ID
   *
   * @param id - Tag ID
   * @returns WordPress tag
   * @throws {Error} When tag not found or API request fails
   */
  async getTagById(id: number): Promise<WPTag> {
    return this.request<WPTag>(`/tags/${id}`);
  }

  /**
   * Fetches a tag by slug
   *
   * @param slug - Tag slug
   * @returns WordPress tag or null if not found
   * @throws {Error} When API request fails
   */
  async getTagBySlug(slug: string): Promise<WPTag | null> {
    const tags = await this.request<WPTag[]>('/tags', { slug });
    return tags.length > 0 ? (tags[0] ?? null) : null;
  }

  // ==========================================================================
  // Users API
  // ==========================================================================

  /**
   * Fetches a WordPress user by ID
   *
   * @param id - User ID
   * @returns WordPress user
   * @throws {Error} When user not found or API request fails
   */
  async getUserById(id: number): Promise<WPUser> {
    return this.request<WPUser>(`/users/${id}`);
  }

  /**
   * Fetches all WordPress users
   *
   * @param params - Query parameters
   * @returns Paginated response with users
   * @throws {Error} When API request fails
   */
  async getUsers(params: WPQueryParams = {}): Promise<WPPaginatedResponse<WPUser>> {
    return this.requestPaginated<WPUser>('/users', {
      per_page: 100,
      ...params,
    });
  }

  // ==========================================================================
  // Cache Management
  // ==========================================================================

  /**
   * Clears the memory cache
   */
  clearCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Removes a specific item from cache
   *
   * @param endpoint - API endpoint
   * @param params - Query parameters
   */
  clearCacheItem(endpoint: string, params: WPQueryParams = {}): void {
    const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
    this.memoryCache.delete(cacheKey);
  }

  /**
   * Gets current cache size
   *
   * @returns Number of cached items
   */
  getCacheSize(): number {
    return this.memoryCache.size;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default WordPress client instance
 *
 * @example
 * ```typescript
 * import { wordpressClient } from '@/lib/wordpress';
 *
 * const page = await wordpressClient.getPageBySlug('about');
 * ```
 */
export const wordpressClient = new WordPressClient();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extracts plain text from WordPress HTML content
 *
 * @param html - HTML content from WordPress
 * @returns Plain text with HTML tags removed
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generates excerpt from WordPress content
 *
 * @param content - WordPress content object
 * @param length - Maximum character length
 * @returns Excerpt text
 */
export function generateExcerpt(content: { rendered: string }, length = 160): string {
  const text = stripHTML(content.rendered);
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Gets optimal image size from WordPress media
 *
 * @param media - WordPress media object
 * @param preferredSize - Preferred size key (medium, large, full, etc.)
 * @returns Image URL
 */
export function getImageUrl(media: WPMedia, preferredSize = 'large'): string {
  if (media.media_details?.sizes?.[preferredSize]) {
    return media.media_details.sizes[preferredSize].source_url;
  }
  return media.source_url;
}

/**
 * Extracts featured image from embedded data
 *
 * @param item - WordPress page or post with embedded data
 * @returns Featured media object or null
 */
export function getFeaturedImage(item: WPPage | WPPost): WPMedia | null {
  if (item._embedded && item._embedded['wp:featuredmedia']) {
    return item._embedded['wp:featuredmedia'][0] || null;
  }
  return null;
}

/**
 * Extracts author from embedded data
 *
 * @param item - WordPress page or post with embedded data
 * @returns Author object or null
 */
export function getAuthor(item: WPPage | WPPost): WPUser | null {
  if (item._embedded && item._embedded.author) {
    return item._embedded.author[0] || null;
  }
  return null;
}

/**
 * Extracts categories from embedded data
 *
 * @param post - WordPress post with embedded data
 * @returns Array of category objects
 */
export function getCategories(post: WPPost): WPCategory[] {
  if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]) {
    return post._embedded['wp:term'][0].filter(
      (term): term is WPCategory => term.taxonomy === 'category'
    );
  }
  return [];
}

/**
 * Extracts tags from embedded data
 *
 * @param post - WordPress post with embedded data
 * @returns Array of tag objects
 */
export function getTags(post: WPPost): WPTag[] {
  if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][1]) {
    return post._embedded['wp:term'][1].filter(
      (term): term is WPTag => term.taxonomy === 'post_tag'
    );
  }
  return [];
}
