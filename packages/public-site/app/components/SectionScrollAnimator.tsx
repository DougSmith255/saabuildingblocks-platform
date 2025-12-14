'use client';

import { useEffect } from 'react';

/**
 * SectionScrollAnimator - JavaScript-based scroll animations for sections
 *
 * Creates a "wheel" effect where sections:
 * - Enter: expand, blur, fade in from below
 * - Visible: normal state
 * - Exit: compress, blur, fade out above
 *
 * Works in ALL browsers (Chrome, Firefox, Safari, Edge)
 * Uses scroll position to calculate progress through viewport
 */
export function SectionScrollAnimator() {
  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Skip if body has no-section-transitions attribute
    if (document.body.hasAttribute('data-no-section-transitions')) {
      return;
    }

    // Find all sections inside main#main-content (excluding hero)
    const main = document.querySelector('main#main-content');
    if (!main) return;

    const sections = main.querySelectorAll('section:not([aria-label="Hero"])');
    if (sections.length === 0) return;

    // Mark sections for animation and set initial state
    sections.forEach((section) => {
      section.setAttribute('data-scroll-animate', '');
    });

    // Calculate animation values based on scroll position
    const updateSections = () => {
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;

        // Calculate how far through the viewport the section is
        // 0 = just entering from bottom, 1 = just exiting from top
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        // Entry progress: 0 when bottom at viewport bottom, 1 when fully visible
        // Section enters when its top crosses the bottom of viewport
        const entryStart = viewportHeight;
        const entryEnd = viewportHeight * 0.3; // Fully visible when top is 30% from bottom
        const entryProgress = Math.min(1, Math.max(0, (entryStart - sectionTop) / (entryStart - entryEnd)));

        // Exit progress: 0 when visible, 1 when exiting top
        // Section exits when its bottom crosses 30% from top
        const exitStart = viewportHeight * 0.3;
        const exitEnd = -sectionHeight * 0.3;
        const exitProgress = Math.min(1, Math.max(0, (exitStart - sectionBottom) / (exitStart - exitEnd)));

        // Determine which state we're in
        let opacity: number;
        let blur: number;
        let scale: number;
        let translateY: number;

        if (entryProgress < 1) {
          // Entering: fade in, unblur, scale down, move up
          opacity = entryProgress;
          blur = 8 * (1 - entryProgress);
          scale = 1.03 - (0.03 * entryProgress);
          translateY = 30 * (1 - entryProgress);
        } else if (exitProgress > 0) {
          // Exiting: fade out, blur, scale down, move up
          opacity = 1 - exitProgress;
          blur = 8 * exitProgress;
          scale = 1 - (0.03 * exitProgress);
          translateY = -30 * exitProgress;
        } else {
          // Fully visible: normal state
          opacity = 1;
          blur = 0;
          scale = 1;
          translateY = 0;
        }

        // Apply CSS variables
        const el = section as HTMLElement;
        el.style.setProperty('--section-opacity', String(opacity));
        el.style.setProperty('--section-blur', `${blur}px`);
        el.style.setProperty('--section-scale', String(scale));
        el.style.setProperty('--section-translate', `${translateY}px`);
      });
    };

    // Initial update
    updateSections();

    // Update on scroll with requestAnimationFrame for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateSections();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSections, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSections);
      // Clean up data attributes
      sections.forEach((section) => {
        section.removeAttribute('data-scroll-animate');
        const el = section as HTMLElement;
        el.style.removeProperty('--section-opacity');
        el.style.removeProperty('--section-blur');
        el.style.removeProperty('--section-scale');
        el.style.removeProperty('--section-translate');
      });
    };
  }, []);

  return null; // This component only adds behavior, no UI
}
