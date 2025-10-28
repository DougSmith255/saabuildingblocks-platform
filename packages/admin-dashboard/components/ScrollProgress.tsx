'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
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
          transition: 'width 0.1s ease-out',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
          willChange: 'width',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          transformOrigin: 'left center',
        }}
      />
    </div>
  );
}
