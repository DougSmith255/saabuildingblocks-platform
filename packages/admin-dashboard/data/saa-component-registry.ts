/**
 * SAA Component Registry
 *
 * Central registry for all SAA Design System components with metadata,
 * file paths, and conversion status tracking.
 *
 * ⚠️ ADDING A NEW COMPONENT? Read this first:
 * 📘 /home/claude-flow/📘-NEW-COMPONENT-GUIDE.md
 *
 * Critical reminders:
 * - Use relative paths (../shared/...) NOT package aliases (@saa/shared/...)
 * - Check for utility dependencies (extractPlainText, etc.)
 * - Add preview mapping to ComponentEditor.tsx
 * - Test locally before deploying
 */

export type SAAComponentCategory =
  | 'buttons'
  | 'cards'
  | 'navigation'
  | 'gallery'
  | 'effects'
  | 'interactive'
  | 'layouts'
  | 'forms'
  | 'typography';

export interface SAAComponent {
  id: string;
  name: string;
  category: SAAComponentCategory;
  description: string;
  previewPath?: string; // Path to HTML preview
  reactPath?: string; // Path to React component
  cssPath?: string; // Path to CSS file
  jsPath?: string; // Path to JavaScript file
  converted: boolean; // Has it been converted to React?
  source: 'wordpress' | 'custom';
  tags?: string[]; // Searchable tags
  dependencies?: string[]; // Required packages
}

/**
 * Complete SAA Component Registry (17 components)
 * All components from @saa/shared/components/saa
 */
export const saaComponentRegistry: SAAComponent[] = [
  // ============================================
  // BUTTONS (3)
  // ============================================
  {
    id: 'cta-button',
    name: 'CTA Button',
    category: 'buttons',
    description: 'Primary call-to-action button with WordPress exact animations',
    reactPath: '../shared/components/saa/buttons/CTAButton.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['button', 'cta', 'primary', 'wordpress', 'horizontal-glow'],
  },
  {
    id: 'secondary-button',
    name: 'Secondary Button',
    category: 'buttons',
    description: 'Secondary action button with WordPress vertical glow animation',
    reactPath: '../shared/components/saa/buttons/SecondaryButton.tsx',
    converted: true,
    source: 'wordpress',
    tags: ['button', 'secondary', 'animation', 'wordpress', 'vertical-glow'],
  },
  {
    id: 'generic-button',
    name: 'Generic Button',
    category: 'buttons',
    description: 'Reusable filter/toggle button with active/inactive states and gold/green gradient effects',
    reactPath: '../shared/components/saa/buttons/GenericButton.tsx',
    converted: true,
    source: 'custom',
    tags: ['button', 'filter', 'toggle', 'generic', 'category', 'multi-select'],
  },

  // ============================================
  // CARDS (2)
  // ============================================
  {
    id: 'generic-card',
    name: 'Generic Card',
    category: 'cards',
    description: 'Clean, simple card with subtle glass-like styling. Features semi-transparent background, rounded corners, soft border, optional hover effects, and configurable padding sizes.',
    reactPath: '../shared/components/saa/cards/GenericCard.tsx',
    converted: true,
    source: 'custom',
    tags: ['card', 'container', 'glass', 'simple', 'clean', 'hover', 'padding'],
  },
  {
    id: 'cyber-card',
    name: 'Cyber Card',
    category: 'cards',
    description: 'Premium 3D metal-plate card for featured content and stats. Features brushed gunmetal background, beveled edges, glossy overlay, 3D perspective tilt, and lift+glow hover effect.',
    reactPath: '../shared/components/saa/cards/CyberCard.tsx',
    converted: true,
    source: 'custom',
    tags: ['card', 'featured', 'stats', 'metal', '3d', 'premium', 'gunmetal', 'perspective'],
  },

  // ============================================
  // TYPOGRAPHY (4)
  // ============================================
  {
    id: 'h1-heading',
    name: 'H1 Heading',
    category: 'typography',
    description: '3D neon heading with animated flicker effect and alt glyphs',
    reactPath: '../shared/components/saa/headings/H1.tsx',
    converted: true,
    source: 'custom',
    tags: ['heading', 'h1', 'neon', 'typography', '3d', 'animation'],
  },
  {
    id: 'h2-heading',
    name: 'H2 Heading',
    category: 'typography',
    description: 'Static 3D neon heading with metal backing and alt glyphs',
    reactPath: '../shared/components/saa/headings/H2.tsx',
    converted: true,
    source: 'custom',
    tags: ['heading', 'h2', 'neon', 'typography', '3d', 'static'],
  },
  {
    id: 'tagline',
    name: 'Tagline',
    category: 'typography',
    description: 'Server-rendered tagline with static neon glow, 3D transform, and per-character alt glyphs. Pure CSS (no JavaScript hydration).',
    reactPath: '../shared/components/saa/headings/Tagline.tsx',
    converted: true,
    source: 'custom',
    tags: ['tagline', 'neon', 'typography', '3d', 'server-component', 'performance'],
  },
  {
    id: 'cyber-text-3d',
    name: 'CyberText 3D',
    category: 'typography',
    description: 'Cyberpunk 3D neon glow text effect with gold/white variants, configurable glow intensity, optional flickering animation, and metal backing plate.',
    reactPath: '../shared/components/saa/text/CyberText3D.tsx',
    converted: true,
    source: 'custom',
    tags: ['text', '3d', 'neon', 'glow', 'flicker', 'cyberpunk', 'gold', 'metal-plate'],
  },

  // ============================================
  // EFFECTS (0) - LightningText removed from design system
  // ============================================

  // ============================================
  // INTERACTIVE (3)
  // ============================================
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    category: 'interactive',
    description: 'Reusable FAQ accordion component with expandable items. Supports single or multiple open items, CSS variables for theming, and accessible keyboard navigation.',
    reactPath: '../shared/components/saa/interactive/FAQ.tsx',
    converted: true,
    source: 'custom',
    tags: ['faq', 'accordion', 'expandable', 'accessible', 'css-variables'],
  },
  {
    id: 'share-buttons',
    name: 'Share Buttons',
    category: 'interactive',
    description: 'Social media share buttons with 3D metal plate styling. Includes Twitter, Facebook, LinkedIn, Email, and Copy Link with visual feedback.',
    reactPath: '../shared/components/saa/interactive/ShareButtons.tsx',
    converted: true,
    source: 'custom',
    tags: ['share', 'social', 'twitter', 'facebook', 'linkedin', 'email', 'clipboard', '3d-metal'],
  },
  {
    id: 'icon-library',
    name: 'Icon Library',
    category: 'interactive',
    description: 'Grid display of SAA design system icons with optional labels, category grouping, and click handlers. Includes default icon set with social, UI, navigation, and status icons.',
    reactPath: '../shared/components/saa/icons/IconLibrary.tsx',
    converted: true,
    source: 'custom',
    tags: ['icons', 'library', 'grid', 'social', 'navigation', 'customizable'],
  },

  // ============================================
  // MEDIA (2)
  // ============================================
  {
    id: 'cyber-frame',
    name: 'CyberFrame',
    category: 'gallery',
    description: 'Futuristic holographic glass frame for images and videos. Features 3D metal frame, holographic glass overlay, randomized sheen position, and L-shaped corner tech accents.',
    reactPath: '../shared/components/saa/media/CyberFrame.tsx',
    converted: true,
    source: 'custom',
    tags: ['frame', 'image', 'video', 'holographic', 'glass', '3d', 'metal', 'corners'],
  },
  {
    id: 'youtube-facade',
    name: 'YouTube Facade',
    category: 'gallery',
    description: 'Lazy-loading YouTube embed with thumbnail facade. Dramatically improves page load performance (~1MB+ saved per video). Shows thumbnail with play button, loads iframe only on click.',
    reactPath: '../shared/components/saa/media/YouTubeFacade.tsx',
    converted: true,
    source: 'custom',
    tags: ['youtube', 'video', 'lazy-load', 'facade', 'performance', 'thumbnail', 'embed'],
  },

  // ============================================
  // ICONS (1)
  // ============================================
  {
    id: 'icon-3d',
    name: 'Icon 3D',
    category: 'effects',
    description: 'Wraps any icon with a 3D metal backing plate effect. Creates depth with perspective, rotateX tilt, layered shadows, and metal plate pushed back in Z-space.',
    reactPath: '../shared/components/saa/icons/Icon3D.tsx',
    converted: true,
    source: 'custom',
    tags: ['icon', '3d', 'metal', 'depth', 'shadow', 'perspective'],
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
  typography: 'Typography',
};
