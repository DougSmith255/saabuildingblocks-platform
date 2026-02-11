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
 * - Taskor font with alternate glyphs (N, E, M) via font-feature-settings "ss01"
 * - Gold color with neon glow effect (matches H1 styling)
 * - White outline on all 4 corners for depth
 * - Works with any text size (pass className like text-h2, text-h4)
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * Use inside NeonCard for premium headings:
 * ```tsx
 * <NeonCard>
 *   <NeonGoldText as="h2" className="text-h2">Premium Title</NeonGoldText>
 *   <p className="text-body">Regular body text</p>
 * </NeonCard>
 * ```
 */
export function NeonGoldText({
  children,
  as: Component = 'span',
  className = '',
}: NeonGoldTextProps) {
  // Convert children to string
  const text = typeof children === 'string' ? children : String(children);

  // Split text into words for proper flex gap spacing
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
        fontFeatureSettings: '"ss01" 1',
        color: '#ffd700',
        textShadow: `
          -0.02em -0.02em 0 rgba(255,255,255, 0.4),
          0.02em -0.02em 0 rgba(255,255,255, 0.4),
          -0.02em 0.02em 0 rgba(255,255,255, 0.4),
          0.02em 0.02em 0 rgba(255,255,255, 0.4),
          0 -0.03em 0.1em #ffd700,
          0 0 0.03em #ffd700,
          0 0 0.07em #ffd700,
          0 0 0.12em #ffb347,
          0 0.03em 0.05em #000
        `,
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word}
        </span>
      ))}
    </Component>
  );
}

export default NeonGoldText;
