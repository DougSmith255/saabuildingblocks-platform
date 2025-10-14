'use client';

/**
 * CategoryHero Component
 * Hero banner with background image, title, and tagline
 * Includes Framer Motion entrance animations and parallax scroll
 * Phase 7.3 - Category Template System
 */

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import type { TypographySettings, BrandColorsSettings, SpacingSettings } from '../types';

interface CategoryHeroProps {
  title: string;
  tagline: string;
  backgroundImage: string;
  typography: TypographySettings;
  colors: BrandColorsSettings;
  spacing: SpacingSettings;
}

export function CategoryHero({
  title,
  tagline,
  backgroundImage,
  typography,
  colors,
  spacing,
}: CategoryHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Parallax scroll effect (disabled if user prefers reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const containerPadding = generateClamp(spacing.containerPadding);
  const bodySize = generateClamp(typography.body.size);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth entrance
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.77), transparent), url(${backgroundImage})`,
        backgroundPosition: prefersReducedMotion ? 'center' : `center ${scrollY * 0.5}px`,
        backgroundSize: 'cover',
        backgroundAttachment: 'scroll',
        willChange: prefersReducedMotion ? 'auto' : 'background-position',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1040px',
          padding: containerPadding,
          background: 'rgba(10,10,10,0.89)',
          borderRadius: '15px',
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {/* H1 with Blackpast font (special font, NOT from presets) */}
        <motion.h1
          variants={childVariants}
          style={{
            fontSize: 'clamp(27px, 4vw + 1rem, 75px)',
            lineHeight: 1.2,
            fontWeight: 700,
            fontFamily: 'Blackpast, sans-serif',
            color: '#FFFFFF',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            marginBottom: '1rem',
          }}
        >
          {title}
        </motion.h1>

        {/* Tagline with yellow keyword highlighting */}
        <motion.div
          variants={childVariants}
          style={{
            fontSize: bodySize,
            lineHeight: 1.5,
            fontFamily: typography.body.fontFamily,
            color: colors.bodyText,
          }}
          dangerouslySetInnerHTML={{
            __html: tagline.replace(
              /<mark>/g,
              '<mark style="background: none; color: #FFCC00;">'
            ),
          }}
        />
      </motion.div>
    </section>
  );
}
