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
 * - White outline on the border (like H1 text)
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

          /* Neon glow effect matching H1 style */
          box-shadow:
            /* White outline effect - like H1 text */
            inset 0 0 0 2px rgba(255,255,255,0.4),
            /* Outer white edge highlight */
            0 0 2px rgba(255,255,255,0.6),
            0 0 4px rgba(255,255,255,0.4),
            /* Gold neon glow layers - matching H1 */
            0 0 8px #ffd700,
            0 0 16px #ffd700,
            0 0 32px rgba(255,215,0,0.6),
            0 0 48px rgba(255,179,71,0.4),
            /* Drop shadow for depth */
            0 6px 16px rgba(0,0,0,0.4);

          overflow: hidden;
        }

        /* Content container */
        .cyber-card-gold-content {
          position: relative;
          z-index: 1;
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
