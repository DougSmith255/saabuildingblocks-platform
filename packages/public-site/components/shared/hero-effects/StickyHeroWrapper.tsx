'use client';

import { ReactNode } from 'react';
import { HeroSettlingMask } from '../HeroSettlingMask';

interface StickyHeroWrapperProps {
  children: ReactNode;
  className?: string;
  /** @deprecated No longer used - kept for backwards compatibility */
  fadeSpeed?: number;
}

/**
 * StickyHeroWrapper - Simple hero section wrapper with layout shift prevention
 *
 * Previously created a pinned parallax effect with fade/blur/scale,
 * now simplified to:
 * - Hero scrolls naturally with the page
 * - Smooth scroll (Lenis) provides the nice scrolling feel
 * - HeroSettlingMask hides layout shift during JS hydration
 * - Much better performance and less confusing UX
 */
export function StickyHeroWrapper({ children, className = '' }: StickyHeroWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <HeroSettlingMask />
      {children}
    </div>
  );
}
