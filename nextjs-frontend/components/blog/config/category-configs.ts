/**
 * Category configurations for all 12 blog category templates
 * Single source of truth for category metadata
 * Phase 7.3 - Complete Implementation (CODER 1 + CODER 2)
 *
 * All 12 categories:
 * 1. agent-career-info
 * 2. best-real-estate-brokerage
 * 3. brokerage-comparison
 * 4. industry-trends
 * 5. marketing-mastery
 * 6. winning-clients
 * 7. fun-for-agents
 * 8. exp-realty-sponsor
 * 9. become-a-real-estate-agent
 * 10. about-exp
 * 11. getting-your-license
 * 12. best-real-estate-school
 */

import type { CategoryConfig } from '../types/filters';

export const categoryConfigs: Record<string, CategoryConfig> = {
  // Existing 6 categories
  'agent-career-info': {
    id: 'agent-career-info',
    name: 'Agent Career Info',
    slug: 'agent-career-info',
    title: 'Agent Career Info',
    tagline: 'Building a real estate agent job starts with <mark>understanding the career path</mark> and opportunities available.',
    backgroundImage: '/images/Blog-Background-7.webp',
    categorySlug: 'agent-career-info',
    backButton: {
      label: 'Back to Agent Success Hub',
      href: '/blog',
    },
    meta: {
      description: 'Explore articles about building a successful real estate agent career.',
      keywords: ['real estate agent', 'career', 'job', 'opportunities'],
    },
  },

  'best-real-estate-brokerage': {
    id: 'best-real-estate-brokerage',
    name: 'Best Real Estate Brokerage',
    slug: 'best-real-estate-brokerage',
    title: 'brokerage comparison',
    tagline: 'Need help choosing what <mark>real estate brokerage</mark> is best for you? We have got you covered.',
    backgroundImage: '/images/Blog-Background-1.webp',
    categorySlug: 'best-real-estate-brokerage',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Compare top real estate brokerages and find the perfect fit for your career.',
      keywords: ['brokerage', 'comparison', 'real estate', 'agent'],
    },
  },

  'brokerage-comparison': {
    id: 'brokerage-comparison',
    name: 'Brokerage Comparison',
    slug: 'brokerage-comparison',
    title: 'Brokerage Comparison',
    tagline: 'In-depth <mark>brokerage comparisons</mark> to help you make the right choice.',
    backgroundImage: '/images/Blog-Background-2.webp',
    categorySlug: 'brokerage-comparison',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Detailed brokerage comparisons with pros, cons, and expert insights.',
      keywords: ['brokerage', 'comparison', 'review', 'analysis'],
    },
  },

  'industry-trends': {
    id: 'industry-trends',
    name: 'Industry Trends',
    slug: 'industry-trends',
    title: 'Industry Trends',
    tagline: 'Stay ahead with the latest <mark>real estate industry trends</mark> and market insights.',
    backgroundImage: '/images/Blog-Background-3.webp',
    categorySlug: 'industry-trends',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Real estate industry trends, market analysis, and future predictions.',
      keywords: ['industry trends', 'market analysis', 'real estate', 'insights'],
    },
  },

  'marketing-mastery': {
    id: 'marketing-mastery',
    name: 'Marketing Mastery',
    slug: 'marketing-mastery',
    title: 'Marketing Mastery',
    tagline: 'Master <mark>real estate marketing</mark> strategies to grow your business.',
    backgroundImage: '/images/Blog-Background-4.webp',
    categorySlug: 'marketing-mastery',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Real estate marketing strategies, tips, and best practices for agents.',
      keywords: ['marketing', 'real estate', 'strategy', 'growth'],
    },
  },

  'winning-clients': {
    id: 'winning-clients',
    name: 'Winning Clients',
    slug: 'winning-clients',
    title: 'Winning Clients',
    tagline: 'Learn how to <mark>win more clients</mark> and close more deals.',
    backgroundImage: '/images/Blog-Background-5.webp',
    categorySlug: 'winning-clients',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Proven strategies for winning clients and growing your real estate business.',
      keywords: ['clients', 'sales', 'closing', 'real estate'],
    },
  },

  // NEW: 6 additional categories (CODER 2)
  'fun-for-agents': {
    id: 'fun-for-agents',
    name: 'Fun for Agents',
    slug: 'fun-for-agents',
    title: 'Fun for Agents',
    tagline: 'Lighthearted content and <mark>fun resources</mark> for real estate agents.',
    backgroundImage: '/images/Blog-Background-6.webp',
    categorySlug: 'fun-for-agents',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Fun articles, memes, and entertaining content for real estate agents.',
      keywords: ['fun', 'entertainment', 'agents', 'community'],
    },
  },

  'exp-realty-sponsor': {
    id: 'exp-realty-sponsor',
    name: 'EXP Realty Sponsor',
    slug: 'exp-realty-sponsor',
    title: 'EXP Realty Sponsor',
    tagline: 'Discover the benefits of <mark>joining eXp Realty</mark> with our sponsor team.',
    backgroundImage: '/images/Blog-Background-8.webp',
    categorySlug: 'exp-realty-sponsor',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Learn about eXp Realty sponsorship, benefits, and joining our team.',
      keywords: ['eXp Realty', 'sponsor', 'join', 'team'],
    },
  },

  'become-a-real-estate-agent': {
    id: 'become-a-real-estate-agent',
    name: 'Become a Real Estate Agent',
    slug: 'become-a-real-estate-agent',
    title: 'Become a Real Estate Agent',
    tagline: 'Everything you need to know to <mark>become a real estate agent</mark>.',
    backgroundImage: '/images/Blog-Background-9.webp',
    categorySlug: 'become-a-real-estate-agent',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Step-by-step guide to becoming a real estate agent, from licensing to your first sale.',
      keywords: ['become agent', 'license', 'training', 'real estate'],
    },
  },

  'about-exp': {
    id: 'about-exp',
    name: 'About EXP Realty',
    slug: 'about-exp',
    title: 'About EXP Realty',
    tagline: 'Learn all about <mark>eXp Realty</mark> and what makes it unique.',
    backgroundImage: '/images/Blog-Background-10.webp',
    categorySlug: 'about-exp',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Complete guide to eXp Realty: model, culture, benefits, and opportunities.',
      keywords: ['eXp Realty', 'about', 'information', 'brokerage'],
    },
  },

  'getting-your-license': {
    id: 'getting-your-license',
    name: 'Getting Your License',
    slug: 'getting-your-license',
    title: 'Getting Your License',
    tagline: 'Complete guide to <mark>getting your real estate license</mark> and starting your career.',
    backgroundImage: '/images/Blog-Background-11.webp',
    categorySlug: 'getting-your-license',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Step-by-step guide to obtaining your real estate license and starting your career.',
      keywords: ['license', 'real estate', 'certification', 'training'],
    },
  },

  'best-real-estate-school': {
    id: 'best-real-estate-school',
    name: 'Best Real Estate School',
    slug: 'best-real-estate-school',
    title: 'Best Real Estate School',
    tagline: 'Find the <mark>best real estate school</mark> for your education and career goals.',
    backgroundImage: '/images/Blog-Background-12.webp',
    categorySlug: 'best-real-estate-school',
    backButton: {
      label: 'Back to Blog',
      href: '/blog',
    },
    meta: {
      description: 'Compare top real estate schools and find the best education for your career.',
      keywords: ['real estate school', 'education', 'training', 'license'],
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
