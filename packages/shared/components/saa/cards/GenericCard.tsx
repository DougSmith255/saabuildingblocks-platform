/**
 * Generic Card Component
 *
 * A premium dark glass card component for the SAA design system.
 * Matches the Link Page UI styling - deep dark gradient with subtle borders.
 *
 * Style: Premium dark glass (matches Link Page UI)
 * - Deep dark gradient background (20,20,20 to 12,12,12)
 * - Rounded corners (xl = 12px)
 * - Subtle white border (6% opacity)
 * - Complex shadow with outer ring and depth
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
  /** Custom styles to merge with base styles (e.g., borderColor) */
  style?: React.CSSProperties;
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
  style = {},
}: GenericCardProps) {
  // If href is provided, automatically make it interactive
  const isInteractive = hover || !!href;

  const baseClasses = 'rounded-xl';
  const hoverClasses = isInteractive
    ? 'transition-all duration-500 ease-out hover:scale-[1.01] cursor-pointer'
    : '';
  const centerClasses = centered ? 'text-center' : '';
  const paddingClass = paddingClasses[padding];

  // Premium dark glass styling (matches Link Page UI)
  const premiumGlassStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  };

  // Hover handler for interactive cards
  const handleMouseEnter = isInteractive ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)';
  } : undefined;

  const handleMouseLeave = isInteractive ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)';
  } : undefined;

  const cardContent = (
    <div
      className={`${baseClasses} ${paddingClass} ${hoverClasses} ${centerClasses} ${className}`.trim()}
      style={{ ...premiumGlassStyle, ...style }}
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
