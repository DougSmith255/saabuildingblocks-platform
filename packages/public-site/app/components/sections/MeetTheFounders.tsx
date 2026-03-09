'use client';

import { useRef } from 'react';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { H1, H2 } from '@saa/shared/components/saa/headings';

const SECTION_INTRO = 'Smart Agent Alliance is led by operators, not figureheads. The leadership team is responsible for designing, maintaining, and improving the systems agents rely on every day.';
const SECTION_INTRO_COMPACT = 'Built by operators, not figureheads.';

const FOUNDERS = [
  {
    name: "Doug Smart",
    title: "Co-Founder | Systems & Infrastructure",
    bio: "Doug built SAA\u2019s systems from the ground up \u2014 this website, the agent portal, every automation and workflow agents use daily. As a top 1% eXp team builder, he believes agents deserve better tools than what most sponsors offer, so he builds them. His focus is on creating systems that actually work and showing agents what\u2019s possible when the right infrastructure is behind them.",
    bioCompact: "Full-stack developer and top 1% eXp team builder. Designed and built every system agents use - the portal, automations, marketing tools, and this website.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public",
  },
  {
    name: "Karrie Hill, JD",
    title: "Co-Founder | Training & Agent Advocacy",
    bio: "UC Berkeley Law graduate and experienced agent who built a six-figure real estate business in her first full year without cold calling or door knocking. Karrie focuses on training design, mentorship standards, and onboarding pathways \u2014 making sure agents have clear structure from day one. Her background as an attorney informs a focus on durability and getting things right.",
    bioCompact: "UC Berkeley Law graduate and eXp Certified Mentor. Built a six-figure real estate business in year one - no cold calls, no door knocking. Leads training and onboarding.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public",
  },
];

function FounderName({ name }: { name: string }) {
  return (
    <H1 style={{ fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)', marginBottom: '0.25rem' }}>
      {name}
    </H1>
  );
}

export function MeetTheFounders({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const ref = useRef<HTMLDivElement>(null);
  const isCompact = variant === 'compact';

  return (
    <GlassPanel variant="marigoldCrosshatch" noBlur className="py-[50px]">
      <section ref={ref} className="px-6 relative">
        <div className="mx-auto relative z-10" style={{ maxWidth: '1500px' }}>
        <div className="text-center mb-12">
          <H2>Meet SAA&apos;s Founders</H2>
          <p className="text-body mt-4 max-w-[800px] mx-auto opacity-80">
            {isCompact ? SECTION_INTRO_COMPACT : SECTION_INTRO}
          </p>
        </div>

        {/* Two column layout - Doug left, Karrie + CTA right */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Doug */}
          <div>
            <div
              className="p-6 md:p-8 rounded-xl text-center transition-all duration-300 h-full flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <ProfileCyberFrame size="lg" index={0}>
                <img
                  src={FOUNDERS[0].image}
                  alt={FOUNDERS[0].name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <FounderName name={FOUNDERS[0].name} />
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[0].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{isCompact ? FOUNDERS[0].bioCompact : FOUNDERS[0].bio}</p>
            </div>
          </div>

          {/* Right column - Karrie */}
          <div>
            <div
              className="p-6 md:p-8 rounded-xl text-center transition-all duration-300 h-full flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <ProfileCyberFrame size="lg" index={1}>
                <img
                  src={FOUNDERS[1].image}
                  alt={FOUNDERS[1].name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <FounderName name={FOUNDERS[1].name} />
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[1].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{isCompact ? FOUNDERS[1].bioCompact : FOUNDERS[1].bio}</p>
            </div>
          </div>
        </div>
        </div>
      </section>
    </GlassPanel>
  );
}

export default MeetTheFounders;
