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
 * - Thick neon gold glowing border (10px) with pulsing animation
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

          /* Thick neon gold border */
          border: 10px solid #ffd700;

          /* Rounded corners */
          border-radius: 16px;

          /* Base glow - always visible */
          box-shadow:
            0 0 4px 1px rgba(255, 215, 0, 0.5),
            0 0 8px 2px rgba(255, 215, 0, 0.35),
            0 0 16px 4px rgba(255, 215, 0, 0.2),
            0 0 24px 6px rgba(255, 215, 0, 0.1),
            0 4px 12px rgba(0,0,0,0.3);

          overflow: visible;
          /* Isolate stacking context so z-index works properly */
          isolation: isolate;
        }

        /* Glass background as separate layer - z-index 0 */
        .cyber-card-gold-glass {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 6px;
          z-index: 0;

          /* Dark frosted glass interior with texture - grainier */
          background:
            /* Noise texture overlay */
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            /* Dark gradient base */
            linear-gradient(
              180deg,
              rgba(15, 15, 20, 0.85) 0%,
              rgba(10, 10, 15, 0.92) 100%
            );
          background-blend-mode: overlay, normal;
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
        }

        /* Organic pulsing glow - matches CTA button light bars */
        @keyframes cyberCardGoldOrganicPulse {
          0% { opacity: 0.55; }
          13% { opacity: 0.95; }
          28% { opacity: 0.6; }
          41% { opacity: 0.85; }
          54% { opacity: 0.5; }
          67% { opacity: 1; }
          83% { opacity: 0.7; }
          100% { opacity: 0.55; }
        }

        /* Intensified glow layer - organic pulse via opacity (GPU-accelerated) */
        .cyber-card-gold-frame::after {
          content: "";
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          border-radius: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow:
            0 0 6px 2px rgba(255, 215, 0, 0.6),
            0 0 12px 4px rgba(255, 215, 0, 0.4),
            0 0 20px 6px rgba(255, 215, 0, 0.25),
            0 0 32px 10px rgba(255, 215, 0, 0.12),
            0 6px 16px rgba(0,0,0,0.35);
          pointer-events: none;
          z-index: -1;
          animation: cyberCardGoldOrganicPulse 2.4s linear infinite;
          will-change: opacity;
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
          z-index: 2;
        }

        /* Note: Outer white outline is now included in ::after above (with pulsing glow) */

        /* Content container - z-index 10 ensures icons appear above glass background */
        .cyber-card-gold-content {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <div className={`cyber-card-gold-3d ${className}`}>
        <div className="cyber-card-gold-frame">
          {/* Glass background layer - z-index 0 */}
          <div className="cyber-card-gold-glass" />
          {/* Content layer - z-index 10 */}
          <div className={`cyber-card-gold-content ${paddingClass} ${centerClass}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default CyberCardGold;
