'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import { useStrokeBackLayers, H1_GOLD_CONFIG, H1_CYAN_CONFIG } from './useStrokeBackLayers';
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

const THEME_CONFIGS: Record<H1Theme, StrokeConfig> = {
  default: H1_GOLD_CONFIG,
  cyan: H1_CYAN_CONFIG,
};

/**
 * H1 Component - 3D SVG Stroke Heading Effect
 *
 * Uses SVG stroke layers for sharp miter-joined backing depth,
 * with CSS text-shadow on the face for fill extrusion.
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
      }}
    >
      <h1
        id={id}
        className={`heading-front text-h1 text-display ${className}`}
        style={{
          color: config.faceColor,
          transform: `perspective(800px) rotateX(${config.rotateX})`,
          fontFeatureSettings: '"ss01" 1',
          textShadow: config.faceTextShadow,
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
