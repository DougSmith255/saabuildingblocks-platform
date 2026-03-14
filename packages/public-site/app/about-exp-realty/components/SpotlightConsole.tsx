'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa/headings';
import { Award, Cloud, TrendingUp, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ═══ Detail SVG Illustrations (one per feature) ═══ */

function RankingsBadge() {
  return (
    <svg viewBox="0 0 240 200" fill="none" className="sc-detail-svg">
      <defs>
        <filter id="sc-rank-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Shield/badge shape */}
      <path d="M120 15 L175 38 L175 105 L120 135 L65 105 L65 38 Z" fill="rgba(0,191,255,0.06)" stroke="rgba(0,191,255,0.3)" strokeWidth="1.5" strokeLinejoin="round" filter="url(#sc-rank-glow)" />
      {/* eXp X logo - using image element */}
      <image href="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public" x="88" y="40" width="64" height="64" opacity="0.9" style={{ filter: 'drop-shadow(0 0 8px rgba(0,191,255,0.6))' }} />
      {/* Rating stars - spaced 20px apart to avoid overlap */}
      {[80, 100, 120, 140, 160].map((x) => (
        <g key={x}>
          <path d={`M${x} 148 L${x + 3} 155 L${x + 8} 156 L${x + 5} 161 L${x + 6} 168 L${x} 165 L${x - 6} 168 L${x - 5} 161 L${x - 8} 156 L${x - 3} 155 Z`}
            fill="rgba(255,215,0,0.6)" stroke="rgba(255,215,0,0.8)" strokeWidth="0.5" />
        </g>
      ))}
      {/* Label */}
      <text x="120" y="190" textAnchor="middle" fill="rgba(0,191,255,0.7)" fontSize="16" fontWeight="bold" style={{ fontFamily: 'system-ui, sans-serif' }}>#1 Rated Brokerage</text>
    </svg>
  );
}

function InnovationCloud() {
  return (
    <svg viewBox="0 0 260 200" fill="none" className="sc-detail-svg">
      <defs>
        <linearGradient id="sc-inn-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,191,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,191,255,0.05)" />
        </linearGradient>
      </defs>
      {/* Building crossed out */}
      <rect x="5" y="50" width="60" height="100" rx="4" fill="rgba(255,80,80,0.06)" stroke="rgba(255,80,80,0.25)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="5" y1="50" x2="65" y2="150" stroke="rgba(255,80,80,0.35)" strokeWidth="1.5" />
      <line x1="65" y1="50" x2="5" y2="150" stroke="rgba(255,80,80,0.35)" strokeWidth="1.5" />
      <text x="35" y="172" textAnchor="middle" fill="rgba(255,80,80,0.6)" fontSize="15" fontWeight="700">No Offices</text>
      {/* Arrow */}
      <path d="M78 100 L100 100" stroke="rgba(0,191,255,0.5)" strokeWidth="2.5" />
      <path d="M97 95 L104 100 L97 105" stroke="rgba(0,191,255,0.5)" strokeWidth="2.5" fill="none" />
      {/* Cloud */}
      <path d="M140 60 Q128 30 152 25 Q170 14 188 32 Q210 24 216 45 Q228 56 218 72 L135 72 Q123 72 130 60 Z" fill="url(#sc-inn-g)" stroke="rgba(0,191,255,0.6)" strokeWidth="1.5" />
      {/* Circuit dots */}
      <circle cx="155" cy="48" r="3" fill="rgba(0,191,255,0.5)" />
      <circle cx="175" cy="48" r="3" fill="rgba(0,191,255,0.5)" />
      <circle cx="195" cy="48" r="3" fill="rgba(0,191,255,0.4)" />
      <line x1="155" y1="48" x2="195" y2="48" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" />
      <line x1="140" y1="60" x2="215" y2="60" stroke="rgba(0,191,255,0.25)" strokeWidth="0.6" />
      {/* Service boxes - properly spaced with 6px gaps */}
      <line x1="132" y1="72" x2="132" y2="90" stroke="rgba(0,191,255,0.35)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="176" y1="72" x2="176" y2="90" stroke="rgba(0,191,255,0.35)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="220" y1="72" x2="220" y2="90" stroke="rgba(0,191,255,0.35)" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="114" y="92" width="36" height="26" rx="5" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <text x="132" y="110" textAnchor="middle" fill="rgba(0,191,255,0.8)" fontSize="14" fontWeight="700">CRM</text>
      <rect x="158" y="92" width="36" height="26" rx="5" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <text x="176" y="110" textAnchor="middle" fill="rgba(0,191,255,0.8)" fontSize="14" fontWeight="700">LMS</text>
      <rect x="202" y="92" width="36" height="26" rx="5" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <text x="220" y="110" textAnchor="middle" fill="rgba(0,191,255,0.8)" fontSize="14" fontWeight="700">AI</text>
      <text x="176" y="140" textAnchor="middle" fill="rgba(0,191,255,0.7)" fontSize="16" fontWeight="600">Cloud-First Model</text>
    </svg>
  );
}

function ProfitabilityChart() {
  return (
    <svg viewBox="0 0 260 200" fill="none" className="sc-detail-svg">
      <defs>
        <linearGradient id="sc-prof-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,255,136,0.2)" />
          <stop offset="100%" stopColor="rgba(0,255,136,0)" />
        </linearGradient>
      </defs>
      {/* Y axis */}
      <line x1="40" y1="25" x2="40" y2="155" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* X axis / breakeven line */}
      <line x1="40" y1="100" x2="210" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="36" y="104" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="13">$0</text>
      {/* Bottom axis */}
      <line x1="40" y1="155" x2="210" y2="155" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      {/* Grid lines */}
      {[50, 75, 125, 145].map(y => (
        <line key={y} x1="42" y1={y} x2="210" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      ))}
      {/* Others line (below breakeven, declining) */}
      <path d="M55 105 L85 112 L115 118 L145 128 L175 135 L200 142" stroke="rgba(255,80,80,0.45)" strokeWidth="2" strokeDasharray="5 4" fill="none" />
      <text x="206" y="150" fill="rgba(255,80,80,0.65)" fontSize="15" fontWeight="700">Others</text>
      {/* eXp line (modestly above breakeven, gentle uptrend) */}
      <path d="M55 95 L85 90 L115 85 L145 80 L175 74 L200 70" stroke="#00ff88" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.5))' }} />
      {/* Area fill under eXp line (only above breakeven) */}
      <path d="M55 95 L85 90 L115 85 L145 80 L175 74 L200 70 L200 100 L55 100 Z" fill="url(#sc-prof-area)" />
      {/* Data points */}
      <circle cx="115" cy="85" r="3" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.6))' }} />
      <circle cx="200" cy="70" r="4" fill="#00ff88" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.7))' }} />
      <text x="206" y="66" fill="#00ff88" fontSize="16" fontWeight="bold">eXp</text>
      <text x="130" y="178" textAnchor="middle" fill="rgba(0,255,136,0.6)" fontSize="15">Cumulative net income</text>
    </svg>
  );
}

function SponsorSupportTree() {
  return (
    <svg viewBox="0 0 240 200" fill="none" className="sc-detail-svg">
      {/* eXp node */}
      <rect x="82" y="10" width="76" height="32" rx="6" fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.6)" strokeWidth="1.5" />
      <text x="120" y="31" textAnchor="middle" fill="#00bfff" fontSize="17" fontWeight="bold">eXp</text>
      {/* Line down */}
      <line x1="120" y1="42" x2="120" y2="62" stroke="rgba(0,191,255,0.5)" strokeWidth="1.5" />
      <path d="M116 57 L120 64 L124 57" fill="rgba(0,191,255,0.5)" />
      {/* Sponsor node */}
      <rect x="72" y="65" width="96" height="32" rx="6" fill="rgba(153,51,255,0.15)" stroke="rgba(153,51,255,0.6)" strokeWidth="1.5" />
      <text x="120" y="86" textAnchor="middle" fill="#9933ff" fontSize="16" fontWeight="bold">Sponsor</text>
      {/* Lines to agents */}
      <line x1="120" y1="97" x2="120" y2="112" stroke="rgba(153,51,255,0.4)" strokeWidth="1" />
      <line x1="120" y1="112" x2="50" y2="112" stroke="rgba(153,51,255,0.35)" strokeWidth="1" />
      <line x1="120" y1="112" x2="190" y2="112" stroke="rgba(153,51,255,0.35)" strokeWidth="1" />
      <line x1="50" y1="112" x2="50" y2="125" stroke="rgba(153,51,255,0.35)" strokeWidth="1" />
      <line x1="120" y1="112" x2="120" y2="125" stroke="rgba(153,51,255,0.35)" strokeWidth="1" />
      <line x1="190" y1="112" x2="190" y2="125" stroke="rgba(153,51,255,0.35)" strokeWidth="1" />
      {/* Agent nodes */}
      <rect x="22" y="125" width="56" height="26" rx="5" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.45)" strokeWidth="1" />
      <text x="50" y="143" textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize="14" fontWeight="700">Agent</text>
      <rect x="92" y="125" width="56" height="26" rx="5" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.45)" strokeWidth="1" />
      <text x="120" y="143" textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize="14" fontWeight="700">Agent</text>
      <rect x="162" y="125" width="56" height="26" rx="5" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.45)" strokeWidth="1" />
      <text x="190" y="143" textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize="14" fontWeight="700">Agent</text>
      {/* Support labels */}
      <line x1="50" y1="151" x2="50" y2="163" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="120" y1="151" x2="120" y2="163" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="190" y1="151" x2="190" y2="163" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
      <text x="50" y="176" textAnchor="middle" fill="rgba(0,191,255,0.65)" fontSize="14">Tools</text>
      <text x="120" y="176" textAnchor="middle" fill="rgba(0,191,255,0.65)" fontSize="14">Training</text>
      <text x="190" y="176" textAnchor="middle" fill="rgba(0,191,255,0.65)" fontSize="14">Systems</text>
      {/* Bottom label */}
      <text x="120" y="196" textAnchor="middle" fill="rgba(153,51,255,0.6)" fontSize="14">Sponsors choose what to provide</text>
    </svg>
  );
}

const DETAIL_ILLUSTRATIONS = [RankingsBadge, InnovationCloud, ProfitabilityChart, SponsorSupportTree];

/* ═══ Data ═══ */

const AWARDS = [
  "Forbes – America's Best Employers",
  "Glassdoor – Best Places to Work (8 consecutive years)",
  "RealTrends – #1 in U.S. transaction sides",
  "RealTrends – Top 3 Brokerage by Sales Volume",
  "RealTrends – 500 Top-Ranked Brokerage",
];

const FEATURES: { icon: LucideIcon; keyword: string; type: 'pillar' | 'advantage'; detail: string }[] = [
  {
    icon: Award,
    keyword: 'Agent Rankings',
    type: 'advantage',
    detail: 'eXp Realty is consistently ranked among the highest-rated brokerages by agents on Glassdoor and has been named one of the Top 100 Companies to Work for in the U.S. for eight consecutive years.',
  },
  {
    icon: Cloud,
    keyword: 'Innovation',
    type: 'advantage',
    detail: 'Operates without physical office overhead, allowing more resources to be directed toward technology, training, and agent programs.',
  },
  {
    icon: TrendingUp,
    keyword: 'Profitability',
    type: 'advantage',
    detail: 'Based on reported financial results, eXp Realty is the only publicly traded residential brokerage with positive cumulative net income over many years, supporting long-term viability and investment in systems and support.',
  },
  {
    icon: Users,
    keyword: 'Sponsor Support',
    type: 'advantage',
    detail: 'Allows sponsors to independently create and deliver tools, systems, training, and resources, expanding support beyond brokerage-level offerings. This added layer can impact agents\u2019 success.',
  },
];

/* ═══ Awards Ribbon (kept from original) ═══ */

function useCarouselAnimation(trackRef: React.RefObject<HTMLDivElement | null>) {
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const baseVelocityRef = useRef(0.5);
  const velocityRef = useRef(0.5);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const isMobile = window.innerWidth < 768;
    const baseSpeed = isMobile ? 1.2 : 0.5;
    baseVelocityRef.current = baseSpeed;
    velocityRef.current = baseSpeed;

    const animate = () => {
      const singleSetWidth = track.scrollWidth / 2;
      if (singleSetWidth > 0) {
        positionRef.current += velocityRef.current;
        if (velocityRef.current > baseVelocityRef.current) {
          velocityRef.current *= 0.98;
          if (velocityRef.current < baseVelocityRef.current) velocityRef.current = baseVelocityRef.current;
        }
        if (positionRef.current >= singleSetWidth) {
          positionRef.current = positionRef.current - singleSetWidth;
        }
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
      const boost = Math.min(scrollDelta * 0.3, 8);
      if (boost > baseVelocityRef.current) {
        velocityRef.current = Math.max(velocityRef.current, boost);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackRef]);
}

function ValidationRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <div className="mt-14">
      <div className="relative w-screen -ml-[50vw] left-1/2">
        <div
          className="absolute left-0 z-20 pointer-events-none"
          style={{
            top: '-16px', bottom: '-16px', width: '12px',
            borderRadius: '0 12px 12px 0',
            background: `radial-gradient(ellipse 200% 50% at 0% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
            borderRight: '1px solid rgba(0,150,255,0.4)',
            boxShadow: 'inset -3px 0 6px rgba(0,150,255,0.2), inset -1px 0 2px rgba(0,180,255,0.3), 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3)',
            transform: 'perspective(500px) rotateY(-3deg)', transformOrigin: 'right center',
          }}
        />
        <div
          className="absolute right-0 z-20 pointer-events-none"
          style={{
            top: '-16px', bottom: '-16px', width: '12px',
            borderRadius: '12px 0 0 12px',
            background: `radial-gradient(ellipse 200% 50% at 100% 50%, rgba(0,150,255,0.35) 0%, rgba(0,120,200,0.2) 40%, rgba(0,80,150,0.1) 70%, rgba(0,40,80,0.05) 100%)`,
            borderLeft: '1px solid rgba(0,150,255,0.4)',
            boxShadow: 'inset 3px 0 6px rgba(0,150,255,0.2), inset 1px 0 2px rgba(0,180,255,0.3), -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3)',
            transform: 'perspective(500px) rotateY(3deg)', transformOrigin: 'left center',
          }}
        />

        <div
          className="relative overflow-hidden"
          style={{
            marginLeft: '12px', marginRight: '12px',
            background: 'rgba(20,20,20,0.75)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: '30px', background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: '30px', background: 'radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
          <div ref={trackRef} className="flex items-center py-5" style={{ willChange: 'transform' }}>
            {[...AWARDS, ...AWARDS].map((award, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <span className="text-sm md:text-base font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--color-header-text)' }}>
                  {award}
                </span>
                <span className="mx-6 text-lg" style={{ color: '#00bfff', textShadow: '0 0 8px rgba(0,191,255,0.7), 0 0 16px rgba(0,191,255,0.5), 0 0 24px rgba(0,191,255,0.3)' }}>
                  ★
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Main Component ═══ */

export default function SpotlightConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [detailPhase, setDetailPhase] = useState<'in' | 'out'>('in');
  const pendingIndex = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (!inView || isStopped) return;
    const interval = setInterval(() => {
      switchTo((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [inView, isStopped]);

  const switchTo = useCallback((indexOrFn: number | ((prev: number) => number)) => {
    setDetailPhase('out');
    const timer = setTimeout(() => {
      setActiveIndex(indexOrFn);
      setDetailPhase('in');
    }, 200);
    pendingIndex.current = null;
    return () => clearTimeout(timer);
  }, []);

  const mobileRailRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((index: number) => {
    setIsStopped(true);
    setDetailPhase('out');
    setTimeout(() => {
      setActiveIndex(index);
      setDetailPhase('in');
    }, 200);
    // Auto-center the clicked card on mobile
    if (mobileRailRef.current) {
      const rail = mobileRailRef.current;
      const buttons = rail.querySelectorAll('button');
      const btn = buttons[index];
      if (btn) {
        const scrollLeft = (btn as HTMLElement).offsetLeft - (rail.offsetWidth / 2) + ((btn as HTMLElement).offsetWidth / 2);
        rail.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, []);

  const activeFeature = FEATURES[activeIndex];
  const DetailIllust = DETAIL_ILLUSTRATIONS[activeIndex];

  return (
    <section className="px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-6">
          <H2>Why Agents Look Closely at eXp</H2>
        </div>

        <div ref={sectionRef}>
          {/* Desktop: Evidence Wall - sidebar strips + detail panel */}
          <div className="hidden lg:grid gap-5" style={{ gridTemplateColumns: '35% 1fr', height: '320px' }}>
            {/* Left: Evidence Strips */}
            <div className="flex flex-col gap-2">
              {FEATURES.map((f, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={f.keyword}
                    type="button"
                    onClick={() => handleSelect(i)}
                    className="sc-strip group relative text-left cursor-pointer w-full"
                    style={{
                      flex: isActive ? '1.4' : '1',
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `flex 0.5s ease, opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                    }}
                  >
                    {/* Active left border glow */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                      style={{
                        background: isActive ? '#00bfff' : 'rgba(255,255,255,0.08)',
                        boxShadow: isActive ? '0 0 12px rgba(0,191,255,0.6), 0 0 24px rgba(0,191,255,0.3)' : 'none',
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                      }}
                    />

                    <div
                      className="relative ml-[3px] rounded-r-xl px-5 py-4 flex items-center gap-4 overflow-hidden"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(0,191,255,0.08) 0%, rgba(0,191,255,0.02) 100%)'
                          : 'linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(15,15,15,0.8) 100%)',
                        border: isActive ? '1px solid rgba(0,191,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                        borderLeft: 'none',
                        transition: 'background 0.3s ease, border 0.3s ease',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: isActive ? 'rgba(0,191,255,0.15)' : 'rgba(255,255,255,0.04)',
                          border: isActive ? '1px solid rgba(0,191,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                          transition: 'background 0.3s ease, border 0.3s ease',
                        }}
                      >
                        <f.icon size={20} style={{ color: isActive ? '#00bfff' : 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease' }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-h6 mb-0"
                          style={{
                            color: isActive ? '#e5e4dd' : 'rgba(229,228,221,0.5)',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {f.keyword}
                        </h3>
                        {isActive && (
                          <span
                            className="text-xs mt-1 block"
                            style={{ color: 'rgba(0,191,255,0.7)' }}
                          >
                            {f.type === 'pillar' ? 'Core Pillar' : 'Structural Advantage'}
                          </span>
                        )}
                      </div>

                      {/* Mini indicator arrow */}
                      <div
                        className="flex-shrink-0"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          color: '#00bfff',
                        }}
                      >
                        →
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Detail Panel with SVG illustration */}
            <div
              className="sc-detail-panel relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(18,20,28,0.95), rgba(10,12,18,0.98))',
                border: '1px solid rgba(0,191,255,0.12)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease 200ms, transform 0.6s ease 200ms',
              }}
            >
              {/* SVG illustration area */}
              <div
                className="absolute right-4 top-4 bottom-4 pointer-events-none"
                style={{
                  width: '280px',
                  opacity: detailPhase === 'out' ? 0 : 0.85,
                  transform: detailPhase === 'out' ? 'scale(0.9) translateY(10px)' : 'scale(1) translateY(0)',
                  transition: detailPhase === 'out'
                    ? 'opacity 200ms ease-out, transform 200ms ease-out'
                    : 'opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DetailIllust />
              </div>

              {/* Text content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-center" style={{ maxWidth: '60%' }}>
                <div
                  style={{
                    opacity: detailPhase === 'out' ? 0 : 1,
                    transform: detailPhase === 'out' ? 'translateY(-8px)' : 'translateY(0)',
                    transition: detailPhase === 'out'
                      ? 'opacity 200ms ease-out, transform 200ms ease-out'
                      : 'opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <activeFeature.icon size={24} style={{ color: '#00bfff' }} />
                    <h3 className="text-h5" style={{ color: '#e5e4dd' }}>{activeFeature.keyword}</h3>
                  </div>
                  <p className="text-body leading-relaxed mb-5" style={{ color: 'var(--color-body-text)' }}>
                    {activeFeature.detail}
                  </p>
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(0,191,255,0.12)',
                      color: '#00bfff',
                      border: '1px solid rgba(0,191,255,0.25)',
                    }}
                  >
                    {activeFeature.type === 'pillar' ? 'CORE PILLAR' : 'STRUCTURAL ADVANTAGE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal strip rail + detail below */}
          <div className="lg:hidden">
            <div ref={mobileRailRef} className="sc-mobile-rail flex gap-3 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
              {FEATURES.map((f, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={f.keyword}
                    type="button"
                    onClick={() => handleSelect(i)}
                    className="flex-shrink-0 cursor-pointer rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{
                      width: '70%',
                      scrollSnapAlign: 'center',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(0,191,255,0.1) 0%, rgba(0,191,255,0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(15,15,15,0.9) 100%)',
                      border: isActive ? '2px solid rgba(0,191,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isActive ? '0 0 16px rgba(0,191,255,0.2)' : 'none',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: isActive ? 'rgba(0,191,255,0.15)' : 'rgba(255,255,255,0.04)',
                        border: isActive ? '1px solid rgba(0,191,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <f.icon size={18} style={{ color: isActive ? '#00bfff' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <span
                      className="text-h6"
                      style={{ color: isActive ? '#e5e4dd' : 'rgba(229,228,221,0.5)' }}
                    >
                      {f.keyword}
                    </span>
                  </button>
                );
              })}
            </div>
            <style>{`.sc-mobile-rail::-webkit-scrollbar { display: none; }`}</style>

            {/* Mobile detail */}
            <div
              className="mt-4 rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(18,20,28,0.95), rgba(10,12,18,0.98))',
                border: '1px solid rgba(0,191,255,0.12)',
              }}
            >
              {/* SVG illustration hidden on mobile for readability */}
              <div
                className="relative z-10"
                style={{
                  opacity: detailPhase === 'out' ? 0 : 1,
                  transition: 'opacity 200ms ease',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <activeFeature.icon size={20} style={{ color: '#00bfff' }} />
                  <h3 className="text-h5" style={{ color: '#e5e4dd' }}>{activeFeature.keyword}</h3>
                </div>
                <p className="text-body text-sm leading-relaxed mb-4" style={{ color: 'var(--color-body-text)' }}>
                  {activeFeature.detail}
                </p>
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(0,191,255,0.12)',
                    color: '#00bfff',
                    border: '1px solid rgba(0,191,255,0.25)',
                  }}
                >
                  {activeFeature.type === 'pillar' ? 'CORE PILLAR' : 'STRUCTURAL ADVANTAGE'}
                </span>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  aria-label={`Go to ${FEATURES[i].keyword}`}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i === activeIndex ? '#00bfff' : 'rgba(255,255,255,0.25)',
                    boxShadow: i === activeIndex ? '0 0 8px rgba(0,191,255,0.6)' : 'none',
                    transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <ValidationRibbon />
      </div>

      <style>{`
        .sc-detail-svg {
          width: 100%;
          max-width: 240px;
          height: auto;
        }
        @media (min-width: 1024px) {
          .sc-detail-svg {
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}
