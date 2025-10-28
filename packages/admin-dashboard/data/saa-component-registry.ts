/**
 * SAA Component Registry
 *
 * Central registry for all SAA Design System components with metadata,
 * file paths, and conversion status tracking.
 */

export type SAAComponentCategory =
  | 'buttons'
  | 'cards'
  | 'navigation'
  | 'gallery'
  | 'effects'
  | 'interactive'
  | 'layouts'
  | 'forms';

export interface SAAComponent {
  id: string;
  name: string;
  category: SAAComponentCategory;
  description: string;
  previewPath?: string; // Path to HTML preview
  reactPath?: string; // Path to React component
  converted: boolean; // Has it been converted to React?
  source: 'wordpress' | 'custom';
  tags?: string[]; // Searchable tags
  dependencies?: string[]; // Required packages
}

/**
 * Complete SAA Component Registry (7 components)
 */
export const saaComponentRegistry: SAAComponent[] = [
  // Buttons (2)
  {
    id: 'cta-button',
    name: 'CTA Button',
    category: 'buttons',
    description: 'Primary call-to-action button with WordPress exact animations',
    reactPath: '/components/saa/buttons/CTAButton.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['button', 'cta', 'primary', 'wordpress', 'horizontal-glow'],
  },
  {
    id: 'secondary-button',
    name: 'Secondary Button',
    category: 'buttons',
    description: 'Secondary action button with WordPress vertical glow animation',
    reactPath: '/components/saa/buttons/SecondaryButton.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['button', 'secondary', 'animation', 'wordpress', 'vertical-glow'],
  },

  // Cards (4)
  {
    id: 'stacked-animation-cards',
    name: 'Stacked Animation Cards',
    category: 'cards',
    description: 'Multiple cards with stacked layer animation on hover',
    previewPath: '/saa-components/cards/stacked-animation-cards.html',
    reactPath: '/components/saa/cards/CyberCardStackedAnimation.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['card', 'animation', 'hover', 'stacked', 'layers'],
  },
  {
    id: 'cyber-card-prismatic-glass',
    name: 'Prismatic Glass Card',
    category: 'cards',
    description: 'Glass morphism card with prismatic light effects',
    previewPath: '/saa-components/cards/cyber-card-prismatic-glass.html',
    reactPath: '/components/saa/cards/CyberCardPrismaticGlass.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['card', 'glassmorphism', 'prismatic', 'futuristic', 'light'],
  },
  {
    id: 'cyber-card-holographic',
    name: 'Holographic Card',
    category: 'cards',
    description: 'Futuristic card with holographic border and glow effects',
    previewPath: '/saa-components/cards/cyber-card-holographic.html',
    reactPath: '/components/saa/cards/CyberCardHolographic.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['card', 'holographic', 'futuristic', 'border', 'glow'],
  },
  {
    id: 'cyber-card-industrial-metal',
    name: 'Industrial Metal Card',
    category: 'cards',
    description: 'Card with industrial metal aesthetic and rivets',
    previewPath: '/saa-components/cards/cyber-card-industrial-metal.html',
    reactPath: '/components/saa/cards/CyberCardIndustrialMetal.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['card', 'industrial', 'metal', 'rivets', 'aesthetic'],
  },

  // Effects (1)
  {
    id: 'text-scramble',
    name: 'Text Scramble',
    category: 'effects',
    description: 'Animated text scramble effect for dynamic typography',
    previewPath: '/saa-components/text/text-scramble.html',
    reactPath: '/components/saa/text/TextScramble.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['text', 'animation', 'scramble', 'typography', 'effect'],
  },

];

/**
 * Get components by category
 */
export function getComponentsByCategory(category: SAAComponentCategory): SAAComponent[] {
  return saaComponentRegistry.filter((comp) => comp.category === category);
}

/**
 * Get component by ID
 */
export function getComponentById(id: string): SAAComponent | undefined {
  return saaComponentRegistry.find((comp) => comp.id === id);
}

/**
 * Get conversion statistics
 */
export function getConversionStats() {
  const total = saaComponentRegistry.length;
  const converted = saaComponentRegistry.filter((c) => c.converted).length;
  const byCategory = saaComponentRegistry.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = { total: 0, converted: 0 };
    }
    acc[comp.category].total++;
    if (comp.converted) {
      acc[comp.category].converted++;
    }
    return acc;
  }, {} as Record<SAAComponentCategory, { total: number; converted: number }>);

  return {
    total,
    converted,
    percentage: Math.round((converted / total) * 100),
    byCategory,
  };
}

/**
 * Search components by query
 */
export function searchComponents(query: string): SAAComponent[] {
  const lowerQuery = query.toLowerCase();
  return saaComponentRegistry.filter(
    (comp) =>
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.description.toLowerCase().includes(lowerQuery) ||
      comp.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      comp.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Category labels for display
 */
export const SAA_CATEGORY_LABELS: Record<SAAComponentCategory, string> = {
  buttons: 'Buttons',
  cards: 'Cards',
  navigation: 'Navigation',
  gallery: 'Gallery',
  effects: 'Effects',
  interactive: 'Interactive',
  layouts: 'Layouts',
  forms: 'Forms',
};
