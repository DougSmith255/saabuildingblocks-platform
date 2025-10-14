'use client';

/**
 * TemplateSection - Base wrapper component for category template sections
 *
 * Provides consistent padding, margins, and animation orchestration
 * for all sections in category templates. Uses Intersection Observer
 * for scroll-triggered animations.
 *
 * @example
 * ```tsx
 * <TemplateSection variant="dark">
 *   <TemplateHero title="..." subtitle="..." />
 * </TemplateSection>
 * ```
 */

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import type { TemplateSectionProps } from '@/types/category-templates';

/**
 * Variant styles for different section backgrounds
 */
const variantStyles = {
  default: 'bg-transparent',
  dark: 'bg-[#0a0a0a]',
  accent: 'bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent'
} as const;

export function TemplateSection({
  children,
  variant = 'default',
  className = '',
  disableAnimation = false
}: TemplateSectionProps) {
  const baseClasses = 'relative w-full py-12 px-4 md:py-20 md:px-6 lg:py-24';
  const variantClass = variantStyles[variant];
  const combinedClasses = `${baseClasses} ${variantClass} ${className}`.trim();

  // If animation is disabled, render static section
  if (disableAnimation) {
    return (
      <section className={combinedClasses}>
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </section>
    );
  }

  // Render with scroll-triggered animation
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      className={combinedClasses}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </motion.section>
  );
}
