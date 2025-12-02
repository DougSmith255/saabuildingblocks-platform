'use client';

import React from 'react';
import { H1 } from '@saa/shared/components/saa';
import { Clock, Calendar, User } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ThemeSwitch } from './ThemeSwitch';
import { calculateReadingTime } from '@/utils/readingTime';

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
  author,
  date,
  content,
  heroImage,
  youtubeVideoUrl,
  onThemeChange,
}: BlogPostHeroProps) {
  const readingTime = calculateReadingTime(content);
  const youtubeId = youtubeVideoUrl ? extractYouTubeId(youtubeVideoUrl) : null;

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      {/* Hero background - uses star background by default */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}

      {/* Content container - centered */}
      <div className="relative z-10 max-w-[1900px] mx-auto text-center">
        {/* Top row: Theme switch positioned right */}
        <div className="flex justify-end mb-8">
          <ThemeSwitch onToggle={onThemeChange} />
        </div>

        {/* Category badge - centered */}
        <div className="mb-6 flex justify-center">
          <CategoryBadge category={category} variant="featured" />
        </div>

        {/* Title - H1 with Master Controller effects, blog-specific sizing */}
        <div className="mb-8">
          <H1
            heroAnimate={true}
            style={{
              fontSize: 'clamp(32px, 4vw + 16px, 72px)',
            }}
          >
            {title}
          </H1>
        </div>

        {/* Meta info row - centered */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[#dcdbd5]">
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

        {/* YouTube Video - displayed if present */}
        {youtubeId && (
          <div className="mt-12">
            {/* Futuristic video frame */}
            <div className="relative max-w-4xl mx-auto">
              {/* Video container with cyber frame */}
              <div className="relative bg-[#191818] rounded-xl border border-[#ffd700]/30 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent" />

                {/* Responsive 16:9 video embed */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Bottom accent bar - primary grey */}
                <div className="h-1 bg-gradient-to-r from-transparent via-[#191818] to-transparent" />
              </div>

              {/* Corner accents - gold top, grey bottom */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffd700] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffd700] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#2a2a2a] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#2a2a2a] rounded-br-lg" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogPostHero;
