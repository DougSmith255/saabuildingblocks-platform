'use client';

/**
 * CategoryTemplate Component
 * Parent container that orchestrates all category page components
 * Integrates with Master Controller for typography, colors, and spacing
 * Phase 7.3 - Category Template System
 */

import React from 'react';
import { useTypographyStore } from '@/app/master-controller/stores/typographyStore';
import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';
import { useSpacingStore } from '@/app/master-controller/stores/spacingStore';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import { CategoryHero } from './CategoryHero';
import { CategoryBackButton } from './CategoryBackButton';
import { BlogGrid } from './BlogGrid';
import type { CategoryConfig, BlogPost } from '../types/filters';

interface CategoryTemplateProps {
  config: CategoryConfig;
  posts: BlogPost[];
  className?: string;
}

export function CategoryTemplate({ config, posts, className = '' }: CategoryTemplateProps) {
  // Access Master Controller stores
  const { settings: typography } = useTypographyStore();
  const { settings: colors } = useBrandColorsStore();
  const { settings: spacing } = useSpacingStore();

  // Generate responsive values
  const sectionMargin = generateClamp(spacing.sectionMargin);

  return (
    <div className={`category-template ${className}`}>
      {/* Hero Section */}
      <CategoryHero
        title={config.title}
        tagline={config.tagline}
        backgroundImage={config.backgroundImage}
        typography={typography}
        colors={colors}
        spacing={spacing}
      />

      {/* Back Button */}
      <section style={{ marginTop: sectionMargin }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <CategoryBackButton
            href={config.backButton.href}
            label={config.backButton.label}
            colors={colors}
          />
        </div>
      </section>

      {/* Blog Grid */}
      <BlogGrid
        posts={posts}
        typography={typography}
        colors={colors}
        spacing={spacing}
      />
    </div>
  );
}
