'use client';

import React from 'react';

export interface NeonGoldTextProps {
  children: React.ReactNode;
  /** HTML element to render as */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  /** Additional CSS classes (use for sizing like text-h2, text-h4, etc.) */
  className?: string;
}

/**
 * NeonGoldText - H1-style neon gold glow text with Taskor font
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/text/NeonGoldText
 *
 * Features:
 * - Taskor font with alternate glyphs (N, E, M)
 * - Gold color with neon glow effect (matches H1 styling)
 * - White outline on all 4 corners for depth
 * - Works with any text size (pass className like text-h2, text-h4)
 *
 * Use inside CyberCardGold for premium headings:
 * ```tsx
 * <CyberCardGold>
 *   <NeonGoldText as="h2" className="text-h2">Premium Title</NeonGoldText>
 *   <p className="text-body">Regular body text</p>
 * </CyberCardGold>
 * ```
 */
export function NeonGoldText({
  children,
  as: Component = 'span',
  className = '',
}: NeonGoldTextProps) {
  // Convert children to string for character processing
  const text = typeof children === 'string' ? children : String(children);

  // Split text into words
  const words = text.split(' ');

  return (
    <Component
      className={`font-display ${className}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: 0,
        columnGap: '0.35em',
        fontFamily: 'var(--font-taskor), sans-serif',
      }}
    >
      {/* SEO-friendly hidden text */}
      <span className="sr-only">{text}</span>

      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => {
            // Alt glyphs: N = U+f015, E = U+f011, M = U+f016
            let displayChar = char;
            const upperChar = char.toUpperCase();
            if (upperChar === 'N') displayChar = '\uf015';
            if (upperChar === 'E') displayChar = '\uf011';
            if (upperChar === 'M') displayChar = '\uf016';

            return (
              <span
                key={charIndex}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  color: '#ffd700',
                  textShadow: `
                    -1px -1px 0 rgba(255,255,255, 0.5),
                    1px -1px 0 rgba(255,255,255, 0.5),
                    -1px 1px 0 rgba(255,255,255, 0.5),
                    1px 1px 0 rgba(255,255,255, 0.5),
                    0 0 4px #ffd700,
                    0 0 8px #ffd700,
                    0 0 16px rgba(255,215,0,0.6),
                    0 0 24px rgba(255,179,71,0.4)
                  `,
                }}
              >
                {displayChar}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}

export default NeonGoldText;
