'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CyberHolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function CyberHolographicCard({ children, className = '' }: CyberHolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full h-[340px]
        transition-all duration-200
        contrast-110 saturate-120
        ${className}
      `}
    >
      <div className={`
        absolute inset-0 z-0
        flex justify-center items-center
        rounded-xl overflow-hidden
        transition-all duration-700
        bg-[linear-gradient(45deg,rgba(10,10,10,0.9),rgba(26,26,26,0.9))]
        shadow-[0_0_30px_rgba(0,0,0,0.4),inset_0_0_30px_rgba(255,255,255,0.05)]
        border border-white/10

        before:content-[''] before:absolute before:inset-0
        before:bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.12)_25%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.10)_75%,rgba(255,255,255,0.04)_100%)]
        before:bg-[length:400%_400%]
        before:animate-[holographic_6s_ease-in-out_infinite]
        before:opacity-40 before:rounded-xl before:mix-blend-overlay

        after:content-[''] after:absolute after:inset-[2px]
        after:bg-[linear-gradient(45deg,rgba(10,10,10,0.9),rgba(26,26,26,0.9))]
        after:rounded-xl after:z-[-1]
        after:animate-[chromatic_4s_ease-in-out_infinite]

        ${isHovered ? 'scale-102 brightness-110 contrast-110' : ''}
      `}>
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-60">
          <div className="absolute left-[20%] w-5 text-white/30 font-mono text-[8px] leading-[10px] whitespace-pre-wrap break-all animate-[matrixRain_8s_linear_infinite] [text-shadow:0_0_5px_rgba(255,255,255,0.5)]">
            01001010011001010110111001100101010000110110111101100100011001010
          </div>
          <div className={`
            absolute right-[25%] w-5
            font-mono text-[8px] leading-[10px]
            whitespace-pre-wrap break-all
            animate-[matrixRain_8s_linear_infinite]
            [animation-delay:-6s]
            ${isHovered ? 'text-yellow-400 [text-shadow:0_0_20px_#ffd700,0_0_35px_rgba(255,215,0,0.6),0_0_50px_rgba(255,215,0,0.3)]' : 'text-yellow-400 [text-shadow:0_0_5px_rgba(255,215,0,0.3)]'}
          `}>
            01001010011001010110111001100101010000110110111101100100011001010
          </div>
        </div>

        {/* Glitch Overlay */}
        <div className={`
          absolute inset-0 pointer-events-none rounded-xl
          bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]
          animate-[glitchEffect_3s_steps(1)_infinite]
          ${isHovered ? '[animation-duration:0.5s]' : ''}
        `} />

        {/* Content */}
        <div className="relative w-full h-full px-8 py-8 box-border z-10">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes holographic {
          0%, 100% {
            background-position: 0% 50%;
            filter: brightness(1);
          }
          50% {
            background-position: 100% 50%;
            filter: brightness(1.8);
          }
        }

        @keyframes chromatic {
          0%, 100% {
            filter: drop-shadow(2px 0 0 rgba(255, 215, 0, 0.1))
                   drop-shadow(-2px 0 0 rgba(255, 255, 255, 0.1));
          }
          25% {
            filter: drop-shadow(3px 0 0 rgba(255, 215, 0, 0.2))
                   drop-shadow(-3px 0 0 rgba(255, 255, 255, 0.2));
          }
          75% {
            filter: drop-shadow(-2px 0 0 rgba(255, 215, 0, 0.15))
                   drop-shadow(2px 0 0 rgba(255, 255, 255, 0.15));
          }
        }

        @keyframes matrixRain {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(400px);
            opacity: 0;
          }
        }

        @keyframes glitchEffect {
          0%, 90%, 100% {
            transform: translateX(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translateX(-2px);
            filter: hue-rotate(90deg);
          }
          20% {
            transform: translateX(2px);
            filter: hue-rotate(180deg);
          }
          30% {
            transform: translateX(-1px);
            filter: hue-rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}
