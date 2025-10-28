/**
 * Category Template Configurations
 * Phase 7.4: Component Implementation
 *
 * All 12 category configurations with WordPress IDs, metadata, and visual settings
 */

import type { CategoryConfig } from '../types';

/**
 * Category configuration lookup by slug
 * Use: CATEGORY_CONFIGS['agent-career-info']
 */
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'agent-career-info': {
    id: 1641,
    slug: 'agent-career-info',
    title: 'Agent Career Info',
    tagline: 'Building a real estate agent career starts with the right knowledge and tools.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-7.webp',
      position: 'left',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Comprehensive guides and resources for building a successful real estate agent career.',
      keywords: ['real estate career', 'agent training', 'real estate education', 'career development']
    }
  },

  'become-a-real-estate-agent': {
    id: 1643,
    slug: 'become-a-real-estate-agent',
    title: 'Become a Real Estate Agent',
    tagline: 'Your comprehensive guide to launching a successful real estate career.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-1.webp',
      position: 'left',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Step-by-step guide to becoming a licensed real estate agent and starting your career.',
      keywords: ['become real estate agent', 'real estate license', 'agent certification', 'getting started']
    }
  },

  'brokerage-comparison': {
    id: 1644,
    slug: 'brokerage-comparison',
    title: 'Brokerage Comparison',
    tagline: 'Compare top real estate brokerages to find the perfect fit for your career.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-8.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'In-depth comparisons of real estate brokerages including commission splits, training, and support.',
      keywords: ['brokerage comparison', 'real estate broker', 'commission split', 'brokerage reviews']
    }
  },

  'best-real-estate-brokerage': {
    id: 1645,
    slug: 'best-real-estate-brokerage',
    title: 'Best Real Estate Brokerage',
    tagline: 'Discover the best real estate brokerages for agents in 2024.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-5.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Expert rankings and reviews of the best real estate brokerages for new and experienced agents.',
      keywords: ['best brokerage', 'top real estate companies', 'brokerage rankings', 'agent support']
    }
  },

  'industry-trends': {
    id: 1646,
    slug: 'industry-trends',
    title: 'Industry Trends',
    tagline: 'Stay ahead with the latest real estate industry trends and market insights.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-4.webp',
      position: 'right',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-left'
      }
    },
    seo: {
      description: 'Latest trends, market analysis, and industry insights for real estate professionals.',
      keywords: ['real estate trends', 'market analysis', 'industry news', 'real estate technology']
    }
  },

  'marketing-mastery': {
    id: 1647,
    slug: 'marketing-mastery',
    title: 'Marketing Mastery',
    tagline: 'Master real estate marketing strategies to grow your business.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-3.webp',
      position: 'left',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Proven marketing strategies, digital tools, and tactics for real estate agents.',
      keywords: ['real estate marketing', 'digital marketing', 'lead generation', 'social media marketing']
    }
  },

  'winning-clients': {
    id: 1648,
    slug: 'winning-clients',
    title: 'Winning Clients',
    tagline: 'Proven strategies for attracting and retaining real estate clients.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-2.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Client acquisition strategies, relationship building, and retention tactics for agents.',
      keywords: ['client acquisition', 'lead conversion', 'relationship building', 'customer service']
    }
  },

  'fun-for-agents': {
    id: 1649,
    slug: 'fun-for-agents',
    title: 'Fun for Agents',
    tagline: 'Work-life balance, inspiration, and fun for real estate professionals.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-6.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Work-life balance tips, motivational stories, and fun content for real estate agents.',
      keywords: ['work-life balance', 'agent lifestyle', 'motivation', 'real estate community']
    }
  },

  'exp-realty-sponsor': {
    id: 1650,
    slug: 'exp-realty-sponsor',
    title: 'eXp Realty Sponsor',
    tagline: 'Everything you need to know about eXp Realty sponsorship and revenue share.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-9.webp',
      position: 'left',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Complete guide to eXp Realty sponsorship, revenue share, and building your team.',
      keywords: ['eXp Realty', 'revenue share', 'sponsorship', 'team building', 'passive income']
    }
  },

  'about-exp-realty': {
    id: 1651,
    slug: 'about-exp-realty',
    title: 'About eXp Realty',
    tagline: 'Learn about eXp Realty\'s revolutionary cloud-based brokerage model.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-10.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Comprehensive overview of eXp Realty, its business model, benefits, and opportunities.',
      keywords: ['eXp Realty', 'cloud brokerage', 'virtual office', 'eXp benefits', 'stock options']
    }
  },

  'case-studies': {
    id: 1652,
    slug: 'case-studies',
    title: 'Case Studies',
    tagline: 'Real success stories from agents who transformed their real estate careers.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-11.webp',
      position: 'left',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Inspiring case studies and success stories from real estate agents across the country.',
      keywords: ['success stories', 'agent case studies', 'real estate success', 'career transformation']
    }
  },

  'resources': {
    id: 1653,
    slug: 'resources',
    title: 'Resources',
    tagline: 'Essential tools, templates, and resources for real estate agents.',
    background: {
      image: 'https://r2.saabuildingblocks.com/images/Blog-Background-12.webp',
      position: 'center',
      gradient: {
        from: 'rgba(0,0,0,0.77)',
        to: 'transparent',
        direction: 'to-right'
      }
    },
    seo: {
      description: 'Downloadable resources, tools, templates, and guides for real estate professionals.',
      keywords: ['real estate resources', 'agent tools', 'templates', 'guides', 'downloads']
    }
  }
};

/**
 * Get category configuration by slug
 * @param slug - Category slug (e.g., 'agent-career-info')
 * @returns CategoryConfig or undefined if not found
 */
export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return CATEGORY_CONFIGS[slug];
}

/**
 * Get all category slugs (for generateStaticParams)
 * @returns Array of category slugs
 */
export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORY_CONFIGS);
}

/**
 * Get all category configurations
 * @returns Array of all CategoryConfig objects
 */
export function getAllCategoryConfigs(): CategoryConfig[] {
  return Object.values(CATEGORY_CONFIGS);
}

/**
 * Validate if a slug exists in configuration
 * @param slug - Category slug to validate
 * @returns true if slug exists
 */
export function isValidCategorySlug(slug: string): boolean {
  return slug in CATEGORY_CONFIGS;
}
