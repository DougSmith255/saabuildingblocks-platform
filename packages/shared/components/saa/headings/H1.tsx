'use client';

import React, { useEffect, useState } from 'react';
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
 * Convert text to use alt glyphs for N, E, M characters
 */
function convertToAltGlyphs(text: string): string {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (upper === 'N') return '\uf015';
    if (upper === 'E') return '\uf011';
    if (upper === 'M') return '\uf016';
    return char;
  }).join('');
}

/**
 * H1 Component - Optimized Neon Sign Effect
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Single DOM node (was ~40 nodes with per-character rendering)
 * - CSS text-shadow for all effects (GPU accelerated)
 * - Animation delayed 100ms to not block LCP
 * - ~97% reduction in DOM nodes
 *
 * VISUAL EFFECT:
 * - 3D perspective with rotateX
 * - Neon gold glow with white-hot core
 * - Metal backing plate (gray gradient)
 * - Glow Breathe animation (slow dramatic pulse)
 * - Alt glyphs for N, E, M characters
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  noAnimation = false,
}: HeadingProps) {
  const [animate, setAnimate] = useState(false);

  // Delay animation start to not block LCP
  useEffect(() => {
    if (noAnimation) return;
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [noAnimation]);

  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string and apply alt glyphs
  const text = typeof children === 'string' ? children : String(children);
  const displayText = convertToAltGlyphs(text);

  return (
    <>
      <h1
        id={id}
        className={`text-h1 text-display ${className}`}
        aria-label={plainText}
        style={{
          color: '#ffd700',
          transform: 'perspective(800px) rotateX(12deg)',
          textShadow: `
            /* WHITE CORE (3) */
            0 0 0.01em #fff,
            0 0 0.02em #fff,
            0 0 0.03em rgba(255,255,255,0.8),
            /* GOLD GLOW (4) */
            0 0 0.07em #ffd700,
            0 0 0.11em rgba(255, 215, 0, 0.9),
            0 0 0.16em rgba(255, 215, 0, 0.7),
            0 0 0.22em rgba(255, 179, 71, 0.5),
            /* METAL BACKING (4) */
            0.03em 0.03em 0 #2a2a2a,
            0.045em 0.045em 0 #1a1a1a,
            0.06em 0.06em 0 #0f0f0f,
            0.075em 0.075em 0 #080808
          `,
          /* GPU-accelerated depth shadow */
          filter: animate
            ? 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3))'
            : 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7))',
          animation: animate ? 'h1GlowBreathe 4s ease-in-out infinite' : 'none',
          ...style,
        }}
      >
        {/* SEO-friendly hidden text for search engines and screen readers */}
        <span className="sr-only">{plainText}</span>
        {displayText}
      </h1>

      {/* Glow Breathe animation - injected once */}
      {!noAnimation && (
        <style>{`
          @keyframes h1GlowBreathe {
            0%, 100% {
              filter: brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3));
            }
            50% {
              filter: brightness(1.2) drop-shadow(0 0 0.2em rgba(255, 215, 0, 0.6));
            }
          }
        `}</style>
      )}
    </>
  );
}
