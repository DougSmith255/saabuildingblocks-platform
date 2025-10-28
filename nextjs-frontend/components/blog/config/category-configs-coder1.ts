/**
 * Category configurations for first 6 blog category templates
 * CODER 1 Implementation - Phase 7.3
 *
 * IMPORTANT: These slugs MUST match WordPress API ALLOWED_CATEGORIES
 *
 * First 6 categories (matching mission requirements):
 * 1. best-brokerage (WordPress API)
 * 2. become-an-agent (WordPress API)
 * 3. brokerage-comparison (WordPress API)
 * 4. industry-trends (WordPress API)
 * 5. marketing-mastery (WordPress API)
 * 6. winning-clients (WordPress API)
 */

import type { CategoryConfig } from '../types/filters';

export const categoryConfigs: Record<string, CategoryConfig> = {
  'best-brokerage': {
    id: 'best-brokerage',
    name: 'Best Brokerage',
    slug: 'best-brokerage',
    title: 'Best Real Estate Brokerage',
    tagline: 'Discover the <mark>best real estate brokerages</mark> for your career growth and success.',
    backgroundImage: '/images/Blog-Background-1.webp',
    categorySlug: 'best-brokerage', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Compare and find the best real estate brokerages for your career.',
      keywords: ['best brokerage', 'real estate', 'agent', 'career'],
    },
  },

  'become-an-agent': {
    id: 'become-an-agent',
    name: 'Become an Agent',
    slug: 'become-an-agent',
    title: 'Become a Real Estate Agent',
    tagline: 'Your complete guide to <mark>becoming a real estate agent</mark> and launching your career.',
    backgroundImage: '/images/Blog-Background-2.webp',
    categorySlug: 'become-an-agent', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Step-by-step guide to becoming a successful real estate agent.',
      keywords: ['become agent', 'real estate career', 'licensing', 'training'],
    },
  },

  'brokerage-comparison': {
    id: 'brokerage-comparison',
    name: 'Brokerage Comparison',
    slug: 'brokerage-comparison',
    title: 'Brokerage Comparison',
    tagline: 'In-depth <mark>brokerage comparisons</mark> to help you make informed career decisions.',
    backgroundImage: '/images/Blog-Background-3.webp',
    categorySlug: 'brokerage-comparison', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Detailed comparisons of top real estate brokerages with pros, cons, and insights.',
      keywords: ['brokerage comparison', 'review', 'analysis', 'real estate'],
    },
  },

  'industry-trends': {
    id: 'industry-trends',
    name: 'Industry Trends',
    slug: 'industry-trends',
    title: 'Real Estate Industry Trends',
    tagline: 'Stay ahead with the latest <mark>real estate industry trends</mark> and market insights.',
    backgroundImage: '/images/Blog-Background-4.webp',
    categorySlug: 'industry-trends', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Latest trends, market analysis, and predictions in the real estate industry.',
      keywords: ['industry trends', 'market analysis', 'real estate', 'insights'],
    },
  },

  'marketing-mastery': {
    id: 'marketing-mastery',
    name: 'Marketing Mastery',
    slug: 'marketing-mastery',
    title: 'Real Estate Marketing Mastery',
    tagline: 'Master <mark>real estate marketing strategies</mark> to grow your business and brand.',
    backgroundImage: '/images/Blog-Background-5.webp',
    categorySlug: 'marketing-mastery', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Expert real estate marketing strategies, tips, and best practices for agents.',
      keywords: ['marketing', 'real estate', 'strategy', 'growth', 'branding'],
    },
  },

  'winning-clients': {
    id: 'winning-clients',
    name: 'Winning Clients',
    slug: 'winning-clients',
    title: 'Winning Clients',
    tagline: 'Learn proven strategies to <mark>win more clients</mark> and close more deals.',
    backgroundImage: '/images/Blog-Background-6.webp',
    categorySlug: 'winning-clients', // WordPress API slug
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Proven strategies for winning clients and growing your real estate business.',
      keywords: ['winning clients', 'sales', 'closing', 'real estate', 'prospecting'],
    },
  },
};

/**
 * Helper function to get config by slug
 * @param slug - Category slug (URL parameter)
 * @returns CategoryConfig or null if not found
 */
export function getCategoryConfig(slug: string): CategoryConfig | null {
  return categoryConfigs[slug] || null;
}

/**
 * Helper function to get all category slugs (for static generation)
 * @returns Array of category slug strings
 */
export function getAllCategorySlugs(): string[] {
  return Object.keys(categoryConfigs);
}

/**
 * Helper function to get all category configs as array
 * @returns Array of CategoryConfig objects
 */
export function getAllCategoryConfigs(): CategoryConfig[] {
  return Object.values(categoryConfigs);
}
