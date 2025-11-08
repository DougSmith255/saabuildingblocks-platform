import React from 'react';

/**
 * FullWidthLayout Component Props
 */
export interface FullWidthLayoutProps {
  children: React.ReactNode;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Background color override (default: transparent)
   */
  backgroundColor?: string;
  /**
   * Add centered content constraint (max-width container)
   * Use this when you want centered content areas within the full-width layout
   */
  centered?: boolean;
  /**
   * Max width for centered content (default: 1400px)
   * Only applies when centered is true
   */
  maxWidth?: string;
  /**
   * Vertical padding (default: py-16)
   * Options: none, sm, md, lg, xl
   */
  verticalPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /**
   * Custom vertical padding value (only used when verticalPadding is 'custom')
   */
  customVerticalPadding?: string;
  /**
   * Horizontal padding for content (default: px-6)
   * Set to 'none' for true edge-to-edge content
   * Set to 'responsive' for smart responsive padding
   */
  horizontalPadding?: 'none' | 'responsive' | 'custom';
  /**
   * Custom horizontal padding value (only used when horizontalPadding is 'custom')
   */
  customHorizontalPadding?: string;
  /**
   * ARIA label for the section
   */
  ariaLabel?: string;
  /**
   * ID for the section (useful for anchor links)
   */
  id?: string;
  /**
   * Semantic HTML element to use (default: 'section')
   */
  as?: 'div' | 'section' | 'article' | 'main';
}

/**
 * FullWidthLayout - Reusable Full-Width Layout Wrapper
 *
 * A flexible layout component that provides full-width, edge-to-edge design
 * for non-blog-post pages. Supports both full-bleed and centered content patterns.
 *
 * Features:
 * - Full viewport width with no max-width constraints
 * - Optional centered content areas for readability
 * - Configurable vertical and horizontal spacing
 * - Semantic HTML elements (section, article, div, main)
 * - TypeScript types for type safety
 * - ARIA support for accessibility
 *
 * Usage Examples:
 *
 * 1. Full-width hero section:
 * ```tsx
 * <FullWidthLayout
 *   verticalPadding="xl"
 *   horizontalPadding="responsive"
 *   ariaLabel="Hero section"
 * >
 *   <HeroContent />
 * </FullWidthLayout>
 * ```
 *
 * 2. Centered content with padding:
 * ```tsx
 * <FullWidthLayout
 *   centered
 *   maxWidth="1200px"
 *   verticalPadding="lg"
 * >
 *   <PageContent />
 * </FullWidthLayout>
 * ```
 *
 * 3. Edge-to-edge background image:
 * ```tsx
 * <FullWidthLayout
 *   horizontalPadding="none"
 *   verticalPadding="none"
 *   className="bg-cover bg-center"
 *   style={{ backgroundImage: 'url(/images/hero.jpg)' }}
 * >
 *   <ContentOverlay />
 * </FullWidthLayout>
 * ```
 *
 * 4. Custom spacing:
 * ```tsx
 * <FullWidthLayout
 *   verticalPadding="custom"
 *   customVerticalPadding="10rem 5rem"
 *   horizontalPadding="custom"
 *   customHorizontalPadding="clamp(1rem, 5vw, 5rem)"
 * >
 *   <CustomContent />
 * </FullWidthLayout>
 * ```
 *
 * @see /home/claude-flow/packages/public-site/app/page.tsx - Homepage example
 * @see /home/claude-flow/packages/public-site/app/real-estate-agent-job/page.tsx - Blog page example
 */
export default function FullWidthLayout({
  children,
  className = '',
  backgroundColor = 'transparent',
  centered = false,
  maxWidth = '1400px',
  verticalPadding = 'lg',
  customVerticalPadding,
  horizontalPadding = 'responsive',
  customHorizontalPadding,
  ariaLabel,
  id,
  as: Component = 'section',
}: FullWidthLayoutProps) {
  // Map vertical padding presets to Tailwind classes
  const verticalPaddingMap = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
    custom: '',
  };

  // Map horizontal padding presets to Tailwind classes
  const horizontalPaddingMap = {
    none: '',
    responsive: 'px-6 sm:px-12 md:px-16 lg:px-20',
    custom: '',
  };

  // Build the class names
  const containerClasses = [
    'w-full',
    'relative',
    verticalPaddingMap[verticalPadding],
    horizontalPaddingMap[horizontalPadding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build custom styles
  const customStyles: React.CSSProperties = {
    backgroundColor,
    ...(verticalPadding === 'custom' && customVerticalPadding
      ? { padding: `${customVerticalPadding} 0` }
      : {}),
    ...(horizontalPadding === 'custom' && customHorizontalPadding
      ? { paddingLeft: customHorizontalPadding, paddingRight: customHorizontalPadding }
      : {}),
  };

  // If centered content is requested, wrap children in a centered container
  const content = centered ? (
    <div
      className="mx-auto w-full"
      style={{ maxWidth }}
    >
      {children}
    </div>
  ) : (
    children
  );

  return (
    <Component
      id={id}
      className={containerClasses}
      style={customStyles}
      aria-label={ariaLabel}
    >
      {content}
    </Component>
  );
}
