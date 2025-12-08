'use client';

import React, { useMemo } from 'react';

export interface ProfileCyberFrameProps {
  /** Content to wrap (profile image) */
  children: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Index for unique randomization per instance (default: 0) */
  index?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * ProfileCyberFrame - Circular futuristic holographic frame for profile images
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/ProfileCyberFrame
 *
 * Features:
 * - Circular 3D metal frame with gold accent glow
 * - Holographic glass overlay with sheen effect
 * - Hover effect: glow intensifies, sheen animates across
 * - Randomized sheen position per instance
 * - Multiple size variants
 */
export function ProfileCyberFrame({
  children,
  className = '',
  index = 0,
  size = 'md',
}: ProfileCyberFrameProps) {
  // Size configurations with explicit pixel values
  const sizeConfig = {
    sm: 96,
    md: 144,
    lg: 192,
    xl: 224,
  };

  const currentSize = sizeConfig[size];

  // Generate random values for this instance
  const randomValues = useMemo(() => ({
    sheenAngle: 25 + (index * 10),
    sheenPosition: 30 + (index * 20),
  }), [index]);

  return (
    <>
      <style jsx global>{`
        .profile-cyber-frame {
          position: relative;
          margin: 0 auto 24px auto;
        }

        /* 3D Metal Frame */
        .profile-cyber-frame-metal {
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 9999px;
          background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
          border: 1px solid rgba(150,150,150,0.4);
          box-shadow:
            0 4px 20px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 15px rgba(255,215,0,0.15);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        /* Hover - frame glows more */
        .profile-cyber-frame:hover .profile-cyber-frame-metal {
          box-shadow:
            0 4px 25px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 25px rgba(255,215,0,0.3);
          border-color: rgba(255,215,0,0.3);
        }

        /* Inner container */
        .profile-cyber-frame-inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 9999px;
          overflow: hidden;
          background-color: #0a0a0a;
        }

        /* Holographic glass overlay - glossy sheen */
        .profile-cyber-frame-inner::before {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          right: -100%;
          bottom: -100%;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 10;
          background: linear-gradient(
            var(--pcf-sheen-angle, 25deg),
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,0.08) 42%,
            rgba(255,255,255,0.15) 50%,
            rgba(255,255,255,0.08) 58%,
            transparent 65%,
            transparent 100%
          );
          transform: translateX(calc(var(--pcf-sheen-pos, 30%) - 50%));
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Hover - sheen slides across */
        .profile-cyber-frame:hover .profile-cyber-frame-inner::before {
          transform: translateX(calc(var(--pcf-sheen-pos, 30%) + 30%));
        }

        /* Gold accent glow ring */
        .profile-cyber-frame-ring {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 9999px;
          pointer-events: none;
          border: 2px solid rgba(255,215,0,0.4);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Hover - ring glows */
        .profile-cyber-frame:hover .profile-cyber-frame-ring {
          border-color: rgba(255,215,0,0.7);
          box-shadow: 0 0 12px rgba(255,215,0,0.4);
        }
      `}</style>

      <div
        className={`profile-cyber-frame ${className}`}
        style={{
          width: `${currentSize}px`,
          height: `${currentSize}px`,
          '--pcf-sheen-angle': `${randomValues.sheenAngle}deg`,
          '--pcf-sheen-pos': `${randomValues.sheenPosition}%`,
        } as React.CSSProperties}
      >
        {/* 3D Metal Frame - circular version */}
        <div className="profile-cyber-frame-metal" />

        {/* Inner container with image */}
        <div className="profile-cyber-frame-inner">
          {/* Image wrapper - needs position relative and full dimensions for Next.js Image fill */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}
          </div>
        </div>

        {/* Gold accent glow ring */}
        <div className="profile-cyber-frame-ring" />
      </div>
    </>
  );
}

export default ProfileCyberFrame;
