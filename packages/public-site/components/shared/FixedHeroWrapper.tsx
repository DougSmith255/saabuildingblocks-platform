'use client';

import { ReactNode } from 'react';
import { HeroSettlingMask } from './HeroSettlingMask';

interface FixedHeroWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * FixedHeroWrapper - Simple hero section wrapper with layout shift prevention
 *
 * Features:
 * - Hero scrolls naturally with the page
 * - Smooth scroll (Lenis) provides the nice scrolling feel
 * - HeroSettlingMask hides layout shift during JS hydration
 * - Much better performance and less confusing UX
 */
export function FixedHeroWrapper({ children, className = '' }: FixedHeroWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <HeroSettlingMask />
      {children}
    </div>
  );
}
