'use client';

import React from 'react';
import { Clock, Calendar, User } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ThemeSwitch } from './ThemeSwitch';
import { calculateReadingTime } from '@/utils/readingTime';

export interface BlogPostHeroProps {
  /** Post title */
  title: string;
  /** Post category name */
  category: string;
  /** Author name */
  author: string;
  /** Publication date (ISO string or formatted) */
  date: string;
  /** Post content for reading time calculation */
  content: string;
  /** Optional category hero image URL (leave blank for star background) */
  heroImage?: string;
  /** Callback when theme changes */
  onThemeChange?: (isDark: boolean) => void;
}

/**
 * BlogPostHero - Hero section for individual blog posts
 *
 * Features:
 * - Category badge with gold styling
 * - H1 title with display font (via Master Controller)
 * - Meta info: author, date, reading time
 * - Theme switch (sun/moon toggle)
 * - Star background fallback when no hero image
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
  author,
  date,
  content,
  heroImage,
  onThemeChange,
}: BlogPostHeroProps) {
  const readingTime = calculateReadingTime(content);

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      {/* Hero background - uses star background by default */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}

      {/* Content container */}
      <div className="relative z-10 max-w-[1900px] mx-auto">
        {/* Top row: Theme switch positioned right */}
        <div className="flex justify-end mb-8">
          <ThemeSwitch onToggle={onThemeChange} />
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <CategoryBadge category={category} variant="featured" />
        </div>

        {/* Title - Blog-specific sizing: 72px max, 32px min */}
        <h1
          className="mb-6 text-[#ffd700] leading-tight"
          style={{
            fontFamily: 'var(--font-taskor)',
            fontSize: 'clamp(32px, 4vw + 16px, 72px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-6 text-[#dcdbd5]">
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm font-[var(--font-amulya)]">{author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm font-[var(--font-amulya)]">{date}</span>
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm font-[var(--font-amulya)]">{readingTime}</span>
          </div>
        </div>

        {/* Quick CTA buttons placeholder - can be added later */}
        {/*
        <div className="mt-8 flex flex-wrap gap-4">
          <CTAButton href="/webinar">Join Webinar</CTAButton>
          <SecondaryButton href="/calculator">Commission Calculator</SecondaryButton>
        </div>
        */}
      </div>
    </section>
  );
}

export default BlogPostHero;
