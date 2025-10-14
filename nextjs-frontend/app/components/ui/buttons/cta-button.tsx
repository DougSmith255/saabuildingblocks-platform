'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

export interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * CTA Button Component
 *
 * A premium call-to-action button with animated gold glow effects that turn green on click.
 * Features include:
 * - Animated gold glow on top/bottom edges
 * - Green glow effect on click that persists
 * - Smooth hover animations
 * - Full keyboard accessibility
 * - Responsive design
 *
 * @example
 * <CTAButton href="/signup">Get Started</CTAButton>
 * <CTAButton onClick={() => handleAction()}>Learn More</CTAButton>
 */
export function CTAButton({
  children,
  href,
  onClick,
  className = '',
  ariaLabel
}: CTAButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback((_e: React.MouseEvent<HTMLElement>) => {
    setIsClicked(true);
    onClick?.();

    // Keep green glow until navigation or further interaction
    if (!href) {
      // For onClick buttons, reset after animation completes
      setTimeout(() => setIsClicked(false), 2000);
    }
  }, [onClick, href]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsClicked(true);
      onClick?.();

      if (!href) {
        setTimeout(() => setIsClicked(false), 2000);
      }
    }
  }, [onClick, href]);

  const buttonClasses = `
    relative inline-flex h-[46px] items-center justify-center
    ${isClicked ? 'clicked' : ''}
    ${className}
  `;

  const linkClasses = `
    relative flex h-[46px] items-center justify-center
    rounded-xl bg-[rgb(45,45,45)] px-5 py-2
    border-t border-b border-white/10
    shadow-[0_15px_15px_rgba(0,0,0,0.3)]
    backdrop-blur-[15px]
    font-heading font-semibold text-base uppercase tracking-[0.1em]
    text-text-primary
    overflow-hidden
    transition-all duration-500
    hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-background
    active:scale-95

    /* Text glow animation */
    animate-[textGlow_3s_ease-in-out_infinite]

    /* Shine effect on hover */
    before:content-[''] before:absolute before:inset-y-0 before:left-0
    before:w-1/2 before:bg-gradient-to-l before:from-white/15 before:to-transparent
    before:skew-x-[45deg] before:transition-transform before:duration-500
    hover:before:translate-x-full
  `;

  const glowClasses = `
    /* Bottom glow line */
    before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
    before:bottom-[-5px] before:w-[30px] before:h-[10px]
    before:rounded-md before:transition-all before:duration-500 before:delay-500
    ${isClicked
      ? 'before:bg-green before:shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]'
      : 'before:bg-gold before:shadow-[0_0_5px_#ffd700,0_0_15px_#ffd700,0_0_30px_#ffd700,0_0_60px_#ffd700] before:animate-[lightPulse_3s_ease-in-out_infinite]'
    }
    hover:before:w-[80%]

    /* Top glow line */
    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
    after:top-[-5px] after:w-[30px] after:h-[10px]
    after:rounded-md after:transition-all after:duration-500 after:delay-500
    ${isClicked
      ? 'after:bg-green after:shadow-[0_0_5px_#00ff88,0_0_15px_#00ff88,0_0_30px_#00ff88,0_0_60px_#00ff88]'
      : 'after:bg-gold after:shadow-[0_0_5px_#ffd700,0_0_15px_#ffd700,0_0_30px_#ffd700,0_0_60px_#ffd700] after:animate-[lightPulse_3s_ease-in-out_infinite]'
    }
    hover:after:w-[80%]
  `;

  const content = (
    <span className="relative z-10">
      {children}
    </span>
  );

  if (href) {
    return (
      <div className={buttonClasses}>
        <Link
          href={href}
          className={`${linkClasses} ${glowClasses}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
          tabIndex={0}
        >
          {content}
        </Link>
      </div>
    );
  }

  return (
    <div className={buttonClasses}>
      <button
        type="button"
        className={`${linkClasses} ${glowClasses}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      >
        {content}
      </button>
    </div>
  );
}

// Export default for easier imports
export default CTAButton;
