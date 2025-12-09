import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** @deprecated Animation removed - using page-level settling mask instead */
  heroAnimate?: boolean;
  /** @deprecated Animation removed - using page-level settling mask instead */
  animationDelay?: string;
}

// Map specific characters to alternate glyphs
const ALT_GLYPHS: Record<string, string> = {
  'N': '\uf015',
  'E': '\uf011',
  'M': '\uf016'
};

/**
 * H1 Component - Server Component (No JavaScript Required)
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Pure Server Component (no 'use client')
 * - CSS-only styling (no React hydration needed)
 * - Static neon glow (no flickering or gradient animations)
 * - Static HTML rendered on server
 *
 * VISUAL EFFECT:
 * - 3D perspective with rotateX
 * - Gold neon glow via text-shadow
 * - Metal backing plate via ::before pseudo-element
 * - Glossy highlight via ::after pseudo-element
 *
 * FIREFOX FIX:
 * - Uses single element with CSS text-shadow instead of stacked spans
 * - Matches H2 approach to avoid subpixel rendering gaps
 */
export default function H1({ children, className = '', style = {}, id }: HeadingProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string and split into words
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(' ');

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .h1-char {
          display: inline-block;
          position: relative;
        }

        /* Per-word metal backing plate with neon text */
        /* Using em units so glow scales with font size */
        .h1-word {
          display: inline-flex;
          position: relative;
          /* Gold neon glow text-shadow - em units for responsive scaling */
          color: #ffd700;
          text-shadow:
            -0.02em -0.02em 0 rgba(255,255,255, 0.4),
            0.02em -0.02em 0 rgba(255,255,255, 0.4),
            -0.02em 0.02em 0 rgba(255,255,255, 0.4),
            0.02em 0.02em 0 rgba(255,255,255, 0.4),
            0 -0.03em 0.1em #ffd700,
            0 0 0.03em #ffd700,
            0 0 0.07em #ffd700,
            0 0 0.12em #ffb347,
            0 0.03em 0.05em #000;
        }

        /* Metal backing plate - 3D brushed gunmetal effect with glossy highlights */
        .h1-word::before {
          content: "";
          position: absolute;
          /* Negative inset extends plate beyond the word - equal top/bottom */
          top: -0.2em;
          left: -0.25em;
          right: -0.25em;
          bottom: -0.2em;
          /* Brushed gunmetal gradient - darker for H1 prominence */
          background: linear-gradient(
            180deg,
            #4a4a4a 0%,
            #3a3a3a 40%,
            #2a2a2a 100%
          );
          /* Rounded corners on all sides */
          border-radius: 0.12em;
          z-index: -1;
          /* Beveled edge effect - lighter top/left for raised look */
          border-top: 2px solid rgba(180,180,180,0.45);
          border-left: 1px solid rgba(130,130,130,0.35);
          border-right: 1px solid rgba(60,60,60,0.6);
          border-bottom: 2px solid rgba(0,0,0,0.7);
          /* Multi-layer shadow for depth and floating effect */
          box-shadow:
            /* Inner highlight at top for glossy reflection */
            inset 0 1px 0 rgba(255,255,255,0.12),
            /* Inner shadow at bottom for depth */
            inset 0 -1px 2px rgba(0,0,0,0.25),
            /* Main drop shadow */
            0 4px 8px rgba(0,0,0,0.5),
            /* Soft ambient shadow */
            0 2px 4px rgba(0,0,0,0.3);
        }

        /* Glossy highlight overlay on metal plate */
        .h1-word::after {
          content: "";
          position: absolute;
          top: -0.2em;
          left: -0.25em;
          right: -0.25em;
          height: 50%;
          /* Glossy reflection gradient */
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.02) 50%,
            transparent 100%
          );
          border-radius: 0.12em 0.12em 0 0;
          z-index: -1;
          pointer-events: none;
        }
      `
        }}
      />

      <h1
        id={id}
        className={`text-h1 text-display ${className}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4em',
          flexWrap: 'wrap',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg)',
          position: 'relative',
          // Padding to compensate for metal plate negative inset
          paddingLeft: '0.3em',
          paddingRight: '0.3em',
          ...style,
        }}
      >
        {/* SEO-friendly hidden text for search engines and screen readers */}
        <span className="sr-only">{plainText}</span>

        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className="h1-word"
            style={{
              display: 'inline-flex',
              position: 'relative',
            }}
          >
            {word.split('').map((char, charIndex) => {
              // Apply alt glyph if available
              const upperChar = char.toUpperCase();
              const displayChar = ALT_GLYPHS[upperChar] || char;

              return (
                <span key={charIndex} className="h1-char">
                  {displayChar}
                </span>
              );
            })}
          </span>
        ))}
      </h1>
    </>
  );
}
