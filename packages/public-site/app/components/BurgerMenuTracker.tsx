'use client';

import { useEffect } from 'react';

/**
 * Burger Menu Timing Tracker - Logs when burger menu becomes visible
 */
export function BurgerMenuTracker() {
  useEffect(() => {
    const startTime = performance.now();
    console.log('🍔 BurgerMenuTracker: Starting to watch for burger menu');

    let checkCount = 0;
    const maxChecks = 100; // Stop after 5 seconds (100 * 50ms)

    const checkInterval = setInterval(() => {
      checkCount++;

      // Look for burger menu button
      const burgerButton = document.querySelector('button[aria-label="Toggle menu"]') ||
                          document.querySelector('.hamburger') ||
                          document.querySelector('[class*="burger"]') ||
                          document.querySelector('button svg'); // Many burger menus use SVG icons

      if (burgerButton) {
        const elapsed = performance.now() - startTime;
        const isVisible = window.getComputedStyle(burgerButton).display !== 'none' &&
                         window.getComputedStyle(burgerButton).opacity !== '0';

        console.log('🍔 BURGER MENU TIMING:', {
          foundAfterMs: Math.round(elapsed),
          checksRequired: checkCount,
          isVisible,
          element: burgerButton.tagName,
          classes: burgerButton.className,
        });

        clearInterval(checkInterval);
      } else if (checkCount >= maxChecks) {
        console.log('🍔 BURGER MENU NOT FOUND after 5 seconds');
        clearInterval(checkInterval);
      }
    }, 50); // Check every 50ms

    return () => clearInterval(checkInterval);
  }, []);

  return null;
}
