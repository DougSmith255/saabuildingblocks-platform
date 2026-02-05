'use client';

import React, { useState, useEffect } from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Color theme for the heading - 'blue' for eXp Realty pages */
  theme?: 'default' | 'blue';
}

/**
 * H2 Component - Continuous Metal Plate Per Line
 *
 * Features:
 * - Neon glow using text-shadow (matches Tagline style)
 * - Metal backing plate that spans entire line (no gaps between words)
 * - box-decoration-break: clone for automatic line-by-line plates
 * - When text wraps, each line gets its own fitted plate
 * - Alt glyphs for N, E, M via font-feature-settings "ss01"
 *
 * SEO/ACCESSIBILITY:
 * - Uses real letters in DOM (Google reads correctly)
 * - Copy/paste gives real letters
 * - Font's ss01 stylistic set renders alternate glyphs visually
 *
 * @example
 * ```tsx
 * <H2>NEON TEXT</H2>
 * ```
 */
export default function H2({
  children,
  className = '',
  style = {},
  theme = 'default'
}: HeadingProps) {
  // Safari browser detection for reduced glow effects
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    // Safari detection: contains safari but not chrome (Chrome also has Safari in UA)
    const isSafariBrowser = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
    setIsSafari(isSafariBrowser);
  }, []);

  const isBlue = theme === 'blue';
  const textColor = isBlue ? '#b0d4e8' : '#bfbdb0';

  // Text-shadow for core glow on the text itself
  // Blue theme uses cyan-tinted glow; default uses white glow
  // Safari: reduced outer glow layers to prevent overly strong rendering
  const textShadow = isBlue
    ? (isSafari
      ? `
        0 0 1px rgba(176,212,232,0.8),
        0 0 2px rgba(176,212,232,0.6),
        0 0 8px rgba(0,191,255,0.4),
        0 0 16px rgba(0,191,255,0.15),
        0 0 24px rgba(0,191,255,0.05)
      `
      : `
        0 0 1px rgba(176,212,232,0.8),
        0 0 2px rgba(176,212,232,0.6),
        0 0 8px rgba(0,191,255,0.4),
        0 0 16px rgba(0,191,255,0.2),
        0 0 28px rgba(0,191,255,0.1),
        0 0 40px rgba(0,191,255,0.05)
      `)
    : (isSafari
      ? `
        0 0 1px #fff,
        0 0 2px #fff,
        0 0 8px rgba(255,255,255,0.4),
        0 0 16px rgba(255,255,255,0.15),
        0 0 24px rgba(255,255,255,0.05)
      `
      : `
        0 0 1px #fff,
        0 0 2px #fff,
        0 0 8px rgba(255,255,255,0.4),
        0 0 16px rgba(255,255,255,0.2),
        0 0 28px rgba(255,255,255,0.1),
        0 0 40px rgba(255,255,255,0.05)
      `);

  // Metal plate styles - applied to inline span, cloned per line
  const metalPlateStyle: React.CSSProperties = isBlue
    ? {
        background: 'linear-gradient(180deg, #122a47 0%, #0d2138 40%, #081828 100%)',
        borderTop: '2px solid rgba(100,180,220,0.45)',
        borderLeft: '1px solid rgba(60,130,180,0.35)',
        borderRight: '1px solid rgba(20,60,100,0.6)',
        borderBottom: '2px solid rgba(0,0,0,0.7)',
        boxShadow: `
          inset 0 1px 0 rgba(100,180,220,0.12),
          inset 0 -1px 2px rgba(0,0,0,0.25),
          0 4px 8px rgba(0,0,0,0.5),
          0 2px 4px rgba(0,0,0,0.3)
        `,
      }
    : {
        background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 40%, #171717 100%)',
        borderTop: '2px solid rgba(180,180,180,0.45)',
        borderLeft: '1px solid rgba(130,130,130,0.35)',
        borderRight: '1px solid rgba(60,60,60,0.6)',
        borderBottom: '2px solid rgba(0,0,0,0.7)',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.12),
          inset 0 -1px 2px rgba(0,0,0,0.25),
          0 4px 8px rgba(0,0,0,0.5),
          0 2px 4px rgba(0,0,0,0.3)
        `,
      };

  return (
    <h2
      className={`text-h2 ${className}`}
      style={{
        textAlign: 'center',
        fontFeatureSettings: '"ss01" 1',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '2.5rem',
        maxWidth: style.maxWidth || '1400px',
        ...style
      }}
    >
      <span
        style={{
          display: 'inline-block',
          color: textColor,
          textShadow,
          padding: '0.25em 0.4em',
          borderRadius: '0.15em',
          ...metalPlateStyle,
        }}
      >
        {children}
      </span>
    </h2>
  );
}
