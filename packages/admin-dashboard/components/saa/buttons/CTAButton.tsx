'use client';

import React, { useState, useEffect } from 'react';
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
  const [lightPulseDelay, setLightPulseDelay] = useState('0s');

  useEffect(() => {
    const randomDelay = Math.random() * 1.5; // 0 to 1.5 seconds for light pulse
    setLightPulseDelay(`${randomDelay.toFixed(2)}s`);
  }, []);

  // Brand colors for glow effects (keep hardcoded for animation compatibility)
  const brandGold = '#ffd700';
  const brandGreen = '#00ff88';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 3000);
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
        ${className}
        group
        relative ${isFullWidth ? 'flex' : 'inline-flex w-fit'} justify-center items-center
        !my-[10px]
        ${heroAnimate ? 'hero-entrance-animate' : ''}
      `}
      style={heroAnimate ? {
        opacity: 0,
        animation: `fadeInUp2025 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${heroAnimationDelay} both`,
        willChange: 'opacity, transform',
      } : {}}
    >
      <a
        href={href}
        onClick={handleClick}
        className={`
          relative flex justify-center items-center
          ${isFullWidth ? 'w-full' : ''}
          h-[56px] px-5 py-2
          bg-[rgb(45,45,45)] backdrop-blur-[15px]
          rounded-xl border-t border-b border-white/10
          uppercase tracking-wide
          z-10
          shadow-[0_15px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)]
          transition-all duration-500
          overflow-hidden

          before:content-[''] before:absolute before:inset-0
          before:bg-gradient-to-l before:from-white/15 before:to-transparent
          before:w-1/2 before:skew-x-[45deg]

          ${isClicked ? 'clicked' : ''}
        `}
        style={buttonStyles}
      >
        {children}
      </a>

      {/* Bottom light bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
        style={{
          background: isClicked ? brandGreen : '#ffd700',
          boxShadow: isClicked
            ? `0 0 5px ${brandGreen}, 0 0 15px ${brandGreen}, 0 0 30px ${brandGreen}, 0 0 60px ${brandGreen}`
            : '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
          animation: isClicked ? 'none' : 'lightPulse 3s ease-in-out infinite',
          animationDelay: isClicked ? '0s' : lightPulseDelay,
          transition: 'all 0.3s ease-in-out',
        }}
      />

      {/* Top light bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[-5px] w-[30px] h-[10px] rounded-md transition-all duration-500 group-hover:w-4/5"
        style={{
          background: isClicked ? brandGreen : '#ffd700',
          boxShadow: isClicked
            ? `0 0 5px ${brandGreen}, 0 0 15px ${brandGreen}, 0 0 30px ${brandGreen}, 0 0 60px ${brandGreen}`
            : '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
          animation: isClicked ? 'none' : 'lightPulse 3s ease-in-out infinite',
          animationDelay: isClicked ? '0s' : lightPulseDelay,
          transition: 'all 0.3s ease-in-out',
        }}
      />

      <style jsx>{`
        /* 2025 Hero Entrance Animation */
        @keyframes fadeInUp2025 {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }


        @keyframes lightPulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700;
          }
          50% {
            opacity: 0.7;
            box-shadow: 0 0 8px #ffd700, 0 0 20px #ffd700, 0 0 35px #ffd700, 0 0 70px #ffd700;
          }
        }
      `}</style>
    </div>
  );
}
