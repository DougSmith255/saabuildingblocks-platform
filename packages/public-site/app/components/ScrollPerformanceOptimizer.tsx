'use client';

import { useEffect } from 'react';

/**
 * ScrollPerformanceOptimizer
 *
 * Pauses CSS animations during scroll on mobile devices for smooth 60fps scrolling.
 * When user stops scrolling, animations resume after a short delay.
 *
 * How it works:
 * - Adds 'is-scrolling' class to document.body during scroll
 * - CSS rules pause animations when this class is present
 * - Animations resume 150ms after scroll stops
 * - Only active on mobile/touch devices (hover: none)
 */
export function ScrollPerformanceOptimizer() {
  useEffect(() => {
    // Only apply on mobile/touch devices
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isMobile = window.innerWidth < 1024;

    if (!isTouchDevice && !isMobile) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
          // Add scrolling class immediately
          if (!document.body.classList.contains('is-scrolling')) {
            document.body.classList.add('is-scrolling');
          }

          // Clear existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          // Remove scrolling class after scroll stops (150ms delay)
          scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
          }, 150);

          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      document.body.classList.remove('is-scrolling');
    };
  }, []);

  return null; // This component doesn't render anything
}
