'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export type H1Theme = 'default' | 'cyan';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** @deprecated No longer used - animation removed in shaded text redesign */
  noAnimation?: boolean;
  /** @deprecated No longer used - close glow removed in shaded text redesign */
  disableCloseGlow?: boolean;
  /** Color theme for the backing stroke layers */
  theme?: H1Theme;
}

/**
 * H1 Component - 3D Shaded Text Effect
 *
 * Adapted from the CodePen "Shaded Text" SVG technique, translated to CSS text-shadow.
 *
 * VISUAL EFFECT:
 * - Metallic cream face (#f2f1ec)
 * - 7-layer shaded fill extrusion (cream → dark, creating 3D depth)
 * - 8-layer gold stroke backing (dark grey → bright gold, peeking out behind extrusion)
 * - Subtle gold glow
 * - 3D perspective with rotateX
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * THEMES:
 * - default: gold backing (main site)
 * - cyan: cyan backing (about-exp-realty page)
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  theme = 'default',
}: HeadingProps) {
  const plainText = extractPlainText(children);
  const shadedClass = theme === 'cyan' ? 'h1-shaded-cyan' : 'h1-shaded';

  return (
    <h1
      id={id}
      className={`text-h1 text-display ${shadedClass} ${className}`}
      style={{
        color: '#f2f1ec',
        transform: 'perspective(800px) rotateX(12deg)',
        fontFeatureSettings: '"ss01" 1',
        filter: 'drop-shadow(0.04em 0.04em 0.06em rgba(0,0,0,0.6))',
        ...style,
      }}
    >
      {plainText}
    </h1>
  );
}
