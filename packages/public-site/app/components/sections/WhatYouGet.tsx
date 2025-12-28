'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { Users, DollarSign, Bot, GraduationCap, Globe } from 'lucide-react';

/**
 * What You Get with SAA Section
 * Interactive tabbed display with auto-rotation and background images
 */

const BRAND_YELLOW = '#ffd700';

const BENEFITS = [
  {
    icon: Users,
    title: "Connected Leadership",
    tabLabel: "Connected",
    description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.",
    autoAdvanceTime: 6000,
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-connected-leadership/public',
    bgAlt: 'Connected Leadership - Real estate team collaboration and support',
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    tabLabel: "Passive",
    description: "We handle the structure so you can build long-term income without relying solely on transactions.",
    autoAdvanceTime: 5000,
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-passive-income/public',
    bgAlt: 'Passive Income Infrastructure - Revenue share and wealth building',
  },
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    tabLabel: "Done-For-You",
    description: "Curated systems designed to save time, not create tech overload.",
    autoAdvanceTime: 4000,
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-done-for-you/public',
    bgAlt: 'Done-For-You Production Systems - AI tools and automation',
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    tabLabel: "Elite",
    description: "AI, social media, investing, and modern production systems, available when you need them.",
    autoAdvanceTime: 5000,
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-elite-training/public',
    bgAlt: 'Elite Training Libraries - World-class real estate education',
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    tabLabel: "Private",
    description: "Warm introductions and deal flow inside a global agent network.",
    autoAdvanceTime: 4000,
    bgImage: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-private-referrals/public',
    bgAlt: 'Private Referrals - Global agent network and collaboration',
  },
];

// Scroll reveal hook
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function WhatYouGet() {
  const [activeTab, setActiveTab] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal(0.15);
  const { ref: cardRef, isVisible: isCardVisible } = useScrollReveal(0.5); // Higher threshold for card

  const activeBenefit = BENEFITS[activeTab];
  const Icon = activeBenefit.icon;

  // Auto-advance tabs with variable timing (only if user hasn't interacted)
  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (userInteracted) return; // Stop auto-advance after user clicks
    timerRef.current = setTimeout(() => {
      setActiveTab(prev => (prev + 1) % BENEFITS.length);
    }, BENEFITS[activeTab].autoAdvanceTime);
  };

  useEffect(() => {
    // Only start auto-rotation when the card is visible (not just the section)
    if (isCardVisible && !userInteracted) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTab, isCardVisible, userInteracted]);

  const handleTabClick = (index: number) => {
    setUserInteracted(true); // Permanently disable auto-advance
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveTab(index);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 relative">
      {/* Corner fill gradients - fills the rounded corners where glass doesn't cover (z-0 = behind glass) */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at top left, #080808 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at top right, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom left, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom right, #080808 0%, transparent 70%)' }} />

      {/* 3D Glass Plate Background */}
      <div
        className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.25) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          borderBottom: '2px solid rgba(0,0,0,0.6)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 2px 4px rgba(255,255,255,0.05),
            inset 0 -2px 0 rgba(0,0,0,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 4px 12px rgba(0,0,0,0.3)
          `,
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Animated shimmer wave - subtle gradient */}
        <div
          className="absolute inset-0 glass-shimmer"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, transparent 20%, rgba(255,255,255,0.025) 35%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.025) 65%, transparent 80%, transparent 100%)',
            backgroundSize: '300% 100%',
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      <style>{`
        @keyframes whatYouGetFadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .what-you-get-animate {
          animation: whatYouGetFadeIn 0.3s ease-out forwards;
        }
        @keyframes glassShimmer {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        .glass-shimmer {
          animation: glassShimmer 30s linear infinite;
        }
      `}</style>
      <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        {/* Header */}
        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <H2>What You Get with SAA</H2>
          <p className="text-body opacity-60 mb-8">Everything below is explained in detail on our Team Value page.</p>
        </div>

        {/* Tab buttons - centered, wrap on mobile */}
        <div
          className="flex flex-wrap justify-center gap-2 pb-2 mb-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.15s',
          }}
        >
          {BENEFITS.map((benefit, i) => {
            const TabIcon = benefit.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => handleTabClick(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: isActive ? BRAND_YELLOW : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#111' : 'rgba(255,255,255,0.7)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {isActive ? (
                  <TabIcon className="w-4 h-4" />
                ) : (
                  <Icon3D><TabIcon className="w-4 h-4" /></Icon3D>
                )}
                <span className="font-heading font-medium text-sm">{benefit.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active content card with background image */}
        <div
          ref={cardRef}
          className="transition-all duration-700 mb-10 rounded-2xl border border-white/10 overflow-hidden relative h-[210px] md:h-[190px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.3s',
          }}
        >
          {/* Background image */}
          <div
            key={`bg-${activeTab}`}
            className="absolute inset-0 what-you-get-animate"
            style={{
              backgroundImage: `url(${activeBenefit.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
          {/* Content */}
          <div key={activeTab} className="what-you-get-animate relative z-10 flex flex-row items-center gap-6 h-full p-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', backdropFilter: 'blur(4px)' }}
            >
              <Icon3D><Icon className="w-8 h-8" /></Icon3D>
            </div>
            <div className="text-left flex-1">
              <h3 className="font-heading text-xl font-bold mb-2" style={{ color: BRAND_YELLOW }}>
                {activeBenefit.title}
              </h3>
              <p className="text-body text-base">{activeBenefit.description}</p>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div
          className="flex justify-center gap-2 mb-8 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.45s',
          }}
        >
          {BENEFITS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeTab ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                transform: i === activeTab ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.6s',
          }}
        >
          <CTAButton href="/exp-realty-sponsor">See the Full Value Stack</CTAButton>
        </div>
      </div>
    </section>
  );
}
