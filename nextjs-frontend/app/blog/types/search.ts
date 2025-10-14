/**
 * Search Types
 * TypeScript interfaces for search functionality
 */

import type { BlogPost } from '@/lib/wordpress/types';

/**
 * Search API response structure
 */
export interface SearchResponse {
  results: BlogPost[];
  total: number;
  totalPages: number;
  query: string;
  category?: string;
  page: number;
  perPage: number;
}

/**
 * Search state for UI components
 */
export interface SearchState {
  query: string;
  results: BlogPost[];
  isLoading: boolean;
  error: string | null;
  total: number;
  isOpen: boolean;
}

/**
 * Search options for useSearch hook
 */
export interface SearchOptions {
  minQueryLength?: number;
  debounceMs?: number;
  category?: string;
  perPage?: number;
}
