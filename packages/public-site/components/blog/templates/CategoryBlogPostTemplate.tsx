'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { BlogPostHero } from '../BlogPostHero';
import { RelatedPosts } from '../RelatedPosts';
import { ShareButtons } from '@saa/shared/components/saa/interactive';
import { CyberFrame, YouTubeFacade } from '@saa/shared/components/saa/media';
import { Breadcrumbs } from '../Breadcrumbs';
import { getTemplateConfig, type CategoryTemplateConfig } from './templateConfig';
import { LazySection } from '@/components/shared/LazySection';
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


/**
 * BlogContentRenderer - Renders blog content with H2 word wrapping
 * School CTA buttons are styled via CSS to look like SecondaryButton
 * Also handles RankMath FAQ accordion toggle functionality
 */
function BlogContentRenderer({ html }: { html: string }) {
  const processedHtml = processH2WordWrapping(html);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Add FAQ accordion toggle functionality
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const faqQuestions = container.querySelectorAll('.rank-math-question');

    const handleClick = (e: Event) => {
      const question = e.currentTarget as HTMLElement;
      const faqItem = question.closest('.rank-math-faq-item');
      if (faqItem) {
        const isCurrentlyOpen = faqItem.classList.contains('is-open');
        // Close all other FAQ items first
        container.querySelectorAll('.rank-math-faq-item.is-open').forEach((item) => {
          item.classList.remove('is-open');
        });
        // Toggle current item (open if it was closed)
        if (!isCurrentlyOpen) {
          faqItem.classList.add('is-open');
        }
      }
    };

    faqQuestions.forEach((question) => {
      question.addEventListener('click', handleClick);
    });

    // Cleanup
    return () => {
      faqQuestions.forEach((question) => {
        question.removeEventListener('click', handleClick);
      });
    };
  }, [html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: processedHtml }} />;
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
  const [showComparisonCharts, setShowComparisonCharts] = useState(false);

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
          featuredImage={categorySlug === 'real-estate-schools' ? post.featuredImage?.url : undefined}
          featuredImageMaxHeight={templateConfig.heroImageMaxHeight}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Comparison Images - Collapsible accordion for brokerage comparison posts ONLY */}
      {post.comparisonImages && post.comparisonImages.length > 0 && categorySlug === 'brokerage-comparison' && (
        <LazySection height={100}>
          <section className="relative py-6 md:py-8 px-4 sm:px-8 md:px-12">
            <div className="max-w-[1900px] mx-auto">
              <div className="max-w-[1200px] mx-auto">
                {/* Accordion Button */}
                <button
                  onClick={() => setShowComparisonCharts(!showComparisonCharts)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 rounded-lg transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(50,50,50,0.5) 100%)',
                    border: '1px solid rgba(150,150,150,0.3)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.4)',
                  }}
                  aria-expanded={showComparisonCharts}
                >
                  <span
                    className="text-lg font-semibold tracking-wide"
                    style={{
                      fontFamily: 'var(--font-taskor, sans-serif)',
                      color: '#ffd700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    View Comparison Charts
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 ${showComparisonCharts ? 'rotate-180' : ''}`}
                    style={{ color: '#ffd700' }}
                  />
                </button>

                {/* Collapsible Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    showComparisonCharts ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`grid gap-6 ${post.comparisonImages.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {post.comparisonImages.map((img, idx) => (
                      <div key={idx} className="flex justify-center">
                        <CyberFrame>
                          <Image
                            src={img.url}
                            alt={img.alt || img.title || `Comparison chart ${idx + 1}`}
                            width={580}
                            height={470}
                            sizes="(max-width: 1024px) 90vw, 580px"
                            className="object-contain w-full h-auto"
                            priority={false}
                          />
                        </CyberFrame>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </LazySection>
      )}

      {/* YouTube Video Embed */}
      {showVideoSection && hasVideo && (
        <LazySection height={400}>
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
        </LazySection>
      )}

      {/* Main Content */}
      <LazySection height={600}>
        <section className="relative py-8 md:py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-[1200px] mx-auto">
              <div className="blog-content max-w-none">
                {/* Featured Image - only shown in hero for real-estate-schools category */}
                {/* For other categories, show featured image floated right in content */}
                {post.featuredImage?.url && categorySlug !== 'real-estate-schools' && (
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
                <BlogContentRenderer html={post.content} />
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
                url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${categorySlug}/${post.slug}` : `/blog/${categorySlug}/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt}
              />
            </div>
          </div>
        </section>
      </LazySection>

      {/* Related Posts */}
      {limitedRelatedPosts.length > 0 && (
        <LazySection height={400}>
          <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
            <div className="max-w-[1900px] mx-auto">
              <RelatedPosts
                posts={limitedRelatedPosts}
                currentPostId={post.id}
                currentCategory={primaryCategory}
              />
            </div>
          </section>
        </LazySection>
      )}
    </article>
  );
}

export default CategoryBlogPostTemplate;
