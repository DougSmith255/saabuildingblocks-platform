'use client';

import { useEffect, useRef } from 'react';

/**
 * Spaceman Background Animation
 * Displays animated spaceman SVG covering login page background
 */
export default function SpacemanBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Log for debugging
    console.log('SpacemanBackground mounted');
    if (containerRef.current) {
      console.log('Container found:', containerRef.current.getBoundingClientRect());
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10, // Above StarBackground (0) but below content (20)
        overflow: 'hidden',
      }}
      data-component="spaceman-background"
    >
      <div
        className="absolute flex items-end justify-center"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: '85vh',
        }}
      >
        <img
          src="/animations/spaceman.svg"
          alt="Spaceman floating in space"
          style={{
            width: '90vw',
            maxWidth: '1200px',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.6, // Increased from 0.4 to 0.6 for better visibility
            filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.3))', // Add subtle glow
          }}
          onLoad={() => console.log('✅ Spaceman SVG loaded successfully')}
          onError={(e) => console.error('❌ Spaceman SVG failed to load:', e)}
        />
      </div>
    </div>
  );
}
