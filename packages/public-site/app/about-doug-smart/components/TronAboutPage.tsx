'use client';

import { useRef, useEffect } from 'react';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { CyberCard } from '@saa/shared/components/saa/cards';
import { NeonCard } from '@saa/shared/components/saa/cards';
import { ProfileCyberFrame } from '@saa/shared/components/saa/media';
import { DiagonalWipeReveal, type DiagonalWipeRevealItem } from '@saa/shared/components/saa/scroll-animations/DiagonalWipeReveal';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import Image from 'next/image';
import { useTronAudio } from './useTronAudio';
import { TronGrid } from './TronGrid';
import {
  Trophy,
  Code2,
  Zap,
  Globe,
  LayoutDashboard,
  UserPlus,
  Workflow,
  Server,
} from 'lucide-react';

const AUDIO_URL = '/audio/doug-theme.mp3';
const AUDIO_START = 5;
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

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

// ── Stats ─────────────────────────────────────────────────────

const STATS: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: 'Top 1%',
    label: 'eXp Attraction Network',
    icon: <Trophy size={48} />,
    color: '#ffd700',
  },
  {
    value: 'Solo',
    label: 'Built The Entire Platform',
    icon: <Code2 size={48} />,
    color: '#00d4ff',
  },
  {
    value: '24/7',
    label: 'Automated Infrastructure',
    icon: <Zap size={48} />,
    color: '#a050ff',
  },
  {
    value: '300+',
    label: 'Global Edge Servers',
    icon: <Globe size={48} />,
    color: '#00cc66',
  },
];

// ── Systems Built ─────────────────────────────────────────────

const SYSTEMS_BUILT: DiagonalWipeRevealItem[] = [
  {
    icon: <LayoutDashboard size={36} color="#00bfff" />,
    title: 'The Agent Portal',
    subtitle: 'Your Command Center',
    description: 'Onboarding flows, analytics dashboards, marketing templates, elite courses, agent attraction tools, customizable link pages - everything you need to run your business, in one place.',
  },
  {
    icon: <UserPlus size={36} color="#00cc66" />,
    title: 'Agent Attraction Pages',
    subtitle: 'Your Recruiting Machine',
    description: 'Dynamic recruiting pages that work while you sleep. Custom video players, real-time tracking, conversion analytics - your personal landing page built to attract and convert new agents.',
  },
  {
    icon: <Workflow size={36} color="#a050ff" />,
    title: 'Automation Engine',
    subtitle: 'Never Stops Working',
    description: 'Email sequences that nurture leads around the clock. CRM sync, cron-based notifications, guest pass automations - systems that run your follow-up so you can focus on selling.',
  },
  {
    icon: <Server size={36} color="#ffd700" />,
    title: 'The Entire Platform',
    subtitle: 'Built From Scratch',
    description: 'Dual-deployment architecture across 300+ global edge servers. Zero-downtime deploys, CI/CD pipelines, enterprise-grade infrastructure - all designed, coded, and maintained by one developer.',
  },
];

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

        {/* ━━━ SYSTEM STATUS TERMINAL ━━━ */}
        <section className="relative py-20 md:py-28">
          <CyberCard padding="xl" centered={false} className="max-w-4xl mx-auto">
            <div className="terminal-wrapper relative overflow-hidden rounded-lg">
              {/* Scanline overlay */}
              <div className="terminal-scanlines absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />
              {/* Sweep highlight */}
              <div className="terminal-sweep absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />

              {/* Terminal prompt */}
              <div
                className="font-mono text-[0.6rem] sm:text-xs mb-4 tracking-wider"
                style={{ color: 'rgba(0,212,255,0.5)' }}
              >
                {'> SYSTEM DIAGNOSTIC_'}
              </div>

              {/* Terminal content */}
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
            </div>
          </CyberCard>
        </section>

        {/* ━━━ STATS GRID ━━━ */}
        <section className="relative py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((stat) => (
              <CyberCard key={stat.label} padding="lg" centered>
                <div
                  className="mb-3"
                  style={{
                    color: stat.color,
                    filter: `drop-shadow(0 0 8px ${stat.color}80)`,
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold"
                  style={{ fontFamily: 'var(--font-taskor)', color: '#e5e4dd' }}
                >
                  {stat.value}
                </div>
                <p
                  className="mt-1"
                  style={{ color: '#dcdbd5', opacity: 0.7, fontFamily: 'var(--font-amulya)' }}
                >
                  {stat.label}
                </p>
                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: stat.color,
                    boxShadow: `0 0 12px ${stat.color}60, 0 0 4px ${stat.color}40`,
                  }}
                />
              </CyberCard>
            ))}
          </div>
        </section>

        {/* ━━━ PROFILE + BIO ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Photo with radial glow halo */}
            <div className="lg:w-2/5 flex justify-center">
              <div className="relative">
                {/* Radial glow halo behind frame */}
                <div className="profile-halo absolute inset-0" />
                <ProfileCyberFrame size="xl" index={0}>
                  <Image
                    src={DOUG_PROFILE_IMAGE}
                    alt="Doug Smart"
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </ProfileCyberFrame>
              </div>
            </div>

            {/* Bio in NeonCard */}
            <div className="lg:w-3/5">
              <NeonCard padding="lg" centered={false}>
                <H2 theme="blue">The Builder</H2>
                <div className="space-y-5 mt-6">
                  <p style={{ color: '#dcdbd5', fontFamily: 'var(--font-amulya)' }}>
                    Top 1% eXp team builder and the architect behind Smart Agent Alliance&apos;s
                    entire digital infrastructure. Every page on this site, every automation
                    running in the background, every tool agents use daily - built from scratch
                    by one developer.
                  </p>
                  <p style={{ color: '#dcdbd5', fontFamily: 'var(--font-amulya)' }}>
                    With a Bachelor&apos;s in Industrial Design and four years building
                    multi-million dollar homes during college, Doug developed the work ethic and
                    attention to detail he now applies to building systems for agents. The result:
                    a full-stack platform that gives our team a genuine competitive edge in their
                    markets.
                  </p>
                  <p style={{ color: '#dcdbd5', fontFamily: 'var(--font-amulya)' }}>
                    Doug specializes in passive revenue systems, branding, and marketing
                    automation. If it&apos;s digital and it helps agents win, he built it.
                  </p>
                </div>
              </NeonCard>
            </div>
          </div>
        </section>

        {/* ━━━ SYSTEMS I BUILT ━━━ */}
        <div className="relative">
          <DiagonalWipeReveal
            cards={SYSTEMS_BUILT}
            header={<H2 theme="blue">Systems I Built</H2>}
            showProgressBar={false}
          />
        </div>

        {/* ━━━ CTA ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          {/* Cyan separator line */}
          <div
            className="max-w-3xl mx-auto mb-12 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)',
              boxShadow: '0 0 8px rgba(0,212,255,0.2)',
            }}
          />
          <NeonCard padding="xl" centered className="max-w-3xl mx-auto">
            <H2 theme="gold">Ready to Level Up?</H2>
            <p
              className="mt-6 mb-10"
              style={{ color: '#dcdbd5', fontFamily: 'var(--font-amulya)' }}
            >
              Join The Alliance and get access to the digital infrastructure
              that powers top-producing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/our-exp-team/">
                Meet The Team
              </CTAButton>
            </div>
          </NeonCard>
        </section>
      </main>

      {/* ━━━ STYLES ━━━ */}
      <style jsx global>{`
        /* Terminal scanlines */
        .terminal-scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 212, 255, 0.03) 2px,
            rgba(0, 212, 255, 0.03) 3px
          );
        }

        /* Terminal sweep highlight */
        .terminal-sweep {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 212, 255, 0.06) 45%,
            rgba(0, 212, 255, 0.1) 50%,
            rgba(0, 212, 255, 0.06) 55%,
            transparent 100%
          );
          animation: terminalSweep 4s ease-in-out infinite;
        }

        @keyframes terminalSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        /* Profile glow halo */
        .profile-halo {
          background: radial-gradient(
            circle at center,
            rgba(0, 212, 255, 0.2) 0%,
            rgba(0, 212, 255, 0.08) 40%,
            transparent 70%
          );
          animation: haloPulse 3s ease-in-out infinite;
          transform: scale(1.5);
          border-radius: 50%;
        }

        @keyframes haloPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
