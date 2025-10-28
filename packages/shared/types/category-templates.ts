/**
 * TypeScript types for category template components
 *
 * These types define the props for reusable template components
 * used across all category pages (marketing, media, etc.)
 */

import type { ReactNode } from 'react';

/**
 * Props for TemplateHero component
 * The hero section at the top of each category template
 */
export interface TemplateHeroProps {
  /** Main heading text (H1) - auto-applies display font */
  title: string;
  /** Subtitle/description text below title */
  subtitle: string;
  /** Optional background image URL */
  backgroundImage?: string;
  /** Optional CTA button text */
  ctaText?: string;
  /** Optional CTA button link */
  ctaLink?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual feature item in the feature grid
 */
export interface TemplateFeature {
  /** Icon component or emoji for the feature */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Props for TemplateFeatureGrid component
 * Grid of features with stagger animation
 */
export interface TemplateFeatureGridProps {
  /** Array of features to display */
  features: TemplateFeature[];
  /** Grid columns on desktop (default: 3) */
  columns?: 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for TemplateCTA component
 * Call-to-action section with button
 */
export interface TemplateCTAProps {
  /** CTA heading text */
  heading: string;
  /** CTA description/body text */
  description: string;
  /** Button text */
  ctaText: string;
  /** Button link */
  ctaLink: string;
  /** Visual variant for different styles */
  variant?: 'default' | 'gradient' | 'minimal';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for TemplateSection wrapper component
 * Base wrapper for consistent spacing and animation
 */
export interface TemplateSectionProps {
  /** Section content */
  children: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'dark' | 'accent';
  /** Additional CSS classes */
  className?: string;
  /** Disable intersection observer animation */
  disableAnimation?: boolean;
}
