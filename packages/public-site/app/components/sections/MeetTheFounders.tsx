'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, CTAButton } from '@saa/shared/components/saa';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';

const BRAND_YELLOW = '#ffd700';

const FOUNDERS = [
  {
    name: "Doug Smart",
    title: "Co-Founder & Full-Stack Developer",
    bio: "Top 0.1% eXp team builder. Designs and builds the systems, automations, and infrastructure behind the agent portal, production workflows, and attraction tools used across the organization.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public",
  },
  {
    name: "Karrie Hill, JD",
    title: "Co-Founder & eXp Certified Mentor",
    bio: "UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public",
  },
];

function useScrollReveal(threshold = 0.15) {
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

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function MeetTheFounders() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <GlassPanel variant="marigoldCrosshatch">
      <section ref={ref} className="py-16 md:py-24 px-6 relative">
        <div className="mx-auto relative z-10" style={{ maxWidth: '1300px' }}>
        <div
          className="text-center transition-all duration-700 mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <H2>Meet the Founders</H2>
        </div>

        {/* Two column layout - Doug left, Karrie + CTA right */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Doug */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
              transitionDelay: '0.3s',
            }}
          >
            <div
              className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300 h-full flex flex-col"
              style={{
                backgroundColor: 'rgba(20,20,20,0.75)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <ProfileCyberFrame size="lg" index={0}>
                <img
                  src={FOUNDERS[0].image}
                  alt={FOUNDERS[0].name}
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <h3 className="font-heading font-bold text-lg md:text-xl mb-1" style={{ color: BRAND_YELLOW }}>{FOUNDERS[0].name}</h3>
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[0].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[0].bio}</p>
            </div>
          </div>

          {/* Right column - Karrie + CTA */}
          <div
            className="transition-all duration-700 flex flex-col gap-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transitionDelay: '0.5s',
            }}
          >
            <div
              className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300 flex-1 flex flex-col"
              style={{
                backgroundColor: 'rgba(20,20,20,0.75)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <ProfileCyberFrame size="lg" index={1}>
                <img
                  src={FOUNDERS[1].image}
                  alt={FOUNDERS[1].name}
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <h3 className="font-heading font-bold text-lg md:text-xl mb-1" style={{ color: BRAND_YELLOW }}>{FOUNDERS[1].name}</h3>
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[1].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[1].bio}</p>
            </div>

            {/* CTA inside right column */}
            <div
              className="p-6 rounded-2xl border text-center"
              style={{
                backgroundColor: 'rgba(255,215,0,0.08)',
                borderColor: 'rgba(255,215,0,0.2)',
              }}
            >
              <p className="text-body text-sm mb-4 opacity-70">Want to meet the rest of our leadership team?</p>
              <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
            </div>
          </div>
        </div>
        </div>
      </section>
    </GlassPanel>
  );
}

export default MeetTheFounders;
