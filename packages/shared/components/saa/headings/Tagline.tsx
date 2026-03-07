'use client';

import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

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

// Uses H2 default (grey) backing style

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

const SHADOW = { color: 'rgba(64, 64, 64, 0.4)', tx: '0.02em', ty: '0.06em', blur: '4px' };

const LAYERS = [
  { color: '#444444', tx: '0.018em', ty: '0.053em' },
  { color: '#3e3e3e', tx: '0.015em', ty: '0.045em' },
  { color: '#383838', tx: '0.013em', ty: '0.038em' },
  { color: '#323232', tx: '0.009em', ty: '0.028em' },
  { color: '#2c2c2c', tx: '0.006em', ty: '0.019em' },
  { color: '#262626', tx: '0.003em', ty: '0.010em' },
  { color: '#202020', tx: '0.002em', ty: '0.005em' },
  { color: '#1a1a1a', tx: '0em', ty: '0em' },
];

const RX = '8deg';
const RY = '-1.5deg';
const STROKE = '0.06em';

export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  const plainText = extractPlainText(children);
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${RX}) rotateY(${RY}) translate(${tx}, ${ty})`;

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
      {/* SVG filter for sharp backing corners */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="saa-sharp-h2" x="-10%" y="-25%" width="120%" height="150%" primitiveUnits="userSpaceOnUse">
            <feMorphology operator="dilate" radius={2} in="SourceGraphic" result="expanded" />
            <feGaussianBlur stdDeviation={0.4} in="expanded" result="smoothed" />
            <feComponentTransfer in="smoothed">
              <feFuncA type="linear" slope={20} intercept={0} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Backing layers - disabled pending alignment fix */}

      {/* Face */}
      <p
        className={`text-h2 ${className}`}
        style={{
          textAlign: 'center',
          fontFeatureSettings: '"ss01" 1',
          margin: 0,
          color: '#e5e4dd',
          textShadow: FACE_SHADOW,
          transform: persp('-0.025em', '-0.035em'),
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
