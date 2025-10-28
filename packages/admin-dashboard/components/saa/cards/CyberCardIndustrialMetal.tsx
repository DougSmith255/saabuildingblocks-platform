'use client';

import React, { useRef } from 'react';

/**
 * SAA Cyber Card - Industrial Metal Version
 *
 * Features authentic metallic surface with industrial bolts and brushed steel texture.
 * Includes metallic shimmer effects and Phillips head bolt details.
 *
 * @component
 * @example
 * ```tsx
 * <CyberCardIndustrialMetal>
 *   <h3>Industrial Interface</h3>
 *   <p>Heavy-duty content</p>
 * </CyberCardIndustrialMetal>
 * ```
 */

export interface CyberCardIndustrialMetalProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Show industrial bolts (default: true) */
  showBolts?: boolean;
}

export const CyberCardIndustrialMetal: React.FC<CyberCardIndustrialMetalProps> = ({
  children,
  className = '',
  showBolts = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const boltPositions = [
    { className: 'corner-tl', style: { top: '8px', left: '8px' } },
    { className: 'corner-tr', style: { top: '8px', right: '8px' } },
    { className: 'corner-bl', style: { bottom: '8px', left: '8px' } },
    { className: 'corner-br', style: { bottom: '8px', right: '8px' } },
    { className: 'left-center', style: { top: '50%', left: '8px', transform: 'translateY(-50%)' } },
    { className: 'right-center', style: { top: '50%', right: '8px', transform: 'translateY(-50%)' } },
    { className: 'top-1', style: { top: '8px', left: '35%', transform: 'translateX(-50%)' } },
    { className: 'top-2', style: { top: '8px', left: '65%', transform: 'translateX(-50%)' } },
    { className: 'bottom-1', style: { bottom: '8px', left: '35%', transform: 'translateX(-50%)' } },
    { className: 'bottom-2', style: { bottom: '8px', left: '65%', transform: 'translateX(-50%)' } }
  ];

  return (
    <div
      ref={containerRef}
      className={`saa-industrial-metal-container ${className}`}
    >
      <div className="saa-industrial-metal-canvas">
        {/* 5x5 Hover tracking grid (25 trackers) */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="saa-industrial-metal-tracker" />
        ))}

        <div className="saa-industrial-metal-card">
          <div className="saa-industrial-metal-content">{children}</div>

          {/* Industrial Bolts */}
          {showBolts && (
            <div className="saa-metal-bolts">
              {boltPositions.map((bolt, i) => (
                <div key={i} className={`saa-bolt ${bolt.className}`} style={bolt.style} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .saa-industrial-metal-container {
          position: relative;
          width: 100%;
          height: 100%;
          transition: 200ms;
          filter: contrast(1.1) saturate(1.2);
        }

        .saa-industrial-metal-card {
          position: absolute;
          inset: 0;
          z-index: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-lg, 16px);
          transition: 700ms;
          background: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 1%,
              transparent 49%,
              rgba(0, 0, 0, 0.2) 50%,
              transparent 51%,
              transparent 99%,
              rgba(255, 255, 255, 0.1) 100%
            ),
            linear-gradient(
              90deg,
              rgba(40, 40, 40, 0.95),
              rgba(50, 50, 50, 0.6) 30%,
              rgba(45, 45, 45, 0.8) 50%,
              rgba(50, 50, 50, 0.6) 70%,
              rgba(40, 40, 40, 0.95)
            ),
            #2a2a2a;
          background-size: auto 2px, auto, auto;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), inset 2px 2px 1px rgba(255, 255, 255, 0.45),
            inset -2px -2px 1px rgba(0, 0, 0, 0.45);
          border: 2px inset #2a2a2a;
        }

        .saa-industrial-metal-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255, 255, 255, 0.15) 48%,
            rgba(255, 255, 255, 0.25) 52%,
            rgba(255, 255, 255, 0.15) 56%,
            transparent 70%
          );
          background-size: 300% 100%;
          animation: saa-metal-shimmer 6s ease-in-out infinite;
          opacity: 0.8;
          transition: opacity 0.6s ease;
          border-radius: var(--radius-lg, 16px);
          mix-blend-mode: overlay;
        }

        .saa-industrial-metal-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: var(--space-6, 24px);
          box-sizing: border-box;
          z-index: 10;
        }

        .saa-metal-bolts {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
        }

        .saa-bolt {
          position: absolute;
          width: 12px;
          height: 12px;
          background: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 1%,
              transparent 49%,
              rgba(0, 0, 0, 0.2) 50%,
              transparent 51%,
              transparent 99%,
              rgba(255, 255, 255, 0.1) 100%
            ),
            linear-gradient(
              90deg,
              rgba(40, 40, 40, 0.95),
              rgba(50, 50, 50, 0.6) 30%,
              rgba(45, 45, 45, 0.8) 50%,
              rgba(50, 50, 50, 0.6) 70%,
              rgba(40, 40, 40, 0.95)
            ),
            #2a2a2a;
          background-size: auto 1px, auto, auto;
          border-radius: 50%;
          box-shadow: inset 2px 2px 1px rgba(255, 255, 255, 0.45), inset -2px -2px 1px rgba(0, 0, 0, 0.45),
            0 1px 2px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .saa-bolt::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 7px;
          height: 1.5px;
          background: linear-gradient(90deg, #2a2a2a, #1a1a1a, #2a2a2a);
          border-radius: 1px;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
        }

        .saa-bolt::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          width: 7px;
          height: 1.5px;
          background: linear-gradient(90deg, #2a2a2a, #1a1a1a, #2a2a2a);
          border-radius: 1px;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
        }

        .saa-industrial-metal-canvas {
          perspective: 1000px;
          inset: 0;
          z-index: 200;
          position: absolute;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(5, 1fr);
          gap: 0;
          pointer-events: none;
        }

        .saa-industrial-metal-tracker {
          position: relative;
          z-index: 200;
          cursor: pointer;
          background: transparent;
          pointer-events: auto;
        }

        .saa-industrial-metal-tracker:hover ~ .saa-industrial-metal-card::before {
          opacity: 0.8;
        }

        .saa-industrial-metal-tracker:hover ~ .saa-industrial-metal-card {
          transform: scale(1.02);
          filter: brightness(1.1) contrast(1.1);
        }

        @keyframes saa-metal-shimmer {
          0%,
          100% {
            background-position: -150% 0%;
            filter: brightness(1);
          }
          50% {
            background-position: 250% 0%;
            filter: brightness(1.6);
          }
        }

        .saa-industrial-metal-card,
        .saa-industrial-metal-card::before,
        .saa-bolt {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .saa-industrial-metal-card,
          .saa-industrial-metal-card::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CyberCardIndustrialMetal;
