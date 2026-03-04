'use client';

import React, { useId } from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export type H2Theme = 'default' | 'blue' | 'gold' | 'purple' | 'emerald';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading */
  theme?: H2Theme;
}

/**
 * Stroke backing colors per theme.
 * 5 layers: 1 shadow (blurred) + 4 visible.
 * stroke-width .10em (thinner than H1's .22em).
 */
const STROKE_THEMES: Record<H2Theme, { shadow: string; layers: string[]; faceColor: string }> = {
  default: {
    shadow: '#2a2a2a',
    layers: ['#4a4a4a', '#3e3e3e', '#333333', '#282828'],
    faceColor: '#e5e4dd',
  },
  blue: {
    shadow: '#0a3060',
    layers: ['#00bfff', '#0a7898', '#084a68', '#0a3a50'],
    faceColor: '#b0d4e8',
  },
  gold: {
    shadow: '#5e4808',
    layers: ['#e6ac00', '#b8900a', '#7c6008', '#3f3010'],
    faceColor: '#e8d4a0',
  },
  purple: {
    shadow: '#2a1535',
    layers: ['#a855f7', '#6030a0', '#3a1a50', '#1a1020'],
    faceColor: '#d4b0e8',
  },
  emerald: {
    shadow: '#0f3a2a',
    layers: ['#10b981', '#086048', '#0a4a38', '#101a18'],
    faceColor: '#a0e8c4',
  },
};

/**
 * H2 Component - SVG 3D Shaded Text
 *
 * Exact port of the CodePen "Shaded Text" H2 technique using inline SVG.
 * Uses <text> elements with stroke-width .10em to create visible colored outlines.
 *
 * Structure (back to front):
 * 1. Stroke backing: 5 layers with stroke-width .10em (themed colored outlines)
 * 2. Fill extrusion: 8 layers creating 3D depth (cream gradient)
 * 3. Face: flat themed color (no gradient, unlike H1)
 */
export default function H2({
  children,
  className = '',
  style = {},
  theme = 'default'
}: HeadingProps) {
  const plainText = extractPlainText(children);
  const uid = useId().replace(/:/g, '');
  const sId = `s2${uid}`;
  const fId = `f2${uid}`;
  const shId = `sh2${uid}`;

  const strokes = STROKE_THEMES[theme];
  const align = (style.textAlign as string) || 'center';
  const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
  const tx = align === 'left' ? '0%' : align === 'right' ? '100%' : '50%';

  return (
    <h2
      className={`text-h2 ${className}`}
      style={{
        textAlign: align as React.CSSProperties['textAlign'],
        marginLeft: align === 'left' ? '0' : 'auto',
        marginRight: align === 'right' ? '0' : 'auto',
        marginBottom: '2.5rem',
        maxWidth: style.maxWidth || '95%',
        position: 'relative',
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
          <symbol id={sId} overflow="visible">
            <text x={tx} y="60%" fill="none" strokeWidth=".10em" paintOrder="stroke fill" textAnchor={anchor}>{plainText}</text>
          </symbol>
          <symbol id={fId} overflow="visible">
            <text x={tx} y="60%" textAnchor={anchor}>{plainText}</text>
          </symbol>
        </defs>
        {/* Stroke backing: 5 themed layers */}
        <g strokeDasharray="3.5em 0em" strokeLinecap="butt" strokeLinejoin="miter">
          <use x="0.167%" y="1.67%" href={`#${sId}`} stroke={strokes.shadow} opacity={0.5} filter={`url(#${shId})`}/>
          <use x="0.12%" y="1.2%" href={`#${sId}`} stroke={strokes.layers[0]}/>
          <use x="0.073%" y="0.73%" href={`#${sId}`} stroke={strokes.layers[1]}/>
          <use x="0.033%" y="0.33%" href={`#${sId}`} stroke={strokes.layers[2]}/>
          <use x="0%" y="0%" href={`#${sId}`} stroke={strokes.layers[3]}/>
        </g>
        {/* Fill extrusion: 8 cream-shaded layers (face is last) */}
        <use x="0.15%" y="0.4%" href={`#${fId}`} fill="#7a7970"/>
        <use x="0.124%" y="0.14%" href={`#${fId}`} fill="#8d8c80"/>
        <use x="0.099%" y="-0.11%" href={`#${fId}`} fill="#a09f94"/>
        <use x="0.073%" y="-0.37%" href={`#${fId}`} fill="#b3b2a8"/>
        <use x="0.047%" y="-0.63%" href={`#${fId}`} fill="#c2c1b8"/>
        <use x="0.021%" y="-0.89%" href={`#${fId}`} fill="#d1d0c7"/>
        <use x="-0.004%" y="-1.14%" href={`#${fId}`} fill="#dddcd5"/>
        {/* Face: flat themed color */}
        <use x="-0.06%" y="-1.4%" href={`#${fId}`} fill={strokes.faceColor}/>
      </svg>
    </h2>
  );
}
