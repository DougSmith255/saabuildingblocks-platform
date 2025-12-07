/**
 * Generic Card Component
 *
 * A clean, simple card component for the SAA design system.
 * Uses subtle glass-like styling with rounded corners and soft border.
 *
 * Style: bg-white/5 rounded-xl border border-white/10
 * - Semi-transparent white background (5% opacity)
 * - Rounded corners (xl = 12px)
 * - Subtle white border (10% opacity)
 * - Optional hover state for interactive cards
 *
 * @example
 * <GenericCard>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </GenericCard>
 *
 * @example Interactive card with hover
 * <GenericCard hover>
 *   <h3>Clickable Card</h3>
 * </GenericCard>
 *
 * @example Custom padding
 * <GenericCard padding="lg">
 *   <h3>Large padding card</h3>
 * </GenericCard>
 */

import React from 'react';

export interface GenericCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Enable hover effects for interactive cards */
  hover?: boolean;
  /** Padding size: 'sm' (p-4), 'md' (p-6), 'lg' (p-8 md:p-10), 'xl' (p-10 md:p-12) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
  xl: 'p-10 md:p-12',
};

export function GenericCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  centered = false,
}: GenericCardProps) {
  const baseClasses = 'bg-white/5 rounded-xl border border-white/10';
  const hoverClasses = hover
    ? 'transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-[#ffd700]/60 hover:shadow-lg hover:shadow-[#ffd700]/10'
    : '';
  const centerClasses = centered ? 'text-center' : '';
  const paddingClass = paddingClasses[padding];

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${hoverClasses} ${centerClasses} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export default GenericCard;
