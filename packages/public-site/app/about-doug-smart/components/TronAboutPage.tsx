'use client';

import { useRef, useEffect } from 'react';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { IconCard } from '@saa/shared/components/saa/cards';
import { CyberFrame } from '@saa/shared/components/saa/media';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { ClipPathReveal, type ClipPathRevealItem } from '@saa/shared/components/saa/scroll-animations/ClipPathReveal';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import Image from 'next/image';
import { useTronAudio } from './useTronAudio';
import { TronGrid } from './TronGrid';

const AUDIO_URL = '/audio/doug-theme.mp3';
const AUDIO_START = 5;
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

// ── SVG Icons (larger, multi-color) ─────────────────────────────

function IconPortal() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#00bfff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="36" height="32" rx="3" />
      <path d="M6 16h36" />
      <path d="M18 16v24" />
      <rect x="22" y="22" width="16" height="6" rx="1" opacity="0.5" />
      <rect x="22" y="32" width="10" height="6" rx="1" opacity="0.5" />
    </svg>
  );
}

function IconAttraction() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#00cc66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="16" r="8" />
      <path d="M8 42c0-8.8 7.2-16 16-16s16 7.2 16 16" />
      <path d="M36 16l6 6M42 16l-6 6" opacity="0.6" />
    </svg>
  );
}

function IconAutomation() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#a050ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 6L12 28h12L22 42l16-22H26L26 6z" fill="rgba(160,80,255,0.1)" />
    </svg>
  );
}

function IconPlatform() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="24" cy="24" r="18" />
      <ellipse cx="24" cy="24" rx="8" ry="18" />
      <path d="M6 24h36M8 14h32M8 34h32" />
    </svg>
  );
}

// ── ASCII Art (perfectly symmetrical - 64 chars inner) ──────────

const SYSTEM_STATUS = `┌──────────────────────────────────────────────────────────────┐
│  saa-platform :: system overview                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  > PLATFORM     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ONLINE         │
│  > API          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  114 ROUTES     │
│  > PORTAL       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  813KB SPA      │
│  > CONTROLLER   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  6 TABS         │
│  > AUTOMATIONS  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  24/7           │
│  > ANALYTICS    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  TRACKING       │
│                                                              │
│  stack: next.js + react + typescript + supabase              │
│  infra: cloudflare edge (300+ nodes) + vps + docker          │
│  deploys: zero-downtime, ci/cd, global cdn                   │
│                                                              │
│  > builder: doug smart                                       │
│  > status: all systems operational_                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘`;

// ── Stats - things realtors actually care about ─────────────────

const STATS: { value: string; label: string; theme: 'blue' | 'purple' | 'green' | 'yellow' }[] = [
  { value: 'Top 1%', label: 'eXp Attraction Network', theme: 'yellow' },
  { value: 'Solo', label: 'Built The Entire Platform', theme: 'blue' },
  { value: '24/7', label: 'Automated Infrastructure', theme: 'purple' },
  { value: 'Global', label: '300+ Edge Servers', theme: 'green' },
];

// ── What I Built (reframed for agent value, removed Master Controller) ──

const SYSTEMS_BUILT: ClipPathRevealItem[] = [
  {
    icon: <IconPortal />,
    title: 'The Agent Portal',
    subtitle: 'Your Command Center',
    description: 'Onboarding flows, analytics dashboards, marketing templates, elite courses, agent attraction tools, customizable link pages - everything you need to run your business, in one place.',
    color: '#00bfff',
  },
  {
    icon: <IconAttraction />,
    title: 'Agent Attraction Pages',
    subtitle: 'Your Recruiting Machine',
    description: 'Dynamic recruiting pages that work while you sleep. Custom video players, real-time tracking, conversion analytics - your personal landing page built to attract and convert new agents.',
    color: '#00cc66',
  },
  {
    icon: <IconAutomation />,
    title: 'Automation Engine',
    subtitle: 'Never Stops Working',
    description: 'Email sequences that nurture leads around the clock. CRM sync, cron-based notifications, guest pass automations - systems that run your follow-up so you can focus on selling.',
    color: '#a050ff',
  },
  {
    icon: <IconPlatform />,
    title: 'The Entire Platform',
    subtitle: 'Built From Scratch',
    description: 'Dual-deployment architecture across 300+ global edge servers. Zero-downtime deploys, CI/CD pipelines, enterprise-grade infrastructure - all designed, coded, and maintained by one developer.',
    color: '#ffd700',
  },
];

// ── Dark glass card wrapper ─────────────────────────────────────

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(12,12,18,0.92) 0%, rgba(8,8,14,0.95) 100%)',
        border: '1px solid rgba(0,212,255,0.08)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </div>
  );
}

// ── Frequency Visualizer ────────────────────────────────────────

function FrequencyBars({ analyserRef }: { analyserRef: React.MutableRefObject<AnalyserNode | null> }) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = barsRef.current;
    if (!container) return;
    let raf = 0;

    const bars = Array.from(container.children) as HTMLDivElement[];
    const barCount = bars.length;

    const update = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        raf = requestAnimationFrame(update);
        return;
      }

      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);

      const step = Math.floor(data.length / barCount);
      for (let i = 0; i < barCount; i++) {
        const val = data[i * step] / 255;
        const height = Math.max(4, val * 100);
        bars[i].style.height = height + '%';
        const t = i / (barCount - 1);
        if (t < 0.33) {
          bars[i].style.backgroundColor = `rgba(0,212,255,${0.4 + val * 0.6})`;
          bars[i].style.boxShadow = `0 0 ${4 + val * 8}px rgba(0,212,255,${val * 0.5})`;
        } else if (t < 0.66) {
          bars[i].style.backgroundColor = `rgba(160,80,255,${0.4 + val * 0.6})`;
          bars[i].style.boxShadow = `0 0 ${4 + val * 8}px rgba(160,80,255,${val * 0.5})`;
        } else {
          bars[i].style.backgroundColor = `rgba(0,255,136,${0.4 + val * 0.6})`;
          bars[i].style.boxShadow = `0 0 ${4 + val * 8}px rgba(0,255,136,${val * 0.5})`;
        }
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [analyserRef]);

  return (
    <div
      ref={barsRef}
      className="flex items-end justify-center gap-[3px] h-24 md:h-32"
      style={{ width: 'fit-content', margin: '0 auto' }}
    >
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className="rounded-t-sm transition-none"
          style={{
            width: '5px',
            height: '4%',
            backgroundColor: 'rgba(0,212,255,0.3)',
            minHeight: '2px',
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────

export function TronAboutPage() {
  const { isPlaying, toggle, bandsRef, containerRef, analyserRef, initTimeRef } = useTronAudio(AUDIO_URL, AUDIO_START);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        '--ab': '0',
        '--am': '0',
        '--ah': '0',
      } as React.CSSProperties}
    >
      {/* TRON Grid Background */}
      <TronGrid bandsRef={bandsRef} initTimeRef={initTimeRef} />

      {/* Feathered dark overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `linear-gradient(
            180deg,
            rgba(5,5,12,0.7) 0%,
            rgba(5,5,12,0.3) 8%,
            transparent 20%,
            transparent 50%,
            rgba(5,5,12,0.15) 70%,
            rgba(5,5,12,0.5) 85%,
            rgba(5,5,12,0.75) 100%
          )`,
        }}
      />

      <main id="main-content" className="relative" style={{ zIndex: 2 }}>

        {/* ━━━ HERO ━━━ */}
        <section className="relative min-h-[100dvh] flex flex-col px-4 pt-32 md:pt-40">
          {/* Centered content: H1, tagline, play button */}
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <H1 theme="cyan">DOUG SMART</H1>

            <Tagline style={{ fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
              The developer behind every system on this platform
            </Tagline>

            {/* TRON Disc Play Button */}
            <div className="mt-8 md:mt-12">
              <button
                onClick={toggle}
                className="group relative mx-auto block focus:outline-none"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-28 md:h-28 mx-auto">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(0,212,255,0.35)" strokeWidth="1.5" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="rgba(160,80,255,0.5)" strokeWidth="2" strokeDasharray="8 16"
                    className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}
                    style={{ transformOrigin: 'center' }}
                  />
                  <circle cx="60" cy="60" r="44" fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.25)" strokeWidth="1" />
                  {isPlaying ? (
                    <>
                      <rect x="44" y="40" width="10" height="40" rx="2" fill="#00d4ff" />
                      <rect x="66" y="40" width="10" height="40" rx="2" fill="#00d4ff" />
                    </>
                  ) : (
                    <polygon points="48,36 48,84 82,60" fill="#00d4ff" />
                  )}
                </svg>
                <span
                  className="block mt-3 text-xs tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'var(--font-taskor)' }}
                >
                  {isPlaying ? 'PLAYING' : 'INITIALIZE AUDIO'}
                </span>
              </button>
            </div>
          </div>

          {/* Frequency bars pinned to bottom of hero */}
          <div className="pb-16 pt-6">
            <FrequencyBars analyserRef={analyserRef} />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* ━━━ SYSTEM STATUS ASCII ART ━━━ */}
        <section className="relative py-20 md:py-28">
          <GlassCard className="max-w-4xl mx-auto px-6 py-10 md:px-10 md:py-14">
            <div className="text-center mb-5">
              <H2 theme="blue">System Status</H2>
            </div>
            <div className="overflow-x-auto">
              <pre
                className="font-mono text-[0.5rem] sm:text-xs md:text-sm leading-relaxed mx-auto whitespace-pre"
                style={{
                  color: 'rgba(0,212,255,0.85)',
                  textShadow: '0 0 5px rgba(0,212,255,0.3), 0 0 10px rgba(0,212,255,0.12)',
                  width: 'fit-content',
                }}
              >
                {SYSTEM_STATUS}
              </pre>
            </div>
          </GlassCard>
        </section>

        {/* ━━━ STATS (IconCards) ━━━ */}
        <section className="relative py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4 md:gap-6">
            {STATS.map((stat) => (
              <IconCard key={stat.label} theme={stat.theme} hover centered>
                <div
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold"
                  style={{ fontFamily: 'var(--font-taskor)' }}
                >
                  {stat.value}
                </div>
                <p className="text-body mt-1 opacity-70">{stat.label}</p>
              </IconCard>
            ))}
          </div>
        </section>

        {/* ━━━ PROFILE + BIO ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <GlassCard className="max-w-5xl mx-auto p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Photo */}
              <div className="lg:w-2/5 flex justify-center">
                <div className="w-[280px] md:w-[340px]">
                  <CyberFrame variant="green" className="cyber-frame-block">
                    <Image
                      src={DOUG_PROFILE_IMAGE}
                      alt="Doug Smart"
                      width={400}
                      height={400}
                      className="object-cover"
                      sizes="(max-width: 768px) 280px, 340px"
                    />
                  </CyberFrame>
                </div>
              </div>

              {/* Bio */}
              <div className="lg:w-3/5 space-y-6">
                <h3
                  className="text-h4 font-bold"
                  style={{
                    color: '#00d4ff',
                    textShadow: '0 0 5px rgba(0,212,255,0.3), 0 0 10px rgba(0,212,255,0.12)',
                    fontFamily: 'var(--font-taskor)',
                  }}
                >
                  The Builder
                </h3>
                <p className="text-body" style={{ color: '#dcdbd5' }}>
                  Top 1% eXp team builder and the architect behind Smart Agent Alliance&apos;s
                  entire digital infrastructure. Every page on this site, every automation
                  running in the background, every tool agents use daily - built from scratch
                  by one developer.
                </p>
                <p className="text-body" style={{ color: '#dcdbd5' }}>
                  With a Bachelor&apos;s in Industrial Design and four years building
                  multi-million dollar homes during college, Doug developed the work ethic and
                  attention to detail he now applies to building systems for agents. The result:
                  a full-stack platform that gives our team a genuine competitive edge in their
                  markets.
                </p>
                <p className="text-body" style={{ color: '#dcdbd5' }}>
                  Doug specializes in passive revenue systems, branding, and marketing
                  automation. If it&apos;s digital and it helps agents win, he built it.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ━━━ WHAT I BUILT ━━━ */}
        <div className="relative">
          <ClipPathReveal
            items={SYSTEMS_BUILT}
            header={<H2 theme="blue">What I Built</H2>}
          />
        </div>

        {/* ━━━ CTA ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <GlassCard className="max-w-3xl mx-auto p-8 md:p-12 text-center">
            <H2 theme="blue">Ready to Level Up?</H2>
            <p className="text-body mt-6 mb-10" style={{ color: '#dcdbd5' }}>
              Join The Alliance and get access to the digital infrastructure
              that powers top-producing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/our-exp-team/">
                Meet The Team
              </CTAButton>
            </div>
          </GlassCard>
        </section>
      </main>

      {/* ━━━ STYLES ━━━ */}
      <style jsx global>{`
        .cyber-frame-block {
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
