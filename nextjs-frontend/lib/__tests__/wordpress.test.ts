/**
 * WordPress Client Test Suite
 *
 * Comprehensive tests for WordPress REST API client library
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  WordPressClient,
  wordpressClient,
  stripHTML,
  generateExcerpt,
  getImageUrl,
  getFeaturedImage,
  getAuthor,
  getCategories,
  getTags,
  type WPPage,
  type WPPost,
  type WPMedia,
  type WPCategory,
  type WPTag,
  type WPUser,
} from '../wordpress';

// ============================================================================
// Mock Data
// ============================================================================

const mockPage: WPPage = {
  id: 1,
  date: '2025-01-01T00:00:00',
  date_gmt: '2025-01-01T00:00:00',
  guid: { rendered: 'https://example.com/?page_id=1' },
  modified: '2025-01-01T00:00:00',
  modified_gmt: '2025-01-01T00:00:00',
  slug: 'about',
  status: 'publish',
  type: 'page',
  link: 'https://example.com/about',
  title: { rendered: 'About Us' },
  content: { rendered: '<p>About content</p>', protected: false },
  excerpt: { rendered: '<p>About excerpt</p>', protected: false },
  author: 1,
  featured_media: 123,
  parent: 0,
  menu_order: 0,
  comment_status: 'closed',
  ping_status: 'closed',
  template: '',
  meta: {},
};

const mockPost: WPPost = {
  id: 2,
  date: '2025-01-01T00:00:00',
  date_gmt: '2025-01-01T00:00:00',
  guid: { rendered: 'https://example.com/?p=2' },
  modified: '2025-01-01T00:00:00',
  modified_gmt: '2025-01-01T00:00:00',
  slug: 'test-post',
  status: 'publish',
  type: 'post',
  link: 'https://example.com/test-post',
  title: { rendered: 'Test Post' },
  content: { rendered: '<p>Post content</p>', protected: false },
  excerpt: { rendered: '<p>Post excerpt</p>', protected: false },
  author: 1,
  featured_media: 124,
  comment_status: 'open',
  ping_status: 'open',
  sticky: false,
  template: '',
  format: 'standard',
  meta: {},
  categories: [1],
  tags: [2, 3],
};

const mockMedia: WPMedia = {
  id: 123,
  date: '2025-01-01T00:00:00',
  date_gmt: '2025-01-01T00:00:00',
  guid: { rendered: 'https://example.com/wp-content/uploads/image.jpg' },
  modified: '2025-01-01T00:00:00',
  modified_gmt: '2025-01-01T00:00:00',
  slug: 'image',
  status: 'publish',
  type: 'attachment',
  link: 'https://example.com/image',
  title: { rendered: 'Test Image' },
  author: 1,
  comment_status: 'closed',
  ping_status: 'closed',
  template: '',
  meta: {},
  description: { rendered: 'Image description' },
  caption: { rendered: 'Image caption' },
  alt_text: 'Test image',
  media_type: 'image',
  mime_type: 'image/jpeg',
  media_details: {
    width: 1920,
    height: 1080,
    file: 'image.jpg',
    filesize: 250000,
    sizes: {
      thumbnail: {
        file: 'image-150x150.jpg',
        width: 150,
        height: 150,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/image-150x150.jpg',
      },
      medium: {
        file: 'image-300x169.jpg',
        width: 300,
        height: 169,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/image-300x169.jpg',
      },
      large: {
        file: 'image-1024x576.jpg',
        width: 1024,
        height: 576,
        mime_type: 'image/jpeg',
        source_url: 'https://example.com/wp-content/uploads/image-1024x576.jpg',
      },
    },
  },
  post: null,
  source_url: 'https://example.com/wp-content/uploads/image.jpg',
};

const mockUser: WPUser = {
  id: 1,
  name: 'Test User',
  url: 'https://example.com',
  description: 'Test user description',
  link: 'https://example.com/author/testuser',
  slug: 'testuser',
  avatar_urls: {
    '24': 'https://example.com/avatar-24.jpg',
    '48': 'https://example.com/avatar-48.jpg',
    '96': 'https://example.com/avatar-96.jpg',
  },
  meta: {},
};

const mockCategory: WPCategory = {
  id: 1,
  count: 5,
  description: 'Test category',
  link: 'https://example.com/category/test',
  name: 'Test Category',
  slug: 'test',
  taxonomy: 'category',
  parent: 0,
  meta: {},
};

const mockTag: WPTag = {
  id: 2,
  count: 3,
  description: 'Test tag',
  link: 'https://example.com/tag/test',
  name: 'Test Tag',
  slug: 'test-tag',
  taxonomy: 'post_tag',
  parent: 0,
  meta: {},
};

// ============================================================================
// Tests
// ============================================================================

describe('WordPressClient', () => {
  let client: WordPressClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new WordPressClient({
      baseUrl: 'https://test.com/wp-json/wp/v2',
      maxRetries: 2,
      retryDelay: 100,
      cache: true,
    });

    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
    client.clearCache();
  });

  // ==========================================================================
  // Pages API Tests
  // ==========================================================================

  describe('Pages API', () => {
    it('should fetch page by slug', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPage],
        headers: new Headers(),
      });

      const page = await client.getPageBySlug('about');

      expect(page).toEqual(mockPage);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('slug=about'),
        expect.any(Object)
      );
    });

    it('should return null when page not found', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const page = await client.getPageBySlug('nonexistent');
      expect(page).toBeNull();
    });

    it('should fetch page by ID', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPage,
        headers: new Headers(),
      });

      const page = await client.getPageById(1);
      expect(page).toEqual(mockPage);
    });

    it('should fetch all pages with pagination', async () => {
      const headers = new Headers();
      headers.set('X-WP-Total', '50');
      headers.set('X-WP-TotalPages', '5');

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPage],
        headers,
      });

      const response = await client.getAllPages({ per_page: 10, page: 1 });

      expect(response.data).toHaveLength(1);
      expect(response.pagination).toEqual({
        total: 50,
        totalPages: 5,
        page: 1,
        perPage: 10,
      });
    });
  });

  // ==========================================================================
  // Posts API Tests
  // ==========================================================================

  describe('Posts API', () => {
    it('should fetch post by slug', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPost],
        headers: new Headers(),
      });

      const post = await client.getPostBySlug('test-post');
      expect(post).toEqual(mockPost);
    });

    it('should fetch post by ID', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
        headers: new Headers(),
      });

      const post = await client.getPostById(2);
      expect(post).toEqual(mockPost);
    });

    it('should fetch posts with pagination', async () => {
      const headers = new Headers();
      headers.set('X-WP-Total', '25');
      headers.set('X-WP-TotalPages', '3');

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPost],
        headers,
      });

      const response = await client.getPosts({ per_page: 10, page: 1 });

      expect(response.data).toHaveLength(1);
      expect(response.pagination.total).toBe(25);
    });

    it('should fetch posts with category filter', async () => {
      const headers = new Headers();
      headers.set('X-WP-Total', '10');
      headers.set('X-WP-TotalPages', '1');

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPost],
        headers,
      });

      await client.getPosts({ categories: [1] });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('categories=1'),
        expect.any(Object)
      );
    });
  });

  // ==========================================================================
  // Media API Tests
  // ==========================================================================

  describe('Media API', () => {
    it('should fetch media by ID', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMedia,
        headers: new Headers(),
      });

      const media = await client.getMediaById(123);
      expect(media).toEqual(mockMedia);
    });

    it('should fetch multiple media by IDs', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockMedia],
        headers: new Headers(),
      });

      const mediaList = await client.getMediaByIds([123, 124]);
      expect(mediaList).toHaveLength(1);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('include=123,124'),
        expect.any(Object)
      );
    });

    it('should return empty array for empty IDs', async () => {
      const mediaList = await client.getMediaByIds([]);
      expect(mediaList).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Categories API Tests
  // ==========================================================================

  describe('Categories API', () => {
    it('should fetch category by ID', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategory,
        headers: new Headers(),
      });

      const category = await client.getCategoryById(1);
      expect(category).toEqual(mockCategory);
    });

    it('should fetch category by slug', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCategory],
        headers: new Headers(),
      });

      const category = await client.getCategoryBySlug('test');
      expect(category).toEqual(mockCategory);
    });
  });

  // ==========================================================================
  // Tags API Tests
  // ==========================================================================

  describe('Tags API', () => {
    it('should fetch tag by ID', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTag,
        headers: new Headers(),
      });

      const tag = await client.getTagById(2);
      expect(tag).toEqual(mockTag);
    });

    it('should fetch tag by slug', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTag],
        headers: new Headers(),
      });

      const tag = await client.getTagBySlug('test-tag');
      expect(tag).toEqual(mockTag);
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('should retry on failure', async () => {
      fetchMock
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage,
          headers: new Headers(),
        });

      const page = await client.getPageById(1);
      expect(page).toEqual(mockPage);
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));

      await expect(client.getPageById(1)).rejects.toThrow('Network error');
      expect(fetchMock).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should handle API error responses', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'rest_post_invalid_id',
          message: 'Invalid post ID.',
          data: { status: 404 },
        }),
        headers: new Headers(),
      });

      await expect(client.getPageById(999)).rejects.toThrow('Invalid post ID');
    });
  });

  // ==========================================================================
  // Cache Tests
  // ==========================================================================

  describe('Cache Management', () => {
    it('should cache responses', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPage,
        headers: new Headers(),
      });

      // First call
      await client.getPageById(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await client.getPageById(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should clear cache', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockPage,
        headers: new Headers(),
      });

      await client.getPageById(1);
      expect(client.getCacheSize()).toBeGreaterThan(0);

      client.clearCache();
      expect(client.getCacheSize()).toBe(0);

      await client.getPageById(1);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});

// ============================================================================
// Utility Functions Tests
// ============================================================================

describe('Utility Functions', () => {
  describe('stripHTML', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong></p>';
      expect(stripHTML(html)).toBe('Hello world');
    });

    it('should handle nested tags', () => {
      const html = '<div><p><span>Text</span></p></div>';
      expect(stripHTML(html)).toBe('Text');
    });
  });

  describe('generateExcerpt', () => {
    it('should generate excerpt from content', () => {
      const content = { rendered: '<p>This is a long piece of content that should be truncated</p>' };
      const excerpt = generateExcerpt(content, 20);
      expect(excerpt).toBe('This is a long piece...');
    });

    it('should not truncate short content', () => {
      const content = { rendered: '<p>Short</p>' };
      const excerpt = generateExcerpt(content, 20);
      expect(excerpt).toBe('Short');
    });
  });

  describe('getImageUrl', () => {
    it('should return preferred size URL', () => {
      const url = getImageUrl(mockMedia, 'medium');
      expect(url).toBe('https://example.com/wp-content/uploads/image-300x169.jpg');
    });

    it('should fallback to source_url', () => {
      const url = getImageUrl(mockMedia, 'nonexistent' as any);
      expect(url).toBe(mockMedia.source_url);
    });
  });

  describe('getFeaturedImage', () => {
    it('should extract featured image from embedded data', () => {
      const pageWithEmbed = {
        ...mockPage,
        _embedded: {
          'wp:featuredmedia': [mockMedia],
        },
      };

      const featuredImage = getFeaturedImage(pageWithEmbed);
      expect(featuredImage).toEqual(mockMedia);
    });

    it('should return null when no featured image', () => {
      const featuredImage = getFeaturedImage(mockPage);
      expect(featuredImage).toBeNull();
    });
  });

  describe('getAuthor', () => {
    it('should extract author from embedded data', () => {
      const pageWithEmbed = {
        ...mockPage,
        _embedded: {
          author: [mockUser],
        },
      };

      const author = getAuthor(pageWithEmbed);
      expect(author).toEqual(mockUser);
    });

    it('should return null when no author', () => {
      const author = getAuthor(mockPage);
      expect(author).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('should extract categories from embedded data', () => {
      const postWithEmbed = {
        ...mockPost,
        _embedded: {
          'wp:term': [[mockCategory], [mockTag]],
        },
      };

      const categories = getCategories(postWithEmbed);
      expect(categories).toHaveLength(1);
      expect(categories[0]).toEqual(mockCategory);
    });

    it('should return empty array when no categories', () => {
      const categories = getCategories(mockPost);
      expect(categories).toEqual([]);
    });
  });

  describe('getTags', () => {
    it('should extract tags from embedded data', () => {
      const postWithEmbed = {
        ...mockPost,
        _embedded: {
          'wp:term': [[mockCategory], [mockTag]],
        },
      };

      const tags = getTags(postWithEmbed);
      expect(tags).toHaveLength(1);
      expect(tags[0]).toEqual(mockTag);
    });

    it('should return empty array when no tags', () => {
      const tags = getTags(mockPost);
      expect(tags).toEqual([]);
    });
  });
});

describe('Singleton Instance', () => {
  it('should provide default client instance', () => {
    expect(wordpressClient).toBeInstanceOf(WordPressClient);
  });
});
