'use client';

import React, { useState, useEffect } from 'react';
// TODO: Store imports removed for monorepo - needs Context provider pattern
// import { useTypographyStore } from '@/app/master-controller/stores/typographyStore';
// import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';

export interface SecondaryButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  as?: 'a' | 'button';
}

/**
 * Secondary Button Component (Converted from WordPress origin)
 *
 * Secondary action button with side glow animations.
 * Preserves exact WordPress styling and animations.
 *
 * @example
 * <SecondaryButton href="/learn-more">Learn More</SecondaryButton>
 * <SecondaryButton as="button" onClick={handler}>Click Me</SecondaryButton>
 */
export function SecondaryButton({ href = '#', children, className = '', onClick, as = 'a' }: SecondaryButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [leftGlowDelay, setLeftGlowDelay] = useState('0s');
  const [rightGlowDelay, setRightGlowDelay] = useState('0s');

  useEffect(() => {
    const leftDelay = Math.random() * 3; // 0 to 3 seconds for left glow
    const rightDelay = Math.random() * 3; // 0 to 3 seconds for right glow (independent)
    setLeftGlowDelay(`${leftDelay.toFixed(2)}s`);
    setRightGlowDelay(`${rightDelay.toFixed(2)}s`);
  }, []);

  // Brand colors for glow effects (keep hardcoded for animation compatibility)
  const brandGold = '#ffd700';
  const brandGreen = '#00ff88';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 3000);
    onClick?.(e);
  };

  // Extract width classes from className to apply to button element
  const widthMatch = className?.match(/(min-w-\[[\d]+px\]|w-full|w-\[[\d]+px\])/);
  const widthClass = widthMatch ? widthMatch[0] : '';

  const buttonClasses = `
    relative flex justify-center items-center
    ${widthClass}
    px-5 py-2
    bg-[rgb(45,45,45)] backdrop-blur-[15px]
    rounded-xl border-t border-b border-white/10
    text-button uppercase tracking-wide
    z-10
    shadow-[0_15px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)]
    transition-all duration-500
    overflow-hidden

    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-l before:from-white/15 before:to-transparent
    before:w-1/2 before:skew-x-[45deg]

    ${isClicked ? 'clicked' : ''}
  `;

  // Button styles - using CSS variables from Master Controller
  const buttonStyles = {
    color: 'var(--text-color-button, var(--color-headingText))',
    fontSize: 'var(--font-size-button, 20px)',
    fontFamily: 'var(--font-family-button, var(--font-taskor), Taskor, system-ui, sans-serif)',
    fontWeight: 'var(--font-weight-button, 600)' as any,
    textTransform: 'var(--text-transform-button, uppercase)' as any,
    letterSpacing: 'var(--letter-spacing-button, 0.05em)',
    lineHeight: 'var(--line-height-button, 1.4)',
    height: 'clamp(45px, calc(42.273px + 1.091vw), 75px)'
  };

  const ButtonElement = as === 'button' ? 'button' : 'a';

  return (
    <div className={`
      ${className}
      ${widthClass}
      py-2
    `}>
      <div className={`
        group
        relative flex justify-center items-center
        !my-[10px]
      `}>
      <ButtonElement
        {...(as === 'a' ? { href } : { type: 'button' as const })}
        onClick={handleClick}
        className={buttonClasses}
        style={buttonStyles}
      >
        {children}
      </ButtonElement>

      {/* Left side glow bar */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[-5px] w-[10px] h-[18px] rounded-md transition-all duration-300 group-hover:h-[80%]"
        style={{
          background: isClicked ? brandGreen : '#ffd700',
          boxShadow: isClicked
            ? `0 0 5px ${brandGreen}, 0 0 15px ${brandGreen}, 0 0 30px ${brandGreen}, 0 0 60px ${brandGreen}`
            : '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
          animation: isClicked ? 'none' : `lightPulse 3s ease-in-out infinite`,
          animationDelay: leftGlowDelay,
          transition: 'all 0.3s ease-in-out',
        }}
      />

      {/* Right side glow bar */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-[10px] h-[18px] rounded-md transition-all duration-300 group-hover:h-[80%]"
        style={{
          background: isClicked ? brandGreen : '#ffd700',
          boxShadow: isClicked
            ? `0 0 5px ${brandGreen}, 0 0 15px ${brandGreen}, 0 0 30px ${brandGreen}, 0 0 60px ${brandGreen}`
            : '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
          animation: isClicked ? 'none' : `lightPulse 3s ease-in-out infinite`,
          animationDelay: rightGlowDelay,
          transition: 'all 0.3s ease-in-out',
        }}
      />

      <style jsx>{`
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
    </div>
  );
}
