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
        const imgRect = profileImg.getBoundingClientRect();
        const imgTop = imgRect.top;
        const imgHeight = imgRect.height;

        // Calculate responsive percentage based on viewport width
        // Larger screens need smaller percentage to keep H1 at same visual position
        const viewportWidth = window.innerWidth;
        let percentage = 0.30; // Default 30% for smaller screens (looks good at 1024px)

        if (viewportWidth > 1400) {
          // Gradually reduce percentage as screen gets wider
          // This compensates for the image getting taller on wider screens
          percentage = 0.30 - ((viewportWidth - 1400) * 0.00008);
          percentage = Math.max(0.15, percentage); // Don't go below 15%
        }

        // Position H1 using calculated percentage
        const targetTop = imgTop + (imgHeight * percentage);
        setH1MarginTop(`${targetTop}px`);
      }
    };

    // Calculate on mount and resize
    calculateH1Position();
    window.addEventListener('resize', calculateH1Position);
    window.addEventListener('load', calculateH1Position);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
      if (animationRef.current) clearInterval(animationRef.current);
      window.removeEventListener('resize', calculateH1Position);
      window.removeEventListener('load', calculateH1Position);
    };
  }, []);

  const animateScramble = () => {
    const target = 3700;
    const duration = 2000; // 2 seconds
    const fps = 30;
    const frames = (duration / 1000) * fps;
    let frame = 0;

    if (animationRef.current) clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      frame++;
      const progress = frame / frames;

      if (progress >= 1) {
        // End animation - show final value
        setDisplayValue('3700');
        if (animationRef.current) {
          clearInterval(animationRef.current);
          animationRef.current = null;
        }
      } else {
        // Scramble effect - show random numbers that gradually approach target
        const currentValue = Math.floor(target * progress);
        const scrambleIntensity = 1 - progress; // Less scrambling as we approach target

        const digits = currentValue.toString().padStart(4, '0').split('');
        const scrambled = digits.map((digit, i) => {
          // Randomly scramble digits based on intensity
          if (Math.random() < scrambleIntensity * 0.3) {
            return Math.floor(Math.random() * 10).toString();
          }
          return digit;
        });

        setDisplayValue(scrambled.join(''));
      }
    }, 1000 / fps);
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
            // Subtle oval gradient - blends with star background (rgb(40,40,40) to rgb(12,12,12))
            // Very low opacity - nearly invisible over stars, provides contrast over images
            background: 'radial-gradient(ellipse 200% 100% at center, rgba(30,30,30,0.25) 0%, rgba(20,20,20,0.15) 40%, rgba(12,12,12,0.05) 70%, transparent 100%)',
            padding: '0.75rem 1.5rem',
            borderRadius: '24px',
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
