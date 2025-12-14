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

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as we scroll through the viewport height
      const progress = Math.min(scrollY / viewportHeight, 1);

      const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
      const blur = progress * 8; // Blur from 0 to 8px
      const brightness = 1 - progress; // Dim from 1 to 0
      const opacity = 1 - progress; // Fade from 1 to 0
      const translateY = -progress * 50; // Move up as it shrinks

      // Find the main content wrapper (hero-content-wrapper class)
      // This contains the image, H1, tagline, buttons - but NOT the RevealMaskEffect
      const contentWrapper = heroSection.querySelector('.hero-content-wrapper') as HTMLElement;

      if (contentWrapper) {
        contentWrapper.style.transformOrigin = 'center center';
        contentWrapper.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        contentWrapper.style.filter = `blur(${blur}px) brightness(${brightness})`;
        contentWrapper.style.opacity = `${opacity}`;

        // Fix backdrop-blur compositing issues during fade
        // backdrop-blur doesn't work correctly with opacity on parent, so we disable it during scroll
        // NOTE: Do NOT set opacity on these elements - parent opacity handles fade uniformly
        const backdropElements = contentWrapper.querySelectorAll('[class*="backdrop-blur"]') as NodeListOf<HTMLElement>;
        backdropElements.forEach(el => {
          // Disable backdrop-blur and use opaque background during scroll
          if (progress > 0) {
            el.style.backdropFilter = 'none';
            (el.style as any).webkitBackdropFilter = 'none';
            // Use fully opaque background to compensate for removed backdrop-blur
            el.style.backgroundColor = 'rgb(45, 45, 45)';
          } else {
            el.style.backdropFilter = '';
            (el.style as any).webkitBackdropFilter = '';
            el.style.backgroundColor = '';
          }
        });
      }

      // Fade out background effects - elements with hero-effect-layer class
      // These should ONLY FADE - no blur, no scale, no transform
      const heroEffects = heroSection.querySelectorAll('.hero-effect-layer') as NodeListOf<HTMLElement>;
      heroEffects.forEach(el => {
        el.style.opacity = `${opacity}`;
        el.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      });

      // Also find RevealMaskEffect and other named effects
      const namedEffects = heroSection.querySelectorAll('.reveal-mask-effect, .hero-background-effect') as NodeListOf<HTMLElement>;
      namedEffects.forEach(el => {
        if (!el.classList.contains('hero-effect-layer')) { // Avoid double-processing
          el.style.opacity = `${opacity}`;
          el.style.visibility = progress >= 1 ? 'hidden' : 'visible';
        }
      });

      // Also find any elements with pointer-events-none class that are positioned absolutely
      // This catches lazy-loaded effects that might not have specific class names
      // Effects should ONLY FADE - no blur, no scale, no transform
      const pointerNoneElements = heroSection.querySelectorAll('[class*="pointer-events-none"]');
      pointerNoneElements.forEach((el) => {
        const element = el as HTMLElement;
        const classes = element.className || '';
        // Skip elements inside hero-content-wrapper (like the backdrop blur elements)
        if (element.closest('.hero-content-wrapper')) return;
        // Skip already processed elements
        if (classes.includes('hero-effect-layer') || classes.includes('reveal-mask-effect')) return;
        // Only target absolute/inset positioned elements
        if (classes.includes('absolute') || classes.includes('inset-0')) {
          element.style.opacity = `${opacity}`;
          element.style.visibility = progress >= 1 ? 'hidden' : 'visible';
        }
      });

      // Also fade out the desktop agent counter (which is outside the main content wrapper)
      const agentCounter = heroSection.querySelector('.agent-counter-wrapper') as HTMLElement;
      if (agentCounter) {
        agentCounter.style.opacity = `${opacity}`;
        agentCounter.style.filter = `blur(${blur}px) brightness(${brightness})`;
      }

      // Hide section when fully scrolled
      const section = heroSection as HTMLElement;
      section.style.visibility = progress >= 1 ? 'hidden' : 'visible';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed hero container */}
      {/* Uses 100dvh to cover full viewport including when mobile browser bar hides */}
      <div
        ref={wrapperRef}
        className={`fixed-hero-wrapper ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100dvh', // Dynamic viewport height - expands when mobile browser bar hides
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto', height: '100%', minHeight: '100dvh' }}>
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
