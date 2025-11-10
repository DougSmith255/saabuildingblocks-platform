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

    // Calculate H1 position based on actual profile image
    const calculateH1Position = () => {
      const profileImg = document.querySelector('.profile-image') as HTMLImageElement;
      if (profileImg) {
        // Use offsetHeight for the image height (not affected by scroll)
        const imgHeight = profileImg.offsetHeight;

        // Calculate responsive percentage based on viewport width and height
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let percentage = 0.30; // Default 30% for smaller screens (looks good at 1024px)

        // Mobile screens: position higher to avoid covering faces and ensure content above fold
        if (viewportWidth < 768) {
          // On mobile, use viewport height to calculate positioning
          // Ensure H1 starts at least 40% down the viewport but not covering faces
          const mobileTargetTop = Math.max(
            viewportHeight * 0.35,  // Start at 35% of viewport height
            imgHeight * 0.20        // Or 20% of image height, whichever is lower
          );
          // Ensure content stays well above fold (leave room for buttons)
          const maxAllowedTop = viewportHeight * 0.50; // Max 50% of viewport
          setH1MarginTop(`${Math.min(mobileTargetTop, maxAllowedTop)}px`);
          return;
        }

        if (viewportWidth > 1400) {
          // Gradually reduce percentage as screen gets wider
          // This compensates for the image getting taller on wider screens
          percentage = 0.30 - ((viewportWidth - 1400) * 0.00008);
          percentage = Math.max(0.15, percentage); // Don't go below 15%
        }

        // Calculate position based on image size and viewport, not scroll position
        // Use percentage of image height minus viewport offset
        const targetTop = (imgHeight * percentage) - (viewportHeight * 0.15);

        // Ensure minimum clearance from top (don't push H1 too high)
        const minTop = viewportHeight * 0.25;
        // Ensure maximum position (don't push H1 below fold)
        const maxTop = viewportHeight * 0.45;

        setH1MarginTop(`${Math.max(minTop, Math.min(targetTop, maxTop))}px`);
      }
    };

    // Calculate on mount and resize
    calculateH1Position();
    window.addEventListener('resize', calculateH1Position);
    window.addEventListener('load', calculateH1Position);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current as unknown as number);
      window.removeEventListener('resize', calculateH1Position);
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
      {/* Agent Counter - Top Right on desktop, Centered on mobile */}
      <div
        className="agent-counter-wrapper absolute z-50 left-1/2 -translate-x-1/2 xlg:left-auto xlg:translate-x-0 xlg:right-8 hero-animate-counter"
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
