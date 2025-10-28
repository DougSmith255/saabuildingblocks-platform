/**
 * BlogGrid Component
 * Phase 7.4: Component Implementation
 *
 * Responsive grid of blog cards with:
 * - 3-column layout (desktop) → 2-column (tablet) → 1-column (mobile)
 * - Loading skeleton states
 * - Error handling
 * - Empty state messaging
 * - Staggered entrance animations
 * - Master Controller integration
 */

'use client';

import { motion } from 'framer-motion';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import { BlogCard } from './BlogCard';
import type { BlogGridProps } from '../types';

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
      staggerChildren: 0.1
    }
  }
};

const skeletonVariants = {
  initial: {
    opacity: 0.5
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse' as const
    }
  }
};

/**
 * Loading Skeleton Card
 */
function SkeletonCard({ colors }: { colors: BlogGridProps['colors'] }) {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: colors.darkGray,
        border: `1px solid ${colors.mediumGray}`
      }}
    >
      {/* Image skeleton */}
      <div
        className="w-full h-48"
        style={{ backgroundColor: colors.mediumGray }}
      />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div
          className="h-6 rounded"
          style={{ backgroundColor: colors.mediumGray, width: '80%' }}
        />
        <div
          className="h-6 rounded"
          style={{ backgroundColor: colors.mediumGray, width: '60%' }}
        />

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div
            className="h-4 rounded"
            style={{ backgroundColor: colors.mediumGray, width: '100%' }}
          />
          <div
            className="h-4 rounded"
            style={{ backgroundColor: colors.mediumGray, width: '95%' }}
          />
          <div
            className="h-4 rounded"
            style={{ backgroundColor: colors.mediumGray, width: '70%' }}
          />
        </div>

        {/* Date skeleton */}
        <div
          className="h-3 rounded"
          style={{ backgroundColor: colors.mediumGray, width: '40%' }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Empty State Component
 */
function EmptyState({ typography, colors }: {
  typography: BlogGridProps['typography'];
  colors: BlogGridProps['colors'];
}) {
  const h3Size = generateClamp(typography.h3.size);
  const bodySize = generateClamp(typography.body.size);

  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3
          style={{
            fontSize: h3Size,
            fontWeight: typography.h3.fontWeight,
            color: colors.headingText
          }}
          className="font-[var(--font-taskor)] mb-4"
        >
          No Posts Found
        </h3>
        <p
          style={{
            fontSize: bodySize,
            fontWeight: typography.body.fontWeight,
            color: colors.bodyText
          }}
          className="font-[var(--font-amulya)]"
        >
          Check back soon for new content in this category.
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Error State Component
 */
function ErrorState({
  error,
  typography,
  colors
}: {
  error: Error;
  typography: BlogGridProps['typography'];
  colors: BlogGridProps['colors'];
}) {
  const h3Size = generateClamp(typography.h3.size);
  const bodySize = generateClamp(typography.body.size);

  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        <h3
          style={{
            fontSize: h3Size,
            fontWeight: typography.h3.fontWeight,
            color: colors.headingText
          }}
          className="font-[var(--font-taskor)] mb-4"
        >
          Unable to Load Posts
        </h3>
        <p
          style={{
            fontSize: bodySize,
            fontWeight: typography.body.fontWeight,
            color: colors.bodyText
          }}
          className="font-[var(--font-amulya)] mb-2"
        >
          We encountered an error while loading blog posts.
        </p>
        <p
          style={{
            fontSize: bodySize,
            fontWeight: typography.body.fontWeight,
            color: colors.mediumGray
          }}
          className="font-[var(--font-amulya)] text-sm"
        >
          {error.message}
        </p>
      </motion.div>
    </div>
  );
}

export function BlogGrid({
  posts,
  typography,
  colors,
  spacing,
  loading = false,
  error = null,
  className = ''
}: BlogGridProps) {
  // Generate responsive spacing
  const sectionPadding = generateClamp(spacing.sectionMargin);
  const cardGap = generateClamp(spacing.gridGap);

  // Handle loading state
  if (loading) {
    return (
      <section
        className={`py-12 ${className}`}
        style={{
          paddingTop: sectionPadding,
          paddingBottom: sectionPadding
        }}
      >
        <div className="container mx-auto px-4">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{
              gap: cardGap
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} colors={colors} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section
        className={`py-12 ${className}`}
        style={{
          paddingTop: sectionPadding,
          paddingBottom: sectionPadding
        }}
      >
        <div className="container mx-auto px-4">
          <ErrorState error={error} typography={typography} colors={colors} />
        </div>
      </section>
    );
  }

  // Handle empty state
  if (!posts || posts.length === 0) {
    return (
      <section
        className={`py-12 ${className}`}
        style={{
          paddingTop: sectionPadding,
          paddingBottom: sectionPadding
        }}
      >
        <div className="container mx-auto px-4">
          <EmptyState typography={typography} colors={colors} />
        </div>
      </section>
    );
  }

  // Render blog cards
  return (
    <section
      className={`py-12 ${className}`}
      style={{
        paddingTop: sectionPadding,
        paddingBottom: sectionPadding
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{
            gap: cardGap
          }}
        >
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              typography={typography}
              colors={colors}
              spacing={spacing}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
