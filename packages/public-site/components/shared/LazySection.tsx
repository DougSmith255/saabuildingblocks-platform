'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

/**
 * LazySection - Defers rendering of section content until near viewport
 *
 * CLS-OPTIMIZED: Renders nothing during SSR to prevent page height issues.
 * Content only renders after client-side hydration when section is in/near viewport.
 *
 * Features:
 * - Renders nothing during SSR (no skeleton = no CLS from page height)
 * - Uses IntersectionObserver to detect when section is near viewport
 * - Smooth fade-in when content renders
 * - Content loads when 200px before entering viewport
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
  /** Approximate height - used for scroll calculations, not rendered */
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
  // Start as false - nothing renders during SSR
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mark as mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted, rootMargin]);

  // Trigger fade-in after content renders
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        setHasRendered(true);
      });
    }
  }, [isVisible]);

  // During SSR or before mount, render nothing (no height contribution)
  if (!isMounted) {
    return null;
  }

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
      ) : null}
    </div>
  );
}

export default LazySection;
