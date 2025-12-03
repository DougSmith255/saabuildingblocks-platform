'use client';

import React, { useState } from 'react';
// TODO: Store import removed for monorepo - needs Context provider pattern
// import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';

export interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  heroAnimate?: boolean;
  animationDelay?: string;
}

export function CTAButton({ href = '#', children, className = '', onClick, heroAnimate = false, animationDelay: heroAnimationDelay = '1.0s' }: CTAButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const isFullWidth = className.includes('w-full');
  // Initialize with a function to generate random delay immediately during render
  // This ensures both SSR and CSR get a random value, avoiding hydration mismatch
  const [lightPulseDelay] = useState(() => {
    // Use lazy initialization - this runs once during component creation
    const randomDelay = Math.random() * 1.5; // 0 to 1.5 seconds for light pulse
    return `${randomDelay.toFixed(2)}s`;
  });

  // Brand colors for glow effects (keep hardcoded for animation compatibility)
  const brandGold = '#ffd700';
  const brandGreen = '#00ff88';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 2000); // Stay green for 2 seconds
    onClick?.(e);
  };

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
        group relative
        ${className}
        ${heroAnimate ? 'hero-entrance-animate' : ''}
      `}
      style={heroAnimate ? {
        opacity: 0,
        animation: `fadeInUp2025 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${heroAnimationDelay} both`,
        willChange: 'opacity, transform',
      } : {}}
    >
      {/* Button wrapper - inline container with relative positioning for light bars */}
      <div className={`relative ${isFullWidth ? 'w-full' : 'inline-block'}`}>
        <a
          href={href}
          onClick={handleClick}
          className={`
            relative flex justify-center items-center
            ${isFullWidth ? 'w-full' : ''}
            px-5 py-2
            bg-[rgb(45,45,45)] backdrop-blur-[15px]
            rounded-xl border-t border-b border-white/10
            uppercase tracking-wide
            z-10
            transition-all duration-500
            overflow-hidden

            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-l before:from-white/15 before:to-transparent
            before:w-1/2 before:skew-x-[45deg]

            ${isClicked ? 'clicked' : ''}
          `}
          style={{
            ...buttonStyles,
            height: 'clamp(45px, calc(43.182px + 0.7273vw), 65px)',
            boxShadow: '0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)'
          }}
        >
          {children}
        </a>

      {/* Top light bar - positioned half behind top edge of button */}
      <div
        className={`
          cta-light-bar
          w-[30px] h-[10px] rounded-md
          transition-all duration-500 group-hover:w-4/5
          ${!isClicked ? 'cta-light-bar-pulse' : ''}
        `}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isClicked ? brandGreen : '#ffd700',
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />

      {/* Bottom light bar - positioned half behind bottom edge of button */}
      <div
        className={`
          cta-light-bar
          w-[30px] h-[10px] rounded-md
          transition-all duration-500 group-hover:w-4/5
          ${!isClicked ? 'cta-light-bar-pulse' : ''}
        `}
          style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isClicked ? brandGreen : '#ffd700',
            animationDelay: lightPulseDelay,
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
}
