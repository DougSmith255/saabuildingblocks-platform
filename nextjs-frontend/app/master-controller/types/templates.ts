/**
 * Blog Template System Types
 * Phase 11: Master Controller Templates Tab
 *
 * Complete TypeScript definitions for blog category template management
 */

// ============================================================================
// ENUMS AND LITERAL TYPES
// ============================================================================

export type LayoutType = 'single-column' | 'two-column' | 'grid-masonry';
export type HeaderPositionType = 'top' | 'left' | 'overlay';
export type SpacingDensityType = 'compact' | 'default' | 'wide' | 'extra-wide';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * BlogTemplate Interface
 * Represents a blog category display template with customizable layout and spacing
 */
export interface BlogTemplate {
  /** Unique template ID (UUID) */
  id: string;

  /** Template name */
  name: string;

  /** Optional description */
  description?: string;

  /** Layout type */
  layout: LayoutType;

  /** Card component ID (from SAA component library) */
  cardComponentId?: string;

  /** Header position */
  headerPosition: HeaderPositionType;

  /** Spacing density */
  spacingDensity: SpacingDensityType;

  /** Is this the default template? */
  isDefault: boolean;

  /** Assigned WordPress category IDs */
  assignedCategories?: number[];

  /** Timestamp: created */
  createdAt: string;

  /** Timestamp: updated */
  updatedAt: string;

  /** Created by user ID */
  createdBy?: string;
}

/**
 * CategoryAssignment Interface
 * Links WordPress categories to templates
 */
export interface CategoryAssignment {
  /** Assignment ID */
  id: number;

  /** Template UUID */
  templateId: string;

  /** WordPress category ID */
  categoryId: number;

  /** Category name (cached) */
  categoryName?: string;

  /** Assigned at timestamp */
  assignedAt: string;

  /** Assigned by user ID */
  assignedBy?: string;
}

/**
 * TemplateSamplePost Interface
 * Sample blog post data for template preview
 */
export interface TemplateSamplePost {
  /** Post ID */
  id: number;

  /** Post title */
  title: string;

  /** Post excerpt */
  excerpt: string;

  /** Featured image URL */
  featuredImage: string;

  /** Publication date (formatted) */
  publishDate: string;

  /** Estimated read time */
  readTime: string;

  /** Author name */
  author: string;

  /** Category name */
  category: string;
}

// ============================================================================
// CONSTANTS - Display Names
// ============================================================================

export const LAYOUT_NAMES: Record<LayoutType, string> = {
  'single-column': 'Single Column',
  'two-column': 'Two Column',
  'grid-masonry': 'Grid Masonry'
};

export const HEADER_POSITION_NAMES: Record<HeaderPositionType, string> = {
  'top': 'Top',
  'left': 'Left Sidebar',
  'overlay': 'Overlay'
};

export const SPACING_DENSITY_NAMES: Record<SpacingDensityType, string> = {
  'compact': 'Compact',
  'default': 'Default',
  'wide': 'Wide',
  'extra-wide': 'Extra Wide'
};

// ============================================================================
// CONSTANTS - Spacing Multipliers
// ============================================================================

/**
 * Spacing multipliers for each density level
 * Applied to base spacing values from Master Controller spacing settings
 */
export const SPACING_MULTIPLIERS: Record<SpacingDensityType, number> = {
  'compact': 0.75,
  'default': 1.0,
  'wide': 1.5,
  'extra-wide': 2.0
};

// ============================================================================
// CONSTANTS - Default Template
// ============================================================================

/**
 * Default template configuration
 * Used as fallback when no custom template is assigned
 */
export const DEFAULT_TEMPLATE: Omit<BlogTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Default Blog Template',
  description: 'Standard blog layout with single column and default spacing',
  layout: 'single-column',
  headerPosition: 'top',
  spacingDensity: 'default',
  isDefault: true,
  cardComponentId: 'CyberCardHolographic',
  assignedCategories: []
};

// ============================================================================
// CONSTANTS - Sample Data
// ============================================================================

/**
 * Sample blog post for template preview
 */
export const SAMPLE_BLOG_POST: TemplateSamplePost = {
  id: 1,
  title: 'Sample Blog Post Title',
  excerpt: 'This is a sample excerpt demonstrating how blog post cards will look in your chosen template. The actual content will come from your WordPress posts.',
  featuredImage: 'https://via.placeholder.com/800x400',
  publishDate: 'October 14, 2025',
  readTime: '5 min read',
  author: 'John Doe',
  category: 'Technology'
};

/**
 * Array of sample posts for grid preview
 */
export const SAMPLE_POSTS: TemplateSamplePost[] = [
  SAMPLE_BLOG_POST,
  {
    ...SAMPLE_BLOG_POST,
    id: 2,
    title: 'Another Sample Post',
    excerpt: 'Different excerpt to show variation in card heights and content wrapping.'
  },
  {
    ...SAMPLE_BLOG_POST,
    id: 3,
    title: 'Third Sample Post',
    excerpt: 'This one has even more content to demonstrate how longer excerpts affect card layout and spacing.'
  },
  {
    ...SAMPLE_BLOG_POST,
    id: 4,
    title: 'Fourth Sample Post',
    excerpt: 'Short and sweet.'
  },
  {
    ...SAMPLE_BLOG_POST,
    id: 5,
    title: 'Fifth Sample Post',
    excerpt: 'Medium length excerpt showing typical blog post preview content that readers might see.'
  },
  {
    ...SAMPLE_BLOG_POST,
    id: 6,
    title: 'Sixth Sample Post',
    excerpt: 'Another variation to fill the grid and show how templates handle multiple posts.'
  }
];
