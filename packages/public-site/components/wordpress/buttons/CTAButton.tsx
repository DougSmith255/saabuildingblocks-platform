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
    <div className={`
      relative inline-flex justify-center items-center
      ${className}
    `}>
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
          overflow-hidden

          before:content-[''] before:absolute before:inset-0
          before:bg-gradient-to-l before:from-white/15 before:to-transparent
          before:w-1/2 before:skew-x-[45deg]

          ${isClicked ? 'clicked' : ''}
        `}
      >
        {children}
      </a>

      {/* Bottom glow bar */}
      <div className={`
        absolute left-1/2 -translate-x-1/2 bottom-[-5px]
        w-[30px] h-[10px] rounded-md
        bg-gold-primary shadow-gold-glow
        transition-all duration-500 delay-500
        animate-[lightPulse_3s_ease-in-out_infinite]

        group-hover:w-4/5
        ${isClicked ? 'clicked-glow-bottom' : ''}
      `} />

      {/* Top glow bar */}
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

      <style jsx>{`
        @keyframes lightPulse {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 5px #ffd700) drop-shadow(0 0 15px #ffd700) drop-shadow(0 0 30px #ffd700) brightness(1.2);
          }
          50% {
            opacity: 0.7;
            filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 35px #ffd700) brightness(1.4);
          }
        }

        @keyframes lightPulseGlow {
          0%, 100% {
            opacity: 0.8;
            filter: blur(4px) brightness(1.2);
          }
          50% {
            opacity: 1;
            filter: blur(6px) brightness(1.5);
          }
        }

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
          33% {
            text-shadow: 0 0 10px rgba(255, 237, 78, 0.5);
          }
          66% {
            text-shadow: 0 0 10px rgba(255, 183, 0, 0.5);
          }
          100% {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
        }

        .clicked-glow-bottom,
        .clicked-glow-top {
          background: #00ff88 !important;
          filter: drop-shadow(0 0 5px #00ff88) drop-shadow(0 0 15px #00ff88) drop-shadow(0 0 30px #00ff88) brightness(1.3) !important;
          animation: greenClick 3s ease-out forwards;
        }

        @keyframes greenClick {
          0% {
            background: #00ff88;
            filter: drop-shadow(0 0 5px #00ff88) drop-shadow(0 0 15px #00ff88) drop-shadow(0 0 30px #00ff88) brightness(1.3);
          }
          90% {
            background: #00ff88;
            filter: drop-shadow(0 0 5px #00ff88) drop-shadow(0 0 15px #00ff88) drop-shadow(0 0 30px #00ff88) brightness(1.3);
          }
          100% {
            background: #ffd700;
            filter: drop-shadow(0 0 5px #ffd700) drop-shadow(0 0 15px #ffd700) drop-shadow(0 0 30px #ffd700) brightness(1.2);
          }
        }
      `}</style>
    </div>
  );
}
