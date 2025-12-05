'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BlogPostHero } from '../BlogPostHero';
import { RelatedPosts } from '../RelatedPosts';
import { ShareButtons } from '@saa/shared/components/saa/interactive';
import { CyberFrame, YouTubeFacade } from '@saa/shared/components/saa/media';
import { Breadcrumbs } from '../Breadcrumbs';
import { getTemplateConfig, type CategoryTemplateConfig } from './templateConfig';
import type { BlogPost } from '@/lib/wordpress/types';

// Lazy load CloudBackground - only loaded when user switches to light mode
const CloudBackground = dynamic(
  () => import('@/components/shared/CloudBackground'),
  { ssr: false }
);

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Process HTML content to wrap H2 words in spans for per-word metal plate styling
 */
function processH2WordWrapping(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, content) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const wrappedWords = plainText.split(/\s+/).map((word: string) =>
      `<span class="h2-word">${word}</span>`
    ).join(' ');
    return `<h2${attrs}>${wrappedWords}</h2>`;
  });
}

export interface CategoryBlogPostTemplateProps {
  /** The blog post data */
  post: BlogPost;
  /** Related posts to display */
  relatedPosts?: BlogPost[];
  /** Category for template customization (optional, defaults to post.categories[0]) */
  category?: string;
}

/**
 * CategoryBlogPostTemplate - Category-aware blog post template
 *
 * Extends BlogPostTemplate with category-specific customizations:
 * - Custom accent colors
 * - Category-specific CTAs
 * - Custom related posts limits
 * - Category CSS classes for styling hooks
 *
 * Each category can be further customized by editing the config in templateConfig.ts
 */
export function CategoryBlogPostTemplate({
  post,
  relatedPosts = [],
  category,
}: CategoryBlogPostTemplateProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'to-light' | 'to-dark' | null>(null);

  // Get category from prop or post
  const primaryCategory = category || post.categories[0] || 'Uncategorized';

  // Get template config for this category
  const templateConfig = getTemplateConfig(primaryCategory);

  // Reset to dark mode when navigating away
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('light-mode');
      }
    };
  }, []);

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle theme change with blur transition
  const handleThemeChange = useCallback((isDark: boolean) => {
    setTransitionDirection(isDark ? 'to-dark' : 'to-light');
    setIsTransitioning(true);

    setTimeout(() => {
      setIsDarkMode(isDark);
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('light-mode', !isDark);
      }

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
    }, 150);
  }, []);

  // Build category slug
  const categorySlug = primaryCategory.toLowerCase().replace(/\s+/g, '-');

  // Limit related posts based on config
  const limitedRelatedPosts = relatedPosts.slice(0, templateConfig.relatedPostsLimit || 3);

  // Check if video should be emphasized
  const hasVideo = post.youtubeVideoUrl && extractYouTubeVideoId(post.youtubeVideoUrl);
  const showVideoSection = hasVideo && (templateConfig.emphasizeVideo || true);

  return (
    <article
      className={`blog-post ${isDarkMode ? 'dark-mode' : 'light-mode'} ${templateConfig.customClassName || ''}`}
      style={{
        '--category-accent': templateConfig.accentColor,
        '--category-accent-secondary': templateConfig.accentColorSecondary,
      } as React.CSSProperties}
    >
      {/* Theme transition blur overlay */}
      <div
        className={`theme-transition-overlay ${isTransitioning ? 'active' : ''} ${transitionDirection || ''}`}
        aria-hidden="true"
      />

      {/* Hero Section with Cloud Background */}
      <div className="relative">
        {!isDarkMode && <CloudBackground />}

        {/* Breadcrumbs */}
        <div className="relative z-10 px-4 sm:px-8 md:px-12 pt-[calc(var(--header-height)+1.625rem)]">
          <div className="max-w-[1900px] mx-auto">
            <Breadcrumbs
              category={primaryCategory}
              categorySlug={categorySlug}
              postTitle={post.title}
            />
          </div>
        </div>

        <BlogPostHero
          title={post.title}
          category={primaryCategory}
          author={post.author.name}
          date={formattedDate}
          content={post.content}
          youtubeVideoUrl={post.youtubeVideoUrl}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Comparison Images - Displayed for brokerage vs brokerage posts */}
      {post.comparisonImages && post.comparisonImages.length > 0 && (
        <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1400px] mx-auto">
              <div className={`grid gap-8 ${post.comparisonImages.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {post.comparisonImages.map((img, idx) => (
                  <div key={idx} className="flex justify-center">
                    <CyberFrame>
                      <Image
                        src={img.url}
                        alt={img.alt || img.title || `Comparison chart ${idx + 1}`}
                        width={680}
                        height={550}
                        sizes="(max-width: 1024px) 90vw, 680px"
                        className="object-contain w-full h-auto"
                        priority={idx < 2}
                      />
                    </CyberFrame>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Video Embed */}
      {showVideoSection && hasVideo && (
        <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1200px] mx-auto">
              <CyberFrame isVideo aspectRatio="16/9" className="w-full">
                <YouTubeFacade
                  videoId={hasVideo}
                  title={`Video: ${post.title}`}
                />
              </CyberFrame>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="max-w-[1200px] mx-auto">
            <div className="blog-content prose prose-invert max-w-none">
              {/* Featured Image - max-height 270px */}
              {post.featuredImage?.url && (
                <div className="float-right ml-6 mb-4" style={{ maxHeight: '270px' }}>
                  <CyberFrame>
                    <div className="relative" style={{ maxHeight: '270px' }}>
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        width={480}
                        height={270}
                        sizes="(max-width: 768px) 100vw, 480px"
                        className="object-contain"
                        style={{ maxHeight: '270px', width: 'auto', height: 'auto' }}
                        priority
                      />
                    </div>
                  </CyberFrame>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: processH2WordWrapping(post.content) }} />
            </div>

            {/* Category-specific CTA (if configured) */}
            {templateConfig.ctaText && templateConfig.ctaLink && (
              <div className="mt-12 mb-8 text-center">
                <a
                  href={templateConfig.ctaLink}
                  className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${templateConfig.accentColor}, ${templateConfig.accentColorSecondary})`,
                    color: '#000',
                    boxShadow: `0 4px 15px ${templateConfig.accentColor}40`,
                  }}
                >
                  {templateConfig.ctaText}
                </a>
              </div>
            )}

            {/* Share Buttons */}
            <ShareButtons
              url={`https://saabuildingblocks.com/blog/${post.slug}`}
              title={post.title}
              excerpt={post.excerpt}
            />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {limitedRelatedPosts.length > 0 && (
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <RelatedPosts
              posts={limitedRelatedPosts}
              currentPostId={post.id}
              currentCategory={primaryCategory}
            />
          </div>
        </section>
      )}
    </article>
  );
}

export default CategoryBlogPostTemplate;
