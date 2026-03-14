'use client';

import { useRef, useEffect, useState } from 'react';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import Image from 'next/image';
import { useTronAudio } from './useTronAudio';
import { TronGrid } from './TronGrid';

const AUDIO_URL = '/audio/doug-theme.mp3';
const AUDIO_START = 5;
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

const SYSTEM_STATUS = `┌──────────────────────────────────────────────────────────────┐
│  saa-platform :: system overview                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  > PLATFORM     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ONLINE         │
│  > API          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  114 ROUTES     │
│  > PORTAL       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  813KB SPA      │
│  > AUTOMATIONS  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  24/7           │
│  > ANALYTICS    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  TRACKING       │
│  > CDN          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  300+ NODES     │
│                                                              │
│  stack: next.js + astro + react + typescript + supabase       │
│  infra: cloudflare edge (300+ nodes) + vps + docker          │
│  deploys: zero-downtime, ci/cd, global cdn                   │
│                                                              │
│  > builder: doug smart                                       │
│  > status: all systems operational_                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘`;

const TERMINAL_LINES = SYSTEM_STATUS.split('\n');

// ══════════════════════════════════════════════════════════════
// CUSTOM TRON SVG ICONS - Stats
// ══════════════════════════════════════════════════════════════

function IconTrophy() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M20,12 L18,32 C18,38 24,42 32,42 C40,42 46,38 46,32 L44,12 Z" />
      <path d="M20,16 L14,16 L12,22 L14,28 L20,28" strokeWidth="1" opacity="0.7" />
      <path d="M44,16 L50,16 L52,22 L50,28 L44,28" strokeWidth="1" opacity="0.7" />
      <circle cx="12" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="52" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
      <polygon points="32,20 35,26 32,32 29,26" fill="currentColor" fillOpacity="0.15" strokeWidth="0.75" />
      <line x1="32" y1="42" x2="32" y2="50" />
      <path d="M22,50 L42,50 L44,54 L20,54 Z" strokeWidth="1" />
      <line x1="24" y1="52" x2="28" y2="52" strokeWidth="0.5" opacity="0.5" />
      <line x1="30" y1="52" x2="34" y2="52" strokeWidth="0.5" opacity="0.5" />
      <line x1="36" y1="52" x2="40" y2="52" strokeWidth="0.5" opacity="0.5" />
      <circle cx="32" cy="26" r="8" strokeWidth="0.5" opacity="0.15" strokeDasharray="1.5 2" />
      <path d="M16,8 L17,10 L16,12 L15,10 Z" fill="currentColor" opacity="0.4" />
      <path d="M48,8 L49,10 L48,12 L47,10 Z" fill="currentColor" opacity="0.4" />
      <path d="M32,4 L33,6 L32,8 L31,6 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function IconCodeSolo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22,14 L8,32 L22,50" strokeWidth="2" />
      <path d="M42,14 L56,32 L42,50" strokeWidth="2" />
      <line x1="36" y1="10" x2="28" y2="54" opacity="0.7" />
      <circle cx="32" cy="26" r="3" strokeWidth="1" />
      <line x1="32" y1="29" x2="32" y2="38" strokeWidth="1" />
      <line x1="28" y1="33" x2="36" y2="33" strokeWidth="1" />
      <rect x="34" y="40" width="2" height="5" fill="currentColor" opacity="0.7" />
      <line x1="14" y1="24" x2="20" y2="24" strokeWidth="0.5" opacity="0.3" />
      <line x1="12" y1="28" x2="18" y2="28" strokeWidth="0.5" opacity="0.3" />
      <line x1="44" y1="26" x2="50" y2="26" strokeWidth="0.5" opacity="0.3" />
      <line x1="46" y1="30" x2="52" y2="30" strokeWidth="0.5" opacity="0.3" />
      <path d="M8,32 L4,32 L4,28" strokeWidth="0.75" opacity="0.4" />
      <path d="M56,32 L60,32 L60,36" strokeWidth="0.75" opacity="0.4" />
      <circle cx="4" cy="28" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="36" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function IconPowerPulse() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22,14 A18,18 0 1,0 42,14" />
      <line x1="32" y1="6" x2="32" y2="22" strokeWidth="2" />
      <path d="M35,22 L29,34 L33,34 L27,46" strokeWidth="2" />
      <path d="M2,34 L12,34 L16,26 L20,42 L24,30 L28,38" strokeWidth="0.75" opacity="0.5" />
      <path d="M36,38 L40,30 L44,42 L48,26 L52,34 L62,34" strokeWidth="0.75" opacity="0.5" />
      <circle cx="32" cy="56" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="24" cy="58" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="40" cy="58" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="32" cy="34" r="14" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 4" />
      <path d="M32,56 L32,62" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

function IconGlobeNetwork() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="32" cy="32" r="22" />
      <ellipse cx="32" cy="32" rx="10" ry="22" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="32" cy="32" rx="22" ry="7" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="32" cy="24" rx="19" ry="4" strokeWidth="0.5" opacity="0.3" />
      <ellipse cx="32" cy="40" rx="19" ry="4" strokeWidth="0.5" opacity="0.3" />
      <circle cx="26" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="40" cy="24" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="20" cy="34" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="44" cy="36" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="32" cy="44" r="1.5" fill="currentColor" opacity="0.7" />
      <line x1="26" y1="20" x2="40" y2="24" strokeWidth="0.5" opacity="0.4" />
      <line x1="40" y1="24" x2="44" y2="36" strokeWidth="0.5" opacity="0.4" />
      <line x1="26" y1="20" x2="20" y2="34" strokeWidth="0.5" opacity="0.4" />
      <line x1="20" y1="34" x2="32" y2="44" strokeWidth="0.5" opacity="0.4" />
      <line x1="44" y1="36" x2="32" y2="44" strokeWidth="0.5" opacity="0.4" />
      <circle cx="36" cy="28" r="4" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// CUSTOM TRON SVG ICONS - Systems
// ══════════════════════════════════════════════════════════════

function IconHexDashboard() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" />
      <polygon points="32,12 48,21 48,43 32,52 16,43 16,21" strokeWidth="0.75" opacity="0.5" />
      <line x1="16" y1="28" x2="48" y2="28" strokeWidth="0.5" opacity="0.4" />
      <line x1="16" y1="36" x2="48" y2="36" strokeWidth="0.5" opacity="0.4" />
      <line x1="28" y1="21" x2="28" y2="43" strokeWidth="0.5" opacity="0.4" />
      <line x1="36" y1="21" x2="36" y2="43" strokeWidth="0.5" opacity="0.4" />
      <rect x="17" y="22" width="10" height="5" rx="0.5" strokeWidth="0.75" opacity="0.8" />
      <rect x="29" y="22" width="6" height="5" rx="0.5" strokeWidth="0.75" opacity="0.8" />
      <rect x="37" y="22" width="10" height="5" rx="0.5" strokeWidth="0.75" opacity="0.8" />
      <rect x="17" y="29" width="14" height="6" rx="0.5" strokeWidth="0.75" opacity="0.6" />
      <rect x="33" y="29" width="14" height="6" rx="0.5" strokeWidth="0.75" opacity="0.6" />
      <rect x="20" y="37" width="24" height="4" rx="0.5" strokeWidth="0.75" opacity="0.5" />
      <path d="M10,22 L10,18 L14,18" strokeWidth="1" />
      <path d="M54,22 L54,18 L50,18" strokeWidth="1" />
      <path d="M10,42 L10,46 L14,46" strokeWidth="1" />
      <path d="M54,42 L54,46 L50,46" strokeWidth="1" />
      <circle cx="32" cy="32" r="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

function IconMagnetAttract() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M16,20 L16,38 C16,47 23,54 32,54 C41,54 48,47 48,38 L48,20" strokeWidth="2" />
      <rect x="12" y="14" width="10" height="6" rx="1" />
      <rect x="42" y="14" width="10" height="6" rx="1" />
      <path d="M22,24 L22,36 C22,42 26,48 32,48 C38,48 42,42 42,36 L42,24" strokeWidth="0.75" opacity="0.5" />
      <path d="M10,36 C10,50 20,60 32,60 C44,60 54,50 54,36" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
      <circle cx="8" cy="28" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="56" cy="28" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="4" cy="38" r="0.75" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="38" r="0.75" fill="currentColor" opacity="0.4" />
      <path d="M8,30 L12,28 L8,26" strokeWidth="0.75" opacity="0.5" />
      <path d="M56,30 L52,28 L56,26" strokeWidth="0.75" opacity="0.5" />
      <path d="M17,14 C17,6 47,6 47,14" strokeWidth="0.5" opacity="0.4" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function IconLightningCircuit() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M36,4 L22,28 L30,28 L20,52 L46,24 L36,24 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M38,16 L44,12 L42,18" strokeWidth="0.75" opacity="0.5" />
      <path d="M22,40 L16,44 L20,38" strokeWidth="0.75" opacity="0.5" />
      <path d="M22,28 L12,28 L12,24 L8,24" strokeWidth="0.75" opacity="0.6" />
      <path d="M46,24 L52,24 L52,28 L58,28" strokeWidth="0.75" opacity="0.6" />
      <path d="M30,28 L30,36 L24,36 L24,42" strokeWidth="0.5" opacity="0.4" />
      <path d="M36,24 L36,16 L42,16 L42,10" strokeWidth="0.5" opacity="0.4" />
      <circle cx="8" cy="24" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="58" cy="28" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="42" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="42" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
      <path d="M6,16 A14,14 0 0,1 16,6" strokeWidth="1" opacity="0.3" />
      <path d="M58,48 A14,14 0 0,1 48,58" strokeWidth="1" opacity="0.3" />
      <circle cx="32" cy="28" r="8" strokeWidth="0.5" opacity="0.15" strokeDasharray="2 3" />
      <circle cx="32" cy="28" r="14" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 4" />
    </svg>
  );
}

function IconGlobePlatform() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="32" cy="28" r="20" />
      <ellipse cx="32" cy="28" rx="8" ry="20" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="32" cy="28" rx="15" ry="20" strokeWidth="0.5" opacity="0.3" />
      <ellipse cx="32" cy="28" rx="20" ry="6" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="32" cy="20" rx="17" ry="4" strokeWidth="0.5" opacity="0.3" />
      <ellipse cx="32" cy="36" rx="17" ry="4" strokeWidth="0.5" opacity="0.3" />
      <ellipse cx="32" cy="28" rx="26" ry="8" strokeWidth="0.75" opacity="0.5" transform="rotate(-20,32,28)" strokeDasharray="3 2" />
      <circle cx="56" cy="24" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="8" cy="32" r="1.5" fill="currentColor" opacity="0.5" />
      <line x1="54" y1="24" x2="46" y2="26" strokeWidth="0.5" opacity="0.4" />
      <line x1="10" y1="32" x2="16" y2="30" strokeWidth="0.5" opacity="0.4" />
      <polygon points="32,56 44,52 44,48 32,52 20,48 20,52" strokeWidth="0.75" opacity="0.5" />
      <line x1="32" y1="48" x2="32" y2="52" opacity="0.6" />
      <line x1="24" y1="50" x2="28" y2="50" strokeWidth="0.5" opacity="0.4" />
      <line x1="36" y1="50" x2="40" y2="50" strokeWidth="0.5" opacity="0.4" />
      <circle cx="32" cy="8" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const STATS: { value: string; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'Top 1%', label: 'eXp Attraction Network', icon: <IconTrophy />, color: '#ffd700' },
  { value: 'Solo', label: 'Built The Entire Platform', icon: <IconCodeSolo />, color: '#00d4ff' },
  { value: '24/7', label: 'Automated Infrastructure', icon: <IconPowerPulse />, color: '#a050ff' },
  { value: '300+', label: 'Global Edge Servers', icon: <IconGlobeNetwork />, color: '#00cc66' },
];

const SYSTEMS: { icon: React.ReactNode; title: string; subtitle: string; description: string; color: string }[] = [
  {
    icon: <IconHexDashboard />,
    title: 'The Agent Portal',
    subtitle: 'Your Command Center',
    description: 'Onboarding flows, analytics dashboards, marketing templates, elite courses, agent attraction tools, customizable link pages - everything you need to run your business, in one place.',
    color: '#00bfff',
  },
  {
    icon: <IconMagnetAttract />,
    title: 'Agent Attraction Pages',
    subtitle: 'Your Recruiting Machine',
    description: 'Dynamic recruiting pages that work while you sleep. Custom video players, real-time tracking, conversion analytics - your personal landing page built to attract and convert new agents.',
    color: '#00cc66',
  },
  {
    icon: <IconLightningCircuit />,
    title: 'Automation Engine',
    subtitle: 'Never Stops Working',
    description: 'Email sequences that nurture leads around the clock. CRM sync, cron-based notifications, guest pass automations - systems that run your follow-up so you can focus on selling.',
    color: '#a050ff',
  },
  {
    icon: <IconGlobePlatform />,
    title: 'The Entire Platform',
    subtitle: 'Built From Scratch',
    description: 'Dual-deployment architecture across 300+ global edge servers. Zero-downtime deploys, CI/CD pipelines, enterprise-grade infrastructure - all designed, coded, and maintained by one developer.',
    color: '#ffd700',
  },
];

// ══════════════════════════════════════════════════════════════
// FREQUENCY VISUALIZER (unchanged)
// ══════════════════════════════════════════════════════════════

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
      if (!analyser) { raf = requestAnimationFrame(update); return; }
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
    <div ref={barsRef} className="flex items-end justify-center gap-[3px] h-24 md:h-32" style={{ width: 'fit-content', margin: '0 auto' }}>
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} className="rounded-t-sm transition-none" style={{ width: '5px', height: '4%', backgroundColor: 'rgba(0,212,255,0.3)', minHeight: '2px' }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function TronAboutPage() {
  const { isPlaying, toggle, bandsRef, containerRef, analyserRef, initTimeRef } = useTronAudio(AUDIO_URL, AUDIO_START);
  const revealRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalPhase, setTerminalPhase] = useState<'hidden' | 'typing' | 'live'>('hidden');
  const [revealedLines, setRevealedLines] = useState(0);

  // Scroll reveal (class-based for cross-browser reliability)
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    el.querySelectorAll('.tron-reveal').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Terminal: trigger typing on scroll
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerminalPhase('typing');
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Terminal: line-by-line typing animation
  useEffect(() => {
    if (terminalPhase !== 'typing') return;
    let line = 0;
    const interval = setInterval(() => {
      line++;
      setRevealedLines(line);
      if (line >= TERMINAL_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setTerminalPhase('live'), 400);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [terminalPhase]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ '--ab': '0', '--am': '0', '--ah': '0' } as React.CSSProperties}
    >
      <TronGrid bandsRef={bandsRef} initTimeRef={initTimeRef} />

      {/* Feathered dark overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `linear-gradient(180deg, rgba(5,5,12,0.7) 0%, rgba(5,5,12,0.3) 8%, transparent 20%, transparent 50%, rgba(5,5,12,0.15) 70%, rgba(5,5,12,0.5) 85%, rgba(5,5,12,0.75) 100%)`,
        }}
      />

      <main id="main-content" ref={revealRef} className="relative" style={{ zIndex: 2 }}>

        {/* ━━━ HERO (unchanged) ━━━ */}
        <section className="relative min-h-[100svh] flex flex-col px-4 pt-32 md:pt-40">
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <H1 theme="cyan">DOUG SMART</H1>
            <Tagline style={{ fontSize: 'clamp(1rem, 2.2vw, 1.4rem)' }}>
              The developer behind every system on this platform
            </Tagline>
            <div className="mt-8 md:mt-12">
              <button onClick={toggle} className="group relative mx-auto block focus:outline-none" aria-label={isPlaying ? 'Pause music' : 'Play music'}>
                <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-28 md:h-28 mx-auto">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(0,212,255,0.35)" strokeWidth="1.5" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(160,80,255,0.5)" strokeWidth="2" strokeDasharray="8 16" className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} style={{ transformOrigin: 'center' }} />
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
                <span className="block mt-3 text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(0,212,255,0.6)', fontFamily: 'var(--font-taskor)' }}>
                  {isPlaying ? 'PLAYING' : 'INITIALIZE AUDIO'}
                </span>
              </button>
            </div>
          </div>
          <div className="pb-16 pt-6">
            <FrequencyBars analyserRef={analyserRef} />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* ━━━ CRT TERMINAL ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <div
            ref={terminalRef}
            className="tron-crt-monitor max-w-4xl mx-auto"
            style={{ opacity: terminalPhase === 'hidden' ? 0 : 1, transform: terminalPhase === 'hidden' ? 'translateY(20px)' : 'translateY(0)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
          >
            <div className="tron-crt-bezel">
              {/* LED indicator: gray=off, yellow=booting, green=live */}
              <div
                className="absolute top-[6px] right-[12px] w-[6px] h-[6px] rounded-full"
                style={{
                  backgroundColor: terminalPhase === 'live' ? '#00ff88' : terminalPhase === 'typing' ? '#ffd700' : '#333',
                  boxShadow: terminalPhase === 'live' ? '0 0 6px #00ff88, 0 0 12px #00ff8844' : terminalPhase === 'typing' ? '0 0 6px #ffd700, 0 0 12px #ffd70044' : 'none',
                  transition: 'all 0.3s',
                }}
              />
              <div className="tron-crt-screen">
                <div className="tron-crt-scanlines" />
                <div className="tron-crt-sweep" />
                <div className="tron-crt-vignette" />
                <div className="relative" style={{ zIndex: 5 }}>
                  {terminalPhase !== 'hidden' && (
                    <div className="font-mono text-[0.6rem] sm:text-xs mb-4 tracking-wider" style={{ color: 'rgba(0,212,255,0.5)' }}>
                      {'> SYSTEM DIAGNOSTIC'}
                      <span className="tron-cursor">_</span>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <pre
                      className="font-mono text-[0.5rem] sm:text-xs md:text-sm leading-relaxed mx-auto whitespace-pre"
                      style={{
                        color: 'rgba(0,212,255,0.85)',
                        textShadow: '0 0 5px rgba(0,212,255,0.4), 0 0 15px rgba(0,212,255,0.15), 0 0 30px rgba(0,212,255,0.05)',
                        width: 'fit-content',
                      }}
                    >
                      {TERMINAL_LINES.map((line, i) => (
                        <span
                          key={i}
                          className={`block tron-term-line ${i < revealedLines ? 'tron-term-line-on' : ''} ${terminalPhase === 'live' && line.includes('\u2593') ? 'tron-bar-live' : ''}`}
                          style={terminalPhase === 'live' && line.includes('\u2593') ? { animationDelay: `${(i % 3) * 0.4}s` } as React.CSSProperties : undefined}
                        >
                          {line || ' '}
                        </span>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ STATS GRID ━━━ */}
        <section className="relative py-16 md:py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="tron-reveal tron-stat-card"
                style={{ '--reveal-delay': `${i * 0.15}s` } as React.CSSProperties}
              >
                <div className="tron-stat-shimmer" />
                <div className="w-12 h-12 mx-auto mb-3" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color}80)` }}>
                  {stat.icon}
                </div>
                <div
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold"
                  style={{ fontFamily: 'var(--font-taskor)', color: '#e5e4dd', textShadow: `0 0 10px ${stat.color}40` }}
                >
                  {stat.value}
                </div>
                <p className="mt-1 text-sm" style={{ color: '#dcdbd5', opacity: 0.7, fontFamily: 'var(--font-amulya)' }}>
                  {stat.label}
                </p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: stat.color, boxShadow: `0 0 12px ${stat.color}60, 0 0 4px ${stat.color}` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ PROFILE + BIO ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Profile photo with rotating light-ring */}
            <div className="lg:w-2/5 flex justify-center">
              <div className="relative">
                <div className="tron-profile-halo" />
                <div className="tron-profile-ring">
                  <div className="tron-profile-ring-spin" />
                  {/* Static dashed ring */}
                  <div className="tron-profile-ring-dash" />
                  <div className="tron-profile-inner">
                    <Image
                      src={DOUG_PROFILE_IMAGE}
                      alt="Doug Smart"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 288px, 224px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio panel */}
            <div className="lg:w-3/5">
              <div className="tron-reveal tron-bio-panel" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
                <H2 theme="blue">The Builder</H2>
                <div className="space-y-5 -mt-4">
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
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ SYSTEMS I BUILT ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <div className="text-center mb-2">
            <H2 theme="blue">Systems I Built</H2>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {SYSTEMS.map((system, i) => (
              <div
                key={system.title}
                className="tron-reveal tron-system-card"
                style={{ '--reveal-delay': `${i * 0.2}s`, '--accent': system.color } as React.CSSProperties}
              >
                {/* Corner brackets */}
                <div className="tron-corner tron-corner-tl" style={{ borderColor: `${system.color}66` }} />
                <div className="tron-corner tron-corner-tr" style={{ borderColor: `${system.color}66` }} />
                <div className="tron-corner tron-corner-br" style={{ borderColor: `${system.color}66` }} />
                <div className="tron-corner tron-corner-bl" style={{ borderColor: `${system.color}66` }} />

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0" style={{ color: system.color, filter: `drop-shadow(0 0 10px ${system.color}60)` }}>
                    {system.icon}
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: '#e5e4dd', fontFamily: 'var(--font-taskor)' }}
                    >
                      {system.title}
                    </h3>
                    <p
                      className="text-xs tracking-[0.15em] uppercase mb-3"
                      style={{ color: system.color, fontFamily: 'var(--font-taskor)', opacity: 0.8 }}
                    >
                      {system.subtitle}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#dcdbd5', opacity: 0.8, fontFamily: 'var(--font-amulya)' }}>
                      {system.description}
                    </p>
                  </div>
                </div>

                {/* Left accent bar */}
                <div
                  className="absolute top-0 left-0 w-[3px] h-full"
                  style={{ background: `linear-gradient(180deg, transparent, ${system.color}, transparent)`, boxShadow: `0 0 8px ${system.color}40` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ CTA ━━━ */}
        <section className="relative py-20 md:py-28 px-4">
          <div
            className="max-w-5xl mx-auto mb-12 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)', boxShadow: '0 0 8px rgba(0,212,255,0.2)' }}
          />
          <div className="tron-reveal tron-cta-panel max-w-5xl mx-auto text-center" style={{ '--reveal-delay': '0s' } as React.CSSProperties}>
            <H2 theme="gold">Ready to Level Up?</H2>
            <p className="-mt-5 mb-10" style={{ color: '#dcdbd5', fontFamily: 'var(--font-amulya)' }}>
              Join The Alliance and get access to the digital infrastructure
              that powers top-producing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/our-exp-team/">
                Meet The Team
              </CTAButton>
            </div>
          </div>
        </section>
      </main>

      {/* ━━━ STYLES ━━━ */}
      <style jsx global>{`
        /* ── CRT Terminal ── */
        .tron-crt-bezel {
          position: relative;
          background: linear-gradient(145deg, #1a1a2e 0%, #0d0d18 50%, #1a1a2e 100%);
          border-radius: 16px;
          padding: 14px;
          box-shadow:
            0 0 0 1px rgba(0,212,255,0.08),
            0 0 40px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .tron-crt-screen {
          position: relative;
          background: radial-gradient(ellipse at center, rgba(0,12,24,0.95) 0%, rgba(0,4,10,1) 100%);
          border-radius: 8px;
          padding: 24px;
          overflow: hidden;
          box-shadow: inset 0 0 80px rgba(0,0,0,0.5);
          animation: crtFlicker 4s infinite;
        }
        .tron-crt-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(0,0,0,0.12) 1px,
            rgba(0,0,0,0.12) 2px
          );
          pointer-events: none;
          z-index: 10;
        }
        .tron-crt-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0,212,255,0.03) 48%,
            rgba(0,212,255,0.07) 50%,
            rgba(0,212,255,0.03) 52%,
            transparent 100%
          );
          animation: crtSweep 3s linear infinite;
          pointer-events: none;
          z-index: 6;
        }
        .tron-crt-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
          z-index: 8;
          border-radius: inherit;
        }
        .tron-cursor {
          animation: cursorBlink 1s step-end infinite;
        }
        @keyframes crtFlicker {
          0%,100% { opacity: 0.98; }
          3% { opacity: 0.94; }
          6% { opacity: 0.99; }
          9% { opacity: 0.96; }
          50% { opacity: 0.99; }
          92% { opacity: 0.97; }
          95% { opacity: 0.99; }
        }
        @keyframes crtSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes cursorBlink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ── Stats Cards ── */
        .tron-stat-card {
          position: relative;
          padding: 24px 16px;
          text-align: center;
          background: linear-gradient(180deg, rgba(10,10,20,0.9) 0%, rgba(5,5,15,0.95) 100%);
          border: 1px solid rgba(0,212,255,0.08);
          border-radius: 8px;
          overflow: hidden;
        }
        .tron-stat-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255,255,255,0.02) 45%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0.02) 55%,
            transparent 65%
          );
          background-size: 250% 100%;
          animation: tronShimmer 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes tronShimmer {
          0% { background-position: 250% 0; }
          100% { background-position: -250% 0; }
        }

        /* ── Profile Ring ── */
        .tron-profile-halo {
          position: absolute;
          inset: -40%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0.04) 50%, transparent 70%);
          animation: tronHaloPulse 3s ease-in-out infinite;
          z-index: 0;
        }
        .tron-profile-ring {
          position: relative;
          width: 236px;
          height: 236px;
          border-radius: 50%;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .tron-profile-ring {
            width: 300px;
            height: 300px;
          }
        }
        .tron-profile-ring-spin {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 50%,
            #00d4ff 65%,
            #a050ff 78%,
            #00ff88 90%,
            transparent 100%
          );
          animation: tronRingSpin 3s linear infinite;
          z-index: 0;
        }
        .tron-profile-ring-dash {
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          border: 1px dashed rgba(0,212,255,0.2);
          z-index: 1;
          pointer-events: none;
        }
        .tron-profile-inner {
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 2;
          background: #0a0a12;
        }
        @keyframes tronHaloPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes tronRingSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Bio Panel ── */
        .tron-bio-panel {
          position: relative;
          padding: 32px;
          background: linear-gradient(180deg, rgba(10,10,20,0.85) 0%, rgba(5,5,15,0.9) 100%);
          border: 1px solid rgba(0,212,255,0.1);
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,212,255,0.04);
        }

        /* ── System Cards ── */
        .tron-system-card {
          position: relative;
          padding: 28px 28px 28px 32px;
          background: linear-gradient(180deg, rgba(10,10,20,0.9) 0%, rgba(5,5,15,0.95) 100%);
          border: 1px solid rgba(0,212,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .tron-system-card:hover {
          border-color: var(--accent, rgba(0,212,255,0.2));
          box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 15%, transparent);
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        /* Corner brackets */
        .tron-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-style: solid;
          border-width: 0;
          z-index: 2;
          pointer-events: none;
        }
        .tron-corner-tl { top: 6px; left: 6px; border-top-width: 1.5px; border-left-width: 1.5px; }
        .tron-corner-tr { top: 6px; right: 6px; border-top-width: 1.5px; border-right-width: 1.5px; }
        .tron-corner-br { bottom: 6px; right: 6px; border-bottom-width: 1.5px; border-right-width: 1.5px; }
        .tron-corner-bl { bottom: 6px; left: 6px; border-bottom-width: 1.5px; border-left-width: 1.5px; }

        /* ── CTA Panel ── */
        .tron-cta-panel {
          padding: 40px 32px;
          background: linear-gradient(180deg, rgba(10,10,20,0.9) 0%, rgba(5,5,15,0.95) 100%);
          border: 1px solid rgba(255,215,0,0.12);
          border-radius: 8px;
          box-shadow: 0 0 30px rgba(0,0,0,0.4), 0 0 60px rgba(255,215,0,0.03);
        }

        /* ── Terminal Line Typing ── */
        .tron-term-line {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .tron-term-line-on {
          opacity: 1;
          transform: translateX(0);
        }
        .tron-bar-live {
          animation: barPulse 2.5s ease-in-out infinite;
        }
        @keyframes barPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.4) drop-shadow(0 0 4px rgba(0,212,255,0.3)); }
        }

        /* ── Scroll Reveal (class-based) ── */
        .tron-reveal {
          opacity: 0;
        }
        .tron-reveal.revealed {
          animation: tronGlitchIn 0.7s ease-out forwards;
          animation-delay: var(--reveal-delay, 0s);
        }
        @keyframes tronGlitchIn {
          0% {
            opacity: 0;
            transform: translateY(24px);
            clip-path: inset(0 80% 0 0);
            filter: brightness(2) hue-rotate(60deg);
          }
          30% {
            opacity: 1;
            clip-path: inset(25% 0 55% 0);
            filter: brightness(1.4) hue-rotate(30deg);
          }
          60% {
            clip-path: inset(0 0 0 0);
            transform: translateY(0);
            filter: brightness(1.15) hue-rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: brightness(1) hue-rotate(0deg);
            clip-path: inset(0 0 0 0);
          }
        }

        /* ── Heading tightening (mobile) ── */
        @media (max-width: 768px) {
          .tron-bio-panel h2,
          .tron-cta-panel h2 {
            margin-bottom: 0.25rem !important;
          }
          .tron-system-card h3 {
            margin-bottom: 0.125rem;
          }
        }

        /* ── Mobile Performance ── */
        @media (max-width: 768px) {
          .tron-crt-screen { animation: none !important; }
          .tron-crt-sweep { display: none; }
          .tron-stat-shimmer { animation: none; opacity: 0; }
          .tron-profile-halo { animation: none; }
          .tron-bar-live { animation: none; }
          .tron-reveal.revealed {
            animation: tronFadeIn 0.5s ease-out forwards;
            animation-delay: var(--reveal-delay, 0s);
          }
        }
        @keyframes tronFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Reduced Motion ── */
        @media (prefers-reduced-motion: reduce) {
          .tron-crt-screen { animation: none !important; }
          .tron-crt-sweep { animation: none; display: none; }
          .tron-cursor { animation: none; }
          .tron-stat-shimmer { animation: none; }
          .tron-profile-ring-spin { animation: none; }
          .tron-profile-halo { animation: none; }
          .tron-bar-live { animation: none; }
          .tron-reveal {
            opacity: 1 !important;
          }
          .tron-reveal.revealed {
            animation: none;
            opacity: 1;
            transform: none;
            clip-path: none;
            filter: none;
          }
        }
      `}</style>
    </div>
  );
}
