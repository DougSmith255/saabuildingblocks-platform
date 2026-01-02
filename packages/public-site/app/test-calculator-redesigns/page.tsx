'use client';

import { useEffect, useState, useRef } from 'react';
import { H1, H2 } from '@saa/shared/components/saa';

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

// Shared animation keyframes
const pulseKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px var(--glow-color); }
  50% { box-shadow: 0 0 20px var(--glow-color), 0 0 30px var(--glow-color); }
}
@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes countUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.6; }
}
@keyframes barFill {
  from { width: 0; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Shared Disclaimer Dropdown Component
function DisclaimerDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-left text-sm text-[#9a9890] hover:text-[#bfbdb0] transition-colors"
        style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}
      >
        <span>Important Disclaimer</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-xs text-[#9a9890] space-y-2" style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}>
          <p className="text-[#bfbdb0]">This calculator shows real estate agents their net commission at eXp Realty. It factors in:</p>
          <ul className="space-y-1 ml-4">
            <li><span className="text-[#ffd700]">20% to eXp</span> (capped at $16k annually)</li>
            <li><span className="text-[#ffd700]">$25/deal</span> broker review</li>
            <li><span className="text-[#ffd700]">$60/deal</span> E&O Insurance (capped at $750)</li>
            <li><span className="text-[#ffd700]">$250/deal</span> Post-cap (After 100% commission)</li>
            <li><span className="text-[#ffd700]">$75/deal</span> after 20 more transactions Post-cap</li>
          </ul>
          <p className="italic text-[#6a6860]">Calculator does not include additional stock awards, ICON rewards, or revenue share income.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DESIGN 1: Radial Ring Visualizer (like RevShare)
// ============================================================================
function Design1({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);
  const capProgress = Math.min((results.expSplit / 16000) * 100, 100);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 1: Radial Ring</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Concentric rings show cap progress</p>

        {/* Radial visualization */}
        <div className="relative mx-auto mb-8" style={{ width: '280px', height: '280px' }}>
          {/* Background rings */}
          {[100, 85, 70, 55, 40].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: `2px solid rgba(255,215,0,${0.1 + i * 0.05})`,
                animation: results.isCapped ? 'ringPulse 2s ease-in-out infinite' : 'none',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          {/* Progress arc */}
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="rgba(255,215,0,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#ffd700"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${capProgress * 2.83} 283`}
              transform="rotate(-90 50 50)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' }}
            />
          </svg>
          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#ffd700]">${(results.netCommission / 1000).toFixed(0)}k</span>
            <span className="text-xs text-[#9a9890]">Net Commission</span>
            {results.isCapped && <span className="text-xs text-[#10b981] mt-1">CAPPED!</span>}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
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
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">To eXp</p>
            <p className="text-[#ffd700] font-bold">${results.expSplit.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">Total Fees</p>
            <p className="text-[#ffd700] font-bold">${results.totalFees.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">Keep Rate</p>
            <p className="text-[#10b981] font-bold">{results.effectiveRate}%</p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 2: Stacked Bar Journey
// ============================================================================
function Design2({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const fees = [
    { label: 'eXp Split', value: results.expSplit, color: '#ffd700', max: 16000 },
    { label: 'Broker Review', value: results.brokerFee, color: '#ff9500', max: transactions * 25 },
    { label: 'E&O Insurance', value: results.eoFee, color: '#ff6b6b', max: 750 },
    { label: 'Post-Cap $250', value: results.postCap250, color: '#c084fc', max: 5000 },
    { label: 'Post-Cap $75', value: results.postCap75, color: '#60a5fa', max: 3000 },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 2: Stacked Bar Journey</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Watch fees stack as you grow</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Stacked bars */}
        <div className="space-y-3 mb-6">
          {fees.map((fee, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: fee.color }}>{fee.label}</span>
                <span className="text-white">${fee.value.toLocaleString()}</span>
              </div>
              <div className="h-6 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((fee.value / fee.max) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${fee.color}cc, ${fee.color})`,
                    boxShadow: `0 0 10px ${fee.color}60`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <p className="text-xs text-[#ffd700] mb-1">Total Fees</p>
            <p className="text-2xl font-bold text-[#ffd700]">${results.totalFees.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-xs text-[#10b981] mb-1">You Keep</p>
            <p className="text-2xl font-bold text-[#10b981]">${results.netCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 3: Speedometer Gauge
// ============================================================================
function Design3({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);
  const keepRate = parseFloat(results.effectiveRate);
  const gaugeAngle = (keepRate / 100) * 180 - 90;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 3: Speedometer</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Your commission retention rate</p>

        {/* Gauge */}
        <div className="relative mx-auto mb-6" style={{ width: '240px', height: '140px' }}>
          <svg viewBox="0 0 200 110" className="w-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            <path d="M 20 100 A 80 80 0 0 1 60 35" fill="none" stroke="#ff6b6b" strokeWidth="12" strokeLinecap="round" />
            <path d="M 60 35 A 80 80 0 0 1 140 35" fill="none" stroke="#ffd700" strokeWidth="12" />
            <path d="M 140 35 A 80 80 0 0 1 180 100" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Needle */}
            <g transform={`rotate(${gaugeAngle} 100 100)`}>
              <line x1="100" y1="100" x2="100" y2="30" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="8" fill="#ffd700" />
            </g>
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className="text-3xl font-bold text-[#ffd700]">{results.effectiveRate}%</span>
            <p className="text-xs text-[#9a9890]">Keep Rate</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Average Commission: ${avgCommission.toLocaleString()}</label>
            <input
              type="range"
              min={5000}
              max={30000}
              step={500}
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
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
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">Gross</p>
            <p className="text-white font-bold">${(results.totalCommission / 1000).toFixed(0)}k</p>
          </div>
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">Fees</p>
            <p className="text-[#ffd700] font-bold">${(results.totalFees / 1000).toFixed(1)}k</p>
          </div>
          <div className="p-2 rounded bg-black/30">
            <p className="text-[#9a9890]">Net</p>
            <p className="text-[#10b981] font-bold">${(results.netCommission / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 4: Timeline/Journey Style
// ============================================================================
function Design4({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const milestones = [
    { deal: 1, label: 'First Deal', fee: '20% + $85', active: transactions >= 1 },
    { deal: Math.ceil(16000 / (avgCommission * 0.2)) || 8, label: 'Cap Reached', fee: '$16k paid', active: results.isCapped },
    { deal: (Math.ceil(16000 / (avgCommission * 0.2)) || 8) + 1, label: '100% Commission', fee: '+$250/deal', active: results.dealsAfterCap > 0 },
    { deal: (Math.ceil(16000 / (avgCommission * 0.2)) || 8) + 21, label: 'Reduced Fee', fee: '+$75/deal', active: results.postCap75 > 0 },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 4: Journey Timeline</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Your path to 100% commission</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission ($)</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#ffd700]/20" />
          {milestones.map((m, i) => (
            <div key={i} className="relative pl-10 pb-4">
              <div
                className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  m.active ? 'bg-[#ffd700] text-black' : 'bg-[#2a2a2a] text-[#9a9890] border border-[#ffd700]/30'
                }`}
                style={m.active ? { boxShadow: '0 0 10px rgba(255,215,0,0.5)' } : {}}
              >
                {m.active ? '✓' : i + 1}
              </div>
              <div className={`transition-opacity ${m.active ? 'opacity-100' : 'opacity-40'}`}>
                <p className="text-sm text-white font-medium">{m.label}</p>
                <p className="text-xs text-[#9a9890]">Deal #{m.deal} • {m.fee}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <p className="text-xs text-[#ffd700] mb-1">Total Fees</p>
            <p className="text-2xl font-bold text-[#ffd700]">${results.totalFees.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-xs text-[#10b981] mb-1">You Keep</p>
            <p className="text-2xl font-bold text-[#10b981]">${results.netCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 5: Donut Chart Breakdown
// ============================================================================
function Design5({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
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
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 5: Donut Breakdown</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">See where every dollar goes</p>

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
                  style={{ filter: i === 0 ? 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' : 'none' }}
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="rgba(10,10,10,0.95)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#10b981]">{results.effectiveRate}%</span>
            <span className="text-xs text-[#9a9890]">Keep</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
              <span className="text-[#9a9890]">{seg.label}:</span>
              <span className="text-white">${seg.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 6: Animated Counter Cards
// ============================================================================
function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const diff = value - start;
    const duration = 500;
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
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}</span>;
}

function Design6({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 6: Animated Counters</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Watch numbers update in real-time</p>

        {/* Inputs inline */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs text-[#ffd700] mb-1">Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
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

        {/* Big animated numbers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-6 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}>
            <p className="text-xs text-[#ffd700] mb-2 uppercase tracking-wider">Gross Commission</p>
            <p className="text-3xl font-bold text-[#ffd700] font-mono">
              <AnimatedNumber value={results.totalCommission} />
            </p>
          </div>
          <div className="p-6 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-xs text-[#10b981] mb-2 uppercase tracking-wider">Net Commission</p>
            <p className="text-3xl font-bold text-[#10b981] font-mono">
              <AnimatedNumber value={results.netCommission} />
            </p>
          </div>
        </div>

        {/* Smaller fee cards */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { label: 'eXp', value: results.expSplit },
            { label: 'Broker', value: results.brokerFee },
            { label: 'E&O', value: results.eoFee },
            { label: '$250', value: results.postCap250 },
            { label: '$75', value: results.postCap75 },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded bg-black/30 text-xs">
              <p className="text-[#9a9890] mb-1">{item.label}</p>
              <p className="text-[#ffd700] font-mono"><AnimatedNumber value={item.value} /></p>
            </div>
          ))}
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 7: Waterfall Chart
// ============================================================================
function Design7({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  const steps = [
    { label: 'Gross', value: results.totalCommission, total: results.totalCommission, color: '#ffd700', isStart: true },
    { label: 'eXp Split', value: -results.expSplit, total: results.totalCommission - results.expSplit, color: '#ff6b6b' },
    { label: 'Broker', value: -results.brokerFee, total: results.totalCommission - results.expSplit - results.brokerFee, color: '#ff9500' },
    { label: 'E&O', value: -results.eoFee, total: results.totalCommission - results.expSplit - results.brokerFee - results.eoFee, color: '#c084fc' },
    { label: 'Post-Cap', value: -(results.postCap250 + results.postCap75), total: results.netCommission, color: '#60a5fa' },
    { label: 'Net', value: results.netCommission, total: results.netCommission, color: '#10b981', isEnd: true },
  ];

  const maxValue = results.totalCommission;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 7: Waterfall</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">See deductions flow down to net</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Waterfall chart */}
        <div className="flex items-end justify-between gap-1 h-40 mb-4">
          {steps.map((step, i) => {
            const height = (Math.abs(step.isStart || step.isEnd ? step.total : step.value) / maxValue) * 100;
            const bottom = step.isStart || step.isEnd ? 0 : ((step.total - Math.abs(step.value)) / maxValue) * 100;

            return (
              <div key={i} className="flex-1 relative h-full">
                <div
                  className="absolute w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    bottom: step.isStart || step.isEnd ? 0 : `${bottom}%`,
                    background: step.color,
                    opacity: step.value === 0 ? 0.2 : 1,
                  }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#9a9890] whitespace-nowrap">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-6" />

        {/* Result summary */}
        <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <span className="text-sm text-[#10b981]">You Keep</span>
          <span className="text-2xl font-bold text-[#10b981]">${results.netCommission.toLocaleString()} ({results.effectiveRate}%)</span>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 8: Card Stack / Accordion
// ============================================================================
function Design8({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);
  const [expandedFee, setExpandedFee] = useState<number | null>(null);

  const fees = [
    { label: 'eXp Commission Split', value: results.expSplit, detail: '20% of each deal, capped at $16,000/year', icon: '💼' },
    { label: 'Broker Review Fee', value: results.brokerFee, detail: '$25 per transaction for compliance review', icon: '📋' },
    { label: 'E&O Insurance', value: results.eoFee, detail: '$60 per deal, capped at $750/year', icon: '🛡️' },
    { label: 'Post-Cap Fee ($250)', value: results.postCap250, detail: 'First 20 deals after hitting cap', icon: '🎯' },
    { label: 'Post-Cap Fee ($75)', value: results.postCap75, detail: 'After 20 post-cap transactions', icon: '🚀' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 8: Accordion Cards</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Tap each fee for details</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Accordion fees */}
        <div className="space-y-2 mb-6">
          {fees.map((fee, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.1)' }}
              onClick={() => setExpandedFee(expandedFee === i ? null : i)}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span>{fee.icon}</span>
                  <span className="text-sm text-white">{fee.label}</span>
                </div>
                <span className="text-[#ffd700] font-bold">${fee.value.toLocaleString()}</span>
              </div>
              {expandedFee === i && (
                <div className="px-3 pb-3 text-xs text-[#9a9890]" style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}>
                  {fee.detail}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <p className="text-xs text-[#ffd700] mb-1">Total Fees</p>
            <p className="text-2xl font-bold text-[#ffd700]">${results.totalFees.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <p className="text-xs text-[#10b981] mb-1">You Keep</p>
            <p className="text-2xl font-bold text-[#10b981]">${results.netCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 9: Horizontal Bar Race
// ============================================================================
function Design9({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 9: Bar Race</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Your take vs total fees</p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Avg Commission</label>
            <input
              type="number"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-black/50 border border-[#ffd700]/30 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ffd700] mb-1">Deals: {transactions}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Racing bars */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#10b981]">You Keep</span>
              <span className="text-[#10b981] font-bold">${results.netCommission.toLocaleString()}</span>
            </div>
            <div className="h-10 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                style={{
                  width: `${(results.netCommission / results.totalCommission) * 100}%`,
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  boxShadow: '0 0 15px rgba(16,185,129,0.5)',
                }}
              >
                <span className="text-xs font-bold text-white">{results.effectiveRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#ffd700]">Total Fees</span>
              <span className="text-[#ffd700] font-bold">${results.totalFees.toLocaleString()}</span>
            </div>
            <div className="h-10 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                style={{
                  width: `${(results.totalFees / results.totalCommission) * 100}%`,
                  background: 'linear-gradient(90deg, #ffd700, #ffed4a)',
                  boxShadow: '0 0 15px rgba(255,215,0,0.5)',
                }}
              >
                <span className="text-xs font-bold text-black">{(100 - parseFloat(results.effectiveRate)).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gross total reference */}
        <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-[#9a9890] mb-1">Gross Commission</p>
          <p className="text-xl font-bold text-white">${results.totalCommission.toLocaleString()}</p>
        </div>
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// DESIGN 10: Minimal Dashboard
// ============================================================================
function Design10({ transactions, setTransactions, avgCommission, setAvgCommission }: DesignProps) {
  const results = useCalculator(transactions, avgCommission);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <style>{pulseKeyframes}</style>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#ffd700] mb-2 text-center">Design 10: Minimal Dashboard</h3>
        <p className="text-xs text-[#9a9890] text-center mb-6">Clean, focused on what matters</p>

        {/* Large centered net commission */}
        <div className="text-center mb-8">
          <p className="text-sm text-[#9a9890] mb-2">Your Net Commission</p>
          <p className="text-5xl font-bold text-[#10b981] mb-1" style={{ textShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
            ${results.netCommission.toLocaleString()}
          </p>
          <p className="text-sm text-[#9a9890]">
            <span className="text-[#10b981]">{results.effectiveRate}%</span> of ${results.totalCommission.toLocaleString()} gross
          </p>
        </div>

        {/* Slider controls */}
        <div className="space-y-6 mb-8 px-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#9a9890]">Average Commission</span>
              <span className="text-[#ffd700] font-mono">${avgCommission.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={30000}
              step={500}
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#9a9890]">Transactions</span>
              <span className="text-[#ffd700] font-mono">{transactions}</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full accent-[#ffd700]"
            />
          </div>
        </div>

        {/* Minimal fee breakdown */}
        <div className="flex justify-between text-xs text-[#9a9890] px-4 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span>eXp: ${results.expSplit.toLocaleString()}</span>
          <span>Broker: ${results.brokerFee.toLocaleString()}</span>
          <span>E&O: ${results.eoFee.toLocaleString()}</span>
          <span>Post-Cap: ${(results.postCap250 + results.postCap75).toLocaleString()}</span>
        </div>

        {/* Cap status */}
        {results.isCapped && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              You've hit your cap! Earning 100% commission.
            </span>
          </div>
        )}
      </div>
      <DisclaimerDropdown />
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
interface DesignProps {
  transactions: number;
  setTransactions: (n: number) => void;
  avgCommission: number;
  setAvgCommission: (n: number) => void;
}

export default function CalculatorRedesignsPage() {
  const [transactions, setTransactions] = useState(12);
  const [avgCommission, setAvgCommission] = useState(10000);

  const designs = [
    { Component: Design1, name: 'Radial Ring Visualizer' },
    { Component: Design2, name: 'Stacked Bar Journey' },
    { Component: Design3, name: 'Speedometer Gauge' },
    { Component: Design4, name: 'Timeline Journey' },
    { Component: Design5, name: 'Donut Chart Breakdown' },
    { Component: Design6, name: 'Animated Counters' },
    { Component: Design7, name: 'Waterfall Chart' },
    { Component: Design8, name: 'Accordion Cards' },
    { Component: Design9, name: 'Bar Race' },
    { Component: Design10, name: 'Minimal Dashboard' },
  ];

  return (
    <main className="min-h-screen py-16 px-4" style={{ background: '#0f0f0f' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <H1>CALCULATOR REDESIGNS</H1>
          <p className="text-[#9a9890] mt-4 max-w-2xl mx-auto">
            10 different approaches to the eXp Commission & Fees Calculator.
            All preserve the exact formula. Each features the disclaimer dropdown and info modal pattern.
          </p>
          <p className="text-[#ffd700] mt-2 text-sm">
            Global Controls: {transactions} deals × ${avgCommission.toLocaleString()} avg = ${(transactions * avgCommission).toLocaleString()} gross
          </p>
        </div>

        {/* Global controls */}
        <div className="max-w-md mx-auto mb-12 p-6 rounded-xl" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <p className="text-sm text-[#ffd700] mb-4 text-center">Adjust these to update all designs simultaneously</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#9a9890] mb-1">Average Commission: ${avgCommission.toLocaleString()}</label>
              <input
                type="range"
                min={5000}
                max={30000}
                step={500}
                value={avgCommission}
                onChange={(e) => setAvgCommission(Number(e.target.value))}
                className="w-full accent-[#ffd700]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#9a9890] mb-1">Transactions: {transactions}</label>
              <input
                type="range"
                min={1}
                max={50}
                value={transactions}
                onChange={(e) => setTransactions(Number(e.target.value))}
                className="w-full accent-[#ffd700]"
              />
            </div>
          </div>
        </div>

        {/* Design grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {designs.map(({ Component, name }, i) => (
            <div key={i}>
              <Component
                transactions={transactions}
                setTransactions={setTransactions}
                avgCommission={avgCommission}
                setAvgCommission={setAvgCommission}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
