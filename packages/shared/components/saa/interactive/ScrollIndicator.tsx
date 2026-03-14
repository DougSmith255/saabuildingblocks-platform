'use client';

import { useEffect, useState, useRef } from 'react';

// Global instance counter to prevent duplicate scroll indicators
let globalInstanceCount = 0;

/**
 * ScrollIndicator - Simple bouncing double chevron (center bottom)
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ScrollIndicator
 *
 * Features:
 * - Two stacked SVG chevron paths with bounce animation
 * - Opposing opacity fade on top/bottom arrows
 * - Centered at bottom of viewport
 * - Fades out as user scrolls down
 * - Singleton pattern: only one instance renders at a time
 */
export function ScrollIndicator() {
  const [opacity, setOpacity] = useState(1);
  const instanceIdRef = useRef<number | null>(null);
  const [isFirstInstance, setIsFirstInstance] = useState(false);

  // Singleton pattern: only the first instance should render
  useEffect(() => {
    globalInstanceCount++;
    instanceIdRef.current = globalInstanceCount;
    const isFirst = globalInstanceCount === 1;
    setIsFirstInstance(isFirst);

    return () => {
      globalInstanceCount--;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 20;
      const fadeEnd = 120;

      if (scrollY <= fadeStart) {
        setOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setOpacity(0);
      } else {
        setOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if opacity is 0 or if this is not the first instance
  if (opacity === 0 || !isFirstInstance) return null;

  return (
    <>
      <style>{`
        @keyframes si-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes si-fade-down {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        @keyframes si-fade-up {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        #global-scroll-indicator {
          position: fixed;
          bottom: max(28px, calc(env(safe-area-inset-bottom, 0px) + 16px));
          left: 50%;
          transform: translateX(-50%);
          z-index: -1;
          pointer-events: none;
          transition: opacity 0.3s ease-out;
        }
        .si-bounce-wrap {
          animation: si-bounce 1.8s ease-in-out infinite;
        }
        .si-arrow-top {
          animation: si-fade-down 1.8s ease-in-out infinite;
        }
        .si-arrow-bottom {
          animation: si-fade-up 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .si-bounce-wrap,
          .si-arrow-top,
          .si-arrow-bottom {
            animation: none !important;
          }
        }
      `}</style>

      <div
        id="global-scroll-indicator"
        data-source="layout-wrapper"
        aria-hidden="true"
        style={{ opacity }}
      >
        <div className="si-bounce-wrap">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 3px rgba(229,228,221,0.3))' }}
          >
            <path className="si-arrow-top" d="M7 6l5 5 5-5" stroke="#e5e4dd" />
            <path className="si-arrow-bottom" d="M7 13l5 5 5-5" stroke="#e5e4dd" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default ScrollIndicator;
