'use client';

import { ReactNode } from 'react';

interface StickyHeroWrapperProps {
  children: ReactNode;
  className?: string;
  /** @deprecated No longer used - kept for backwards compatibility */
  fadeSpeed?: number;
}

/**
 * StickyHeroWrapper - Simple hero section wrapper
 *
 * Previously created a pinned parallax effect with fade/blur/scale,
 * now simplified to:
 * - Hero scrolls naturally with the page
 * - Smooth scroll (Lenis) provides the nice scrolling feel
 * - No pinning, no fade/blur/scale animations
 * - Much better performance and less confusing UX
 */
export function StickyHeroWrapper({ children, className = '' }: StickyHeroWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
