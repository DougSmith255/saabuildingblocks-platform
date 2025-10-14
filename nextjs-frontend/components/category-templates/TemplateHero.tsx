'use client';

/**
 * TemplateHero - Hero section component for category templates
 *
 * A responsive hero section with title, subtitle, optional background image,
 * and CTA button. Uses scroll-triggered fadeIn animation and fluid typography.
 * H1 auto-applies display font (Taskor) from Master Controller settings.
 *
 * @example
 * ```tsx
 * <TemplateHero
 *   title="Marketing Solutions"
 *   subtitle="AI-powered tools for modern marketers"
 *   ctaText="Get Started"
 *   ctaLink="/contact"
 * />
 * ```
 */

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { CTAButton } from '@/components/saa';
import type { TemplateHeroProps } from '@/types/category-templates';

export function TemplateHero({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink,
  className = ''
}: TemplateHeroProps) {
  const baseClasses = 'relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-20 md:py-28 lg:py-32';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      className={combinedClasses}
    >
      {/* Background image with overlay if provided */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
      )}

      {/* Content container */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Main heading - H1 auto-applies Taskor display font */}
        <h1
          className="mb-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-[#e5e4dd]"
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-8 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-[#dcdbd5] font-[var(--font-amulya)]"
          style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}
        >
          {subtitle}
        </p>

        {/* Optional CTA button */}
        {ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center"
          >
            <CTAButton
              href={ctaLink}
              className="shadow-lg shadow-[#00ff88]/20"
            >
              {ctaText}
            </CTAButton>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
