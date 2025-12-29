'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollIndicator - Double chevron scroll indicator
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ScrollIndicator
 *
 * Features:
 * - Two stacked chevron arrows with bounce animation
 * - Opposing opacity fade effect on arrows
 * - Gold color with neon glow effect matching website theme
 * - Fixed to bottom-right with safe area inset for mobile
 * - Fades out as user scrolls down
 *
 * Based on: https://codepen.io/ckschmieder/pen/MGGMQG
 */
export function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 250;

      if (scrollY <= fadeStart) {
        setOpacity(1);
        setScale(1);
      } else if (scrollY >= fadeEnd) {
        setOpacity(0);
        setScale(0.5); // Compress to 50% as it fades into distance
      } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setOpacity(1 - progress);
        setScale(1 - progress * 0.5); // Scale from 1 to 0.5
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (opacity === 0) return null;

  return (
    <>
      <style>{`
        @keyframes scrollBounce {
          0% { transform: translateY(0); }
          10% { transform: translateY(3px); }
          20% { transform: translateY(6px); }
          30% { transform: translateY(9px); }
          40% { transform: translateY(12px); }
          50% { transform: translateY(15px); }
          60% { transform: translateY(18px); }
          70% { transform: translateY(21px); }
          80% { transform: translateY(24px); }
          90% { transform: translateY(27px); }
          100% { transform: translateY(30px); }
        }

        @keyframes scrollOpacity {
          0% { opacity: 0; }
          10% { opacity: 0.1; }
          20% { opacity: 0.2; }
          30% { opacity: 0.3; }
          40% { opacity: 0.4; }
          50% { opacity: 0.5; }
          60% { opacity: 0.6; }
          70% { opacity: 0.7; }
          80% { opacity: 0.8; }
          90% { opacity: 0.9; }
          100% { opacity: 1; }
        }

        .scroll-prompt-arrow-container {
          animation: scrollBounce 1.5s infinite;
        }

        .scroll-prompt-arrow {
          animation: scrollOpacity 1.5s infinite;
        }

        .scroll-prompt-arrow:last-child {
          animation-direction: reverse;
          margin-top: -6px;
        }

        .scroll-prompt-arrow > div {
          width: 36px;
          height: 36px;
          border-right: 8px solid #ffd700;
          border-bottom: 8px solid #ffd700;
          border-radius: 4px;
          transform: rotate(45deg) translateZ(1px);
          /* White outline like H1 styling */
          box-shadow:
            0 0 2px #fff,
            0 0 4px rgba(255,255,255,0.8),
            inset 0 0 2px rgba(255,255,255,0.5);
        }
      `}</style>

      <div
        className="fixed pointer-events-none"
        style={{
          bottom: 'max(32px, calc(env(safe-area-inset-bottom, 0px) + 24px))',
          right: '24px',
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center bottom',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          zIndex: -1, // Behind all content, sections scroll over it
        }}
      >
        {/* Arrow container with glow */}
        <div
          style={{
            filter: `
              drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))
              drop-shadow(0 0 12px rgba(255, 215, 0, 0.4))
              drop-shadow(0 0 20px rgba(255, 215, 0, 0.2))
            `,
          }}
        >
          <div className="scroll-prompt-arrow-container">
            <div className="scroll-prompt-arrow"><div></div></div>
            <div className="scroll-prompt-arrow"><div></div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScrollIndicator;
