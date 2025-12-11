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
export function Icon3D({
  children,
  color = '#ffd700',
  size,
  className = '',
  style = {},
}: Icon3DProps) {
  // Option 6: Dual Tone Glow - white-hot inner core with warm gold outer glow
  const filter = `
    drop-shadow(0 0 1px #fff)
    drop-shadow(0 0 2px #fff)
    drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.9))
    drop-shadow(0 0 12px rgba(255, 179, 71, 0.6))
    drop-shadow(0 0 20px rgba(255, 140, 0, 0.3))
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
        ...(size && { width: size, height: size }),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Icon3D;
