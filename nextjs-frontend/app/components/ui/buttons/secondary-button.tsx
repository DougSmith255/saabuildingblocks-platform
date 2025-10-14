'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SecondaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Secondary Button Component
 *
 * Futuristic secondary button with animated gold/green glow effects.
 * Features vertical glow lines (left/right) that expand on hover.
 * Implements persistent green glow state on click.
 *
 * @param children - Button text content
 * @param href - Optional link destination
 * @param onClick - Optional click handler
 * @param className - Additional CSS classes
 * @param ariaLabel - Accessibility label
 */
export function SecondaryButton({
  children,
  href,
  onClick,
  className = '',
  ariaLabel,
}: SecondaryButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (_e: React.MouseEvent) => {
    setIsClicked(true);
    if (onClick) {
      onClick();
    }
  };

  // Base button wrapper styles
  const wrapperClasses = `
    relative inline-flex items-center justify-center
    w-auto h-[46px] m-0
    ${isClicked ? 'clicked' : ''}
    ${className}
  `;

  // Button/link styles (converted from WordPress CSS)
  const buttonClasses = `
    relative flex items-center justify-center
    h-[46px] px-5 py-2

    /* Background and borders */
    bg-[rgb(45,45,45)]
    border-t border-b border-white/10
    rounded-xl

    /* Shadow and backdrop */
    shadow-[0_15px_15px_rgba(0,0,0,0.3)]
    backdrop-blur-[15px]

    /* Typography */
    font-heading font-semibold text-button
    tracking-[0.1em] uppercase
    text-text-primary
    no-underline

    /* Transitions */
    transition-all duration-500

    /* Animation */
    animate-text-glow

    /* Z-index */
    z-10

    /* Overflow for inner glow effect */
    overflow-hidden

    /* Focus state for accessibility */
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-gold/50
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
  `;

  // Inner content with skewed gradient overlay
  const innerContent = (
    <>
      {/* Skewed gradient overlay (::before equivalent) */}
      <span
        className="
          absolute top-0 left-0
          w-1/2 h-full
          bg-gradient-to-l from-white/15 to-transparent
          skew-x-[45deg] translate-x-0
          blur-0
          pointer-events-none
        "
        aria-hidden="true"
      />

      {/* Button text */}
      <span className="relative z-10">
        {children}
      </span>
    </>
  );

  // Render as link or button based on href prop
  const ButtonElement = href ? Link : 'button';
  const elementProps = href
    ? { href }
    : { type: 'button' as const };

  return (
    <div className={wrapperClasses}>
      {/* Left vertical glow line (::before on wrapper) */}
      <span
        className={`
          absolute top-1/2 -translate-y-1/2 -left-[5px]
          w-2.5 h-[18px]
          rounded-md
          transition-all duration-500 delay-500
          animate-light-pulse
          pointer-events-none

          /* Gold glow default */
          ${!isClicked ? `
            bg-gold
            shadow-[0_0_5px_#ffd700,0_0_15px_#ffd700,0_0_30px_#ffd700,0_0_60px_#ffd700]
          ` : `
            !bg-green-glow
            !shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]
          `}

          /* Hover state - expand vertically to 80% */
          group-hover:h-[80%]

          /* Active/click state - green glow */
          group-active:!bg-green-glow
          group-active:!shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]
        `}
        aria-hidden="true"
      />

      {/* Right vertical glow line (::after on wrapper) */}
      <span
        className={`
          absolute top-1/2 -translate-y-1/2 -right-[5px]
          w-2.5 h-[18px]
          rounded-md
          transition-all duration-500 delay-500
          animate-light-pulse
          pointer-events-none

          /* Gold glow default */
          ${!isClicked ? `
            bg-gold
            shadow-[0_0_5px_#ffd700,0_0_15px_#ffd700,0_0_30px_#ffd700,0_0_60px_#ffd700]
          ` : `
            !bg-green-glow
            !shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]
          `}

          /* Hover state - expand vertically to 80% */
          group-hover:h-[80%]

          /* Active/click state - green glow */
          group-active:!bg-green-glow
          group-active:!shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]
        `}
        aria-hidden="true"
      />

      <ButtonElement
        {...(elementProps as any)}
        className={`${buttonClasses} group`}
        onClick={handleClick}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      >
        {innerContent}
      </ButtonElement>
    </div>
  );
}

export default SecondaryButton;
