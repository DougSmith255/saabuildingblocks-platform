'use client';

import { useRef } from 'react';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { H1, H2 } from '@saa/shared/components/saa/headings';

const SECTION_INTRO = 'Smart Agent Alliance is led by operators, not figureheads. The leadership team is responsible for designing, maintaining, and protecting the systems agents rely on. This is not a sales role. It is an operational one.';
const SECTION_INTRO_COMPACT = 'Built by operators, not figureheads.';

const FOUNDERS = [
  {
    name: "Doug Smart",
    title: "Co-Founder | Systems Architecture & Infrastructure",
    bio: "Doug is responsible for the technical and structural backbone of Smart Agent Alliance.",
    bioCompact: "Full-stack developer and top 1% eXp team builder. Designed and built every system agents use - the portal, automations, marketing tools, and this website.",
    bullets: [
      'Designing the agent portal and system architecture',
      'Building automation and workflow infrastructure',
      'Maintaining production and attraction systems',
      'Ensuring scalability without fragility',
    ],
    footer: 'Doug operates as a builder and steward of systems.',
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public",
  },
  {
    name: "Karrie Hill, JD",
    title: "Co-Founder | Training & Agent Advocacy",
    bio: "Karrie focuses on clarity, structure, and agent outcomes.",
    bioCompact: "UC Berkeley Law graduate and eXp Certified Mentor. Built a six-figure real estate business in year one - no cold calls, no door knocking. Leads training and onboarding.",
    bullets: [
      'Training design and updates',
      'Mentorship standards and onboarding pathways',
      'Content direction and program quality',
      'Advocating for agent-first decisions inside the model',
    ],
    footer: 'Her background as an attorney and longtime agent informs a focus on durability.',
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
          <H2 style={{ marginBottom: '0.5rem' }}>Meet the Founders</H2>
          <p className="text-body max-w-[800px] mx-auto opacity-80">
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
              {isCompact ? (
                <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[0].bioCompact}</p>
              ) : (
                <div className="text-left flex-1">
                  <p className="text-body text-sm md:text-base leading-relaxed mb-3">{FOUNDERS[0].bio}</p>
                  <p className="text-body text-sm opacity-70 mb-2">His work includes:</p>
                  <ul className="space-y-2 mb-3">
                    {FOUNDERS[0].bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-body text-sm md:text-base">
                        <span className="mt-[9px] flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 4px rgba(255,215,0,0.3)' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-body text-sm md:text-base opacity-70 italic">{FOUNDERS[0].footer}</p>
                </div>
              )}
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
              {isCompact ? (
                <p className="text-body text-sm md:text-base leading-relaxed flex-1">{FOUNDERS[1].bioCompact}</p>
              ) : (
                <div className="text-left flex-1">
                  <p className="text-body text-sm md:text-base leading-relaxed mb-3">{FOUNDERS[1].bio}</p>
                  <p className="text-body text-sm opacity-70 mb-2">Her responsibilities include:</p>
                  <ul className="space-y-2 mb-3">
                    {FOUNDERS[1].bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-body text-sm md:text-base">
                        <span className="mt-[9px] flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 4px rgba(255,215,0,0.3)' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-body text-sm md:text-base opacity-70 italic">{FOUNDERS[1].footer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>
    </GlassPanel>
  );
}

export default MeetTheFounders;
