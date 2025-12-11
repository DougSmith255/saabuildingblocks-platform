'use client';

import { useEffect, useRef } from 'react';

/**
 * Counter Animation - Client Component (Hydrates After Initial Paint)
 *
 * PERFORMANCE STRATEGY:
 * - Counter is already visible as static HTML (no hydration delay for LCP)
 * - This component hydrates AFTER initial paint
 * - Finds the existing counter DOM element and animates it
 * - No impact on LCP because counter already rendered
 *
 * Animation:
 * - Scrambles numbers periodically for visual interest
 * - Always returns to "3700" final value
 * - Uses requestAnimationFrame for smooth animation
 */
export function CounterAnimation() {
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Find the VISIBLE counter element and individual digit spans
    // Both desktop and mobile counters now use .counter-numbers-mobile class
    // Desktop (>=1450px): .agent-counter-wrapper is visible
    // Mobile (<1450px): .tagline-counter-suffix is visible
    const desktopWrapper = document.querySelector('.agent-counter-wrapper');
    const mobileWrapper = document.querySelector('.tagline-counter-suffix');

    // Use the one whose wrapper is visible
    let counterElement: Element | null = null;
    if (desktopWrapper && getComputedStyle(desktopWrapper).display !== 'none') {
      counterElement = desktopWrapper.querySelector('.counter-numbers-mobile');
    } else if (mobileWrapper && getComputedStyle(mobileWrapper).display !== 'none') {
      counterElement = mobileWrapper.querySelector('.counter-numbers-mobile');
    }

    if (!counterElement) return;

    const digitElements = counterElement.querySelectorAll('.counter-digit');
    if (digitElements.length !== 4) return;

    const animateScramble = () => {
      const target = 3700;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          // End animation - show final value
          digitElements[0].textContent = '3';
          digitElements[1].textContent = '7';
          digitElements[2].textContent = '0';
          digitElements[3].textContent = '0';
          animationRef.current = null;
        } else {
          // Scramble effect - show random numbers that gradually approach target
          const currentValue = Math.floor(target * progress);
          const scrambleIntensity = 1 - progress; // Less scrambling as we approach target

          const digits = currentValue.toString().padStart(4, '0').split('');
          const scrambled = digits.map((digit, index) => {
            // Randomly scramble digits based on intensity
            if (Math.random() < scrambleIntensity * 0.3) {
              // Exclude "1" to prevent width changes (use 2-9)
              // First digit stays 3 to keep 3xxx range
              if (index === 0) return '3';
              return (Math.floor(Math.random() * 8) + 2).toString(); // 2-9
            }
            return digit;
          });

          // Update each digit span individually
          scrambled.forEach((digit, index) => {
            digitElements[index].textContent = digit;
          });

          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Defer animation start until browser is idle
    let startDelayId: number | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startAnimations = () => {
      // Start first animation
      animateScramble();

      // Loop animation every 5 seconds
      intervalId = setInterval(() => {
        animateScramble();
      }, 5000);
    };

    // Use requestIdleCallback to defer, with setTimeout fallback
    if ('requestIdleCallback' in window) {
      startDelayId = window.requestIdleCallback(startAnimations, { timeout: 2000 });
    } else {
      // Fallback for Safari - use setTimeout
      setTimeout(startAnimations, 500);
    }

    return () => {
      if (startDelayId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(startDelayId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // This component renders nothing - it only manipulates existing DOM
  return null;
}
