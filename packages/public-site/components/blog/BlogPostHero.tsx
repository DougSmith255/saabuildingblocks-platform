'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { H1, CyberFrame, YouTubeFacade, Icon3D } from '@saa/shared/components/saa';
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

  // Smooth fade-in animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Double RAF to ensure we're past initial paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  return (
    <section
      className="relative flex flex-col justify-center items-center px-4 sm:px-8 md:px-12"
      style={{
        // Height of the area below the header
        minHeight: 'calc(100dvh - var(--header-height, 85px))',
        // Shift content up by ~8% to position it slightly above true center
        paddingBottom: '8vh',
        boxSizing: 'border-box',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Hero background - uses star background by default */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}

      {/* Theme switch - positioned absolutely so it doesn't affect content centering */}
      <div className="absolute top-2 right-4 sm:top-4 sm:right-8 md:right-12 z-20">
        <ThemeSwitch onToggle={onThemeChange} />
      </div>

      {/* Content container - centered */}
      <div className="relative z-10 max-w-[1900px] mx-auto text-center">
        {/* Category badge - centered with 3D effect */}
        <div className="mb-6 flex justify-center">
          <CategoryBadge category={category} variant="featured" effect3d />
        </div>

        {/* Title - H1 with Master Controller effects, blog-specific sizing */}
        <div className="mb-8">
          <H1
            heroAnimate={true}
            style={{
              fontSize: 'clamp(32px, 4vw + 16px, 82px)',
            }}
          >
            {title}
          </H1>
        </div>

        {/* Meta info row - centered */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[#dcdbd5]">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Icon3D size={16}>
              <User className="w-4 h-4" />
            </Icon3D>
            <span className="text-sm font-[var(--font-amulya)]">{author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Icon3D size={16}>
              <Calendar className="w-4 h-4" />
            </Icon3D>
            <span className="text-sm font-[var(--font-amulya)]">{date}</span>
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <Icon3D size={16}>
              <Clock className="w-4 h-4" />
            </Icon3D>
            <span className="text-sm font-[var(--font-amulya)]">{readingTime}</span>
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
  );
}

export default BlogPostHero;
