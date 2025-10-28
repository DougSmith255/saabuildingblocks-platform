'use client';

import React from 'react';

export interface CyberText3DProps {
  /** Text content to display with 3D effect */
  children: React.ReactNode;
  /** Color variant - gold (#ffd700) or white (#e5e4dd) */
  variant?: 'gold' | 'white';
  /** Glow intensity level */
  glowIntensity?: 'subtle' | 'normal' | 'intense';
  /** Enable flickering animation */
  flicker?: boolean;
  /** Flickering speed when enabled */
  flickerSpeed?: 'slow' | 'normal' | 'fast';
  /** Enable 3D metal backing plate effect */
  metalPlate?: boolean;
  /** Enable 3D rotation transform */
  rotate?: boolean;
  /** Rotation angle in degrees (default: 15deg) */
  rotationAngle?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles for the wrapper element */
  style?: React.CSSProperties;
}

// Color configuration for variants
const VARIANT_COLORS = {
  gold: {
    primary: '#ffd700',
    accent: '#ffb347',
    border: 'rgba(255,255,255, 0.4)'
  },
  white: {
    primary: '#e5e4dd',
    accent: '#ffffff',
    border: 'rgba(255,215,0, 0.3)' // Subtle gold border for white text
  }
} as const;

// Glow intensity configuration
const GLOW_INTENSITIES = {
  subtle: {
    innerGlow: [2, 5],
    outerGlow: [8, 12],
    spread: 2
  },
  normal: {
    innerGlow: [2, 5],
    outerGlow: [8, 15],
    spread: 3
  },
  intense: {
    innerGlow: [3, 8],
    outerGlow: [12, 25],
    spread: 5
  }
} as const;

// Flicker animation speeds (in seconds)
const FLICKER_SPEEDS = {
  slow: 3,
  normal: 2,
  fast: 1
} as const;

/**
 * CyberText3D Component
 *
 * Displays text with a cyberpunk 3D neon glow effect and optional features.
 * Text inherits font family, size, and weight from parent styles.
 *
 * Features:
 * - Neon glow effect with configurable intensity
 * - Gold and white color variants
 * - Optional flickering animation
 * - Optional 3D metal backing plate
 * - Optional 3D rotation transform
 *
 * @example
 * ```tsx
 * // Basic gold glow
 * <CyberText3D variant="gold">3700+</CyberText3D>
 *
 * // White variant with intense glow
 * <CyberText3D variant="white" glowIntensity="intense">
 *   AGENTS
 * </CyberText3D>
 *
 * // Flickering effect
 * <CyberText3D variant="gold" flicker flickerSpeed="slow">
 *   LIVE
 * </CyberText3D>
 *
 * // Full featured with metal plate and rotation
 * <CyberText3D
 *   variant="gold"
 *   glowIntensity="intense"
 *   flicker
 *   metalPlate
 *   rotate
 *   rotationAngle={15}
 * >
 *   SMART AGENT ALLIANCE
 * </CyberText3D>
 * ```
 */
export function CyberText3D({
  children,
  variant = 'gold',
  glowIntensity = 'normal',
  flicker = false,
  flickerSpeed = 'normal',
  metalPlate = false,
  rotate = false,
  rotationAngle = 15,
  className = '',
  style = {}
}: CyberText3DProps) {
  const colors = VARIANT_COLORS[variant];
  const glow = GLOW_INTENSITIES[glowIntensity];
  const animationDuration = FLICKER_SPEEDS[flickerSpeed];

  // Build text-shadow for neon effect
  const textShadow = `
    -1px -1px 0 ${colors.border},
    1px -1px 0 ${colors.border},
    -1px 1px 0 ${colors.border},
    1px 1px 0 ${colors.border},
    0 -${glow.spread}px ${glow.outerGlow[0]}px ${colors.primary},
    0 0 ${glow.innerGlow[0]}px ${colors.primary},
    0 0 ${glow.innerGlow[1]}px ${colors.primary},
    0 0 ${glow.outerGlow[1]}px ${colors.accent},
    0 0 ${glow.spread}px ${colors.primary},
    0 ${glow.spread}px 3px #000
  `;

  // 3D transform styles
  const transform3D = rotate
    ? {
        transformStyle: 'preserve-3d' as const,
        transform: `rotateX(${rotationAngle}deg) translateZ(20px)`
      }
    : {};

  // Metal plate backing styles
  const metalPlateStyles = metalPlate
    ? {
        position: 'relative' as const,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-0.2em -0.3em',
          background: 'linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(50,50,50,0.5) 100%)',
          borderRadius: '0.1em',
          zIndex: -1,
          transform: 'translateZ(-10px)',
          border: '1px solid rgba(150,150,150,0.2)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.5)'
        }
      }
    : {};

  return (
    <>
      {flicker && (
        <style jsx>{`
          @keyframes cyberFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
              text-shadow: ${textShadow};
            }
            20%, 24%, 55% {
              opacity: 0.85;
              text-shadow: none;
            }
          }
          .cyber-flicker {
            animation: cyberFlicker ${animationDuration}s infinite;
          }
        `}</style>
      )}
      <span
        className={`${flicker ? 'cyber-flicker' : ''} ${className}`.trim()}
        style={{
          color: colors.primary,
          textShadow,
          display: 'inline-block',
          ...transform3D,
          ...metalPlateStyles,
          ...style
        }}
      >
        {children}
      </span>
    </>
  );
}
