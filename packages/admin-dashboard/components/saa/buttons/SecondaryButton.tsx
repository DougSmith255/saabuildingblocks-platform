'use client';

import React, { useState } from 'react';
import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';

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
  // Hardcoded button settings (moved from typography to component-level)
  const buttonSettings = {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: 0.01,
    color: 'headingText',
  };
  const brandColors = useBrandColorsStore((state) => state.settings);

  // Resolve color from brand colors store with safety check
  const resolvedColor = buttonSettings?.color as keyof typeof brandColors;
  const buttonColor = (brandColors && resolvedColor && brandColors[resolvedColor]) || '#ffffff';

  // Get brand green for click effect (handle missing green property)
  const brandGreen = brandColors?.green || brandColors?.accentGreen || '#00ff88';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 3000);
    onClick?.(e);
  };

  const buttonClasses = `
    relative flex justify-center items-center
    ${className?.includes('w-full') ? 'w-full' : ''}
    h-[56px] px-5 py-2
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

  const buttonStyles = {
    color: buttonColor,
    fontSize: `${buttonSettings.fontSize}px`,
    fontWeight: buttonSettings.fontWeight,
    letterSpacing: `${buttonSettings.letterSpacing}em`
  };

  const ButtonElement = as === 'button' ? 'button' : 'a';

  return (
    <div className={`
      ${className}
      group
      relative ${className?.includes('w-full') ? 'flex' : 'inline-flex'} justify-center items-center
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
          animation: isClicked ? 'none' : 'lightPulse 3s ease-in-out infinite',
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
          animation: isClicked ? 'none' : 'lightPulse 3s ease-in-out infinite',
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
  );
}
