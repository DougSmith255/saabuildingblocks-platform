'use client';

import { useState, useEffect, ReactNode } from 'react';

interface DeferredEffectProps {
  children: ReactNode;
  delay?: number; // Milliseconds to wait before rendering
}

/**
 * DeferredEffect - Delays rendering of hero effects until after initial paint
 *
 * This ensures that visual effects don't block:
 * - LCP (Largest Contentful Paint)
 * - FCP (First Contentful Paint)
 * - TBT (Total Blocking Time)
 *
 * Effects will render after the initial frame, appearing smoothly without
 * impacting Page Speed Insights scores.
 */
export function DeferredEffect({ children, delay = 0 }: DeferredEffectProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback if available, otherwise requestAnimationFrame
    // This ensures effects load during browser idle time
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(() => {
        if (delay > 0) {
          setTimeout(() => setShouldRender(true), delay);
        } else {
          setShouldRender(true);
        }
      }, { timeout: 1000 }); // Max 1 second wait

      return () => (window as any).cancelIdleCallback(id);
    } else {
      // Fallback: use double RAF to ensure we're after first paint
      let rafId: number;
      requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          if (delay > 0) {
            setTimeout(() => setShouldRender(true), delay);
          } else {
            setShouldRender(true);
          }
        });
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [delay]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
