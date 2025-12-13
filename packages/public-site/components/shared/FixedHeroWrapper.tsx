'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';

interface FixedHeroWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * FixedHeroWrapper - Makes the hero section stay fixed while content scrolls over it
 *
 * Creates a parallax-like effect where:
 * - Hero stays FIXED in place (doesn't scroll)
 * - Background effects stay full viewport and only FADE
 * - Hero CONTENT shrinks, blurs, and fades into the cosmic void
 * - Content sections scroll over the hero
 *
 * Uses JavaScript scroll events for cross-browser compatibility
 * (CSS scroll-timeline not supported in Firefox)
 */
export function FixedHeroWrapper({ children, className = '' }: FixedHeroWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState('100dvh');

  useEffect(() => {
    // Measure the hero's actual height to create proper spacer
    if (wrapperRef.current) {
      const heroSection = wrapperRef.current.querySelector('section');
      if (heroSection) {
        const height = heroSection.offsetHeight;
        setHeroHeight(`${height}px`);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const heroSection = wrapperRef.current.querySelector('section');
      if (!heroSection) return;

      const heroHeight = heroSection.offsetHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as we scroll through the hero height
      const progress = Math.min(scrollY / heroHeight, 1);

      // Apply the scroll-out effect to the entire section
      const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
      const blur = progress * 8; // Blur from 0 to 8px
      const brightness = 1 - progress; // Dim from 1 to 0
      const opacity = 1 - progress; // Fade from 1 to 0
      const translateY = -progress * 15; // Move up slightly

      const section = heroSection as HTMLElement;
      section.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      section.style.filter = `blur(${blur}px) brightness(${brightness})`;
      section.style.opacity = `${opacity}`;

      // Completely hide when fully scrolled (performance optimization)
      section.style.visibility = progress >= 1 ? 'hidden' : 'visible';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed hero container */}
      <div
        ref={wrapperRef}
        className={`fixed-hero-wrapper ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </div>

      {/* Spacer to maintain scroll height */}
      <div
        className="fixed-hero-spacer"
        style={{ height: heroHeight }}
        aria-hidden="true"
      />
    </>
  );
}
