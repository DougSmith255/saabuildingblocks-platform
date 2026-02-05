'use client';

import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading - 'blue' for eXp Realty pages */
  theme?: 'default' | 'blue';
}

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
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 *
 * @example
 * ```tsx
 * <H2>SECTION TITLE</H2>
 * ```
 */
export default function H2({
  children,
  className = '',
  style = {},
  theme = 'default'
}: HeadingProps) {
  const isBlue = theme === 'blue';
  const textColor = isBlue ? '#b0d4e8' : '#bfbdb0';

  // 3D text-shadow effect (matches H1 style)
  // White core + colored glow + offset metal backing shadows
  const textShadow = isBlue
    ? `
      /* WHITE CORE */
      0 0 0.01em #fff,
      0 0 0.02em #fff,
      0 0 0.03em rgba(255,255,255,0.8),
      /* BLUE GLOW */
      0 0 0.05em #00bfff,
      0 0 0.09em rgba(0, 191, 255, 0.8),
      0 0 0.13em rgba(0, 191, 255, 0.55),
      0 0 0.18em rgba(0, 150, 200, 0.35),
      /* METAL BACKING (3D depth) */
      0.03em 0.03em 0 #1a2a3a,
      0.045em 0.045em 0 #0f1a25,
      0.06em 0.06em 0 #081018,
      0.075em 0.075em 0 #040810
    `
    : `
      /* WHITE CORE */
      0 0 0.01em #fff,
      0 0 0.02em #fff,
      0 0 0.03em rgba(255,255,255,0.8),
      /* WARM WHITE GLOW */
      0 0 0.05em rgba(255,250,240,0.9),
      0 0 0.09em rgba(255, 255, 255, 0.6),
      0 0 0.13em rgba(255, 255, 255, 0.35),
      0 0 0.18em rgba(200, 200, 200, 0.2),
      /* METAL BACKING (3D depth) */
      0.03em 0.03em 0 #2a2a2a,
      0.045em 0.045em 0 #1a1a1a,
      0.06em 0.06em 0 #0f0f0f,
      0.075em 0.075em 0 #080808
    `;

  return (
    <h2
      className={`text-h2 ${className}`}
      style={{
        textAlign: 'center',
        fontFeatureSettings: '"ss01" 1',
        marginLeft: 'auto',
        marginRight: 'auto',
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
