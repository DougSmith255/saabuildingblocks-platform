'use client';

import React from 'react';

export interface CyberCardHolographicProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SAA Cyber Card - Holographic Glitch Version
 *
 * Features holographic effects, digital glitches, chromatic aberration,
 * and greyscale shimmer. Perfect for high-tech, futuristic UI elements.
 *
 * @example
 * ```tsx
 * <CyberCardHolographic>
 *   <h3>Your Content Here</h3>
 *   <p>Card details and information...</p>
 * </CyberCardHolographic>
 * ```
 */
export function CyberCardHolographic({
  children,
  className = ''
}: CyberCardHolographicProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`
        relative w-full min-h-fit
        [filter:contrast(1.1)_saturate(1.2)]
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ overflow: 'visible' }}
    >
      {/* Hover tracking grid - DISABLED to prevent blocking form interactions */}
      {/*
      <div className="absolute inset-0 z-[200] grid grid-cols-5 grid-rows-5 gap-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="relative z-[200] cursor-pointer bg-transparent pointer-events-auto"
          />
        ))}
      </div>
      */}

      {/* Main card */}
      <div
        className={`
          relative w-full min-h-fit z-0
          flex justify-center items-center
          rounded-[var(--radius-lg,1rem)]
          border border-white/10
        `}
        style={{
          overflow: 'visible',
          background: `
            linear-gradient(45deg, #0a0a0a, #1a1a1a),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 215, 0, 0.02) 2px,
              rgba(255, 215, 0, 0.02) 4px
            )
          `,
          boxShadow: `
            inset 0 0 20px rgba(255, 255, 255, 0.04)
          `
        }}
      >
        {/* Greyscale shimmer effect */}
        <div
          className={`
            absolute inset-0
            rounded-[var(--radius-lg,1rem)]
            transition-opacity duration-600
            mix-blend-overlay
            pointer-events-none
            ${isHovered ? 'opacity-80' : 'opacity-40'}
          `}
          style={{
            background: `linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.12) 25%,
              rgba(255, 255, 255, 0.18) 50%,
              rgba(255, 255, 255, 0.10) 75%,
              rgba(255, 255, 255, 0.04) 100%
            )`,
            backgroundSize: '400% 400%',
            animation: 'saa-cyber-holographic 6s ease-in-out infinite'
          }}
        />

        {/* Chromatic aberration effect - tightened glow */}
        <div
          className="absolute inset-[2px] rounded-[var(--radius-lg,1rem)] -z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, #0a0a0a, #1a1a1a)',
            filter: isHovered
              ? `
                drop-shadow(1px 0 0 rgba(255, 215, 0, 0.7))
                drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.08))
                drop-shadow(1px 0 3px rgba(255, 215, 0, 0.4))
                drop-shadow(-1px 0 3px rgba(255, 215, 0, 0.4))
              `
              : `
                drop-shadow(1px 0 0 rgba(255, 215, 0, 0.08))
                drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.08))
              `,
            animation: 'saa-cyber-chromatic 4s ease-in-out infinite'
          }}
        />

        {/* Content area */}
        <div className="relative w-full min-h-fit p-[var(--space-6,2rem)] box-border z-10">
          {/* Glitch overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[var(--radius-lg,1rem)]"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.03) 2px,
                rgba(255, 255, 255, 0.03) 4px
              )`,
              animation: isHovered
                ? 'saa-cyber-glitch-effect 0.5s steps(1) infinite'
                : 'saa-cyber-glitch-effect 3s steps(1) infinite'
            }}
          />

          {/* User content */}
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes saa-cyber-holographic {
          0%, 100% {
            background-position: 0% 50%;
            filter: brightness(1);
          }
          50% {
            background-position: 100% 50%;
            filter: brightness(1.8);
          }
        }

        @keyframes saa-cyber-chromatic {
          0%, 100% {
            filter:
              drop-shadow(1px 0 0 rgba(255, 215, 0, 0.08))
              drop-shadow(-1px 0 0 rgba(255, 255, 255, 0.08));
          }
          25% {
            filter:
              drop-shadow(2px 0 0 rgba(255, 215, 0, 0.15))
              drop-shadow(-2px 0 0 rgba(255, 255, 255, 0.15));
          }
          75% {
            filter:
              drop-shadow(-1px 0 0 rgba(255, 215, 0, 0.12))
              drop-shadow(1px 0 0 rgba(255, 255, 255, 0.12));
          }
        }

        @keyframes saa-cyber-glitch-effect {
          0%, 90%, 100% {
            transform: translateX(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translateX(-2px);
            filter: hue-rotate(90deg);
          }
          20% {
            transform: translateX(2px);
            filter: hue-rotate(180deg);
          }
          30% {
            transform: translateX(-1px);
            filter: hue-rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}
