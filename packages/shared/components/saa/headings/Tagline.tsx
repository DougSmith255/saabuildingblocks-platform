'use client';

import React, { useId } from 'react';
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

/**
 * Tagline Component - SVG 3D Shaded Text (matches H2 default style)
 *
 * Uses the same SVG technique as H2 with default grey stroke backing,
 * cream fill extrusion, and flat #e5e4dd face.
 */
export default function Tagline({
  children,
  className = '',
  style = {},
  counterSuffix,
}: TaglineProps) {
  const plainText = extractPlainText(children);
  const uid = useId().replace(/:/g, '');
  const sId = `st${uid}`;
  const fId = `ft${uid}`;
  const shId = `sht${uid}`;

  return (
    <p
      className={`text-tagline ${className}`}
      style={{
        textAlign: 'center',
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
            <text x="50%" y="60%" fill="none" strokeWidth=".10em" paintOrder="stroke fill" textAnchor="middle">{plainText}</text>
          </symbol>
          <symbol id={fId} overflow="visible">
            <text x="50%" y="60%" textAnchor="middle">{plainText}</text>
          </symbol>
        </defs>
        {/* Stroke backing: 5 grey layers (same as H2 default) */}
        <g strokeDasharray="3.5em 0em" strokeLinecap="butt" strokeLinejoin="miter">
          <use x="0.167%" y="1.67%" href={`#${sId}`} stroke="#2a2a2a" opacity={0.5} filter={`url(#${shId})`}/>
          <use x="0.12%" y="1.2%" href={`#${sId}`} stroke="#4a4a4a"/>
          <use x="0.073%" y="0.73%" href={`#${sId}`} stroke="#3e3e3e"/>
          <use x="0.033%" y="0.33%" href={`#${sId}`} stroke="#333333"/>
          <use x="0%" y="0%" href={`#${sId}`} stroke="#282828"/>
        </g>
        {/* Fill extrusion: 8 cream-shaded layers */}
        <use x="0.15%" y="0.4%" href={`#${fId}`} fill="#7a7970"/>
        <use x="0.124%" y="0.14%" href={`#${fId}`} fill="#8d8c80"/>
        <use x="0.099%" y="-0.11%" href={`#${fId}`} fill="#a09f94"/>
        <use x="0.073%" y="-0.37%" href={`#${fId}`} fill="#b3b2a8"/>
        <use x="0.047%" y="-0.63%" href={`#${fId}`} fill="#c2c1b8"/>
        <use x="0.021%" y="-0.89%" href={`#${fId}`} fill="#d1d0c7"/>
        <use x="-0.004%" y="-1.14%" href={`#${fId}`} fill="#dddcd5"/>
        {/* Face */}
        <use x="-0.06%" y="-1.4%" href={`#${fId}`} fill="#e5e4dd"/>
      </svg>
      {counterSuffix}
    </p>
  );
}
