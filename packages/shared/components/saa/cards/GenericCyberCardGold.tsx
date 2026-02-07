'use client';

import React from 'react';

export interface GenericCyberCardGoldProps {
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
 * GenericCyberCardGold - Premium dark card with gold neon border
 *
 * Combines GenericCard's dark glass styling with CyberCardGold's gold border and glow.
 *
 * Features:
 * - GenericCard-style dark gradient background (black themed)
 * - Thick neon gold glowing border (10px) with pulsing animation
 * - White outline on outer edge
 * - GenericCard's subtle inner border styling
 *
 * @example
 * ```tsx
 * <GenericCyberCardGold>
 *   <h2 className="text-h2">Title</h2>
 *   <p className="text-body">Description</p>
 * </GenericCyberCardGold>
 * ```
 */
export function GenericCyberCardGold({
  children,
  className = '',
  padding = 'md',
  centered = true,
}: GenericCyberCardGoldProps) {
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

  return (
    <>
      <style jsx global>{`
        .generic-cyber-card-gold-3d {
          /* 3D perspective container */
          perspective: 1000px;
          display: block;
        }

        .generic-cyber-card-gold-frame {
          position: relative;
          /* 3D effect without angle */
          transform-style: preserve-3d;
          transform: translateZ(0);

          /* Thick neon gold border */
          border: 10px solid #ffd700;

          /* Rounded corners */
          border-radius: 16px;

          /* Dark gradient background with noise texture */
          background:
            /* Noise texture overlay */
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            /* Dark gradient base */
            linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%);
          background-blend-mode: overlay, normal;

          /* Base glow - always visible */
          box-shadow:
            0 0 4px 1px rgba(255, 215, 0, 0.5),
            0 0 8px 2px rgba(255, 215, 0, 0.35),
            0 0 16px 4px rgba(255, 215, 0, 0.2),
            0 0 24px 6px rgba(255, 215, 0, 0.1),
            0 4px 12px rgba(0,0,0,0.3);

          overflow: visible;
        }

        /* Organic pulsing glow - matches CTA button light bars */
        @keyframes genericCyberCardGoldOrganicPulse {
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
        .generic-cyber-card-gold-frame::after {
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
          animation: genericCyberCardGoldOrganicPulse 2.4s linear infinite;
          will-change: opacity;
        }

        /* Inner border - GenericCard style subtle white border */
        .generic-cyber-card-gold-frame::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
          pointer-events: none;
          z-index: 1;
        }

        /* Content container - z-index 10 ensures icons appear above background */
        .generic-cyber-card-gold-content {
          position: relative;
          z-index: 10;
          /* Ensure content has 3D context */
          transform-style: preserve-3d;
          transform: translateZ(0);
        }
      `}</style>

      <div className={`generic-cyber-card-gold-3d ${className}`}>
        <div className="generic-cyber-card-gold-frame">
          <div className={`generic-cyber-card-gold-content ${paddingClass} ${centerClass}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default GenericCyberCardGold;
