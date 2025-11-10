'use client';

import { useEffect } from 'react';

/**
 * Client component to trigger wolf pack fade animation after page is ready
 * Prevents the animation from starting during page load (before visible)
 */
export function WolfPackAnimation() {
  useEffect(() => {
    // Wait for page to be fully ready and visible
    const triggerAnimation = () => {
      const wolfPack = document.querySelector('.hero-animate-bg');
      if (wolfPack) {
        // Add animation class to start the fade
        wolfPack.classList.add('animate-in');
      }
    };

    // Trigger after a tiny delay to ensure page is painted
    requestAnimationFrame(() => {
      setTimeout(triggerAnimation, 50);
    });
  }, []);

  return null;
}
