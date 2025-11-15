'use client';

import { useState, useEffect } from 'react';

/**
 * Client-side H1 positioning for homepage
 * - Dynamic H1 positioning relative to profile image
 *
 * PERFORMANCE NOTE:
 * - Counter moved to StaticCounter (server component, no hydration delay)
 * - This component now ONLY handles H1 positioning (non-LCP element)
 */
export function HomepageClient() {
  const [h1MarginTop, setH1MarginTop] = useState('33.2vh');

  useEffect(() => {

    // Calculate H1 position to overlap 10-25% of profile image bottom
    let resizeTimeout: NodeJS.Timeout | null = null;
    let rafId: number | null = null;
    let lastWidth = window.innerWidth; // Track width to detect actual screen size changes

    const calculateH1Position = () => {
      const profileImg = document.querySelector('.profile-image') as HTMLImageElement;
      if (!profileImg) return;

      // CRITICAL: Only calculate when scrollY is 0 to get consistent positioning
      // Otherwise getBoundingClientRect() gives viewport-relative position which changes during scroll
      if (window.scrollY !== 0) {
        return; // Don't recalculate during scroll
      }

      // Helper function to get dimensions - handles cached images
      // OPTIMIZATION: Batch read operation to avoid forced reflow
      const getDimensions = () => {
        // Force style recalculation to ensure accurate measurements
        // Different browsers (Chrome vs Firefox/Edge) may calculate rect differently
        void profileImg.offsetHeight; // Trigger reflow

        // Read all geometric properties in ONE batch to minimize reflows
        const rect = profileImg.getBoundingClientRect();
        const complete = profileImg.complete;
        const naturalHeight = profileImg.naturalHeight;
        const computedStyle = window.getComputedStyle(profileImg);

        // Get the rendered height accounting for object-fit and max-height
        const renderedHeight = parseFloat(computedStyle.height);

        // If cached image has zero dimensions, wait for paint
        if (rect.height === 0 || rect.width === 0) {
          // Use naturalHeight as fallback for cached images
          if (complete && naturalHeight > 0) {
            return {
              top: rect.top,
              height: naturalHeight
            };
          }
          return null; // Dimensions not ready yet
        }

        // Use rendered height if available (more accurate across browsers)
        const finalHeight = renderedHeight > 0 ? renderedHeight : rect.height;

        return {
          top: rect.top,
          height: finalHeight
        };
      };

      const dimensions = getDimensions();
      if (!dimensions) {
        // Dimensions not ready - retry after paint
        requestAnimationFrame(() => {
          const retryDimensions = getDimensions();
          if (retryDimensions) {
            const finalPosition = retryDimensions.top + (retryDimensions.height * 0.75);
            setH1MarginTop(`${finalPosition}px`);
          } else {
            // Final fallback - retry after a small delay
            setTimeout(() => {
              calculateH1Position();
            }, 100);
          }
        });
        return;
      }

      // Lock H1 at exactly 25% overlap with profile image (75% down the profile)
      const finalPosition = dimensions.top + (dimensions.height * 0.75);
      setH1MarginTop(`${finalPosition}px`);
    };

    // Debounced resize handler - ONLY recalculate if screen WIDTH changes (not height)
    // This prevents mobile browser chrome expanding/collapsing from causing jitter
    const debouncedCalculate = () => {
      const currentWidth = window.innerWidth;

      // Only recalculate if width actually changed (screen rotated or window resized)
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;

        if (resizeTimeout) clearTimeout(resizeTimeout);
        if (rafId) cancelAnimationFrame(rafId);

        resizeTimeout = setTimeout(() => {
          rafId = requestAnimationFrame(() => {
            calculateH1Position();
          });
        }, 150); // 150ms debounce
      }
    };

    // Calculate H1 position with proper timing for cached images
    const initializePosition = () => {
      const profileImg = document.querySelector('.profile-image') as HTMLImageElement;

      if (!profileImg) {
        // Image not in DOM yet - retry after next frame
        requestAnimationFrame(initializePosition);
        return;
      }

      // Check if image is cached and already loaded
      if (profileImg.complete) {
        // Cached image - wait for next frame to ensure dimensions are painted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            calculateH1Position();
          });
        });
      } else {
        // Image not cached - wait for load event
        profileImg.addEventListener('load', calculateH1Position, { once: true });
        // Calculate immediately as fallback
        calculateH1Position();
      }
    };

    // Initialize position after mount
    initializePosition();

    // Recalculate on window load (handles late-loading images)
    window.addEventListener('load', calculateH1Position);

    // Handle window resize
    window.addEventListener('resize', debouncedCalculate);

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', debouncedCalculate);
      window.removeEventListener('load', calculateH1Position);
    };
  }, []);

  return (
    <>
      {/* H1 positioning data attribute */}
      <div
        id="h1-position-data"
        data-margin-top={h1MarginTop}
        style={{ display: 'none' }}
      />
    </>
  );
}
