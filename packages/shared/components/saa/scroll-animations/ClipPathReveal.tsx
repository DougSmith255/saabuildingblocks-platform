'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

// Brand colors
const BRAND_YELLOW = '#ffd700';

export interface ClipPathRevealItem {
  /** Icon component to render */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Subtitle/label text */
  subtitle: string;
  /** Description text */
  description: string;
}

export interface ClipPathRevealProps {
  /** Array of items to reveal */
  items: ClipPathRevealItem[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
}

const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

/**
 * ClipPathReveal - Cards reveal as you scroll with clip-path animation
 *
 * Uses IntersectionObserver for natural scroll-based reveal animation.
 * Cards slide in alternating from left/right with opacity and scale transitions.
 *
 * @example
 * ```tsx
 * <ClipPathReveal
 *   items={[
 *     { icon: <DollarSign />, title: "Commission", subtitle: "The Foundation", description: "..." },
 *     { icon: <TrendingUp />, title: "Ownership", subtitle: "Build Equity", description: "..." },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function ClipPathReveal({
  items,
  className = '',
  header,
}: ClipPathRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState<number[]>(
    new Array(items.length).fill(0)
  );

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.reveal-card');
    if (!cards) return;

    const observers = Array.from(cards).map((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setRevealProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = entry.intersectionRatio;
              return newProgress;
            });
          });
        },
        {
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          rootMargin: '-5% 0px -5% 0px'
        }
      );
      observer.observe(card);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, [items.length]);

  return (
    <section ref={sectionRef} className={`py-16 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {header && <div className="text-center mb-12">{header}</div>}

        <div className="space-y-12">
          {items.map((item, index) => {
            const cardProgress = revealProgress[index];
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.title}
                className={`reveal-card flex flex-col md:flex-row items-center gap-6 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Icon circle */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    transform: `scale(${0.8 + cardProgress * 0.2})`,
                    opacity: 0.3 + cardProgress * 0.7,
                  }}
                >
                  {item.icon}
                </div>

                {/* Card content */}
                <div
                  className={`flex-1 p-6 rounded-2xl ${isEven ? '' : 'md:text-right'}`}
                  style={{
                    background: darkBackground,
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15`,
                    opacity: 0.4 + cardProgress * 0.6,
                    transform: `translateX(${isEven ? (1 - cardProgress) * 30 : (cardProgress - 1) * 30}px)`,
                  }}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3"
                    style={{
                      background: `${BRAND_YELLOW}22`,
                      color: BRAND_YELLOW,
                    }}
                  >
                    {item.subtitle}
                  </div>
                  <h3 className="text-h5 font-bold mb-3 text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-body leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ClipPathReveal;
