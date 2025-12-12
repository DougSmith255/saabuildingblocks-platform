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
  color = '#c4a94d',
  size,
  className = '',
  style = {},
}: Icon3DProps) {
  // Optimized 5-layer metal effect (removed layer 3: Metal 2)
  const filter = `
    drop-shadow(-1px -1px 0 #ffe680)
    drop-shadow(1px 1px 0 #8a7a3d)
    drop-shadow(3px 3px 0 #4a3a1d)
    drop-shadow(4px 4px 0 #2a2a1d)
    drop-shadow(5px 5px 3px rgba(0, 0, 0, 0.5))
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
