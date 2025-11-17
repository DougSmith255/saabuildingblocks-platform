'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      // Use scrollingElement for consistent cross-browser behavior
      const scrollElement = document.scrollingElement || document.documentElement;
      const scrollTop = scrollElement.scrollTop;

      // Use scrollHeight directly from scrollingElement for accuracy
      const docHeight = scrollElement.scrollHeight;
      const windowHeight = scrollElement.clientHeight;
      const scrollableDistance = docHeight - windowHeight;

      // Calculate percentage (0-100)
      const progress = scrollableDistance > 0 ? (scrollTop / scrollableDistance) * 100 : 0;

      setScrollProgress(Math.min(progress, 100));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Attach scroll listener with passive for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        zIndex: 10020,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#ffd700',
          width: `${scrollProgress}%`,
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
          willChange: 'width',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
