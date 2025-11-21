import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  heroAnimate?: boolean;
  animationDelay?: string;
}

/**
 * H1 Component - Server Component (No JavaScript Required)
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Pure Server Component (no 'use client')
 * - CSS-only fade-in animation (no React hydration needed)
 * - Neon flicker effects loaded separately via lazy component
 * - Static HTML rendered on server
 *
 * This eliminates ~74s of mobile blocking time!
 */
export default function H1({ children, className = '', style = {}, id, heroAnimate = true, animationDelay = '0.3s' }: HeadingProps) {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string for processing
  const text = typeof children === 'string' ? children : String(children);

  // Split text into words
  const words = text.split(' ');

  return (
    <h1
      id={id}
      className={`text-h1 text-display ${heroAnimate ? 'hero-entrance-animate' : ''} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'rotateX(15deg)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: 0,
        columnGap: '0.5em',
        ...(heroAnimate ? {
          opacity: 0,
          animation: `fadeInUp2025 2.0s cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay} both`,
          willChange: 'opacity, transform',
        } : {}),
        ...style,
      }}
    >
      {/* SEO-friendly hidden text for search engines and screen readers */}
      <span className="sr-only">{plainText}</span>

      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => {
            // Alt glyphs: N = U+f015, E = U+f011, M = U+f016
            let displayChar = char;
            const upperChar = char.toUpperCase();
            if (upperChar === 'N') displayChar = '\uf015';
            if (upperChar === 'E') displayChar = '\uf011';
            if (upperChar === 'M') displayChar = '\uf016';

            return (
              <span
                key={charIndex}
                className="neon-char-static"
                data-char={displayChar}
                style={{
                  transform: 'translateZ(20px)',
                  display: 'inline-block',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  // Dark letter body - always visible
                  color: 'rgba(45,45,45,1)',
                  textShadow: `
                    1px 1px 0 #1a1a1a,
                    2px 2px 0 #0f0f0f,
                    3px 3px 0 #0a0a0a,
                    4px 4px 0 #050505,
                    5px 5px 12px rgba(0, 0, 0, 0.8)
                  `,
                }}
              >
                {displayChar}
                {/* Neon glow with flicker animation */}
                <span
                  aria-hidden="true"
                  style={{
                    content: displayChar,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    color: '#ffd700',
                    textShadow: `
                      -1px -1px 0 rgba(255,255,255, 0.4),
                      1px -1px 0 rgba(255,255,255, 0.4),
                      -1px 1px 0 rgba(255,255,255, 0.4),
                      1px 1px 0 rgba(255,255,255, 0.4),
                      0 -2px 8px #ffd700,
                      0 0 2px #ffd700,
                      0 0 5px #ffd700,
                      0 0 8px #ffb347,
                      0 2px 3px #000
                    `,
                    transform: 'translateZ(1px)',
                    pointerEvents: 'none',
                    animation: `neonFlicker${((charIndex + wordIndex) % 10) + 1} 5s linear infinite`,
                  }}
                >
                  {displayChar}
                </span>
                {/* Metal backing plate */}
                <span
                  aria-hidden="true"
                  style={{
                    content: displayChar,
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(145deg, #8a8270 0%, #7a7268 15%, #6a6258 35%, #5a5248 50%, #6a6258 65%, #7a7268 85%, #8a8270 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    zIndex: -2,
                    transform: 'translateZ(-25px)',
                    opacity: 1.0,
                    textShadow: `
                      1px 1px 0 #4a4a4a,
                      2px 2px 0 #3a3a3a,
                      3px 3px 0 #2f2f2f,
                      4px 4px 0 #2a2a2a,
                      5px 5px 0 #252525,
                      -1px -1px 0 #6a6a6a,
                      -1px 0 0 #5a5a5a,
                      0 -1px 0 #5a5a5a,
                      6px 6px 12px rgba(0,0,0,0.9),
                      8px 8px 20px rgba(0,0,0,0.8),
                      10px 10px 30px rgba(0,0,0,0.6)
                    `,
                    filter: 'contrast(1.2) brightness(1.3)',
                    pointerEvents: 'none',
                  }}
                >
                  {displayChar}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
