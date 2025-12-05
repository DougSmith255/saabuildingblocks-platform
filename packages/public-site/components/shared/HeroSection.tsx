'use client';

import { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Aria label for the section */
  ariaLabel?: string;
  /** ID for the section */
  id?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * HeroSection - Wrapper component for hero sections with smooth fade-in
 *
 * Starts invisible and fades in after mount to prevent flash of
 * unstyled/repositioning content. Apply this to any hero section
 * that needs a smooth entrance animation.
 *
 * Usage:
 * <HeroSection ariaLabel="Hero">
 *   <H1>Title</H1>
 *   <p>Content</p>
 * </HeroSection>
 */
export function HeroSection({
  children,
  className = '',
  ariaLabel,
  id,
  style = {}
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready and any layout calculations complete
    const timer = requestAnimationFrame(() => {
      // Double RAF to ensure we're past the initial paint
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      aria-label={ariaLabel}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        willChange: 'opacity',
      }}
    >
      {children}
    </section>
  );
}

export default HeroSection;
