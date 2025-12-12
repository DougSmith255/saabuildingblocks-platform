import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
 * - Alt glyphs for N, E, M characters
 * - Body text color (#bfbdb0)
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
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string and split into words
  const text = React.Children.toArray(children).join('');
  const words = text.split(' ');

  // Optimized text-shadow with drop-shadow for glow (GPU accelerated)
  // White core in text-shadow, glow via filter: drop-shadow
  // Note: Metal backing plate is handled via ::before/::after pseudo-elements
  const textShadow = `
    /* WHITE CORE (3) - em units for scaling */
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;

  // GPU-accelerated glow via filter
  const filter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
  `;

  return (
    <>
      <style>{`
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
        className={`text-h2 ${className}`}
        aria-label={plainText}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5em',
          flexWrap: 'wrap',
          transform: 'rotateX(15deg)',
          position: 'relative',
          paddingLeft: '0.35em',
          paddingRight: '0.35em',
          ...style
        }}
      >
        {/* SEO-friendly hidden text for search engines and screen readers */}
        <span className="sr-only">{plainText}</span>

        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className="h2-word"
            style={{
              display: 'inline-block',
              position: 'relative',
              color: '#bfbdb0',
              textShadow,
              filter: filter.trim(),
            }}
          >
            {convertToAltGlyphs(word)}
          </span>
        ))}
      </h2>
    </>
  );
}
