'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { H1, H2, Tagline, CTAButton, GlassPanel, GenericCard } from '@saa/shared/components/saa';
import { MeetTheFounders } from '@/app/components/sections/MeetTheFounders';
import { SuccessStories } from '@/app/components/sections/SuccessStories';
import { GrainCard } from '@saa/shared/components/saa/cards';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { AgentCounter, TaglineCounterSuffix } from '@/app/components/AgentCounter';
import { Ban, Building2, Wrench, Shield, Settings, GraduationCap, Users, Layers, Rocket, Link2, LifeBuoy, TrendingUp, UserCircle, Video, Megaphone, UserPlus, Download, Handshake, Sparkles, type LucideIcon } from 'lucide-react';

// Counter animation (scramble effect) - loads after initial paint
const CounterAnimation = dynamic(
  () => import('@/app/components/CounterAnimation').then(mod => ({ default: mod.CounterAnimation }))
);
// Portal recording videos are displayed inside a phone mockup frame.
// Video files: scripts/portal-recordings/recordings/
// Phase 4: Upload to Cloudflare Stream and add videoId to each FEATURE_GROUP.

// ============================================================================
// SECTION 1 CONTENT — word for word
// ============================================================================

const SAA_DESCRIPTION =
  'Smart Agent Alliance (SAA) is a sponsor organization inside eXp Realty \u2014 built to deliver real systems, training, income infrastructure, and community to independent agents.';

const SAA_NOT_STATEMENTS = [
  'This is not a brokerage.',
  'This is not a production team.',
];

const SPONSORSHIP_INTRO =
  'At eXp, agents join the brokerage directly and name a sponsor on their application. That sponsor sits within a broader seven-level upline structure.';

const SPONSORSHIP_LEAD = 'Sponsor support varies widely.';

const SPONSORSHIP_BULLETS = [
  'Many sponsors provide little or no ongoing value.',
  'Some operate informal groups.',
  'Very few build durable infrastructure.',
];

// ============================================================================
// SHARED: Panel content renderers
// ============================================================================

function SAAContent() {
  return (
    <div className="space-y-4">
      <p className="text-body" style={{ color: '#dcdbd5' }}>{SAA_DESCRIPTION}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        {SAA_NOT_STATEMENTS.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-body"
            style={{
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              color: '#e8a0a0',
            }}
          >
            <Ban size={13} style={{ color: '#ff5050', flexShrink: 0 }} />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function SponsorshipContent() {
  return (
    <div className="space-y-4">
      <p className="text-body" style={{ color: '#dcdbd5' }}>{SPONSORSHIP_INTRO}</p>
      <p className="text-body" style={{ color: '#b0d4e8' }}>{SPONSORSHIP_LEAD}</p>
      <ul className="space-y-2 pl-1">
        {SPONSORSHIP_BULLETS.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-body" style={{ color: '#dcdbd5' }}>
            <span
              className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full"
              style={{
                background: 'rgba(0,191,255,0.5)',
                boxShadow: '0 0 6px rgba(0,191,255,0.3)',
              }}
            />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

const PANELS = [
  { id: 'saa', label: 'What Smart Agent Alliance Is', shortLabel: 'What SAA Is', color: '#ffd700', theme: 'gold' as const },
  { id: 'sponsorship', label: 'How Sponsorship Works at eXp', shortLabel: 'Sponsorship', color: '#00bfff', theme: 'blue' as const },
];

// ============================================================================
// SECTION 2 CONTENT — word for word
// ============================================================================

const SECTION2_HEADING = 'Why SAA Is Different';
const SECTION2_INTRO = 'At eXp Realty, sponsors are not required to provide any ongoing support \u2014 SAA was built differently.';
const SECTION2_SUBHEADING = '';

const DIFFERENTIATORS = [
  { icon: Building2, text: 'Built as a sponsor organization, not an individual sponsor' },
  { icon: Wrench, text: 'Delivers real systems, training, and income infrastructure' },
  { icon: Shield, text: 'No commission splits or loss of control' },
];

const FINANCIAL_LINES = [
  'Agents pay Smart Agent Alliance nothing.',
  'We are compensated from eXp\'s company revenue only when agents close transactions.',
];
const FINANCIAL_TAGLINE = 'When our agents succeed, we succeed.';

const ORG_HEADING = 'Because Smart Agent Alliance is built as an organization:';
const ORG_BENEFITS = [
  { icon: Settings, text: 'Systems are designed, maintained, and updated' },
  { icon: GraduationCap, text: 'Training is structured, repeatable, and current' },
  { icon: Users, text: 'Community is active and intentional' },
  { icon: Layers, text: 'Infrastructure exists independently of any single leader' },
];

// ============================================================================
// SECTION 3 CONTENT — "What You Get Inside SAA" (Interactive Portal Showcase)
// ============================================================================

interface PortalMenuItem {
  icon: LucideIcon;
  label: string;
  groupIndex: number;
}

interface FeatureGroup {
  id: string;
  heading: string;
  description: string;
  bullets: string[];
  videoSrc?: string;           // Local .webm path (legacy)
  streamId?: string;           // Cloudflare Stream video ID
  duration?: number;           // Video duration in seconds
  posterUrl?: string;          // Video thumbnail
}

// Sidebar items mirror the real agent portal navigation
const SIDEBAR_ITEMS: PortalMenuItem[] = [
  { icon: Rocket, label: 'Onboarding', groupIndex: 0 },
  { icon: Download, label: 'Download App', groupIndex: 0 },
  { icon: TrendingUp, label: 'Analytics', groupIndex: 1 },
  { icon: Link2, label: 'Link Page', groupIndex: 1 },
  { icon: UserCircle, label: 'Agent Attraction', groupIndex: 1 },
  { icon: Video, label: 'Team Calls', groupIndex: 2 },
  { icon: LifeBuoy, label: 'Get Support', groupIndex: 3 },
  { icon: Megaphone, label: 'Templates', groupIndex: 4 },
  { icon: Users, label: 'Landing Pages', groupIndex: 4 },
  { icon: UserPlus, label: 'New Agents', groupIndex: 4 },
  { icon: GraduationCap, label: 'Elite Courses', groupIndex: 5 },
];

const STREAM_BASE = 'https://customer-2twfsluc6inah5at.cloudflarestream.com';
const WALKTHROUGH_AUDIO_URL = 'https://assets.saabuildingblocks.com/Team%20Value%20Audio%202.0.MP3';

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'onboarding',
    heading: 'Day One, You\u2019re Guided',
    description: 'A step-by-step checklist so you\u2019re never guessing what to do next.',
    bullets: [
      'Activate your Okta account, attend an eXp World Tour, handle broker tasks',
      'Choose your CRM, set up your link page and attraction page',
      'Every step links directly to where you need to go \u2014 check it off and move on',
      'Book a free one-on-one strategy session with Karrie right from the portal',
      'Download the app straight to your home screen for quick access anytime',
    ],
    streamId: '4ef314e003e5ed900f60292ffe9d372a',
    duration: 32.7,
  },
  {
    id: 'system',
    heading: 'Your Digital Hub',
    description: 'One link for your entire business \u2014 with built-in attraction and analytics.',
    bullets: [
      'Your own link page \u2014 one link for your YouTube, socials, contact info, listings, and marketing',
      'Fully customizable profile, colors, and buttons \u2014 put it in your bio, email signature, or business card',
      'Built-in agent attraction funnel \u2014 a branded page that presents eXp and lets people request to join your team automatically',
      'Passive agent attraction that works alongside your production links \u2014 no pitching required',
      'Analytics dashboard tracking every button click, page view, and conversion in one place',
    ],
    streamId: '4675bd85413a19bdce639680c4894da1',
    duration: 71.0,
  },
  {
    id: 'team-calls',
    heading: 'You\u2019re Never Alone',
    description: 'Weekly mastermind calls with strategies you can apply the same week.',
    bullets: [
      'Monday \u2014 Connor Steinbrook\u2019s mindset mastermind for the mental game behind building a business',
      'Tuesday \u2014 Mike Sherrard\u2019s production-focused mastermind with real strategies for generating business',
      'Wednesday \u2014 Women\u2019s mastermind',
      'Thursday \u2014 Leaders call',
      'Zoom links right in the portal, plus archives of past sessions to catch up anytime',
    ],
    streamId: 'a3ce2f36ee12578f6b9275e85eee2f8b',
    duration: 26.5,
  },
  {
    id: 'support',
    heading: 'Help Is One Click Away',
    description: 'Broker rooms, leadership contacts, and team support \u2014 all one click away.',
    bullets: [
      'eXp Expert Care \u2014 eXp World room link plus direct phone and email',
      'Broker support \u2014 direct link to your state\u2019s broker room in eXp World for contracts, compliance, and transactions',
      'SAA support \u2014 email the team, or text Doug or Karrie for urgent portal issues',
      'Wolf Pack support \u2014 Mike and Connor\u2019s contact info for courses, Skool, and Wolf Pack questions',
    ],
    streamId: '5e5756cde89be0345578a85e614ff0f8',
    duration: 44.7,
  },
  {
    id: 'templates',
    heading: 'Launch-Ready Resources',
    description: 'Skip the design work \u2014 templates, landing pages, and scripts ready to customize and launch.',
    bullets: [
      'Full library of professionally designed Canva templates \u2014 social posts, email graphics, flyers, thumbnails',
      'Organized by category with light and dark theme options \u2014 click, customize in Canva, done',
      'Landing pages section with video walkthrough for building lead capture pages in BoldTrail',
      'Ready-made landing page examples you can copy, plus email campaign setup',
      'New agents section with resource library \u2014 FSBO phone scripts, production guides, and more',
    ],
    streamId: '41aca33121f42ad6f6e9e681cfb1ab81',
    duration: 42.3,
  },
  {
    id: 'training',
    heading: 'Training That Builds Businesses',
    description: 'Five premium courses covering production, content, investing, AI, and attraction \u2014 all included.',
    bullets: [
      'Social Agent Academy PRO \u2014 generate inbound leads through content and visibility',
      'Investor Army \u2014 house flipping, raising capital, and finding off-market deals',
      'AI Agent Accelerator \u2014 automate your content, follow-ups, and admin tasks',
      'Master Agent Attraction \u2014 build your downline through revenue share',
      'Skool community where everything comes together \u2014 each course is a click away',
    ],
    streamId: '680066ad9eb3c563f4152782876a2da0',
    duration: 32.1,
  },
];


// ============================================================================
// VALUE SECTION 1 — "Launch Your Business With Clarity From Day One"
// ============================================================================

function BrowserMockup({ children, url = 'smartagentalliance.com/agent-portal' }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="w-full rounded-xl overflow-hidden" style={{
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{
        background: 'linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(22,22,22,0.98) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="flex-1 mx-2 px-3 py-1 rounded-md text-center" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'monospace',
        }}>
          {url}
        </div>
      </div>
      <div style={{ background: '#0a0a0a' }}>
        {children}
      </div>
    </div>
  );
}

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div
      data-placeholder="true"
      className="w-full flex items-center justify-center"
      style={{
        aspectRatio: '16/10',
        background: 'linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(20,20,18,1) 100%)',
        backgroundImage: `
          linear-gradient(rgba(255,215,0,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,215,0,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '14px', fontFamily: 'monospace' }}>
        {label}
      </span>
    </div>
  );
}

function ValueSection1_Launch() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes vs1FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs1FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Two-column: mockup left, card right */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-0">
          {/* Card side (right on desktop) */}
          <div className="w-full lg:w-[35%] relative z-10">
            <GenericCard padding="lg">
              <h3 className="text-h3" style={{ marginBottom: '1rem' }}>
                Launch Your Business With Clarity From Day One
              </h3>
              <div className="space-y-5">
                <p className="text-body">
                  Structured onboarding designed to move you from joining to operating without confusion or delay.
                </p>
                <ul className="space-y-4">
                  {[
                    'Onboarding dashboard',
                    'Step-by-step setup checklist',
                    '1-on-1 strategy session',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-body">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-body pt-1" style={{ color: '#9a9a9a', fontStyle: 'italic' }}>
                  Move into production quickly with guided systems that remove guesswork from your launch.
                </p>
              </div>
            </GenericCard>
          </div>

          {/* Mockup side (left on desktop) — oversized, overlaps behind the card */}
          <div className="w-full lg:w-[75%] lg:-mr-[10%] flex items-center justify-center">
            <BrowserMockup url="smartagentalliance.com/agent-portal">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/portal-onboarding-screenshot/desktop2x"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/portal-onboarding-screenshot/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/portal-onboarding-screenshot/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/portal-onboarding-screenshot/desktop2x 2160w
                "
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                alt="Agent Portal Onboarding Dashboard"
                width={2160}
                height={1117}
                className="w-full h-auto block"
                loading="lazy"
              />
            </BrowserMockup>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// VALUE SECTION 2 — "Generate Business with Done-For-You Marketing Assets"
// ============================================================================

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
      borderRadius: 'clamp(12px, 2vw, 20px)',
      padding: 'clamp(3px, 0.4vw, 6px)',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      width: '100%',
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{
        width: '32px',
        height: '3px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '2px',
        margin: '0 auto 3px',
      }} />
      {/* Screen */}
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#0a0a0a',
        aspectRatio: '9/16',
      }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        width: '40px',
        height: '2px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '2px',
        margin: '3px auto 0',
      }} />
    </div>
  );
}

function PhoneScreenPlaceholder({ label }: { label: string }) {
  return (
    <div
      data-placeholder="true"
      className="w-full flex items-center justify-center"
      style={{
        aspectRatio: '9/16',
        background: 'linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(20,20,18,1) 100%)',
        backgroundImage: `
          linear-gradient(rgba(255,215,0,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,215,0,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '12px 12px',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '9px', fontFamily: 'monospace', textAlign: 'center', padding: '4px' }}>
        {label}
      </span>
    </div>
  );
}

const PHONE_FAN_ITEMS = [
  'Landing Page',
  'Link Page',
  'Analytics',
  'Templates',
];

function ValueSection2_Marketing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes vs2FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vs2-phone-fan { aspect-ratio: 1/1; }
        .vs2-phone-item { width: 40%; }
        @media (min-width: 640px) {
          .vs2-phone-fan { aspect-ratio: 16/10; }
          .vs2-phone-item { width: 28%; }
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs2FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Two-column: card left, phone fan right */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Card side (left on desktop) */}
          <div className="w-full lg:w-[35%] relative z-10">
            <GenericCard padding="lg">
              <h3 className="text-h3" style={{ marginBottom: '1rem' }}>
                Generate Business with Done-For-You Marketing Assets
              </h3>
              <div className="space-y-5">
                <p className="text-body">
                  Move into active marketing without building all pages or materials from scratch.
                </p>
                <ul className="space-y-4">
                  {[
                    'Branded Link Page system',
                    'Lead capture landing pages',
                    'eXp-ready marketing templates',
                    'Performance analytics dashboard',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-body">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-body pt-1" style={{ color: '#9a9a9a', fontStyle: 'italic' }}>
                  Everything works together to drive exposure, leads, and measurable results.
                </p>
              </div>
            </GenericCard>
          </div>

          {/* Phone fan (right on desktop) — oversized, overlaps behind the card */}
          <div className="w-full lg:w-[75%] lg:-ml-[10%] flex items-center justify-center">
            <div className="relative w-full vs2-phone-fan">
              {PHONE_FAN_ITEMS.map((label, i) => {
                const count = PHONE_FAN_ITEMS.length;
                const mid = (count - 1) / 2;
                const offset = i - mid;
                const rotate = offset * 6;
                const leftPercent = 50 + offset * 14;
                const verticalNudge = Math.abs(offset) * 2;
                return (
                  <div
                    key={i}
                    className="absolute vs2-phone-item"
                    style={{
                      left: `${leftPercent}%`,
                      top: '50%',
                      transform: `translateX(-50%) translateY(calc(-50% + ${verticalNudge}%)) rotate(${rotate}deg)`,
                      transformOrigin: 'bottom center',
                      zIndex: count - Math.abs(Math.round(offset)),
                    }}
                  >
                    <PhoneMockup>
                      {label === 'Landing Page' ? (
                        <img
                          src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-landing-page-phone-mockup/desktop"
                          alt="SAA Landing Page"
                          width={810}
                          height={1440}
                          className="w-full h-full block object-cover"
                          loading="lazy"
                        />
                      ) : label === 'Link Page' ? (
                        <img
                          src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-link-page-phone-mockup/desktop"
                          alt="SAA Link Page"
                          width={810}
                          height={1440}
                          className="w-full h-full block object-cover"
                          loading="lazy"
                        />
                      ) : label === 'Analytics' ? (
                        <img
                          src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-analytics-phone-mockup/desktop"
                          alt="SAA Analytics Dashboard"
                          width={810}
                          height={1440}
                          className="w-full h-full block object-cover"
                          loading="lazy"
                        />
                      ) : label === 'Templates' ? (
                        <img
                          src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-templates-phone-mockup/desktop"
                          alt="SAA Marketing Templates"
                          width={810}
                          height={1440}
                          className="w-full h-full block object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <PhoneScreenPlaceholder label={label} />
                      )}
                    </PhoneMockup>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// VALUE SECTION 3 — "Elite On-Demand Training" (Bento Grid)
// ============================================================================

const TRAINING_PROGRAMS = [
  {
    title: 'SAA Pro',
    description: 'Generate leads through content and visibility. Used by thousands of agents, updated annually, with weekly live implementation calls.',
    icon: GraduationCap,
    featured: true,
    colSpan: 2,
  },
  {
    title: 'Personal Branding',
    description: 'Build a personal brand that attracts clients and opportunities consistently.',
    icon: UserCircle,
    featured: false,
    colSpan: 1,
  },
  {
    title: 'Paid Ads',
    description: 'Set up paid ads correctly, avoid common mistakes, and know when ads make sense.',
    icon: Megaphone,
    featured: false,
    colSpan: 1,
  },
  {
    title: 'Google Business',
    description: 'Drive local visibility and inbound leads through an optimized Google Business Profile.',
    icon: Building2,
    featured: false,
    colSpan: 1,
  },
  {
    title: 'Master Attraction',
    description: 'Attract agents into your downline using a structured, compliant approach.',
    icon: UserPlus,
    featured: false,
    colSpan: 1,
  },
  {
    title: 'Investor Agent',
    description: 'Structure investor conversations correctly and avoid mistakes that slow or derail deals.',
    icon: Handshake,
    featured: false,
    colSpan: 1,
  },
  {
    title: 'AI Accelerator',
    description: 'Automate content creation, follow-ups, listing prep, and admin workflows.',
    icon: Sparkles,
    featured: true,
    colSpan: 2,
  },
  {
    title: 'Agent Checklists',
    description: 'Structured guides for buyer agents and listing agents covering every step from first client meeting through closing.',
    icon: Download,
    featured: false,
    colSpan: 3,
  },
];

function ValueSection3_Training() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes vs3FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs3FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Intro text */}
        <GenericCard padding="lg" style={{ marginBottom: 'clamp(24px, 4vw, 40px)' }}>
          <h3 className="text-h3" style={{ marginBottom: '0.5rem' }}>
            Elite On-Demand Training
          </h3>
          <p className="text-body" style={{ color: '#ffd700', fontFamily: 'var(--font-taskor, sans-serif)', fontSize: 'clamp(14px, 1.8vw, 17px)', fontWeight: 600, marginBottom: '0.75rem' }}>
            Generate business faster with proven systems.
          </p>
          <p className="text-body">
            Training programs that help agents generate leads, stay current, and skip trial-and-error.
          </p>
        </GenericCard>

        {/* Bento grid — 3 cols on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TRAINING_PROGRAMS.map((program, i) => {
            const IconComp = program.icon;
            if (program.featured) {
              return (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden ${program.colSpan === 2 ? 'md:col-span-2' : ''}`}
                  style={{
                    aspectRatio: '1.75 / 1',
                    background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                    border: '1px solid rgba(255,215,0,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Featured card image */}
                  {program.title === 'SAA Pro' ? (
                    <img
                      src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-social-agent-academy/desktop"
                      alt="Social Agent Academy Pro"
                      width={1200}
                      height={686}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : program.title === 'AI Accelerator' ? (
                    <img
                      src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-ai-agent-accelerator/desktop"
                      alt="AI Agent Accelerator"
                      width={1200}
                      height={686}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComp size={48} style={{ color: 'rgba(255,215,0,0.12)' }} />
                    </div>
                  )}
                  {/* Title + description overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5" style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)',
                  }}>
                    <h4 style={{
                      fontFamily: 'var(--font-taskor, sans-serif)',
                      fontSize: 'clamp(16px, 2vw, 20px)',
                      fontWeight: 600,
                      color: '#e5e4dd',
                      marginBottom: '0.35rem',
                    }}>
                      {program.title}
                    </h4>
                    <p className="text-body" style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: '#b0b0a8' }}>
                      {program.description}
                    </p>
                  </div>
                </div>
              );
            }

            // Icon cards
            // Check if this card sits next to a featured card (stretched tall)
            const isAdjacentToFeatured = program.title === 'Personal Branding' || program.title === 'Investor Agent';

            return (
              <div
                key={i}
                className={`relative rounded-xl p-4 sm:p-5 overflow-hidden ${program.colSpan === 3 ? 'md:col-span-3' : ''}`}
                style={{
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
              >
                {/* Large decorative background icon for tall cards */}
                {isAdjacentToFeatured && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <IconComp size={140} style={{ color: 'rgba(255,215,0,0.04)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{
                      background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,215,0,0.06) 0%, transparent 70%)',
                    }} />
                  </div>
                )}
                <div className="flex items-start gap-3 relative">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))',
                    border: '1px solid rgba(255,215,0,0.15)',
                  }}>
                    <IconComp size={18} style={{ color: '#ffd700' }} />
                  </div>
                  <div>
                    <h4 style={{
                      fontFamily: 'var(--font-taskor, sans-serif)',
                      fontSize: 'clamp(14px, 1.6vw, 16px)',
                      fontWeight: 600,
                      color: '#e5e4dd',
                      marginBottom: '0.25rem',
                    }}>
                      {program.title}
                    </h4>
                    <p className="text-body" style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: '#b0b0a8' }}>
                      {program.description}
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


// ============================================================================
// VALUE SECTION 4 — "Agent Attraction Infrastructure" (Browser + Zoom Mockup)
// ============================================================================

function ZoomMockup() {
  const participants = [
    { initials: 'DS', color: '#4A90D9' },
    { initials: 'KS', color: '#D94A8C' },
    { initials: 'MS', color: '#4AD9A5' },
    { initials: 'JR', color: '#D9A54A' },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      background: '#1a1a1a',
    }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2" style={{
        background: 'linear-gradient(180deg, #2d2d2d 0%, #232323 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
            Agent Prospect Meeting
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            <Users size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
            47
          </span>
          <button type="button" className="px-2 py-0.5 rounded" style={{
            background: '#e53935',
            fontSize: '10px',
            color: '#fff',
            border: 'none',
            cursor: 'default',
          }}>
            End
          </button>
        </div>
      </div>

      {/* Main presenter area */}
      <div className="relative" style={{
        aspectRatio: '16/9',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}>
        {/* Presenter name label */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded" style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}>
          <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'monospace' }}>
            Doug Smart
          </span>
        </div>
        {/* Presenter avatar placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))',
            border: '2px solid rgba(255,215,0,0.25)',
          }}>
            <span style={{ fontSize: '20px', color: 'rgba(255,215,0,0.6)', fontFamily: 'var(--font-taskor, sans-serif)', fontWeight: 600 }}>DS</span>
          </div>
        </div>
      </div>

      {/* Participant thumbnails row */}
      <div className="flex gap-1.5 px-2 py-2" style={{
        background: '#1a1a1a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {participants.map((p, i) => (
          <div key={i} className="flex-1 rounded-md flex items-center justify-center" style={{
            aspectRatio: '16/9',
            background: `linear-gradient(135deg, ${p.color}22, ${p.color}11)`,
            border: `1px solid ${p.color}33`,
          }}>
            <span style={{ fontSize: '10px', color: p.color, fontWeight: 600, fontFamily: 'monospace' }}>
              {p.initials}
            </span>
          </div>
        ))}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-4 px-3 py-2" style={{
        background: '#232323',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Mic */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        {/* Video */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
        {/* Share screen */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
        {/* Chat */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {/* End call */}
        <div className="w-7 h-5 rounded-full flex items-center justify-center" style={{ background: '#e53935' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
            <line x1="1" x2="23" y1="1" y2="23" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ValueSection4_Attraction() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes vs4FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs4FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Two-column: mockups left, card right — mirrors Section 1 (flex-row-reverse) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-0">
          {/* Card side (right on desktop) */}
          <div className="w-full lg:w-[35%] relative z-20">
            <GenericCard padding="lg">
              <h3 className="text-h3" style={{ marginBottom: '1rem' }}>
                Agent Attraction Infrastructure
              </h3>
              <div className="space-y-5">
                <p className="text-body" style={{ color: '#ffd700', fontFamily: 'var(--font-taskor, sans-serif)', fontSize: 'clamp(14px, 1.8vw, 17px)', fontWeight: 600 }}>
                  Build passive revenue share income.
                </p>
                <p className="text-body">
                  Participation is optional, compliant, and designed for when and if an agent chooses.
                </p>
                <ul className="space-y-4">
                  {[
                    'Branded agent attraction webpage',
                    'Long-term automated nurture systems',
                    'Leadership hosted calls for your prospects',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-body">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GenericCard>
          </div>

          {/* Mockup side (left on desktop) — stacked/overlapping composition */}
          <div className="w-full lg:w-[75%] lg:-mr-[10%] flex items-center justify-center">
            <div className="relative w-full">
              {/* Browser mockup — main */}
              <BrowserMockup url="smartagentalliance.com/Jane-Smith">
                <img
                  src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-attraction-page-screenshot/desktop2x"
                  srcSet="
                    https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-attraction-page-screenshot/mobile 640w,
                    https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-attraction-page-screenshot/tablet 1024w,
                    https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-attraction-page-screenshot/desktop2x 1600w
                  "
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  alt="SAA Agent Attraction Page"
                  width={1600}
                  height={869}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </BrowserMockup>
              {/* Zoom mockup — overlapping bottom-right */}
              <div className="absolute bottom-[-8%] right-[-4%] w-[45%] sm:w-[40%] z-10">
                <ZoomMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// VALUE SECTION 5 — "Private Referrals & Global Collaboration" (WhatsApp Mockup)
// ============================================================================

function WhatsAppChat() {
  const messages = [
    { sender: 'Sarah M.', text: 'Looking for a great agent in Austin for a relocating buyer', time: '10:42 AM', sent: false },
    { sender: 'Jason R.', text: "I've got you — DM sent!", time: '10:43 AM', sent: false },
    { sender: 'Emily T.', text: 'Anyone have an investor-friendly agent in Miami?', time: '10:51 AM', sent: false },
    { sender: 'You', text: 'Yes! Just connected you', time: '10:52 AM', sent: true },
  ];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0b141a' }}>
      {/* WhatsApp header */}
      <div className="flex items-center" style={{
        gap: 'clamp(6px, 0.8vw, 10px)',
        padding: 'clamp(6px, 0.8vw, 12px) clamp(8px, 1vw, 16px)',
        background: '#1f2c34',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <svg style={{ width: 'clamp(10px, 1.2vw, 16px)', height: 'clamp(10px, 1.2vw, 16px)' }} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <div className="rounded-full flex items-center justify-center" style={{
          width: 'clamp(20px, 2.5vw, 32px)',
          height: 'clamp(20px, 2.5vw, 32px)',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
        }}>
          <Users style={{ width: 'clamp(9px, 1.2vw, 16px)', height: 'clamp(9px, 1.2vw, 16px)', color: '#fff' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 'clamp(9px, 1.1vw, 14px)', color: '#e5e4dd', fontWeight: 600, fontFamily: 'var(--font-taskor, sans-serif)' }}>
            Referrals - Texas
          </div>
          <div style={{ fontSize: 'clamp(7px, 0.8vw, 11px)', color: 'rgba(255,255,255,0.4)' }}>
            3700+ members
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden" style={{
        padding: 'clamp(8px, 1vw, 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(6px, 0.8vw, 12px)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%]" style={{
              background: msg.sent ? '#005c4b' : '#1f2c34',
              borderRadius: msg.sent ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
              padding: 'clamp(4px, 0.6vw, 10px) clamp(6px, 0.8vw, 12px)',
            }}>
              {!msg.sent && (
                <div style={{ fontSize: 'clamp(7px, 0.9vw, 12px)', color: '#ffd700', fontWeight: 600, marginBottom: '1px' }}>
                  {msg.sender}
                </div>
              )}
              <p style={{ fontSize: 'clamp(8px, 1vw, 13px)', color: '#e5e4dd', lineHeight: '1.35', margin: 0 }}>
                {msg.text}
              </p>
              <div style={{ fontSize: 'clamp(6px, 0.7vw, 10px)', color: 'rgba(255,255,255,0.35)', textAlign: 'right', marginTop: '2px' }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center" style={{
        gap: 'clamp(6px, 0.8vw, 10px)',
        padding: 'clamp(6px, 0.8vw, 10px) clamp(6px, 0.8vw, 12px)',
        background: '#1f2c34',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="flex-1 rounded-full" style={{
          padding: 'clamp(4px, 0.5vw, 8px) clamp(8px, 1vw, 14px)',
          background: '#2a3942',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontSize: 'clamp(7px, 0.9vw, 12px)', color: 'rgba(255,255,255,0.25)' }}>Type a message</span>
        </div>
        <div className="rounded-full flex items-center justify-center" style={{
          width: 'clamp(20px, 2.5vw, 32px)',
          height: 'clamp(20px, 2.5vw, 32px)',
          background: '#25D366',
        }}>
          <svg style={{ width: 'clamp(8px, 1vw, 14px)', height: 'clamp(8px, 1vw, 14px)' }} viewBox="0 0 24 24" fill="#fff">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ValueSection5_Referrals() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12" style={{ paddingTop: 'clamp(0px, 3vw, 60px)' }}>
      <style>{`
        @keyframes vs5FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs5FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Two-column: card left, phone mockup right — mirrors Section 2 */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Card side (left on desktop) */}
          <div className="w-full lg:w-[60%] relative z-10">
            <GenericCard padding="lg">
              <h3 className="text-h3" style={{ marginBottom: '1rem' }}>
                Private Referrals &amp; Global Collaboration
              </h3>
              <div className="space-y-5">
                <p className="text-body" style={{ color: '#ffd700', fontFamily: 'var(--font-taskor, sans-serif)', fontSize: 'clamp(14px, 1.8vw, 17px)', fontWeight: 600 }}>
                  Turn your relationships into consistent referral opportunities.
                </p>
                <p className="text-body">
                  This network is intentionally relationship-based, not volume-driven.
                </p>
                <ul className="space-y-4">
                  {[
                    'Member-only WhatsApp referral groups',
                    'City, state, and country-specific agent matching',
                    'Collaboration across U.S. and international markets',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-body">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GenericCard>
          </div>

          {/* Phone mockup side (right on desktop) — with orbital animation */}
          <div className="w-full lg:w-[50%] lg:-ml-[10%] flex items-center justify-center">
            <style>{`
              @keyframes vs5Orbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes vs5Orbit2 { from { transform: rotate(120deg); } to { transform: rotate(480deg); } }
              @keyframes vs5Orbit3 { from { transform: rotate(240deg); } to { transform: rotate(600deg); } }
              @keyframes vs5DotPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
            `}</style>
            <div className="relative w-[85%] sm:w-[70%] md:w-[55%] lg:w-[80%]" style={{ aspectRatio: '1' }}>
              {/* Orbital ring 1 */}
              <div className="absolute inset-[5%] rounded-full pointer-events-none" style={{
                border: '1px solid rgba(255,215,0,0.08)',
                animation: 'vs5Orbit1 20s linear infinite',
              }}>
                <div className="absolute" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 12px rgba(255,215,0,0.6)', animation: 'vs5DotPulse 3s ease-in-out infinite' }} />
                </div>
                <div className="absolute" style={{ bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366', boxShadow: '0 0 10px rgba(37,211,102,0.5)', animation: 'vs5DotPulse 3s ease-in-out 1.5s infinite' }} />
                </div>
              </div>
              {/* Orbital ring 2 */}
              <div className="absolute inset-[-2%] rounded-full pointer-events-none" style={{
                border: '1px dashed rgba(37,211,102,0.1)',
                animation: 'vs5Orbit2 28s linear infinite',
              }}>
                <div className="absolute" style={{ top: '50%', right: '0%', transform: 'translate(50%, -50%)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00bfff', boxShadow: '0 0 10px rgba(0,191,255,0.5)', animation: 'vs5DotPulse 4s ease-in-out 0.5s infinite' }} />
                </div>
                <div className="absolute" style={{ top: '50%', left: '0%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 8px rgba(255,215,0,0.4)', animation: 'vs5DotPulse 4s ease-in-out 2s infinite' }} />
                </div>
              </div>
              {/* Orbital ring 3 */}
              <div className="absolute inset-[-8%] rounded-full pointer-events-none" style={{
                border: '1px solid rgba(0,191,255,0.06)',
                animation: 'vs5Orbit3 35s linear infinite',
              }}>
                <div className="absolute" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#25D366', boxShadow: '0 0 8px rgba(37,211,102,0.4)', animation: 'vs5DotPulse 3.5s ease-in-out 1s infinite' }} />
                </div>
                <div className="absolute" style={{ bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 12px rgba(255,215,0,0.5)', animation: 'vs5DotPulse 3.5s ease-in-out 2.5s infinite' }} />
                </div>
              </div>
              {/* Phone in center — tilted for visual interest */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[55%]" style={{ transform: 'rotate(12deg)' }}>
                  <PhoneMockup>
                    <WhatsAppChat />
                  </PhoneMockup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// SECTION 1 — Focus Cards with edge-to-edge GlassPanel
// Content rendered at a JS-measured fixed pixel width so it NEVER reflows.
// Card overflow:hidden clips it — expanding the card reveals content.
// Both cards render both contents (grid overlay) at the same fixed width
// so heights are equalized on desktop. Mobile renders independently.
// Gold↔blue crosshatch glass panel with rounded-3xl (matching about-exp).
// ============================================================================

function Section1() {
  const [active, setActive] = useState(1); // Start on card 2 — auto-switches to card 1 on scroll
  const other = active === 0 ? 1 : 0;
  const flexRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAutoSwitched = useRef(false);
  const [contentW, setContentW] = useState(0);

  // Measure the active card's width so content can be rendered at a fixed size
  const measure = useCallback(() => {
    if (flexRef.current) {
      const w = flexRef.current.offsetWidth;
      // Active card = 5/6 of (container - 16px gap)
      setContentW(Math.floor((w - 16) * 5 / 6));
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (flexRef.current) ro.observe(flexRef.current);
    return () => ro.disconnect();
  }, [measure]);


  // Auto-switch to card 1 (SAA) when user scrolls ~70% into the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoSwitched.current) {
          hasAutoSwitched.current = true;
          setActive(0);
          io.disconnect();
        }
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goldGradient = 'linear-gradient(90deg, rgba(255,215,0,0.07) 0%, rgba(255,215,0,0.04) 55%, rgba(0,191,255,0.01) 100%)';
  const blueGradient = 'linear-gradient(90deg, rgba(255,215,0,0.01) 0%, rgba(0,191,255,0.04) 45%, rgba(0,191,255,0.07) 100%)';

  // Fixed-width style for desktop content — SSR fallback uses min-width
  const contentStyle = contentW > 0
    ? { width: `${contentW}px` }
    : { minWidth: '550px' };

  return (
    <section ref={sectionRef} className="">
      <style>{`
        @keyframes focusPulse {
          0% { opacity: 0.55; }
          13% { opacity: 0.95; }
          28% { opacity: 0.6; }
          41% { opacity: 0.85; }
          54% { opacity: 0.5; }
          67% { opacity: 1; }
          83% { opacity: 0.7; }
          100% { opacity: 0.55; }
        }
        @keyframes focusFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .focus-card {
          background:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
            linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%);
          background-blend-mode: overlay, normal;
        }
        @media (min-width: 768px) {
          .focus-card {
            backdrop-filter: blur(16px) saturate(120%);
            -webkit-backdrop-filter: blur(16px) saturate(120%);
          }
        }
      `}</style>

      {/* Glass panel — rounded-3xl matching about-exp GlassPanel pattern */}
      <div
        className="relative overflow-hidden rounded-3xl py-[50px]"
        style={{
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.4),
            0 4px 12px rgba(0,0,0,0.25),
            inset 0 1px 0 0 rgba(255,255,255,0.35),
            inset 0 2px 4px 0 rgba(255,255,255,0.2),
            inset 0 20px 40px -20px rgba(255,255,255,0.15),
            inset 0 -1px 0 0 rgba(0,0,0,0.7),
            inset 0 -2px 6px 0 rgba(0,0,0,0.5),
            inset 0 -10px 25px -8px rgba(0,0,0,0.6),
            inset 0 -25px 50px -20px rgba(0,0,0,0.45)
          `,
        }}
      >
        {/* Gold-dominant gradient layer */}
        <div
          className="absolute inset-0"
          style={{
            background: goldGradient,
            opacity: active === 0 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
        {/* Blue-dominant gradient layer */}
        <div
          className="absolute inset-0"
          style={{
            background: blueGradient,
            opacity: active === 1 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
        {/* Crosshatch texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px),
              repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px)
            `,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Content — max-width centered inside the glass */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

          {/* Desktop: flex layout — fixed-width content, height equalized */}
          <div ref={flexRef} className="hidden md:flex gap-4">
            {PANELS.map((panel, i) => {
              const isActive = active === i;
              return (
                <div
                  key={panel.id}
                  className="relative"
                  style={{
                    flexGrow: isActive ? 5 : 1,
                    flexBasis: 0,
                    minWidth: 0,
                    transition: 'flex-grow 1.15s cubic-bezier(0.3, 0.1, 0.3, 1)',
                  }}
                >
                  {/* Pulsing glow ring — outside overflow:hidden card */}
                  {isActive && (
                    <div
                      className="absolute -inset-[3px] rounded-2xl pointer-events-none"
                      style={{
                        border: `2px solid ${panel.color}50`,
                        boxShadow: `0 0 12px 4px ${panel.color}44, 0 0 28px 8px ${panel.color}22`,
                        animation: 'focusPulse 2.4s linear infinite',
                        zIndex: 30,
                      }}
                    />
                  )}

                  {/* Card — active: grain bg via focus-card class; inactive: GenericCard solid bg */}
                  <div
                    className={`${isActive ? 'focus-card' : ''} rounded-2xl h-full relative ${!isActive ? 'cursor-pointer' : ''}`}
                    onClick={() => !isActive && setActive(i)}
                    style={{
                      overflow: 'hidden',
                      ...(!isActive ? {
                        background: 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                      } : {}),
                      border: isActive ? `3px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? `0 0 6px 2px ${panel.color}44, 0 0 20px 4px ${panel.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                      transition: 'border-color 0.9s ease, box-shadow 0.9s ease',
                    }}
                  >
                    {/* Content at FIXED pixel width — never reflows during transitions */}
                    <div className="p-6 lg:p-8" style={contentStyle}>
                      {/* Full H2 title — slides down into place (matches about-exp hinge style) */}
                      <div style={{
                        transform: isActive ? 'translateY(0)' : 'translateY(-16px)',
                        opacity: isActive ? 1 : 0,
                        transition: isActive
                          ? 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1) 0.2s, opacity 0.85s ease 0.2s'
                          : 'transform 0.4s ease, opacity 0.3s ease',
                      }}>
                        <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1.25rem', maxWidth: '2500px' }}>
                          {panel.label}
                        </H2>
                      </div>
                      {/* Content body — fades in when active */}
                      <div style={{
                        opacity: isActive ? 1 : 0,
                        transition: isActive
                          ? 'opacity 0.85s ease 0.25s'
                          : 'opacity 0.3s ease',
                      }}>
                        {/* Grid overlay: both contents at same width → stable equal height */}
                        <div style={{ display: 'grid' }}>
                          <div style={{ gridArea: '1 / 1' }}>
                            {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                          </div>
                          <div style={{ gridArea: '1 / 1', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
                            {i === 0 ? <SponsorshipContent /> : <SAAContent />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Short label — vertical text, slides off horizontally on activation */}
                    <div
                      className="absolute inset-0 z-20 flex items-center justify-center"
                      style={{
                        pointerEvents: isActive ? 'none' : 'auto',
                        transform: isActive
                          ? `translateX(${i === 0 ? '-100%' : '100%'})`
                          : 'translateX(0)',
                        opacity: isActive ? 0 : 1,
                        transition: isActive
                          ? 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1), opacity 0.5s ease 0.2s'
                          : 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1) 0.25s, opacity 0.55s ease 0.2s',
                      }}
                    >
                      <div style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}>
                        <H2 theme={panel.theme} style={{
                          marginBottom: 0,
                          fontSize: 'clamp(28px, calc(24.36px + 1.45vw), 40px)',
                        }}>
                          {panel.shortLabel}
                        </H2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: both cards fully open, stacked */}
          <div className="md:hidden flex flex-col gap-3">
            {PANELS.map((panel, i) => (
              <div key={panel.id} className="relative">
                {/* Glow ring */}
                <div
                  className="absolute -inset-[3px] rounded-2xl pointer-events-none"
                  style={{
                    border: `2px solid ${panel.color}50`,
                    boxShadow: `0 0 12px 4px ${panel.color}44`,
                    zIndex: 30,
                  }}
                />

                {/* Card — always open with grain bg and colored border */}
                <div
                  className="focus-card rounded-2xl relative"
                  style={{
                    overflow: 'hidden',
                    border: `3px solid ${panel.color}`,
                    boxShadow: `0 0 6px 2px ${panel.color}44, 0 8px 32px rgba(0,0,0,0.4)`,
                  }}
                >
                  <div className="p-5">
                    <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1rem', maxWidth: '2500px' }}>
                      {panel.label}
                    </H2>
                    {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// SECTION 2 — "Why SAA Is Different" (Cards + Description Panel)
// ============================================================================

function Section2() {
  const [activeCard, setActiveCard] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userClicked = useRef(false);

  // Start auto-rotate only after 60% of section is visible
  useEffect(() => {
    if (userClicked.current) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userClicked.current) {
          setAutoRotate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate cards every 5 seconds
  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setActiveCard(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(id);
  }, [autoRotate]);

  const handleCardClick = (idx: number) => {
    userClicked.current = true;
    setAutoRotate(false);
    setActiveCard(idx);
  };

  // Auto-scroll mobile slider to center active card (only after section is visible)
  useEffect(() => {
    if (!autoRotate && !userClicked.current) return;
    const container = scrollRef.current;
    if (!container) return;
    const cardEls = Array.from(container.querySelectorAll<HTMLElement>(':scope > div'));
    const card = cardEls[activeCard];
    if (!card) return;
    const scrollLeft = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [activeCard, autoRotate]);

  const cards = [
    { label: 'Zero Cost to Agents', icon: Shield },
    { label: 'Built to Last', icon: Layers },
    { label: 'Beyond One Sponsor', icon: Building2 },
  ];

  const mistyGoldBg = 'radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%), radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%), radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%), linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)';

  const darkCardBg = 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)';

  const goldDot = <span className="flex-shrink-0 w-2 h-2 rounded-full mt-[6px]" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />;

  const renderContent = (cardIndex?: number) => {
    switch (cardIndex ?? activeCard) {
      case 0:
        return (
          <div className="space-y-4">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                {goldDot}
                <span className="text-body">Agents pay Smart Agent Alliance nothing</span>
              </li>
              <li className="flex items-start gap-3">
                {goldDot}
                <span className="text-body">Compensated from eXp&apos;s company revenue only when agents close transactions</span>
              </li>
              <li className="flex items-start gap-3">
                {goldDot}
                <span className="text-body">No commission splits, no platform fees, no monthly charges</span>
              </li>
            </ul>
            <p style={{
              color: '#ffd700',
              fontFamily: 'var(--font-taskor, sans-serif)',
              fontSize: 'clamp(15px, 2vw, 18px)',
              fontWeight: 600,
              fontStyle: 'italic',
              marginTop: '0.75rem',
            }}>
              {FINANCIAL_TAGLINE}
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-body" style={{ color: '#b0b0b0' }}>
              {ORG_HEADING}
            </p>
            <ul className="space-y-4">
              {ORG_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  {goldDot}
                  <span className="text-body">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <ul className="space-y-4">
              {DIFFERENTIATORS.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  {goldDot}
                  <span className="text-body">{d.text}</span>
                </li>
              ))}
            </ul>
            <p className="text-body pt-1" style={{ color: '#b0b0b0' }}>
              Directly aligned with the Wolf Pack — agents receive everything from both organizations, including scale, leadership depth, and global collaboration.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <GlassPanel variant="marigoldCrosshatch" noBlur className="py-[50px]">
    <section ref={sectionRef} className="px-4 sm:px-8 md:px-12">
      <style>{`
        @keyframes section2FadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section2-content-fade {
          animation: section2FadeIn 0.6s ease-out;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <H2 style={{ marginBottom: '1rem' }}>
            {SECTION2_HEADING}
          </H2>
          <p className="text-body mx-auto" style={{ maxWidth: '700px' }}>
            {SECTION2_INTRO}
          </p>
          {SECTION2_SUBHEADING && (
            <p className="text-body mt-3 mx-auto" style={{ fontWeight: 600, maxWidth: '700px' }}>
              {SECTION2_SUBHEADING}
            </p>
          )}
        </div>

        {/* 3 Cards — Desktop: grid, Mobile: horizontal scroll slider */}
        {(() => {
          const renderCard = (card: typeof cards[0], idx: number) => {
            const isActive = activeCard === idx;
            const IconComp = card.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx)}
                className="relative w-full h-full rounded-xl md:rounded-2xl p-3 md:p-6 text-center overflow-hidden"
                style={{
                  background: darkCardBg,
                  border: isActive
                    ? '1px solid rgba(255,215,0,0.35)'
                    : '1px solid rgba(255,215,0,0.1)',
                  boxShadow: isActive
                    ? '0 0 40px 8px rgba(255,200,80,0.35)'
                    : '0 8px 32px rgba(0,0,0,0.4)',
                  transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                {/* Misty gold overlay */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: mistyGoldBg,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                  }}
                />
                <div className="relative z-10">
                  {/* Icon ring */}
                  <div className="relative mx-auto mb-2 md:mb-3 w-9 h-9 md:w-14 md:h-14">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(80,60,0,0.4), rgba(60,40,0,0.25))'
                          : 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(200,160,0,0.1))',
                        boxShadow: isActive
                          ? '0 0 15px rgba(120,80,0,0.3)'
                          : '0 0 25px rgba(255,215,0,0.2), inset 0 0 15px rgba(255,215,0,0.1)',
                        transition: 'background 0.6s ease, box-shadow 0.6s ease',
                      }}
                    />
                    <div
                      className="absolute inset-1.5 rounded-full flex items-center justify-center"
                      style={{
                        background: isActive
                          ? 'linear-gradient(180deg, rgba(220,190,80,0.2), rgba(200,160,50,0.15))'
                          : 'linear-gradient(180deg, rgba(15,15,10,0.95), rgba(10,10,5,0.98))',
                        border: isActive
                          ? '1px solid rgba(120,80,0,0.4)'
                          : '1px solid rgba(255,215,0,0.3)',
                        transition: 'background 0.6s ease, border-color 0.6s ease',
                      }}
                    >
                      <IconComp
                        className="w-3.5 h-3.5 md:w-5 md:h-5"
                        style={{
                          color: isActive ? '#4a3200' : '#ffd700',
                          filter: isActive ? 'none' : 'drop-shadow(0 0 8px rgba(255,215,0,0.5))',
                          transition: 'color 0.6s ease, filter 0.6s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Card label */}
                  <h3
                    className="text-h6 whitespace-nowrap"
                    style={{
                      color: isActive ? '#3a2800' : '#e5e4dd',
                      transition: 'color 0.6s ease',
                    }}
                  >
                    {card.label}
                  </h3>
                </div>
              </button>
            );
          };

          return (
            <>
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-3 gap-4">
                {cards.map((card, idx) => renderCard(card, idx))}
              </div>

              {/* Mobile: horizontal scroll with edge fades */}
              <div className="md:hidden -mx-4 sm:-mx-8">
                <div className="relative -my-12">
                  <div
                    ref={scrollRef}
                    className="s2-scroll flex gap-2 overflow-x-auto py-12 px-4 sm:px-8"
                    style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                  >
                    <style>{`.s2-scroll::-webkit-scrollbar { display: none; }`}</style>
                    {cards.map((card, idx) => (
                      <div key={idx} className="flex-shrink-0 flex" style={{ width: '65%', scrollSnapAlign: 'center' }}>
                        {renderCard(card, idx)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-2">
                  {cards.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCardClick(i)}
                      aria-label={`Go to ${cards[i].label}`}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: i === activeCard ? '#ffd700' : 'rgba(255,255,255,0.25)',
                        boxShadow: i === activeCard ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                        transform: i === activeCard ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        })()}

        {/* Shared description panel */}
        <div className="mt-3 md:mt-4">
          <GrainCard padding="md" centered={false}>
            <div className="relative" style={{ display: 'grid' }}>
              {/* Render all panels stacked in same grid cell — tallest sets the height, only active is visible */}
              {cards.map((card, idx) => {
                const WatermarkIcon = card.icon;
                const isActive = activeCard === idx;
                return (
                  <div
                    key={idx}
                    className={isActive ? 'section2-content-fade' : ''}
                    style={{
                      gridArea: '1 / 1',
                      ...(isActive ? { visibility: 'visible' as const, zIndex: 1 } : { visibility: 'hidden' as const, pointerEvents: 'none' as const, zIndex: 0 }),
                    }}
                  >
                    <div className="relative flex flex-col justify-center">
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          right: '0px',
                          bottom: '0px',
                          opacity: 0.04,
                          color: '#ffd700',
                        }}
                      >
                        <WatermarkIcon size={160} strokeWidth={1} />
                      </div>
                      <div className="relative z-10">
                        {renderContent(idx)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GrainCard>
        </div>
      </div>
    </section>
    </GlassPanel>
  );
}

// ============================================================================
// SECTION 3 — "What You Get Inside SAA" (Agent Portal Walkthrough Video)
// ============================================================================

const WALKTHROUGH_VIDEO_ID = '14ba82ce03943a64ef90e3c9771a0d56';
const WALKTHROUGH_POSTER = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/agent-portal-walkthrough-thumbnail/desktop';

// Timestamp-based text strip for the walkthrough video
const VIDEO_TIMESTAMPS = [
  { time: 0,     title: 'BUILT FOR AGENT GROWTH',   subtitle: 'Clarity. Efficiency. Scale' },
  { time: 14,    title: 'TRANSITION SEAMLESSLY',     subtitle: 'Whether you\'re starting or moving' },
  { time: 37,    title: 'TOTAL AGENT VISIBILITY',    subtitle: 'Your entire business in one link' },
  { time: 59,    title: 'REVENUE SHARE GROWTH',      subtitle: 'Agents find you organically' },
  { time: 89,    title: 'NO MORE GUESSING',          subtitle: 'See what actually converts' },
  { time: 107,   title: 'WINNING STRATEGIES',         subtitle: 'What\'s working, shared openly' },
  { time: 138,   title: 'FASTER ANSWERS',             subtitle: 'Zero hunting for help' },
  { time: 183,   title: 'EXECUTE FASTER',             subtitle: 'Professional marketing, done' },
  { time: 202,   title: 'CAPTURE YOUR TRAFFIC',       subtitle: 'Turn visibility into leads' },
  { time: 212,   title: 'NEW AGENT SUPPORT',          subtitle: 'Quick lessons for a faster start' },
  { time: 223,   title: 'HIGH-LEVEL TRAINING',        subtitle: 'Courses easy to find and access' },
];

// Cloudflare Stream SDK typings
interface StreamPlayer {
  play: () => void;
  pause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}
declare global {
  interface Window {
    Stream?: (iframe: HTMLIFrameElement) => StreamPlayer;
  }
}

type FloatState = 'inline' | 'floating' | 'returning';

function Section3() {
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<StreamPlayer | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const floatingFrameRef = useRef<HTMLDivElement>(null);

  const [floatState, setFloatState] = useState<FloatState>('inline');
  const floatStateRef = useRef<FloatState>('inline');
  const [dismissed, setDismissed] = useState(false);
  const placeholderHeight = useRef(0);

  // Custom player controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeTimestampIdx, setActiveTimestampIdx] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'auto' | '360p' | '720p' | '1080p'>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Track whether the iframe should be rendered (preloaded on scroll or on play click)
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const sdkReadyRef = useRef(false);
  const wantsAutoplay = useRef(false);

  // Initialize player ONLY after iframe is rendered and SDK is loaded
  const initPlayer = useCallback(() => {
    if (!iframeRef.current || !window.Stream) return;
    const player = window.Stream(iframeRef.current);
    playerRef.current = player;
    player.addEventListener('play', () => {
      setIsPlaying(true); setHasPlayed(true); setVideoEnded(false); setShowSpinner(false);
    });
    player.addEventListener('pause', () => setIsPlaying(false));
    player.addEventListener('ended', () => { setIsPlaying(false); setVideoEnded(true); });
    player.addEventListener('loadedmetadata', () => setDuration(player.duration || 0));
    player.addEventListener('timeupdate', () => {
      setCurrentTime(player.currentTime || 0);
      setDuration(player.duration || 0);
    });
    player.addEventListener('volumechange', () => {
      setIsMuted(player.muted);
      setVolume(player.volume);
    });
    // Ensure volume is on; only auto-play if user clicked play
    player.muted = false;
    player.volume = 1;
    if (wantsAutoplay.current) {
      player.play();
    }
  }, []);

  // Load SDK script once (but don't init player yet)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Stream) {
      const script = document.createElement('script');
      script.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
      script.async = true;
      script.onload = () => { sdkReadyRef.current = true; };
      document.head.appendChild(script);
    } else {
      sdkReadyRef.current = true;
    }
  }, []);

  // Preload iframe when video section scrolls into view
  useEffect(() => {
    const wrap = videoWrapRef.current;
    if (!wrap || iframeLoaded) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIframeLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [iframeLoaded]);

  // Once iframe is in the DOM, wait for SDK then init player
  useEffect(() => {
    if (!iframeLoaded) return;
    // SDK might already be loaded or still loading
    const tryInit = () => {
      if (window.Stream && iframeRef.current) {
        initPlayer();
        return true;
      }
      return false;
    };
    if (tryInit()) return;
    // Poll briefly for SDK load
    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [iframeLoaded, initPlayer]);

  // Re-initialize player after quality change (iframe src changes)
  useEffect(() => {
    if (!hasPlayed) return; // Only re-init if user has already started playing
    const timer = setTimeout(() => {
      if (!iframeRef.current || !window.Stream) return;
      const player = window.Stream(iframeRef.current);
      playerRef.current = player;
      player.addEventListener('play', () => {
        setIsPlaying(true); setHasPlayed(true); setVideoEnded(false); setShowSpinner(false);
      });
      player.addEventListener('pause', () => setIsPlaying(false));
      player.addEventListener('ended', () => { setIsPlaying(false); setVideoEnded(true); });
      player.addEventListener('loadedmetadata', () => setDuration(player.duration || 0));
      player.addEventListener('timeupdate', () => {
        setCurrentTime(player.currentTime || 0);
        setDuration(player.duration || 0);
      });
      player.addEventListener('volumechange', () => {
        setIsMuted(player.muted);
        setVolume(player.volume);
      });
      // Auto-play after quality switch
      player.play();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoQuality]);

  // Update active timestamp index based on currentTime
  useEffect(() => {
    if (!hasPlayed) return;
    let idx = 0;
    for (let i = VIDEO_TIMESTAMPS.length - 1; i >= 0; i--) {
      if (currentTime >= VIDEO_TIMESTAMPS[i].time) {
        idx = i;
        break;
      }
    }
    setActiveTimestampIdx(idx);
  }, [currentTime, hasPlayed]);

  const togglePlay = useCallback(() => {
    // First click: show spinner, hide poster, trigger playback
    if (!hasPlayed) {
      wantsAutoplay.current = true;
      setHasPlayed(true);
      setShowSpinner(true);
      if (!iframeLoaded) {
        setIframeLoaded(true); // triggers useEffect → initPlayer → play
      } else if (playerRef.current) {
        playerRef.current.play(); // iframe already preloaded and bound
      }
      return;
    }
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pause();
    else playerRef.current.play();
  }, [isPlaying, iframeLoaded, hasPlayed]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.muted = !playerRef.current.muted;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const v = parseFloat(e.target.value);
    playerRef.current.volume = v;
    playerRef.current.muted = v === 0;
  }, []);

  const handleScrubberClick = useCallback((e: React.MouseEvent) => {
    if (!scrubberRef.current || !playerRef.current || duration <= 0) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    playerRef.current.currentTime = pct * duration;
  }, [duration]);

  const handleScrubberMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleScrubberClick(e);
  }, [handleScrubberClick]);

  useEffect(() => {
    if (!isDragging) return;
    function move(e: MouseEvent) {
      if (!scrubberRef.current || !playerRef.current || duration <= 0) return;
      const rect = scrubberRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      playerRef.current.currentTime = pct * duration;
    }
    function up() { setIsDragging(false); }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging, duration]);

  const handleFullscreen = useCallback(() => {
    const wrap = videoWrapRef.current;
    const frame = floatingFrameRef.current;
    if (!wrap) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (floatStateRef.current === 'floating' && frame) {
      // Corner mode: snap to inline first, then fullscreen (inline→fs already works)
      frame.style.position = 'relative';
      frame.style.left = '';
      frame.style.top = '';
      frame.style.width = '';
      frame.style.height = '';
      frame.style.transform = '';
      frame.style.transition = 'none';
      frame.style.zIndex = '';
      frame.style.borderRadius = '';
      frame.style.boxShadow = '';
      frame.style.aspectRatio = '2228 / 1080';
      frame.style.overflow = 'hidden';
      floatStateRef.current = 'inline';
      setFloatState('inline');
      requestAnimationFrame(() => wrap.requestFullscreen?.());
    } else {
      wrap.requestFullscreen?.();
    }
  }, []);

  // Track fullscreen state — clear/restore float inline styles on the container
  useEffect(() => {
    const VIDEO_AR_FS = 2228 / 1080;
    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      const wrap = videoWrapRef.current;
      const frame = floatingFrameRef.current;
      if (wrap) wrap.classList.toggle('s3-fs-active', fs);

      if (fs) {
        // Apply fullscreen styles
        if (wrap) {
          wrap.style.width = '100vw';
          wrap.style.height = '100vh';
          wrap.style.maxWidth = '100vw';
          wrap.style.background = '#000';
          wrap.style.border = 'none';
          wrap.style.borderRadius = '0';
          wrap.style.overflow = 'visible';
          wrap.style.display = 'flex';
          wrap.style.flexDirection = 'column';
          wrap.style.alignItems = 'stretch';
          wrap.style.justifyContent = 'flex-start';
        }
        if (frame) {
          frame.style.position = 'relative';
          frame.style.width = '100%';
          frame.style.height = '0';
          frame.style.flex = '1 1 0';
          frame.style.minHeight = '0';
          frame.style.maxHeight = 'none';
          frame.style.aspectRatio = 'auto';
          frame.style.overflow = 'hidden';
          frame.style.left = 'unset';
          frame.style.top = 'unset';
          frame.style.zIndex = 'unset';
          frame.style.transform = 'none';
          frame.style.transition = 'none';
          frame.style.borderRadius = '0';
          frame.style.boxShadow = 'none';
          const iframeEl = frame.querySelector('iframe');
          if (iframeEl) {
            (iframeEl as HTMLElement).style.zIndex = '1';
          }
        }
      } else {
        // Exiting fullscreen: restore wrap's original React inline styles
        if (wrap) {
          wrap.style.width = '';
          wrap.style.height = '';
          wrap.style.maxWidth = '900px';
          wrap.style.background = '';
          wrap.style.border = '1px solid rgba(255, 215, 0, 0.2)';
          wrap.style.borderRadius = '12px';
          wrap.style.overflow = 'hidden';
          wrap.style.display = '';
          wrap.style.flexDirection = '';
          wrap.style.alignItems = '';
          wrap.style.justifyContent = '';
        }
        if (frame) {
          if (floatStateRef.current === 'floating') {
            // Exiting fullscreen while floating: re-apply corner position
            const targetW = Math.min(320, window.innerWidth * 0.4);
            const targetH = targetW / VIDEO_AR_FS;
            const targetX = 20;
            const targetY = window.innerHeight - 20 - targetH;
            frame.style.position = 'fixed';
            frame.style.zIndex = '50';
            frame.style.left = '0px';
            frame.style.top = '0px';
            frame.style.width = `${targetW}px`;
            frame.style.height = `${targetH}px`;
            frame.style.flex = '';
            frame.style.minHeight = '';
            frame.style.maxHeight = '';
            frame.style.aspectRatio = 'unset';
            frame.style.transform = `translate(${targetX}px, ${targetY}px)`;
            frame.style.transition = 'none';
            frame.style.borderRadius = '12px';
            frame.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';
          } else {
            // Exiting fullscreen while inline: restore original container styles
            frame.style.position = '';
            frame.style.width = '';
            frame.style.height = '';
            frame.style.flex = '';
            frame.style.minHeight = '';
            frame.style.maxHeight = '';
            frame.style.aspectRatio = '2228 / 1080';
            frame.style.overflow = '';
            frame.style.left = '';
            frame.style.top = '';
            frame.style.zIndex = '';
            frame.style.transform = '';
            frame.style.transition = '';
            frame.style.borderRadius = '';
            frame.style.boxShadow = '';
          }
          // Clear iframe z-index override
          const iframeEl = frame.querySelector('iframe');
          if (iframeEl) {
            (iframeEl as HTMLElement).style.zIndex = '';
          }
        }
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Auto-hide controls — only show after first play, hide faster (1.5s)
  const scheduleHide = useCallback(() => {
    if (!hasPlayed) return;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowControls(true);
    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 1500);
    }
  }, [isPlaying, hasPlayed]);

  useEffect(() => {
    if (hasPlayed) scheduleHide();
  }, [isPlaying, hasPlayed, scheduleHide]);

  const formatTime = (s: number) => {
    if (isNaN(s) || s < 0) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  // FLIP-based float animation
  const inlineRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const wrap = videoWrapRef.current;
    const frame = floatingFrameRef.current;
    if (!wrap || !frame) return;

    function handleScroll() {
      if (dismissed || !wrap || !frame) return;
      // Never trigger float/return transitions during fullscreen
      if (document.fullscreenElement) return;
      const wrapRect = wrap.getBoundingClientRect();
      const wrapHeight = wrap.offsetHeight;
      // Float when 50% of the video is scrolled off screen
      const shouldFloat = wrapRect.top + wrapHeight * 0.5 < 0;

      if (shouldFloat && floatState === 'inline') {
        // Capture inline position before floating
        inlineRectRef.current = frame.getBoundingClientRect();
        // Only hold space for the video frame, not the timestamp strip above it
        placeholderHeight.current = frame.offsetHeight;
        floatStateRef.current = 'floating';
        setFloatState('floating');
      } else if (!shouldFloat && floatState === 'floating') {
        floatStateRef.current = 'returning';
        setFloatState('returning');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed, floatState]);

  // Native video aspect ratio
  const VIDEO_AR = 2228 / 1080;

  // Animate float TO corner
  useEffect(() => {
    const frame = floatingFrameRef.current;
    if (floatState !== 'floating' || !frame || !inlineRectRef.current) return;
    // Don't animate float while in fullscreen
    if (document.fullscreenElement) return;

    const from = inlineRectRef.current;
    // Target: bottom-left corner
    const targetW = Math.min(320, window.innerWidth * 0.4);
    const targetH = targetW / VIDEO_AR;
    const targetX = 20;
    const targetY = window.innerHeight - 20 - targetH;

    // Apply fixed position at the FROM location first (using transform)
    frame.style.position = 'fixed';
    frame.style.zIndex = '50';
    frame.style.left = '0px';
    frame.style.top = '0px';
    frame.style.width = `${from.width}px`;
    frame.style.height = `${from.height}px`;
    frame.style.aspectRatio = 'unset';
    frame.style.transform = `translate(${from.left}px, ${from.top}px)`;
    frame.style.transition = 'none';
    frame.style.borderRadius = '12px';
    frame.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';

    // Force reflow then animate to target
    void frame.offsetHeight;
    frame.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    frame.style.transform = `translate(${targetX}px, ${targetY}px)`;
    frame.style.width = `${targetW}px`;
    frame.style.height = `${targetH}px`;
  }, [floatState]);

  // Animate RETURN to inline — rAF loop recalculates target every frame
  useEffect(() => {
    const frame = floatingFrameRef.current;
    const wrap = videoWrapRef.current;
    if (floatState !== 'returning' || !frame || !wrap) return;
    // Don't animate return while in fullscreen
    if (document.fullscreenElement) return;

    const duration = 450;
    const startTime = performance.now();

    // Capture starting position (the corner)
    const startX = frame.offsetLeft !== undefined ? parseFloat(frame.style.left || '0') : 0;
    const startY = parseFloat(frame.style.top || '0');
    const startRect = frame.getBoundingClientRect();
    const startLeft = startRect.left;
    const startTop = startRect.top;
    const startW = startRect.width;
    const startH = startRect.height;

    // Keep position: fixed during animation, animate left/top/width/height directly
    frame.style.transition = 'none';
    frame.style.transform = '';
    frame.style.left = `${startLeft}px`;
    frame.style.top = `${startTop}px`;
    frame.style.width = `${startW}px`;
    frame.style.height = `${startH}px`;

    // Ease-out cubic
    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    let rafId: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const t = ease(progress);

      // Recalculate target every frame (wrap moves with scroll)
      // Account for timestamp strip height — video lands below it
      const wrapRect = wrap!.getBoundingClientRect();
      const tsStrip = wrap!.querySelector('.s3-timestamp-strip') as HTMLElement | null;
      const stripH = tsStrip ? tsStrip.offsetHeight : 0;
      const targetX = wrapRect.left;
      const targetY = wrapRect.top + stripH;
      const targetW = wrapRect.width;
      const targetH = targetW / VIDEO_AR;

      frame!.style.left = `${startLeft + (targetX - startLeft) * t}px`;
      frame!.style.top = `${startTop + (targetY - startTop) * t}px`;
      frame!.style.width = `${startW + (targetW - startW) * t}px`;
      frame!.style.height = `${startH + (targetH - startH) * t}px`;

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Animation done — frame is fixed at exact inline position.
        // Collapse placeholder to 0 height first (prevents doubled-height flash),
        // then drop frame back to flow. All synchronous = single paint.
        const placeholder = document.getElementById('s3-float-placeholder') || wrap!.querySelector('[data-float-placeholder]') as HTMLElement | null;
        if (placeholder) {
          placeholder.style.height = '0';
        }
        // Now reset to flow — placeholder is 0 height so no doubling
        frame!.style.position = '';
        frame!.style.zIndex = '';
        frame!.style.left = '';
        frame!.style.top = '';
        frame!.style.width = '';
        frame!.style.height = '';
        frame!.style.aspectRatio = '2228/1080';
        frame!.style.transform = '';
        frame!.style.transition = '';
        frame!.style.borderRadius = '';
        frame!.style.boxShadow = '';
        // Tell React — it will properly unmount the 0-height placeholder
        floatStateRef.current = 'inline';
        setFloatState('inline');
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [floatState]);

  // Reset dismissed when user scrolls back to the video
  useEffect(() => {
    if (!dismissed) return;
    const el = videoWrapRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top + el.offsetHeight * 0.5 >= 0) setDismissed(false);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  // Dismiss: animate back then mark dismissed
  const handleDismiss = useCallback(() => {
    setDismissed(true);
    floatStateRef.current = 'returning';
    setFloatState('returning');
  }, []);


  return (
    <section id="agent-portal-walkthrough" className="relative overflow-hidden">
      <style>{`
        /* Fullscreen the wrap (video + timestamp strip together) */
        .s3-video-wrap:fullscreen,
        .s3-video-wrap:-webkit-full-screen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          background: #000 !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: visible !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
        }
        .s3-video-wrap:fullscreen .s3-timestamp-strip,
        .s3-video-wrap:-webkit-full-screen .s3-timestamp-strip,
        .s3-video-wrap.s3-fs-active .s3-timestamp-strip {
          display: block !important;
          max-height: none !important;
          height: auto !important;
          min-height: 40px !important;
          width: 100% !important;
          flex-shrink: 0 !important;
          overflow: visible !important;
          transition: none !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .s3-video-wrap:fullscreen .s3-video-container,
        .s3-video-wrap:-webkit-full-screen .s3-video-container {
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          flex: 1 1 auto !important;
          max-height: none !important;
          aspect-ratio: auto !important;
          overflow: visible !important;
          left: unset !important;
          top: unset !important;
          z-index: unset !important;
          transform: none !important;
          transition: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        .s3-video-wrap:fullscreen .s3-video-container iframe,
        .s3-video-wrap:-webkit-full-screen .s3-video-container iframe {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
        }
        .s3-video-wrap:fullscreen [data-float-placeholder],
        .s3-video-wrap:-webkit-full-screen [data-float-placeholder] {
          display: none !important;
        }
        @keyframes s3-spin { to { transform: rotate(360deg); } }
        .s3-vol-slider {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 50px !important;
          height: 2px !important;
          background: rgba(255,255,255,0.25) !important;
          border-radius: 1px !important;
          outline: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .s3-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #ffd700 !important;
          cursor: pointer !important;
          margin-top: -3px !important;
        }
        .s3-vol-slider::-moz-range-thumb {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #ffd700 !important;
          cursor: pointer !important;
          border: none !important;
        }
        .s3-vol-slider::-webkit-slider-runnable-track {
          height: 2px !important;
          background: rgba(255,255,255,0.25) !important;
          border-radius: 1px !important;
        }
        .s3-vol-slider::-moz-range-track {
          height: 2px !important;
          background: rgba(255,255,255,0.25) !important;
          border-radius: 1px !important;
          border: none !important;
        }
      `}</style>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center">
          <H2>
            What You Get Inside SAA
          </H2>
          <p className="text-body max-w-[950px] mx-auto" style={{ marginTop: '-1.5rem' }}>
            As an SAA agent, you&apos;re part of both Smart Agent Alliance and the Wolfpack, our larger team network within eXp Realty. Your Agent Portal brings everything together in one place.
          </p>
        </div>

        {/* Video player + timestamp strip wrapper */}
        <div
          ref={videoWrapRef}
          className="relative mx-auto mt-8 s3-video-wrap"
          style={{
            maxWidth: '900px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Timestamp text strip — slides down from top when video starts */}
          <div
            className="s3-timestamp-strip"
            style={isFullscreen ? {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            } : {
              maxHeight: hasPlayed && !videoEnded ? '60px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease',
              background: 'rgba(0, 0, 0, 0.85)',
              borderBottom: hasPlayed && !videoEnded ? '1px solid rgba(255, 215, 0, 0.2)' : 'none',
            }}
          >
            <div
              key={activeTimestampIdx}
              style={{
                padding: '8px 16px',
                textAlign: 'center',
                animation: 'tsFadeInDown 0.5s ease both',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-taskor, sans-serif)',
                  fontSize: isFullscreen ? 'clamp(18px, 2.5vw, 28px)' : 'clamp(13px, 1.5vw, 16px)',
                  fontWeight: 700,
                  color: '#ffd700',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
                }}
              >
                {VIDEO_TIMESTAMPS[activeTimestampIdx].title}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-amulya, sans-serif)',
                  fontSize: isFullscreen ? 'clamp(14px, 1.8vw, 20px)' : 'clamp(12px, 1.3vw, 14px)',
                  color: '#a8a7a0',
                  marginTop: '2px',
                  paddingBottom: '4px',
                }}
              >
                {VIDEO_TIMESTAMPS[activeTimestampIdx].subtitle}
              </span>
            </div>
          </div>
          <style>{`
            @keyframes tsFadeInDown {
              0% { opacity: 0; transform: translateY(-12px); }
              50% { opacity: 0.6; transform: translateY(2px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .s3-video-wrap.s3-fs-active .s3-timestamp-strip,
            .s3-video-wrap:fullscreen .s3-timestamp-strip,
            .s3-video-wrap:-webkit-full-screen .s3-timestamp-strip {
              display: block !important;
              max-height: none !important;
              height: auto !important;
              overflow: visible !important;
              transition: none !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
          `}</style>

          {/* Placeholder for floating state */}
          {floatState !== 'inline' && (
            <div data-float-placeholder style={{ height: placeholderHeight.current || 'auto' }} />
          )}

          <div
            ref={floatingFrameRef}
            className="relative w-full overflow-hidden s3-video-container"
            style={{
              background: '#000',
              aspectRatio: '2228/1080',
            }}
          >
            {/* Poster image — removed from DOM once play is clicked */}
            {!hasPlayed && (
              <img
                src={WALKTHROUGH_POSTER}
                alt="Agent Portal Walkthrough"
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'cover',
                  zIndex: 2,
                }}
              />
            )}

            {/* Play button overlay (before first play) */}
            {!hasPlayed && (
              <div
                className="absolute inset-0 z-[2] cursor-pointer"
                onClick={togglePlay}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="w-12 h-12 md:w-16 md:h-16"
                    style={{
                      borderRadius: '50%',
                      background: 'rgba(255,215,0,0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                    }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-7" viewBox="0 0 24 28" fill="none" style={{ marginLeft: '2px' }}>
                      <path d="M24 14L0 28V0L24 14Z" fill="#1a1a1a" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Cloudflare Stream iframe — preloaded on scroll, plays on user click */}
            {iframeLoaded && (
              <iframe
                ref={iframeRef}
                src={`https://customer-2twfsluc6inah5at.cloudflarestream.com/${WALKTHROUGH_VIDEO_ID}/iframe?preload=auto&autoplay=false&muted=false&controls=false&pip=false&defaultQuality=${videoQuality}`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
            )}

            {/* Loading spinner */}
            {showSpinner && (
              <div
                className="absolute inset-0 z-[5] flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid rgba(255,215,0,0.2)',
                    borderTopColor: '#ffd700',
                    borderRadius: '50%',
                    animation: 's3-spin 0.8s linear infinite',
                  }}
                />
              </div>
            )}

            {/* Custom controls overlay (after first play) */}
            {hasPlayed && (
              <div
                className="absolute inset-0 z-10"
                onMouseMove={scheduleHide}
                onClick={togglePlay}
                style={{ cursor: 'pointer' }}
              >
                {/* Controls bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    opacity: showControls || !isPlaying ? 1 : 0,
                    transition: 'opacity 0.3s',
                    pointerEvents: showControls || !isPlaying ? 'auto' : 'none',
                  }}
                >
                  {/* Play/Pause */}
                  <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="14" rx="1" /><rect x="10" y="1" width="4" height="14" rx="1" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.5v13l11-6.5L3 1.5z" /></svg>
                    )}
                  </button>

                  {/* Time */}
                  <span style={{ color: '#fff', fontSize: '12px', minWidth: '80px', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Scrubber */}
                  <div
                    ref={scrubberRef}
                    onMouseDown={handleScrubberMouseDown}
                    style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#ffd700',
                        borderRadius: '2px',
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                        transition: isDragging ? 'none' : 'width 0.1s linear',
                      }}
                    />
                  </div>

                  {/* Volume */}
                  <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                    {isMuted || volume === 0 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="s3-vol-slider"
                  />

                  {/* Quality selector */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowQualityMenu(prev => !prev); }}
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', fontSize: '11px', fontWeight: 600, minWidth: '36px' }}
                    >
                      {videoQuality === 'auto' ? 'AUTO' : videoQuality.replace('p', '')}
                      <span style={{ fontSize: '8px', verticalAlign: 'super', color: videoQuality === '1080p' ? '#ffd700' : '#999' }}>
                        {videoQuality === '1080p' ? 'HD' : ''}
                      </span>
                    </button>
                    {showQualityMenu && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          right: 0,
                          marginBottom: '8px',
                          background: 'rgba(0,0,0,0.9)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '4px 0',
                          minWidth: '100px',
                          zIndex: 100,
                        }}
                      >
                        {(['1080p', '720p', '360p', 'auto'] as const).map((q) => (
                          <button
                            key={q}
                            onClick={() => { setVideoQuality(q); setShowQualityMenu(false); }}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '6px 14px',
                              background: videoQuality === q ? 'rgba(255,215,0,0.15)' : 'transparent',
                              border: 'none',
                              color: videoQuality === q ? '#ffd700' : '#e5e4dd',
                              fontSize: '13px',
                              textAlign: 'left',
                              cursor: 'pointer',
                            }}
                          >
                            {q === 'auto' ? 'Auto' : q}
                            {q === '1080p' && <span style={{ fontSize: '10px', marginLeft: '4px', color: '#ffd700' }}>HD</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen */}
                  <button onClick={handleFullscreen} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Post-video CTA overlay */}
            {videoEnded && !isPlaying && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                <CTAButton href="/book-a-call">BOOK A CALL</CTAButton>
                <CTAButton
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    window.dispatchEvent(new Event('open-join-modal'));
                  }}
                >
                  JOIN THE ALLIANCE
                </CTAButton>
                <button
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.currentTime = 0;
                      playerRef.current.play();
                      setVideoEnded(false);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#e5e4dd',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'var(--font-taskor, sans-serif)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                    e.currentTarget.style.color = '#ffd700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.color = '#e5e4dd';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>&#8635;</span> Rewatch
                </button>
              </div>
            )}

            {/* Floating dismiss button */}
            {floatState === 'floating' && !isFullscreen && (
              <button
                onClick={handleDismiss}
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  zIndex: 20,
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  lineHeight: 1,
                  paddingBottom: '2px',
                }}
              >
                ×
              </button>
            )}
          </div>


        </div>
      </div>

    </section>
  );
}


// ============================================================================
// SECTION 4 — "Your Dual Advantage"
// ============================================================================

const DUAL_ADVANTAGE_BULLETS = [
  'Everything provided by SAA',
  'Everything provided by the Wolf Pack',
];

function Section4() {
  return (
    <section className="relative">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 md:px-12">
        <div className="text-center mb-8 md:mb-10">
          <H2 style={{ marginBottom: '0.75rem' }}>Your Dual Advantage</H2>
          <p
            className="text-body"
            style={{
              fontFamily: 'var(--font-taskor, sans-serif)',
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              fontWeight: 600,
              color: '#ffd700',
            }}
          >
            Smart Agent Alliance + Wolf Pack
          </p>
        </div>

        <p className="text-body mb-4" style={{ color: '#dcdbd5' }}>
          Smart Agent Alliance is directly aligned with the Wolf Pack, one of eXp Realty&apos;s largest and most experienced leadership organizations.
        </p>

        <p className="text-body mb-4" style={{ color: '#dcdbd5', fontWeight: 600 }}>
          Agents aligned with SAA receive:
        </p>

        <ul className="space-y-2.5 mb-6" style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
          {DUAL_ADVANTAGE_BULLETS.map((bullet, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-body"
              style={{ fontSize: '14px', color: '#dcdbd5', lineHeight: '1.5' }}
            >
              <span style={{ color: '#ffd700', flexShrink: 0, marginTop: '2px' }}>{'\u2022'}</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <p className="text-body mb-3" style={{ color: '#dcdbd5' }}>
          This includes scale, leadership depth, global collaboration, and long-term stability, without additional fees or obligations.
        </p>

        <p className="text-body" style={{ color: '#a8a7a0' }}>
          This dual-layer support exists because of how SAA is positioned within eXp Realty.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6 — "The Bottom Line"
// ============================================================================

const BOTTOM_LINE_BULLETS = [
  'Real systems that are built, maintained, and continuously improved',
  'Ongoing training led by agents who are actively producing',
  'Infrastructure that works whether you joined yesterday or two years ago',
  'Accountable leadership that you can actually reach',
];

function Section6() {
  return (
    <section className="relative">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 md:px-12 text-center">
        <H2 style={{ marginBottom: '1.25rem' }}>The Bottom Line</H2>

        <p className="text-body mb-6" style={{ color: '#dcdbd5' }}>
          Choosing an eXp sponsor isn&apos;t about logos or promises. It&apos;s about what actually shows up after onboarding.
        </p>

        <ul className="space-y-2.5 mb-6 text-left max-w-[600px] mx-auto" style={{ listStyle: 'none', padding: 0, margin: '0 auto 1.5rem' }}>
          {BOTTOM_LINE_BULLETS.map((bullet, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-body"
              style={{ fontSize: '14px', color: '#dcdbd5', lineHeight: '1.5' }}
            >
              <span style={{ color: '#ffd700', flexShrink: 0, marginTop: '2px' }}>{'\u2022'}</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <p className="text-body mb-8" style={{ color: '#a8a7a0' }}>
          If those things matter to you, structure is what makes support dependable over time.
        </p>

        <CTAButton href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>
          Join the Alliance
        </CTAButton>
      </div>
    </section>
  );
}

// ============================================================================
// SHARED: Icon Ring helper for styled section cards
// ============================================================================

function IconRing({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <div className="relative mx-auto mb-4 w-14 h-14">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color}1a)`,
          boxShadow: `0 0 25px ${color}33, inset 0 0 15px ${color}1a`,
        }}
      />
      <div
        className="absolute inset-1.5 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, rgba(15,15,10,0.95), rgba(10,10,5,0.98))',
          border: `1px solid ${color}4d`,
        }}
      >
        <Icon size={20} style={{ color, filter: `drop-shadow(0 0 8px ${color}80)` }} />
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 4 — "Your Dual Advantage" — Two-Column Cards with + divider
// ============================================================================

function Section4Final() {
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-12">
        <div className="text-center mb-8 md:mb-10">
          <H2>Your Dual Advantage</H2>
        </div>

        <p className="text-body mb-4 text-center mx-auto">
          Smart Agent Alliance is directly aligned with the Wolf Pack, one of eXp Realty&apos;s largest and most experienced leadership organizations.
        </p>

        <p className="text-body mb-6 text-center mx-auto" style={{ fontWeight: 600 }}>
          Agents aligned with SAA receive:
        </p>

        {/* Two cards with + symbol between them — equal height via items-stretch */}
        <div className="flex flex-col md:flex-row md:items-stretch items-center gap-4 md:gap-6 mb-8">
          <div
            className="group flex-1 w-full relative overflow-hidden"
            style={{ border: '1px solid rgba(255,215,0,0.25)', borderRadius: '12px', transition: 'all 0.4s ease-out', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(255,215,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(255,215,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,215,0,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,215,0,0.12) 0%, transparent 70%)' }}
            />
            <GrainCard padding="lg" className="h-full">
              <IconRing icon={Shield} color="#ffd700" />
              <p className="text-body text-center">
                {DUAL_ADVANTAGE_BULLETS[0]}
              </p>
            </GrainCard>
          </div>

          {/* Plus symbol */}
          <span
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-taskor, sans-serif)',
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 700,
              color: '#ffd700',
              lineHeight: 1,
              textShadow: '0 0 12px rgba(255,215,0,0.3)',
            }}
          >
            +
          </span>

          <div
            className="group flex-1 w-full relative overflow-hidden"
            style={{ border: '1px solid rgba(0,191,255,0.25)', borderRadius: '12px', transition: 'all 0.4s ease-out', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(0,191,255,0.5)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,191,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(0,191,255,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,191,255,0.12) 0%, transparent 70%)' }}
            />
            <GrainCard padding="lg" className="h-full">
              <IconRing icon={Users} color="#00bfff" />
              <p className="text-body text-center">
                {DUAL_ADVANTAGE_BULLETS[1]}
              </p>
            </GrainCard>
          </div>
        </div>

        {/* Closing prose block with gold grid pattern */}
        <div
          className="relative overflow-hidden rounded-xl p-6 text-center mx-auto"
          style={{
            maxWidth: '800px',
            background: 'rgba(15,15,10,0.6)',
            border: '1px solid rgba(255,215,0,0.1)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,215,0,0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,215,0,0.015) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          <p className="text-body relative z-10">
            This includes scale, leadership depth, global collaboration, and long-term stability, without additional fees or obligations.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6 — "The Bottom Line" — Gold Grid Prose + CTA
// ============================================================================

function Section6Final() {
  return (
    <section className="relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 md:px-12">
        <H2 style={{ marginBottom: '1.25rem', textAlign: 'center' }}>The Bottom Line</H2>

        {/* Content panel with gold grid */}
        <div
          className="relative overflow-hidden rounded-xl p-6 sm:p-8 mb-8"
          style={{
            background: 'rgba(12,12,12,0.85)',
            border: '1px solid rgba(255,215,0,0.1)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,215,0,0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,215,0,0.015) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10">
            <p className="text-body mb-6 text-center">
              Choosing an eXp sponsor isn&apos;t about logos or promises. It&apos;s about what actually shows up after onboarding.
            </p>

            <ul className="space-y-2.5 mb-6 text-left max-w-[600px] mx-auto" style={{ listStyle: 'none', padding: 0, margin: '0 auto 1.5rem' }}>
              {BOTTOM_LINE_BULLETS.map((bullet, i) => (
                <li key={i} className="flex gap-2.5 text-body">
                  <span
                    className="mt-[6px] flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.4)' }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <p
              className="text-body text-center"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.15)',
              }}
            >
              If those things matter to you, structure is what makes support dependable over time.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <CTAButton href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>
            Join the Alliance
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ExpRealtySponsor() {
  // Handle hash scroll on mount (e.g. /exp-realty-sponsor#agent-portal-walkthrough)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Delay to let React hydrate and layout settle
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main id="main-content">
      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />

          {/* Agent Counter - viewport-aware (only renders desktop OR mobile counter) */}
          <AgentCounter />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
                "
                sizes="100vw"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 55%',
                  maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                }}
              />
            </div>
          </div>
          <div className="max-w-[2500px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>Smart Agent Alliance</H1>
              <Tagline className="mt-4" style={{ maxWidth: '1250px', marginLeft: 'auto', marginRight: 'auto' }} counterSuffix={<TaglineCounterSuffix />}>For agents who want more, without giving up independence.</Tagline>
              <p className="text-body mt-4" style={{ maxWidth: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
                Aligned incentives. We succeed only when you do.
              </p>
            </div>
          </div>

          {/* Counter Animation - Hydrates after initial render */}
          <CounterAnimation />
        </section>
      </StickyHeroWrapper>

      {/* Sections wrapper — 100px gap + 50px glass padding = 150px visual spacing */}
      <div className="flex flex-col" style={{ gap: '100px' }}>
        <Section1 />
        <Section3 />
        <ValueSection1_Launch />
        <ValueSection2_Marketing />
        <ValueSection3_Training />
        <ValueSection4_Attraction />
        <ValueSection5_Referrals />
        <Section2 />
        <SuccessStories />
        <MeetTheFounders />
        <Section6Final />
      </div>

    </main>
  );
}
