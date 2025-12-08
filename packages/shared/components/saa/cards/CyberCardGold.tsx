'use client';

import React, { useMemo } from 'react';

export interface CyberCardGoldProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Padding size for inner content: 'sm' (p-4), 'md' (p-6), 'lg' (p-8), 'xl' (p-10) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
  /** Link URL - wraps card in anchor tag and enables interactive styling */
  href?: string;
  /** Enable interactive hover effects (auto-enabled when href is set) */
  interactive?: boolean;
  /** Gold frame thickness: 'sm' (3px), 'md' (4px), 'lg' (5px) */
  frameSize?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const frameSizes = {
  sm: '3px',
  md: '4px',
  lg: '5px',
};

/**
 * CyberCardGold - Premium cyberpunk neon gold card
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCardGold
 *
 * Features:
 * - Neon gold glowing border (matches H1 glow style)
 * - White outline on the border (like H1 text)
 * - Semi-transparent dark inset (GenericCard-style)
 * - 3D perspective with rotateX tilt
 * - Shimmer effect on border
 *
 * Use with neon-styled headings for premium content:
 * ```tsx
 * <CyberCardGold>
 *   <h3 className="text-h3 text-[#ffd700]">Premium</h3>
 *   <p className="text-body">Description</p>
 * </CyberCardGold>
 * ```
 */
export function CyberCardGold({
  children,
  className = '',
  padding = 'md',
  centered = true,
  href,
  interactive,
  frameSize = 'md',
}: CyberCardGoldProps) {
  // Auto-enable interactive mode when href is set
  const isInteractive = interactive ?? !!href;
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';
  const frameWidth = frameSizes[frameSize];

  // Generate random sheen position for variety
  const randomValues = useMemo(() => ({
    sheenAngle: Math.floor(Math.random() * 20) + 15,
    sheenPosition: Math.floor(Math.random() * 40) + 20,
  }), []);

  const cardContent = (
    <>
      <style jsx global>{`
        .cyber-card-gold-3d {
          /* 3D perspective container */
          perspective: 1000px;
          display: block;
        }

        .cyber-card-gold-frame {
          position: relative;
          /* 3D transform - subtle tilt */
          transform-style: preserve-3d;
          transform: rotateX(8deg);

          /* Neon gold border - white outline + gold glow (like H1 text effect) */
          border: var(--ccg-frame-width, 4px) solid;
          border-color: #ffd700;

          /* Rounded corners */
          border-radius: 12px;

          /* Neon glow effect matching H1 style:
             - White outline (inner)
             - Gold glow layers (outer)
          */
          box-shadow:
            /* White outline effect - like H1 text */
            inset 0 0 0 1px rgba(255,255,255,0.5),
            /* Inner gold glow */
            inset 0 0 8px rgba(255,215,0,0.3),
            /* Outer white edge highlight */
            0 0 1px rgba(255,255,255,0.6),
            0 0 2px rgba(255,255,255,0.4),
            /* Gold neon glow layers - matching H1 */
            0 0 4px #ffd700,
            0 0 8px #ffd700,
            0 0 16px rgba(255,215,0,0.6),
            0 0 32px rgba(255,179,71,0.4),
            /* Drop shadow for depth */
            0 4px 12px rgba(0,0,0,0.4);

          overflow: hidden;
        }

        /* Shimmer overlay on the border */
        .cyber-card-gold-frame::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: 0;
          pointer-events: none;
          border-radius: 14px;
          /* Glossy sheen gradient */
          background: linear-gradient(
            var(--ccg-sheen-angle, 25deg),
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,0.2) 45%,
            rgba(255,255,255,0.4) 50%,
            rgba(255,255,255,0.2) 55%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 200%;
          background-position: calc(var(--ccg-sheen-pos, 30%) - 50%) 0;
          transition: background-position 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0.6;
        }

        /* Dark inset center - GenericCard style (no yellow tint) */
        .cyber-card-gold-inset {
          position: relative;
          z-index: 1;

          /* Semi-transparent dark background - matching GenericCard */
          background: rgba(255, 255, 255, 0.05);

          /* Rounded corners for the inset */
          border-radius: 8px;

          /* Subtle inner shadow */
          box-shadow:
            inset 0 1px 2px rgba(0,0,0,0.2);

          /* Subtle border - no yellow */
          border: 1px solid rgba(255,255,255,0.1);

          /* Inherit 3D transform so content tilts with card */
          transform-style: preserve-3d;
          transform: translateZ(0);
        }

        /* Content container inside inset */
        .cyber-card-gold-content {
          position: relative;
          z-index: 2;
          /* Ensure content tilts with the card */
          transform-style: preserve-3d;
          transform: translateZ(0);
        }

        /* Interactive hover effect */
        .cyber-card-gold-3d.cyber-card-gold-interactive {
          cursor: pointer;
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive .cyber-card-gold-frame {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        /* Hover - shimmer slides across, glow intensifies */
        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-frame::before {
          background-position: calc(var(--ccg-sheen-pos, 30%) + 60%) 0;
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-frame {
          transform: rotateX(8deg) translateY(-4px) scale(1.02);
          border-color: #ffe44d;
          box-shadow:
            /* Enhanced white outline */
            inset 0 0 0 1px rgba(255,255,255,0.7),
            inset 0 0 12px rgba(255,215,0,0.4),
            /* Brighter outer white edge */
            0 0 2px rgba(255,255,255,0.8),
            0 0 4px rgba(255,255,255,0.5),
            /* Intensified gold neon glow */
            0 0 8px #ffd700,
            0 0 16px #ffd700,
            0 0 32px rgba(255,215,0,0.8),
            0 0 48px rgba(255,179,71,0.5),
            /* Enhanced drop shadow */
            0 8px 24px rgba(0,0,0,0.5);
        }

        /* Subtle inset highlight on hover */
        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-inset {
          border-color: rgba(255,215,0,0.15);
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>

      <div
        className={`cyber-card-gold-3d ${isInteractive ? 'cyber-card-gold-interactive' : ''} ${className}`}
        style={{
          '--ccg-sheen-angle': `${randomValues.sheenAngle}deg`,
          '--ccg-sheen-pos': `${randomValues.sheenPosition}%`,
          '--ccg-frame-width': frameWidth,
        } as React.CSSProperties}
      >
        <div className="cyber-card-gold-frame">
          <div className="cyber-card-gold-inset">
            <div className={`cyber-card-gold-content ${paddingClass} ${centerClass}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Wrap in link if href is provided
  if (href) {
    return (
      <a href={href} className="block no-underline">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default CyberCardGold;
