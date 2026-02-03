'use client';

import React, { useState, useEffect } from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading - 'blue' for eXp Realty pages */
  theme?: 'default' | 'blue';
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
  style = {},
  theme = 'default'
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

  const isBlue = theme === 'blue';
  const textColor = isBlue ? '#b0d4e8' : '#bfbdb0';

  // Text-shadow for core glow on the text itself
  // Blue theme uses cyan-tinted glow; default uses white glow
  // Safari: reduced outer glow layers to prevent overly strong rendering
  const textShadow = isBlue
    ? (isSafari
      ? `
        0 0 1px rgba(176,212,232,0.8),
        0 0 2px rgba(176,212,232,0.6),
        0 0 8px rgba(0,191,255,0.4),
        0 0 16px rgba(0,191,255,0.15),
        0 0 24px rgba(0,191,255,0.05)
      `
      : `
        0 0 1px rgba(176,212,232,0.8),
        0 0 2px rgba(176,212,232,0.6),
        0 0 8px rgba(0,191,255,0.4),
        0 0 16px rgba(0,191,255,0.2),
        0 0 28px rgba(0,191,255,0.1),
        0 0 40px rgba(0,191,255,0.05)
      `)
    : (isSafari
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
      `);

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
          background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 40%, #171717 100%);
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

        /* Blue theme metal plate - dark blue steel */
        .h2-word-blue::before {
          content: "";
          position: absolute;
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          bottom: -0.25em;
          background: linear-gradient(180deg, #122a47 0%, #0d2138 40%, #081828 100%);
          border-radius: 0.15em;
          z-index: -1;
          border-top: 2px solid rgba(100,180,220,0.45);
          border-left: 1px solid rgba(60,130,180,0.35);
          border-right: 1px solid rgba(20,60,100,0.6);
          border-bottom: 2px solid rgba(0,0,0,0.7);
          box-shadow:
            inset 0 1px 0 rgba(100,180,220,0.12),
            inset 0 -1px 2px rgba(0,0,0,0.25),
            0 4px 8px rgba(0,0,0,0.5),
            0 2px 4px rgba(0,0,0,0.3);
        }
        .h2-word-blue::after {
          content: "";
          position: absolute;
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          height: 50%;
          background: linear-gradient(180deg, rgba(100,180,220,0.06) 0%, rgba(100,180,220,0.02) 50%, transparent 100%);
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
              className={isBlue ? 'h2-word-blue' : 'h2-word'}
              style={{
                display: 'inline-block',
                position: 'relative',
                color: textColor,
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
