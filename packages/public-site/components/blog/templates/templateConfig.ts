/**
 * Category Template Configuration
 *
 * Defines customization options for each blog category template.
 * Each category can have unique:
 * - Accent colors
 * - Hero background styles
 * - Custom components/sections
 * - Related posts filtering
 */

export type CategorySlug =
  | 'about-exp-realty'
  | 'agent-career-info'
  | 'become-an-agent'
  | 'brokerage-comparison'
  | 'fun-for-agents'
  | 'industry-trends'
  | 'marketing-mastery'
  | 'real-estate-schools'
  | 'winning-clients'
  | 'exp-realty-sponsor';

export interface CategoryTemplateConfig {
  /** Display name for the category */
  displayName: string;
  /** URL slug for the category */
  slug: CategorySlug;
  /** Primary accent color (CSS color value) */
  accentColor: string;
  /** Secondary accent color for gradients */
  accentColorSecondary: string;
  /** Hero background gradient or image */
  heroBackground?: string;
  /** Category-specific hero subtitle or tagline */
  heroSubtitle?: string;
  /** Show video section prominently? */
  emphasizeVideo?: boolean;
  /** Related posts limit */
  relatedPostsLimit?: number;
  /** Custom CSS class to add to article */
  customClassName?: string;
  /** Max height for hero featured image (e.g., '140px') */
  heroImageMaxHeight?: string;
}

/**
 * Category to slug mapping
 */
export function categoryToSlug(category: string): CategorySlug {
  return category.toLowerCase().replace(/\s+/g, '-') as CategorySlug;
}

/**
 * Template configurations for each category
 * TODO: Customize each template as needed
 */
export const categoryTemplates: Record<CategorySlug, CategoryTemplateConfig> = {
  'about-exp-realty': {
    displayName: 'About eXp Realty',
    slug: 'about-exp-realty',
    accentColor: '#00A3E0', // eXp blue
    accentColorSecondary: '#0077B5',
    heroSubtitle: 'Learn about the revolutionary cloud-based brokerage',
    relatedPostsLimit: 3,
    customClassName: 'category-about-exp',
  },

  'agent-career-info': {
    displayName: 'Agent Career Info',
    slug: 'agent-career-info',
    accentColor: '#FFD700', // Gold
    accentColorSecondary: '#FFA500',
    heroSubtitle: 'Essential career guidance for real estate professionals',
    relatedPostsLimit: 3,
    customClassName: 'category-career-info',
  },

  'become-an-agent': {
    displayName: 'Become an Agent',
    slug: 'become-an-agent',
    accentColor: '#00FF88', // Green
    accentColorSecondary: '#00CC6A',
    heroSubtitle: 'Your journey to becoming a successful real estate agent',
    emphasizeVideo: true,
    relatedPostsLimit: 3,
    customClassName: 'category-become-agent',
  },

  'brokerage-comparison': {
    displayName: 'Brokerage Comparison',
    slug: 'brokerage-comparison',
    accentColor: '#9B59B6', // Purple
    accentColorSecondary: '#8E44AD',
    heroSubtitle: 'Compare brokerages to find your perfect fit',
    relatedPostsLimit: 3,
    customClassName: 'category-brokerage-comparison',
  },

  'fun-for-agents': {
    displayName: 'Fun for Agents',
    slug: 'fun-for-agents',
    accentColor: '#FF6B6B', // Coral
    accentColorSecondary: '#EE5A5A',
    heroSubtitle: 'Light-hearted content for hardworking agents',
    relatedPostsLimit: 3,
    customClassName: 'category-fun',
  },

  'industry-trends': {
    displayName: 'Industry Trends',
    slug: 'industry-trends',
    accentColor: '#3498DB', // Blue
    accentColorSecondary: '#2980B9',
    heroSubtitle: 'Stay ahead with the latest real estate industry insights',
    relatedPostsLimit: 3,
    customClassName: 'category-industry-trends',
  },

  'marketing-mastery': {
    displayName: 'Marketing Mastery',
    slug: 'marketing-mastery',
    accentColor: '#E74C3C', // Red
    accentColorSecondary: '#C0392B',
    heroSubtitle: 'Master the art of real estate marketing',
    emphasizeVideo: true,
    relatedPostsLimit: 3,
    customClassName: 'category-marketing',
  },

  'real-estate-schools': {
    displayName: 'Real Estate Schools',
    slug: 'real-estate-schools',
    accentColor: '#FFD700', // Brand gold (was teal)
    accentColorSecondary: '#FFA500',
    heroSubtitle: 'Find the right education path for your real estate career',
    // CTA removed - redundant on pages that list schools
    relatedPostsLimit: 3,
    customClassName: 'category-schools',
    heroImageMaxHeight: '140px',
  },

  'winning-clients': {
    displayName: 'Winning Clients',
    slug: 'winning-clients',
    accentColor: '#F39C12', // Orange
    accentColorSecondary: '#D68910',
    heroSubtitle: 'Strategies to attract and convert more clients',
    emphasizeVideo: true,
    relatedPostsLimit: 3,
    customClassName: 'category-winning-clients',
  },

  'exp-realty-sponsor': {
    displayName: 'eXp Realty Sponsor',
    slug: 'exp-realty-sponsor',
    accentColor: '#00A3E0', // eXp blue
    accentColorSecondary: '#0077B5',
    heroSubtitle: 'Partner with the Smart Agent Alliance at eXp Realty',
    relatedPostsLimit: 3,
    customClassName: 'category-sponsor',
  },
};

/**
 * Get template config for a category
 * Falls back to default config if category not found
 */
export function getTemplateConfig(category: string): CategoryTemplateConfig {
  const slug = categoryToSlug(category);
  return categoryTemplates[slug] || {
    displayName: category,
    slug: slug,
    accentColor: '#FFD700', // Default gold
    accentColorSecondary: '#FFA500',
    relatedPostsLimit: 3,
    customClassName: 'category-default',
  };
}
