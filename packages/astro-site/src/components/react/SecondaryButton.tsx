'use client';

import React, { useState, useEffect } from 'react';

export interface SecondaryButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  as?: 'a' | 'button';
  variant?: 'gold' | 'green' | 'purple' | 'blue';
}

/**
 * SecondaryButton - Forked for Astro (no next/link dependency)
 * Uses plain <a> tags. Astro handles prefetching natively.
 */
export function SecondaryButton({ href = '#', children, className = '', onClick, as = 'a', variant = 'gold' }: SecondaryButtonProps) {
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    const randomDelay = Math.random() * 1.5;
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  const colorConfig = {
    gold: { bar: '#ffd700', glowRgb: '255, 215, 0' },
    green: { bar: '#00cc66', glowRgb: '0, 255, 136' },
    purple: { bar: '#9933ff', glowRgb: '191, 95, 255' },
    blue: { bar: '#00bfff', glowRgb: '0, 191, 255' },
  };
  const { bar: lightBarColor } = colorConfig[variant];

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

  const buttonStyles: React.CSSProperties = {
    color: 'var(--text-color-secondaryButton, var(--text-color-button, var(--color-headingText)))',
    fontSize: 'var(--font-size-secondaryButton, var(--font-size-button, 20px))',
    fontFamily: 'var(--font-family-secondaryButton, var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif))',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 'var(--letter-spacing-secondaryButton, var(--letter-spacing-button, 0.05em))',
    lineHeight: '1',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'clamp(35px, calc(33.182px + 0.7273vw), 55px)',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    backgroundColor: 'rgb(45,45,45)',
    borderRadius: '0.75rem',
    boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    overflow: 'hidden',
    zIndex: 10,
    whiteSpace: 'nowrap',
  };

  const glowClass = `cta-glow-${variant}`;

  return (
    <div className={`relative py-2 ${className}`}>
      <style>{`
        .cta-glow-gold { --glow-color: 255, 215, 0; }
        .cta-glow-green { --glow-color: 0, 255, 136; }
        .cta-glow-purple { --glow-color: 191, 95, 255; }
        .cta-glow-blue { --glow-color: 0, 191, 255; }
      `}</style>

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
