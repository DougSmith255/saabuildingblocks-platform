'use client';

import { SecondaryButton } from '@saa/shared/components/saa/buttons';
import { useStrokeBackLayers, H1_GOLD_CONFIG } from '@saa/shared/components/saa/headings/useStrokeBackLayers';

/**
 * 404 Not Found Page
 *
 * Uses the site's global star background and SecondaryButton component.
 * The star background is inherited from the root layout.
 * Header/Footer are hidden via CSS targeting the data-is-404 attribute.
 *
 * Uses 'use client' with Tailwind classes for immediate CSS (no CLS).
 * Float animation defined in globals.css (float-404).
 * 404 tracking is handled server-side by the Cloudflare Pages middleware
 * which logs to Supabase (see functions/_middleware.js).
 */
export default function NotFound() {
  const wrapperRef = useStrokeBackLayers(H1_GOLD_CONFIG);
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

      {/* 404 - H1 styling with SVG backing */}
      <div ref={wrapperRef} style={{ position: 'relative', overflow: 'visible' }}>
        <h1
          className="text-[clamp(6rem,20vw,12rem)] leading-none mb-4"
          style={{
            fontFamily: 'var(--font-taskor), serif',
            fontFeatureSettings: '"ss01" 1',
            color: H1_GOLD_CONFIG.faceColor,
            transform: `perspective(800px) rotateX(${H1_GOLD_CONFIG.rotateX})`,
            textShadow: H1_GOLD_CONFIG.faceTextShadow,
            position: 'relative',
          }}
        >
          404
        </h1>
      </div>

      {/* Message */}
      <p
        className="text-[clamp(1rem,3vw,1.25rem)] text-[#dcdbd5] mb-10 opacity-90 max-w-[400px] leading-relaxed"
      >
        This signal has been lost to the void—either removed from our network or it never existed in this sector of space.
      </p>

      {/* Return Home Button - uses <a> instead of Next.js Link to force full
         page reload, which resets the is404 ref in LayoutWrapper */}
      <SecondaryButton href="/" as="a" onClick={(e) => {
        e.preventDefault();
        window.location.href = '/';
      }}>
        Return to Base
      </SecondaryButton>
    </main>
  );
}
