/**
 * Category Template Type Definitions
 * Phase 7.4: Component Implementation
 *
 * Complete TypeScript interfaces for category template system
 * All type integration issues with master-controller resolved
 */

// ============================================================================
// MASTER CONTROLLER TYPES (imported for use throughout this file)
// ============================================================================

import type {
  TypographySettings,
  TextTypeSettings,
  ClampConfig,
  BrandColorsSettings,
  SpacingSettings,
  ColorName,
  SpacingToken,
} from '@/app/master-controller/types';

// Re-export for external use
export type {
  TypographySettings,
  TextTypeSettings,
  ClampConfig,
  BrandColorsSettings,
  SpacingSettings,
  ColorName,
  SpacingToken,
};

// ============================================================================
// CATEGORY CONFIGURATION TYPES
// ============================================================================

export interface CategoryConfig {
  /** WordPress category ID */
  id: number;

  /** URL slug for routing */
  slug: string;

  /** Display title (H1) */
  title: string;

  /** Tagline/subtitle text */
  tagline: string;

  /** Background configuration */
  background: BackgroundConfig;

  /** Optional animation overrides */
  animations?: AnimationOverrides;

  /** SEO metadata */
  seo?: SEOConfig;
}

export interface BackgroundConfig {
  /** Cloudflare R2 image URL */
  image: string;

  /** Background position (left | center | right) */
  position: 'left' | 'center' | 'right';

  /** Gradient overlay configuration */
  gradient: {
    from: string;
    to: string;
    direction: 'to-right' | 'to-left' | 'to-bottom' | 'to-top';
  };
}

export interface AnimationOverrides {
  /** Hero entrance animation duration (ms) */
  heroEntranceDuration?: number;

  /** Card stagger delay (ms) */
  cardStaggerDelay?: number;

  /** Enable parallax effect */
  enableParallax?: boolean;
}

export interface SEOConfig {
  /** Meta description */
  description: string;

  /** Keywords for meta tags */
  keywords: string[];

  /** Open Graph image URL */
  ogImage?: string;
}

// ============================================================================
// WORDPRESS DATA TYPES
// ============================================================================

export interface WordPressPost {
  /** Post ID */
  id: number;

  /** Publication date (ISO 8601) */
  date: string;

  /** Post slug */
  slug: string;

  /** Publication status */
  status: 'publish' | 'draft' | 'pending' | 'private';

  /** Post title */
  title: {
    rendered: string;
  };

  /** Post excerpt */
  excerpt: {
    rendered: string;
    protected: boolean;
  };

  /** Post content */
  content: {
    rendered: string;
    protected: boolean;
  };

  /** Featured media ID */
  featured_media: number;

  /** Category IDs */
  categories: number[];

  /** Tag IDs */
  tags: number[];

  /** Embedded data (when _embed=true) */
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: Array<WordPressCategory[]>;
  };
}

export interface WordPressMedia {
  /** Media ID */
  id: number;

  /** Media type */
  media_type: 'image' | 'video' | 'audio' | 'file';

  /** Media details */
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      thumbnail?: MediaSize;
      medium?: MediaSize;
      large?: MediaSize;
      full?: MediaSize;
    };
  };

  /** Source URL */
  source_url: string;

  /** Alt text */
  alt_text: string;
}

export interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WordPressCategory {
  /** Category ID */
  id: number;

  /** Category name */
  name: string;

  /** Category slug */
  slug: string;

  /** Parent category ID (0 if none) */
  parent: number;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface CategoryTemplateProps {
  /** Category configuration */
  config: CategoryConfig;

  /** Initial posts data (SSG) */
  initialPosts: WordPressPost[];

  /** Optional CSS class */
  className?: string;
}

export interface CategoryHeroProps {
  /** Category configuration */
  config: CategoryConfig;

  /** Typography settings from Master Controller */
  typography: TypographySettings;

  /** Brand colors from Master Controller */
  colors: BrandColorsSettings;

  /** Spacing settings from Master Controller */
  spacing: SpacingSettings;

  /** Optional CSS class */
  className?: string;
}

export interface BlogGridProps {
  /** WordPress posts array */
  posts: WordPressPost[];

  /** Typography settings from Master Controller */
  typography: TypographySettings;

  /** Brand colors from Master Controller */
  colors: BrandColorsSettings;

  /** Spacing settings from Master Controller */
  spacing: SpacingSettings;

  /** Loading state */
  loading?: boolean;

  /** Error state */
  error?: Error | null;

  /** Optional CSS class */
  className?: string;
}

export interface BlogCardProps {
  /** WordPress post data */
  post: WordPressPost;

  /** Typography settings from Master Controller */
  typography: TypographySettings;

  /** Brand colors from Master Controller */
  colors: BrandColorsSettings;

  /** Spacing settings from Master Controller */
  spacing: SpacingSettings;

  /** Optional CSS class */
  className?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface FetchPostsOptions {
  /** Number of posts per page */
  per_page?: number;

  /** Page number */
  page?: number;

  /** Include embedded data */
  _embed?: boolean;

  /** Order direction */
  order?: 'asc' | 'desc';

  /** Order by field */
  orderby?: 'date' | 'title' | 'modified' | 'relevance';
}

export interface WordPressAPIError {
  code: string;
  message: string;
  data: {
    status: number;
  };
}
