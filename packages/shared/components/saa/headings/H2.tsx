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

  // Static neon text-shadow (always at full brightness) - using body text color
  const textShadow = `
    -1px -1px 0 rgba(255,255,255, 0.4),
    1px -1px 0 rgba(255,255,255, 0.4),
    -1px 1px 0 rgba(255,255,255, 0.4),
    1px 1px 0 rgba(255,255,255, 0.4),
    0 -3px 8px #bfbdb0,
    0 0 2px #bfbdb0,
    0 0 5px #bfbdb0,
    0 0 15px #9a9888,
    0 0 3px #bfbdb0,
    0 3px 3px #000
  `;

  return (
    <h2
      className={`text-h2 ${className}`}
      style={{
        display: 'flex',
        gap: '0.5em',
        flexWrap: 'wrap',
        transformStyle: 'preserve-3d',
        transform: 'rotateX(15deg)',
        position: 'relative',
        ...style
      }}
    >
      {/* SEO-friendly hidden text for search engines and screen readers */}
      <span className="sr-only">{plainText}</span>

      <style jsx>{`
        .h2-char {
          display: inline-block;
          color: #bfbdb0;
          text-shadow: ${textShadow};
          transform: translateZ(20px);
          position: relative;
        }

        /* Metal backing plate */
        .h2-word::before {
          content: "";
          position: absolute;
          inset: -0.2em -0.3em;
          background: linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(50,50,50,0.5) 100%);
          border-radius: 0.1em;
          z-index: -1;
          transform: translateZ(-10px);
          border: 1px solid rgba(150,150,150,0.2);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.5);
        }
      `}</style>

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
  );
}
