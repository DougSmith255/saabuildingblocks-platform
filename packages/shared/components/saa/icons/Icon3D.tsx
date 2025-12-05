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
 * Icon3D - Wraps any icon with a 3D metal backing plate effect
 *
 * Creates the same 3D depth effect as the H1 component:
 * - 3D perspective with rotateX tilt
 * - Layered shadows for depth extrusion
 * - Metal backing plate pushed back in Z-space
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
 * // Custom size (for backing plate sizing)
 * <Icon3D size={24}><Calendar className="w-6 h-6" /></Icon3D>
 * ```
 */
export function Icon3D({
  children,
  color = '#ffd700',
  size = 16,
  className = '',
  style = {},
}: Icon3DProps) {
  // Calculate darker shades for depth shadows based on the color
  // For gold (#ffd700), we use darker gold/brown tones
  const isGold = color.toLowerCase() === '#ffd700';

  // Shadow colors - use appropriate darker shades
  const shadowColors = isGold
    ? ['#b8860b', '#996515', '#7a5010'] // Darker golds for gold icons
    : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.5)']; // Generic for other colors

  return (
    <span
      className={`icon-3d ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: 'perspective(500px) rotateX(15deg)',
        width: size,
        height: size,
        ...style,
      }}
    >
      {/* Main icon layer - pushed forward */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          color: color,
          transform: 'translateZ(8px)',
          filter: `
            drop-shadow(1px 1px 0 ${shadowColors[0]})
            drop-shadow(2px 2px 0 ${shadowColors[1]})
            drop-shadow(3px 3px 0 ${shadowColors[2]})
            drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.7))
          `.trim(),
        }}
      >
        {children}
      </span>

      {/* Metal backing plate - pushed back in Z-space */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #6a6258 0%, #5a5248 50%, #4a4238 100%)',
          borderRadius: '2px',
          zIndex: 0,
          transform: 'translateZ(-10px)',
          boxShadow: `
            1px 1px 0 #4a4a4a,
            2px 2px 0 #3a3a3a,
            3px 3px 0 #2f2f2f,
            4px 4px 8px rgba(0, 0, 0, 0.8)
          `.trim(),
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

export default Icon3D;
