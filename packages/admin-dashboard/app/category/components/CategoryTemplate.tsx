/**
 * CategoryTemplate Component
 * Phase 7.4: Component Implementation
 *
 * STATIC EXPORT VERSION:
 * - Receives category config + initial WordPress posts
 * - Uses CSS variables for Master Controller settings (build-time)
 * - No runtime stores or React Query (static HTML only)
 * - Props drilling pattern (no Context API)
 */

'use client';

import { CategoryHero } from './CategoryHero';
import { BlogGrid } from './BlogGrid';
import type { CategoryTemplateProps } from '../types';

/**
 * CategoryTemplate - Main orchestrator component (Static Export)
 *
 * This component:
 * 1. Receives initial posts from SSG (Server Component)
 * 2. Uses CSS variables for Master Controller settings (baked in at build time)
 * 3. No React Query (uses static initialPosts only)
 * 4. Props-drills config to child components
 * 5. Composes CategoryHero + BlogGrid
 *
 * @param config - Category configuration (slug, title, background, etc.)
 * @param initialPosts - Initial posts from generateStaticParams (SSG)
 * @param className - Optional CSS class
 */
export function CategoryTemplate({
  config,
  initialPosts,
  className = ''
}: CategoryTemplateProps) {
  // ============================================================================
  // STATIC EXPORT MODE
  // ============================================================================

  // Typography, colors, and spacing are handled via CSS variables
  // Generated at build time by scripts/generate-static-css.ts
  // No runtime Master Controller stores needed

  // Use default/placeholder settings for TypeScript compatibility
  // These values are not used in rendering (CSS variables are), but needed to prevent build errors
  const typography = {
    h1: { size: { min: 48, preferred: 72, max: 96 } },
    h2: { size: { min: 36, preferred: 54, max: 72 } },
    h3: { size: { min: 28, preferred: 42, max: 56 } },
    body: { size: { min: 16, preferred: 18, max: 20 } },
    tagline: { size: { min: 20, preferred: 24, max: 28 } },
  } as any;

  const colors = {
    headingText: '#ffd700',
    bodyText: '#dcdbd5',
  } as any;

  const spacing = {
    sectionMargin: { min: 64, preferred: 96, max: 128 },
    containerPadding: { min: 16, preferred: 24, max: 32 },
  } as any;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`category-template ${className}`}>
      {/* Hero Section */}
      <CategoryHero
        config={config}
        typography={typography}
        colors={colors}
        spacing={spacing}
      />

      {/* Blog Grid Section */}
      <BlogGrid
        posts={initialPosts || []}
        typography={typography}
        colors={colors}
        spacing={spacing}
        loading={false}
        error={null}
      />
    </div>
  );
}
