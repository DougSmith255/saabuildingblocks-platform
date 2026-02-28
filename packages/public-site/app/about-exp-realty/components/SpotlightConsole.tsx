'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GrainCard } from '@saa/shared/components/saa/cards';
import { H2 } from '@saa/shared/components/saa/headings';
import { Icon3D } from '@saa/shared/components/saa/icons';
import { Award, Cloud, TrendingUp, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

const MISTY_BLUE_BG = `
  radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.85) 0%, transparent 50%),
  radial-gradient(ellipse 100% 60% at 70% 80%, rgba(140,220,255,0.7) 0%, transparent 40%),
  radial-gradient(ellipse 80% 100% at 50% 50%, rgba(80,210,255,0.75) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 20% 70%, rgba(60,190,255,0.55) 0%, transparent 50%),
  radial-gradient(ellipse 90% 70% at 80% 30%, rgba(180,230,255,0.5) 0%, transparent 45%),
  linear-gradient(180deg, rgba(180,230,255,0.92) 0%, rgba(120,210,255,0.88) 50%, rgba(60,180,240,0.92) 100%)
`;
const DARK_CARD_BG = 'linear-gradient(180deg, rgba(30,30,30,0.98), rgba(15,15,15,0.99))';

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

function ShadowOverlays() {
  return (
    <>
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: '30px',
          background: 'radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        }}
      />
    </>
  );
}

function ValidationRibbon() {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarouselAnimation(trackRef);

  return (
    <div className="mt-8">
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
          <ShadowOverlays />
          <div ref={trackRef} className="flex items-center py-5" style={{ willChange: 'transform' }}>
            {[...AWARDS, ...AWARDS].map((award, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <span
                  className="text-sm md:text-base font-semibold uppercase tracking-wide whitespace-nowrap"
                  style={{ color: 'var(--color-header-text)' }}
                >
                  {award}
                </span>
                <span
                  className="mx-6 text-lg"
                  style={{
                    color: '#00bfff',
                    textShadow: '0 0 8px rgba(0,191,255,0.7), 0 0 16px rgba(0,191,255,0.5), 0 0 24px rgba(0,191,255,0.3)',
                  }}
                >★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureChip({
  icon: Icon,
  keyword,
  isActive,
  onSelect,
}: {
  icon: LucideIcon;
  keyword: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className="rounded-xl relative h-full"
      style={{
        border: isActive ? '2px solid rgba(50,150,220,0.5)' : '2px solid rgba(255,255,255,0.06)',
        boxShadow: isActive
          ? '0 0 20px 4px rgba(0,160,255,0.3), 0 0 40px 8px rgba(0,120,200,0.15)'
          : 'none',
        transition: 'border 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: DARK_CARD_BG }} />
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: MISTY_BLUE_BG,
          opacity: isActive ? 1 : 0,
          transition: isActive ? 'opacity 0.7s ease-out' : 'opacity 0.2s ease-out',
        }}
      />

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className="relative z-10 flex flex-col items-center justify-center gap-2 w-full h-full cursor-pointer px-[5px] py-3"
      >
        <span className="chip-icon-wrap">
          <Icon3D color="#00bfff" size={36} invert={isActive}>
            <Icon size={20} />
          </Icon3D>
        </span>
        <h3
          className="text-h6"
          style={{
            color: isActive ? '#0a1520' : '#e5e4dd',
            transition: 'color 0.4s ease',
          }}
        >
          {keyword}
        </h3>
      </button>
    </div>
  );
}

function DetailPanel({ feature, transitionKey }: { feature: typeof FEATURES[number]; transitionKey: number }) {
  const [displayed, setDisplayed] = useState(feature);
  const [displayedKey, setDisplayedKey] = useState(transitionKey);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (transitionKey === displayedKey) return;
    setPhase('out');
    const timer = setTimeout(() => {
      setDisplayed(feature);
      setDisplayedKey(transitionKey);
      setPhase('in');
    }, 200);
    return () => clearTimeout(timer);
  }, [feature, transitionKey, displayedKey]);

  return (
    <>
      <style>{`
        .detail-panel-card.generic-cyber-card-gold { display: flex; flex-direction: column; }
        .detail-panel-card.generic-cyber-card-gold > div { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      `}</style>
      <GrainCard padding="md" centered={false} className="h-full detail-panel-card">
        <div className="relative overflow-visible">
        <div
          className="absolute pointer-events-none"
          style={{
            right: '-20px',
            bottom: '-20px',
            opacity: phase === 'out' ? 0 : 0.04,
            transform: phase === 'out' ? 'scale(0.8) rotate(-10deg)' : 'scale(1) rotate(0deg)',
            transition: phase === 'out'
              ? 'opacity 200ms ease-out, transform 200ms ease-out'
              : 'opacity 500ms ease-out 150ms, transform 500ms ease-out 150ms',
            color: '#00bfff',
          }}
        >
          <displayed.icon size={180} strokeWidth={1} />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            transition: phase === 'out'
              ? 'opacity 200ms ease-out, transform 200ms ease-out'
              : 'opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms',
            opacity: phase === 'out' ? 0 : 1,
            transform: phase === 'out' ? 'translateY(-8px)' : 'translateY(0)',
          }}
        >
          <p className="text-body leading-relaxed mb-4">
            {displayed.detail}
          </p>

          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,191,255,0.12)',
              color: '#00bfff',
              border: '1px solid rgba(0,191,255,0.25)',
            }}
          >
            {displayed.type === 'pillar' ? 'CORE PILLAR' : 'STRUCTURAL ADVANTAGE'}
          </span>
        </div>
      </div>
    </GrainCard>
    </>
  );
}

function TypewriterLines() {
  const PROBLEM = 'Most brokerages trade your future for today\u2019s commission.';
  const ANSWER = 'eXp was built around what comes after the last sale.';
  const CHAR_DELAY = 30;

  const containerRef = useRef<HTMLDivElement>(null);
  const [problemText, setProblemText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [phase, setPhase] = useState<'idle' | 'problem' | 'gap' | 'answer' | 'done'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPhase('problem');
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'problem') return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setProblemText(PROBLEM.slice(0, i));
      if (i >= PROBLEM.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setPhase('gap');
      }
    }, CHAR_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'gap') return;
    const t = setTimeout(() => setPhase('answer'), 350);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'answer') return;
    let j = 0;
    timerRef.current = setInterval(() => {
      j++;
      setAnswerText(ANSWER.slice(0, j));
      if (j >= ANSWER.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setPhase('done');
      }
    }, CHAR_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const cursor = <span className="inline-block w-[2px] h-[1em] align-text-bottom ml-[1px]" style={{ background: 'currentColor', animation: 'cursorBlink 0.6s steps(1) infinite' }} />;

  return (
    <div ref={containerRef} className="mt-6 max-w-[900px] mx-auto text-center" style={{ paddingBottom: '20px' }}>
      <style>{`@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div className="mb-3">
        <p
          className="font-bold uppercase tracking-wider"
          style={{ color: '#c0513f', fontFamily: 'var(--font-taskor)', fontFeatureSettings: '"ss01" 1', fontSize: 'clamp(16px, calc(14.73px + 0.51vw), 22px)', lineHeight: 1.6 }}
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ display: 'inline', verticalAlign: '-0.15em', marginRight: '0.3em' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          The Problem
        </p>
        <p className="text-body" style={{ fontSize: 'clamp(15px, calc(13.73px + 0.51vw), 20px)', lineHeight: 1.6 }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: 'hidden' }}>{PROBLEM}</span>
            <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
              {problemText}
              {(phase === 'problem') && cursor}
            </span>
          </span>
        </p>
      </div>

      <div>
        <p
          className="font-bold uppercase tracking-wider"
          style={{ color: '#00bfff', fontFamily: 'var(--font-taskor)', fontFeatureSettings: '"ss01" 1', fontSize: 'clamp(16px, calc(14.73px + 0.51vw), 22px)', lineHeight: 1.6 }}
        >
          <img
            src={`${CLOUDFLARE_BASE}/exp-x-logo-icon/public`}
            alt="eXp"
            style={{ display: 'inline', width: '1em', height: '1em', objectFit: 'contain', verticalAlign: '-0.15em', marginRight: '0.3em' }}
          />
          The Answer
        </p>
        <p className="text-body" style={{ fontSize: 'clamp(15px, calc(13.73px + 0.51vw), 20px)', lineHeight: 1.6 }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ visibility: 'hidden' }}>{ANSWER}</span>
            <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}>
              {answerText}
              {(phase === 'answer') && cursor}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default function SpotlightConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [chipsInView, setChipsInView] = useState(false);
  const chipRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chipsInView || isStopped) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [chipsInView, isStopped]);

  useEffect(() => {
    if (!chipsInView || !chipRailRef.current) return;
    const container = chipRailRef.current;
    const chips = Array.from(container.querySelectorAll<HTMLElement>(':scope > div'));
    const chip = chips[activeIndex];
    if (!chip) return;
    const scrollLeft = chip.offsetLeft - container.offsetWidth / 2 + chip.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [activeIndex, chipsInView]);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setIsStopped(true);
  }, []);

  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setChipsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-8">
          <H2>Why Agents Look Closely at eXp</H2>
        </div>

        <div ref={chipsRef}>

        {/* Desktop: two-column grid with dots below */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[45%_55%] gap-6" style={{ height: '218px', overflow: 'visible' }}>
            <div style={{ height: '218px', overflow: 'visible' }}>
              <div className="grid grid-cols-2 gap-2" style={{ height: 'calc(50% - 5px)' }}>
                {FEATURES.slice(0, 2).map((f, i) => (
                  <div key={f.keyword} style={{ height: '100%' }}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i}
                      onSelect={() => handleSelect(i)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2" style={{ height: 'calc(50% - 5px)' }}>
                {FEATURES.slice(2, 4).map((f, i) => (
                  <div key={f.keyword} style={{ height: '100%' }}>
                    <FeatureChip
                      icon={f.icon}
                      keyword={f.keyword}
                      isActive={activeIndex === i + 2}
                      onSelect={() => handleSelect(i + 2)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '218px' }}>
              <DetailPanel feature={FEATURES[activeIndex]} transitionKey={activeIndex} />
            </div>
          </div>

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

        {/* Mobile / Tablet */}
        <div className="lg:hidden -mx-4 sm:-mx-8 md:-mx-12">
          <div className="relative mb-4 -my-4">
            <div
              ref={chipRailRef}
              className="sc-chip-rail flex gap-2 overflow-x-auto py-4 px-4 sm:px-8 md:px-12"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              <style>{`.sc-chip-rail::-webkit-scrollbar { display: none; }`}</style>
              {FEATURES.map((f, i) => (
                <div key={f.keyword} className="flex-shrink-0" style={{ width: '55%', height: '100px', scrollSnapAlign: 'center' }}>
                  <FeatureChip
                    icon={f.icon}
                    keyword={f.keyword}
                    isActive={activeIndex === i}
                    onSelect={() => handleSelect(i)}
                  />
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(to right, #080808, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(to left, #080808, transparent)' }} />
          </div>

          <div className="px-4 sm:px-8 md:px-12" style={{ display: 'grid', position: 'relative', zIndex: 1 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.keyword}
                aria-hidden={i !== activeIndex}
                style={{
                  gridArea: '1 / 1',
                  visibility: i === activeIndex ? 'visible' : 'hidden',
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                }}
              >
                <DetailPanel feature={f} transitionKey={i === activeIndex ? activeIndex : -1} />
              </div>
            ))}
          </div>

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
        </div>{/* end chipsRef sentinel */}

        <div className="mt-10">
          <ValidationRibbon />
        </div>

        <TypewriterLines />

      </div>
    </section>
  );
}
