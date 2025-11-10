'use client';

import { useState, useEffect } from 'react';

/**
 * Dynamic H1 Container - Applies calculated position from HomepageClient
 * Uses CSS transforms instead of margin to avoid layout shifts
 * Reads the h1-position-data element and applies the transform dynamically
 */
export function DynamicH1Container({ children }: { children: React.ReactNode }) {
  const [translateY, setTranslateY] = useState('33.2vh'); // Default fallback

  useEffect(() => {
    const updatePosition = () => {
      const dataElement = document.getElementById('h1-position-data');
      if (dataElement) {
        const newPosition = dataElement.getAttribute('data-margin-top');
        if (newPosition) {
          setTranslateY(newPosition);
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

    // Also update on resize
    window.addEventListener('resize', updatePosition);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-10 w-[95%] space-y-8"
      style={{
        top: translateY,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
