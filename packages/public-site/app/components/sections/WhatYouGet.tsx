'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Users, DollarSign, Bot, GraduationCap, Globe } from 'lucide-react';

/**
 * What You Get with SAA Section
 * Blur reveal cards that animate in as user scrolls (Variation 7 style)
 */

const BRAND_YELLOW = '#ffd700';
const ICON_GOLD = '#c4a94d';

const BENEFITS = [
  {
    icon: Users,
    title: "Connected Leadership and Community",
    description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-connected-leadership/public',
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    description: "We handle the structure so you can build long-term income without relying solely on transactions.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-passive-income/public',
  },
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    description: "Curated systems designed to save time, not create tech overload.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-done-for-you/public',
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    description: "AI, social media, investing, and modern production systems, available when you need them.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-elite-training/public',
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    description: "Warm introductions and deal flow inside a global agent network.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-private-referrals/public',
  },
];

export function WhatYouGet() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [elementProgress, setElementProgress] = useState<{ [key: string]: number }>({});
  // Track which cards have been fully revealed (stay revealed once shown)
  const revealedRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.blur-reveal');
    if (!elements) return;

    const observers = Array.from(elements).map((el) => {
      const id = el.getAttribute('data-id') || '';
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const ratio = entry.intersectionRatio;

            // Once fully revealed (95%+), mark as revealed and keep at 1
            if (ratio >= 0.95) {
              revealedRef.current[id] = true;
            }

            // If already revealed, keep progress at 1 (stay visible)
            if (revealedRef.current[id]) {
              setElementProgress(prev => ({ ...prev, [id]: 1 }));
            } else {
              setElementProgress(prev => ({ ...prev, [id]: ratio }));
            }
          });
        },
        {
          threshold: Array.from({ length: 50 }, (_, i) => i / 50),
          rootMargin: '-5% 0px -5% 0px',
        }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const getBlur = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.max(0, 12 * (1 - p));
  };

  const getOpacity = (id: string) => {
    const p = elementProgress[id] || 0;
    return Math.min(1, p);
  };

  const getTranslateY = (id: string) => {
    const p = elementProgress[id] || 0;
    return 30 * (1 - p);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 relative">
      <div className="mx-auto relative z-10" style={{ maxWidth: '1500px' }}>
        {/* Header - always visible */}
        <div className="text-center mb-12">
          <H2>What You Get with SAA</H2>
          <p className="text-body opacity-60 mt-4 max-w-2xl mx-auto">
            Smart Agent Alliance provides systems, training, income infrastructure, and collaboration through five core pillars.
          </p>
        </div>

        {/* Blur reveal cards - 2 columns on xl (1200px+), 1 column below */}
        <style>{`
          .wyg-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 1200px) {
            .wyg-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
            }
            .wyg-grid .wyg-full-width {
              grid-column: 1 / -1;
            }
          }
        `}</style>
        <div className="wyg-grid mx-auto" style={{ maxWidth: '1400px' }}>
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            const id = `saa-card-${index}`;
            const isLastCard = index === BENEFITS.length - 1;
            return (
              <div
                key={benefit.title}
                className={`blur-reveal${isLastCard ? ' wyg-full-width' : ''}`}
                data-id={id}
                style={{
                  filter: `blur(${getBlur(id)}px)`,
                  opacity: getOpacity(id),
                  transform: `translateY(${getTranslateY(id)}px)`,
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden relative h-full"
                  style={{
                    minHeight: '160px',
                  }}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${benefit.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, rgba(30,30,30,0.88) 0%, rgba(40,40,40,0.75) 50%, rgba(50,50,50,0.6) 100%)',
                    }}
                  />
                  {/* Left accent border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: BRAND_YELLOW }}
                  />
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-6 p-6">
                    <div className="flex-shrink-0">
                      <Icon3D color={ICON_GOLD} size={56}>
                        <Icon className="w-14 h-14" />
                      </Icon3D>
                    </div>
                    <div>
                      <h3
                        className="font-heading font-bold mb-2"
                        style={{
                          color: 'var(--color-heading, #f5f5f0)',
                          fontSize: 'clamp(20px, calc(18px + 0.5vw), 28px)',
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p className="text-body text-gray-300 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA - always visible, no animation */}
        <div className="text-center mt-12">
          <CTAButton href="/exp-realty-sponsor">See the Full Value Stack</CTAButton>
        </div>
      </div>
    </section>
  );
}
