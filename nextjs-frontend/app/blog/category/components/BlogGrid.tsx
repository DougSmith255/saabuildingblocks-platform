'use client';

/**
 * BlogGrid Component  
 * Grid container for blog post cards with stagger animations
 * Phase 7.3 - Category Template System
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import { BlogCard } from './BlogCard';
import type { BlogPost, TypographySettings, BrandColorsSettings, SpacingSettings } from '../types';

interface BlogGridProps {
  posts: BlogPost[];
  typography: TypographySettings;
  colors: BrandColorsSettings;
  spacing: SpacingSettings;
}

export function BlogGrid({ posts, typography, colors, spacing }: BlogGridProps) {
  const containerPadding = generateClamp(spacing.containerPadding);
  const gridGap = generateClamp(spacing.gridGap);
  const sectionMargin = generateClamp(spacing.sectionMargin);
  const prefersReducedMotion = useReducedMotion();

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      style={{
        marginTop: sectionMargin,
        marginBottom: sectionMargin,
        padding: containerPadding,
        background: 'linear-gradient(to right, #fff 0%, rgba(255,255,255,0.5) 100%)',
        backgroundImage: 'url(/patterns/cubes.svg)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))',
            gap: gridGap,
          }}
          className="blog-grid"
        >
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              typography={typography}
              colors={colors}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
