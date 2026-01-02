import React from 'react';

export interface Icon3DProps {
  /** The icon component or element to render with 3D effect */
  children: React.ReactNode;
  /** Icon color - defaults to gold (#ffd700) */
  color?: string;
  /** Size of the icon in pixels - controls the wrapper dimensions */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Icon3D - Dual Tone Neon Glow Effect (Option 6)
 *
 * OPTIMIZED: Single DOM node using CSS filter: drop-shadow()
 * - White-hot inner core glow
 * - Warm gold outer glow
 * - No extra DOM elements for backing plate
 *
 * @example
 * ```tsx
 * import { Clock, Calendar, User } from 'lucide-react';
 * import { Icon3D } from '@saa/shared/components/saa';
 *
 * // Basic usage
 * <Icon3D><Clock className="w-4 h-4" /></Icon3D>
 *
 * // Custom color
 * <Icon3D color="#00ff88"><User className="w-5 h-5" /></Icon3D>
 *
 * // Custom size
 * <Icon3D size={24}><Calendar className="w-6 h-6" /></Icon3D>
 * ```
 */
// Helper to generate lighter/darker shades from a hex color
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.round(((num >> 8) & 0x00FF) * (1 - percent)));
  const b = Math.max(0, Math.round((num & 0x0000FF) * (1 - percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function Icon3D({
  children,
  color = '#c4a94d',
  size,
  className = '',
  style = {},
}: Icon3DProps) {
  // Generate highlight and shadow colors based on the input color
  const highlight = adjustColor(color, 0.3); // Lighter version for top-left highlight
  const midShadow = darkenColor(color, 0.4); // Darker version for depth

  // Optimized 4-layer metal effect - colors now match the input color
  const filter = `
    drop-shadow(-1px -1px 0 ${highlight})
    drop-shadow(1px 1px 0 ${midShadow})
    drop-shadow(3px 3px 0 #2a2a1d)
    drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))
  `;

  return (
    <span
      className={`icon-3d ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        filter: filter.trim(),
        transform: 'perspective(500px) rotateX(8deg)',
        ...(size && { width: size, height: size }),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Icon3D;
