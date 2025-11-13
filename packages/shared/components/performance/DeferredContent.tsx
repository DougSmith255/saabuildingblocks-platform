'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';

/**
 * DeferredContent Component
 *
 * Delays loading of non-critical content to improve Core Web Vitals (LCP, FID, CLS).
 * Works with static site exports - all logic runs client-side after initial render.
 *
 * STRATEGIES:
 * - viewport: Load when user scrolls near the content (best for footers, below-fold sections)
 * - time: Load after specified delay (good for predictable behavior)
 * - idle: Load when browser is idle (smart but Safari needs polyfill)
 *
 * USAGE:
 * ```tsx
 * <DeferredContent strategy="viewport" rootMargin="200px">
 *   <Footer />
 * </DeferredContent>
 * ```
 *
 * @see /home/claude-flow/📘-PAGE-BUILDER-GUIDE.md for full documentation
 */

export type DeferStrategy = 'viewport' | 'time' | 'idle';

export interface DeferredContentProps {
  children: ReactNode;
  strategy?: DeferStrategy;

  // Viewport strategy options
  rootMargin?: string; // How far before viewport to start loading (default: "200px")

  // Time strategy options
  delay?: number; // Delay in milliseconds (default: 1000)

  // Placeholder while loading
  placeholder?: ReactNode;

  // Callback when content loads
  onLoad?: () => void;
}

export function DeferredContent({
  children,
  strategy = 'viewport',
  rootMargin = '200px',
  delay = 1000,
  placeholder,
  onLoad,
}: DeferredContentProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    switch (strategy) {
      case 'viewport':
        cleanup = setupViewportStrategy();
        break;
      case 'time':
        cleanup = setupTimeStrategy();
        break;
      case 'idle':
        cleanup = setupIdleStrategy();
        break;
    }

    return () => cleanup?.();
  }, [strategy, rootMargin, delay]);

  /**
   * Viewport Strategy: Load when user scrolls near content
   * Best for: Footer, testimonials, below-fold sections
   */
  function setupViewportStrategy(): () => void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          onLoad?.();
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }

  /**
   * Time Strategy: Load after specified delay
   * Best for: Predictable loading, simple implementation
   */
  function setupTimeStrategy(): () => void {
    let timeoutId: NodeJS.Timeout;

    // Wait for page load to complete first
    if (document.readyState === 'complete') {
      timeoutId = setTimeout(() => {
        setShouldRender(true);
        onLoad?.();
      }, delay);
    } else {
      const handleLoad = () => {
        timeoutId = setTimeout(() => {
          setShouldRender(true);
          onLoad?.();
        }, delay);
      };
      window.addEventListener('load', handleLoad, { once: true });

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }

  /**
   * Idle Strategy: Load when browser is idle
   * Best for: Smart loading without blocking main thread
   * Note: Safari doesn't support requestIdleCallback, uses setTimeout fallback
   */
  function setupIdleStrategy(): () => void {
    let idleId: number;

    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(() => {
        setShouldRender(true);
        onLoad?.();
      }, { timeout: 2000 }); // Fallback to 2s if browser never idles
    } else {
      // Safari fallback - use setTimeout
      const timeoutId = setTimeout(() => {
        setShouldRender(true);
        onLoad?.();
      }, delay);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(idleId);
      }
    };
  }

  // For viewport strategy, we need the trigger div even when not rendered
  if (strategy === 'viewport' && !shouldRender) {
    return (
      <>
        <div ref={triggerRef} className="h-0 w-full" aria-hidden="true" />
        {placeholder}
      </>
    );
  }

  // For other strategies, just show placeholder
  if (!shouldRender) {
    return <>{placeholder}</>;
  }

  return <>{children}</>;
}

/**
 * Pre-configured DeferredFooter component
 * Use this for consistent footer deferring across all pages
 */
export function DeferredFooter({ children }: { children: ReactNode }) {
  return (
    <DeferredContent
      strategy="viewport"
      rootMargin="200px"
      placeholder={<div className="h-[400px] bg-transparent" aria-hidden="true" />}
    >
      {children}
    </DeferredContent>
  );
}

/**
 * Pre-configured DeferredSection component
 * Use this for generic below-fold sections
 */
export function DeferredSection({
  children,
  height = '500px'
}: {
  children: ReactNode;
  height?: string;
}) {
  return (
    <DeferredContent
      strategy="viewport"
      rootMargin="100px"
      placeholder={<div style={{ height }} className="bg-transparent" aria-hidden="true" />}
    >
      {children}
    </DeferredContent>
  );
}
