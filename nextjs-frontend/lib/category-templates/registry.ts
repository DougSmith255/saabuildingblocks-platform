/**
 * Category Template Registry
 *
 * Source of truth for mapping WordPress category slugs to template components.
 * This registry enables the dynamic rendering of category-specific page layouts.
 *
 * @module category-templates/registry
 * @version 1.0.0
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Template Props Interface
 * All template components receive these props
 */
export interface TemplateProps {
  category: WordPressCategory;
  posts: WordPressPost[];
  settings: TemplateSettings;
}

/**
 * WordPress Category Data
 */
export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

/**
 * WordPress Post Data
 */
export interface WordPressPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author?: string;
  date: string;
  categories: string[];
}

/**
 * Template Settings (from Master Controller)
 */
export interface TemplateSettings {
  typography: TypographySettings;
  colors: BrandColorsSettings;
  spacing: SpacingSettings;
}

/**
 * Typography Settings (from Master Controller)
 */
export interface TypographySettings {
  displayFont: string;
  bodyFont: string;
  h1Size: string;
  h2Size: string;
  bodySize: string;
  lineHeight: string;
  letterSpacing: string;
}

/**
 * Brand Colors Settings (from Master Controller)
 */
export interface BrandColorsSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

/**
 * Spacing Settings (from Master Controller)
 */
export interface SpacingSettings {
  sectionPadding: string;
  containerMaxWidth: string;
  gridGap: string;
}

/**
 * Animation Configuration
 */
export interface AnimationConfig {
  enableScrollAnimations: boolean;
  animationPreset: 'subtle' | 'moderate' | 'dramatic';
  staggerDelay: number; // milliseconds
  transitionDuration: number; // milliseconds
}

/**
 * Template Section Configuration
 */
export interface TemplateSectionConfig {
  id: string;
  component: string; // Component name from shared/
  props: Record<string, unknown>;
  animateOnScroll: boolean;
  animationVariant: string;
  order: number;
}

/**
 * Category Template Component Type
 */
export type CategoryTemplateComponent = ComponentType<TemplateProps>;

/**
 * Category Template Metadata
 */
export interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  categoryId: number | null; // null until WordPress category created
  component: CategoryTemplateComponent;
  layout: 'single' | 'two-column' | 'grid';
  animations: AnimationConfig;
  sections: TemplateSectionConfig[];
  meta: {
    phase: 1 | 2 | 3;
    priority: 'high' | 'medium' | 'low';
    status: 'active' | 'draft' | 'archived';
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Lazy-loaded Template Components
 * Using Next.js dynamic() for code splitting
 */

// Phase 1: Foundation Template
const AboutExpRealty = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/AboutExpRealty'),
  { ssr: true }
);

// Phase 2: Growth Templates
const TrainingDevelopment = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/TrainingDevelopment'),
  { ssr: true }
);

const TechnologyTools = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/TechnologyTools'),
  { ssr: true }
);

const CultureCommunity = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/CultureCommunity'),
  { ssr: true }
);

const SuccessStories = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/SuccessStories'),
  { ssr: true }
);

// Phase 3: Complete Templates
const FinancialBenefits = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/FinancialBenefits'),
  { ssr: true }
);

const LeadershipSupport = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/LeadershipSupport'),
  { ssr: true }
);

const GlobalExpansion = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/GlobalExpansion'),
  { ssr: true }
);

const AgentResources = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/AgentResources'),
  { ssr: true }
);

const MarketInsights = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/MarketInsights'),
  { ssr: true }
);

const InnovationFuture = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/InnovationFuture'),
  { ssr: true }
);

const Partnerships = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/Partnerships'),
  { ssr: true }
);

const EventsRecognition = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/EventsRecognition'),
  { ssr: true }
);

const Sustainability = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/Sustainability'),
  { ssr: true }
);

const FaqSupport = dynamic<TemplateProps>(
  () => import('@/components/category-templates/templates/FaqSupport'),
  { ssr: true }
);

/**
 * TEMPLATE REGISTRY
 *
 * Maps category slugs to template components and metadata.
 * This is the single source of truth for the template system.
 *
 * @example
 * const template = CATEGORY_TEMPLATES['about-exp'];
 * const Component = template.component;
 * <Component category={...} posts={...} settings={...} />
 */
export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  /**
   * Phase 1: About eXp Realty Template
   * Foundation template with hero, features, stats, and CTA
   */
  'about-exp': {
    id: 'about-exp',
    name: 'About eXp Realty',
    description: 'Comprehensive overview of eXp Realty with hero, features, stats, and CTA sections',
    categorySlug: 'about-exp',
    categoryId: null, // Will be set when WordPress category is created
    component: AboutExpRealty,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [
      {
        id: 'hero',
        component: 'TemplateHero',
        props: {
          style: 'dramatic',
          showVideo: false,
          height: 'medium',
        },
        animateOnScroll: false,
        animationVariant: 'fadeIn',
        order: 1,
      },
      {
        id: 'features',
        component: 'TemplateFeatureGrid',
        props: {
          columns: 3,
          cardStyle: 'holographic',
        },
        animateOnScroll: true,
        animationVariant: 'slideUpFade',
        order: 2,
      },
      {
        id: 'stats',
        component: 'TemplateStats',
        props: {
          layout: 'horizontal',
          animated: true,
        },
        animateOnScroll: true,
        animationVariant: 'fadeIn',
        order: 3,
      },
      {
        id: 'cta',
        component: 'TemplateCTA',
        props: {
          style: 'bold',
          buttonText: 'Join eXp Today',
        },
        animateOnScroll: true,
        animationVariant: 'scaleInFade',
        order: 4,
      },
    ],
    meta: {
      phase: 1,
      priority: 'high',
      status: 'active',
      createdAt: '2025-10-12T00:00:00Z',
      updatedAt: '2025-10-12T00:00:00Z',
    },
  },

  /**
   * Phase 2: Training & Development Template
   */
  'training-development': {
    id: 'training-development',
    name: 'Training & Development',
    description: 'Comprehensive training programs, mentorship, and skill development opportunities',
    categorySlug: 'training-development',
    categoryId: null,
    component: TrainingDevelopment,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 2,
      priority: 'high',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 2: Technology & Tools Template
   */
  'technology-tools': {
    id: 'technology-tools',
    name: 'Technology & Tools',
    description: 'Advanced tech stack, AI tools, and digital platforms for modern real estate',
    categorySlug: 'technology-tools',
    categoryId: null,
    component: TechnologyTools,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 2,
      priority: 'high',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 2: Culture & Community Template
   */
  'culture-community': {
    id: 'culture-community',
    name: 'Culture & Community',
    description: 'Collaborative culture, community events, and global agent network',
    categorySlug: 'culture-community',
    categoryId: null,
    component: CultureCommunity,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 2,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 2: Success Stories Template
   */
  'success-stories': {
    id: 'success-stories',
    name: 'Success Stories',
    description: 'Agent achievements, transformation stories, and career milestones',
    categorySlug: 'success-stories',
    categoryId: null,
    component: SuccessStories,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 2,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Financial Benefits Template
   */
  'financial-benefits': {
    id: 'financial-benefits',
    name: 'Financial Benefits',
    description: 'Revenue sharing, commission structures, and financial opportunities',
    categorySlug: 'financial-benefits',
    categoryId: null,
    component: FinancialBenefits,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'high',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Leadership & Support Template
   */
  'leadership-support': {
    id: 'leadership-support',
    name: 'Leadership & Support',
    description: 'Mentorship, coaching, and leadership development programs',
    categorySlug: 'leadership-support',
    categoryId: null,
    component: LeadershipSupport,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Global Expansion Template
   */
  'global-expansion': {
    id: 'global-expansion',
    name: 'Global Expansion',
    description: 'International markets, cross-border opportunities, and worldwide presence',
    categorySlug: 'global-expansion',
    categoryId: null,
    component: GlobalExpansion,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Agent Resources Template
   */
  'agent-resources': {
    id: 'agent-resources',
    name: 'Agent Resources',
    description: 'Tools, downloads, templates, and resources for daily operations',
    categorySlug: 'agent-resources',
    categoryId: null,
    component: AgentResources,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'low',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Market Insights Template
   */
  'market-insights': {
    id: 'market-insights',
    name: 'Market Insights',
    description: 'Market trends, analysis, data, and real estate intelligence',
    categorySlug: 'market-insights',
    categoryId: null,
    component: MarketInsights,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Innovation & Future Template
   */
  'innovation-future': {
    id: 'innovation-future',
    name: 'Innovation & Future',
    description: 'Emerging technologies, future vision, and industry innovation',
    categorySlug: 'innovation-future',
    categoryId: null,
    component: InnovationFuture,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'low',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Partnerships Template
   */
  'partnerships': {
    id: 'partnerships',
    name: 'Partnerships',
    description: 'Strategic alliances, vendor relationships, and collaboration opportunities',
    categorySlug: 'partnerships',
    categoryId: null,
    component: Partnerships,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'low',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Events & Recognition Template
   */
  'events-recognition': {
    id: 'events-recognition',
    name: 'Events & Recognition',
    description: 'Company events, agent recognition, awards, and celebrations',
    categorySlug: 'events-recognition',
    categoryId: null,
    component: EventsRecognition,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'low',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: Sustainability Template
   */
  'sustainability': {
    id: 'sustainability',
    name: 'Sustainability',
    description: 'Environmental initiatives, green practices, and corporate responsibility',
    categorySlug: 'sustainability',
    categoryId: null,
    component: Sustainability,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'low',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },

  /**
   * Phase 3: FAQ & Support Template
   */
  'faq-support': {
    id: 'faq-support',
    name: 'FAQ & Support',
    description: 'Frequently asked questions, help resources, and support channels',
    categorySlug: 'faq-support',
    categoryId: null,
    component: FaqSupport,
    layout: 'single',
    animations: {
      enableScrollAnimations: true,
      animationPreset: 'moderate',
      staggerDelay: 100,
      transitionDuration: 600,
    },
    sections: [],
    meta: {
      phase: 3,
      priority: 'medium',
      status: 'active',
      createdAt: '2025-10-13T00:00:00Z',
      updatedAt: '2025-10-13T00:00:00Z',
    },
  },
};

/**
 * Get all templates in the registry
 */
export function getAllTemplates(): CategoryTemplate[] {
  return Object.values(CATEGORY_TEMPLATES);
}

/**
 * Get all active templates (status: 'active')
 */
export function getActiveTemplates(): CategoryTemplate[] {
  return getAllTemplates().filter(
    (template) => template.meta.status === 'active'
  );
}

/**
 * Get templates by phase (1, 2, or 3)
 */
export function getTemplatesByPhase(phase: 1 | 2 | 3): CategoryTemplate[] {
  return getAllTemplates().filter(
    (template) => template.meta.phase === phase
  );
}

/**
 * Get template by category slug
 *
 * @param slug - WordPress category slug
 * @returns Template configuration or null if not found
 */
export function getTemplateBySlug(slug: string): CategoryTemplate | null {
  return CATEGORY_TEMPLATES[slug] || null;
}

/**
 * Get template by WordPress category ID
 *
 * @param id - WordPress category ID
 * @returns Template configuration or null if not found
 */
export function getTemplateByCategoryId(id: number): CategoryTemplate | null {
  return getAllTemplates().find(
    (template) => template.categoryId === id
  ) || null;
}

/**
 * Check if a category has a template
 *
 * @param slug - WordPress category slug
 * @returns True if template exists
 */
export function hasTemplate(slug: string): boolean {
  return slug in CATEGORY_TEMPLATES;
}

/**
 * Get template slugs for all active templates
 * Useful for generating static routes
 */
export function getActiveTemplateSlugs(): string[] {
  return getActiveTemplates().map((template) => template.categorySlug);
}

/**
 * Get fallback template (used when no category match found)
 * Returns 'about-exp' as the default fallback
 */
export function getFallbackTemplate(): CategoryTemplate {
  const fallback = getTemplateBySlug('about-exp');
  if (!fallback) {
    throw new Error('Fallback template "about-exp" not found in registry');
  }
  return fallback;
}
