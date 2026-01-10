'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Users, DollarSign, Bot, GraduationCap, Globe } from 'lucide-react';

/**
 * What You Get with SAA Section
 * Clip-Path Reveal - Cards slide in alternating from left/right
 */

const BRAND_YELLOW = '#ffd700';
const ICON_GOLD = '#c4a94d';

const BENEFITS = [
  {
    icon: Users,
    title: "Connected Leadership and Community",
    subtitle: "Leadership",
    description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-connected-leadership/public',
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    subtitle: "Income",
    description: "We handle the structure so you can build long-term income without relying solely on transactions.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-passive-income/public',
  },
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    subtitle: "Systems",
    description: "Curated systems designed to save time, not create tech overload.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-done-for-you/public',
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    subtitle: "Training",
    description: "AI, social media, investing, and modern production systems, available when you need them.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-elite-training/public',
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    subtitle: "Referrals",
    description: "Warm introductions and deal flow inside a global agent network.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-private-referrals/public',
  },
];

export function WhatYouGet() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState<number[]>(
    new Array(BENEFITS.length).fill(0)
  );
  // Track which cards have been fully revealed
  const revealedRef = useRef<boolean[]>(new Array(BENEFITS.length).fill(false));

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.reveal-card');
    if (!cards) return;

    const observers = Array.from(cards).map((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const ratio = entry.intersectionRatio;

            // Once fully revealed (90%+), mark as revealed and keep at 1
            if (ratio >= 0.9) {
              revealedRef.current[index] = true;
            }

            // If already revealed, keep progress at 1
            if (revealedRef.current[index]) {
              setRevealProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = 1;
                return newProgress;
              });
            } else {
              setRevealProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = ratio;
                return newProgress;
              });
            }
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
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 relative">
      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        {/* Header - always visible */}
        <div className="text-center mb-12">
          <H2>What You Get with SAA</H2>
          <p className="text-body opacity-60 mt-4 max-w-2xl mx-auto">
            Smart Agent Alliance provides systems, training, income infrastructure, and collaboration through five core pillars.
          </p>
        </div>

        {/* Clip-Path Reveal Cards - 2-column grid on 1200px+ screens, stacked on smaller */}
        <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-8">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            const cardProgress = revealProgress[index];
            const isLastCard = index === BENEFITS.length - 1;

            return (
              <div
                key={benefit.title}
                className={`reveal-card flex flex-col items-center gap-4 ${isLastCard ? 'min-[1200px]:col-span-2 min-[1200px]:max-w-xl min-[1200px]:mx-auto' : ''}`}
              >
                {/* Icon circle - transparent with backdrop blur */}
                <div
                  className="w-24 h-24 rounded-full flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'rgba(10,10,10,0.25)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `3px solid ${BRAND_YELLOW}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transform: `scale(${0.8 + cardProgress * 0.2})`,
                    opacity: 0.3 + cardProgress * 0.7,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                  }}
                >
                  {/* Icon */}
                  <div className="relative z-10">
                    <Icon3D color={ICON_GOLD} size={40}>
                      <Icon className="w-10 h-10" />
                    </Icon3D>
                  </div>
                </div>

                {/* Card content - glassmorphism with backdrop blur and background image */}
                <div
                  className="w-full p-6 rounded-2xl relative overflow-hidden text-center"
                  style={{
                    background: 'rgba(10,10,10,0.3)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    opacity: 0.4 + cardProgress * 0.6,
                    transform: `translateY(${(1 - cardProgress) * 20}px)`,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                  }}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${benefit.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.25,
                    }}
                  />
                  {/* Subtitle badge */}
                  <div
                    className="relative z-10 inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3"
                    style={{
                      background: `${BRAND_YELLOW}22`,
                      color: BRAND_YELLOW,
                    }}
                  >
                    {benefit.subtitle}
                  </div>

                  <h3
                    className="relative z-10 font-heading font-bold mb-3 text-gray-100"
                    style={{
                      fontSize: 'clamp(18px, calc(16px + 0.5vw), 24px)',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="relative z-10 text-body leading-relaxed text-sm" style={{ color: '#bfbdb0' }}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA - always visible */}
        <div className="text-center mt-12">
          <CTAButton href="/exp-realty-sponsor">See the Full Value Stack</CTAButton>
        </div>
      </div>
    </section>
  );
}
