'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Client-side animations for homepage
 * - Custom counter with scramble animation (always 4 digits)
 * - Hydration state management
 * - Dynamic H1 positioning relative to profile image
 */
export function HomepageClient() {
  const [displayValue, setDisplayValue] = useState('0000');
  const [h1MarginTop, setH1MarginTop] = useState('33.2vh');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start first animation after mount
    const startDelay = setTimeout(() => {
      animateScramble();
    }, 500);

    // Loop animation every 5 seconds
    const interval = setInterval(() => {
      animateScramble();
    }, 5000);

    // Calculate H1 position to overlap 10-25% of profile image bottom
    let resizeTimeout: NodeJS.Timeout | null = null;
    let rafId: number | null = null;
    let lastWidth = window.innerWidth; // Track width to detect actual screen size changes

    const calculateH1Position = () => {
      const profileImg = document.querySelector('.profile-image') as HTMLImageElement;
      if (profileImg) {
        // CRITICAL: Only calculate when scrollY is 0 to get consistent positioning
        // Otherwise getBoundingClientRect() gives viewport-relative position which changes during scroll
        if (window.scrollY !== 0) {
          return; // Don't recalculate during scroll
        }

        // Use visualViewport for accurate mobile viewport dimensions
        const viewportHeight = window.visualViewport?.height || window.innerHeight;

        // Get bounding rect for accurate viewport-relative positioning
        const rect = profileImg.getBoundingClientRect();
        const imgTop = rect.top;
        const imgHeight = rect.height;

        // Lock H1 at exactly 25% overlap with profile image (75% down the profile)
        const finalPosition = imgTop + (imgHeight * 0.75);

        setH1MarginTop(`${finalPosition}px`);
      }
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

    // Calculate on mount and load
    calculateH1Position();
    window.addEventListener('resize', debouncedCalculate);
    window.addEventListener('load', calculateH1Position);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      if (animationRef.current) cancelAnimationFrame(animationRef.current as unknown as number);
      window.removeEventListener('resize', debouncedCalculate);
      window.removeEventListener('load', calculateH1Position);
    };
  }, []);

  const animateScramble = () => {
    const target = 3700;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current as unknown as number);
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        // End animation - show final value
        setDisplayValue('3700');
        animationRef.current = null;
      } else {
        // Scramble effect - show random numbers that gradually approach target
        const currentValue = Math.floor(target * progress);
        const scrambleIntensity = 1 - progress; // Less scrambling as we approach target

        const digits = currentValue.toString().padStart(4, '0').split('');
        const scrambled = digits.map((digit) => {
          // Randomly scramble digits based on intensity
          if (Math.random() < scrambleIntensity * 0.3) {
            return Math.floor(Math.random() * 10).toString();
          }
          return digit;
        });

        setDisplayValue(scrambled.join(''));
        animationRef.current = requestAnimationFrame(animate) as unknown as NodeJS.Timeout;
      }
    };

    animationRef.current = requestAnimationFrame(animate) as unknown as NodeJS.Timeout;
  };

  return (
    <>
      {/* Agent Counter - Top Right on desktop, Top Left on mobile */}
      <div
        className="agent-counter-wrapper absolute z-50 left-4 xlg:left-auto xlg:right-8 hero-animate-counter"
        style={{
          top: '120px',
        }}
      >
        <div
          className="counter-container flex items-center justify-center"
          style={{
            fontWeight: 100,
            color: 'var(--color-body-text)',
            gap: 'clamp(0.5rem, 0.75rem, 1rem)',
            // Oval gradient - darker in center, fades to transparent
            // No hard edges - gradient stops well before container edges
            background: 'radial-gradient(ellipse 80% 60% at center, rgba(20,20,20,0.8) 0%, rgba(18,18,18,0.6) 25%, rgba(15,15,15,0.3) 50%, rgba(12,12,12,0.1) 75%, transparent 100%)',
            padding: '0.75rem 1.5rem',
            borderRadius: '32px',
            // Fixed width to prevent resizing during animation
            minWidth: '280px',
          }}
        >
          {/* Counter Numbers */}
          <div className="counter-numbers" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {displayValue}
          </div>

          {/* + Symbol */}
          <span className="counter-plus">+</span>

          {/* AGENTS Text */}
          <span className="counter-text">AGENTS</span>
        </div>
      </div>

      {/* H1 positioning data attribute */}
      <div
        id="h1-position-data"
        data-margin-top={h1MarginTop}
        style={{ display: 'none' }}
      />
    </>
  );
}
