import React from 'react';

export interface CategoryBadgeProps {
  /** Category name */
  category: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CategoryBadge - Icon3D-styled category badge with 4-layer metal effect
 *
 * Uses the same optimized 4-layer drop-shadow filter as Icon3D:
 * 1. Highlight (-1px -1px 0 #ffe680)
 * 2. Metal (1px 1px 0 #8a7a3d)
 * 3. Shadow (4px 4px 0 #2a2a1d)
 * 4. Depth (5px 5px 3px rgba(0,0,0,0.5))
 *
 * @example
 * ```tsx
 * <CategoryBadge category="Real Estate" />
 * ```
 */
export function CategoryBadge({
  category,
  className = ''
}: CategoryBadgeProps) {
  // 4-layer metal effect matching Icon3D
  const filter = `
    drop-shadow(-1px -1px 0 #ffe680)
    drop-shadow(1px 1px 0 #8a7a3d)
    drop-shadow(4px 4px 0 #2a2a1d)
    drop-shadow(5px 5px 3px rgba(0, 0, 0, 0.5))
  `;

  return (
    <span
      className={`inline-block uppercase tracking-wider ${className}`}
      style={{
        fontFamily: 'var(--font-taskor)',
        color: '#c4a94d',
        filter: filter.trim(),
        transform: 'perspective(500px) rotateX(8deg)',
        // Fluid sizing: 15px min → 40px max
        fontSize: 'clamp(15px, calc(12.73px + 0.93vw), 40px)',
      }}
    >
      {category}
    </span>
  );
}
