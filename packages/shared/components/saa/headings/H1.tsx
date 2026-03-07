'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';
import { isMobile } from './layerUtils';
import { altGlyphs } from './altGlyphs';

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

// ── Layer config ─────────────────────────────────────────────────────

interface BackingLayer {
  color: string;
  tx: string;
  ty: string;
  stroke: string;
}

interface H1Config {
  rotateX: string;
  rotateY: string;
  shadow: { color: string; tx: string; ty: string; blur: string };
  layers: BackingLayer[];
  face: { color: string; tx: string; ty: string; textShadow: string };
}

// ── Face text-shadow (extrusion depth) ───────────────────────────────

const EXTRUSION_SHADOWS = [
  '0.003em 0.005em 0 #e5e4dd',
  '0.006em 0.010em 0 #e0dfda',
  '0.009em 0.016em 0 #dbdad5',
  '0.012em 0.022em 0 #d5d4cd',
  '0.015em 0.028em 0 #cfcec6',
  '0.018em 0.035em 0 #c8c7bf',
  '0.021em 0.042em 0 #c0bfb7',
  '0.024em 0.049em 0 #b8b7ae',
  '0.027em 0.056em 0 #b0afa5',
  '0.030em 0.063em 0 #a7a69c',
  '0.033em 0.070em 0 #9e9d93',
  '0.036em 0.077em 0 #96958a',
  '0.039em 0.084em 0 #8d8c80',
  '0.042em 0.090em 0 #848377',
  '0.045em 0.096em 0 #7c7b6f',
  '0.048em 0.102em 0 #747367',
].join(', ');

const GOLD_FACE_SHADOW = [
  '0 0 0.08em rgba(255, 215, 0, 0.4)',
  '0 0 0.2em rgba(255, 215, 0, 0.25)',
  EXTRUSION_SHADOWS,
].join(', ');

const CYAN_FACE_SHADOW = [
  '0 0 0.08em rgba(0, 191, 255, 0.4)',
  '0 0 0.2em rgba(0, 191, 255, 0.25)',
  EXTRUSION_SHADOWS,
].join(', ');

// ── Theme configs ────────────────────────────────────────────────────
// 2 backing layers: bright/far + dark/near (bolder)

const H1_GOLD: H1Config = {
  rotateX: '12deg',
  rotateY: '-2deg',
  shadow: { color: 'rgba(184, 150, 10, 0.5)', tx: '0.025em', ty: '0.07em', blur: '6px' },
  layers: [
    { color: '#e6ac00', tx: '0.022em', ty: '0.065em', stroke: '0.16em' },
    { color: '#191818', tx: '0em', ty: '0em', stroke: '0.22em' },
  ],
  face: { color: '#f2f1ec', tx: '-0.04em', ty: '-0.08em', textShadow: GOLD_FACE_SHADOW },
};

const H1_CYAN: H1Config = {
  rotateX: '12deg',
  rotateY: '-2deg',
  shadow: { color: 'rgba(10, 120, 152, 0.5)', tx: '0.025em', ty: '0.07em', blur: '6px' },
  layers: [
    { color: '#00bfff', tx: '0.022em', ty: '0.065em', stroke: '0.16em' },
    { color: '#181920', tx: '0em', ty: '0em', stroke: '0.22em' },
  ],
  face: { color: '#f2f1ec', tx: '-0.04em', ty: '-0.08em', textShadow: CYAN_FACE_SHADOW },
};

const THEME_CONFIGS: Record<H1Theme, H1Config> = {
  default: H1_GOLD,
  cyan: H1_CYAN,
};

// ── Component ────────────────────────────────────────────────────────

export default function H1({
  children,
  className = '',
  style = {},
  id,
  theme = 'default',
}: HeadingProps) {
  const plainText = altGlyphs(extractPlainText(children));
  const config = THEME_CONFIGS[theme];
  const mobile = isMobile();
  const hasBacking = !mobile;
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${config.rotateX}) rotateY(${config.rotateY}) translate(${tx}, ${ty})`;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', overflow: 'visible', fontFeatureSettings: '"ss01" 1' }}>
      {/* Backing layers (disabled on mobile for performance) */}
      {hasBacking && (
        <div aria-hidden="true" style={{ userSelect: 'none', position: 'absolute', inset: 0 }}>
          {/* Shadow */}
          <div
            className={`text-h1 text-display ${className}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              pointerEvents: 'none',
              margin: 0,
              lineHeight: 1.1,
              fontSize: style.fontSize,
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
              className={`text-h1 text-display ${className}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                margin: 0,
                lineHeight: 1.1,
                fontSize: style.fontSize,
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
      <h1
        id={id}
        className={`text-h1 text-display ${className}`}
        style={{
          margin: 0,
          color: config.face.color,
          textShadow: hasBacking ? config.face.textShadow : EXTRUSION_SHADOWS,
          transform: hasBacking ? persp(config.face.tx, config.face.ty) : undefined,
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
