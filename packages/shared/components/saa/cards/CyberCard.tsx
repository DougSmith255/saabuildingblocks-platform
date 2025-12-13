'use client';

import React from 'react';

export interface CyberCardProps {
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
 * CyberCard - Premium 3D metal-plate card for featured content and stats
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/cards/CyberCard
 *
 * Features:
 * - 3D perspective with rotateX tilt (matches H2 heading style)
 * - Brushed gunmetal metal plate background
 * - Beveled edges (light top/left, dark bottom/right)
 * - Glossy highlight overlay
 * - Subtle lift + glow on hover
 *
 * Use for:
 * - Important stats and metrics
 * - Featured content that needs attention
 * - Key numbers and highlights
 *
 * @example
 * ```tsx
 * <CyberCard>
 *   <div className="text-5xl font-bold text-amber-400">2,900+</div>
 *   <p className="text-[#dcdbd5]">Agents Strong</p>
 * </CyberCard>
 * ```
 */
export function CyberCard({
  children,
  className = '',
  padding = 'md',
  centered = true,
  href,
  interactive,
}: CyberCardProps) {
  // Auto-enable interactive mode when href is set
  const isInteractive = interactive ?? !!href;
  const paddingClass = paddingClasses[padding];
  const centerClass = centered ? 'text-center' : '';

  const cardContent = (
    <>
      <style jsx global>{`
        .cyber-card-3d {
          /* 3D perspective container */
          perspective: 1000px;
          display: block;
        }

        .cyber-card-plate {
          position: relative;
          /* 3D effect without angle */
          transform-style: preserve-3d;
          transform: translateZ(0);

          /* Brushed gunmetal gradient - matches H2 metal plate */
          background: linear-gradient(
            180deg,
            #3d3d3d 0%,
            #2f2f2f 40%,
            #252525 100%
          );

          /* Rounded corners */
          border-radius: 12px;

          /* Beveled edge effect - lighter top/left for raised look */
          border-top: 2px solid rgba(180,180,180,0.45);
          border-left: 1px solid rgba(130,130,130,0.35);
          border-right: 1px solid rgba(60,60,60,0.6);
          border-bottom: 2px solid rgba(0,0,0,0.7);

          /* Multi-layer shadow for depth */
          box-shadow:
            /* Inner highlight at top for glossy reflection */
            inset 0 1px 0 rgba(255,255,255,0.12),
            /* Inner shadow at bottom for depth */
            inset 0 -1px 2px rgba(0,0,0,0.25),
            /* Main drop shadow */
            0 6px 16px rgba(0,0,0,0.5),
            /* Soft ambient shadow */
            0 2px 6px rgba(0,0,0,0.3);
        }

        /* Glossy highlight overlay on metal plate */
        .cyber-card-plate::before {
          content: "";
          position: absolute;
          inset: 0;
          height: 50%;
          /* Glossy reflection gradient */
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.08) 0%,
            rgba(255,255,255,0.03) 50%,
            transparent 100%
          );
          border-radius: 12px 12px 0 0;
          z-index: 1;
          pointer-events: none;
        }

        /* Interactive hover effect - lift + bright yellow glow */
        .cyber-card-3d.cyber-card-interactive {
          cursor: pointer;
        }

        .cyber-card-3d.cyber-card-interactive .cyber-card-plate {
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }

        .cyber-card-3d.cyber-card-interactive:hover .cyber-card-plate {
          transform: translateY(-4px) scale(1.02);
          /* Lighten the card background */
          background: linear-gradient(
            180deg,
            #4a4a4a 0%,
            #3c3c3c 40%,
            #323232 100%
          );
          /* Yellow border like GenericCard */
          border-color: rgba(255,215,0,0.6);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 2px rgba(0,0,0,0.25),
            0 12px 30px rgba(0,0,0,0.5),
            0 6px 12px rgba(0,0,0,0.3),
            /* Subtle yellow shadow instead of glow */
            0 4px 16px rgba(255,215,0,0.1);
        }

        /* Content container - inherits 3D transform */
        .cyber-card-content {
          position: relative;
          z-index: 2;
          /* Ensure content tilts with the card */
          transform-style: preserve-3d;
          transform: translateZ(0);
        }

        /* Neon yellow glow for headings inside CyberCard */
        .cyber-card-content h3,
        .cyber-card-content h4,
        .cyber-card-content h5,
        .cyber-card-content h6 {
          color: #ffd700;
          text-shadow:
            0 0 5px rgba(255, 215, 0, 0.6),
            0 0 10px rgba(255, 215, 0, 0.4),
            0 0 20px rgba(255, 215, 0, 0.25),
            0 0 40px rgba(255, 215, 0, 0.1);
        }
      `}</style>

      <div className={`cyber-card-3d ${isInteractive ? 'cyber-card-interactive' : ''} ${className}`}>
        <div className="cyber-card-plate">
          <div className={`cyber-card-content ${paddingClass} ${centerClass}`}>
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

export default CyberCard;
