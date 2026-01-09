'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

// Brand colors
const BRAND_YELLOW = '#ffd700';

export interface TextBlurRevealItem {
  /** Icon component to render */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Subtitle/label text */
  subtitle: string;
  /** Description text */
  description: string;
}

export interface TextBlurRevealProps {
  /** Array of items to reveal */
  items: TextBlurRevealItem[];
  /** Optional className for the section */
  className?: string;
  /** Optional header content */
  header?: ReactNode;
}

const darkBackground = 'linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99))';

/**
 * TextBlurReveal - Cards blur-reveal as they scroll into view
 *
 * Uses IntersectionObserver for natural scroll-based reveal animation.
 * Cards start blurred and translate up, then become sharp as they enter the viewport.
 *
 * @example
 * ```tsx
 * <TextBlurReveal
 *   items={[
 *     { icon: <DollarSign />, title: "Commission", subtitle: "The Foundation", description: "..." },
 *     { icon: <TrendingUp />, title: "Ownership", subtitle: "Build Equity", description: "..." },
 *   ]}
 *   header={<H2>Section Title</H2>}
 * />
 * ```
 */
export function TextBlurReveal({
  items,
  className = '',
  header,
}: TextBlurRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [elementProgress, setElementProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.blur-reveal');
    if (!elements) return;

    const observers = Array.from(elements).map((el) => {
      const id = el.getAttribute('data-id') || '';
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setElementProgress(prev => ({ ...prev, [id]: entry.intersectionRatio }));
          });
        },
        {
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          rootMargin: '-20% 0px -10% 0px',
        }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, [items.length]);

  const getBlur = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.max(0, 15 * (1 - p));
  };

  const getOpacity = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.min(1, p);
  };

  const getTranslateY = (id: string) => {
    const p = elementProgress[id] || 0;
    return 40 * (1 - p);
  };

  return (
    <section ref={sectionRef} className={`py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {header && <div className="text-center mb-12">{header}</div>}

        <div className="space-y-12">
          {items.map((item, index) => {
            const id = `blur-reveal-${index}`;

            return (
              <div
                key={item.title}
                className="blur-reveal max-w-2xl mx-auto"
                data-id={id}
                style={{
                  filter: `blur(${getBlur(id)}px)`,
                  opacity: getOpacity(id),
                  transform: `translateY(${getTranslateY(id)}px)`,
                }}
              >
                <div
                  className="p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6"
                  style={{
                    background: darkBackground,
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15`,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '2px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {item.icon}
                  </div>

                  <div className="text-center md:text-left">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND_YELLOW }}>
                      {item.subtitle}
                    </p>
                    <h3 className="text-h5 font-bold mb-2 text-gray-100">
                      {item.title}
                    </h3>
                    <p className="text-body text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TextBlurReveal;
