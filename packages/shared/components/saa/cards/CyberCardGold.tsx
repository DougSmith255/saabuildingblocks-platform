'use client';

import React, { useMemo } from 'react';

export interface CyberCardGoldProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Padding size: 'sm' (p-4), 'md' (p-6), 'lg' (p-8), 'xl' (p-10) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
  /** Link URL - wraps card in anchor tag and enables interactive styling */
  href?: string;
  /** Enable interactive hover effects (auto-enabled when href is set) */
  interactive?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/**
 * CyberCardGold - Premium gold bar card with shimmer hover effect
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCardGold
 *
 * Features:
 * - Bright gold bar gradient background
 * - 3D perspective with rotateX tilt
 * - Shimmer/glare animation on hover (like CyberFrame)
 * - Beveled metallic edges
 *
 * Use for:
 * - Premium/featured content
 * - Gold-tier highlights
 * - Important CTAs
 *
 * @example
 * ```tsx
 * <CyberCardGold>
 *   <div className="text-3xl font-bold text-black">Premium Feature</div>
 *   <p className="text-black/80">Exclusive content</p>
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
}: CyberCardGoldProps) {
  // Auto-enable interactive mode when href is set
  const isInteractive = interactive ?? !!href;
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

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

        .cyber-card-gold-plate {
          position: relative;
          /* 3D transform - subtle tilt */
          transform-style: preserve-3d;
          transform: rotateX(8deg);

          /* Bright gold bar gradient */
          background: linear-gradient(
            180deg,
            #ffd700 0%,
            #e6c200 25%,
            #ccaa00 50%,
            #b89700 75%,
            #a68600 100%
          );

          /* Rounded corners */
          border-radius: 12px;

          /* Beveled edge effect - gold metallic */
          border-top: 2px solid rgba(255,245,200,0.8);
          border-left: 1px solid rgba(255,235,150,0.6);
          border-right: 1px solid rgba(180,140,0,0.6);
          border-bottom: 2px solid rgba(120,90,0,0.8);

          /* Multi-layer shadow for depth */
          box-shadow:
            /* Inner highlight at top for glossy reflection */
            inset 0 1px 0 rgba(255,255,255,0.4),
            /* Inner shadow at bottom for depth */
            inset 0 -1px 2px rgba(0,0,0,0.15),
            /* Main drop shadow */
            0 6px 16px rgba(0,0,0,0.4),
            /* Gold ambient glow */
            0 2px 12px rgba(255,215,0,0.3);

          overflow: hidden;
        }

        /* Shimmer overlay - hidden by default */
        .cyber-card-gold-plate::before {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          right: -100%;
          bottom: -100%;
          z-index: 3;
          pointer-events: none;
          /* Glossy sheen gradient */
          background: linear-gradient(
            var(--ccg-sheen-angle, 25deg),
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,0.3) 42%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.3) 58%,
            transparent 65%,
            transparent 100%
          );
          transform: translateX(calc(var(--ccg-sheen-pos, 30%) - 50%));
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 12px;
        }

        /* Glossy top highlight */
        .cyber-card-gold-plate::after {
          content: "";
          position: absolute;
          inset: 0;
          height: 50%;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.25) 0%,
            rgba(255,255,255,0.1) 50%,
            transparent 100%
          );
          border-radius: 12px 12px 0 0;
          z-index: 1;
          pointer-events: none;
        }

        /* Interactive hover effect */
        .cyber-card-gold-3d.cyber-card-gold-interactive {
          cursor: pointer;
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive .cyber-card-gold-plate {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Hover - shimmer slides across */
        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-plate::before {
          transform: translateX(calc(var(--ccg-sheen-pos, 30%) + 40%));
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-plate {
          transform: rotateX(8deg) translateY(-4px) scale(1.02);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            inset 0 -1px 2px rgba(0,0,0,0.15),
            0 12px 30px rgba(0,0,0,0.5),
            0 6px 12px rgba(0,0,0,0.3),
            /* Enhanced gold glow on hover */
            0 4px 20px rgba(255,215,0,0.5);
        }

        /* Content container */
        .cyber-card-gold-content {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <div
        className={`cyber-card-gold-3d ${isInteractive ? 'cyber-card-gold-interactive' : ''} ${className}`}
        style={{
          '--ccg-sheen-angle': `${randomValues.sheenAngle}deg`,
          '--ccg-sheen-pos': `${randomValues.sheenPosition}%`,
        } as React.CSSProperties}
      >
        <div className="cyber-card-gold-plate">
          <div className={`cyber-card-gold-content ${paddingClass} ${centerClass}`}>
            {children}
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
