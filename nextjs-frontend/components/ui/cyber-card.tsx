/**
 * SAA Cyber Card Component
 *
 * A reusable cyber-themed card with glass morphism, animations, and SAA brand integration.
 *
 * Features:
 * - Glass morphism background with transparency
 * - Glowing corner elements with gold accent
 * - Animated scan lines for cyber aesthetic
 * - Shimmer effect on hover
 * - Fully responsive design
 *
 * @example
 * ```tsx
 * <CyberCard title="Access Portal">
 *   <p>Your content here</p>
 * </CyberCard>
 * ```
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional title displayed at top */
  title?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom corner color (defaults to SAA gold) */
  cornerColor?: string;
  /** Enable/disable animations (default: true) */
  animated?: boolean;
}

/**
 * Cyber Card Component
 *
 * A futuristic card component with glass morphism and cyber aesthetics.
 * Automatically applies SAA brand colors and animations.
 */
export function CyberCard({
  children,
  title,
  className,
  cornerColor = '#ffd700', // SAA gold
  animated = true,
}: CyberCardProps) {
  return (
    <div
      className={cn(
        'cyber-card-container',
        'relative w-full min-h-[320px]',
        'transition-all duration-200',
        className
      )}
    >
      <div className={cn(
        'cyber-card',
        'relative h-full',
        'flex flex-col justify-center items-center',
        'rounded-lg',
        'transition-all duration-700',
        'overflow-hidden',
        // Glass morphism background
        'bg-gradient-to-br from-zinc-950/95 to-zinc-900/90',
        'backdrop-blur-xl',
        // Border and shadow
        'border border-white/15',
        'shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.1)]',
        // Grid pattern
        'bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.03)_1px,transparent_1px)]',
        'bg-[length:25px_25px]',
        // Hover effects
        'hover:scale-[1.02] hover:brightness-110',
        'group'
      )}>

        {/* Shimmer effect overlay */}
        {animated && (
          <div
            className={cn(
              'absolute inset-0 pointer-events-none',
              'bg-gradient-to-br',
              'from-white/6 via-white/14 to-white/10',
              'bg-[length:400%_400%]',
              'opacity-30 mix-blend-overlay',
              'rounded-lg',
              'animate-shimmer',
              'group-hover:opacity-80 transition-opacity duration-600'
            )}
            style={{
              animation: animated ? 'shimmer 8s ease-in-out infinite' : 'none'
            }}
          />
        )}

        {/* Glass distortion effect */}
        {animated && (
          <div
            className={cn(
              'absolute inset-0 pointer-events-none',
              'rounded-lg',
              'mix-blend-soft-light',
              'opacity-50'
            )}
            style={{
              background: `
                radial-gradient(ellipse 200% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse 100% 200% at 0% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
              `,
              filter: 'blur(0.5px)',
              animation: animated ? 'glassDistortion 12s ease-in-out infinite' : 'none'
            }}
          />
        )}

        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full p-6 box-border">

          {/* Corner brackets */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-left corner */}
            <span
              className={cn(
                'absolute top-3 left-3',
                'w-5 h-5',
                'border-l-2 border-t-2',
                'rounded-tl-lg',
                'transition-all duration-400',
                'backdrop-blur-sm',
                'group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4),inset_0_0_10px_rgba(255,215,0,0.2)]'
              )}
              style={{
                borderColor: cornerColor,
                opacity: 0.4
              }}
            />

            {/* Top-right corner */}
            <span
              className={cn(
                'absolute top-3 right-3',
                'w-5 h-5',
                'border-r-2 border-t-2',
                'rounded-tr-lg',
                'transition-all duration-400',
                'backdrop-blur-sm',
                'group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4),inset_0_0_10px_rgba(255,215,0,0.2)]'
              )}
              style={{
                borderColor: cornerColor,
                opacity: 0.4
              }}
            />

            {/* Bottom-left corner */}
            <span
              className={cn(
                'absolute bottom-3 left-3',
                'w-5 h-5',
                'border-l-2 border-b-2',
                'rounded-bl-lg',
                'transition-all duration-400',
                'backdrop-blur-sm',
                'group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4),inset_0_0_10px_rgba(255,215,0,0.2)]'
              )}
              style={{
                borderColor: cornerColor,
                opacity: 0.4
              }}
            />

            {/* Bottom-right corner */}
            <span
              className={cn(
                'absolute bottom-3 right-3',
                'w-5 h-5',
                'border-r-2 border-b-2',
                'rounded-br-lg',
                'transition-all duration-400',
                'backdrop-blur-sm',
                'group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4),inset_0_0_10px_rgba(255,215,0,0.2)]'
              )}
              style={{
                borderColor: cornerColor,
                opacity: 0.4
              }}
            />
          </div>

          {/* Scan lines */}
          {animated && (
            <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
              {/* Scan line 1 */}
              <span
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  top: '30%',
                  animation: 'scanLine 3s ease-in-out infinite'
                }}
              />

              {/* Scan line 2 */}
              <span
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  top: '60%',
                  animation: 'scanLine 3s ease-in-out infinite 1s'
                }}
              />

              {/* Scan line 3 */}
              <span
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  top: '80%',
                  animation: 'scanLine 3s ease-in-out infinite 2s'
                }}
              />
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className={cn(
              'text-2xl font-bold mb-4',
              'text-transparent bg-clip-text',
              'bg-gradient-to-r from-[#ffd700] to-[#00ff88]',
              'tracking-wider uppercase'
            )}>
              {title}
            </h3>
          )}

          {/* Content */}
          <div className="relative z-20">
            {children}
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
            filter: brightness(1);
          }
          25% {
            background-position: 100% 0%;
            filter: brightness(1.6);
          }
          50% {
            background-position: 100% 100%;
            filter: brightness(1.3);
          }
          75% {
            background-position: 0% 100%;
            filter: brightness(1.8);
          }
        }

        @keyframes glassDistortion {
          0%, 100% {
            background-position: 0% 0%, 100% 100%;
            transform: scale(1);
          }
          33% {
            background-position: 50% 100%, 0% 50%;
            transform: scale(1.02);
          }
          66% {
            background-position: 100% 50%, 50% 0%;
            transform: scale(0.98);
          }
        }

        @keyframes scanLine {
          0% {
            transform: scaleX(0);
            opacity: 0;
            filter: brightness(1);
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
            filter: brightness(1.5);
          }
          100% {
            transform: scaleX(0);
            opacity: 0;
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}

// Named export
export default CyberCard;
