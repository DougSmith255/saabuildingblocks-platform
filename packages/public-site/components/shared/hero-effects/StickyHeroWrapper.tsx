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

      const heroHeight = heroSection.offsetHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as we scroll through the hero height
      const progress = Math.min(scrollY / heroHeight, 1);

      // Find effect layers (first child that looks like an effect component)
      // These are typically absolute positioned with pointer-events-none
      const effectLayers = heroSection.querySelectorAll('[class*="Effect"], [class*="absolute"][class*="inset-0"]');

      // Find content layer (the div with relative z-10 or similar)
      const contentLayer = heroSection.querySelector('.relative.z-10, [class*="z-10"]') as HTMLElement;

      // Apply fade to effect layers (fade to 0)
      effectLayers.forEach((layer) => {
        const el = layer as HTMLElement;
        el.style.opacity = `${1 - progress}`; // Fade from 1 to 0
      });

      // Apply shrink/blur/fade to content layer
      if (contentLayer) {
        const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
        const blur = progress * 8; // Blur from 0 to 8px
        const opacity = 1 - progress; // Fade from 1 to 0
        const translateY = -progress * 15; // Move up slightly

        contentLayer.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        contentLayer.style.filter = `blur(${blur}px) brightness(${1 - progress})`;
        contentLayer.style.opacity = `${opacity}`;
      }

      // Completely hide when fully scrolled (performance optimization)
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
