'use client';

import React, { useState, useEffect } from 'react';

export interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * CTAButton - Forked for Astro (no next/link dependency)
 * Uses plain <a> tags. Astro handles prefetching natively.
 */
export function CTAButton({ href = '#', children, className = '', onClick }: CTAButtonProps) {
  const isFullWidth = className.includes('w-full');
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    const randomDelay = Math.random() * 1.5;
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  const brandGold = '#ffd700';

  const buttonStyles = {
    color: 'var(--text-color-button, var(--color-headingText))',
    fontSize: 'var(--font-size-button, 20px)',
    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
    fontWeight: 'var(--font-weight-button, 600)' as any,
    textTransform: 'var(--text-transform-button, uppercase)' as any,
    letterSpacing: 'var(--letter-spacing-button, 0.05em)',
    lineHeight: 'var(--line-height-button, 1.4)',
  };

  return (
    <div className={`relative py-2 ${className}`}>
      <div className={`group relative ${isFullWidth ? 'w-full' : 'inline-block'}`}>
        <a
          href={href}
          onClick={onClick}
          className={`
            relative flex justify-center items-center
            ${isFullWidth ? 'w-full' : ''}
            px-5 py-2
            bg-[rgb(45,45,45)]
            rounded-xl border-t border-b border-white/10
            border-l border-r border-l-transparent border-r-transparent
            hover:border-l-[#ffd700]/40 hover:border-r-[#ffd700]/40
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
            minWidth: '180px',
            whiteSpace: 'nowrap',
            boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
          }}
        >
          {children}
        </a>

        {/* Top light bar */}
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

        {/* Bottom light bar */}
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
