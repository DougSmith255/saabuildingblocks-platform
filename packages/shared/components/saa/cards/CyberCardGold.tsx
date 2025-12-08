'use client';

import React from 'react';

export interface CyberCardGoldProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Padding size for inner content: 'sm' (p-4), 'md' (p-6), 'lg' (p-8), 'xl' (p-10) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/**
 * CyberCardGold - Premium cyberpunk neon gold card
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCardGold
 *
 * Features:
 * - Thick neon gold glowing border (10px)
 * - White outline lines on inner AND outer edges (like H1 text)
 * - GenericCard-style semi-transparent interior
 * - 3D depth effect (no angle)
 *
 * Use with NeonGoldText for premium headings:
 * ```tsx
 * <CyberCardGold>
 *   <NeonGoldText as="h2" className="text-h2">Premium Title</NeonGoldText>
 *   <p className="text-body">Description</p>
 * </CyberCardGold>
 * ```
 */
export function CyberCardGold({
  children,
  className = '',
  padding = 'md',
  centered = true,
}: CyberCardGoldProps) {
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

  return (
    <>
      <style jsx global>{`
        .cyber-card-gold-3d {
          /* 3D perspective container */
          perspective: 1000px;
          display: block;
        }

        .cyber-card-gold-frame {
          position: relative;
          /* 3D effect without angle */
          transform-style: preserve-3d;
          transform: translateZ(0);

          /* Thick neon gold border */
          border: 10px solid #ffd700;

          /* Rounded corners */
          border-radius: 16px;

          /* GenericCard-style interior */
          background: rgba(255, 255, 255, 0.05);

          /* Neon glow effect - gold glow layers */
          box-shadow:
            /* Gold neon glow layers */
            0 0 8px #ffd700,
            0 0 16px #ffd700,
            0 0 32px rgba(255,215,0,0.6),
            0 0 48px rgba(255,179,71,0.4),
            /* Drop shadow for depth */
            0 6px 16px rgba(0,0,0,0.4);

          overflow: visible;
        }

        /* Inner white outline - inside the gold border */
        .cyber-card-gold-frame::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 6px;
          border: 2px solid rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 1;
        }

        /* Outer white outline - outside the gold border */
        .cyber-card-gold-frame::after {
          content: "";
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          border-radius: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          pointer-events: none;
          z-index: -1;
        }

        /* Content container */
        .cyber-card-gold-content {
          position: relative;
          z-index: 2;
          /* Ensure content has 3D context */
          transform-style: preserve-3d;
          transform: translateZ(0);
        }
      `}</style>

      <div className={`cyber-card-gold-3d ${className}`}>
        <div className="cyber-card-gold-frame">
          <div className={`cyber-card-gold-content ${paddingClass} ${centerClass}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default CyberCardGold;
