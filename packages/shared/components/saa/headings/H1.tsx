'use client';

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

export default function H1({ children, className = '', style = {}, id, heroAnimate = true, animationDelay = '0.3s' }: HeadingProps) {
  // Always use desktop animation on all screen sizes
  const shouldUseDesktopAnimation = true;

  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(children);

  // Convert children to string for processing
  const text = typeof children === 'string' ? children : String(children);

  // Split text into words
  const words = text.split(' ');

  return (
    <>
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
            opacity: 0.1,
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

              const globalIndex = wordIndex * 10 + charIndex;

              return (
                <span
                  key={charIndex}
                  className="neon-char"
                  data-char={displayChar}
                  data-flicker-animation={shouldUseDesktopAnimation ? `neonFlicker${(globalIndex % 3) + 1}` : 'none'}
                  style={{
                    transform: 'translateZ(20px)',
                    display: 'inline-block',
                    '--flicker-duration': `${6.5 + (globalIndex * 0.1)}s`,
                    '--flicker-delay': animationDelay,
                  } as React.CSSProperties}
                >
                  {displayChar}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      {/* CSS Animations - 3D Neon Sign Effect with Dimming (not harsh flicker) */}
      <style jsx>{`
        /* 2025 Hero Entrance Animation - starts at 0.1 for LCP detection */
        @keyframes fadeInUp2025 {
          from {
            opacity: 0.1;
            transform: translate3d(0, 30px, 0) rotateX(15deg);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotateX(15deg);
          }
        }


        /* 2025 GPU-Composited Neon Flicker - Opacity Only (text-shadow applied via class) */
        @keyframes neonFlicker1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            opacity: 0.99;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            opacity: 0.4;
          }
        }

        @keyframes neonFlicker2 {
          0%, 18%, 21%, 60%, 63%, 66%, 72%, 100% {
            opacity: 0.99;
          }
          19%, 20%, 61%, 62%, 64%, 65%, 71% {
            opacity: 0.4;
          }
        }

        @keyframes neonFlicker3 {
          0%, 21%, 23%, 64%, 66%, 68%, 74%, 100% {
            opacity: 0.99;
          }
          22%, 22.5%, 65%, 65.5%, 67%, 67.5%, 73% {
            opacity: 0.4;
          }
        }

        /* 3D Neon Character Structure - Dark base (backlit look) */
        :global(.neon-char) {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
          /* Dark letter body - always visible */
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }

        /* TOP LAYER: Bright yellow neon glow - THIS is what flickers (opacity-animated) */
        :global(.neon-char::after) {
          content: attr(data-char);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* Bright brand yellow neon glow */
          color: #ffd700;
          text-shadow:
            -1px -1px 0 rgba(255,255,255, 0.4),
            1px -1px 0 rgba(255,255,255, 0.4),
            -1px 1px 0 rgba(255,255,255, 0.4),
            1px 1px 0 rgba(255,255,255, 0.4),
            0 -2px 8px #ffd700,
            0 0 2px #ffd700,
            0 0 5px #ffd700,
            0 0 8px #ffb347,
            0 2px 3px #000;
          transform: translateZ(1px);
          pointer-events: none;
          will-change: opacity;
        }

        /* Apply animation ONLY to ::after (not parent) using data attributes */
        :global(.neon-char[data-flicker-animation="neonFlicker1"]::after) {
          animation: neonFlicker1 var(--flicker-duration, 6.5s) linear var(--flicker-delay, 0.5s) infinite;
        }
        :global(.neon-char[data-flicker-animation="neonFlicker2"]::after) {
          animation: neonFlicker2 var(--flicker-duration, 6.5s) linear var(--flicker-delay, 0.5s) infinite;
        }
        :global(.neon-char[data-flicker-animation="neonFlicker3"]::after) {
          animation: neonFlicker3 var(--flicker-duration, 6.5s) linear var(--flicker-delay, 0.5s) infinite;
        }

        /* Metal backing plate - BRIGHTER 3D metal casing with chrome finish */
        :global(.neon-char::before) {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #8a8270 0%,
            #7a7268 15%,
            #6a6258 35%,
            #5a5248 50%,
            #6a6258 65%,
            #7a7268 85%,
            #8a8270 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
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
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.2) brightness(1.3);
          pointer-events: none;
        }

      `}</style>
    </>
  );
}
