'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import { H2_DEFAULT_CONFIG, H2_DEFAULT_TEXT_SHADOW } from './useStrokeBackLayers';

export interface TaglineProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** @deprecated Animation removed */
  heroAnimate?: boolean;
  /** @deprecated Animation removed */
  animationDelay?: string;
  /** @deprecated Use counterSuffix prop with a client component instead */
  showAgentCounter?: boolean;
  /** Optional counter suffix ReactNode - pass a client component for viewport-aware rendering */
  counterSuffix?: React.ReactNode;
}

/**
 * Tagline Component - 3D Text Effect via CSS text-shadow (matches H2 default style)
 *
 * Renders entirely server-side for fast LCP.
 * Uses combined text-shadow (face extrusion + backing depth layers).
 */
export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  const plainText = extractPlainText(children);
  const config = H2_DEFAULT_CONFIG;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        overflow: 'visible',
        textAlign: 'center',
        marginTop: '30px',
        marginBottom: '30px',
      }}
    >
      <p
        className={`heading-front text-h2 ${className}`}
        style={{
          textAlign: 'center',
          fontFeatureSettings: '"ss01" 1',
          color: config.faceColor,
          textShadow: H2_DEFAULT_TEXT_SHADOW,
          transform: `perspective(800px) rotateX(${config.rotateX}) translate(${config.faceOffset.x},${config.faceOffset.y})`,
          lineHeight: 1.1,
          position: 'relative',
          overflow: 'visible',
          ...style,
        }}
      >
        {plainText} {counterSuffix}
      </p>
    </div>
  );
}
