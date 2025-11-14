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
    // Find the counter element that was server-rendered
    const counterElement = document.querySelector('.counter-numbers');
    if (!counterElement) return;

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
          counterElement.textContent = '3700';
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

          counterElement.textContent = scrambled.join('');
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start first animation after a delay
    const startDelay = setTimeout(() => {
      animateScramble();
    }, 500);

    // Loop animation every 5 seconds
    const interval = setInterval(() => {
      animateScramble();
    }, 5000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // This component renders nothing - it only manipulates existing DOM
  return null;
}
