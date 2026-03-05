'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import {
  H2_DEFAULT_CONFIG,
  H2_GOLD_CONFIG,
  H2_BLUE_CONFIG,
  H2_PURPLE_CONFIG,
  H2_EMERALD_CONFIG,
  H2_DEFAULT_TEXT_SHADOW,
  H2_GOLD_TEXT_SHADOW,
  H2_BLUE_TEXT_SHADOW,
  H2_PURPLE_TEXT_SHADOW,
  H2_EMERALD_TEXT_SHADOW,
} from './useStrokeBackLayers';
import type { StrokeConfig } from './useStrokeBackLayers';

export type H2Theme = 'default' | 'blue' | 'gold' | 'purple' | 'emerald';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading */
  theme?: H2Theme;
}

interface ThemeData {
  config: StrokeConfig;
  textShadow: string;
}

const THEMES: Record<H2Theme, ThemeData> = {
  default: { config: H2_DEFAULT_CONFIG, textShadow: H2_DEFAULT_TEXT_SHADOW },
  gold: { config: H2_GOLD_CONFIG, textShadow: H2_GOLD_TEXT_SHADOW },
  blue: { config: H2_BLUE_CONFIG, textShadow: H2_BLUE_TEXT_SHADOW },
  purple: { config: H2_PURPLE_CONFIG, textShadow: H2_PURPLE_TEXT_SHADOW },
  emerald: { config: H2_EMERALD_CONFIG, textShadow: H2_EMERALD_TEXT_SHADOW },
};

/**
 * H2 Component - 3D Text Effect via CSS text-shadow
 *
 * Renders entirely server-side for fast LCP.
 * Uses combined text-shadow (face extrusion + backing depth layers).
 *
 * Themes: default (grey), gold, blue, purple, emerald
 */
export default function H2({
  children,
  className = '',
  style = {},
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
        textAlign: (style.textAlign as React.CSSProperties['textAlign']) || 'center',
      }}
    >
      <h2
        className={`heading-front text-h2 ${className}`}
        style={{
          textAlign: style.textAlign || 'center',
          fontFeatureSettings: '"ss01" 1',
          marginLeft: style.textAlign === 'left' ? '0' : 'auto',
          marginRight: style.textAlign === 'right' ? '0' : 'auto',
          marginBottom: '2.5rem',
          maxWidth: style.maxWidth || '95%',
          color: config.faceColor,
          textShadow,
          transform: `perspective(800px) rotateX(${config.rotateX}) translate(${config.faceOffset.x},${config.faceOffset.y})`,
          lineHeight: 1.1,
          position: 'relative',
          overflow: 'visible',
          ...style,
        }}
      >
        {plainText}
      </h2>
    </div>
  );
}
