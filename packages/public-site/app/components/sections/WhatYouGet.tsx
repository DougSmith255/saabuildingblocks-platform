'use client';

import { useRef } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Users, DollarSign, Bot, GraduationCap, Globe } from 'lucide-react';

/**
 * What You Get with SAA Section
 * Cards display immediately - no entrance animations
 */

const BRAND_YELLOW = '#ffd700';
const ICON_GOLD = '#c4a94d';

const BENEFITS = [
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    subtitle: "Systems",
    description: "Curated systems designed to save time, not create tech overload.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-done-for-you/public',
  },
  {
    icon: Users,
    title: "Connected Leadership and Community",
    subtitle: "Leadership",
    description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-connected-leadership/public',
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    subtitle: "Training",
    description: "AI, social media, investing, and modern production systems, available when you need them.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-elite-training/public',
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    subtitle: "Income",
    description: "We handle the structure so you can build long-term income without relying solely on transactions.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-passive-income/public',
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    subtitle: "Referral",
    description: "Warm introductions and deal flow inside a global agent network.",
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-private-referrals/public',
  },
];

export function WhatYouGet() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

        {/* Cards - no entrance animations */}
        <div className="space-y-10 md:space-y-12">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={benefit.title}
                className={`flex items-center gap-4 md:gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Icon circle - transparent with backdrop blur, smaller on mobile */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'rgba(10,10,10,0.25)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `2px solid ${BRAND_YELLOW}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Icon - responsive size */}
                  <div className="relative z-10 w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12">
                    <Icon className="w-full h-full" style={{ color: ICON_GOLD }} />
                  </div>
                </div>

                {/* Card content - glassmorphism with backdrop blur and background image */}
                <div
                  className={`flex-1 p-6 rounded-2xl relative overflow-hidden ${isEven ? '' : 'text-right'}`}
                  style={{
                    background: 'rgba(10,10,10,0.3)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid ${BRAND_YELLOW}44`,
                    boxShadow: `0 0 40px ${BRAND_YELLOW}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
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
                  {/* Title row with badge - badge on icon side, hidden below 600px */}
                  <div className={`relative z-10 flex min-[600px]:flex-row min-[600px]:items-center min-[600px]:gap-3 mb-3 ${isEven ? '' : 'min-[600px]:flex-row-reverse'}`}>
                    {/* Subtitle badge - hidden below 600px to save vertical space */}
                    <div
                      className="hidden min-[600px]:inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider w-fit"
                      style={{
                        background: `${BRAND_YELLOW}22`,
                        color: BRAND_YELLOW,
                      }}
                    >
                      {benefit.subtitle}
                    </div>
                    <h3
                      className="font-heading font-bold text-gray-100"
                      style={{
                        fontSize: 'clamp(20px, calc(18px + 0.5vw), 26px)',
                      }}
                    >
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="relative z-10 text-body leading-relaxed" style={{ color: '#bfbdb0' }}>
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
