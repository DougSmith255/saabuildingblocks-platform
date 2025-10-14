/**
 * Type definitions for category template system
 * Phase 7.3 - Category Template Components
 */

// Re-export Master Controller types for convenience
export type {
  TypographySettings,
  TextTypeSettings,
  ClampConfig,
  BrandColorsSettings,
  ColorName,
  SpacingSettings,
  SpacingToken,
} from '@/app/master-controller/types';

/**
 * Category configuration for template rendering
 * Each category (Agent Career, Brokerage, etc.) has one config
 */
export interface CategoryConfig {
  id: string;                    // "agent-career-info"
  name: string;                  // "Agent Career Info"
  slug: string;                  // "agent-career-info"
  title: string;                 // H1 text: "Agent Career Info"
  tagline: string;               // HTML with <mark> tags for highlights
  backgroundImage: string;       // "/images/Blog-Background-7.webp"
  categorySlug: string;          // WordPress category slug for API
  backButton: {
    label: string;               // "Back to Agent Success Hub"
    href: string;                // "/blog" or custom
  };
  meta: {
    description: string;         // SEO meta description
    keywords: string[];          // SEO keywords
  };
}

/**
 * WordPress blog post data structure
 * Fetched via REST API /wp-json/wp/v2/posts
 */
export interface BlogPost {
  id: number;                    // Post ID
  slug: string;                  // URL slug
  title: string;                 // Post title (rendered)
  excerpt: string;               // Post excerpt (HTML)
  content: string;               // Full post content (HTML)
  featuredImage?: {              // Optional featured image
    url: string;                 // Image URL
    alt: string;                 // Alt text
    width: number;
    height: number;
  };
  author: {
    name: string;
    avatar?: string;             // Optional avatar URL
  };
  date: string;                  // ISO 8601 date
  modified: string;              // ISO 8601 date
  categories: string[];          // Category slugs (from WordPress API)
}
