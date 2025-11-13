import React from 'react';
import { extractPlainText } from '../../../utils/extractPlainText';

export interface LightningTextProps {
  text: string;
  className?: string;
  glassStyle?: 'frosted' | 'clear' | 'tinted';
  lightningIntensity?: 'low' | 'medium' | 'high';
}

/**
 * LightningText - Animated yellow lightning bolts inside glass letters
 *
 * Features:
 * - 4 distinct lightning bolt SVG patterns
 * - Randomized strike timing per character
 * - Multi-layer glow effects (white core + yellow outer)
 * - Clip-path constrains bolts to letter shapes
 * - Occasional double-strike patterns
 *
 * @example
 * <LightningText text="POWER" lightningIntensity="high" />
 */
export const LightningText: React.FC<LightningTextProps> = ({
  text,
  className = '',
  glassStyle = 'frosted',
  lightningIntensity = 'medium'
}) => {
  // Extract plain text for SEO/accessibility
  const plainText = extractPlainText(text);
  const letters = text.split('');

  // Lightning intensity settings
  const intensityConfig = {
    low: { frequency: 0.3, doubleStrike: 0.1 },
    medium: { frequency: 0.5, doubleStrike: 0.2 },
    high: { frequency: 0.7, doubleStrike: 0.35 }
  };

  const config = intensityConfig[lightningIntensity];

  return (
    <div className={`lightning-text ${className}`}>
      {/* SEO-friendly hidden text for search engines and screen readers */}
      <span className="sr-only">{plainText}</span>

      <style jsx>{`
        .lightning-text {
          display: inline-flex;
          gap: 0.2em;
          font-size: 4rem;
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.05em;
        }

        .lightning-letter {
          position: relative;
          display: inline-block;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          text-stroke: 2px rgba(255, 255, 255, 0.3);
        }

        /* Glass effect variants */
        .glass-frosted {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .glass-clear {
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.15),
            rgba(255, 255, 255, 0.05)
          );
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-tinted {
          background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.2),
            rgba(139, 92, 246, 0.1)
          );
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .lightning-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          clip-path: text;
          -webkit-clip-path: text;
          pointer-events: none;
        }

        .lightning-bolt {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        .bolt-path {
          fill: none;
          stroke: #ffed4e;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter:
            drop-shadow(0 0 2px #fff)
            drop-shadow(0 0 4px #fff)
            drop-shadow(0 0 6px #ffed4e)
            drop-shadow(0 0 10px #ffed4e)
            drop-shadow(0 0 15px #ffd700);
        }

        /* Lightning Strike Animations */
        @keyframes lightningStrike1 {
          0%, 88% { opacity: 0; }
          89% { opacity: 0; }
          90% { opacity: 1; filter: brightness(2.5); }
          91% { opacity: 0.7; }
          92%, 100% { opacity: 0; }
        }

        @keyframes lightningStrike2 {
          0%, 92% { opacity: 0; }
          93% { opacity: 1; filter: brightness(2.2); }
          94% { opacity: 0.5; }
          95%, 100% { opacity: 0; }
        }

        @keyframes lightningStrike3 {
          0%, 85% { opacity: 0; }
          86% { opacity: 1; filter: brightness(2.8); }
          87% { opacity: 0.6; }
          88%, 100% { opacity: 0; }
        }

        @keyframes lightningStrike4 {
          0%, 90% { opacity: 0; }
          91% { opacity: 1; filter: brightness(2.4); }
          92% { opacity: 0.8; }
          93%, 100% { opacity: 0; }
        }

        @keyframes doubleStrike {
          0%, 87% { opacity: 0; }
          88% { opacity: 1; filter: brightness(3); }
          89% { opacity: 0; }
          90% { opacity: 1; filter: brightness(2.5); }
          91% { opacity: 0; }
          92%, 100% { opacity: 0; }
        }

        /* Animation classes with random timing */
        .strike-1 { animation: lightningStrike1 3s infinite; }
        .strike-2 { animation: lightningStrike2 3.5s infinite; }
        .strike-3 { animation: lightningStrike3 4s infinite; }
        .strike-4 { animation: lightningStrike4 4.5s infinite; }
        .strike-double { animation: doubleStrike 5s infinite; }

        /* Delay variations */
        .delay-1 { animation-delay: 0.5s; }
        .delay-2 { animation-delay: 1s; }
        .delay-3 { animation-delay: 1.5s; }
        .delay-4 { animation-delay: 2s; }
        .delay-5 { animation-delay: 2.5s; }
      `}</style>

      {letters.map((letter, index) => {
        // Random animation selection
        const shouldStrike = Math.random() < config.frequency;
        const isDoubleStrike = Math.random() < config.doubleStrike;
        const strikeType = Math.floor(Math.random() * 4) + 1;
        const delayType = Math.floor(Math.random() * 5) + 1;
        const boltPattern = Math.floor(Math.random() * 4) + 1;

        return (
          <span
            key={index}
            className={`lightning-letter glass-${glassStyle}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
            {shouldStrike && (
              <div className="lightning-container">
                <svg
                  className={`lightning-bolt strike-${isDoubleStrike ? 'double' : strikeType} delay-${delayType}`}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {boltPattern === 1 && (
                    // Vertical zigzag (primary)
                    <path
                      className="bolt-path"
                      d="M 50 10 L 45 30 L 55 35 L 48 55 L 58 60 L 50 90"
                    />
                  )}
                  {boltPattern === 2 && (
                    // Diagonal arc (secondary)
                    <path
                      className="bolt-path"
                      d="M 30 15 L 40 35 L 35 40 L 50 60 L 45 65 L 70 85"
                    />
                  )}
                  {boltPattern === 3 && (
                    // Branching fork (tertiary)
                    <>
                      <path
                        className="bolt-path"
                        d="M 50 10 L 48 40 L 52 45 L 50 70"
                      />
                      <path
                        className="bolt-path"
                        d="M 48 40 L 35 55 L 30 75"
                      />
                      <path
                        className="bolt-path"
                        d="M 52 45 L 65 60 L 70 80"
                      />
                    </>
                  )}
                  {boltPattern === 4 && (
                    // Curved strike
                    <path
                      className="bolt-path"
                      d="M 40 10 Q 30 40 50 50 T 60 90"
                    />
                  )}
                </svg>
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default LightningText;
