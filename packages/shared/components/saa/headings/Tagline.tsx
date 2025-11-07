'use client';

import React from 'react';

export interface TaglineProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Map specific characters to alternate glyphs (same as H2)
const ALT_GLYPHS: Record<string, string> = {
  'N': '\uf015',
  'E': '\uf011',
  'M': '\uf016'
};

/**
 * Tagline Component
 *
 * Displays tagline text with H2-style 3D neon glow effects.
 * Pulls base typography settings from Master Controller's tagline text type.
 *
 * Features:
 * - Static neon glow (NO animation)
 * - 3D transform with rotateX and translateZ
 * - Metal backing plate
 * - Per-character rendering with alt glyphs
 * - Body text color (#bfbdb0) for neon effect
 * - Typography settings from var(--font-size-tagline), etc.
 *
 * @example
 * ```tsx
 * <Tagline>For Agents Who Want More</Tagline>
 * ```
 */
export default function Tagline({
  children,
  className = '',
  style = {}
}: TaglineProps) {
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
    <p
      className={`text-tagline ${className}`}
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
      <style jsx>{`
        .tagline-char {
          display: inline-block;
          color: #bfbdb0;
          text-shadow: ${textShadow};
          transform: translateZ(20px);
          position: relative;
        }

        /* Metal backing plate */
        .tagline-word::before {
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
          className="tagline-word"
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
                className="tagline-char"
              >
                {displayChar}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}
