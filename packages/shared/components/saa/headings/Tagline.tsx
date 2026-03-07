'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

import { altGlyphs } from './altGlyphs';

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

// Uses H2 default (grey) backing style - 2 layers

const FACE_SHADOW = [
  '0.003em 0.005em 0 #dddcd5',
  '0.006em 0.011em 0 #d5d4cb',
  '0.009em 0.017em 0 #cccbc2',
  '0.012em 0.023em 0 #c2c1b8',
  '0.015em 0.030em 0 #b8b7ae',
  '0.018em 0.037em 0 #abaa9f',
  '0.021em 0.044em 0 #a09f94',
  '0.024em 0.051em 0 #96958a',
  '0.027em 0.058em 0 #8d8c80',
  '0.030em 0.065em 0 #838277',
  '0.033em 0.070em 0 #7a7970',
].join(', ');

const SHADOW = { color: 'rgba(64, 64, 64, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' };

const LAYERS = [
  { color: '#444444', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
  { color: '#1a1a1a', tx: '0em', ty: '0em', stroke: '0.16em' },
];

const RX = '8deg';
const RY = '-1.5deg';

export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  const plainText = altGlyphs(extractPlainText(children));
  const hasBacking = true;
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${RX}) rotateY(${RY}) translate(${tx}, ${ty})`;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        overflow: 'visible',
        fontFeatureSettings: '"ss02" 1',
        textAlign: 'center',
        marginTop: '30px',
        marginBottom: '30px',
      }}
    >
      {/* Backing layers (disabled on mobile for performance) */}
      {hasBacking && (
        <div aria-hidden="true" style={{ userSelect: 'none' }}>
          {/* Shadow */}
          <div
            className="text-h2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              pointerEvents: 'none',
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.1,

              color: SHADOW.color,
              textShadow: 'none',
              transform: persp(SHADOW.tx, SHADOW.ty),
              filter: `blur(${SHADOW.blur})`,
            }}
          >
            {plainText}
          </div>
          {/* 2 stroked layers */}
          {LAYERS.map((layer, i) => (
            <div
              key={i}
              className="text-h2"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.1,
  
                color: layer.color,
                WebkitTextStroke: `${layer.stroke} ${layer.color}`,
                WebkitTextFillColor: layer.color,
                paintOrder: 'stroke fill',
                textShadow: 'none',
                transform: persp(layer.tx, layer.ty),
              }}
            >
              {plainText}
            </div>
          ))}
        </div>
      )}

      {/* Face */}
      <p
        className={`text-h2 ${className}`}
        style={{
          textAlign: 'center',
          margin: 0,
          color: '#e5e4dd',
          textShadow: hasBacking ? FACE_SHADOW : FACE_SHADOW,
          transform: hasBacking ? persp('-0.025em', '-0.055em') : undefined,
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
