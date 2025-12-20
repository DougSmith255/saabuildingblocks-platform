'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** @deprecated Animation removed - using page-level settling mask instead */
  heroAnimate?: boolean;
  /** @deprecated Animation removed - using page-level settling mask instead */
  animationDelay?: string;
}

/**
 * Checks if a URL is an internal link (starts with / but not //)
 */
function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

export function CTAButton({ href = '#', children, className = '', onClick }: CTAButtonProps) {
  // Determine if we should use Next.js Link for client-side navigation
  const useNextLink = useMemo(() => {
    return isInternalLink(href);
  }, [href]);
  const isFullWidth = className.includes('w-full');
  // Use fixed initial value to avoid hydration mismatch, randomize after mount
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    // Randomize delay only on client after hydration
    const randomDelay = Math.random() * 1.5;
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  // Brand colors for glow effects (keep hardcoded for animation compatibility)
  const brandGold = '#ffd700';

  // Button styles - using CSS variables from Master Controller
  const buttonStyles = {
    color: 'var(--text-color-button, var(--color-headingText))',
    fontSize: 'var(--font-size-button, 20px)',
    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
    fontWeight: 'var(--font-weight-button, 600)' as any,
    textTransform: 'var(--text-transform-button, uppercase)' as any,
    letterSpacing: 'var(--letter-spacing-button, 0.05em)',
    lineHeight: 'var(--line-height-button, 1.4)'
  };

  return (
    <div
      className={`
        group relative py-2
        ${className}
      `}
    >
      {/* Button wrapper - inline container with relative positioning for light bars */}
      <div className={`relative ${isFullWidth ? 'w-full' : 'inline-block'}`}>
        {/* Use Next.js Link for internal links (client-side navigation), regular anchor for external */}
        {useNextLink ? (
          <Link
            href={href}
            onClick={onClick}
            className={`
              relative flex justify-center items-center
              ${isFullWidth ? 'w-full' : ''}
              px-5 py-2
              bg-[rgb(45,45,45)]
              rounded-xl border-t border-b border-white/10
              uppercase tracking-wide
              z-10
              transition-all duration-500
              overflow-hidden

              before:content-[''] before:absolute before:inset-0
              before:bg-gradient-to-l before:from-white/15 before:to-transparent
              before:w-1/2 before:skew-x-[45deg]
            `}
            style={{
              ...buttonStyles,
              height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
              // minWidth prevents CLS, button grows to fit content
              minWidth: '180px',
              whiteSpace: 'nowrap',
              boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)'
            }}
          >
            {children}
          </Link>
        ) : (
          <a
            href={href}
            onClick={onClick}
            className={`
              relative flex justify-center items-center
              ${isFullWidth ? 'w-full' : ''}
              px-5 py-2
              bg-[rgb(45,45,45)]
              rounded-xl border-t border-b border-white/10
              uppercase tracking-wide
              z-10
              transition-all duration-500
              overflow-hidden

              before:content-[''] before:absolute before:inset-0
              before:bg-gradient-to-l before:from-white/15 before:to-transparent
              before:w-1/2 before:skew-x-[45deg]
            `}
            style={{
              ...buttonStyles,
              height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
              // minWidth prevents CLS, button grows to fit content
              minWidth: '180px',
              whiteSpace: 'nowrap',
              boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)'
            }}
          >
            {children}
          </a>
        )}

      {/* Top light bar - positioned half behind top edge of button */}
      <div
        className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: brandGold,
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />

      {/* Bottom light bar - positioned half behind bottom edge of button */}
      <div
        className="cta-light-bar cta-light-bar-pulse w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: brandGold,
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
}
