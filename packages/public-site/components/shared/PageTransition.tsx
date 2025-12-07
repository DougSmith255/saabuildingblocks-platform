'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * PageTransition - Custom page transition effect
 *
 * Intercepts internal link clicks and applies a fade transition to main content.
 * Header, footer, star background remain static during transition.
 *
 * How it works:
 * 1. Listens for clicks on internal links (same-origin, not hash-only)
 * 2. On click: prevents default, fades out #main-content
 * 3. After fade-out completes, uses Next.js router for client-side navigation
 * 4. On new page render, content fades in via CSS animation
 *
 * Uses Next.js router.push() instead of window.location.href to maintain
 * client-side navigation. This keeps the star background and other layout
 * elements mounted between page transitions.
 */
export function PageTransition() {
  const router = useRouter();
  const isTransitioning = useRef(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't intercept if already transitioning
      if (isTransitioning.current) return;

      // Find the closest anchor element
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      let href = link.getAttribute('href');
      if (!href) return;

      // Convert absolute same-origin URLs to relative paths
      // This ensures router.push() works correctly with static export
      if (href.startsWith(window.location.origin)) {
        href = href.slice(window.location.origin.length) || '/';
      }

      // Skip external links (different origin)
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return;
      }

      // Skip hash-only links and special links
      if (
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

      // Skip if clicking on the same page we're already on
      const currentPath = window.location.pathname;
      const targetPath = href.split('?')[0].split('#')[0]; // Remove query/hash
      if (currentPath === targetPath || currentPath === targetPath + '/' || currentPath + '/' === targetPath) {
        return; // Don't transition, just let normal behavior happen (or do nothing)
      }

      // Get main content element
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      // Prevent default navigation
      e.preventDefault();
      isTransitioning.current = true;

      // Fade out main content
      mainContent.style.transition = 'opacity 150ms ease-out';
      mainContent.style.opacity = '0';

      // Navigate after fade completes using Next.js router (keeps layout mounted)
      setTimeout(() => {
        router.push(href);
        // Reset transition state after navigation starts
        setTimeout(() => {
          isTransitioning.current = false;
        }, 100);
      }, 150);
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  return null;
}

export default PageTransition;
