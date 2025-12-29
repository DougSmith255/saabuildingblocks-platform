'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollIndicator - Animated scroll-down arrow
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ScrollIndicator
 *
 * Features:
 * - Minimalist double-chevron design (inspired by popular CodePen patterns)
 * - Gold neon glow effect matching website theme
 * - Fixed to bottom-right with safe area inset for mobile
 * - Smooth bouncing animation
 * - Fades out as user scrolls down
 *
 * Usage:
 * Place at root level of page (outside any fixed/absolute containers)
 */
export function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 250;

      if (scrollY <= fadeStart) {
        setOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setOpacity(0);
      } else {
        setOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if fully faded
  if (opacity === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scrollArrowBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(10px);
          }
          60% {
            transform: translateY(5px);
          }
        }
        @keyframes scrollArrowFade {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .scroll-arrow-chevron {
          display: block;
          width: 24px;
          height: 24px;
          border-right: 3px solid #ffd700;
          border-bottom: 3px solid #ffd700;
          transform: rotate(45deg);
          animation: scrollArrowFade 2s ease-in-out infinite;
        }
        .scroll-arrow-chevron:nth-child(2) {
          animation-delay: 0.2s;
        }
      `}</style>

      <div
        className="fixed z-[100] pointer-events-none"
        style={{
          // Position at bottom-right with safe area inset for mobile
          bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          right: '24px',
          opacity,
          transition: 'opacity 0.3s ease-out',
          animation: 'scrollArrowBounce 2s ease-in-out infinite',
        }}
      >
        {/* Double chevron arrow */}
        <div
          className="flex flex-col items-center gap-[-8px]"
          style={{
            filter: `
              drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))
              drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))
              drop-shadow(0 0 16px rgba(255, 215, 0, 0.3))
            `,
          }}
        >
          <span className="scroll-arrow-chevron" style={{ marginBottom: '-12px' }} />
          <span className="scroll-arrow-chevron" />
        </div>
      </div>
    </>
  );
}

export default ScrollIndicator;
