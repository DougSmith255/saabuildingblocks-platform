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
 * - Randomized sheen position per instance
 * - Hover effects (sheen slides, glow intensifies)
 * - Multiple size variants
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ProfileCyberFrame>
 *   <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
 * </ProfileCyberFrame>
 *
 * // With size and index for unique effects
 * <ProfileCyberFrame size="lg" index={1}>
 *   <Image src="/profile.jpg" alt="Profile" fill className="object-cover" />
 * </ProfileCyberFrame>
 * ```
 */
export function ProfileCyberFrame({
  children,
  className = '',
  index = 0,
  size = 'md',
}: ProfileCyberFrameProps) {
  // Generate random values for this instance (consistent per mount)
  // Use index as seed for consistent but different values per profile
  const randomValues = useMemo(() => ({
    sheenAngle: 25 + (index * 10),
    sheenPosition: 30 + (index * 20),
    hueRotate: index * 120,
    holoOpacity: 0.03,
  }), [index]);

  // Size classes
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36 md:w-44 md:h-44',
    lg: 'w-48 h-48 md:w-56 md:h-56',
    xl: 'w-56 h-56 md:w-64 md:h-64',
  };

  // Brand yellow colors (matching CyberFrame gold variant)
  const colors = {
    glow: 'rgba(255,215,0,0.1)',
    glowHover: 'rgba(255,215,0,0.2)',
    ring: 'rgba(255,215,0,0.3)',
    ringHover: 'rgba(255,215,0,0.6)',
    ringGlow: 'rgba(255,215,0,0.4)',
  };

  return (
    <>
      <style jsx global>{`
        .profile-cyber-frame:hover > .profile-metal-frame {
          box-shadow:
            0 4px 25px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 0 25px ${colors.glowHover} !important;
          border-color: ${colors.ring} !important;
        }

        .profile-cyber-frame:hover .profile-sheen {
          transform: translateX(calc(var(--sheen-pos, 40%) + 30%)) !important;
        }

        .profile-cyber-frame:hover .profile-holo {
          filter: hue-rotate(calc(var(--hue-rotate, 0deg) + 30deg)) !important;
          opacity: 1 !important;
        }

        .profile-cyber-frame:hover .profile-glow-ring {
          border-color: ${colors.ringHover} !important;
          box-shadow: 0 0 12px ${colors.ringGlow} !important;
        }
      `}</style>

      <div
        className={`profile-cyber-frame relative ${sizeClasses[size]} mx-auto mb-6 ${className}`}
        style={{
          '--sheen-angle': `${randomValues.sheenAngle}deg`,
          '--sheen-pos': `${randomValues.sheenPosition}%`,
          '--hue-rotate': `${randomValues.hueRotate}deg`,
          '--holo-opacity': randomValues.holoOpacity,
        } as React.CSSProperties}
      >
        {/* 3D Metal Frame - circular version */}
        <div
          className="profile-metal-frame absolute inset-[-6px] rounded-full"
          style={{
            background: 'linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%)',
            border: '1px solid rgba(150,150,150,0.4)',
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.15),
              inset 0 -1px 0 rgba(0,0,0,0.3),
              0 0 15px ${colors.glow}
            `,
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        />

        {/* Inner container with holographic effects */}
        <div
          className="profile-cyber-inner absolute inset-0 rounded-full overflow-hidden bg-[#0a0a0a]"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Image wrapper - needs position relative and full dimensions for Next.js Image fill */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {children}
          </div>

          {/* Holographic glass overlay - glossy sheen */}
          <div
            className="profile-sheen absolute inset-[-100%] rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(
                var(--sheen-angle, 25deg),
                transparent 0%,
                transparent 35%,
                rgba(255,255,255,0.08) 42%,
                rgba(255,255,255,0.15) 50%,
                rgba(255,255,255,0.08) 58%,
                transparent 65%,
                transparent 100%
              )`,
              transform: 'translateX(calc(var(--sheen-pos, 40%) - 50%))',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 10,
            }}
          />

          {/* Holographic iridescent overlay */}
          <div
            className="profile-holo absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(
                calc(var(--sheen-angle, 25deg) + 90deg),
                rgba(255, 0, 128, 0.03) 0%,
                rgba(128, 0, 255, 0.03) 20%,
                rgba(0, 128, 255, 0.03) 40%,
                rgba(0, 255, 128, 0.03) 60%,
                rgba(255, 255, 0, 0.03) 80%,
                rgba(255, 128, 0, 0.03) 100%
              )`,
              mixBlendMode: 'overlay',
              filter: 'hue-rotate(var(--hue-rotate, 0deg))',
              opacity: 'var(--holo-opacity, 0.8)',
              transition: 'filter 0.6s ease, opacity 0.4s ease',
              zIndex: 11,
            }}
          />
        </div>

        {/* Gold accent glow ring */}
        <div
          className="profile-glow-ring absolute inset-[-2px] rounded-full pointer-events-none"
          style={{
            border: `2px solid ${colors.ring}`,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </div>
    </>
  );
}

export default ProfileCyberFrame;
