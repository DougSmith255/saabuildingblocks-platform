'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import {
  H1_GOLD_CONFIG,
  H1_CYAN_CONFIG,
  H1_GOLD_TEXT_SHADOW,
  H1_CYAN_TEXT_SHADOW,
} from './useStrokeBackLayers';
import type { StrokeConfig } from './useStrokeBackLayers';

export type H1Theme = 'default' | 'cyan';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** @deprecated No longer used */
  noAnimation?: boolean;
  /** @deprecated No longer used */
  disableCloseGlow?: boolean;
  /** Color theme for the backing stroke layers */
  theme?: H1Theme;
}

interface ThemeData {
  config: StrokeConfig;
  textShadow: string;
}

const THEMES: Record<H1Theme, ThemeData> = {
  default: { config: H1_GOLD_CONFIG, textShadow: H1_GOLD_TEXT_SHADOW },
  cyan: { config: H1_CYAN_CONFIG, textShadow: H1_CYAN_TEXT_SHADOW },
};

/**
 * H1 Component - 3D Text Effect via CSS text-shadow
 *
 * Renders entirely server-side for fast LCP.
 * Uses combined text-shadow (face extrusion + backing depth layers).
 *
 * THEMES:
 * - default: gold backing (main site)
 * - cyan: cyan backing (about-exp-realty page)
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  theme = 'default',
}: HeadingProps) {
  const plainText = extractPlainText(children);
  const { config, textShadow } = THEMES[theme];

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        overflow: 'visible',
      }}
    >
      <h1
        id={id}
        className={`heading-front text-h1 text-display ${className}`}
        style={{
          color: config.faceColor,
          transform: `perspective(800px) rotateX(${config.rotateX}) translate(${config.faceOffset.x},${config.faceOffset.y})`,
          fontFeatureSettings: '"ss01" 1',
          textShadow,
          lineHeight: 1.1,
          position: 'relative',
          overflow: 'visible',
          ...style,
        }}
      >
        {plainText}
      </h1>
    </div>
  );
}
