'use client';

/**
 * RegularPostTemplate Component
 * Production-ready blog post template with Master Controller integration
 *
 * Features:
 * - Master Controller CSS integration via useLiveCSS pattern
 * - SAA component library (CTAButton, CyberCardHolographic)
 * - Performance-optimized scroll animations
 * - Accessible markup with semantic HTML
 * - SEO-friendly structure
 * - Responsive typography using clamp()
 * - Brand colors (#ffd700 gold, #e5e4dd white, NO GREEN)
 *
 * Architecture:
 * - Client component ('use client')
 * - Integrates with MasterControllerProvider for CSS injection
 * - Reuses existing blog components (CategoryBadge, ShareButtons, etc.)
 * - Follows AI Agent Page Building Protocol
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CTAButton } from '@/components/saa';
// TODO: Blog components not yet migrated to monorepo
// import { CategoryBadge } from '@/components/blog/CategoryBadge';
// import { ShareButtons } from '@/components/blog/ShareButtons';
// import { RelatedPosts } from '@/components/blog/RelatedPosts';
// import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import type { BlogPost } from '@/lib/wordpress/types';

/**
 * Template Props Interface
 */
export interface RegularPostTemplateProps {
  /** Main blog post data */
  post: BlogPost;
  /** Related posts for recommendations */
  relatedPosts?: BlogPost[];
  /** Primary category for breadcrumbs */
  primaryCategory?: string;
  /** Primary category name (formatted) */
  primaryCategoryName?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * useLiveCSS Hook
 * Ensures Master Controller CSS is injected before component renders
 * Pattern matches MasterControllerProvider implementation
 */
function useLiveCSS() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for CSS to be injected by MasterControllerProvider
    // Check if style element exists
    const checkCSS = () => {
      const styleElement = document.getElementById('master-controller-vars');
      if (styleElement) {
        setIsReady(true);
      } else {
        // Retry after short delay
        setTimeout(checkCSS, 50);
      }
    };

    checkCSS();
  }, []);

  return isReady;
}

/**
 * useScrollAnimation Hook
 * Subtle, performant scroll-triggered fade-in animations
 * Uses IntersectionObserver for performance
 */
function useScrollAnimation() {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            // Unobserve after animation triggers (performance optimization)
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before entering viewport
      }
    );

    // Observe all registered elements
    elementsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const registerElement = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return { registerElement };
}

/**
 * RegularPostTemplate Component
 * Main blog post template with all sections
 */
export function RegularPostTemplate({
  post,
  relatedPosts = [],
  primaryCategory,
  primaryCategoryName,
  className = '',
}: RegularPostTemplateProps) {
  const cssReady = useLiveCSS();
  const { registerElement } = useScrollAnimation();

  // Don't render until CSS is ready (prevent FOUC)
  if (!cssReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#dcdbd5] font-[var(--font-amulya)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-[#dcdbd5] ${className}`}>
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Button Section */}
        <div className="mb-8" ref={registerElement}>
          <CTAButton href="/blog">
            ← BACK TO BLOG
          </CTAButton>
        </div>

        {/* Breadcrumbs Section */}
        {/* TODO: Restore when Breadcrumbs component is migrated */}
        {/* {primaryCategory && primaryCategoryName && (
          <div className="mb-8" ref={registerElement}>
            <Breadcrumbs
              category={primaryCategoryName}
              categorySlug={primaryCategory}
              postTitle={post.title}
            />
          </div>
        )} */}

        {/* Featured Image Section */}
        {post.featuredImage && (
          <div
            className="relative mb-8 overflow-hidden rounded-lg border border-[#e5e4dd]/20 h-96 group"
            ref={registerElement}
          >
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              quality={90}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Categories Section */}
        {/* TODO: Restore when CategoryBadge component is migrated */}
        {/* {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6" ref={registerElement}>
            {post.categories.map((category, idx) => (
              <CategoryBadge key={idx} category={category} variant="featured" />
            ))}
          </div>
        )} */}

        {/* Title Section - H1 auto-applies display font (Taskor) */}
        <h1
          className="text-[clamp(2rem,2.5vw+0.5rem,3rem)] mb-6 text-[#e5e4dd] leading-[1.2]"
          ref={registerElement}
        >
          {post.title}
        </h1>

        {/* Meta Information Section */}
        <div
          className="flex flex-wrap items-center gap-4 mb-8 text-sm text-[#dcdbd5]/70 pb-8 border-b border-[#e5e4dd]/20"
          ref={registerElement}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#ffd700] font-[var(--font-taskor)] uppercase tracking-wider">By</span>
            <span className="text-[#e5e4dd] font-[var(--font-amulya)]">{post.author.name}</span>
          </div>
          <span className="text-[#e5e4dd]/30">•</span>
          <time
            dateTime={post.date}
            className="text-[#dcdbd5] font-[var(--font-amulya)]"
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.modified && post.modified !== post.date && (
            <>
              <span className="text-[#e5e4dd]/30">•</span>
              <span className="text-[#dcdbd5]/50 font-[var(--font-amulya)] text-xs">
                Updated {new Date(post.modified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>

        {/* Excerpt Callout Section */}
        {post.excerpt && (
          <div
            className="mb-8 p-6 border-l-4 border-[#ffd700] bg-[#ffd700]/5 rounded-r-lg backdrop-blur-sm"
            ref={registerElement}
          >
            <div
              className="text-lg italic text-[#dcdbd5] font-[var(--font-amulya)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </div>
        )}

        {/* Main Content Section */}
        <div
          className="prose prose-invert max-w-none mb-12 font-[var(--font-amulya)]"
          ref={registerElement}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Buttons Section */}
        {/* TODO: Restore when ShareButtons component is migrated */}
        {/* <div ref={registerElement}>
          <ShareButtons
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        </div> */}

        {/* Related Posts Section */}
        {/* TODO: Restore when RelatedPosts component is migrated */}
        {/* {relatedPosts.length > 0 && (
          <div ref={registerElement}>
            <RelatedPosts
              posts={relatedPosts}
              currentPostId={post.id}
              currentCategory={primaryCategory}
              limit={4}
            />
          </div>
        )} */}

        {/* Bottom CTA Section */}
        <div
          className="mt-16 pt-8 border-t border-[#e5e4dd]/20 text-center"
          ref={registerElement}
        >
          <p className="text-[#dcdbd5] mb-6 font-[var(--font-amulya)] text-lg">
            Want to read more articles?
          </p>
          <CTAButton href="/blog">
            VIEW ALL POSTS
          </CTAButton>
        </div>
      </article>

      {/* Inline Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Ensure elements are hidden before animation */
        [ref] {
          opacity: 0;
        }

        /* Prose styles for WordPress content */
        .prose {
          color: var(--text-color-body, #dcdbd5);
          font-family: var(--font-family-body, var(--font-amulya), serif);
        }

        .prose h2 {
          color: var(--text-color-h2, #e5e4dd);
          font-family: var(--font-family-h2, var(--font-taskor), sans-serif);
          font-size: var(--font-size-h2, clamp(1.75rem, 2vw + 0.5rem, 2.25rem));
          line-height: var(--line-height-h2, 1.3);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose h3 {
          color: var(--text-color-h3, #e5e4dd);
          font-family: var(--font-family-h3, var(--font-taskor), sans-serif);
          font-size: var(--font-size-h3, clamp(1.5rem, 1.75vw + 0.5rem, 1.875rem));
          line-height: var(--line-height-h3, 1.4);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .prose h4, .prose h5, .prose h6 {
          color: var(--text-color-h4, #e5e4dd);
          font-family: var(--font-family-h4, var(--font-taskor), sans-serif);
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .prose p {
          margin-bottom: 1.25rem;
          line-height: 1.7;
        }

        .prose a {
          color: var(--text-color-link, #00ff88);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
          transition: color 0.2s ease;
        }

        .prose a:hover {
          color: #ffd700;
          border-bottom-color: #ffd700;
        }

        .prose ul, .prose ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
        }

        .prose blockquote {
          border-left: 4px solid #ffd700;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--text-color-quote, #dcdbd5);
          font-family: var(--font-family-quote, var(--font-amulya), serif);
        }

        .prose code {
          background: rgba(255, 215, 0, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: var(--font-synonym, monospace);
          font-size: 0.9em;
          color: #ffd700;
        }

        .prose pre {
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .prose pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
        }

        .prose img {
          border-radius: 0.5rem;
          border: 1px solid rgba(229, 228, 221, 0.2);
          margin: 1.5rem 0;
        }

        .prose strong {
          color: #e5e4dd;
          font-weight: 700;
        }

        .prose em {
          font-style: italic;
        }

        .prose hr {
          border: none;
          border-top: 1px solid rgba(229, 228, 221, 0.2);
          margin: 2rem 0;
        }

        /* Table styles */
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .prose th, .prose td {
          border: 1px solid rgba(229, 228, 221, 0.2);
          padding: 0.75rem;
          text-align: left;
        }

        .prose th {
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
