'use client';

import React from 'react';

export type H2Theme = 'default' | 'blue' | 'gold' | 'purple' | 'emerald';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading */
  theme?: H2Theme;
}

// Theme configurations — text color + glow color + metal backing
const THEMES: Record<H2Theme, { textColor: string; textShadow: string }> = {
  default: {
    textColor: '#e5e4dd',
    textShadow: `
      0 0 0.01em #bfbdb0, 0 0 0.02em #bfbdb0, 0 0 0.03em rgba(191,189,176,0.8),
      0 0 0.04em rgba(191,189,176,0.7), 0 0 0.08em rgba(191,189,176,0.35),
      0 0 0.14em rgba(191,189,176,0.15), 0 0 0.22em rgba(160,158,148,0.08),
      0.02em 0.02em 0 #2a2a2a, 0.04em 0.04em 0 #222222,
      0.06em 0.06em 0 #1a1a1a, 0.08em 0.08em 0 #141414,
      0.10em 0.10em 0 #0f0f0f, 0.12em 0.12em 0 #080808`,
  },
  blue: {
    textColor: '#b0d4e8',
    textShadow: `
      0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
      0 0 0.04em rgba(0,191,255,0.7), 0 0 0.08em rgba(0,191,255,0.35),
      0 0 0.14em rgba(0,191,255,0.15), 0 0 0.22em rgba(0,150,200,0.08),
      0.02em 0.02em 0 #1a2a3a, 0.04em 0.04em 0 #152535,
      0.06em 0.06em 0 #0f1a25, 0.08em 0.08em 0 #0a1520,
      0.10em 0.10em 0 #081018, 0.12em 0.12em 0 #040810`,
  },
  gold: {
    textColor: '#e8d4a0',
    textShadow: `
      0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
      0 0 0.04em rgba(255,215,0,0.7), 0 0 0.08em rgba(255,215,0,0.35),
      0 0 0.14em rgba(255,215,0,0.15), 0 0 0.22em rgba(200,170,0,0.08),
      0.02em 0.02em 0 #3a2a1a, 0.04em 0.04em 0 #352515,
      0.06em 0.06em 0 #251a0f, 0.08em 0.08em 0 #20150a,
      0.10em 0.10em 0 #181008, 0.12em 0.12em 0 #100804`,
  },
  purple: {
    textColor: '#d4b0e8',
    textShadow: `
      0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
      0 0 0.04em rgba(168,85,247,0.7), 0 0 0.08em rgba(168,85,247,0.35),
      0 0 0.14em rgba(168,85,247,0.15), 0 0 0.22em rgba(140,70,200,0.08),
      0.02em 0.02em 0 #2a1a3a, 0.04em 0.04em 0 #251535,
      0.06em 0.06em 0 #1a0f25, 0.08em 0.08em 0 #150a20,
      0.10em 0.10em 0 #100818, 0.12em 0.12em 0 #080410`,
  },
  emerald: {
    textColor: '#a0e8c4',
    textShadow: `
      0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
      0 0 0.04em rgba(16,185,129,0.7), 0 0 0.08em rgba(16,185,129,0.35),
      0 0 0.14em rgba(16,185,129,0.15), 0 0 0.22em rgba(10,150,100,0.08),
      0.02em 0.02em 0 #1a3a2a, 0.04em 0.04em 0 #153525,
      0.06em 0.06em 0 #0f251a, 0.08em 0.08em 0 #0a2015,
      0.10em 0.10em 0 #081810, 0.12em 0.12em 0 #041008`,
  },
};

/**
 * H2 Component - 3D Text Effect (matches H1 style)
 *
 * Features:
 * - 3D text effect using layered text-shadows
 * - White core glow with colored outer glow
 * - Metal backing shadow (offset grays for depth)
 * - Perspective transform with rotateX
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * @example
 * ```tsx
 * <H2>SECTION TITLE</H2>
 * <H2 theme="purple">PURPLE HEADING</H2>
 * ```
 */
export default function H2({
  children,
  className = '',
  style = {},
  theme = 'default'
}: HeadingProps) {
  const { textColor, textShadow } = THEMES[theme];

  return (
    <h2
      className={`text-h2 ${className}`}
      style={{
        textAlign: style.textAlign || 'center',
        fontFeatureSettings: '"ss01" 1',
        marginLeft: style.textAlign === 'left' ? '0' : 'auto',
        marginRight: style.textAlign === 'right' ? '0' : 'auto',
        marginBottom: '2.5rem',
        maxWidth: style.maxWidth || '1400px',
        color: textColor,
        textShadow,
        transform: 'perspective(800px) rotateX(8deg)',
        filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
        ...style
      }}
    >
      {children}
    </h2>
  );
}
