'use client';

import { useState, useEffect } from 'react';

/**
 * Dynamic H1 Container - Applies calculated margin-top from HomepageClient
 * Reads the h1-position-data element and applies the margin dynamically
 */
export function DynamicH1Container({ children }: { children: React.ReactNode }) {
  const [marginTop, setMarginTop] = useState('33.2vh'); // Default fallback

  useEffect(() => {
    const updateMargin = () => {
      const dataElement = document.getElementById('h1-position-data');
      if (dataElement) {
        const newMargin = dataElement.getAttribute('data-margin-top');
        if (newMargin) {
          setMarginTop(newMargin);
        }
      }
    };

    // Update immediately
    updateMargin();

    // Update on resize (the HomepageClient will update the data attribute)
    const interval = setInterval(updateMargin, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative z-10 w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)] mx-auto space-y-8"
      style={{ marginTop }}
    >
      {children}
    </div>
  );
}
