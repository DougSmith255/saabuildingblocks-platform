'use client';

import React from 'react';

export interface CategoryBadgeProps {
  /** Category name */
  category: string;
  /** Visual style variant */
  variant?: 'default' | 'featured' | 'minimal';
  /** Enable 3D perspective effect (for hero sections) */
  effect3d?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CategoryBadge - SAA-styled category badge component
 *
 * Features:
 * - SAA brand colors (#ffd700 gold)
 * - Holographic border effects
 * - Hover animations
 * - Multiple variants
 *
 * @example
 * ```tsx
 * <CategoryBadge category="Real Estate" />
 * <CategoryBadge category="Technology" variant="featured" />
 * <CategoryBadge category="News" variant="minimal" />
 * ```
 */
export function CategoryBadge({
  category,
  variant = 'default',
  effect3d = false,
  className = ''
}: CategoryBadgeProps) {
  // Base styles without text color - text color handled separately for light/dark mode
  const variantStyles = {
    default: `
      px-3 py-1.5 text-xs uppercase tracking-wider
      bg-[#ffd700]/10
      border border-[#ffd700]/30
      rounded-md
      hover:bg-[#ffd700]/20 hover:border-[#ffd700]/50
      transition-all duration-300
      shadow-[0_0_10px_rgba(255,215,0,0.1)]
      hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]
      category-badge-text
    `,
    featured: `
      px-4 py-2 text-sm uppercase tracking-widest font-bold
      bg-gradient-to-r from-[#ffd700]/20 to-[#ffd700]/10
      border-2 border-[#ffd700]/50
      rounded-lg
      hover:from-[#ffd700]/30 hover:to-[#ffd700]/20
      hover:border-[#ffd700]/70
      transition-all duration-300
      shadow-[0_0_20px_rgba(255,215,0,0.2)]
      hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]
      relative
      overflow-hidden
      before:content-['']
      before:absolute
      before:inset-0
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/10
      before:to-transparent
      before:translate-x-[-100%]
      hover:before:translate-x-[100%]
      before:transition-transform
      before:duration-700
      category-badge-text
    `,
    minimal: `
      px-2 py-1 text-xs uppercase tracking-wide
      border border-[#ffd700]/20
      rounded
      hover:border-[#ffd700]/40
      transition-colors duration-200
      category-badge-text
    `
  };

  return (
    <span className={`${variantStyles[variant]} ${effect3d ? 'category-badge-3d' : ''} ${className} inline-block`}>
      {category}
    </span>
  );
}
