'use client';

/**
 * TemplateCTA - Call-to-action component for category templates
 *
 * Centered CTA section with heading, description, and button using the
 * SAA CTAButton component. Features scroll-triggered scaleIn animation
 * and multiple visual variants (default, gradient, minimal).
 *
 * @example
 * ```tsx
 * <TemplateCTA
 *   heading="Ready to Get Started?"
 *   description="Join thousands of teams already using our platform"
 *   ctaText="Start Free Trial"
 *   ctaLink="/sign-up"
 *   variant="gradient"
 * />
 * ```
 */

import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import { CTAButton } from '@/components/saa';
import type { TemplateCTAProps } from '@/types/category-templates';

/**
 * Variant styles for different CTA backgrounds
 */
const variantStyles = {
  default: 'bg-gradient-to-br from-[#0a0a0a] to-[#111]',
  gradient: 'bg-gradient-to-br from-[#00ff88]/10 via-[#0a0a0a] to-[#00ff88]/5',
  minimal: 'bg-transparent'
} as const;

export function TemplateCTA({
  heading,
  description,
  ctaText,
  ctaLink,
  variant = 'default',
  className = ''
}: TemplateCTAProps) {
  const baseClasses = 'relative overflow-hidden rounded-xl border border-[#00ff88]/20 px-6 py-12 text-center md:px-12 md:py-16 lg:px-16 lg:py-20';
  const variantClass = variantStyles[variant];
  const combinedClasses = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={scaleIn}
      className={combinedClasses}
    >
      {/* Decorative glow effect for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ff88]/20 blur-3xl" />
      )}

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Heading - H2 auto-applies display font */}
        <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight text-[#e5e4dd]">
          {heading}
        </h2>

        {/* Description */}
        <p className="mb-8 text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-[#dcdbd5] font-[var(--font-amulya)]">
          {description}
        </p>

        {/* CTA Button with accent glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <CTAButton
            href={ctaLink}
            variant="primary"
            size="large"
            className="shadow-xl shadow-[#00ff88]/20"
          >
            {ctaText}
          </CTAButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
