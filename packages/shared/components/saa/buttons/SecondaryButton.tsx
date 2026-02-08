'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export interface SecondaryButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  as?: 'a' | 'button';
  /** Light bar color variant - defaults to gold */
  variant?: 'gold' | 'green' | 'purple' | 'blue';
}

/**
 * Checks if a URL is an internal link (starts with / but not //)
 */
function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * Secondary Button Component (Converted from WordPress origin)
 *
 * Secondary action button with side glow animations.
 * Uses same pulsing animation as CTAButton via cta-light-bar-pulse class.
 *
 * @example
 * <SecondaryButton href="/learn-more">Learn More</SecondaryButton>
 * <SecondaryButton as="button" onClick={handler}>Click Me</SecondaryButton>
 */
export function SecondaryButton({ href = '#', children, className = '', onClick, as = 'a', variant = 'gold' }: SecondaryButtonProps) {
  // Determine if we should use Next.js Link for client-side navigation
  const useNextLink = useMemo(() => {
    return as === 'a' && isInternalLink(href);
  }, [href, as]);

  // Use fixed initial value to avoid hydration mismatch, randomize after mount
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    // Randomize delay only on client after hydration
    const randomDelay = Math.random() * 1.5;
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  // Color variants - bar color (hex) and glow color (RGB for CSS variable)
  const colorConfig = {
    gold: { bar: '#ffd700', glowRgb: '255, 215, 0' },
    green: { bar: '#00cc66', glowRgb: '0, 255, 136' },   // Neon green glow
    purple: { bar: '#9933ff', glowRgb: '191, 95, 255' }, // Neon purple glow
    blue: { bar: '#00bfff', glowRgb: '0, 191, 255' },   // Neon blue glow
  };
  const { bar: lightBarColor, glowRgb } = colorConfig[variant];

  const buttonClasses = `
    relative flex justify-center items-center
    px-5 py-2
    bg-[rgb(45,45,45)]
    rounded-xl border-t border-b border-white/10
    text-button uppercase tracking-wide
    z-10
    shadow-[0_15px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)]
    transition-all duration-500
    overflow-hidden

    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-l before:from-white/15 before:to-transparent
    before:w-1/2 before:skew-x-[45deg]
  `;

  // Button styles - using CSS variables from Master Controller
  // CRITICAL: Use inline styles to prevent FOUC on static pages like 404
  const buttonStyles: React.CSSProperties = {
    // Typography - use system font stack that closely matches Taskor metrics
    color: 'var(--text-color-secondaryButton, var(--text-color-button, var(--color-headingText)))',
    fontSize: 'var(--font-size-secondaryButton, var(--font-size-button, 20px))',
    fontFamily: 'var(--font-family-secondaryButton, var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif))',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 'var(--letter-spacing-secondaryButton, var(--letter-spacing-button, 0.05em))',
    lineHeight: '1',
    // Layout - critical for preventing FOUC
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Responsive height matching CTAButton - scales with viewport
    height: 'clamp(35px, calc(33.182px + 0.7273vw), 55px)',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    // Visual
    backgroundColor: 'rgb(45,45,45)',
    borderRadius: '0.75rem',
    // Same shadow for all variants - no colored glow around the button itself
    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    overflow: 'hidden',
    zIndex: 10,
    // Prevent text from causing layout shift during font load
    whiteSpace: 'nowrap',
  };

  // CSS class name for glow color — avoids inline CSS variable issues
  const glowClass = `cta-glow-${variant}`;

  return (
    <div
      className={`
        relative py-2
        ${className}
      `}
    >
      {/* Variant glow colors via CSS classes — inline --glow-color doesn't cascade to ::before/::after reliably */}
      <style>{`
        .cta-glow-gold { --glow-color: 255, 215, 0; }
        .cta-glow-green { --glow-color: 0, 255, 136; }
        .cta-glow-purple { --glow-color: 191, 95, 255; }
        .cta-glow-blue { --glow-color: 0, 191, 255; }
      `}</style>

      {/* Button wrapper - inline container with relative positioning for light bars */}
      {/* This ensures light bars are positioned relative to button, not parent container */}
      {/* group class is here so hover only triggers on button face, not padding */}
      <div className="group relative inline-block">
        {as === 'button' ? (
          <button
            type="button"
            onClick={onClick as (e: React.MouseEvent<HTMLButtonElement>) => void}
            className={buttonClasses}
            style={buttonStyles}
          >
            {children}
          </button>
        ) : useNextLink ? (
          <Link
            href={href}
            onClick={onClick as (e: React.MouseEvent<HTMLAnchorElement>) => void}
            className={buttonClasses}
            style={buttonStyles}
          >
            {children}
          </Link>
        ) : (
          <a
            href={href}
            onClick={onClick as (e: React.MouseEvent<HTMLAnchorElement>) => void}
            className={buttonClasses}
            style={buttonStyles}
          >
            {children}
          </a>
        )}

        {/* Left side glow bar */}
        <div
          className={`cta-light-bar cta-light-bar-pulse cta-light-bar-side ${glowClass} rounded-md transition-all duration-500`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '-5px',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '18px',
            background: lightBarColor,
            borderRadius: '6px',
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />

        {/* Right side glow bar */}
        <div
          className={`cta-light-bar cta-light-bar-pulse cta-light-bar-side ${glowClass} rounded-md transition-all duration-500`}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-5px',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '18px',
            background: lightBarColor,
            borderRadius: '6px',
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
}
