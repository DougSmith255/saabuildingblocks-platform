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

    // Update on resize (the HomepageClient will update the data attribute)
    const interval = setInterval(updatePosition, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative z-10 w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)] mx-auto space-y-8"
      style={{
        transform: `translateY(${translateY})`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
