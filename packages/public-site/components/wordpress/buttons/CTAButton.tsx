'use client';

import React, { useState } from 'react';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function CTAButton({ href, children, className = '', onClick }: CTAButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 3000);
    onClick?.(e);
  };

  return (
    <div className={`relative inline-flex justify-center items-center ${className}`}>
      <a
        href={href}
        onClick={handleClick}
        className={`
          relative flex justify-center items-center
          h-[46px] px-5 py-2
          bg-[rgb(45,45,45)] backdrop-blur-[15px]
          rounded-xl border-t border-b border-white/10
          font-heading font-semibold text-white uppercase tracking-wide
          text-[--size-button] z-10
          shadow-[0_15px_15px_rgba(0,0,0,0.3)]
          transition-all duration-500
          animate-[textGlow_3s_ease-in-out_infinite]
          overflow-visible

          before:content-[''] before:absolute before:inset-0
          before:bg-gradient-to-l before:from-white/15 before:to-transparent
          before:w-1/2 before:skew-x-[45deg]

          ${isClicked ? 'clicked' : ''}
        `}
      >
        {children}

        {/* Bottom glow bar - half hidden behind button face */}
        <div className={`
          absolute left-1/2 -translate-x-1/2 bottom-[-5px]
          w-[30px] h-[10px] rounded-md
          bg-gold-primary shadow-gold-glow
          transition-all duration-500 delay-500
          animate-[lightPulse_3s_ease-in-out_infinite]

          group-hover:w-4/5
          ${isClicked ? 'clicked-glow-bottom' : ''}
        `} />

        {/* Top glow bar - half hidden behind button face */}
        <div className={`
          absolute left-1/2 -translate-x-1/2 top-[-5px]
          w-[30px] h-[10px] rounded-md
          bg-gold-primary
          transition-all duration-500 delay-500
          animate-[lightPulse_3s_ease-in-out_infinite]

          group-hover:w-4/5
          ${isClicked ? 'clicked-glow-top' : ''}
        `}>
          <div className="absolute inset-0 rounded-md animate-[lightPulseGlow_3s_ease-in-out_infinite]" />
        </div>
      </a>

{/* Animations defined in globals.css for cross-browser compatibility */}
    </div>
  );
}
