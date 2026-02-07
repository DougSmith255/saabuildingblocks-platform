'use client';

import React from 'react';
import Image from 'next/image';
import { H1, CyberFrame, YouTubeFacade, Icon3D } from '@saa/shared/components/saa';
import { Clock, Calendar, User } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ThemeSwitch } from './ThemeSwitch';
import { Breadcrumbs } from './Breadcrumbs';
import { calculateReadingTime } from '@/utils/readingTime';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';

/**
 * Extracts YouTube video ID from various URL formats
 * Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export interface BlogPostHeroProps {
  /** Post title */
  title: string;
  /** Post category name */
  category: string;
  /** Category URL slug for breadcrumbs */
  categorySlug?: string;
  /** Post title for breadcrumbs (can differ from title) */
  postTitle?: string;
  /** Author name */
  author: string;
  /** Publication date (ISO string or formatted) */
  date: string;
  /** Post content for reading time calculation */
  content: string;
  /** Optional category hero image URL (leave blank for star background) */
  heroImage?: string;
  /** Optional YouTube video URL */
  youtubeVideoUrl?: string;
  /** Featured image URL to display in hero section */
  featuredImage?: string;
  /** Max height for featured image (e.g., '140px') */
  featuredImageMaxHeight?: string;
  /** Callback when theme changes */
  onThemeChange?: (isDark: boolean) => void;
}

/**
 * BlogPostHero - Hero section for individual blog posts
 *
 * Features:
 * - Category badge with gold styling
 * - H1 title with Master Controller effects (neon glow, 3D, flicker)
 * - Meta info: author, date, reading time
 * - Theme switch (sun/moon toggle)
 * - Star background fallback when no hero image
 * - All content centered
 * - Responsive design following PAGE_BUILDER_GUIDELINES
 *
 * @example
 * ```tsx
 * <BlogPostHero
 *   title="How to Build a Real Estate Empire"
 *   category="Business Growth"
 *   author="Doug Smart"
 *   date="December 2, 2025"
 *   content={post.content.rendered}
 * />
 * ```
 */
export function BlogPostHero({
  title,
  category,
  categorySlug,
  postTitle,
  author,
  date,
  content,
  heroImage,
  youtubeVideoUrl,
  featuredImage,
  featuredImageMaxHeight,
  onThemeChange,
}: BlogPostHeroProps) {
  const readingTime = calculateReadingTime(content);
  const youtubeId = youtubeVideoUrl ? extractYouTubeId(youtubeVideoUrl) : null;

  // Build category slug if not provided
  const resolvedCategorySlug = categorySlug || category.toLowerCase().replace(/\s+/g, '-');
  // Use postTitle if provided, otherwise use title
  const breadcrumbTitle = postTitle || title;

  return (
    <StickyHeroWrapper fadeSpeed={1.33}>
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32 blog-hero-section">
      {/* Breadcrumbs - inside section so they fade with scroll, 85px mobile / 100px desktop */}
      <div className="absolute left-4 sm:left-8 md:left-12 z-20 top-[85px] md:top-[100px]">
        <div className="max-w-[1900px]">
          <Breadcrumbs
            category={category}
            categorySlug={resolvedCategorySlug}
            postTitle={breadcrumbTitle}
          />
        </div>
      </div>

      {/* Theme switch - inside section so it fades with scroll, 150px mobile / 100px desktop */}
      <div className="absolute right-4 sm:right-8 md:right-12 z-20 top-[150px] md:top-[100px]">
        <ThemeSwitch onToggle={onThemeChange} />
      </div>
      {/* Hero background - uses <img> tag for LCP detection, star background fallback */}
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10 hero-bg"
        />
      )}

      {/* Content container - centered via parent's justify-center */}
      {/* minHeight prevents CLS from font loading - reserves space for H1 + meta row */}
      {/* pt-[100px] on mobile pushes content below toggle, md:pt-0 resets for desktop */}
      <div
        className="relative z-10 max-w-[1900px] w-full text-center pt-[100px] md:pt-0"
      >
        {/* Category badge - centered with 3D effect */}
        <div className="mb-6 flex justify-center" style={{ minHeight: '32px' }}>
          <CategoryBadge category={category} />
        </div>

        {/* Title - H1 with Master Controller effects, blog-specific sizing */}
        {/* minHeight prevents CLS when Taskor font loads with alt glyphs */}
        <div className="mb-8" style={{ minHeight: 'clamp(50px, 6vw + 20px, 120px)' }}>
          <H1
            style={{
              fontSize: 'clamp(32px, 4vw + 16px, 82px)',
            }}
          >
            {title}
          </H1>
        </div>

        {/* Meta info row - centered, wraps on mobile to stay within screen */}
        {/* Icon: 15px→30px, Font: 14px→28px */}
        <div
          className="flex items-center justify-center gap-4 md:gap-6 flex-wrap px-4"
          style={{
            minHeight: 'clamp(30px, calc(24px + 0.5vw), 40px)',
          }}
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            <Icon3D style={{ width: 'clamp(15px, calc(10px + 0.67vw), 30px)', height: 'clamp(15px, calc(10px + 0.67vw), 30px)' }}>
              <User style={{ width: '100%', height: '100%' }} />
            </Icon3D>
            <span className="font-[var(--font-synonym)] blog-hero-meta-text" style={{ fontSize: 'clamp(14px, calc(12px + 0.5vw), 28px)' }}>{author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Icon3D style={{ width: 'clamp(15px, calc(10px + 0.67vw), 30px)', height: 'clamp(15px, calc(10px + 0.67vw), 30px)' }}>
              <Calendar style={{ width: '100%', height: '100%' }} />
            </Icon3D>
            <span className="font-[var(--font-synonym)] blog-hero-meta-text" style={{ fontSize: 'clamp(14px, calc(12px + 0.5vw), 28px)' }}>{date}</span>
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <Icon3D style={{ width: 'clamp(15px, calc(10px + 0.67vw), 30px)', height: 'clamp(15px, calc(10px + 0.67vw), 30px)' }}>
              <Clock style={{ width: '100%', height: '100%' }} />
            </Icon3D>
            <span className="font-[var(--font-synonym)] blog-hero-meta-text" style={{ fontSize: 'clamp(14px, calc(12px + 0.5vw), 28px)' }}>{readingTime}</span>
          </div>
        </div>

        {/* Featured Image - displayed centered below icons */}
        {featuredImage && !youtubeId && (
          <div className="mt-10 max-w-3xl mx-auto">
            <CyberFrame>
              <div style={featuredImageMaxHeight ? { maxHeight: featuredImageMaxHeight, overflow: 'hidden' } : undefined}>
                <Image
                  src={featuredImage}
                  alt={title}
                  width={900}
                  height={506}
                  className="object-cover w-full h-auto"
                  style={featuredImageMaxHeight ? { maxHeight: featuredImageMaxHeight, objectFit: 'contain' } : undefined}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  priority
                />
              </div>
            </CyberFrame>
          </div>
        )}

        {/* YouTube Video - displayed if present */}
        {/* Uses YouTubeFacade for performance - iframe only loads on user click */}
        {youtubeId && (
          <div className="mt-12 max-w-4xl mx-auto">
            <CyberFrame isVideo aspectRatio="16/9">
              <YouTubeFacade
                videoId={youtubeId}
                title={title}
              />
            </CyberFrame>
          </div>
        )}
      </div>
      </section>
    </StickyHeroWrapper>
  );
}

export default BlogPostHero;
