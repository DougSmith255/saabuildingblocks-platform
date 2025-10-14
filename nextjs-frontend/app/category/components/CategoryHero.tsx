/**
 * CategoryHero Component
 * Phase 7.4: Component Implementation
 *
 * Hero section for category pages with:
 * - Background image from Cloudflare R2
 * - Gradient overlay (configurable direction)
 * - Animated H1 title + tagline
 * - Master Controller integration (typography, colors, spacing)
 * - Framer Motion entrance animations
 */

'use client';

import { motion } from 'framer-motion';
import type { CategoryHeroProps } from '../types';

/**
 * Generate CSS clamp() function from ClampConfig
 */
function generateClamp(config: { min: number; preferred: number; max: number; unit: string }): string {
  return `clamp(${config.min}${config.unit}, ${config.preferred}${config.unit}, ${config.max}${config.unit})`;
}

/**
 * Framer Motion Variants
 */
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any // Custom easing
    }
  }
} as any;

export function CategoryHero({
  config,
  typography,
  colors,
  spacing,
  className = ''
}: CategoryHeroProps) {
  // Generate responsive sizes from Master Controller
  const h1Size = generateClamp(typography.h1.size);
  const taglineSize = generateClamp(typography.tagline.size);
  const sectionPadding = generateClamp(spacing.sectionPadding);
  const containerPadding = generateClamp(spacing.containerPadding);

  // Get background position class
  const bgPositionClass = {
    left: 'bg-left',
    center: 'bg-center',
    right: 'bg-right'
  }[config.background.position];

  // Get gradient direction class
  const gradientClass = {
    'to-right': 'bg-gradient-to-r',
    'to-left': 'bg-gradient-to-l',
    'to-bottom': 'bg-gradient-to-b',
    'to-top': 'bg-gradient-to-t'
  }[config.background.gradient.direction];

  return (
    <section
      className={`relative min-h-[60vh] flex items-center overflow-hidden ${className}`}
      style={{
        paddingTop: sectionPadding,
        paddingBottom: sectionPadding
      }}
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover ${bgPositionClass}`}
        style={{
          backgroundImage: `url(${config.background.image})`,
          zIndex: -2
        }}
        aria-hidden="true"
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${gradientClass}`}
        style={{
          background: `linear-gradient(${config.background.gradient.direction.replace('to-', 'to ')}, ${config.background.gradient.from}, ${config.background.gradient.to})`,
          zIndex: -1
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div
        className="container mx-auto px-4 relative z-10"
        style={{
          paddingLeft: containerPadding,
          paddingRight: containerPadding
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* H1 Title - Auto-applies display font via Next.js 15 */}
          <motion.h1
            variants={childVariants}
            style={{
              fontSize: h1Size,
              fontWeight: typography.h1.weight,
              lineHeight: typography.h1.lineHeight,
              letterSpacing: typography.h1.letterSpacing,
              color: colors.headingText
            }}
            className="mb-6"
          >
            {config.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={childVariants}
            style={{
              fontSize: taglineSize,
              fontWeight: typography.tagline.weight,
              lineHeight: typography.tagline.lineHeight,
              letterSpacing: typography.tagline.letterSpacing,
              color: colors.bodyText
            }}
            className="font-[var(--font-amulya)] max-w-2xl"
          >
            {config.tagline}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
