'use client';

import { useRef } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';

const BRAND_YELLOW = '#ffd700';

const SECTION_INTRO = 'Smart Agent Alliance is led by operators, not figureheads. The leadership team is responsible for designing, maintaining, and improving the systems agents rely on every day.';

const FOUNDERS = [
  {
    name: "Doug Smart",
    title: "Co-Founder | Systems & Infrastructure",
    bio: "Doug built SAA\u2019s systems from the ground up \u2014 this website, the agent portal, every automation and workflow agents use daily. He believes agents deserve better tools than what most sponsors offer, so he builds them. His focus is on creating systems that actually work and showing agents what\u2019s possible when the right infrastructure is behind them.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public",
  },
  {
    name: "Karrie Hill, JD",
    title: "Co-Founder | Training & Agent Advocacy",
    bio: "UC Berkeley Law graduate and experienced agent who built a six-figure real estate business in her first full year without cold calling or door knocking. Karrie focuses on training design, mentorship standards, and onboarding pathways \u2014 making sure agents have clear structure from day one. Her background as an attorney informs a focus on durability and getting things right.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public",
  },
];

export function MeetTheFounders() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <GlassPanel variant="marigoldCrosshatch" noBlur className="py-[50px]">
      {/* H1-style glow animation for founder names */}
      <style>{`
        @keyframes h1GlowBreathe {
          0%, 100% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
          }
          50% {
            filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45));
          }
        }
      `}</style>
      <section ref={ref} className="px-6 relative">
        <div className="mx-auto relative z-10" style={{ maxWidth: '1500px' }}>
        {/* H2 - always visible, no animation */}
        <div className="text-center mb-12">
          <H2>Meet SAA's Founders</H2>
          <p className="text-body mt-4 max-w-[800px] mx-auto opacity-80">
            {SECTION_INTRO}
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
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <h3
                className="font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)',
                  lineHeight: 1.3,
                  color: BRAND_YELLOW,
                  transform: 'perspective(800px) rotateX(12deg)',
                  fontFeatureSettings: '"ss01" 1',
                  textShadow: `
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8),
                    0 0 0.05em #ffd700,
                    0 0 0.09em rgba(255, 215, 0, 0.8),
                    0 0 0.13em rgba(255, 215, 0, 0.55),
                    0 0 0.18em rgba(255, 179, 71, 0.35),
                    0.03em 0.03em 0 #2a2a2a,
                    0.045em 0.045em 0 #1a1a1a,
                    0.06em 0.06em 0 #0f0f0f,
                    0.075em 0.075em 0 #080808
                  `,
                  filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))',
                  animation: 'h1GlowBreathe 4s ease-in-out infinite',
                }}
              >
                {FOUNDERS[0].name}
              </h3>
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[0].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[0].bio}</p>
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
                  className="w-full h-full object-cover"
                />
              </ProfileCyberFrame>
              <h3
                className="font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-taskor), sans-serif',
                  fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)',
                  lineHeight: 1.3,
                  color: BRAND_YELLOW,
                  transform: 'perspective(800px) rotateX(12deg)',
                  fontFeatureSettings: '"ss01" 1',
                  textShadow: `
                    0 0 0.01em #fff,
                    0 0 0.02em #fff,
                    0 0 0.03em rgba(255,255,255,0.8),
                    0 0 0.05em #ffd700,
                    0 0 0.09em rgba(255, 215, 0, 0.8),
                    0 0 0.13em rgba(255, 215, 0, 0.55),
                    0 0 0.18em rgba(255, 179, 71, 0.35),
                    0.03em 0.03em 0 #2a2a2a,
                    0.045em 0.045em 0 #1a1a1a,
                    0.06em 0.06em 0 #0f0f0f,
                    0.075em 0.075em 0 #080808
                  `,
                  filter: 'drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25))',
                  animation: 'h1GlowBreathe 4s ease-in-out infinite',
                }}
              >
                {FOUNDERS[1].name}
              </h3>
              <p className="text-body text-sm opacity-60 mb-3">{FOUNDERS[1].title}</p>
              <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[1].bio}</p>
            </div>
          </div>
        </div>
        </div>
      </section>
    </GlassPanel>
  );
}

export default MeetTheFounders;
