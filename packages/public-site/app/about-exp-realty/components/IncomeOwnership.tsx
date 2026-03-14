'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds';
import { H2 } from '@saa/shared/components/saa/headings';
import { useScrambleCounter } from './hooks';

/* ═══ Sankey Flow Diagram (top strip) ═══ */

function SankeyFlow({ visible }: { visible: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl mb-8"
      style={{
        background: 'linear-gradient(180deg, rgba(10,14,20,0.95), rgba(8,10,16,0.98))',
        border: '1px solid rgba(0,191,255,0.1)',
        padding: '20px 24px',
      }}
    >
      {/* Horizontal step-based flow instead of Sankey */}
      <div className="flex items-center justify-evenly gap-2 sm:gap-4">
        {/* Step 1: Transaction */}
        <div
          className="flex-shrink-0 text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(0,191,255,0.1)', border: '1.5px solid rgba(0,191,255,0.35)' }}
          >
            <span className="text-lg sm:text-xl font-bold" style={{ color: '#00bfff' }}>$</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold block" style={{ color: '#00bfff' }}>Transaction</span>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}>
          <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
            <path d="M0 8 H24 M18 3 L26 8 L18 13" stroke="rgba(0,191,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Step 2: 80/20 Split */}
        <div
          className="flex-1 max-w-[200px] text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}
        >
          <div className="flex items-end justify-center gap-1 mb-2 h-16">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold mb-1" style={{ color: '#00bfff' }}>80%</span>
              <div className="w-8 sm:w-10 rounded-t" style={{ height: '40px', background: 'linear-gradient(180deg, rgba(0,191,255,0.5), rgba(0,191,255,0.2))', border: '1px solid rgba(0,191,255,0.4)', borderBottom: 'none' }} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold mb-1" style={{ color: '#ffd700' }}>20%</span>
              <div className="w-8 sm:w-10 rounded-t" style={{ height: '16px', background: 'linear-gradient(180deg, rgba(255,215,0,0.4), rgba(255,215,0,0.15))', border: '1px solid rgba(255,215,0,0.35)', borderBottom: 'none' }} />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--color-body-text)' }}>80/20 Split</span>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }}>
          <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
            <path d="M0 8 H24 M18 3 L26 8 L18 13" stroke="rgba(255,215,0,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Step 3: $16K Cap */}
        <div
          className="flex-shrink-0 text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }}
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1.5px solid rgba(255,215,0,0.35)' }}
          >
            <span className="text-sm sm:text-base font-bold" style={{ color: '#ffd700' }}>$16K</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold block" style={{ color: '#ffd700' }}>Annual Cap</span>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.8s' }}>
          <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
            <path d="M0 8 H24 M18 3 L26 8 L18 13" stroke="rgba(0,255,136,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Step 4: 100% Commission */}
        <div
          className="flex-shrink-0 text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.9s' }}
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{
              background: 'rgba(0,255,136,0.1)',
              border: '1.5px solid rgba(0,255,136,0.4)',
              boxShadow: '0 0 16px rgba(0,255,136,0.15)',
            }}
          >
            <span className="text-lg sm:text-xl font-bold" style={{ color: '#00ff88' }}>100%</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold block" style={{ color: '#00ff88' }}>After Cap</span>
          <span className="text-[10px] block mt-0.5" style={{ color: 'rgba(0,255,136,0.5)' }}>$85/mo only</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ ICON Gauge Ring ═══ */

function IconGaugeRing({ visible }: { visible: boolean }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90" style={{ overflow: 'visible' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ffd700" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={visible ? 0 : circumference}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold" style={{ color: '#ffd700' }}>$16K</span>
          <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,215,0,0.6)' }}>Cap</span>
        </div>
      </div>
      <p className="text-sm mt-3 text-center" style={{ color: 'rgba(255,215,0,0.8)' }}>ICON: Cap returned in stock</p>
    </div>
  );
}

/* ═══ Stock Mini Chart ═══ */

function StockMiniChart({ visible }: { visible: boolean }) {
  const points = [
    { x: 0, y: 40 }, { x: 14, y: 35 }, { x: 28, y: 38 }, { x: 42, y: 28 },
    { x: 56, y: 22 }, { x: 70, y: 25 }, { x: 84, y: 14 }, { x: 100, y: 8 },
  ];
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ' L 100 45 L 0 45 Z';

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
          EXPI
        </span>
        <span className="text-xs" style={{ color: 'rgba(0,255,136,0.6)' }}>Stock + Production Awards</span>
      </div>
      <svg viewBox="0 0 100 45" className="w-full" style={{ maxHeight: '60px' }}>
        <defs>
          <linearGradient id="stockFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.25)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0)" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#stockFill)" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }} />
        <path
          d={pathD} fill="none" stroke="#00ff88" strokeWidth={1.5} strokeLinecap="round"
          style={{
            strokeDasharray: 200, strokeDashoffset: visible ? 0 : 200,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.5))',
          }}
        />
        <circle cx={100} cy={8} r={2.5} fill="#00ff88"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease 1.5s', filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.7))' }} />
      </svg>
    </div>
  );
}

/* ═══ Revenue Share Bar Chart ═══ */

function RevenueShareBars({ visible }: { visible: boolean }) {
  const tiers = [
    { label: 'T1', height: 70, pct: '3.5%' },
    { label: 'T2', height: 80, pct: '4.0%' },
    { label: 'T3', height: 50, pct: '2.5%' },
    { label: 'T4', height: 30, pct: '1.5%' },
    { label: 'T5', height: 20, pct: '1.0%' },
    { label: 'T6', height: 50, pct: '2.5%' },
    { label: 'T7', height: 100, pct: '5.0%' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: '120px' }}>
        {tiers.map((tier, i) => (
          <div key={tier.label} className="flex flex-col items-center gap-1">
            <span
              className="text-[10px] font-bold"
              style={{
                color: 'rgba(153,51,255,0.9)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${i * 100 + 400}ms`,
              }}
            >{tier.pct}</span>
            <div
              className="io-tier-bar rounded-t"
              style={{
                width: '20px',
                height: visible ? `${tier.height}px` : '0px',
                background: `linear-gradient(180deg, rgba(153,51,255,${0.6 - i * 0.06}), rgba(153,51,255,${0.3 - i * 0.03}))`,
                border: '1px solid rgba(153,51,255,0.4)',
                borderBottom: 'none',
                transition: `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 100}ms`,
              }}
            />
            <span className="text-[11px] font-mono font-semibold" style={{ color: 'rgba(153,51,255,0.7)' }}>{tier.label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm mt-3 text-center" style={{ color: 'rgba(153,51,255,0.7)' }}>
        7-tier program from company revenue
      </p>
      <p className="text-xs mt-1 text-center" style={{ color: 'var(--color-body-text)', opacity: 0.75 }}>
        Optional and inheritable
      </p>
    </div>
  );
}

/* ═══ Fee Comparison Bars ═══ */

function FeeComparison({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-6" style={{ height: '120px' }}>
        {/* Traditional */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold mb-1" style={{ color: 'rgba(255,80,80,0.8)' }}>$500-2K+</span>
          <div
            className="rounded-t"
            style={{
              width: '36px',
              height: visible ? '95px' : '0px',
              background: 'linear-gradient(180deg, rgba(255,80,80,0.5), rgba(255,80,80,0.2))',
              border: '1px solid rgba(255,80,80,0.4)',
              borderBottom: 'none',
              transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: 'rgba(255,80,80,0.7)' }}>Traditional</span>
        </div>
        {/* eXp */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold mb-1" style={{ color: '#00bfff' }}>$85/mo</span>
          <div
            className="rounded-t"
            style={{
              width: '36px',
              height: visible ? '24px' : '0px',
              background: 'linear-gradient(180deg, rgba(0,191,255,0.5), rgba(0,191,255,0.2))',
              border: '1px solid rgba(0,191,255,0.4)',
              borderBottom: 'none',
              transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: 'rgba(0,191,255,0.7)' }}>eXp</span>
        </div>
      </div>
      <p className="text-sm mt-3 text-center" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
        No desk, franchise, or royalty fees
      </p>
    </div>
  );
}

/* ═══ Main Component ═══ */

export default function IncomeOwnershipSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ marginBottom: '-3px', position: 'relative', zIndex: 2 }}>
      <GlassPanel variant="expBlueCrosshatch" noBlur>
        <section id="income" ref={sectionRef} className="py-[50px] px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-6">
              <H2>INCOME & OWNERSHIP</H2>
            </div>

            {/* Sankey flow - desktop only */}
            <div className="hidden lg:block">
              <SankeyFlow visible={visible} />
            </div>

            {/* Mobile flow summary */}
            <div className="lg:hidden mb-6">
              <div
                className="flex flex-col items-center justify-center gap-0 py-3 px-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,191,255,0.06), rgba(0,255,136,0.04))',
                  border: '1px solid rgba(0,191,255,0.15)',
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: '#00bfff' }}>80/20</span>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none"><path d="M0 5 H14 M10 1.5 L16 5 L10 8.5" stroke="rgba(0,191,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="text-xs uppercase" style={{ color: '#ffd700' }}>$16K Cap</span>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none"><path d="M0 5 H14 M10 1.5 L16 5 L10 8.5" stroke="rgba(0,255,136,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="text-sm font-semibold" style={{ color: '#00ff88' }}>100%</span>
                </div>
                <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--color-body-text, #dcdbd5)', opacity: 0.75 }}>
                  80/20 split → $16K cap → 100% commission. $85/mo flat fee.
                </p>
              </div>
            </div>

            {/* Asymmetric 3-panel grid */}
            <div className="io-panels-grid gap-4 md:gap-5">
              {/* Left panel: ICON + Stock (~45%) */}
              <div
                className="io-panel-left rounded-2xl p-5 md:p-6 relative"
                style={{
                  background: 'linear-gradient(180deg, rgba(12,14,20,0.95), rgba(8,10,16,0.98))',
                  border: '1px solid rgba(0,191,255,0.12)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
                }}
              >
                <h3 className="text-h5 mb-3 text-center" style={{ color: '#e5e4dd' }}>Income & Stock</h3>
                <p className="text-sm text-center mb-5" style={{ color: 'var(--color-body-text, #dcdbd5)', opacity: 0.8, lineHeight: '1.5' }}>
                  80/20 split until a $16,000 annual cap, then 100% commission. Cap returned in company stock for qualifying ICON agents. Production awards plus discounted stock purchase option.
                </p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <IconGaugeRing visible={visible} />
                  <div className="flex-1 w-full">
                    <StockMiniChart visible={visible} />
                  </div>
                </div>
              </div>

              {/* Center panel: Revenue Share (~30%) */}
              <div
                className="io-panel-center rounded-2xl p-5 md:p-6 relative"
                style={{
                  background: 'linear-gradient(180deg, rgba(20,12,28,0.95), rgba(12,8,18,0.98))',
                  border: '1px solid rgba(153,51,255,0.15)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s',
                }}
              >
                <h3 className="text-h5 mb-3 text-center" style={{ color: '#9933ff' }}>Revenue Share</h3>
                <p className="text-sm text-center mb-5" style={{ color: 'var(--color-body-text, #dcdbd5)', opacity: 0.8, lineHeight: '1.5' }}>
                  Seven-tier program paid from company revenue, optional and inheritable
                </p>
                <RevenueShareBars visible={visible} />
              </div>

              {/* Right panel: Fee Comparison (~25%) */}
              <div
                className="io-panel-right rounded-2xl p-5 md:p-6 relative"
                style={{
                  background: 'linear-gradient(180deg, rgba(14,12,12,0.95), rgba(10,8,8,0.98))',
                  border: '1px solid rgba(255,80,80,0.1)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
                }}
              >
                <h3 className="text-h5 mb-3 text-center" style={{ color: '#e5e4dd' }}>Fees</h3>
                <p className="text-sm text-center mb-5" style={{ color: 'var(--color-body-text, #dcdbd5)', opacity: 0.8, lineHeight: '1.5' }}>
                  $85 monthly flat fee, no desk, franchise, or royalty fees
                </p>
                <FeeComparison visible={visible} />
              </div>
            </div>

            <div className="text-center mt-8">
              <a href="/about-exp-realty/income" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>Learn more about income & ownership →</a>
            </div>
          </div>
        </section>
      </GlassPanel>

      <style>{`
        .io-panels-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .io-panels-grid {
            grid-template-columns: 1fr 1fr;
          }
          .io-panel-left {
            grid-column: 1 / 3;
          }
        }
        @media (min-width: 1024px) {
          .io-panels-grid {
            grid-template-columns: 9fr 6fr 5fr;
          }
          .io-panel-left {
            grid-column: auto;
          }
        }
        .io-panel-left:hover,
        .io-panel-center:hover,
        .io-panel-right:hover {
          box-shadow: 0 0 24px rgba(0,191,255,0.06), 0 8px 24px rgba(0,0,0,0.3);
        }
        .io-tier-bar:hover {
          filter: brightness(1.3);
        }
      `}</style>
    </div>
  );
}
