'use client';

import { useEffect, useRef, useState } from 'react';

// Global instance counter to prevent duplicate scroll indicators
let globalInstanceCount = 0;

/**
 * ScrollIndicator - Simple bouncing double chevron at bottom of first viewport.
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ScrollIndicator
 *
 * Features:
 * - Two stacked SVG chevron paths with springy bounce animation
 * - Positioned absolutely at bottom of first viewport (scrolls with page)
 * - Singleton pattern: only one instance renders at a time
 */
export function ScrollIndicator() {
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

  if (!isFirstInstance) return null;

  return (
    <>
      <style>{`
        @keyframes si-bounce {
          0%, 100% {
            transform: translateY(-25%) translateX(-50%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0) translateX(-50%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        #global-scroll-indicator {
          position: absolute;
          top: calc(100svh - 50px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          pointer-events: none;
          animation: si-bounce 1s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          #global-scroll-indicator {
            animation: none !important;
          }
        }
      `}</style>

      <div
        id="global-scroll-indicator"
        data-source="layout-wrapper"
        aria-hidden="true"
      >
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
          <path d="M7 6l5 5 5-5" stroke="#e5e4dd" />
          <path d="M7 13l5 5 5-5" stroke="#e5e4dd" />
        </svg>
      </div>
    </>
  );
}

export default ScrollIndicator;
