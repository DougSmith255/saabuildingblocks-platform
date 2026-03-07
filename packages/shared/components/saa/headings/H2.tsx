'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

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
}

interface H2Config {
  rotateX: string;
  rotateY: string;
  strokeWidth: string;
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

// ── Shared H2 translate offsets (8 layers) ───────────────────────────

const TX = [
  { tx: '0.018em', ty: '0.053em' },
  { tx: '0.015em', ty: '0.045em' },
  { tx: '0.013em', ty: '0.038em' },
  { tx: '0.009em', ty: '0.028em' },
  { tx: '0.006em', ty: '0.019em' },
  { tx: '0.003em', ty: '0.010em' },
  { tx: '0.002em', ty: '0.005em' },
  { tx: '0em', ty: '0em' },
];

const makeLayers = (colors: string[]): BackingLayer[] =>
  colors.map((color, i) => ({ color, ...TX[i] }));

// ── Theme configs ────────────────────────────────────────────────────
// 8 backing layers: bright color (far) -> dark (near face)

const BASE = {
  rotateX: '8deg',
  rotateY: '-1.5deg',
  strokeWidth: '0.06em',
};

const H2_DEFAULT: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(64, 64, 64, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' },
  layers: makeLayers(['#444444', '#3e3e3e', '#383838', '#323232', '#2c2c2c', '#262626', '#202020', '#1a1a1a']),
  face: { color: '#e5e4dd', tx: '-0.025em', ty: '-0.035em', textShadow: FACE_SHADOW },
};

const H2_GOLD: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(184, 150, 10, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' },
  layers: makeLayers(['#e6ac00', '#c89703', '#ab8207', '#8e6c0a', '#7c6008', '#5e4808', '#3f3010', '#191818']),
  face: { color: '#e8d4a0', tx: '-0.025em', ty: '-0.035em', textShadow: FACE_SHADOW },
};

const H2_BLUE: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(10, 120, 152, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' },
  layers: makeLayers(['#00bfff', '#0aacdd', '#0a98bb', '#088499', '#086080', '#0a3a50', '#1a2a38', '#181920']),
  face: { color: '#b0d4e8', tx: '-0.025em', ty: '-0.035em', textShadow: FACE_SHADOW },
};

const H2_PURPLE: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(96, 48, 160, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' },
  layers: makeLayers(['#a855f7', '#7845c8', '#6030a0', '#4a2068', '#3a1a50', '#2a1535', '#1a1020', '#1a1020']),
  face: { color: '#d4b0e8', tx: '-0.025em', ty: '-0.035em', textShadow: FACE_SHADOW },
};

const H2_EMERALD: H2Config = {
  ...BASE,
  shadow: { color: 'rgba(10, 152, 104, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' },
  layers: makeLayers(['#10b981', '#0a9868', '#086048', '#0a4a38', '#0f3a2a', '#152a25', '#101a18', '#101a18']),
  face: { color: '#a0e8c4', tx: '-0.025em', ty: '-0.035em', textShadow: FACE_SHADOW },
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
  const plainText = extractPlainText(children);
  const config = THEME_CONFIGS[theme];
  const textAlign = (style.textAlign || 'center') as React.CSSProperties['textAlign'];
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${config.rotateX}) rotateY(${config.rotateY}) translate(${tx}, ${ty})`;

  const layerBase: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
    textAlign,
    lineHeight: 1.1,
    fontFeatureSettings: '"ss01" 1',
    marginLeft: textAlign === 'left' ? '0' : 'auto',
    marginRight: textAlign === 'right' ? '0' : 'auto',
    maxWidth: (style.maxWidth as string) || '95%',
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        overflow: 'visible',
        textAlign,
      }}
    >
      {/* SVG filter for sharp backing corners */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="saa-sharp-h2" x="-10%" y="-25%" width="120%" height="150%" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius={2} in="SourceGraphic" result="expanded" />
            <feGaussianBlur stdDeviation={0.8} in="expanded" result="smoothed" />
            <feComponentTransfer in="smoothed">
              <feFuncA type="linear" slope={15} intercept={0} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Backing layers */}
      <div aria-hidden="true" style={{ userSelect: 'none' }}>
        {/* Shadow */}
        <div
          className={`text-h2 ${className}`}
          style={{
            ...style,
            ...layerBase,
            color: config.shadow.color,
            textShadow: 'none',
            transform: persp(config.shadow.tx, config.shadow.ty),
            filter: `blur(${config.shadow.blur})`,
          }}
        >
          {plainText}
        </div>
        {/* Color layers */}
        {config.layers.map((layer, i) => (
          <div
            key={i}
            className={`text-h2 ${className}`}
            style={{
              ...style,
              ...layerBase,
              color: layer.color,
              WebkitTextStroke: `${config.strokeWidth} ${layer.color}`,
              WebkitTextFillColor: layer.color,
              paintOrder: 'stroke fill',
              textShadow: 'none',
              filter: 'url(#saa-sharp-h2)',
              transform: persp(layer.tx, layer.ty),
            }}
          >
            {plainText}
          </div>
        ))}
      </div>

      {/* Face */}
      <h2
        className={`text-h2 ${className}`}
        style={{
          textAlign,
          fontFeatureSettings: '"ss01" 1',
          marginTop: 0,
          marginLeft: textAlign === 'left' ? '0' : 'auto',
          marginRight: textAlign === 'right' ? '0' : 'auto',
          marginBottom: '2.5rem',
          maxWidth: (style.maxWidth as string) || '95%',
          color: config.face.color,
          textShadow: config.face.textShadow,
          transform: persp(config.face.tx, config.face.ty),
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
