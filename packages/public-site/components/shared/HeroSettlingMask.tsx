'use client';

import { useState, useEffect } from 'react';
import { useViewport } from '@/contexts/ViewportContext';

/**
 * HeroSettlingMask - Hides layout shift during JS hydration
 *
 * Problem: JS positioning calculations cause layout shift on hard refresh
 * Solution: Cover the hero with a matching background until positioning settles
 *
 * How it works:
 * 1. Starts fully opaque (matches page background)
 * 2. Waits for hasMounted (JS hydration complete)
 * 3. Adds tiny delay for layout to settle
 * 4. Fades out smoothly
 * 5. Sets pointer-events: none so it doesn't block interaction
 */
export function HeroSettlingMask() {
  const { hasMounted } = useViewport();
  const [isSettled, setIsSettled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      // Wait for next frame + tiny delay for layout calculations to complete
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsSettled(true);
          // After fade animation, completely hide
          setTimeout(() => {
            setIsHidden(true);
          }, 350); // Match transition duration
        }, 50); // Small delay for layout to settle
      });
    }
  }, [hasMounted]);

  // Don't render anything after fully hidden
  if (isHidden) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000, // Below header (10010) but above all hero content
        backgroundColor: '#0a0a0a', // Match page background exactly
        opacity: isSettled ? 0 : 1,
        transition: 'opacity 300ms ease-out',
        pointerEvents: 'none', // Don't block interactions during fade
      }}
    />
  );
}
