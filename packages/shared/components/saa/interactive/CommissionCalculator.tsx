'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Calculator Formula:
 * - 20% to eXp (capped at $16k annually)
 * - $25/deal broker review
 * - $60/deal E&O Insurance (capped at $750)
 * - $250/deal Post-cap (first 20 deals after cap)
 * - $75/deal after 20 more transactions Post-cap
 */
function useCalculator(transactions: number, avgCommission: number) {
  const totalCommission = transactions * avgCommission;
  const commissionPerDealToExp = 0.2 * avgCommission;
  const potentialExpCommission = transactions * commissionPerDealToExp;
  const expCommission = Math.min(potentialExpCommission, 16000);
  const dealsAfterCap = Math.max((potentialExpCommission - 16000) / commissionPerDealToExp, 0);
  const postCapFirstTier = Math.min(dealsAfterCap, 20);
  const postCapSecondTier = Math.max(dealsAfterCap - 20, 0);
  const postCap250 = postCapFirstTier * 250;
  const postCap75 = postCapSecondTier * 75;
  const eoFee = Math.min(transactions * 60, 750);
  const brokerFee = transactions * 25;
  const totalFees = expCommission + eoFee + brokerFee + postCap250 + postCap75;
  const netCommission = totalCommission - totalFees;
  const isCapped = potentialExpCommission >= 16000;
  const dealsToCapNum = isCapped ? 0 : Math.ceil((16000 - potentialExpCommission) / commissionPerDealToExp);

  return {
    totalCommission: Math.round(totalCommission),
    expSplit: Math.round(expCommission),
    brokerFee: Math.round(brokerFee),
    eoFee: Math.round(eoFee),
    postCap250: Math.round(postCap250),
    postCap75: Math.round(postCap75),
    totalFees: Math.round(totalFees),
    netCommission: Math.round(netCommission),
    isCapped,
    dealsToCap: dealsToCapNum,
    dealsAfterCap: Math.round(dealsAfterCap),
    effectiveRate: totalCommission > 0 ? ((netCommission / totalCommission) * 100).toFixed(1) : '0',
  };
}

// Animated Number Component
function AnimatedNumber({ value, prefix = '$', duration = 500 }: { value: number; prefix?: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const diff = value - start;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevRef.current = value;
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString()}</span>;
}

// How It Works Dropdown Component
function HowItWorksDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="relative -mt-[1px]"
      style={{
        background: 'rgba(10,10,10,0.85)',
        borderLeft: '1px solid rgba(255,215,0,0.2)',
        borderRight: '1px solid rgba(255,215,0,0.2)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
        borderRadius: '0 0 1rem 1rem',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 text-left transition-all hover:bg-white/[0.02]"
        style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}
      >
        <span className="text-sm font-medium text-[#9a9890]">How It Works</span>
        <svg className={`w-5 h-5 text-[#9a9890] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 sm:px-6 py-4 text-xs text-[#9a9890] space-y-3" style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}>
          <p className="text-[#bfbdb0] font-medium">This calculator shows real estate agents their net commission at eXp Realty. It factors in:</p>
          <ul className="space-y-1 ml-4 list-disc list-inside">
            <li><span className="text-[#ffd700]">20% to eXp</span> (capped at $16k annually)</li>
            <li><span className="text-[#ffd700]">$25/deal</span> broker review</li>
            <li><span className="text-[#ffd700]">$60/deal</span> E&O Insurance (capped at $750)</li>
            <li><span className="text-[#ffd700]">$250/deal</span> Post-cap (After 100% commission)</li>
            <li><span className="text-[#ffd700]">$75/deal</span> after 20 more transactions Post-cap</li>
          </ul>
          <p className="italic text-[#6a6860]">Calculator does not include additional stock awards, ICON rewards, or revenue share income.</p>
        </div>
      </div>
    </div>
  );
}

export interface CommissionCalculatorProps {
  /** Initial number of transactions */
  initialTransactions?: number;
  /** Initial average commission per transaction */
  initialCommission?: number;
  /** Optional title override - set to null to hide */
  title?: string | null;
  /** Optional subtitle override - set to null to hide */
  subtitle?: string | null;
  /** Whether to show the "How It Works" dropdown */
  showHowItWorks?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * CommissionCalculator - Interactive eXp Commission Calculator with donut chart
 *
 * Shows real estate agents their net commission breakdown at eXp Realty with:
 * - Animated numbers
 * - Donut chart visualization
 * - Mobile-responsive layout
 * - Fee breakdown legend
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CommissionCalculator />
 *
 * // With custom initial values
 * <CommissionCalculator initialTransactions={25} initialCommission={8000} />
 *
 * // Without title
 * <CommissionCalculator title={null} />
 * ```
 */
export function CommissionCalculator({
  initialTransactions = 12,
  initialCommission = 10000,
  title = 'Commission Calculator',
  subtitle = 'See exactly what you keep at eXp Realty',
  showHowItWorks = true,
  className = '',
}: CommissionCalculatorProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [avgCommission, setAvgCommission] = useState(initialCommission);

  // Minimum $500 commission - show zeros if under
  const isValidCommission = avgCommission >= 500;
  const rawResults = useCalculator(transactions, avgCommission);

  // Zero out all values if commission is under $500
  const results = isValidCommission ? rawResults : {
    totalCommission: 0,
    expSplit: 0,
    brokerFee: 0,
    eoFee: 0,
    postCap250: 0,
    postCap75: 0,
    totalFees: 0,
    netCommission: 0,
    isCapped: false,
    dealsToCap: 0,
    dealsAfterCap: 0,
    effectiveRate: '0',
  };

  // All segments for the donut chart
  const allSegments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ];

  // For donut chart, only render segments with value > 0
  const chartSegments = allSegments.filter(s => s.value > 0);

  // For legend, exclude "You Keep" since it's already shown in the NET section
  const segments = allSegments.filter(s => s.label !== 'You Keep');
  const total = chartSegments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;

  // Tagline-style glow effect
  const taglineTextShadow = `
    0 0 0.01em #fff,
    0 0 0.02em #fff,
    0 0 0.03em rgba(255,255,255,0.8)
  `;
  const taglineFilter = `
    drop-shadow(0 0 0.04em #bfbdb0)
    drop-shadow(0 0 0.08em rgba(191,189,176,0.6))
  `;

  return (
    <div className={className}>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: showHowItWorks ? '1rem 1rem 0 0' : '1rem' }}>
        <div className="p-4 sm:p-6">
          {/* Title with Tagline styling */}
          {title !== null && (
            <h2
              className="text-center mb-2"
              style={{
                fontSize: 'clamp(24px, calc(22.55px + 0.58vw), 40px)',
                transform: 'rotateX(15deg)',
                color: '#bfbdb0',
                fontFeatureSettings: '"ss01" 1',
                textShadow: taglineTextShadow,
                filter: taglineFilter.trim(),
                fontFamily: 'var(--font-taskor)',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle !== null && (
            <p className="text-xs text-[#9a9890] text-center mb-4 sm:mb-6">{subtitle}</p>
          )}

          {/* Inputs - stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-full sm:w-28 sm:flex-shrink-0">
              <label className="block text-xs text-[#9a9890] mb-1">Avg Commission</label>
              <div className="flex items-center">
                <span className="text-[#ffd700] text-sm">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={avgCommission}
                  onChange={(e) => setAvgCommission(Number(e.target.value.replace(/\D/g, '')) || 0)}
                  className="w-full px-1 py-1 bg-transparent border-b border-[#ffd700]/30 text-white text-base font-mono focus:outline-none focus:border-[#ffd700]"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#9a9890] mb-1">Transactions: {transactions}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={transactions}
                  onChange={(e) => setTransactions(Number(e.target.value))}
                  className="flex-1 accent-[#ffd700]"
                  style={{
                    touchAction: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    minHeight: '44px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Hero numbers - stack all 3 on mobile, GROSS/NET left + FEES right on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* GROSS/NET - full width on mobile, flex-1 on desktop */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
              {/* GROSS row */}
              <div className="flex items-center gap-3 p-2 sm:p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-xs text-[#9a9890] w-12 flex-shrink-0">GROSS</span>
                <span className="text-lg sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-taskor)' }}>
                  <AnimatedNumber value={results.totalCommission} />
                </span>
              </div>
              {/* NET row */}
              <div className="flex items-center gap-3 p-2 sm:p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="text-xs text-[#10b981] w-12 flex-shrink-0">NET</span>
                <span className="text-lg sm:text-2xl font-bold text-[#10b981]" style={{ fontFamily: 'var(--font-taskor)', textShadow: '0 0 15px rgba(16,185,129,0.3)' }}>
                  <AnimatedNumber value={results.netCommission} />
                </span>
              </div>
            </div>

            {/* FEES card - horizontal on mobile (like GROSS/NET), centered column on desktop */}
            <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 p-2 sm:p-4 rounded-xl sm:text-center sm:flex-shrink-0 sm:w-[130px]" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <span className="text-xs text-[#ffd700] w-12 flex-shrink-0 sm:w-auto sm:mb-2">FEES</span>
              <span className="text-lg sm:text-xl font-bold text-[#ffd700]" style={{ fontFamily: 'var(--font-taskor)', textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
                <AnimatedNumber value={results.totalFees} />
              </span>
            </div>
          </div>

          {/* Legend + Donut - on mobile: legend first (full width), donut below centered. On desktop: side by side */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 items-center">
            {/* Donut chart - centered on mobile, left on desktop */}
            <div className="relative flex-shrink-0" style={{ width: '180px', height: '180px' }}>
              <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
                {chartSegments.map((seg, i) => {
                  const angle = (seg.value / total) * 360;
                  const startAngle = currentAngle;
                  currentAngle += angle;
                  const largeArc = angle > 180 ? 1 : 0;
                  const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const endX = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                  const endY = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

                  return (
                    <path
                      key={i}
                      d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                      fill={seg.color}
                      stroke="rgba(10,10,10,0.85)"
                      strokeWidth="1"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="25" fill="rgba(10,10,10,0.95)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#10b981]">{results.effectiveRate}%</span>
                <span className="text-[9px] text-[#9a9890]">KEEP RATE</span>
              </div>
            </div>

            {/* Detailed legend with amounts - full width on mobile, flex-1 on desktop */}
            <div className="w-full sm:flex-1 space-y-2">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: `${seg.color}08` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: seg.color }} />
                    <span className="text-sm text-[#bfbdb0]">{seg.label}</span>
                  </div>
                  <span className="text-sm font-bold font-mono" style={{ color: seg.color }}>${seg.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showHowItWorks && <HowItWorksDropdown />}
    </div>
  );
}

export default CommissionCalculator;
