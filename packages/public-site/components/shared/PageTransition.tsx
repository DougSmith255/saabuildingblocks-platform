'use client';

import { useEffect, useRef } from 'react';

/**
 * PageTransition - Custom page transition effect
 *
 * Intercepts internal link clicks and applies a fade transition to main content.
 * Header, footer, and background remain static during transition.
 *
 * How it works:
 * 1. Listens for clicks on internal links (same-origin, not hash-only)
 * 2. On click: prevents default, fades out #main-content
 * 3. After fade-out completes, navigates to new page
 * 4. On new page load, content fades in via CSS animation
 *
 * Works in ALL browsers - uses simple CSS opacity transitions.
 */
export function PageTransition() {
  const isTransitioning = useRef(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't intercept if already transitioning
      if (isTransitioning.current) return;

      // Find the closest anchor element
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip external links, hash-only links, and special links
      if (
        href.startsWith('http') && !href.startsWith(window.location.origin) ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.hasAttribute('download') ||
        link.target === '_blank'
      ) {
        return;
      }

      // Skip if modifier keys are pressed (user wants new tab/window)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // Get main content element
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      // Prevent default navigation
      e.preventDefault();
      isTransitioning.current = true;

      // Fade out main content
      mainContent.style.transition = 'opacity 150ms ease-out';
      mainContent.style.opacity = '0';

      // Navigate after fade completes
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}

export default PageTransition;
