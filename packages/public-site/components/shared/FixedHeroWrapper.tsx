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

      // Get the inner content div (direct child of wrapper)
      const innerDiv = wrapperRef.current.querySelector(':scope > div') as HTMLElement;
      if (!innerDiv) return;

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as we scroll through the viewport height
      const progress = Math.min(scrollY / viewportHeight, 1);

      // Apply the scroll-out effect to the inner div (contains all hero content)
      const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
      const blur = progress * 8; // Blur from 0 to 8px
      const brightness = 1 - progress; // Dim from 1 to 0
      const opacity = 1 - progress; // Fade from 1 to 0
      const translateY = -progress * 50; // Move up as it shrinks

      innerDiv.style.transformOrigin = 'center center';
      innerDiv.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      innerDiv.style.filter = `blur(${blur}px) brightness(${brightness})`;
      innerDiv.style.opacity = `${opacity}`;
      innerDiv.style.visibility = progress >= 1 ? 'hidden' : 'visible';
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
