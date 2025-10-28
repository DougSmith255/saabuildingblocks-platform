'use client';

import React, { useRef, useEffect } from 'react';

/**
 * SAA Cyber Card - Prismatic Glass Version
 *
 * Advanced glass morphism card with iridescent prismatic effects.
 * Features hover-reactive grid tracking and animated scanning lines.
 * Container-responsive: fills parent width and height.
 *
 * @component
 * @example
 * ```tsx
 * <CyberCardPrismaticGlass className="my-card">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </CyberCardPrismaticGlass>
 * ```
 */

export interface CyberCardPrismaticGlassProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

export const CyberCardPrismaticGlass: React.FC<CyberCardPrismaticGlassProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add any additional interactive effects here if needed
  }, []);

  return (
    <div
      ref={containerRef}
      className={`saa-cyber-prismatic-container ${className}`}
    >
      <div className="saa-cyber-prismatic-canvas">
        {/* 5x5 Hover tracking grid (25 trackers) */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="saa-cyber-prismatic-tracker" />
        ))}

        <div className="saa-cyber-prismatic-card">
          <div className="saa-cyber-prismatic-content">
            {/* Corner brackets */}
            <div className="saa-cyber-prismatic-corners">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Content */}
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        .saa-cyber-prismatic-container {
          position: relative;
          width: 100%;
          height: 100%;
          transition: 200ms;
        }

        .saa-cyber-prismatic-card {
          position: absolute;
          inset: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--radius-lg, 16px);
          transition: 700ms;
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(26, 26, 26, 0.9)),
            radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.03) 1px, transparent 1px);
          background-size: auto, 25px 25px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .saa-cyber-prismatic-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.14) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.08) 75%,
            rgba(255, 255, 255, 0.12) 100%
          );
          background-size: 400% 400%;
          animation: saa-prismatic-shift 8s ease-in-out infinite;
          border-radius: var(--radius-lg, 16px);
          mix-blend-mode: overlay;
          opacity: 0.3;
          transition: opacity 0.6s ease;
        }

        .saa-cyber-prismatic-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 200% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 100% 200% at 0% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
          filter: blur(0.5px);
          border-radius: var(--radius-lg, 16px);
          animation: saa-glass-distortion 12s ease-in-out infinite;
          mix-blend-mode: soft-light;
        }

        .saa-cyber-prismatic-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: var(--space-6, 24px);
          box-sizing: border-box;
          z-index: 10;
        }

        .saa-cyber-prismatic-corners {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .saa-cyber-prismatic-corners span {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 215, 0, 0.4);
          transition: all 0.4s ease;
          backdrop-filter: blur(5px);
        }

        .saa-cyber-prismatic-corners span:nth-child(1) {
          top: 12px;
          left: 12px;
          border-right: 0;
          border-bottom: 0;
          border-radius: var(--radius-lg, 16px) 0 0 0;
        }

        .saa-cyber-prismatic-corners span:nth-child(2) {
          top: 12px;
          right: 12px;
          border-left: 0;
          border-bottom: 0;
          border-radius: 0 var(--radius-lg, 16px) 0 0;
        }

        .saa-cyber-prismatic-corners span:nth-child(3) {
          bottom: 12px;
          left: 12px;
          border-right: 0;
          border-top: 0;
          border-radius: 0 0 0 var(--radius-lg, 16px);
        }

        .saa-cyber-prismatic-corners span:nth-child(4) {
          bottom: 12px;
          right: 12px;
          border-left: 0;
          border-top: 0;
          border-radius: 0 0 var(--radius-lg, 16px) 0;
        }

        .saa-cyber-prismatic-canvas {
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

        .saa-cyber-prismatic-tracker {
          position: relative;
          z-index: 200;
          cursor: pointer;
          background: transparent;
          pointer-events: auto;
        }

        .saa-cyber-prismatic-tracker:hover ~ .saa-cyber-prismatic-card {
          transform: scale(1.02);
          filter: brightness(1.1) contrast(1.1);
        }

        .saa-cyber-prismatic-tracker:hover ~ .saa-cyber-prismatic-card::before {
          opacity: 0.8;
        }

        .saa-cyber-prismatic-tracker:hover ~ .saa-cyber-prismatic-card .saa-cyber-prismatic-corners span {
          border-color: rgba(255, 215, 0, 0.9);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.2);
        }

        @keyframes saa-prismatic-shift {
          0%,
          100% {
            background-position: 0% 50%;
            filter: brightness(1);
          }
          25% {
            background-position: 100% 0%;
            filter: brightness(1.6);
          }
          50% {
            background-position: 100% 100%;
            filter: brightness(1.3);
          }
          75% {
            background-position: 0% 100%;
            filter: brightness(1.8);
          }
        }

        @keyframes saa-glass-distortion {
          0%,
          100% {
            background-position: 0% 0%, 100% 100%;
            transform: scale(1);
          }
          33% {
            background-position: 50% 100%, 0% 50%;
            transform: scale(1.02);
          }
          66% {
            background-position: 100% 50%, 50% 0%;
            transform: scale(0.98);
          }
        }

        .saa-cyber-prismatic-card,
        .saa-cyber-prismatic-card::before,
        .saa-cyber-prismatic-card::after,
        .saa-cyber-prismatic-corners span {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default CyberCardPrismaticGlass;
