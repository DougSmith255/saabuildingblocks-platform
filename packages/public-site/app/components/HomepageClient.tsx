'use client';

import { useState, useEffect } from 'react';

/**
 * Client-side animations for homepage
 * - Custom counter animation loop
 * - Hydration state management
 */
export function HomepageClient() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start first animation after mount
    const startDelay = setTimeout(() => {
      animateCounter();
    }, 500);

    // Loop animation every 5 seconds
    const interval = setInterval(() => {
      animateCounter();
    }, 5000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, []);

  const animateCounter = () => {
    setIsAnimating(true);
    setCount(0);

    const duration = 2000; // 2 second animation
    const target = 3700;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(step * increment), target);
      setCount(current);

      if (current >= target) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, stepDuration);
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
          className="flex items-center"
          style={{
            fontFamily: 'Amulya, serif',
            fontWeight: 100,
            color: 'var(--color-body-text)',
            gap: 'clamp(0.5rem, 0.75rem, 1rem)',
          }}
        >
          {/* Counter Numbers */}
          <div
            className="counter-numbers"
            style={{
              fontFamily: 'Amulya, serif',
              fontSize: '80px',
              transition: isAnimating ? 'none' : 'opacity 0.3s',
            }}
          >
            {count.toString().padStart(4, '0')}
          </div>

          {/* + Symbol */}
          <span
            className="counter-plus"
            style={{
              fontFamily: 'Amulya, serif',
              fontSize: '90px',
            }}
          >
            +
          </span>

          {/* AGENTS Text */}
          <span
            className="counter-text"
            style={{
              fontFamily: 'Amulya, serif',
              fontSize: '90px',
            }}
          >
            AGENTS
          </span>
        </div>
      </div>
    </>
  );
}
