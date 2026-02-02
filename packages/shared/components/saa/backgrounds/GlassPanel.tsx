'use client';

import React from 'react';

/**
 * Glass panel variants with color + texture combinations
 * - champagne: Champagne (#f7e7ce) + dots texture
 * - marigoldCrosshatch: Marigold (#ffbe00) + crosshatch texture
 * - marigoldNoise: Marigold (#ffbe00) + noise texture
 * - emerald: Emerald (#10b981) + horizontal lines texture
 * - expBlue: eXp Blue (#0066aa) + horizontal lines texture
 */
export type GlassPanelVariant = 'champagne' | 'marigoldCrosshatch' | 'marigoldNoise' | 'emerald' | 'expBlue';

export interface GlassPanelProps {
  /** The glass style variant */
  variant: GlassPanelVariant;
  /** Content to render inside the glass panel */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Border radius - default is 'xl' (24px) */
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  /** Override the default opacity (0-1). Higher = less transparent */
  opacity?: number;
  /** Add a rounded cutout at the bottom (for overlapping sections) */
  bottomCutout?: {
    /** Height of the cutout area */
    height: string;
    /** Horizontal inset from edges */
    inset: string;
    /** Border radius of the cutout corners */
    radius: string;
  };
}

// Variant configurations
const VARIANTS = {
  champagne: {
    color: { r: 247, g: 231, b: 206 },
    colorOpacity: 0.05,
    borderOpacity: 0.08,
    texture: 'dots',
    textureOpacity: 0.04,
    noiseFrequency: 1.5,
  },
  marigoldCrosshatch: {
    color: { r: 255, g: 190, b: 0 },
    colorOpacity: 0.04,
    borderOpacity: 0.11,
    texture: 'crosshatch',
    textureOpacity: 0.03,
    noiseFrequency: 0.8,
  },
  marigoldNoise: {
    color: { r: 255, g: 190, b: 0 },
    colorOpacity: 0.04,
    borderOpacity: 0.11,
    texture: 'noise',
    textureOpacity: 0.06,
    noiseFrequency: 0.9,
  },
  emerald: {
    color: { r: 16, g: 185, b: 129 },
    colorOpacity: 0.12, // Increased from 0.045 for less transparency
    borderOpacity: 0.2,
    texture: 'hlines',
    textureOpacity: 0.04,
    noiseFrequency: 1.0,
    blur: 16, // Stronger blur
  },
  expBlue: {
    color: { r: 0, g: 102, b: 170 },  // #0066aa
    colorOpacity: 0.10,
    borderOpacity: 0.18,
    texture: 'hlines',
    textureOpacity: 0.035,
    noiseFrequency: 1.0,
    blur: 14,
  },
} as const;

const ROUNDED_CLASSES = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

// Texture style generators
function getTextureStyle(texture: string, opacity: number, frequency: number): React.CSSProperties {
  switch (texture) {
    case 'crosshatch':
      return {
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 6px),
          repeating-linear-gradient(-45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 6px)
        `,
        backgroundSize: '16px 16px',
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity * 2}) 1px, transparent 1px)`,
        backgroundSize: `${Math.round(12 / frequency)}px ${Math.round(12 / frequency)}px`,
      };
    case 'hlines':
      return {
        backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 3px)`,
        backgroundSize: '100% 3px',
        backgroundRepeat: 'repeat',
      };
    case 'noise':
    default:
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      };
  }
}

/**
 * GlassPanel - Tinted glass background with texture overlay
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/backgrounds/GlassPanel
 *
 * Features:
 * - 4 pre-defined color + texture variants
 * - Subtle tinted glass effect with internal texture
 * - 3D plate appearance with top highlight and bottom shadow
 * - Backdrop blur for depth
 *
 * Variants:
 * - champagne: Warm cream tint with dots texture
 * - marigoldCrosshatch: Gold tint with crosshatch texture
 * - marigoldNoise: Gold tint with noise grain texture
 * - emerald: Green tint with horizontal lines texture
 * - expBlue: Blue tint with horizontal lines texture + breathing glow
 *
 * Use for:
 * - Section backgrounds that need subtle color differentiation
 * - Content containers with premium glass appearance
 * - Breaking up grayscale sections with color variety
 *
 * @example
 * ```tsx
 * <GlassPanel variant="champagne">
 *   <div className="p-8">
 *     <h2>Section Title</h2>
 *     <p>Content goes here...</p>
 *   </div>
 * </GlassPanel>
 * ```
 */
export function GlassPanel({
  variant,
  children,
  className = '',
  rounded = '3xl',
  opacity,
  bottomCutout,
}: GlassPanelProps) {
  const config = VARIANTS[variant];
  const { r, g, b } = config.color;
  // Use custom opacity if provided, otherwise use variant default
  const effectiveOpacity = opacity !== undefined ? opacity : config.colorOpacity;
  const textureStyle = getTextureStyle(config.texture, config.textureOpacity, config.noiseFrequency);
  const roundedClass = ROUNDED_CLASSES[rounded];
  const isEmerald = variant === 'emerald';
  const isExpBlue = variant === 'expBlue';

  return (
    <div
      className={`relative overflow-hidden ${roundedClass} ${className}`}
    >
      {/* Emerald: Vignette glow animation */}
      {isEmerald && (
        <>
          <style>{`
            @keyframes emeraldVignetteGlow {
              0%, 100% {
                box-shadow: inset 0 0 40px 15px rgba(16, 185, 129, 0.25);
              }
              50% {
                box-shadow: inset 0 0 60px 25px rgba(16, 185, 129, 0.4);
              }
            }
          `}</style>
          <div
            className={`absolute inset-0 pointer-events-none z-[3] ${roundedClass}`}
            style={{
              animation: 'emeraldVignetteGlow 4s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* expBlue: Breathing glow animation */}
      {isExpBlue && (
        <>
          <style>{`
            @keyframes expBlueVignetteGlow {
              0%, 100% {
                box-shadow: inset 0 0 40px 15px rgba(0, 102, 170, 0.2);
              }
              50% {
                box-shadow: inset 0 0 60px 25px rgba(0, 102, 170, 0.35);
              }
            }
          `}</style>
          <div
            className={`absolute inset-0 pointer-events-none z-[3] ${roundedClass}`}
            style={{
              animation: 'expBlueVignetteGlow 4s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Glass plate with 3D curved edges using inset box-shadows */}
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden z-[1] ${roundedClass}`}
        style={{
          background: `linear-gradient(180deg, rgba(${r},${g},${b},${effectiveOpacity * 0.8}) 0%, rgba(${r},${g},${b},${effectiveOpacity}) 50%, rgba(${r},${g},${b},${effectiveOpacity * 0.8}) 100%)`,
          boxShadow: `
            /* External shadow for depth */
            0 8px 32px rgba(0,0,0,0.4),
            0 4px 12px rgba(0,0,0,0.25),
            /* Top highlight - curves with border-radius */
            inset 0 1px 0 0 rgba(255,255,255,0.35),
            inset 0 2px 4px 0 rgba(255,255,255,0.2),
            inset 0 8px 20px -8px rgba(${r},${g},${b},0.3),
            inset 0 20px 40px -20px rgba(255,255,255,0.15),
            /* Bottom shadow - curves with border-radius */
            inset 0 -1px 0 0 rgba(0,0,0,0.7),
            inset 0 -2px 6px 0 rgba(0,0,0,0.5),
            inset 0 -10px 25px -8px rgba(0,0,0,0.6),
            inset 0 -25px 50px -20px rgba(0,0,0,0.45)
          `,
          backdropFilter: `blur(${'blur' in config ? config.blur : 2}px)`,
        }}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0" style={textureStyle} />
      </div>

      {/* Emerald: 3D darker bottom edge gradient */}
      {isEmerald && (
        <div
          className={`absolute bottom-0 left-0 right-0 pointer-events-none z-[2] ${roundedClass}`}
          style={{
            height: '80px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, transparent 100%)',
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
          }}
        />
      )}

      {/* expBlue: 3D darker bottom edge gradient */}
      {isExpBlue && (
        <div
          className={`absolute bottom-0 left-0 right-0 pointer-events-none z-[2] ${roundedClass}`}
          style={{
            height: '80px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, transparent 100%)',
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default GlassPanel;
