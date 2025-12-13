'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface StickyHeroWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * StickyHeroWrapper - Fixed hero with scroll-driven fade/compress effect
 *
 * Creates a parallax-like effect where:
 * - Hero stays FIXED in place (doesn't scroll)
 * - Background effects (stars, particles) stay full viewport and only FADE
 * - Hero CONTENT (text, images) shrinks and blurs into the distance
 * - Content sections scroll over the hero
 *
 * Structure expected:
 * <StickyHeroWrapper>
 *   <section>
 *     <SomeEffect />           <- Gets class "hero-effect-layer" - only fades
 *     <div className="...">    <- Gets class "hero-content-layer" - shrinks/blurs/fades
 *       Hero content here
 *     </div>
 *   </section>
 * </StickyHeroWrapper>
 */
export function StickyHeroWrapper({ children, className = '' }: StickyHeroWrapperProps) {
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
      const contentBlur = progress * 8; // Blur from 0 to 8px
      const effectBlur = progress * 4; // Lighter blur for effects
      const brightness = 1 - progress; // Dim from 1 to 0
      const opacity = 1 - progress; // Fade from 1 to 0
      const translateY = -progress * 50; // Move up as it shrinks

      // Find effect elements (contain "Effect" in class name)
      const effectElements = heroSection.querySelectorAll('[class*="Effect"]');
      effectElements.forEach((el) => {
        const element = el as HTMLElement;
        // Effects stay fixed, only fade and blur
        element.style.opacity = `${opacity}`;
        element.style.filter = `blur(${effectBlur}px) brightness(${brightness})`;
      });

      // Find content elements (have z-10 or z-20 class)
      const contentElement = heroSection.querySelector('[class*="z-10"], [class*="z-20"]') as HTMLElement;
      if (contentElement) {
        contentElement.style.transformOrigin = 'center center';
        contentElement.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        contentElement.style.filter = `blur(${contentBlur}px) brightness(${brightness})`;
        contentElement.style.opacity = `${opacity}`;
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
