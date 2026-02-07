'use client';

import React from 'react';

export interface IconCyberCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Icon component to display at the top */
  icon?: React.ReactNode;
  /** Theme color: 'yellow' (default), 'blue', 'green', 'purple' */
  theme?: 'yellow' | 'blue' | 'green' | 'purple';
  /** Optional className for the container */
  className?: string;
  /** Enable hover glow effect */
  hover?: boolean;
  /** Center the content */
  centered?: boolean;
}

// Theme color definitions
const THEME_COLORS = {
  yellow: {
    primary: '#ffd700',
    primaryRgb: '255, 215, 0',
    border: 'rgba(255, 215, 0, 0.15)',
    hoverGlow: 'rgba(255, 215, 0, 0.12)',
    iconBg: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(200,160,0,0.1))',
    iconBorder: 'rgba(255,215,0,0.3)',
    iconGlow: 'rgba(255,215,0,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(15,15,10,0.95), rgba(10,10,5,0.98))',
    iconColor: '#ffd700',
    iconDropShadow: 'rgba(255,215,0,0.5)',
  },
  blue: {
    primary: '#00bfff',
    primaryRgb: '0, 191, 255',
    border: 'rgba(0, 191, 255, 0.15)',
    hoverGlow: 'rgba(0, 191, 255, 0.12)',
    iconBg: 'linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,120,200,0.1))',
    iconBorder: 'rgba(0,191,255,0.3)',
    iconGlow: 'rgba(0,191,255,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(15,20,30,0.95), rgba(5,10,20,0.98))',
    iconColor: '#00bfff',
    iconDropShadow: 'rgba(0,191,255,0.5)',
  },
  green: {
    primary: '#00cc66',
    primaryRgb: '0, 204, 102',
    border: 'rgba(0, 204, 102, 0.15)',
    hoverGlow: 'rgba(0, 204, 102, 0.12)',
    iconBg: 'linear-gradient(135deg, rgba(0,204,102,0.2), rgba(0,150,75,0.1))',
    iconBorder: 'rgba(0,204,102,0.3)',
    iconGlow: 'rgba(0,204,102,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(10,20,15,0.95), rgba(5,15,10,0.98))',
    iconColor: '#00cc66',
    iconDropShadow: 'rgba(0,204,102,0.5)',
  },
  purple: {
    primary: '#a050ff',
    primaryRgb: '160, 80, 255',
    border: 'rgba(160, 80, 255, 0.15)',
    hoverGlow: 'rgba(160, 80, 255, 0.12)',
    iconBg: 'linear-gradient(135deg, rgba(160,80,255,0.2), rgba(120,60,200,0.1))',
    iconBorder: 'rgba(160,80,255,0.3)',
    iconGlow: 'rgba(160,80,255,0.2)',
    iconInnerBg: 'linear-gradient(180deg, rgba(20,15,30,0.95), rgba(10,5,20,0.98))',
    iconColor: '#a050ff',
    iconDropShadow: 'rgba(160,80,255,0.5)',
  },
};

/**
 * IconCyberCard - Cyberpunk card with animated icon ring
 *
 * Based on the "Four Priorities" card design. Features:
 * - Dark gradient background with themed border
 * - Animated icon ring with pulsing glow
 * - Hover glow effect
 * - Multiple theme colors (default: yellow)
 *
 * @example
 * ```tsx
 * <IconCyberCard icon={<Users className="w-6 h-6" />} theme="yellow">
 *   <p>Card content goes here</p>
 * </IconCyberCard>
 * ```
 */
export function IconCyberCard({
  children,
  icon,
  theme = 'yellow',
  className = '',
  hover = true,
  centered = true,
}: IconCyberCardProps) {
  const colors = THEME_COLORS[theme];
  const centerClass = centered ? 'text-center' : '';
  const hoverClass = hover ? 'group' : '';

  // Unique animation name based on theme
  const pulseKeyframes = `iconCyberCardPulse-${theme}`;

  return (
    <>
      <style jsx global>{`
        @keyframes ${pulseKeyframes} {
          0%, 100% {
            box-shadow: 0 0 30px rgba(${colors.primaryRgb}, 0.2), inset 0 0 20px rgba(${colors.primaryRgb}, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(${colors.primaryRgb}, 0.35), inset 0 0 25px rgba(${colors.primaryRgb}, 0.15);
          }
        }
      `}</style>

      <div
        className={`${hoverClass} relative rounded-2xl p-6 md:p-8 ${centerClass} overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Hover glow */}
        {hover && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${colors.hoverGlow} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Icon container with animated glow ring */}
        {icon && (
          <div className="relative mx-auto mb-5 w-16 h-16 md:w-20 md:h-20">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: colors.iconBg,
                boxShadow: `0 0 30px ${colors.iconGlow}, inset 0 0 20px rgba(${colors.primaryRgb}, 0.1)`,
                animation: `${pulseKeyframes} 3s ease-in-out infinite`,
              }}
            />
            {/* Inner icon circle */}
            <div
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{
                background: colors.iconInnerBg,
                border: `1px solid ${colors.iconBorder}`,
              }}
            >
              <div
                style={{
                  color: colors.iconColor,
                  filter: `drop-shadow(0 0 8px ${colors.iconDropShadow})`,
                }}
              >
                {icon}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}

export default IconCyberCard;
