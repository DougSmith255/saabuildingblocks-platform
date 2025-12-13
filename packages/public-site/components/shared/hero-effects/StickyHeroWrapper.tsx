'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface StickyHeroWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sticky Hero Wrapper
 * Makes hero sections stick to the top and shrink as user scrolls,
 * creating the illusion that the hero is moving up even though it's not scrolling.
 *
 * The effect:
 * - Hero sticks to top of viewport
 * - As user scrolls, hero scales down and fades
 * - Content appears to slide up over the hero
 */
export function StickyHeroWrapper({ children, className = '' }: StickyHeroWrapperProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as we scroll through the hero height
      const progress = Math.min(scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transforms based on scroll progress
  const scale = 1 - scrollProgress * 0.15; // Scale from 1 to 0.85
  const opacity = 1 - scrollProgress * 0.6; // Fade from 1 to 0.4
  const translateY = scrollProgress * 10; // Move up slightly

  return (
    <div
      ref={heroRef}
      className={`sticky top-0 z-0 ${className}`}
      style={{
        transform: `scale(${scale}) translateY(-${translateY}%)`,
        opacity,
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}
