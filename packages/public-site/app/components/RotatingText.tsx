'use client';

import { useState, useEffect, useRef } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number; // milliseconds between rotations
  className?: string;
  minHeight?: string; // Optional minimum height to prevent layout shift
}

/**
 * RotatingText Component
 * Cycles through an array of text strings with a fade + slide up transition.
 * Uses CSS-only animations for smooth performance.
 * Maintains fixed height based on tallest text to prevent layout shift.
 */
export function RotatingText({
  texts,
  interval = 4000,
  className = '',
  minHeight,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure the height needed for the longest text on mount and on resize
  useEffect(() => {
    const measureHeights = () => {
      if (measureRef.current && containerRef.current) {
        let tallest = 0;
        const measureEl = measureRef.current;

        // Temporarily measure each text to find the tallest
        texts.forEach((text) => {
          measureEl.textContent = text;
          const height = measureEl.offsetHeight;
          if (height > tallest) tallest = height;
        });

        // Restore current text
        measureEl.textContent = texts[currentIndex];
        setMaxHeight(tallest);
      }
    };

    measureHeights();

    // Re-measure on resize (text may wrap differently)
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [texts, currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Start exit animation (fade out + slide up)
      setAnimationState('exiting');

      // After exit animation, change text and start enter animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setAnimationState('entering');

        // After enter animation completes, set to visible
        setTimeout(() => {
          setAnimationState('visible');
        }, 300);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const getStyles = (): React.CSSProperties => {
    switch (animationState) {
      case 'exiting':
        return {
          opacity: 0,
          transform: 'translateY(-10px)',
        };
      case 'entering':
        return {
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'none', // Instant position reset
        };
      case 'visible':
      default:
        return {
          opacity: 1,
          transform: 'translateY(0)',
        };
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        minHeight: minHeight || (maxHeight ? `${maxHeight}px` : undefined),
      }}
    >
      {/* Hidden element for measuring text heights - same width as container */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: 0,
          right: 0,
          whiteSpace: 'normal',
        }}
      >
        {texts[currentIndex]}
      </div>
      {/* Visible text with animation */}
      <div
        style={{
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          ...getStyles(),
        }}
      >
        {texts[currentIndex]}
      </div>
    </div>
  );
}
