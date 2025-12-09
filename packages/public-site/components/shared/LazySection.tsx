'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { SectionSkeleton } from './SectionSkeleton';

/**
 * LazySection - Defers rendering of section content until near viewport
 *
 * Unlike dynamic() which code-splits at build time, this component
 * defers RENDERING of already-loaded code until the section is
 * near the viewport. Use this for inline sections that aren't
 * extracted into separate component files.
 *
 * For imported components, prefer dynamic() with SectionSkeleton.
 * For inline sections, use this wrapper.
 *
 * Features:
 * - Defers rendering until 200px before viewport
 * - Shows shimmer skeleton during load
 * - Smooth fade-in when content renders
 * - Configurable skeleton height
 *
 * Usage:
 * <LazySection height={600}>
 *   <section className="py-16">
 *     <H2>Section Title</H2>
 *     <p>Content...</p>
 *   </section>
 * </LazySection>
 */

interface LazySectionProps {
  children: ReactNode;
  /** Approximate height for skeleton placeholder */
  height: number;
  /** How far before viewport to start rendering (default: 200px) */
  rootMargin?: string;
  /** Optional className for the wrapper */
  className?: string;
}

export function LazySection({
  children,
  height,
  rootMargin = '200px',
  className = '',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  // Trigger fade-in after content renders
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        setHasRendered(true);
      });
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        <div
          style={{
            opacity: hasRendered ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
        >
          {children}
        </div>
      ) : (
        <SectionSkeleton height={height} />
      )}
    </div>
  );
}

export default LazySection;
