'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { H1, H2, Tagline, CTAButton, GlassPanel, GenericCard } from '@saa/shared/components/saa';
import { MeetTheFounders } from '@/app/components/sections/MeetTheFounders';
import { GrainCard } from '@saa/shared/components/saa/cards';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { AgentCounter, TaglineCounterSuffix } from '@/app/components/AgentCounter';
import { Ban, Building2, Wrench, Shield, Settings, GraduationCap, Users, Layers, Rocket, BarChart3, Link2, LifeBuoy, TrendingUp, UserCircle, Video, Megaphone, UserPlus, Download, Handshake, Sparkles, ArrowRight, type LucideIcon } from 'lucide-react';

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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body"
            style={{
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.2)',
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
const SECTION2_INTRO = 'At eXp Realty, sponsors are not required to provide any ongoing support. As a result, most never do.';
const SECTION2_SUBHEADING = 'SAA was designed to change that.';

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

const ORG_HEADING = 'Because Smart Agent Alliance is built as an organization, not a personality-driven sponsor:';
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

function BrowserMockup({ children, url = 'saabuildingblocks.com/agent-portal' }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{
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

      <div className="max-w-[1200px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs1FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <H2 style={{ marginBottom: '1rem', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>
            Launch Your Business With Clarity From Day One
          </H2>
        </div>

        {/* Two-column: text + mockup */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text side */}
          <div className="w-full md:w-1/2 space-y-6">
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
            <p className="text-body pt-2" style={{ color: '#9a9a9a', fontStyle: 'italic' }}>
              Move into production quickly with guided systems that remove guesswork from your launch.
            </p>
          </div>

          {/* Mockup side */}
          <div className="w-full md:w-1/2">
            <BrowserMockup url="saabuildingblocks.com/agent-portal/onboarding">
              <ScreenshotPlaceholder label="Portal Screenshot — Onboarding Dashboard" />
            </BrowserMockup>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================================
// VALUE SECTION 2 — "Generate Business Through Built-In Marketing & Lead Systems"
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
  'Link Page',
  'Lead Funnel',
  'Templates',
  'Analytics',
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
      `}</style>

      <div className="max-w-[1200px] mx-auto" style={{
        opacity: visible ? 1 : 0,
        animation: visible ? 'vs2FadeIn 0.6s ease-out' : 'none',
      }}>
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <H2 style={{ marginBottom: '1rem', fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)' }}>
            Generate Business Through Built-In Marketing &amp; Lead Systems
          </H2>
        </div>

        {/* Two-column: text + phone fan */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text side */}
          <div className="w-full md:w-[40%] space-y-6">
            <p className="text-body">
              Integrated marketing infrastructure built to create visibility and capture opportunity from day one.
            </p>
            <ul className="space-y-4">
              {[
                'Branded Link Page system',
                'Lead capture funnels',
                'Canva template library',
                'Performance analytics dashboard',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-body">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-body pt-2" style={{ color: '#9a9a9a', fontStyle: 'italic' }}>
              Everything works together to drive exposure, leads, and measurable results.
            </p>
          </div>

          {/* Phone fan */}
          <div className="w-full md:w-[60%] flex justify-center items-center">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              {PHONE_FAN_ITEMS.map((label, i) => {
                const count = PHONE_FAN_ITEMS.length;
                const mid = (count - 1) / 2;
                const offset = i - mid;
                const rotate = offset * 6;
                // Percentage-based positioning so phones scale with container
                const leftPercent = 50 + offset * 14;
                const topOffset = Math.abs(offset) * 3;
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: '22%',
                      left: `${leftPercent}%`,
                      top: `${topOffset}%`,
                      bottom: `${topOffset}%`,
                      transform: `translateX(-50%) rotate(${rotate}deg)`,
                      transformOrigin: 'bottom center',
                      zIndex: count - Math.abs(Math.round(offset)),
                    }}
                  >
                    <PhoneMockup>
                      <PhoneScreenPlaceholder label={label} />
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
  // Mobile: measure card content heights for smooth height transitions
  const mobRef0 = useRef<HTMLDivElement>(null);
  const mobRef1 = useRef<HTMLDivElement>(null);
  const [mobH, setMobH] = useState([300, 300]);

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

  // Mobile: measure content heights for smooth expand/collapse
  useEffect(() => {
    const measureMob = () => {
      const h0 = mobRef0.current?.scrollHeight || 0;
      const h1 = mobRef1.current?.scrollHeight || 0;
      if (h0 > 0 || h1 > 0) setMobH([h0 || 300, h1 || 300]);
    };
    measureMob();
    const ro = new ResizeObserver(measureMob);
    if (mobRef0.current) ro.observe(mobRef0.current);
    if (mobRef1.current) ro.observe(mobRef1.current);
    return () => ro.disconnect();
  }, []);

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
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
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

          {/* Mobile: stacked cards — same animations as desktop, height transitions */}
          <div className="md:hidden flex flex-col gap-3">
            {PANELS.map((panel, i) => {
              const isActive = active === i;
              const COLLAPSED = 65;
              const mobRefs = [mobRef0, mobRef1];
              return (
                <div key={panel.id} className="relative">
                  {/* Pulsing glow ring — hidden when inactive */}
                  <div
                    className="absolute -inset-[3px] rounded-2xl pointer-events-none"
                    style={{
                      border: `2px solid ${panel.color}50`,
                      boxShadow: isActive ? `0 0 12px 4px ${panel.color}44, 0 0 28px 8px ${panel.color}22` : 'none',
                      animation: isActive ? 'focusPulse 2.4s linear infinite' : 'none',
                      zIndex: 30,
                      opacity: isActive ? 1 : 0,
                      visibility: isActive ? 'visible' : 'hidden',
                      transition: 'opacity 0.9s ease, visibility 0.9s ease',
                    }}
                  />

                  {/* Card — active: grain bg, colored border; inactive: solid bg, subtle border */}
                  <div
                    className={`${isActive ? 'focus-card' : ''} rounded-2xl relative ${!isActive ? 'cursor-pointer' : ''}`}
                    onClick={() => !isActive && setActive(i)}
                    style={{
                      overflow: 'hidden',
                      height: isActive ? `${mobH[i] + 8}px` : `${COLLAPSED}px`,
                      ...(!isActive ? {
                        background: 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                      } : {}),
                      border: isActive ? `3px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive
                        ? `0 0 6px 2px ${panel.color}44, 0 0 20px 4px ${panel.color}22, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                      transition: 'height 1.15s cubic-bezier(0.3, 0.1, 0.3, 1), border-color 0.9s ease, box-shadow 0.9s ease',
                    }}
                  >
                    {/* Inner content — ref for height measurement */}
                    <div ref={mobRefs[i]} className="p-5">
                      {/* H2 title — slides down into place when active */}
                      <div style={{
                        transform: isActive ? 'translateY(0)' : 'translateY(-16px)',
                        opacity: isActive ? 1 : 0,
                        transition: isActive
                          ? 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1) 0.2s, opacity 0.85s ease 0.2s'
                          : 'transform 0.4s ease, opacity 0.3s ease',
                      }}>
                        <H2 theme={panel.theme} style={{ textAlign: 'left', marginBottom: '1rem', maxWidth: '2500px' }}>
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
                        {i === 0 ? <SAAContent /> : <SponsorshipContent />}
                      </div>
                    </div>

                    {/* Short label — horizontal text, slides off vertically on activation */}
                    <div
                      className="absolute inset-0 z-20 flex items-center justify-center"
                      style={{
                        pointerEvents: isActive ? 'none' : 'auto',
                        transform: isActive
                          ? `translateY(${i === 0 ? '-100%' : '100%'})`
                          : 'translateY(0)',
                        opacity: isActive ? 0 : 1,
                        transition: isActive
                          ? 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1), opacity 0.5s ease 0.2s'
                          : 'transform 0.85s cubic-bezier(0.3, 0.1, 0.3, 1) 0.25s, opacity 0.55s ease 0.2s',
                      }}
                    >
                      <H2 theme={panel.theme} style={{
                        marginBottom: 0,
                        fontSize: 'clamp(20px, 5vw, 28px)',
                      }}>
                        {panel.shortLabel}
                      </H2>
                    </div>
                  </div>
                </div>
              );
            })}
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

  const cards = [
    { label: 'Team-Built', icon: Building2 },
    { label: 'Zero Cost to Agents', icon: Shield },
    { label: 'Built to Last', icon: Layers },
  ];

  const mistyGoldBg = 'radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%), radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%), radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%), linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)';

  const darkCardBg = 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)';

  const renderContent = () => {
    switch (activeCard) {
      case 0:
        return (
          <ul className="space-y-3">
            {DIFFERENTIATORS.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0" style={{ color: '#ffd700', fontSize: '8px', lineHeight: '24px' }}>●</span>
                <span className="text-body">{d.text}</span>
              </li>
            ))}
          </ul>
        );
      case 1:
        return (
          <div className="space-y-3">
            {FINANCIAL_LINES.map((line, i) => (
              <p key={i} className="text-body">{line}</p>
            ))}
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
      case 2:
        return (
          <div className="space-y-3">
            <p className="text-body" style={{ color: '#b0b0b0' }}>
              {ORG_HEADING}
            </p>
            <ul className="space-y-3">
              {ORG_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0" style={{ color: '#ffd700', fontSize: '8px', lineHeight: '24px' }}>●</span>
                  <span className="text-body">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
          <p className="text-body mt-3 mx-auto" style={{ fontWeight: 600, maxWidth: '700px' }}>
            {SECTION2_SUBHEADING}
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {cards.map((card, idx) => {
            const isActive = activeCard === idx;
            const IconComp = card.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx)}
                className="relative rounded-xl md:rounded-2xl p-3 md:p-6 text-center overflow-hidden"
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
                    className="text-h6"
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
          })}
        </div>

        {/* Shared description panel */}
        <div className="mt-3 md:mt-4">
          <GrainCard padding="md" centered={false}>
            <div key={activeCard} className="section2-content-fade relative" style={{ minHeight: '200px' }}>
              {/* Watermark icon */}
              {(() => {
                const WatermarkIcon = cards[activeCard].icon;
                return (
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
                );
              })()}
              <div className="relative z-10">
                {renderContent()}
              </div>
            </div>
          </GrainCard>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3 — "What You Get Inside SAA" (Interactive Portal Showcase)
// Desktop: sidebar nav + video/animation content area
// Mobile: horizontal pill tabs + content below
// ============================================================================

function StreamVideo({ streamId, isActive }: { streamId: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null);
  const readyRef = useRef(false);

  // Load HLS source once on mount — never destroyed while component is mounted
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamId) return;

    const src = `${STREAM_BASE}/${streamId}/manifest/video.m3u8`;

    // Native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.load(); // Start buffering
      readyRef.current = true;
      return;
    }

    // HLS.js
    let cancelled = false;
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) return;

      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        startLevel: -1,
        capLevelToPlayerSize: false,
        minAutoBitrate: 900000,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        readyRef.current = true;
        // If this video is already the active one, start playing
        if (isActive) video.play().catch(() => {});
      });
    });

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamId]);

  // Play/pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="auto"
      className="s3-phone-video"
    />
  );
}

function Section3() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [isWalkthrough, setIsWalkthrough] = useState(false);
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeGroupRef = useRef(0); // mirror for event listener
  const group = FEATURE_GROUPS[activeGroup];

  // Compute cumulative start times for each section
  const sectionTimings = useRef(
    FEATURE_GROUPS.reduce<{ start: number; end: number }[]>((acc, g, i) => {
      const start = i === 0 ? 0 : acc[i - 1].end;
      const end = start + (g.duration || 30);
      acc.push({ start, end });
      return acc;
    }, [])
  ).current;

  // Keep ref in sync
  useEffect(() => { activeGroupRef.current = activeGroup; }, [activeGroup]);

  // Handle manual tab click — stops walkthrough
  const handleTabClick = useCallback((index: number) => {
    if (isWalkthrough) {
      setIsWalkthrough(false);
      setWalkthroughPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
    setActiveGroup(index);
  }, [isWalkthrough]);

  // Start walkthrough
  const startWalkthrough = useCallback(() => {
    setActiveGroup(0);
    setIsWalkthrough(true);
    setWalkthroughPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Toggle play/pause during walkthrough
  const toggleWalkthroughPlayback = useCallback(() => {
    if (walkthroughPlaying) {
      setWalkthroughPlaying(false);
      audioRef.current?.pause();
    } else {
      setWalkthroughPlaying(true);
      audioRef.current?.play().catch(() => {});
    }
  }, [walkthroughPlaying]);

  // Stop walkthrough
  const stopWalkthrough = useCallback(() => {
    setIsWalkthrough(false);
    setWalkthroughPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Jump to a specific chapter during walkthrough
  const jumpToChapter = useCallback((index: number) => {
    setActiveGroup(index);
    if (audioRef.current) {
      audioRef.current.currentTime = sectionTimings[index]?.start || 0;
      if (!walkthroughPlaying) {
        setWalkthroughPlaying(true);
        audioRef.current.play().catch(() => {});
      }
    }
  }, [sectionTimings, walkthroughPlaying]);

  // Audio-driven section switching — uses timeupdate for perfect sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isWalkthrough || !walkthroughPlaying) return;
      const t = audio.currentTime;
      const current = activeGroupRef.current;
      // Find which section the audio is in
      for (let i = 0; i < sectionTimings.length; i++) {
        if (t >= sectionTimings[i].start && t < sectionTimings[i].end) {
          if (i !== current) setActiveGroup(i);
          return;
        }
      }
    };

    const onEnded = () => stopWalkthrough();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isWalkthrough, walkthroughPlaying, sectionTimings, stopWalkthrough]);

  // Total walkthrough duration & progress
  const totalDuration = FEATURE_GROUPS.reduce((sum, g) => sum + (g.duration || 30), 0);
  const elapsedUpToCurrent = sectionTimings[activeGroup]?.start || 0;
  const currentDuration = FEATURE_GROUPS[activeGroup]?.duration || 30;

  return (
    <section className="relative" style={{ overflowAnchor: 'none' }}>
      <style>{`
        @keyframes portalFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .portal-content-fade {
          animation: portalFadeIn 0.4s ease-out;
        }
        .s3-phone-mockup {
          position: relative;
          background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
          border-radius: 24px;
          padding: 12px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.1),
            0 25px 50px -12px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .s3-phone-mockup::before { display: none; }
        .s3-phone-mockup::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        .s3-phone-screen {
          background: linear-gradient(180deg, #0a0a0a 0%, #151515 100%);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        .s3-phone-video {
          display: block;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* Cover the right-edge artifact line from the screen recordings */
        .s3-phone-screen::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 5px;
          background: #0d0d0d;
          z-index: 2;
          pointer-events: none;
          border-radius: 0 16px 16px 0;
        }
        .s3-pills::-webkit-scrollbar { display: none; }

        /* Walkthrough play button — rainbow border */
        @keyframes s3GradientFlow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
        .s3-tour-wrapper {
          position: relative;
          border-radius: 14px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .s3-tour-border,
        .s3-tour-glow {
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 14px;
          background: linear-gradient(45deg,
            #fb0094, #0000ff, #00ff00, #ffff00, #ff0000,
            #fb0094, #0000ff, #00ff00, #ffff00, #ff0000
          );
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: 0;
          animation: s3GradientFlow 20s linear infinite;
        }
        .s3-tour-glow {
          filter: blur(10px);
          opacity: 0.35;
          z-index: -1;
        }
        .s3-tour-wrapper:hover .s3-tour-glow {
          opacity: 0.55;
          filter: blur(16px);
        }
        .s3-tour-inner {
          position: relative;
          z-index: 1;
          border-radius: 12px;
          background: linear-gradient(180deg, rgb(14,14,14) 0%, rgb(10,10,10) 100%);
          padding: 8px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .s3-tour-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background:
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,215,0,0.025) 2px, rgba(255,215,0,0.025) 4px),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px);
          pointer-events: none;
        }

        /* Walkthrough controls bar */
        .s3-controls-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 12px;
          background: rgba(10,10,10,0.95);
          border: 1px solid rgba(255,215,0,0.15);
        }
        .s3-progress-track {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
        }
        .s3-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #e6c200);
          border-radius: 2px;
          transition: width 0.3s linear;
        }
        .s3-ctrl-btn {
          background: none;
          border: none;
          color: #e5e4dd;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .s3-ctrl-btn:hover { color: #ffd700; }
        .s3-chapter-btn:hover {
          color: #e5e4dd !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
      `}</style>

      {/* Hidden audio element for walkthrough voiceover */}
      <audio ref={audioRef} src={WALKTHROUGH_AUDIO_URL} preload="auto" />

      {/* Champagne GlassPanel wraps entire section — heading + portal showcase */}
      <GlassPanel variant="champagne" noBlur className="py-[50px]">

      {/* Section heading */}
      <div className="text-center max-w-[1400px] mx-auto px-4">
        <H2>
          What You Get Inside SAA
        </H2>
        <p className="text-body max-w-[950px] mx-auto" style={{ marginTop: '-1.5rem', marginBottom: '2rem' }}>
          As an SAA agent, you&apos;re also part of the Wolf Pack &mdash; our team within eXp Realty. Your Agent Portal brings everything together in one place.
        </p>
      </div>

      {/* Value overview — benefit-framed summary above the portal demo */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 pb-4 md:pb-6">
        {(() => {
          const cards = [
            {
              icon: Rocket,
              title: 'Guided Launch',
              text: 'Structured onboarding, strategy sessions, and step-by-step setup so you\u2019re producing from day one \u2014 not guessing.',
              color: '#ffd700',
            },
            {
              icon: BarChart3,
              title: 'Marketing & Lead Systems',
              text: 'A branded link page, lead capture pages, Canva templates, and analytics \u2014 integrated tools that drive visibility and track results.',
              color: '#00bfff',
            },
            {
              icon: GraduationCap,
              title: 'Training & Development',
              text: 'Five premium courses, weekly mastermind calls, and new agent resources \u2014 real training led by agents who are actively producing.',
              color: '#ffd700',
            },
            {
              icon: TrendingUp,
              title: 'Growth & Attraction',
              text: 'A passive attraction funnel and referral network built into your brand presence \u2014 expand beyond production if and when you choose.',
              color: '#00bfff',
            },
            {
              icon: LifeBuoy,
              title: 'Ongoing Support',
              text: 'Broker rooms, leadership contacts, and team support channels \u2014 centralized so you always know where to go.',
              color: '#ffd700',
            },
          ];
          const renderCard = (item: typeof cards[0], i: number) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl p-5"
              style={{
                background: 'rgba(12,12,12,0.7)',
                border: `1px solid ${item.color === '#ffd700' ? 'rgba(255,215,0,0.1)' : 'rgba(0,191,255,0.1)'}`,
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(${item.color === '#ffd700' ? 'rgba(255,215,0,0.01)' : 'rgba(0,191,255,0.01)'} 1px, transparent 1px),
                    linear-gradient(90deg, ${item.color === '#ffd700' ? 'rgba(255,215,0,0.01)' : 'rgba(0,191,255,0.01)'} 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <item.icon size={18} style={{ color: item.color, flexShrink: 0 }} />
                  <h3 className="text-h6">
                    {item.title}
                  </h3>
                </div>
                <p className="text-body">
                  {item.text}
                </p>
              </div>
            </div>
          );
          return (
            <>
              {/* Top row: 3 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {cards.slice(0, 3).map(renderCard)}
              </div>
              {/* Bottom row: 2 cards spanning full width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
                {cards.slice(3).map((item, i) => renderCard(item, i + 3))}
              </div>
            </>
          );
        })()}
      </div>

      {/* Portal walkthrough label */}
      <div id="agent-portal-walkthrough" className="text-center max-w-[1400px] mx-auto pb-2 md:pb-3 px-4" style={{ paddingTop: '40px' }}>
        <H2 style={{ fontSize: 'clamp(27px, calc(25.36px + 0.65vw), 45px)', marginBottom: '0.5rem' }}>
          Agent Portal Walkthrough
        </H2>
        <p className="text-body max-w-[950px] mx-auto">
          The Agent Portal is your central hub for everything SAA and Wolf Pack &mdash; onboarding, marketing tools, training, templates, and team support, all in one place.
        </p>
      </div>

      {/* Portal showcase frame */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 md:px-12" style={{ marginTop: '15px' }}>
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(15,15,15,0.95) 0%, rgba(10,10,10,0.98) 100%)',
            border: '1px solid rgba(255,215,0,0.15)',
            boxShadow: `
              0 0 0 1px rgba(255,215,0,0.05),
              0 8px 32px rgba(0,0,0,0.5),
              0 2px 8px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Top gold accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, rgba(255,215,0,0.3) 30%, rgba(255,215,0,0.4) 50%, rgba(255,215,0,0.3) 70%, transparent 95%)',
            }}
          />

          {/* Crosshatch texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 6px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 6px)
              `,
              backgroundSize: '16px 16px',
            }}
          />

          {/* ── Walkthrough Play Button / Chapter Nav header ── */}
          <div className="relative z-20" style={{ background: 'rgba(12,12,12,0.5)' }}>
            <div className="flex justify-center items-center" style={{ padding: '12px 16px', minHeight: '52px' }}>
              {/* Tour button — fades out when walkthrough starts */}
              <div
                className="s3-tour-wrapper"
                onClick={!isWalkthrough ? startWalkthrough : undefined}
                style={{
                  opacity: isWalkthrough ? 0 : 1,
                  filter: isWalkthrough ? 'blur(8px)' : 'none',
                  transform: isWalkthrough ? 'scale(0.95)' : 'scale(1)',
                  transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
                  position: isWalkthrough ? 'absolute' : 'relative',
                  pointerEvents: isWalkthrough ? 'none' : 'auto',
                  zIndex: isWalkthrough ? 0 : 1,
                }}
              >
                <div className="s3-tour-border" />
                <div className="s3-tour-glow" />
                <div className="s3-tour-inner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd700" stroke="none">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  <span style={{
                    fontFamily: 'var(--font-taskor)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.75)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    Watch the Full Tour
                  </span>
                </div>
              </div>

              {/* Chapter nav — fades in when walkthrough starts */}
              <div
                className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center"
                style={{
                  opacity: isWalkthrough ? 1 : 0,
                  filter: isWalkthrough ? 'none' : 'blur(8px)',
                  transform: isWalkthrough ? 'scale(1)' : 'scale(0.95)',
                  transition: 'opacity 0.4s ease 0.15s, filter 0.4s ease 0.15s, transform 0.4s ease 0.15s',
                  pointerEvents: isWalkthrough ? 'auto' : 'none',
                  position: isWalkthrough ? 'relative' : 'absolute',
                  zIndex: isWalkthrough ? 1 : 0,
                }}
              >
                {/* Play/Pause */}
                <button type="button" className="s3-ctrl-btn" onClick={toggleWalkthroughPlayback} style={{ marginRight: '4px' }}>
                  {walkthroughPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                  )}
                </button>

                {/* Chapter buttons — compact numbered pills */}
                {FEATURE_GROUPS.map((g, i) => {
                  const isActiveChapter = activeGroup === i;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => jumpToChapter(i)}
                      className="s3-chapter-btn"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        fontSize: '12px',
                        fontFamily: 'var(--font-taskor)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActiveChapter ? '#0a0a0a' : '#a8a7a0',
                        background: isActiveChapter ? 'linear-gradient(135deg, #ffd700, #e6c200)' : 'rgba(255,255,255,0.06)',
                        border: isActiveChapter ? '1px solid rgba(255,215,0,0.6)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isActiveChapter ? '0 0 10px rgba(255,215,0,0.25)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}

                {/* Stop */}
                <button type="button" className="s3-ctrl-btn" onClick={stopWalkthrough} style={{ marginLeft: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                </button>
              </div>
            </div>
            {/* Bottom separator line */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row">
            {/* ── Desktop Sidebar ── */}
            <nav
              className="hidden lg:flex flex-col flex-shrink-0 py-4"
              style={{
                width: '220px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(12,12,12,0.5)',
              }}
            >
              {SIDEBAR_ITEMS.map((item, i) => {
                const isInActiveGroup = item.groupIndex === activeGroup;
                const Icon = item.icon;

                return (
                  <React.Fragment key={i}>
                    <button
                      type="button"
                      onClick={() => handleTabClick(item.groupIndex)}
                      className="flex items-center gap-3 px-5 py-2.5 text-left w-full relative"
                      style={{
                        color: isInActiveGroup ? '#ffd700' : '#a8a7a0',
                        background: isInActiveGroup ? 'rgba(255,215,0,0.05)' : 'transparent',
                        transition: 'color 0.3s ease, background 0.3s ease',
                      }}
                    >
                      {/* Gold left accent bar */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm"
                        style={{
                          width: '3px',
                          height: isInActiveGroup ? '60%' : '0%',
                          background: '#ffd700',
                          boxShadow: isInActiveGroup ? '0 0 8px rgba(255,215,0,0.4)' : 'none',
                          transition: 'height 0.3s ease, box-shadow 0.3s ease',
                        }}
                      />
                      <Icon
                        size={16}
                        style={{
                          flexShrink: 0,
                          filter: isInActiveGroup ? 'drop-shadow(0 0 4px rgba(255,215,0,0.4))' : 'none',
                          transition: 'filter 0.3s ease',
                        }}
                      />
                      <span
                        className="text-body"
                        style={{
                          fontSize: '14px',
                          fontWeight: isInActiveGroup ? 500 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>

            {/* ── Mobile Pill Tabs ── */}
            <div
              className="s3-pills lg:hidden flex gap-2 px-4 py-3 overflow-x-auto"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {FEATURE_GROUPS.map((g, i) => {
                const isActive = activeGroup === i;
                const firstItem = SIDEBAR_ITEMS.find(si => si.groupIndex === i);
                const Icon = firstItem?.icon || Rocket;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleTabClick(i)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full flex-shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isActive ? '#0a0a0a' : '#a8a7a0',
                      background: isActive
                        ? 'linear-gradient(135deg, #ffd700, #e6c200)'
                        : 'rgba(255,255,255,0.06)',
                      border: isActive
                        ? '1px solid rgba(255,215,0,0.6)'
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isActive
                        ? '0 0 12px rgba(255,215,0,0.3)'
                        : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon size={14} />
                    <span>{g.heading.split(/[,\u2014\u2019]/, 1)[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Content Area ── */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 flex-1 items-center lg:items-start">
                {/* Phone mockup — all videos mounted, only active one visible */}
                <div className="flex-shrink-0 flex justify-center">
                  <div className="s3-phone-mockup" style={{ width: '318px', padding: '6px' }}>
                    <div className="s3-phone-screen" style={{ aspectRatio: '9/16' }}>
                      {FEATURE_GROUPS.map((g, i) => (
                        g.streamId ? (
                          <div
                            key={g.id}
                            style={{
                              position: i === 0 ? 'relative' : 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              opacity: activeGroup === i ? 1 : 0,
                              transition: 'opacity 0.3s ease',
                              pointerEvents: activeGroup === i ? 'auto' : 'none',
                            }}
                          >
                            <StreamVideo
                              streamId={g.streamId}
                              isActive={activeGroup === i}
                            />
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heading + bullet points — stable-height wrapper prevents mobile scroll jumps when content changes */}
                <div className="flex-1 flex flex-col justify-center" style={{ minHeight: '280px' }}>
                <div key={activeGroup} className="portal-content-fade flex flex-col justify-center text-center lg:text-left">
                  <h3 className="text-h6" style={{ marginBottom: '0.75rem' }}>
                    {group.heading}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-caption)', lineHeight: 'var(--line-height-caption)', fontWeight: 'var(--font-weight-caption)', fontFamily: 'var(--font-family-caption)', color: 'var(--text-color-caption)', marginBottom: '0.75rem' }}>
                    {group.description}
                  </p>
                  <ul className="space-y-2 text-left" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {group.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex gap-2.5 text-body"
                        style={{ fontSize: 'clamp(16px, calc(15.09px + 0.36vw), 21px)' }}
                      >
                        <span style={{ color: '#ffd700', flexShrink: 0, marginTop: '2px' }}>{'\u2022'}</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </GlassPanel>
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
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>Smart Agent Alliance</H1>
              <Tagline className="mt-4" style={{ maxWidth: '1250px', marginLeft: 'auto', marginRight: 'auto' }} counterSuffix={<TaglineCounterSuffix />}>For agents who want more, without giving up independence.</Tagline>
              <p className="text-body mt-4" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
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
        <Section2 />
        <Section3 />
        <ValueSection1_Launch />
        <ValueSection2_Marketing />
        <Section4Final />
        <MeetTheFounders />
        <Section6Final />
      </div>

    </main>
  );
}
