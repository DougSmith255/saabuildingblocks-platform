/**
 * WordPress API Client
 * Export all WordPress-related functions and types
 */

export {
  fetchAllPosts,
  fetchPostBySlug,
  fetchPostsByCategory,
  fetchCategories,
  getAllowedCategories,
  isWordPressConfigured,
} from './api';

export type {
  BlogPost,
  WordPressPost,
  WordPressAPIError,
} from './types';

export type { CategoryWithCount } from './api';

// Re-export for convenience
export { type CategoryWithCount as Category } from './api';
