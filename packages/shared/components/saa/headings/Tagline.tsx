'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import { useStrokeBackLayers, H2_DEFAULT_CONFIG } from './useStrokeBackLayers';

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
 * Tagline Component - 3D SVG Stroke Effect (matches H2 default style)
 *
 * Uses SVG stroke layers for sharp miter-joined backing depth,
 * with CSS text-shadow on the face for fill extrusion.
 */
export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  const plainText = extractPlainText(children);
  const config = H2_DEFAULT_CONFIG;
  const wrapperRef = useStrokeBackLayers(config);

  return (
    <div
      ref={wrapperRef}
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
          textShadow: config.faceTextShadow,
          transform: `perspective(800px) rotateX(${config.rotateX})`,
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
