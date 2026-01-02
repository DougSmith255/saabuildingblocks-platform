'use client';

import { useEffect, useState, useRef } from 'react';
import { H1 } from '@saa/shared/components/saa';

/**
 * Calculator Formula (preserved across all designs):
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

// Shared Disclaimer Dropdown Component
function DisclaimerDropdown() {
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

// ============================================================================
// DESIGN PROPS
// ============================================================================
interface DesignProps {
  transactions: number;
  setTransactions: (n: number) => void;
  avgCommission: number;
  setAvgCommission: (n: number) => void;
}

// ============================================================================
// DESIGN 5A: Original Donut - Enhanced Number Display
// ============================================================================
function Design5A({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const segments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ].filter(s => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;

  return (
    <div className="rounded-t-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-1 text-center">Version A: Large Number Cards</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Prominent animated numbers below donut</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Transactions: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700] mt-2"
            />
          </div>
        </div>

        {/* Donut chart */}
        <div className="relative mx-auto mb-6" style={{ width: '200px', height: '200px' }}>
          <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
            {segments.map((seg, i) => {
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
            <span className="text-xs text-[#9a9890]">Keep Rate</span>
          </div>
        </div>

        {/* Large number cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '2px solid rgba(16,185,129,0.4)' }}>
            <p className="text-xs text-[#10b981] mb-2 uppercase tracking-wider">You Keep</p>
            <p className="text-3xl font-bold text-[#10b981]" style={{ textShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <AnimatedNumber value={results.netCommission} />
            </p>
          </div>
          <div className="p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))', border: '2px solid rgba(255,215,0,0.4)' }}>
            <p className="text-xs text-[#ffd700] mb-2 uppercase tracking-wider">Total Fees</p>
            <p className="text-3xl font-bold text-[#ffd700]" style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
              <AnimatedNumber value={results.totalFees} />
            </p>
          </div>
        </div>

        {/* Fee breakdown legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {segments.slice(1).map((seg, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                <span className="text-[#9a9890]">{seg.label}</span>
              </div>
              <span className="text-white font-mono">${seg.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5B: Donut with Side Stats Panel
// ============================================================================
function Design5B({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const segments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ].filter(s => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;

  return (
    <div className="rounded-t-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-1 text-center">Version B: Side Panel Layout</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Donut + stats side by side</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Transactions: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700] mt-2"
            />
          </div>
        </div>

        {/* Two column layout: Donut + Stats */}
        <div className="grid grid-cols-2 gap-6">
          {/* Donut */}
          <div className="relative" style={{ width: '100%', aspectRatio: '1' }}>
            <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
              {segments.map((seg, i) => {
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
              <span className="text-xl font-bold text-[#10b981]">{results.effectiveRate}%</span>
              <span className="text-[10px] text-[#9a9890]">Keep</span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="flex flex-col justify-center space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', borderLeft: '3px solid #10b981' }}>
              <p className="text-[10px] text-[#10b981] uppercase">Net Commission</p>
              <p className="text-xl font-bold text-[#10b981]">
                <AnimatedNumber value={results.netCommission} />
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,215,0,0.1)', borderLeft: '3px solid #ffd700' }}>
              <p className="text-[10px] text-[#ffd700] uppercase">Total Fees</p>
              <p className="text-xl font-bold text-[#ffd700]">
                <AnimatedNumber value={results.totalFees} />
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #9a9890' }}>
              <p className="text-[10px] text-[#9a9890] uppercase">Gross</p>
              <p className="text-xl font-bold text-white">
                <AnimatedNumber value={results.totalCommission} />
              </p>
            </div>
          </div>
        </div>

        {/* Compact legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
              <span className="text-[#9a9890]">{seg.label}:</span>
              <span className="text-white font-mono">${seg.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5C: Donut with Tooltip Hover + Bottom Bar
// ============================================================================
function Design5C({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const segments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981', description: 'Your take-home after all fees' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700', description: '20% until $16k cap' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500', description: '$25 per transaction' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b', description: '$60/deal, max $750' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc', description: '$250 then $75/deal' },
  ].filter(s => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;

  return (
    <div className="rounded-t-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-1 text-center">Version C: Interactive Hover</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Hover segments for details + bottom stats bar</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Transactions: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700] mt-2"
            />
          </div>
        </div>

        {/* Donut with hover */}
        <div className="relative mx-auto mb-4" style={{ width: '220px', height: '220px' }}>
          <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
            {segments.map((seg, i) => {
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
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    transform: hoveredSegment === i ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    filter: hoveredSegment === i ? `drop-shadow(0 0 10px ${seg.color})` : 'none',
                  }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}
            <circle cx="50" cy="50" r="22" fill="rgba(10,10,10,0.95)" />
          </svg>

          {/* Center content - changes on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredSegment !== null ? (
              <>
                <span className="text-lg font-bold" style={{ color: segments[hoveredSegment].color }}>
                  ${segments[hoveredSegment].value.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#9a9890] max-w-[80px]">{segments[hoveredSegment].label}</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-[#10b981]">{results.effectiveRate}%</span>
                <span className="text-[10px] text-[#9a9890]">Keep Rate</span>
              </>
            )}
          </div>
        </div>

        {/* Hover info panel */}
        <div className="h-12 flex items-center justify-center mb-4">
          {hoveredSegment !== null ? (
            <div className="text-center animate-fadeIn">
              <p className="text-sm" style={{ color: segments[hoveredSegment].color }}>{segments[hoveredSegment].description}</p>
            </div>
          ) : (
            <p className="text-xs text-[#6a6860]">Hover over segments for details</p>
          )}
        </div>

        {/* Bottom stats bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-[10px] text-[#9a9890] mb-1">GROSS</p>
            <p className="text-lg font-bold text-white"><AnimatedNumber value={results.totalCommission} /></p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,215,0,0.08)' }}>
            <p className="text-[10px] text-[#ffd700] mb-1">FEES</p>
            <p className="text-lg font-bold text-[#ffd700]"><AnimatedNumber value={results.totalFees} /></p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)' }}>
            <p className="text-[10px] text-[#10b981] mb-1">NET</p>
            <p className="text-lg font-bold text-[#10b981]"><AnimatedNumber value={results.netCommission} /></p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5D: Donut with Ring Progress + Glowing Numbers
// ============================================================================
function Design5D({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const segments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ].filter(s => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;
  const capProgress = Math.min((results.expSplit / 16000) * 100, 100);

  return (
    <div className="rounded-t-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-1 text-center">Version D: Ring Progress + Glow</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Outer ring shows cap progress with glowing numbers</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Transactions: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700] mt-2"
            />
          </div>
        </div>

        {/* Donut with outer ring */}
        <div className="relative mx-auto mb-6" style={{ width: '240px', height: '240px' }}>
          {/* Outer cap progress ring */}
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,215,0,0.1)" strokeWidth="3" />
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              stroke={results.isCapped ? '#10b981' : '#ffd700'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${capProgress * 3.02} 302`}
              transform="rotate(-90 50 50)"
              style={{ filter: `drop-shadow(0 0 6px ${results.isCapped ? '#10b981' : '#ffd700'})`, transition: 'all 0.5s' }}
            />
          </svg>

          {/* Inner donut */}
          <svg viewBox="0 0 100 100" className="absolute inset-[12%] transform -rotate-90" style={{ width: '76%', height: '76%' }}>
            {segments.map((seg, i) => {
              const angle = (seg.value / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              const largeArc = angle > 180 ? 1 : 0;
              const startX = 50 + 38 * Math.cos((startAngle * Math.PI) / 180);
              const startY = 50 + 38 * Math.sin((startAngle * Math.PI) / 180);
              const endX = 50 + 38 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const endY = 50 + 38 * Math.sin(((startAngle + angle) * Math.PI) / 180);

              return (
                <path
                  key={i}
                  d={`M 50 50 L ${startX} ${startY} A 38 38 0 ${largeArc} 1 ${endX} ${endY} Z`}
                  fill={seg.color}
                  stroke="rgba(10,10,10,0.85)"
                  strokeWidth="1"
                />
              );
            })}
            <circle cx="50" cy="50" r="22" fill="rgba(10,10,10,0.95)" />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#10b981]">{results.effectiveRate}%</span>
            <span className="text-[10px] text-[#9a9890]">{results.isCapped ? 'CAPPED!' : `${results.dealsToCap} to cap`}</span>
          </div>
        </div>

        {/* Glowing number cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div
            className="p-4 rounded-xl text-center relative overflow-hidden"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.4) 0%, transparent 70%)' }} />
            <p className="text-xs text-[#10b981] mb-1 relative z-10">NET COMMISSION</p>
            <p className="text-2xl font-bold text-[#10b981] relative z-10" style={{ textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>
              <AnimatedNumber value={results.netCommission} />
            </p>
          </div>
          <div
            className="p-4 rounded-xl text-center relative overflow-hidden"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}
          >
            <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(255,215,0,0.4) 0%, transparent 70%)' }} />
            <p className="text-xs text-[#ffd700] mb-1 relative z-10">TOTAL FEES</p>
            <p className="text-2xl font-bold text-[#ffd700] relative z-10" style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
              <AnimatedNumber value={results.totalFees} />
            </p>
          </div>
        </div>

        {/* Fee breakdown chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {segments.slice(1).map((seg, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
              style={{ background: `${seg.color}15`, border: `1px solid ${seg.color}40` }}
            >
              <span style={{ color: seg.color }}>{seg.label}</span>
              <span className="text-white font-mono">${seg.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5E: Donut with Animated Bars Below
// ============================================================================
function Design5E({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const segments = [
    { label: 'You Keep', value: results.netCommission, color: '#10b981' },
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700' },
    { label: 'Broker Fee', value: results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: results.eoFee, color: '#ff6b6b' },
    { label: 'Post-Cap', value: results.postCap250 + results.postCap75, color: '#c084fc' },
  ].filter(s => s.value > 0);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;
  const maxFee = Math.max(...segments.map(s => s.value));

  return (
    <div className="rounded-t-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none' }}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-1 text-center">Version E: Donut + Bar Breakdown</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Compact donut with detailed animated bars</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Transactions: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700] mt-2"
            />
          </div>
        </div>

        {/* Small donut + main numbers */}
        <div className="flex items-center gap-6 mb-6">
          {/* Compact donut */}
          <div className="relative flex-shrink-0" style={{ width: '120px', height: '120px' }}>
            <svg viewBox="0 0 100 100" className="w-full transform -rotate-90">
              {segments.map((seg, i) => {
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
              <span className="text-lg font-bold text-[#10b981]">{results.effectiveRate}%</span>
            </div>
          </div>

          {/* Main numbers */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-[#9a9890]">Gross Commission</p>
              <p className="text-2xl font-bold text-white"><AnimatedNumber value={results.totalCommission} /></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#10b981]">You Keep</p>
                <p className="text-xl font-bold text-[#10b981]"><AnimatedNumber value={results.netCommission} /></p>
              </div>
              <div>
                <p className="text-xs text-[#ffd700]">Total Fees</p>
                <p className="text-xl font-bold text-[#ffd700]"><AnimatedNumber value={results.totalFees} /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Animated bar breakdown */}
        <div className="space-y-3">
          {segments.map((seg, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                  <span className="text-[#9a9890]">{seg.label}</span>
                </div>
                <span className="font-mono" style={{ color: seg.color }}>${seg.value.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(seg.value / maxFee) * 100}%`,
                    background: `linear-gradient(90deg, ${seg.color}99, ${seg.color})`,
                    boxShadow: `0 0 8px ${seg.color}40`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5F: Full-Width Dashboard Style
// ============================================================================
function Design5F({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
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
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <div className="p-4 sm:p-6">
        {/* Title with Tagline styling, matching RevShare visualizer H2 size */}
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
          Commission Calculator
        </h2>
        <p className="text-xs text-[#9a9890] text-center mb-4 sm:mb-6">See exactly what you keep at eXp Realty</p>

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
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
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

          {/* FEES card - full width on mobile, fixed width on desktop */}
          <div className="flex flex-col justify-center p-3 sm:p-4 rounded-xl text-center sm:flex-shrink-0 sm:w-[130px]" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <p className="text-xs text-[#ffd700] mb-1 sm:mb-2">FEES</p>
            <p className="text-lg sm:text-xl font-bold text-[#ffd700]" style={{ fontFamily: 'var(--font-taskor)', textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
              <AnimatedNumber value={results.totalFees} />
            </p>
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
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// WHY EXP SECTION ALTERNATIVES
// ============================================================================

// Shared data for all layouts
const whyExpData = {
  overview: [
    'The only cumulatively profitable public real estate company.',
    'S&P 600 SmallCap. First cloud-based brokerage.',
    'Choose your sponsor. Access real support.',
  ],
  commission: '80/20 split until cap → 100% commission. Flat monthly fee.',
  revshare: 'Stock awards + optional revenue share income.',
};

// Layout A: Horizontal Pills + Inline Buttons
function WhyExpLayoutA() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#ffd700] text-center mb-2">Layout A: Horizontal Flow</h3>
      <p className="text-xs text-[#6a6860] text-center mb-4">All info in one horizontal band with inline buttons</p>

      <div className="p-6 rounded-2xl" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,215,0,0.15)' }}>
        {/* Overview pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {whyExpData.overview.map((item, i) => (
            <span key={i} className="px-4 py-2 rounded-full text-sm text-[#bfbdb0]" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
              {item}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#9a9890]">{whyExpData.commission}</span>
            <a href="/exp-commission-calculator/" className="px-4 py-2 rounded-lg text-sm font-medium text-[#ffd700] whitespace-nowrap" style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
              Calculator →
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#9a9890]">{whyExpData.revshare}</span>
            <a href="/exp-realty-revenue-share-calculator/" className="px-4 py-2 rounded-lg text-sm font-medium text-[#ffd700] whitespace-nowrap" style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
              Visualizer →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout B: Single Card with Integrated Buttons
function WhyExpLayoutB() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#ffd700] text-center mb-2">Layout B: Unified Card</h3>
      <p className="text-xs text-[#6a6860] text-center mb-4">Everything in one cohesive card, buttons at bottom</p>

      <div className="p-6 rounded-2xl" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,215,0,0.15)' }}>
        {/* All bullet points together */}
        <div className="space-y-3 mb-6">
          {[...whyExpData.overview, whyExpData.commission, whyExpData.revshare].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: i < 3 ? '#ffd700' : '#10b981' }} />
              <span className="text-[#bfbdb0]">{item}</span>
            </div>
          ))}
        </div>

        {/* Buttons row */}
        <div className="flex gap-4 justify-center pt-4" style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}>
          <a href="/exp-commission-calculator/" className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#ffd700]" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)' }}>
            Commission Calculator
          </a>
          <a href="/exp-realty-revenue-share-calculator/" className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#10b981]" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            RevShare Visualizer
          </a>
        </div>
      </div>
    </div>
  );
}

// Layout C: Left-Right Split
function WhyExpLayoutC() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#ffd700] text-center mb-2">Layout C: Left-Right Split</h3>
      <p className="text-xs text-[#6a6860] text-center mb-4">Info on left, CTAs on right in single card</p>

      <div className="p-6 rounded-2xl grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 items-center" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,215,0,0.15)' }}>
        {/* Left: All bullet points */}
        <div className="space-y-2">
          {[...whyExpData.overview, whyExpData.commission, whyExpData.revshare].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#ffd700]">•</span>
              <span className="text-sm text-[#bfbdb0]">{item}</span>
            </div>
          ))}
        </div>

        {/* Right: Stacked buttons */}
        <div className="flex flex-col gap-3">
          <a href="/exp-commission-calculator/" className="px-5 py-3 rounded-xl text-center text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))', border: '1px solid rgba(255,215,0,0.3)' }}>
            Commission Calculator
          </a>
          <a href="/exp-realty-revenue-share-calculator/" className="px-5 py-3 rounded-xl text-center text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.3)' }}>
            RevShare Visualizer
          </a>
        </div>
      </div>
    </div>
  );
}

// Layout D: Feature Cards Grid
function WhyExpLayoutD() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#ffd700] text-center mb-2">Layout D: Feature Cards</h3>
      <p className="text-xs text-[#6a6860] text-center mb-4">Each point gets its own mini card in a grid</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {whyExpData.overview.map((item, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,215,0,0.1)' }}>
            <span className="text-xs text-[#bfbdb0]">{item}</span>
          </div>
        ))}

        {/* Commission card with button */}
        <div className="p-4 rounded-xl text-center col-span-1" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <span className="text-xs text-[#bfbdb0] block mb-2">{whyExpData.commission}</span>
          <a href="/exp-commission-calculator/" className="text-xs font-medium text-[#ffd700] hover:underline">
            Calculator →
          </a>
        </div>

        {/* RevShare card with button */}
        <div className="p-4 rounded-xl text-center col-span-1 md:col-span-2" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="text-xs text-[#bfbdb0] block mb-2">{whyExpData.revshare}</span>
          <a href="/exp-realty-revenue-share-calculator/" className="text-xs font-medium text-[#10b981] hover:underline">
            Visualizer →
          </a>
        </div>
      </div>
    </div>
  );
}

// Layout E: Minimal with Text Links
function WhyExpLayoutE() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#ffd700] text-center mb-2">Layout E: Minimal Text</h3>
      <p className="text-xs text-[#6a6860] text-center mb-4">Clean text layout with subtle inline links</p>

      <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,215,0,0.15)' }}>
        <p className="text-[#bfbdb0] leading-relaxed mb-4">
          {whyExpData.overview.join(' ')}
        </p>
        <p className="text-[#bfbdb0] leading-relaxed">
          <a href="/exp-commission-calculator/" className="text-[#ffd700] hover:underline">{whyExpData.commission.replace('. Flat monthly fee.', '')}</a>
          {' '}with flat monthly fee.{' '}
          <a href="/exp-realty-revenue-share-calculator/" className="text-[#10b981] hover:underline">Stock awards + revenue share</a>
          {' '}available.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CalculatorRedesignsPage() {
  const [transactions, setTransactions] = useState(12);
  const [avgCommission, setAvgCommission] = useState(10000);

  return (
    <main className="min-h-screen py-16 px-4" style={{ background: '#0f0f0f' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <H1>CALCULATOR TEST</H1>
          <p className="text-[#9a9890] mt-4">
            Commission calculator with dashboard layout
          </p>
        </div>

        {/* Single calculator display */}
        <Design5F
          transactions={transactions}
          setTransactions={setTransactions}
          avgCommission={avgCommission}
          setAvgCommission={setAvgCommission}
        />
      </div>

      {/* Why eXp Section Alternatives */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#ffd700] mb-2">WHY EXP SECTION ALTERNATIVES</h2>
          <p className="text-[#9a9890]">5 different layout options for the &quot;Why eXp Realty?&quot; section</p>
        </div>

        <div className="space-y-16">
          <WhyExpLayoutA />
          <WhyExpLayoutB />
          <WhyExpLayoutC />
          <WhyExpLayoutD />
          <WhyExpLayoutE />
        </div>
      </div>
    </main>
  );
}
