'use client';

import { useEffect } from 'react';

/**
 * ScrollPerformanceOptimizer
 *
 * Pauses CSS animations during scroll for smooth 60fps scrolling on all devices.
 * When user stops scrolling, animations resume after a short delay.
 *
 * How it works:
 * - Adds 'is-scrolling' class to document.body during scroll
 * - CSS rules pause star background animations when this class is present
 * - Animations resume 150ms after scroll stops
 * - Works on both mobile and desktop for buttery smooth scrolling
 */
export function ScrollPerformanceOptimizer() {
  useEffect(() => {
    // Apply on all devices for smooth scrolling

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
