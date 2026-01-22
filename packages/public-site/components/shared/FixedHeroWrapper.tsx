'use client';

import { ReactNode } from 'react';

interface FixedHeroWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * FixedHeroWrapper - Simple hero section wrapper
 *
 * Previously created a pinned parallax effect, now simplified to:
 * - Hero scrolls naturally with the page
 * - Smooth scroll (Lenis) provides the nice scrolling feel
 * - No pinning, no fade/blur/scale animations
 * - Much better performance and less confusing UX
 */
export function FixedHeroWrapper({ children, className = '' }: FixedHeroWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
