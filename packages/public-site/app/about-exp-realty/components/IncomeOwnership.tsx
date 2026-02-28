'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { GenericCard } from '@saa/shared/components/saa/cards';
import { H2 } from '@saa/shared/components/saa/headings';
import { DollarSign, Award, TrendingUp, Receipt } from 'lucide-react';
import { useScrambleCounter } from './hooks';

const PURPLE_3D_SHADOW = '-1px -1px 0 #c9a0ff, 1px 1px 0 #8a5db8, 2px 2px 0 #6a4d98, 3px 3px 0 #4a3d78, 4px 4px 0 #2d2a4d, 5px 5px 4px rgba(0,0,0,0.5)';

const INCOME_STREAMS = [
  {
    icon: DollarSign,
    title: 'Commission',
    description: '80/20 split until a $16,000 annual cap, then 100% commission',
  },
  {
    icon: Award,
    title: 'ICON Program',
    description: 'Cap returned in company stock for qualifying agents',
  },
  {
    icon: TrendingUp,
    title: 'Stock Ownership',
    description: 'Production awards plus discounted stock purchase option',
  },
];

const FEES_CARD = {
  icon: Receipt,
  title: 'eXp Fees',
  description: '$85 monthly flat fee, no desk, franchise, or royalty fees',
};

const REVENUE_SHARE = {
  tierCount: 7,
  description: 'Seven-tier program paid from company revenue, optional and inheritable',
};

const RING_COUNT = 7;
const RING_BASE_PCT = 22;
const RING_MAX_PCT = 95;
const RING_STEP_PCT = (RING_MAX_PCT - RING_BASE_PCT) / (RING_COUNT - 1);

function RisingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 25;

    interface Particle {
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      opacity: number;
    }

    let particles: Particle[] = [];
    let rafId: number;

    const init = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 1.5,
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.4,
        opacity: 0.1 + Math.random() * 0.25,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particles.length === 0) init();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -p.r) {
          p.y = canvas.height + p.r;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,80,255,${p.opacity})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

function CommissionDonut() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const eightyPercent = circumference * 0.8;

  return (
    <div ref={ref} className="flex items-center justify-center h-20 overflow-visible">
      <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,191,255,0.15)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#00bfff" strokeWidth={strokeWidth}
          strokeDasharray={`${eightyPercent} ${circumference}`}
          strokeDashoffset={isVisible ? 0 : circumference}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.5))' }}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ffd700" strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.2} ${circumference}`}
          strokeDashoffset={isVisible ? -eightyPercent : circumference}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s', filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: '#00bfff' }}>80</span>
        <span className="text-[10px] opacity-60" style={{ color: '#ffd700' }}>/ 20</span>
      </div>
    </div>
  );
}

function IconBadge() {
  return (
    <div className="flex items-center justify-center h-20">
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.05) 70%, transparent 100%)',
          boxShadow: '0 0 20px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.1)',
          animation: 'iconGlow 3s ease-in-out infinite',
        }}
      >
        <Award size={32} style={{ color: '#ffd700', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' }} />
      </div>
      <style jsx>{`
        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 30px rgba(255,215,0,0.5), inset 0 0 20px rgba(255,215,0,0.2); }
        }
      `}</style>
    </div>
  );
}

function StockChart() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const points = [
    { x: 0, y: 45 }, { x: 15, y: 40 }, { x: 30, y: 42 }, { x: 45, y: 30 },
    { x: 60, y: 25 }, { x: 75, y: 28 }, { x: 90, y: 15 }, { x: 100, y: 10 },
  ];

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L 100 50 L 0 50 Z`;

  return (
    <div ref={ref} className="flex items-center justify-center h-20">
      <svg width={100} height={50} viewBox="0 0 100 50" className="overflow-visible">
        <defs>
          <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.3)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0)" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#stockGradient)" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s ease-out 0.5s' }} />
        <path
          d={pathD} fill="none" stroke="#00ff88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          style={{
            strokeDasharray: 200, strokeDashoffset: isVisible ? 0 : 200,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.6))',
          }}
        />
        <circle cx={100} cy={10} r={3} fill="#00ff88" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease-out 1.5s', filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.8))' }} />
      </svg>
    </div>
  );
}

function FeesBadge() {
  return (
    <div className="flex flex-col items-center justify-center h-20 overflow-visible">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,80,0.2) 0%, rgba(255,80,80,0.08) 60%, transparent 100%)',
          border: '2px solid rgba(255,80,80,0.5)',
          boxShadow: '0 0 25px rgba(255,80,80,0.3), inset 0 0 15px rgba(255,80,80,0.15)',
        }}
      >
        <span className="text-2xl font-bold" style={{ color: '#ff5050', textShadow: '0 0 12px rgba(255,80,80,0.6)' }}>
          $85
        </span>
      </div>
    </div>
  );
}

export default function IncomeOwnershipSection() {
  const tierCounter = useScrambleCounter(7, 1500, false);

  const cardVisuals: Record<string, { visual: React.ReactNode; borderColor: string }> = {
    'Commission': { visual: <CommissionDonut />, borderColor: 'rgba(0,191,255,0.3)' },
    'ICON Program': { visual: <IconBadge />, borderColor: 'rgba(255,215,0,0.3)' },
    'Stock Ownership': { visual: <StockChart />, borderColor: 'rgba(0,255,136,0.3)' },
    'eXp Fees': { visual: <FeesBadge />, borderColor: 'rgba(255,80,80,0.3)' },
  };

  return (
    <div style={{ marginBottom: '-3px', position: 'relative', zIndex: 2 }}>
    <GlassPanel variant="expBlueCrosshatch" noBlur>
      <section id="income" className="py-[50px] px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">

          <div className="text-center mb-12">
            <H2>INCOME & OWNERSHIP</H2>
          </div>

          <div className="income-cards-grid gap-6 mb-12">
            <div className="income-card-2 h-full">
              <GenericCard padding="md" className="h-full" style={{ borderColor: cardVisuals['Commission'].borderColor }}>
                <div className="flex flex-col items-center text-center h-full overflow-visible">
                  <div className="relative mb-4 overflow-visible">{cardVisuals['Commission'].visual}</div>
                  <h3 className="text-h4 mb-2" style={{ color: '#00bfff' }}>Commission</h3>
                  <p className="text-body opacity-80 mt-auto">{INCOME_STREAMS[0].description}</p>
                </div>
              </GenericCard>
            </div>

            <div className="income-card-2 h-full">
              <GenericCard padding="md" className="h-full" style={{ borderColor: cardVisuals['ICON Program'].borderColor }}>
                <div className="flex flex-col items-center text-center h-full overflow-visible">
                  <div className="relative mb-4 overflow-visible">{cardVisuals['ICON Program'].visual}</div>
                  <h3 className="text-h4 mb-2" style={{ color: '#ffd700' }}>ICON Program</h3>
                  <p className="text-body opacity-80 mt-auto">{INCOME_STREAMS[1].description}</p>
                </div>
              </GenericCard>
            </div>

            <div className="income-card-2 h-full">
              <GenericCard padding="md" className="h-full" style={{ borderColor: cardVisuals['Stock Ownership'].borderColor }}>
                <div className="flex flex-col items-center text-center h-full overflow-visible">
                  <div className="relative mb-4 overflow-visible">{cardVisuals['Stock Ownership'].visual}</div>
                  <h3 className="text-h4 mb-2" style={{ color: '#00ff88' }}>Stock Ownership</h3>
                  <p className="text-body opacity-80 mt-auto">{INCOME_STREAMS[2].description}</p>
                </div>
              </GenericCard>
            </div>

            <div className="income-card-3 h-full">
              <GenericCard padding="md" className="h-full" style={{ borderColor: cardVisuals['eXp Fees'].borderColor }}>
                <div className="flex flex-col items-center text-center h-full justify-center">
                  <div className="mb-4"><FeesBadge /></div>
                  <h3 className="text-h4 mb-2" style={{ color: '#ff5050' }}>{FEES_CARD.title}</h3>
                  <p className="text-body opacity-80">{FEES_CARD.description}</p>
                </div>
              </GenericCard>
            </div>

            <div className="income-card-3 income-card-md-full h-full">
              <div
                className="relative rounded-2xl p-6 sm:p-8 h-full overflow-hidden"
                style={{
                  background: 'rgba(60,20,80,0.3)',
                  border: '1px solid rgba(160,80,255,0.25)',
                  boxShadow: 'inset 0 0 40px rgba(120,60,180,0.08), 0 0 30px rgba(100,50,150,0.1)',
                }}
              >
                <RisingParticles />

                {/* Mobile layout */}
                <div className="min-[765px]:hidden relative z-[1] flex gap-4 items-center">
                  <div className="flex-1">
                    <h3 className="text-h4 mb-2" style={{ color: '#a050ff' }}>Revenue Share</h3>
                    <p className="text-body opacity-80">{REVENUE_SHARE.description}</p>
                  </div>
                  <div className="flex-shrink-0" style={{ width: '140px', height: '140px' }}>
                    <div className="relative w-full h-full">
                      {Array.from({ length: RING_COUNT }, (_, i) => {
                        const pct = RING_BASE_PCT + i * RING_STEP_PCT;
                        const opacity = 0.6 - i * 0.05;
                        return (
                          <div key={i} className="absolute rounded-full" style={{
                            width: `${pct}%`, height: `${pct}%`, top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%) scale(1)', opacity: 1,
                            border: `1px solid rgba(160,80,255,${opacity})`,
                            boxShadow: `0 0 8px rgba(160,80,255,${opacity * 0.5})`,
                            transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms, opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
                          }} />
                        );
                      })}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold tabular-nums leading-none" style={{ color: '#a050ff', textShadow: PURPLE_3D_SHADOW }}>
                          <span ref={tierCounter.elementRef}>{tierCounter.hasAnimated ? '7' : tierCounter.displayValue}</span>
                        </p>
                        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#e5e4dd', opacity: 0.7 }}>TIERS</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tablet layout */}
                <div className="hidden min-[765px]:flex min-[1020px]:hidden relative z-[1] flex-col items-center text-center">
                  <div className="mb-4" style={{ width: '180px', height: '180px' }}>
                    <div className="relative w-full h-full">
                      {Array.from({ length: RING_COUNT }, (_, i) => {
                        const pct = RING_BASE_PCT + i * RING_STEP_PCT;
                        const opacity = 0.6 - i * 0.05;
                        return (
                          <div key={i} className="absolute rounded-full" style={{
                            width: `${pct}%`, height: `${pct}%`, top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%) scale(1)', opacity: 1,
                            border: `1px solid rgba(160,80,255,${opacity})`,
                            boxShadow: `0 0 8px rgba(160,80,255,${opacity * 0.5})`,
                            transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms, opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
                          }} />
                        );
                      })}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <p className="text-5xl font-bold tabular-nums leading-none" style={{ color: '#a050ff', textShadow: PURPLE_3D_SHADOW }}>
                          {tierCounter.hasAnimated ? '7' : tierCounter.displayValue}
                        </p>
                        <p className="text-sm uppercase tracking-widest mt-1" style={{ color: '#e5e4dd', opacity: 0.7 }}>TIERS</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-h4 mb-2" style={{ color: '#e5e4dd' }}>Revenue Share</h3>
                  <p className="text-body opacity-80">{REVENUE_SHARE.description}</p>
                </div>

                {/* Desktop layout */}
                <div className="hidden min-[1020px]:block">
                  <div
                    className="absolute pointer-events-none z-0 flex items-center justify-end"
                    style={{ top: '10px', bottom: '10px', right: '10px', left: '50%', overflow: 'visible' }}
                  >
                    <div className="relative" style={{ width: '240px', height: '240px' }}>
                      {Array.from({ length: RING_COUNT }, (_, i) => {
                        const pct = RING_BASE_PCT + i * RING_STEP_PCT;
                        const opacity = 0.6 - i * 0.05;
                        return (
                          <div key={i} className="absolute rounded-full" style={{
                            width: `${pct}%`, height: `${pct}%`, top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%) scale(1)', opacity: 1,
                            border: `1px solid rgba(160,80,255,${opacity})`,
                            boxShadow: `0 0 8px rgba(160,80,255,${opacity * 0.5})`,
                            transition: `transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms, opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
                            animation: i === RING_COUNT - 1 ? 'ringPulse 3s ease-in-out 2.5s infinite' : undefined,
                          }} />
                        );
                      })}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <p className="text-5xl sm:text-6xl font-bold tabular-nums leading-none" style={{ color: '#a050ff', textShadow: PURPLE_3D_SHADOW }}>
                          {tierCounter.hasAnimated ? '7' : tierCounter.displayValue}
                        </p>
                        <p className="text-sm uppercase tracking-widest mt-1" style={{ color: '#e5e4dd', opacity: 0.7 }}>TIERS</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-[1] grid grid-cols-2 gap-6 min-h-[200px]">
                    <div className="flex flex-col justify-center">
                      <h3 className="text-h4 mb-2" style={{ color: '#e5e4dd' }}>Revenue Share</h3>
                      <p className="text-body opacity-80">{REVENUE_SHARE.description}</p>
                    </div>
                    <div />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="text-center mt-8">
          <a href="/about-exp-realty/income" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Learn more about income &amp; ownership →</a>
        </div>
      </section>
    </GlassPanel>
    </div>
  );
}
