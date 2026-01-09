'use client';

import React, { useState, useRef, useLayoutEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Brand colors
const BRAND_YELLOW = '#ffd700';

export interface CounterAnimationStat {
  /** The target number to count up to */
  number: number;
  /** Suffix to display after the number (e.g., '+', ' Tiers') */
  suffix?: string;
  /** Label text below the number */
  label: string;
}

export interface CounterAnimationProps {
  /** Array of stat items */
  stats: CounterAnimationStat[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
  /** Whether to show the progress bar */
  showProgressBar?: boolean;
}

// Misty gold background for active stat
const mistyBackground = `
  radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
  radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
  radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
  radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
  linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)
`;
const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

/**
 * CounterAnimation - Stats grid with counting animation
 *
 * Displays statistics in a grid with animated counters that count up as you scroll.
 * Features velocity-based magnetic snap and mystic fog highlighting.
 *
 * @example
 * ```tsx
 * <CounterAnimation
 *   stats={[
 *     { number: 90000, suffix: '+', label: 'Agents Worldwide' },
 *     { number: 24, label: 'Countries' },
 *     { number: 80, suffix: '/20', label: 'Commission Split' },
 *     { number: 7, suffix: ' Tiers', label: 'Revenue Share' },
 *   ]}
 *   header={<H2>By The Numbers</H2>}
 * />
 * ```
 */
export function CounterAnimation({
  stats,
  className = '',
  header,
  showProgressBar = true,
}: CounterAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Refs for magnetic effect
  const rawProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastRawRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const totalStats = stats.length;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    isMobileRef.current = window.innerWidth < 768;

    const GRACE = isMobileRef.current ? 0 : 0.1;
    const CONTENT_RANGE = 1 - (GRACE * 2);

    // Velocity-based magnetic snap
    const animateMagnetic = () => {
      const raw = rawProgressRef.current;
      const lastRaw = lastRawRef.current;
      const currentDisplay = displayProgressRef.current;

      const instantVelocity = Math.abs(raw - lastRaw);
      velocityRef.current = velocityRef.current * 0.9 + instantVelocity * 0.1;
      lastRawRef.current = raw;

      const statStep = 1 / (totalStats - 1);
      const nearestStatIndex = Math.round(raw / statStep);
      const nearestStatProgress = Math.max(0, Math.min(1, nearestStatIndex * statStep));

      const velocityFactor = Math.min(1, velocityRef.current * 100);
      const targetProgress = nearestStatProgress * (1 - velocityFactor) + raw * velocityFactor;
      const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

      if (Math.abs(newProgress - currentDisplay) > 0.0001) {
        displayProgressRef.current = newProgress;
        setProgress(newProgress);
      }

      rafRef.current = requestAnimationFrame(animateMagnetic);
    };

    rafRef.current = requestAnimationFrame(animateMagnetic);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: statsGridRef.current,
        start: 'center 55%',
        end: '+=200%',
        pin: triggerRef.current,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self: ScrollTrigger) => {
          const mobileMultiplier = isMobileRef.current ? 2 : 1;
          let statProgress = 0;

          if (self.progress <= GRACE) {
            statProgress = 0;
          } else if (self.progress >= 1 - GRACE) {
            statProgress = 1;
          } else {
            statProgress = Math.min((self.progress - GRACE) / CONTENT_RANGE * mobileMultiplier, 1);
          }

          rawProgressRef.current = statProgress;
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [totalStats]);

  return (
    <section ref={sectionRef} className={className}>
      <div
        ref={triggerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint',
        }}
      >
        <div className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            {header && <div className="text-center mb-10">{header}</div>}

            <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat, index) => {
                const activeIndex = Math.round(progress * (totalStats - 1));
                const isActive = index === activeIndex;
                const distance = Math.abs(progress * (totalStats - 1) - index);
                const statOpacity = Math.max(0.4, 1 - distance * 0.3);
                const statScale = Math.max(0.9, 1 - distance * 0.05);

                // Animate the counter based on overall progress
                const countProgress = Math.min(1, progress * 2);
                const currentNumber = Math.floor(stat.number * countProgress);

                return (
                  <div
                    key={stat.label}
                    className="text-center p-5 rounded-2xl"
                    style={{
                      background: isActive ? mistyBackground : darkBackground,
                      border: isActive
                        ? '2px solid rgba(180,150,50,0.5)'
                        : `1px solid ${BRAND_YELLOW}44`,
                      boxShadow: isActive
                        ? '0 0 40px 8px rgba(255,200,80,0.3), 0 0 80px 16px rgba(255,180,50,0.15)'
                        : `0 0 40px ${BRAND_YELLOW}15`,
                      transform: `scale(${statScale})`,
                      opacity: statOpacity,
                      transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div
                      className="text-4xl md:text-5xl font-bold mb-2 tabular-nums"
                      style={{ color: isActive ? '#2a2a2a' : BRAND_YELLOW }}
                    >
                      {currentNumber.toLocaleString()}{stat.suffix || ''}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: isActive ? '#4a4a4a' : '#9ca3af' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3D Plasma Tube Progress Bar */}
            {showProgressBar && (
              <div className="mt-12 flex justify-center">
                <div
                  className="w-80 h-3 rounded-full overflow-hidden relative"
                  style={{
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                    border: '1px solid rgba(245, 245, 240, 0.25)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress * 100}%`,
                      background: `linear-gradient(180deg, #ffe566 0%, ${BRAND_YELLOW} 40%, #cc9900 100%)`,
                      boxShadow: `0 0 8px ${BRAND_YELLOW}, 0 0 16px ${BRAND_YELLOW}, 0 0 32px ${BRAND_YELLOW}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CounterAnimation;
