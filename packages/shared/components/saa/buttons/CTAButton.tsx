'use client';

import React, { useState } from 'react';
// TODO: Store import removed for monorepo - needs Context provider pattern
// import { useBrandColorsStore } from '@/app/master-controller/stores/brandColorsStore';

export interface CTAButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function CTAButton({ href = '#', children, className = '', onClick }: CTAButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const isFullWidth = className.includes('w-full');

  // Using default value until we implement Context provider pattern
  const brandGreen = '#00ff88';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 3000);
    onClick?.(e);
  };

  return (
    <div className={`
      ${className}
      group
      relative ${isFullWidth ? 'flex' : 'inline-flex w-fit mx-auto'} justify-center items-center
      !my-[10px]
    `}>
      <a
        href={href}
        onClick={handleClick}
        className={`
          text-button
          relative flex justify-center items-center
          ${isFullWidth ? 'w-full' : ''}
          h-[56px] px-5 py-2
          bg-[rgb(45,45,45)] backdrop-blur-[15px]
          rounded-xl border-t border-b border-white/10
          z-10
          shadow-[0_15px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.5)]
          transition-all duration-500
          overflow-hidden

          before:content-[''] before:absolute before:inset-0
          before:bg-gradient-to-l before:from-white/15 before:to-transparent
          before:w-1/2 before:skew-x-[45deg]

          ${isClicked ? 'clicked' : ''}
        `}
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
