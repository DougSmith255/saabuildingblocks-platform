'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import {
  useStrokeBackLayers,
  H2_DEFAULT_CONFIG,
  H2_GOLD_CONFIG,
  H2_BLUE_CONFIG,
  H2_PURPLE_CONFIG,
  H2_EMERALD_CONFIG,
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

const THEME_CONFIGS: Record<H2Theme, StrokeConfig> = {
  default: H2_DEFAULT_CONFIG,
  gold: H2_GOLD_CONFIG,
  blue: H2_BLUE_CONFIG,
  purple: H2_PURPLE_CONFIG,
  emerald: H2_EMERALD_CONFIG,
};

/**
 * H2 Component - 3D SVG Stroke Heading Effect
 *
 * Uses SVG stroke layers for sharp miter-joined backing depth,
 * with CSS text-shadow on the face for fill extrusion.
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
  const config = THEME_CONFIGS[theme];
  const wrapperRef = useStrokeBackLayers(config);

  return (
    <div
      ref={wrapperRef}
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
          textShadow: config.faceTextShadow,
          transform: `perspective(800px) rotateX(${config.rotateX})`,
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
