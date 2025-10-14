'use client';

/**
 * BlogCard Component
 * Individual blog post card with image, title, excerpt, and hover effects
 * Includes Framer Motion hover animations
 * Phase 7.3 - Category Template System
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { generateClamp } from '@/app/master-controller/lib/clampCalculator';
import type { BlogPost, TypographySettings, BrandColorsSettings } from '../types';

interface BlogCardProps {
  post: BlogPost;
  typography: TypographySettings;
  colors: BrandColorsSettings;
  style?: React.CSSProperties;
  index?: number; // For stagger animation delay
}

export function BlogCard({ post, typography, colors, style, index = 0 }: BlogCardProps) {
  const h2Size = generateClamp(typography.h2.size);
  const bodySize = generateClamp(typography.body.size);
  const prefersReducedMotion = useReducedMotion();

  // Animation variants (respects reduced motion preference)
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.1, // Stagger delay
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <motion.article
        className="blog-card group"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        whileHover={
          prefersReducedMotion
            ? {}
            : {
                scale: 1.02,
                y: -4,
                transition: { duration: 0.3, ease: 'easeOut' },
              }
        }
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          overflow: 'hidden',
          cursor: 'pointer',
          willChange: 'transform, opacity',
          ...style,
        }}
      >
        {/* Featured Image */}
        <div style={{ width: '50%', position: 'relative' }}>
          {post.featuredImage && (
            <>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
                loading={index > 2 ? 'lazy' : 'eager'} // Lazy load below fold
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  border: `5px solid ${colors.accentGreen}`,
                  transition: 'border-color 0.3s ease-out',
                }}
                className="group-hover:border-[var(--brand-gold)]"
              />

              {/* Category Badge */}
              {post.categories[0] && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 12px',
                    background: colors.brandGold,
                    color: '#191818',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    zIndex: 10,
                  }}
                >
                  {post.categories[0].replace(/-/g, ' ')}
                </span>
              )}

              {/* Hover Overlay with Arrow */}
              <motion.div
                className="hover-overlay"
                initial={{ opacity: 0 }}
                whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  pointerEvents: 'none',
                }}
              >
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    fontSize: '3rem',
                    color: '#FFFFFF',
                  }}
                >
                  →
                </motion.span>
              </motion.div>
            </>
          )}
        </div>

        {/* Content */}
        <div style={{ width: '50%', padding: '1.5rem' }}>
          {/* Title */}
          <h2
            style={{
              fontSize: h2Size,
              lineHeight: typography.h2.lineHeight,
              letterSpacing: `${typography.h2.letterSpacing}em`,
              fontWeight: typography.h2.fontWeight,
              fontFamily: typography.h2.fontFamily,
              color: colors[typography.h2.color as keyof typeof colors] as string,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h2>

          {/* Meta */}
          <div
            style={{
              fontSize: '0.875rem',
              fontFamily: typography.body.fontFamily,
              color: colors.bodyText,
              opacity: 0.7,
              marginBottom: '0.75rem',
            }}
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}{' '}
            · By {post.author.name}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: bodySize,
              lineHeight: typography.body.lineHeight,
              fontFamily: typography.body.fontFamily,
              color: colors.bodyText,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </div>
      </motion.article>
    </Link>
  );
}
