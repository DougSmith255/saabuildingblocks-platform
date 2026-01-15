'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** Disable the glow breathe animation */
  noAnimation?: boolean;
}

/**
 * H1 Component - Optimized Neon Sign Effect
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Single DOM node (was ~40 nodes with per-character rendering)
 * - CSS text-shadow for all effects (GPU accelerated)
 * - All styles applied immediately (no flash-in)
 * - Animation starts via CSS (no JS delay)
 * - ~97% reduction in DOM nodes
 *
 * VISUAL EFFECT:
 * - 3D perspective with rotateX
 * - Neon gold glow with white-hot core
 * - Metal backing plate (gray gradient)
 * - Glow Breathe animation (slow dramatic pulse)
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  noAnimation = false,
}: HeadingProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  return (
    <>
      <h1
        id={id}
        className={`text-h1 text-display ${className}`}
        style={{
          color: '#ffd700',
          transform: 'perspective(800px) rotateX(12deg)',
          fontFeatureSettings: '"ss01" 1',
          /* Subtle dark stroke for edge definition */
          WebkitTextStroke: '0.5px rgba(0,0,0,0.35)',
          textShadow: `
            /* WHITE CORE (3) - tighter for sharper appearance */
            0 0 0.005em #fff,
            0 0 0.01em #fff,
            0 0 0.02em rgba(255,255,255,0.9),
            /* GOLD GLOW (4) - slightly tighter blur */
            0 0 0.04em #ffd700,
            0 0 0.08em rgba(255, 215, 0, 0.85),
            0 0 0.12em rgba(255, 215, 0, 0.6),
            0 0 0.18em rgba(255, 179, 71, 0.35),
            /* METAL BACKING (4) */
            0.03em 0.03em 0 #2a2a2a,
            0.045em 0.045em 0 #1a1a1a,
            0.06em 0.06em 0 #0f0f0f,
            0.075em 0.075em 0 #080808
          `,
          /* GPU-accelerated depth shadow - slightly reduced */
          filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))',
          animation: noAnimation ? 'none' : 'h1GlowBreathe 4s ease-in-out infinite',
          ...style,
        }}
      >
        {plainText}
      </h1>

      {/* Glow Breathe animation - injected once */}
      {!noAnimation && (
        <style>{`
          @keyframes h1GlowBreathe {
            0%, 100% {
              filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
            }
            50% {
              filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45));
            }
          }
        `}</style>
      )}
    </>
  );
}
