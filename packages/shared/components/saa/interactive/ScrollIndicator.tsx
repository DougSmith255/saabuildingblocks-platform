'use client';

import { ChevronDown } from 'lucide-react';

/**
 * ScrollIndicator - Neon arrow indicating scroll direction
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ScrollIndicator
 *
 * Features:
 * - H1-style neon gold glow effect
 * - CTA button-style pulsing light animation
 * - Positioned in bottom right corner of hero sections
 * - Bouncing animation to attract attention
 *
 * Usage:
 * Place inside a hero section with relative positioning.
 * The component positions itself absolutely in the bottom right.
 */
export function ScrollIndicator() {
  return (
    <>
      {/* Keyframes for bounce animation */}
      <style>{`
        @keyframes scrollIndicatorBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
        @keyframes scrollIndicatorGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 24px rgba(255, 215, 0, 0.6));
          }
        }
      `}</style>

      <div
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 pointer-events-none"
        style={{
          animation: 'scrollIndicatorBounce 2s ease-in-out infinite',
        }}
      >
        {/* Arrow container with neon glow */}
        <div
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full"
          style={{
            background: 'rgba(20, 20, 20, 0.8)',
            border: '2px solid #ffd700',
            boxShadow: `
              0 0 10px rgba(255, 215, 0, 0.3),
              0 0 20px rgba(255, 215, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.3)
            `,
            animation: 'scrollIndicatorGlow 3s ease-in-out infinite',
          }}
        >
          {/* Chevron with H1-style neon effect */}
          <ChevronDown
            className="w-7 h-7 md:w-8 md:h-8"
            style={{
              color: '#ffd700',
              filter: `
                drop-shadow(0 0 2px #fff)
                drop-shadow(0 0 4px #ffd700)
                drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))
              `,
            }}
            strokeWidth={2.5}
          />
        </div>

        {/* Pulsing light ring behind */}
        <div
          className="cta-light-bar-pulse absolute inset-0 rounded-full"
          style={{
            background: '#ffd700',
            opacity: 0.5,
            transform: 'scale(1.15)',
            zIndex: -1,
          }}
        />
      </div>
    </>
  );
}

export default ScrollIndicator;
