/**
 * Generic Card Component
 *
 * A premium glass card component for the SAA design system.
 * Uses dark gradient glass styling with gold accent border.
 *
 * Style: Premium glass with gradient background and gold accents
 * - Dark gradient background (30,30,32 to 20,20,22)
 * - Rounded corners (xl = 12px)
 * - Gold accent border (15% opacity)
 * - Depth shadow with inner highlight
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
  /** Enable hover effects for interactive cards (auto-enabled when href is provided) */
  hover?: boolean;
  /** Padding size: 'sm' (p-4), 'md' (p-6), 'lg' (p-8 md:p-10), 'xl' (p-10 md:p-12) */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the content */
  centered?: boolean;
  /** Link URL - automatically enables interactive styling */
  href?: string;
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
  href,
}: GenericCardProps) {
  // If href is provided, automatically make it interactive
  const isInteractive = hover || !!href;

  const baseClasses = 'rounded-xl';
  const hoverClasses = isInteractive
    ? 'transition-all duration-300 hover:scale-[1.02] cursor-pointer'
    : '';
  const centerClasses = centered ? 'text-center' : '';
  const paddingClass = paddingClasses[padding];

  // Premium glass styling
  const premiumGlassStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, rgba(30, 30, 32, 0.95) 0%, rgba(20, 20, 22, 0.98) 100%)',
    border: '1px solid rgba(255, 215, 0, 0.15)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  };

  // Hover handler for interactive cards
  const handleMouseEnter = isInteractive ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255, 215, 0, 0.35)';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 15px rgba(255, 215, 0, 0.1)';
  } : undefined;

  const handleMouseLeave = isInteractive ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255, 215, 0, 0.15)';
    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)';
  } : undefined;

  const cardContent = (
    <div
      className={`${baseClasses} ${paddingClass} ${hoverClasses} ${centerClasses} ${className}`.trim()}
      style={premiumGlassStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );

  // Wrap in link if href is provided
  if (href) {
    // Extract height classes from className to apply to anchor wrapper
    const hasHeightFull = className.includes('h-full');
    return (
      <a href={href} className={`block no-underline ${hasHeightFull ? 'h-full' : ''}`}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default GenericCard;
