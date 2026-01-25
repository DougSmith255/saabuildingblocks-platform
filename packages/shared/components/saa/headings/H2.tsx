'use client';

import React, { useState, useEffect } from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * H2 Component - Optimized for Performance
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Single text node per word (was per-character rendering)
 * - CSS text-shadow for glow effects (GPU accelerated)
 * - Metal backing plate via ::before/::after pseudo-elements
 * - ~80% reduction in DOM nodes
 *
 * Features:
 * - Neon glow using text-shadow (matches Tagline style)
 * - 3D transform with rotateX
 * - Metal backing plate per word
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 * - Body text color (#bfbdb0)
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * @example
 * ```tsx
 * <H2>NEON TEXT</H2>
 * ```
 */
export default function H2({
  children,
  className = '',
  style = {}
}: HeadingProps) {
  // Safari browser detection for reduced glow effects
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    // Safari detection: contains safari but not chrome (Chrome also has Safari in UA)
    const isSafariBrowser = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
    setIsSafari(isSafariBrowser);
  }, []);

  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string and split into words
  const text = React.Children.toArray(children).join('');
  const words = text.split(' ');

  // Text-shadow for white core glow on the text itself
  // NOTE: We do NOT use filter: drop-shadow() on H2 because it would affect
  // the metal backing plate (::before pseudo-element). H2 gets its visual
  // punch from the metal plate, not from an outer glow.
  // Glow is spread out for softer, more diffused appearance (less blurry)
  // Safari: reduced outer glow layers (28px, 40px) to prevent overly strong rendering
  const textShadow = isSafari
    ? `
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 8px rgba(255,255,255,0.4),
      0 0 16px rgba(255,255,255,0.15),
      0 0 24px rgba(255,255,255,0.05)
    `
    : `
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 8px rgba(255,255,255,0.4),
      0 0 16px rgba(255,255,255,0.2),
      0 0 28px rgba(255,255,255,0.1),
      0 0 40px rgba(255,255,255,0.05)
    `;

  return (
    <>
      <style>{`
        /* Responsive H2 container - tighter spacing on mobile */
        .h2-container {
          display: flex;
          justify-content: center;
          gap: 0.3em;
          flex-wrap: wrap;
          position: relative;
          padding-left: 0.25em;
          padding-right: 0.25em;
          font-feature-settings: "ss01" 1;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .h2-container {
            gap: 0.5em;
            padding-left: 0.35em;
            padding-right: 0.35em;
          }
        }

        /* Metal backing plate - 3D brushed gunmetal effect with glossy highlights */
        .h2-word::before {
          content: "";
          position: absolute;
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          bottom: -0.25em;
          background: linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%);
          border-radius: 0.15em;
          z-index: -1;
          border-top: 2px solid rgba(180,180,180,0.45);
          border-left: 1px solid rgba(130,130,130,0.35);
          border-right: 1px solid rgba(60,60,60,0.6);
          border-bottom: 2px solid rgba(0,0,0,0.7);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 2px rgba(0,0,0,0.25),
            0 4px 8px rgba(0,0,0,0.5),
            0 2px 4px rgba(0,0,0,0.3);
        }

        /* Glossy highlight overlay on metal plate */
        .h2-word::after {
          content: "";
          position: absolute;
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%);
          border-radius: 0.15em 0.15em 0 0;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      <h2
        className={`text-h2 h2-container ${className}`}
        style={{
          maxWidth: style.maxWidth || '1400px',
          ...style
        }}
      >
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span
              className="h2-word"
              style={{
                display: 'inline-block',
                position: 'relative',
                color: '#bfbdb0',
                textShadow,
              }}
            >
              {word}
            </span>
          </React.Fragment>
        ))}
      </h2>
    </>
  );
}
