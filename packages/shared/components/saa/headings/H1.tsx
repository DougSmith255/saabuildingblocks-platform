'use client';

import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function H1({ children, className = '', style = {} }: HeadingProps) {
  // Convert children to string for processing
  const text = typeof children === 'string' ? children : String(children);

  // Split text into words
  const words = text.split(' ');

  return (
    <>
      <h1
        className={`text-h1 text-display ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          rowGap: 0,
          columnGap: '0.5em',
          ...style,
        }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((char, charIndex) => {
              // Alt glyphs: N = U+f015, E = U+f011, M = U+f016
              let displayChar = char;
              if (char === 'N') displayChar = '\uf015';
              if (char === 'E') displayChar = '\uf011';
              if (char === 'M') displayChar = '\uf016';

              const globalIndex = wordIndex * 10 + charIndex;

              return (
                <span
                  key={charIndex}
                  className="neon-char"
                  data-char={displayChar}
                  style={{
                    transform: 'translateZ(20px)',
                    animation: `neonFlicker${(globalIndex % 3) + 1} ${6.5 + (globalIndex * 0.1)}s linear infinite`,
                    display: 'inline-block',
                  }}
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
        /* IMPROVED Dimming effect - brightness reduces but glow persists */
        @keyframes neonFlicker1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: #ffd700;
            opacity: 0.7;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.2),
              1px -1px 0 rgba(255,255,255, 0.2),
              -1px 1px 0 rgba(255,255,255, 0.2),
              1px 1px 0 rgba(255,255,255, 0.2),
              0 -2px 4px #ffd700,
              0 0 1px #ffd700,
              0 0 2.5px #ffd700,
              0 0 7.5px #ffb347,
              0 0 1px #ffd700,
              0 2px 1.5px #000;
          }
        }

        @keyframes neonFlicker2 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: #ffd700;
            opacity: 0.7;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.2),
              1px -1px 0 rgba(255,255,255, 0.2),
              -1px 1px 0 rgba(255,255,255, 0.2),
              1px 1px 0 rgba(255,255,255, 0.2),
              0 -2px 4px #ffd700,
              0 0 1px #ffd700,
              0 0 2.5px #ffd700,
              0 0 7.5px #ffb347,
              0 0 1px #ffd700,
              0 2px 1.5px #000;
          }
        }

        @keyframes neonFlicker3 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: #ffd700;
            opacity: 0.7;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.2),
              1px -1px 0 rgba(255,255,255, 0.2),
              -1px 1px 0 rgba(255,255,255, 0.2),
              1px 1px 0 rgba(255,255,255, 0.2),
              0 -2px 4px #ffd700,
              0 0 1px #ffd700,
              0 0 2.5px #ffd700,
              0 0 7.5px #ffb347,
              0 0 1px #ffd700,
              0 2px 1.5px #000;
          }
        }

        /* 3D Neon Character Structure */
        :global(.neon-char) {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
        }

        /* Metal backing plate - SOLID 3D metal casing with chrome finish */
        :global(.neon-char::before) {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #5a5240 0%,
            #4a4238 15%,
            #3a3228 35%,
            #2a2218 50%,
            #3a3228 65%,
            #4a4238 85%,
            #5a5240 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
            1px 1px 0 #2a2a2a,
            2px 2px 0 #1a1a1a,
            3px 3px 0 #0f0f0f,
            4px 4px 0 #0a0a0a,
            5px 5px 0 #050505,
            -1px -1px 0 #4a4a4a,
            -1px 0 0 #3a3a3a,
            0 -1px 0 #3a3a3a,
            6px 6px 12px rgba(0,0,0,0.9),
            8px 8px 20px rgba(0,0,0,0.8),
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.1) brightness(1.05);
          pointer-events: none;
        }

        /* Main letter - dark gray (backlit look) */
        :global(.neon-char) {
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
}
