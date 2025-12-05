'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Dynamic H1 Container - Applies calculated position from HomepageClient
 *
 * IMPORTANT: Stays invisible (opacity: 0) until position is calculated,
 * then fades in smoothly. This prevents the "flash and jump" issue where
 * content would appear at default position then jump to calculated position.
 */
export function DynamicH1Container({ children }: { children: React.ReactNode }) {
  const [translateY, setTranslateY] = useState('calc(8dvh + 240px)');
  const [isPositioned, setIsPositioned] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const dataElement = document.getElementById('h1-position-data');
      if (dataElement) {
        const newPosition = dataElement.getAttribute('data-margin-top');
        if (newPosition) {
          setTranslateY(newPosition);
          // Small delay to ensure position is applied before fading in
          requestAnimationFrame(() => {
            setIsPositioned(true);
          });
        }
      }
    };

    // Update immediately
    updatePosition();

    // Watch for changes to the data attribute
    const dataElement = document.getElementById('h1-position-data');
    let observer: MutationObserver | null = null;

    if (dataElement) {
      observer = new MutationObserver(updatePosition);
      observer.observe(dataElement, { attributes: true, attributeFilter: ['data-margin-top'] });
    }

    // Also update on resize (but don't re-trigger fade animation)
    const handleResize = () => {
      const dataElement = document.getElementById('h1-position-data');
      if (dataElement) {
        const newPosition = dataElement.getAttribute('data-margin-top');
        if (newPosition) {
          setTranslateY(newPosition);
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 z-10 w-[95%] space-y-8"
      style={{
        top: translateY,
        // Start invisible, fade in only after position is calculated
        opacity: isPositioned ? 1 : 0,
        transition: isPositioned ? 'opacity 0.5s ease-out' : 'none',
        willChange: 'opacity',
        contain: 'layout style',
      }}
    >
      {children}
    </div>
  );
}
