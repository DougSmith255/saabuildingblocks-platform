'use client';

import React, { useId } from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

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

/**
 * Stroke backing colors per theme.
 * 9 layers: 1 shadow (blurred) + 8 visible (bright at bottom, dark at top).
 * stroke-width .22em creates thick colored outlines around each letter.
 */
const STROKE_THEMES: Record<H1Theme, { shadow: string; layers: string[] }> = {
  default: {
    shadow: '#b8960a',
    layers: ['#e6ac00', '#d4a010', '#b8900a', '#9a7808', '#7c6008', '#5e4808', '#3f3010', '#191818'],
  },
  cyan: {
    shadow: '#0a6080',
    layers: ['#00bfff', '#0a98b8', '#087898', '#066078', '#044858', '#023040', '#012028', '#0a1818'],
  },
};

/**
 * H1 Component - SVG 3D Shaded Text
 *
 * Exact port of the CodePen "Shaded Text" technique using inline SVG.
 * Uses <text> elements with stroke-width to create visible colored outlines
 * around each letter, which CSS text-shadow cannot replicate.
 *
 * Structure (back to front):
 * 1. Stroke backing: 9 layers with stroke-width .22em (colored outlines)
 * 2. Fill extrusion: 7 layers creating 3D depth (cream gradient)
 * 3. Gold glow: subtle blurred gold behind face
 * 4. Face: metallic gradient (edge-darkened cream)
 */
export default function H1({
  children,
  className = '',
  style = {},
  id,
  theme = 'default',
}: HeadingProps) {
  const plainText = extractPlainText(children);
  const uid = useId().replace(/:/g, '');
  const sId = `hs${uid}`;
  const fId = `hf${uid}`;
  const shId = `hd${uid}`;
  const glId = `hg${uid}`;
  const grId = `hr${uid}`;

  const strokes = STROKE_THEMES[theme];
  const align = (style.textAlign as string) || 'center';
  const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
  const tx = align === 'left' ? '0%' : align === 'right' ? '100%' : '50%';

  return (
    <h1
      id={id}
      className={`text-h1 text-display ${className}`}
      style={{
        position: 'relative',
        textAlign: align as React.CSSProperties['textAlign'],
        ...style,
      }}
    >
      <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {plainText}
      </span>
      <svg
        aria-hidden="true"
        overflow="visible"
        style={{
          display: 'block',
          width: '100%',
          height: '5em',
          margin: '-1.5em auto -2em',
          fontFamily: 'inherit',
          fontFeatureSettings: '"ss01" 1',
          fontSize: 'inherit',
        }}
      >
        <defs>
          <filter id={shId}><feGaussianBlur in="SourceAlpha" stdDeviation="10"/></filter>
          <filter id={glId}>
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id={grId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dddcd5"/>
            <stop offset="35%" stopColor="#f2f1ec"/>
            <stop offset="65%" stopColor="#f2f1ec"/>
            <stop offset="100%" stopColor="#dddcd5"/>
          </linearGradient>
          <symbol id={sId} overflow="visible">
            <text x={tx} y="60%" fill="none" strokeWidth=".22em" paintOrder="stroke fill" textAnchor={anchor}>{plainText}</text>
          </symbol>
          <symbol id={fId} overflow="visible">
            <text x={tx} y="60%" textAnchor={anchor}>{plainText}</text>
          </symbol>
        </defs>
        {/* Stroke backing: 9 gold layers with thick outlines */}
        <g strokeDasharray="3.5em 0em" strokeLinecap="butt" strokeLinejoin="miter">
          <use x="0.167%" y="1.67%" href={`#${sId}`} stroke={strokes.shadow} opacity={0.5} filter={`url(#${shId})`}/>
          <use x="0.12%" y="1.2%" href={`#${sId}`} stroke={strokes.layers[0]}/>
          <use x="0.1%" y="1.0%" href={`#${sId}`} stroke={strokes.layers[1]}/>
          <use x="0.08%" y="0.8%" href={`#${sId}`} stroke={strokes.layers[2]}/>
          <use x="0.06%" y="0.6%" href={`#${sId}`} stroke={strokes.layers[3]}/>
          <use x="0.045%" y="0.45%" href={`#${sId}`} stroke={strokes.layers[4]}/>
          <use x="0.03%" y="0.3%" href={`#${sId}`} stroke={strokes.layers[5]}/>
          <use x="0.015%" y="0.15%" href={`#${sId}`} stroke={strokes.layers[6]}/>
          <use x="0%" y="0%" href={`#${sId}`} stroke={strokes.layers[7]}/>
        </g>
        {/* Fill extrusion: 7 cream-shaded layers */}
        <use x="0.15%" y="0.4%" href={`#${fId}`} fill="#7a7970"/>
        <use x="0.124%" y="0.14%" href={`#${fId}`} fill="#8d8c80"/>
        <use x="0.099%" y="-0.11%" href={`#${fId}`} fill="#a09f94"/>
        <use x="0.073%" y="-0.37%" href={`#${fId}`} fill="#b3b2a8"/>
        <use x="0.047%" y="-0.63%" href={`#${fId}`} fill="#c2c1b8"/>
        <use x="0.021%" y="-0.89%" href={`#${fId}`} fill="#d1d0c7"/>
        <use x="-0.004%" y="-1.14%" href={`#${fId}`} fill="#dddcd5"/>
        {/* Gold glow behind face */}
        <use x="-0.06%" y="-1.4%" href={`#${fId}`} fill="#ffd700" opacity={0.15} filter={`url(#${glId})`}/>
        {/* Face with metallic gradient */}
        <use x="-0.06%" y="-1.4%" href={`#${fId}`} fill={`url(#${grId})`}/>
      </svg>
    </h1>
  );
}
