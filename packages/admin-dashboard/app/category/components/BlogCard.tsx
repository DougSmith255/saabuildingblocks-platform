/**
 * BlogCard Component
 * Phase 7.4: Component Implementation
 *
 * Individual blog post card with:
 * - WordPress featured image
 * - Post title, excerpt, date
 * - CyberCardHolographic wrapper (SAA component)
 * - Hover animation with scale + glow
 * - Master Controller integration
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GenericCard } from '@/components/saa';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import type { BlogCardProps } from '../types';

/**
 * Format WordPress date to readable format
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Strip HTML tags from excerpt
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Get featured image URL from WordPress post
 */
function getFeaturedImageUrl(post: BlogCardProps['post']): string | null {
  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

/**
 * Get alt text for featured image
 */
function getFeaturedImageAlt(post: BlogCardProps['post']): string {
  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    return post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered;
  }
  return post.title.rendered;
}

/**
 * Framer Motion Variants
 */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
} as any;

const hoverVariants = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
} as any;

export function BlogCard({
  post,
  typography,
  colors,
  spacing,
  className = ''
}: BlogCardProps) {
  // Generate responsive sizes
  const h3Size = generateClamp(typography.h3.size);
  const bodySize = generateClamp(typography.body.size);
  const captionSize = generateClamp(typography.caption.size);
  const cardGap = generateClamp(spacing.gridGap);

  // Extract data
  const featuredImage = getFeaturedImageUrl(post);
  const imageAlt = getFeaturedImageAlt(post);
  const excerpt = stripHtml(post.excerpt.rendered);
  const formattedDate = formatDate(post.date);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <motion.div
          variants={hoverVariants}
          initial="rest"
          whileHover="hover"
          className="h-full"
        >
          <GenericCard
            className="h-full overflow-hidden"
          >
            {/* Featured Image */}
            {featuredImage && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="p-6"
              style={{
                gap: cardGap
              }}
            >
              {/* Post Title (H3) */}
              <h3
                style={{
                  fontSize: h3Size,
                  fontWeight: typography.h3.fontWeight,
                  lineHeight: typography.h3.lineHeight,
                  letterSpacing: typography.h3.letterSpacing,
                  color: colors.headingText
                }}
                className="font-[var(--font-taskor)] mb-3 line-clamp-2"
              >
                {post.title.rendered}
              </h3>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: bodySize,
                  fontWeight: typography.body.fontWeight,
                  lineHeight: typography.body.lineHeight,
                  letterSpacing: typography.body.letterSpacing,
                  color: colors.bodyText
                }}
                className="font-[var(--font-amulya)] mb-4 line-clamp-3"
              >
                {excerpt}
              </p>

              {/* Date */}
              <time
                dateTime={post.date}
                style={{
                  fontSize: captionSize,
                  fontWeight: typography.caption.fontWeight,
                  lineHeight: typography.caption.lineHeight,
                  letterSpacing: typography.caption.letterSpacing,
                  color: colors.mediumGray
                }}
                className="font-[var(--font-amulya)] block"
              >
                {formattedDate}
              </time>

              {/* Read More Link */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  style={{
                    fontSize: bodySize,
                    color: colors.accentGreen
                  }}
                  className="font-[var(--font-taskor)] font-semibold"
                >
                  Read More
                </span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  style={{ color: colors.accentGreen }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </GenericCard>
        </motion.div>
      </Link>
    </motion.div>
  );
}
