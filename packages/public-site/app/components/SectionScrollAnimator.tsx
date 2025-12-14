'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * SectionScrollAnimator - JavaScript-based scroll animations for sections
 *
 * Creates a "wheel" effect where sections:
 * - Enter: expand from larger scale, blur, fade in from below
 * - Visible: normal state
 * - Exit: compress to smaller scale, blur, fade out above
 *
 * Works in ALL browsers (Chrome, Firefox, Safari, Edge)
 * Updates every frame synced to scroll position (no CSS transitions)
 */
export function SectionScrollAnimator() {
  const sectionsRef = useRef<NodeListOf<Element> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Skip if body has no-section-transitions attribute
    if (document.body.hasAttribute('data-no-section-transitions')) {
      return;
    }

    // Initialize sections for animation
    const initializeSections = (): NodeListOf<Element> | null => {
      const main = document.querySelector('main#main-content');
      if (!main) return null;

      const sections = main.querySelectorAll('section:not([aria-label="Hero"])');
      if (sections.length === 0) return null;

      return sections;
    };

    // Calculate animation values based on scroll position
    const createUpdateFunction = (sections: NodeListOf<Element>) => {
      return () => {
        const viewportHeight = window.innerHeight;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;

          // ENTRY: Quick fade in when section top enters bottom 20% of viewport
          const entryZone = viewportHeight * 0.2;
          const entryStart = viewportHeight;
          const entryEnd = viewportHeight - entryZone;
          const entryProgress = Math.min(1, Math.max(0, (entryStart - sectionTop) / (entryStart - entryEnd)));

          // EXIT: Fade out when section bottom leaves top 20% of viewport
          const exitZone = viewportHeight * 0.2;
          const exitStart = exitZone;
          const exitEnd = -50;
          const exitProgress = Math.min(1, Math.max(0, (exitStart - sectionBottom) / (exitStart - exitEnd)));

          // Determine which state we're in and calculate values
          let opacity: number;
          let blur: number;
          let scale: number;
          let translateY: number;

          if (entryProgress < 1) {
            // ENTERING: Start large and expanded, shrink to normal
            const eased = Math.pow(entryProgress, 0.6);
            opacity = eased;
            blur = 6 * (1 - eased);
            scale = 1.06 - (0.06 * eased);
            translateY = 40 * (1 - eased);
          } else if (exitProgress > 0) {
            // EXITING: Compress and fade out going up
            const eased = Math.pow(exitProgress, 0.6);
            opacity = 1 - eased;
            blur = 6 * eased;
            scale = 1 - (0.06 * eased);
            translateY = -40 * eased;
          } else {
            // FULLY VISIBLE: Normal state
            opacity = 1;
            blur = 0;
            scale = 1;
            translateY = 0;
          }

          // Apply CSS variables directly (no transitions, instant update)
          const el = section as HTMLElement;
          el.style.setProperty('--section-opacity', String(opacity));
          el.style.setProperty('--section-blur', `${blur}px`);
          el.style.setProperty('--section-scale', String(scale));
          el.style.setProperty('--section-translate', `${translateY}px`);
        });
      };
    };

    // Setup animations for sections
    const setupAnimations = (sections: NodeListOf<Element>) => {
      sectionsRef.current = sections;

      // Mark sections for animation
      sections.forEach((section) => {
        section.setAttribute('data-scroll-animate', '');
      });

      const updateSections = createUpdateFunction(sections);

      // Initial update
      updateSections();

      // Update on every scroll event
      const handleScroll = () => {
        requestAnimationFrame(updateSections);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateSections, { passive: true });

      // Return cleanup function
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateSections);
        sections.forEach((section) => {
          section.removeAttribute('data-scroll-animate');
          const el = section as HTMLElement;
          el.style.removeProperty('--section-opacity');
          el.style.removeProperty('--section-blur');
          el.style.removeProperty('--section-scale');
          el.style.removeProperty('--section-translate');
        });
      };
    };

    // Try immediately
    let sections = initializeSections();

    if (sections) {
      cleanupRef.current = setupAnimations(sections);
      return () => cleanupRef.current?.();
    }

    // If no sections found, use requestAnimationFrame to wait for DOM render
    // This handles race condition where LayoutWrapper renders before page content
    let attempts = 0;
    const maxAttempts = 10; // Try up to 10 frames (~166ms at 60fps)

    const tryInit = () => {
      attempts++;
      sections = initializeSections();

      if (sections) {
        cleanupRef.current = setupAnimations(sections);
      } else if (attempts < maxAttempts) {
        // Keep trying for a few more frames
        requestAnimationFrame(tryInit);
      }
    };

    const rafId = requestAnimationFrame(tryInit);

    return () => {
      cancelAnimationFrame(rafId);
      cleanupRef.current?.();
    };
  }, []);

  return null;
}
