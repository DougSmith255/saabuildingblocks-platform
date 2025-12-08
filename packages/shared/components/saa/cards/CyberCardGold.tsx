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
  /** Gold frame thickness: 'sm' (8px), 'md' (12px), 'lg' (16px) */
  frameSize?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const frameSizes = {
  sm: '8px',
  md: '12px',
  lg: '16px',
};

/**
 * CyberCardGold - Premium gold frame card with dark inset center
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCardGold
 *
 * Features:
 * - Gold gradient frame/border (like an engraved nameplate)
 * - Dark inset center (GenericCard-style background) for readable text
 * - 3D perspective with rotateX tilt
 * - Shimmer effect on gold frame only (not the content area)
 * - Beveled metallic edges
 *
 * Use with GoldEmbossedText for premium headings:
 * ```tsx
 * <CyberCardGold>
 *   <GoldEmbossedText className="text-3xl font-bold">Premium</GoldEmbossedText>
 *   <p className="text-[#dcdbd5]">Description in white</p>
 * </CyberCardGold>
 * ```
 *
 * @example
 * ```tsx
 * <CyberCardGold>
 *   <div className="text-3xl font-bold text-[#ffd700]">Featured</div>
 *   <p className="text-[#dcdbd5]">Premium content</p>
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

          /* Bright gold bar gradient for the frame */
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
            /* Main drop shadow */
            0 6px 16px rgba(0,0,0,0.4),
            /* Gold ambient glow */
            0 2px 12px rgba(255,215,0,0.3);

          /* Frame padding - creates the visible gold border */
          padding: var(--ccg-frame-width, 12px);

          overflow: hidden;
        }

        /* Shimmer overlay - only on the frame, not content */
        .cyber-card-gold-frame::before {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          right: -100%;
          bottom: -100%;
          z-index: 1;
          pointer-events: none;
          /* Glossy sheen gradient */
          background: linear-gradient(
            var(--ccg-sheen-angle, 25deg),
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,0.35) 42%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0.35) 58%,
            transparent 65%,
            transparent 100%
          );
          transform: translateX(calc(var(--ccg-sheen-pos, 30%) - 50%));
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 12px;
        }

        /* Glossy top highlight on frame */
        .cyber-card-gold-frame::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
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

        /* Dark inset center - where content lives */
        .cyber-card-gold-inset {
          position: relative;
          z-index: 2;

          /* GenericCard-style dark background */
          background: rgba(25, 24, 24, 0.95);

          /* Rounded corners for the inset */
          border-radius: 8px;

          /* Inset shadow to make it look recessed */
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.5),
            inset 0 1px 2px rgba(0,0,0,0.3),
            /* Subtle border glow from gold frame */
            0 0 1px rgba(255,215,0,0.3);

          /* Subtle border */
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Content container inside inset */
        .cyber-card-gold-content {
          position: relative;
          z-index: 2;
        }

        /* Interactive hover effect */
        .cyber-card-gold-3d.cyber-card-gold-interactive {
          cursor: pointer;
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive .cyber-card-gold-frame {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Hover - shimmer slides across frame */
        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-frame::before {
          transform: translateX(calc(var(--ccg-sheen-pos, 30%) + 50%));
        }

        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-frame {
          transform: rotateX(8deg) translateY(-4px) scale(1.02);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.5),
            0 12px 30px rgba(0,0,0,0.5),
            0 6px 12px rgba(0,0,0,0.3),
            /* Enhanced gold glow on hover */
            0 4px 20px rgba(255,215,0,0.5);
        }

        /* Subtle inset highlight on hover */
        .cyber-card-gold-3d.cyber-card-gold-interactive:hover .cyber-card-gold-inset {
          border-color: rgba(255,215,0,0.2);
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
