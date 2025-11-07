'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Client-side animations for homepage
 * - Custom counter with scramble animation (always 4 digits)
 * - Hydration state management
 */
export function HomepageClient() {
  const [displayValue, setDisplayValue] = useState('0000');
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

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
      if (animationRef.current) clearInterval(animationRef.current);
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
        className="agent-counter-wrapper absolute z-50 left-1/2 -translate-x-1/2 xlg:left-auto xlg:translate-x-0 xlg:right-8"
        style={{
          top: '120px',
        }}
      >
        <div
          className="counter-container flex items-center"
          style={{
            fontWeight: 100,
            color: 'var(--color-body-text)',
            gap: 'clamp(0.5rem, 0.75rem, 1rem)',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
          }}
        >
          {/* Counter Numbers */}
          <div className="counter-numbers">
            {displayValue}
          </div>

          {/* + Symbol */}
          <span className="counter-plus">+</span>

          {/* AGENTS Text */}
          <span className="counter-text">AGENTS</span>
        </div>
      </div>
    </>
  );
}
