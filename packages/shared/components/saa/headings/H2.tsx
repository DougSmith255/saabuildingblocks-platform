'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Map specific characters to alternate glyphs
const ALT_GLYPHS: Record<string, string> = {
  'N': '\uf015',
  'E': '\uf011',
  'M': '\uf016'
};

/**
 * H2 Component
 *
 * Displays H2 heading with static 3D neon glow effects.
 * Text is split into individual characters per word with alt glyph substitution.
 *
 * Features:
 * - Static neon glow (NO animation)
 * - 3D transform with rotateX and translateZ
 * - Metal backing plate
 * - Per-character rendering with alt glyphs
 * - Gold neon color scheme
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

  return (
    <>
      <style jsx global>{`
        :global(.h2-char) {
          display: inline-block;
          position: relative;
        }

        /* Per-word metal backing plate with neon text */
        /* Using em units so glow scales with font size */
        :global(.h2-word) {
          display: inline-flex;
          position: relative;
          /* Neon glow text-shadow - em units for responsive scaling */
          color: #bfbdb0;
          text-shadow:
            -0.02em -0.02em 0 rgba(255,255,255, 0.4),
            0.02em -0.02em 0 rgba(255,255,255, 0.4),
            -0.02em 0.02em 0 rgba(255,255,255, 0.4),
            0.02em 0.02em 0 rgba(255,255,255, 0.4),
            0 -0.03em 0.1em #bfbdb0,
            0 0 0.03em #bfbdb0,
            0 0 0.07em #bfbdb0,
            0 0 0.12em #9a9888,
            0 0.03em 0.05em #000;
        }

        /* Metal backing plate - 3D brushed gunmetal effect with glossy highlights */
        :global(.h2-word::before) {
          content: "";
          position: absolute;
          /* Negative inset extends plate beyond the word - equal top/bottom */
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          bottom: -0.25em;
          /* Brushed gunmetal gradient - lighter for metallic look */
          background: linear-gradient(
            180deg,
            #3d3d3d 0%,
            #2f2f2f 40%,
            #252525 100%
          );
          /* Rounded corners on all sides */
          border-radius: 0.15em;
          z-index: -1;
          /* Beveled edge effect - lighter top/left for raised look */
          border-top: 2px solid rgba(180,180,180,0.45);
          border-left: 1px solid rgba(130,130,130,0.35);
          border-right: 1px solid rgba(60,60,60,0.6);
          border-bottom: 2px solid rgba(0,0,0,0.7);
          /* Multi-layer shadow for depth and floating effect */
          box-shadow:
            /* Inner highlight at top for glossy reflection */
            inset 0 1px 0 rgba(255,255,255,0.12),
            /* Inner shadow at bottom for depth */
            inset 0 -1px 2px rgba(0,0,0,0.25),
            /* Main drop shadow */
            0 4px 8px rgba(0,0,0,0.5),
            /* Soft ambient shadow */
            0 2px 4px rgba(0,0,0,0.3);
        }

        /* Glossy highlight overlay on metal plate */
        :global(.h2-word::after) {
          content: "";
          position: absolute;
          top: -0.25em;
          left: -0.3em;
          right: -0.3em;
          height: 50%;
          /* Glossy reflection gradient */
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.02) 50%,
            transparent 100%
          );
          border-radius: 0.15em 0.15em 0 0;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      <h2
        className={`text-h2 ${className}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5em',
          flexWrap: 'wrap',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg)',
          position: 'relative',
          // Padding to compensate for metal plate negative inset (-0.3em horizontal)
          // Ensures plates don't extend beyond container edges
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
              display: 'inline-flex',
              position: 'relative'
            }}
          >
            {word.split('').map((char, charIndex) => {
              // Apply alt glyph if available
              const displayChar = ALT_GLYPHS[char.toUpperCase()] || char;

              return (
                <span
                  key={charIndex}
                  className="h2-char"
                >
                  {displayChar}
                </span>
              );
            })}
          </span>
        ))}
      </h2>
    </>
  );
}
