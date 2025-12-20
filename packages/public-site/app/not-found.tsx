'use client';

import { SecondaryButton } from '@saa/shared/components/saa';

/**
 * 404 Not Found Page
 *
 * Uses the site's global star background and SecondaryButton component.
 * The star background is inherited from the root layout.
 * Header/Footer are hidden via CSS targeting the data-is-404 attribute.
 *
 * Uses 'use client' with Tailwind classes for immediate CSS (no CLS).
 * Animations are defined in globals.css (float-404, glowBreathe-404).
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      data-is-404="true"
      className="w-full flex flex-col items-center justify-center px-4 text-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      {/* Floating UFO decoration */}
      <div
        className="text-6xl mb-4 opacity-60"
        style={{
          animation: 'float-404 6s ease-in-out infinite',
        }}
      >
        🛸
      </div>

      {/* 404 Neon Sign */}
      <h1
        className="font-taskor text-[clamp(6rem,20vw,12rem)] leading-none mb-4"
        style={{
          color: '#ffd700',
          transform: 'perspective(800px) rotateX(12deg)',
          textShadow: `
            0 0 0.01em #fff,
            0 0 0.02em #fff,
            0 0 0.03em rgba(255,255,255,0.8),
            0 0 0.07em #ffd700,
            0 0 0.11em rgba(255, 215, 0, 0.9),
            0 0 0.16em rgba(255, 215, 0, 0.7),
            0 0 0.22em rgba(255, 215, 0, 0.5),
            0.03em 0.03em 0 #2a2a2a,
            0.045em 0.045em 0 #1a1a1a,
            0.06em 0.06em 0 #0f0f0f,
            0.075em 0.075em 0 #080808
          `,
          filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3))',
          animation: 'glowBreathe-404 4s ease-in-out infinite',
        }}
      >
        404
      </h1>

      {/* Message */}
      <p
        className="text-[clamp(1rem,3vw,1.25rem)] text-[#dcdbd5] mb-10 opacity-90 max-w-[400px] leading-relaxed"
      >
        This signal has been lost to the void—either removed from our network or it never existed in this sector of space.
      </p>

      {/* Return Home Button */}
      <SecondaryButton href="/">
        Return to Base
      </SecondaryButton>
    </main>
  );
}
