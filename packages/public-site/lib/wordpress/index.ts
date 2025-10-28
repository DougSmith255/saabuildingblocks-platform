/**
 * WordPress API Client
 * Export all WordPress-related functions and types
 */

export {
  fetchAllPosts,
  fetchPostBySlug,
  fetchPostsByCategory,
  getAllowedCategories,
  isWordPressConfigured,
} from './api';

export type {
  BlogPost,
  WordPressPost,
  WordPressAPIError,
} from './types';
