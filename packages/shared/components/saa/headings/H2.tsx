'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import { isMobile } from './layerUtils';
import { altGlyphs } from './altGlyphs';

export type H2Theme = 'default' | 'blue' | 'gold' | 'purple' | 'emerald';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading */
  theme?: H2Theme;
}

// ── Layer config ─────────────────────────────────────────────────────

interface BackingLayer {
  color: string;
  tx: string;
  ty: string;
  stroke: string;
}

interface H2Config {
  rotateX: string;
  rotateY: string;
  shadow: { color: string; tx: string; ty: string; blur: string };
  layers: BackingLayer[];
  face: { color: string; tx: string; ty: string; textShadow: string };
}

// ── Face text-shadow (extrusion depth) ───────────────────────────────

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

// ── Theme configs ────────────────────────────────────────────────────
// 2 backing layers: bright/far + dark/near (bolder)

const BASE = {
  rotateX: '8deg',
  rotateY: '-1.5deg',
};

const H2_DEFAULT: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(64, 64, 64, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#444444', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#1a1a1a', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#e5e4dd', tx: '-0.025em', ty: '-0.055em', textShadow: FACE_SHADOW },
};

const H2_GOLD: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(184, 150, 10, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#e6ac00', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#191818', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#e8d4a0', tx: '-0.025em', ty: '-0.055em', textShadow: FACE_SHADOW },
};

const H2_BLUE: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(10, 120, 152, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#00bfff', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#181920', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#b0d4e8', tx: '-0.025em', ty: '-0.055em', textShadow: FACE_SHADOW },
};

const H2_PURPLE: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(96, 48, 160, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#a855f7', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#1a1020', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#d4b0e8', tx: '-0.025em', ty: '-0.055em', textShadow: FACE_SHADOW },
};

const H2_EMERALD: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(10, 152, 104, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#10b981', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#101a18', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#a0e8c4', tx: '-0.025em', ty: '-0.055em', textShadow: FACE_SHADOW },
};

const THEME_CONFIGS: Record<H2Theme, H2Config> = {
  default: H2_DEFAULT,
  gold: H2_GOLD,
  blue: H2_BLUE,
  purple: H2_PURPLE,
  emerald: H2_EMERALD,
};

// ── Component ────────────────────────────────────────────────────────

export default function H2({
  children,
  className = '',
  style = {},
  theme = 'default',
}: HeadingProps) {
  const plainText = altGlyphs(extractPlainText(children));
  const config = THEME_CONFIGS[theme];
  const mobile = isMobile();
  const hasBacking = !mobile;
  const textAlign = (style.textAlign || 'center') as React.CSSProperties['textAlign'];
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${config.rotateX}) rotateY(${config.rotateY}) translate(${tx}, ${ty})`;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        overflow: 'visible',
        fontFeatureSettings: '"ss01" 1',
        textAlign,
      }}
    >
      {/* Backing layers (disabled on mobile for performance) */}
      {hasBacking && (
        <div aria-hidden="true" style={{ userSelect: 'none' }}>
          {/* Shadow */}
          <div
            className={`text-h2 ${className}`}
            style={{
              ...style,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              pointerEvents: 'none',
              textAlign,
              lineHeight: 1.1,

              marginLeft: textAlign === 'left' ? '0' : 'auto',
              marginRight: textAlign === 'right' ? '0' : 'auto',
              maxWidth: (style.maxWidth as string) || '95%',
              color: config.shadow.color,
              textShadow: 'none',
              transform: persp(config.shadow.tx, config.shadow.ty),
              filter: `blur(${config.shadow.blur})`,
            }}
          >
            {plainText}
          </div>
          {/* 2 stroked layers */}
          {config.layers.map((layer, i) => (
            <div
              key={i}
              className={`text-h2 ${className}`}
              style={{
                ...style,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                textAlign,
                lineHeight: 1.1,
  
                marginLeft: textAlign === 'left' ? '0' : 'auto',
                marginRight: textAlign === 'right' ? '0' : 'auto',
                maxWidth: (style.maxWidth as string) || '95%',
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
      <h2
        className={`text-h2 ${className}`}
        style={{
          textAlign,
          marginTop: 0,
          marginLeft: textAlign === 'left' ? '0' : 'auto',
          marginRight: textAlign === 'right' ? '0' : 'auto',
          marginBottom: '2.5rem',
          maxWidth: (style.maxWidth as string) || '95%',
          color: config.face.color,
          textShadow: hasBacking ? config.face.textShadow : FACE_SHADOW,
          transform: hasBacking ? persp(config.face.tx, config.face.ty) : undefined,
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
