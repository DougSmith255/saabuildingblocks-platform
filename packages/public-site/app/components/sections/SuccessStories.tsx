'use client';

import { H2 } from '@saa/shared/components/saa';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media/ProfileCyberFrame';
import { CheckCircle } from 'lucide-react';

const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

const TESTIMONIALS = [
  {
    name: 'Soomin Kim',
    title: 'Real Estate Agent',
    headline: 'From Zero Sphere to $200M+ Closed in 3 Years',
    bullets: [
      'Brand new agent with zero connections',
      '$1M+ commission in her first year',
      'Over $200M in total closed volume',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-soomin/public`,
  },
  {
    name: 'Adam Fyfe',
    title: 'Real Estate Agent',
    headline: 'Built a YouTube Channel That Generates Leads on Autopilot',
    bullets: [
      'Grew YouTube channel from 0 to 5,000+ subscribers',
      'Generates 10\u201315 inbound leads per month',
      'Closed multiple six-figure deals from YouTube',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-adam/public`,
  },
  {
    name: 'Amanda Aguiar',
    title: 'Real Estate Agent',
    headline: 'Transformed Her Brand and Doubled Her Business',
    bullets: [
      'Doubled her transaction volume in one year',
      'Built a recognizable personal brand',
      'Attracted higher-quality clients consistently',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-amanda/public`,
  },
  {
    name: 'Angie Foster',
    title: 'Real Estate Agent',
    headline: 'From Struggling to Top Producer in Her Market',
    bullets: [
      'Went from part-time to full-time in 6 months',
      'Built a consistent lead generation machine',
      'Now mentoring other agents in her brokerage',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-angie/public`,
  },
  {
    name: 'Berry Cessna',
    title: 'Real Estate Agent',
    headline: 'Introvert Who Mastered Content Marketing',
    bullets: [
      '$100K in one month with <200 subscribers',
      'Generates 20+ leads per month from social',
      'Built a team of 5 agents under his brand',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-berry/public`,
  },
  {
    name: 'Gail DeMarco',
    title: 'Real Estate Agent',
    headline: 'Proved Age Is Just a Number at 68',
    bullets: [
      '$340K closed in first 12 months in new market',
      'Saves 15+ hours per week using AI systems',
      'Built a business without 24/7 hustle',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-gail/public`,
  },
  {
    name: 'Jenny Celly',
    title: 'Real Estate Agent',
    headline: 'Built a Brand That Attracts Dream Clients',
    bullets: [
      '20 deals in 6 months with zero connections',
      'Now earning $400K+/year consistently',
      'Attracts luxury clients through premium branding',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-jenny/public`,
  },
  {
    name: 'Marty Pettiford',
    title: 'Real Estate Agent',
    headline: 'Part-Time Mom to Full-Time Success',
    bullets: [
      '$360K+/year without sacrificing family time',
      'Posts content that consistently goes viral locally',
      'Established herself as the community expert',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-marty/public`,
  },
  {
    name: 'Noah Ward',
    title: 'Real Estate Agent',
    headline: 'Youngest Top Producer at Just 19',
    bullets: [
      '$1M+ in his first year despite being \u2018too young\u2019',
      'Consistent $100K months from content leads',
      'Automated 80% of his lead nurturing process',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-noah/public`,
  },
  {
    name: 'Vane Monroe',
    title: 'Real Estate Agent & Coach',
    headline: 'International Speaker with Global Client Base',
    bullets: [
      'Transformed from local agent to international speaker',
      'Built a coaching business alongside real estate',
      'Commands premium fees for her expertise',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-vane/public`,
  },
  {
    name: 'Shane Bernal',
    title: 'Real Estate Agent',
    headline: 'Launched During Chemo, Now Cancer-Free with Leverage',
    bullets: [
      '$440K closed while battling health challenges',
      'Built systems that work even when he couldn\u2019t',
      'Now cancer-free with a business that runs smoothly',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-shane/public`,
  },
  {
    name: 'Shonnie Alridge',
    title: 'Real Estate Agent',
    headline: 'From Burned-Out to 6-Figures Annually',
    bullets: [
      'Escaped the old-school grind forever',
      'Now closing 2\u20135 deals per month consistently',
      'Works fewer hours with better results',
    ],
    image: `${CLOUDFLARE_BASE}/testimonial-shonnie/public`,
  },
];

export function SuccessStories() {
  return (
    <section id="success-stories" className="px-6 py-8 md:py-12 relative">
        <div className="mx-auto relative z-10" style={{ maxWidth: '1500px' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <H2 style={{ marginBottom: '0.75rem' }}>Success Stories</H2>
            <p className="text-body max-w-[800px] mx-auto opacity-80">
              See how agents just like you transformed their business with our proven system.
            </p>
          </div>

          {/* Testimonial Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="group rounded-xl p-5 transition-all duration-300 flex flex-col items-center text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Large profile image — hero of the card */}
                <ProfileCyberFrame size="lg" index={i}>
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </ProfileCyberFrame>

                {/* Name + title */}
                <h3
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-taskor), sans-serif',
                    fontSize: 'clamp(17px, calc(16px + 0.3vw), 20px)',
                    color: '#ffd700',
                    marginBottom: '2px',
                  }}
                >
                  {t.name}
                </h3>
                <p className="text-body opacity-50" style={{ fontSize: '11px', marginBottom: '8px' }}>{t.title}</p>

                {/* Headline */}
                <p
                  className="font-semibold"
                  style={{
                    fontFamily: 'var(--font-taskor), sans-serif',
                    fontSize: 'clamp(12px, calc(11.5px + 0.2vw), 14px)',
                    lineHeight: 1.35,
                    color: '#e5e4dd',
                    marginBottom: '8px',
                  }}
                >
                  {t.headline}
                </p>

                {/* Compact bullet points */}
                <ul className="space-y-1 flex-1 text-left w-full">
                  {t.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-baseline gap-1.5">
                      <CheckCircle
                        className="flex-shrink-0"
                        style={{ color: '#ffd700', opacity: 0.6, width: '12px', height: '12px', position: 'relative', top: '1px' }}
                      />
                      <span
                        className="text-body opacity-70"
                        style={{ fontSize: '12px', lineHeight: 1.35 }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}

export default SuccessStories;
