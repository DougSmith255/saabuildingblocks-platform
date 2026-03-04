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

// Shared fill extrusion layers (same across all themes)
const FILL_EXTRUSION = `
  0.010em 0.013em 0 #dddcd5,
  0.015em 0.025em 0 #d1d0c7,
  0.019em 0.038em 0 #c2c1b8,
  0.024em 0.050em 0 #b3b2a8,
  0.029em 0.063em 0 #a09f94,
  0.033em 0.075em 0 #8d8c80,
  0.038em 0.088em 0 #7a7970`;

// Theme configurations - text color + stroke backing layers
const THEMES: Record<H2Theme, { textColor: string; textShadow: string }> = {
  default: {
    textColor: '#e5e4dd',
    textShadow: `
      ${FILL_EXTRUSION},
      0.040em 0.095em 0 #282828,
      0.044em 0.110em 0 #333333,
      0.048em 0.125em 0 #3e3e3e,
      0.052em 0.140em 0 #4a4a4a,
      0.054em 0.150em 0.02em rgba(0, 0, 0, 0.5)`,
  },
  blue: {
    textColor: '#b0d4e8',
    textShadow: `
      0 0 0.12em rgba(0, 191, 255, 0.12),
      ${FILL_EXTRUSION},
      0.040em 0.095em 0 #181920,
      0.042em 0.105em 0 #1a2a38,
      0.044em 0.115em 0 #0a3a50,
      0.046em 0.125em 0 #084a68,
      0.048em 0.135em 0 #086080,
      0.050em 0.145em 0 #0a7898,
      0.052em 0.155em 0 #00bfff,
      0.054em 0.165em 0.02em rgba(0, 150, 200, 0.5)`,
  },
  gold: {
    textColor: '#e8d4a0',
    textShadow: `
      0 0 0.12em rgba(255, 215, 0, 0.12),
      ${FILL_EXTRUSION},
      0.040em 0.095em 0 #191818,
      0.042em 0.105em 0 #3f3010,
      0.044em 0.115em 0 #5e4808,
      0.046em 0.125em 0 #7c6008,
      0.048em 0.135em 0 #9a7808,
      0.050em 0.145em 0 #b8900a,
      0.052em 0.155em 0 #d4a010,
      0.054em 0.165em 0 #e6ac00,
      0.056em 0.175em 0.02em rgba(184, 150, 10, 0.5)`,
  },
  purple: {
    textColor: '#d4b0e8',
    textShadow: `
      0 0 0.12em rgba(168, 85, 247, 0.12),
      ${FILL_EXTRUSION},
      0.040em 0.095em 0 #1a1020,
      0.042em 0.105em 0 #2a1535,
      0.044em 0.115em 0 #3a1a50,
      0.046em 0.125em 0 #4a2068,
      0.048em 0.135em 0 #6030a0,
      0.050em 0.145em 0 #7845c8,
      0.052em 0.155em 0 #a855f7,
      0.054em 0.165em 0.02em rgba(140, 70, 200, 0.5)`,
  },
  emerald: {
    textColor: '#a0e8c4',
    textShadow: `
      0 0 0.12em rgba(16, 185, 129, 0.12),
      ${FILL_EXTRUSION},
      0.040em 0.095em 0 #101a18,
      0.042em 0.105em 0 #152a25,
      0.044em 0.115em 0 #0f3a2a,
      0.046em 0.125em 0 #0a4a38,
      0.048em 0.135em 0 #086048,
      0.050em 0.145em 0 #0a9868,
      0.052em 0.155em 0 #10b981,
      0.054em 0.165em 0.02em rgba(10, 150, 100, 0.5)`,
  },
};

/**
 * H2 Component - 3D Shaded Text Effect
 *
 * Adapted from CodePen "Shaded Text" SVG technique, translated to CSS text-shadow.
 *
 * Features:
 * - 7-layer shaded fill extrusion (cream gradient creating 3D depth)
 * - Colored stroke backing visible at larger offsets (theme-dependent)
 * - Perspective transform with rotateX
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * @example
 * ```tsx
 * <H2>SECTION TITLE</H2>
 * <H2 theme="blue">BLUE HEADING</H2>
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
        maxWidth: style.maxWidth || '95%',
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
