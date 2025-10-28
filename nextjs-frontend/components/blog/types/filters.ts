/**
 * Filter and Sort Type Definitions
 * Phase 11.2 - Filtering & Sorting Implementation
 */

export type CategorySlug =
  | 'agent-career-info'
  | 'best-real-estate-brokerage'
  | 'brokerage-comparison'
  | 'industry-trends'
  | 'marketing-mastery'
  | 'winning-clients'
  | 'fun-for-agents'
  | 'exp-realty-sponsor'
  | 'become-a-real-estate-agent'
  | 'about-exp-realty'
  | 'getting-your-license'
  | 'best-real-estate-school';

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'relevance';

export interface FilterState {
  categories: CategorySlug[];
  sort: SortOption;
  query?: string;
  page?: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  count: number;
}

export interface SortOptionInfo {
  value: SortOption;
  label: string;
  orderby: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
}

// Category display names mapping
export const CATEGORY_DISPLAY_NAMES: Record<CategorySlug, string> = {
  'agent-career-info': 'Agent Career Info',
  'best-real-estate-brokerage': 'Best Real Estate Brokerage',
  'brokerage-comparison': 'Brokerage Comparison',
  'industry-trends': 'Industry Trends',
  'marketing-mastery': 'Marketing Mastery',
  'winning-clients': 'Winning Clients',
  'fun-for-agents': 'Fun for Agents',
  'exp-realty-sponsor': 'eXp Realty Sponsor',
  'become-a-real-estate-agent': 'Become a Real Estate Agent',
  'about-exp-realty': 'About eXp Realty',
  'getting-your-license': 'Getting Your License',
  'best-real-estate-school': 'Best Real Estate School',
};

// Sort options configuration
export const SORT_OPTIONS: SortOptionInfo[] = [
  { value: 'date-desc', label: 'Newest First', orderby: 'date', order: 'desc' },
  { value: 'date-asc', label: 'Oldest First', orderby: 'date', order: 'asc' },
  { value: 'title-asc', label: 'A-Z', orderby: 'title', order: 'asc' },
  { value: 'title-desc', label: 'Z-A', orderby: 'title', order: 'desc' },
  { value: 'relevance', label: 'Most Relevant', orderby: 'relevance' },
];

// Default filter state
export const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  sort: 'date-desc',
  query: undefined,
  page: 1,
};

// Pagination configuration
export const POSTS_PER_PAGE = 12; // 1 featured + 11 regular posts
