'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Lenis scroll duration (default: 1.2) */
  duration?: number;
  /** Lenis lerp value for smoothness (default: 0.1) */
  lerp?: number;
  /** ID for the container element */
  id?: string;
}

/**
 * SmoothScrollContainer - Applies Lenis smooth scroll to a specific container
 *
 * Use this for nested scroll areas that need smooth scrolling independent
 * of the main page scroll (e.g., agent portal content area).
 *
 * Desktop only - disabled on touch-primary devices for native scroll feel.
 */
export default function SmoothScrollContainer({
  children,
  className = '',
  style,
  duration = 1.2,
  lerp = 0.1,
  id,
}: SmoothScrollContainerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip on touch-primary devices (phones/tablets)
    const isTouchPrimary = () => {
      if (typeof window === 'undefined') return true;
      if (window.matchMedia('(pointer: coarse)').matches) return true;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth < 768;
      return hasTouch && isNarrowScreen;
    };

    if (isTouchPrimary()) {
      console.log('[SmoothScrollContainer] Skipping - touch-primary device');
      return;
    }

    if (!wrapperRef.current || !contentRef.current) {
      console.log('[SmoothScrollContainer] Missing refs');
      return;
    }

    console.log('[SmoothScrollContainer] Initializing Lenis for container');

    // Initialize Lenis targeting this specific container
    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      lerp,
    });

    lenisRef.current = lenis;

    // Stop scroll animation on click for immediate interaction
    const handleClick = () => {
      if (lenis.isScrolling) {
        lenis.stop();
        lenis.start();
      }
    };

    wrapperRef.current.addEventListener('pointerdown', handleClick, { capture: true, passive: true });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Store cleanup reference
    const wrapper = wrapperRef.current;

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      wrapper?.removeEventListener('pointerdown', handleClick, { capture: true });
      lenis.destroy();
    };
  }, [duration, lerp]);

  return (
    <div
      ref={wrapperRef}
      id={id}
      className={className}
      style={style}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
