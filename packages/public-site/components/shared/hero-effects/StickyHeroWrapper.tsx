'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface StickyHeroWrapperProps {
  children: ReactNode;
  className?: string;
  /** Speed multiplier for fade effect. 1 = normal, 1.33 = 3/4 time (faster), 2 = half time */
  fadeSpeed?: number;
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
export function StickyHeroWrapper({ children, className = '', fadeSpeed = 1 }: StickyHeroWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const heroSection = wrapperRef.current.querySelector('section');
      if (!heroSection) return;

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Check if we're in light mode (body has light-mode class)
      const isLightMode = document.body.classList.contains('light-mode');

      // Progress from 0 to 1 as we scroll through the viewport height
      // fadeSpeed multiplier makes it fade faster (1.33 = 3/4 time, 2 = half time)
      const rawProgress = Math.min(scrollY / viewportHeight, 1);
      const progress = Math.min(rawProgress * fadeSpeed, 1);

      const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
      const contentBlur = progress * 8; // Blur from 0 to 8px
      const effectBlur = progress * 4; // Lighter blur for effects
      // In light mode: brighten to wash out to #e5e4dd (brightness increases from 1 to 3)
      // In dark mode: dim from 1 to 0
      const brightness = isLightMode ? 1 + progress * 2 : 1 - progress;
      const opacity = 1 - progress; // Fade from 1 to 0
      const translateY = -progress * 50; // Move up as it shrinks

      // Find effect elements by marker class or common patterns
      // Effects have: hero-effect-layer class, OR pointer-events-none with absolute/inset-0
      // Effects should ONLY FADE - no blur, no scale, no transform
      const effectElements = heroSection.querySelectorAll('.hero-effect-layer');
      effectElements.forEach((el) => {
        const element = el as HTMLElement;
        // Effects only fade out - no blur, no scale, no transform
        element.style.opacity = `${opacity}`;
        // Set visibility to hidden when fully scrolled to ensure complete removal
        element.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      });

      // Also find elements with pointer-events-none class that are positioned absolutely
      // These are typically background effects that should only fade
      const pointerNoneElements = heroSection.querySelectorAll('[class*="pointer-events-none"]');
      pointerNoneElements.forEach((el) => {
        const element = el as HTMLElement;
        const classes = element.className || '';
        // Only target absolute/inset positioned elements that aren't inside content wrappers
        if ((classes.includes('absolute') || classes.includes('inset-0')) &&
            !element.closest('.hero-content-wrapper') &&
            !classes.includes('hero-effect-layer')) { // Avoid double-processing
          element.style.opacity = `${opacity}`;
          element.style.visibility = progress >= 1 ? 'hidden' : 'visible';
        }
      });

      // Find content elements (direct children of section that aren't effects)
      const children = heroSection.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const classes = child.className || '';

        // Skip effect elements (already handled above)
        if (classes.includes('pointer-events-none') || classes.includes('hero-effect-layer')) continue;

        // z-20 elements (breadcrumbs, toggle) - ONLY fade, no blur or scale
        if (classes.includes('z-20')) {
          child.style.opacity = `${opacity}`;
          child.style.visibility = progress >= 1 ? 'hidden' : 'visible';
          continue;
        }

        // Content elements: have z-10 class OR have relative + max-w (content wrapper)
        if (classes.includes('z-10') ||
            (classes.includes('relative') && classes.includes('max-w')) ||
            (classes.includes('max-w') && !classes.includes('pointer-events-none'))) {
          child.style.transformOrigin = 'center center';
          child.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          child.style.filter = `blur(${contentBlur}px) brightness(${brightness})`;
          child.style.opacity = `${opacity}`;
        }
      }

      // Hide entire section when fully scrolled to ensure complete disappearance
      const section = heroSection as HTMLElement;
      if (progress >= 1) {
        section.style.visibility = 'hidden';
        section.style.opacity = '0';
      } else {
        section.style.visibility = 'visible';
        section.style.opacity = '1';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeSpeed]);

  return (
    <>
      {/* Fixed hero container - use Tailwind classes for immediate CSS application (no CLS) */}
      <div
        ref={wrapperRef}
        className={`fixed top-0 left-0 right-0 z-0 pointer-events-none ${className}`}
      >
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Spacer to maintain scroll height */}
      <div
        className="h-dvh"
        aria-hidden="true"
      />
    </>
  );
}
