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

  // Brand gold colors
  const colors = {
    glow: 'rgba(255,215,0,0.15)',
    ring: 'rgba(255,215,0,0.4)',
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: `${currentSize}px`,
        height: `${currentSize}px`,
        margin: '0 auto 24px auto',
      }}
    >
      {/* 3D Metal Frame - circular version */}
      <div
        style={{
          position: 'absolute',
          top: '-6px',
          left: '-6px',
          right: '-6px',
          bottom: '-6px',
          borderRadius: '9999px',
          background: 'linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%)',
          border: '1px solid rgba(150,150,150,0.4)',
          boxShadow: `0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3), 0 0 15px ${colors.glow}`,
        }}
      />

      {/* Inner container with image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Image wrapper - needs position relative and full dimensions for Next.js Image fill */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {children}
        </div>

        {/* Holographic glass overlay - glossy sheen */}
        <div
          style={{
            position: 'absolute',
            top: '-100%',
            left: '-100%',
            right: '-100%',
            bottom: '-100%',
            borderRadius: '9999px',
            pointerEvents: 'none',
            background: `linear-gradient(${randomValues.sheenAngle}deg, transparent 0%, transparent 35%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 58%, transparent 65%, transparent 100%)`,
            transform: `translateX(${randomValues.sheenPosition - 50}%)`,
            zIndex: 10,
          }}
        />
      </div>

      {/* Gold accent glow ring */}
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '9999px',
          pointerEvents: 'none',
          border: `2px solid ${colors.ring}`,
        }}
      />
    </div>
  );
}

export default ProfileCyberFrame;
