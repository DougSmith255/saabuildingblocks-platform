'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Position Tracker - Logs H1 position changes to detect jumping
 * Sends data to console.log which Next.js dev server captures
 */
export function PositionTracker() {
  const lastPositionRef = useRef<number | null>(null);
  const jumpCountRef = useRef(0);
  const maxJumpRef = useRef(0);

  useEffect(() => {
    const trackPosition = () => {
      const h1Container = document.querySelector('.absolute.left-1\\/2.z-10') as HTMLElement;

      if (h1Container) {
        const rect = h1Container.getBoundingClientRect();
        const currentTop = Math.round(rect.top);

        if (lastPositionRef.current !== null) {
          const diff = Math.abs(currentTop - lastPositionRef.current);

          // If position changed by more than 2px (significant jump)
          if (diff > 2) {
            jumpCountRef.current++;
            if (diff > maxJumpRef.current) {
              maxJumpRef.current = diff;
            }

            const styles = window.getComputedStyle(h1Container);

            // Log to console (captured by Next.js dev server)
            console.log('🚨 H1 JUMP DETECTED:', {
              jumpNumber: jumpCountRef.current,
              fromPosition: lastPositionRef.current,
              toPosition: currentTop,
              difference: diff,
              direction: currentTop > lastPositionRef.current ? 'DOWN' : 'UP',
              maxJumpSeen: maxJumpRef.current,
              cssTop: styles.top,
              cssTransform: styles.transform,
              scrollY: window.scrollY,
              viewportHeight: window.visualViewport?.height || window.innerHeight,
            });
          }
        }

        lastPositionRef.current = currentTop;
      }
    };

    // Track continuously
    const interval = setInterval(trackPosition, 50); // 20x per second

    // Also track on scroll
    window.addEventListener('scroll', trackPosition);

    // Log initial state
    console.log('📍 Position tracker initialized');

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', trackPosition);

      // Log summary on unmount
      if (jumpCountRef.current > 0) {
        console.log('📊 POSITION TRACKING SUMMARY:', {
          totalJumps: jumpCountRef.current,
          maxJumpDistance: maxJumpRef.current,
        });
      }
    };
  }, []);

  return null; // No UI
}
