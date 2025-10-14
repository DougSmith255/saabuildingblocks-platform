'use client';

/**
 * TemplateFeatureGrid - Grid of features with stagger animation
 *
 * Responsive grid layout that displays feature cards with icons, titles,
 * and descriptions. Uses stagger animation for visual polish. Grid adapts
 * from 1 column on mobile to 2-4 columns on desktop based on props.
 *
 * @example
 * ```tsx
 * <TemplateFeatureGrid
 *   features={[
 *     {
 *       icon: <Sparkles className="h-8 w-8" />,
 *       title: "AI-Powered",
 *       description: "Smart automation that learns from your workflow"
 *     },
 *     // ... more features
 *   ]}
 *   columns={3}
 * />
 * ```
 */

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { TemplateFeatureGridProps } from '@/types/category-templates';

/**
 * Grid column classes for different breakpoints
 */
const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
} as const;

export function TemplateFeatureGrid({
  features,
  columns = 3,
  className = ''
}: TemplateFeatureGridProps) {
  const baseClasses = 'grid gap-6 md:gap-8 lg:gap-10';
  const columnClass = columnClasses[columns];
  const combinedClasses = `${baseClasses} ${columnClass} ${className}`.trim();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className={combinedClasses}
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </motion.div>
  );
}

/**
 * Individual feature card component
 * Uses fadeInUp animation triggered by parent stagger container
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative rounded-lg border border-[#00ff88]/20 bg-gradient-to-br from-[#0a0a0a] to-[#111] p-6 transition-all hover:border-[#00ff88]/40 hover:shadow-lg hover:shadow-[#00ff88]/10"
    >
      {/* Icon container with accent glow */}
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff88]/10 to-[#00ff88]/5 text-[#00ff88] transition-transform group-hover:scale-110">
        {icon}
      </div>

      {/* Feature title - uses Taskor font */}
      <h3 className="mb-3 text-[clamp(1.125rem,2vw,1.5rem)] font-bold text-[#e5e4dd] font-[var(--font-taskor)]">
        {title}
      </h3>

      {/* Feature description - uses Amulya font */}
      <p className="text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-[#dcdbd5] font-[var(--font-amulya)]">
        {description}
      </p>

      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
