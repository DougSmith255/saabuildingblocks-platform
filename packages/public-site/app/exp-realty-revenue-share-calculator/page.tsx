'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { H1, H2, Tagline, CTAButton } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { GreenLaserGridEffect } from '@/components/shared/hero-effects/GreenLaserGridEffect';

/**
 * Revenue Share Tier Configuration
 */
const TIER_CONFIG = {
  1: { rate: 0.035, cap: 1400, minFLQAs: 0, name: 'Front Line (Your FLAs)', desc: 'Agents you personally sponsor. Your direct recruits earn you the most per person.' },
  2: { rate: 0.04, cap: 1600, minFLQAs: 0, name: 'Second Line', desc: 'Agents sponsored by your Tier 1. Higher rate rewards team building.' },
  3: { rate: 0.025, cap: 1000, minFLQAs: 0, name: 'Third Line', desc: 'Agents 2 levels deep. Network effects start compounding.' },
  4: { rate: 0.015, cap: 600, minFLQAs: 5, name: 'Fourth Line', desc: 'Lower rate but larger potential volume.' },
  5: { rate: 0.01, cap: 400, minFLQAs: 10, name: 'Fifth Line', desc: 'Building momentum in your organization.' },
  6: { rate: 0.025, cap: 1000, minFLQAs: 15, name: 'Sixth Line', desc: 'Rate increases as organization grows.' },
  7: { rate: 0.05, cap: 2000, minFLQAs: 30, name: 'Seventh Line', desc: 'Highest rate and cap rewards true builders.' },
} as const;

const TIER_COLORS = [
  { primary: '#ffd700', secondary: '#ffed4a', glow: 'rgba(255,215,0,0.6)' },
  { primary: '#ff9500', secondary: '#ffb347', glow: 'rgba(255,149,0,0.6)' },
  { primary: '#ff6b6b', secondary: '#ff8e8e', glow: 'rgba(255,107,107,0.6)' },
  { primary: '#c084fc', secondary: '#d4a5ff', glow: 'rgba(192,132,252,0.6)' },
  { primary: '#60a5fa', secondary: '#93c5fd', glow: 'rgba(96,165,250,0.6)' },
  { primary: '#34d399', secondary: '#6ee7b7', glow: 'rgba(52,211,153,0.6)' },
  { primary: '#f472b6', secondary: '#f9a8d4', glow: 'rgba(244,114,182,0.6)' },
];

function calculateTierEarnings(tier: number, agentCount: number, avgGCI: number, frontLineAgents: number) {
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  const isLocked = frontLineAgents < config.minFLQAs;
  if (isLocked || agentCount === 0) return { earnings: 0, isLocked, perAgent: 0 };
  const perAgent = Math.min(avgGCI * config.rate, config.cap);
  return { earnings: perAgent * agentCount, isLocked, perAgent };
}

const ADJUSTMENT_BONUS_RATE = 0.30;

function calculateTotalRevShare(tierCounts: number[], avgGCI: number) {
  const frontLineAgents = tierCounts[0] || 0;
  const tiers = tierCounts.map((count, index) => {
    const tier = index + 1;
    const result = calculateTierEarnings(tier, count, avgGCI, frontLineAgents);
    return { tier, agents: count, ...result };
  });
  const subtotal = tiers.reduce((sum, t) => sum + t.earnings, 0);
  const tier1to3Earnings = tiers.slice(0, 3).reduce((sum, t) => sum + t.earnings, 0);
  const adjustmentBonus = tier1to3Earnings * ADJUSTMENT_BONUS_RATE;
  return { tiers, subtotal, adjustmentBonus, total: subtotal + adjustmentBonus };
}

const pulseKeyframes = `
@keyframes dataStream {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}
@keyframes ripple {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
@keyframes ringPulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  25% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.02); }
  75% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.01); }
}
@keyframes barGlow {
  0% { box-shadow: 0 0 4px var(--glow-color), 0 0 8px var(--glow-color); }
  30% { box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color), 0 0 35px var(--glow-color); }
  70% { box-shadow: 0 0 8px var(--glow-color), 0 0 15px var(--glow-color); }
  100% { box-shadow: 0 0 4px var(--glow-color), 0 0 8px var(--glow-color); }
}
`;

function ScrambleNumber({ value, prefix = '', suffix = '' }: {
  value: string;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;
    prevValueRef.current = value;

    const chars = '0123456789';
    let iterations = 0;
    const maxIterations = 8;

    const interval = setInterval(() => {
      iterations++;

      if (iterations >= maxIterations) {
        setDisplayValue(value);
        clearInterval(interval);
        return;
      }

      const scrambled = value.split('').map((char, i) => {
        if (char === '.' || char === ',' || char === 'k' || char === 'M') return char;
        if (i < (iterations / maxIterations) * value.length) return value[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      setDisplayValue(scrambled);
    }, 40);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-block', minWidth: `${value.length + prefix.length + suffix.length}ch`, textAlign: 'center' }}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

function Tooltip({ children, content, isVisible }: { children: React.ReactNode; content: React.ReactNode; isVisible: boolean }) {
  return (
    <div className="relative">
      {children}
      {/* Desktop: positioned tooltip above the bar */}
      <div
        className="hidden sm:block absolute z-50 pointer-events-none transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(-8px) scale(1)' : 'translateY(0) scale(0.95)',
          bottom: '100%',
          left: '50%',
          marginLeft: '-140px',
          width: '280px',
          marginBottom: '8px',
        }}
      >
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(30,30,30,0.95) 100%)',
            border: '1px solid rgba(255,215,0,0.3)',
            boxShadow: '0 0 30px rgba(255,215,0,0.2), 0 10px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {content}
          <div
            className="absolute"
            style={{
              bottom: '-6px',
              left: '50%',
              marginLeft: '-6px',
              width: '12px',
              height: '12px',
              background: 'rgba(30,30,30,0.95)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>
      {/* Mobile: fixed centered tooltip */}
      <div
        className="sm:hidden fixed z-50 pointer-events-none transition-all duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          top: '35%',
          left: '50%',
          marginLeft: '-140px',
          width: '280px',
        }}
      >
        <div
          className="p-4 rounded-xl text-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(30,30,30,0.95) 100%)',
            border: '1px solid rgba(255,215,0,0.3)',
            boxShadow: '0 0 30px rgba(255,215,0,0.2), 0 10px 40px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

const scenarios = [
  // Starter: 5 T1 agents, early growth (~1.85x multiplier, some haven't recruited yet)
  { name: 'Starter', desc: 'First recruits, building foundation', tierCounts: [5, 7, 10, 0, 0, 0, 0], avgGCI: 80000 },
  // Growing: 10 T1 agents, ~1.85x growth per tier, tiers 4-5 starting to unlock
  { name: 'Growing', desc: 'Team taking shape, tiers unlocking', tierCounts: [10, 18, 34, 63, 58, 0, 0], avgGCI: 90000 },
  // Established: 20 T1 agents, exponential growth visible, all tiers unlocking
  { name: 'Established', desc: 'Compounding kicks in across all tiers', tierCounts: [20, 37, 68, 126, 234, 216, 0], avgGCI: 100000 },
  // Momentum: 30 T1 agents, strong exponential - lower tiers much larger
  { name: 'Momentum', desc: 'Self-sustaining growth, network effect', tierCounts: [30, 56, 103, 190, 351, 650, 600], avgGCI: 100000 },
  // Empire Builder: 40 T1 agents (max), full ~1.85x exponential - reaches $5M+
  { name: 'Empire Builder', desc: 'Legacy organization, deep network', tierCounts: [40, 74, 137, 253, 468, 866, 1700], avgGCI: 100000 },
];

function DisclaimerSection() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isMethodologyOpen;
    setIsMethodologyOpen(newState);
    // Notify parent window (if embedded in iframe) to scroll modal
    if (newState && window.parent !== window) {
      window.parent.postMessage({ type: 'scrollToBottom', modal: 'revshare' }, '*');
    }
  };

  return (
    <div
      className="relative -mt-[1px] disclaimer-section"
      style={{
        background: 'rgba(10,10,10,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255,215,0,0.2)',
        borderRight: '1px solid rgba(255,215,0,0.2)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
        borderRadius: '0 0 1rem 1rem',
      }}
    >
      {/* Always visible disclaimer */}
      <div
        className="px-4 sm:px-6 py-4 text-[#9a9890]"
        style={{ borderTop: '1px solid rgba(255,215,0,0.1)', fontSize: '14px' }}
      >
        <p>
          Applies only to residential agents in the U.S. and Canada. International varies. These figures are not a guarantee, representation or projection of earnings or profits you can or should expect. eXp Realty makes no guarantee of financial success.{' '}
          <a
            href="https://exprealty.com/income"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffd700] transition-all duration-300"
            style={{ textShadow: '0 0 8px rgba(255,215,0,0.4)' }}
            onMouseEnter={(e) => e.currentTarget.style.textShadow = '0 0 12px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.textShadow = '0 0 8px rgba(255,215,0,0.4)'}
          >
            See eXp's Average Income Chart
          </a>
        </p>
      </div>

      {/* Methodology dropdown */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3 text-left transition-all hover:bg-white/[0.02]"
        style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}
      >
        <span className="text-sm font-medium text-[#9a9890]">Methodology</span>
        <svg
          className={`w-5 h-5 text-[#9a9890] transition-transform duration-300 ${isMethodologyOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Methodology expandable content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${isMethodologyOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div
          className="px-4 sm:px-6 py-4 text-xs text-[#9a9890] space-y-3"
          style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}
        >
          {/* Assumptions */}
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Assumes 100% of agents are capping, contributing the full $16,000 in company dollar</li>
            <li>All Front Line Agents (FLAs) are assumed to qualify as Front Line Qualifying Agents (FLQAs)</li>
            <li>FLQA status requires 2+ closed transactions or $5,000+ GCI within a rolling 6-month period</li>
            <li>Approximately 20% adjustment bonus applied to Tier 1–3 earnings (actual bonus varies)</li>
            <li>Revenue share rates, caps, and bonus structures are subject to change by eXp Realty</li>
          </ul>

          {/* Tier Qualification Notes */}
          <div>
            <span className="text-[#bfbdb0]">Tier Qualification Notes:</span>
            <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
              <li>Tiers 4–7 require maintaining minimum FLQA counts</li>
              <li className="ml-4">Tier 4: 5 FLQAs</li>
              <li className="ml-4">Tier 5: 10 FLQAs</li>
              <li className="ml-4">Tier 6: 15 FLQAs</li>
              <li className="ml-4">Tier 7: 30 FLQAs</li>
              <li>If FLQA counts fall below the required threshold, those tiers lock until requalified</li>
            </ul>
          </div>

          {/* Full compliance statement */}
          <p className="text-[#6a6860] italic">
            The illustration does not include expenses incurred by agents in operating their businesses. Success with eXp Realty results only from successful sales efforts, which require hard work, diligence, skill, persistence, competence, and leadership. Your success will depend upon how well you exercise these qualities.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative max-w-sm w-full max-h-[80vh] overflow-y-auto rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,20,0.98) 0%, rgba(30,30,30,0.95) 100%)',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 0 40px rgba(255,215,0,0.15), 0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9a9890] hover:text-white transition-colors text-xl"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold text-[#ffd700] mb-4">Chart Key</h3>

        {/* Bar explanation */}
        <div className="mb-4">
          <div className="flex items-end gap-3">
            <div className="flex flex-col items-center">
              <div className="text-xs text-[#ffd700] font-semibold mb-1">$8K</div>
              <div className="w-8 h-10 rounded-t-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(180deg, #ffed4a 0%, #ffd700 100%)', color: '#2a2a2a' }}>6</div>
            </div>
            <div className="flex-1 text-xs text-[#9a9890] space-y-1">
              <p><span className="text-[#ffd700]">$8K</span> = yearly earnings</p>
              <p><span className="text-white">6</span> = agents in tier</p>
            </div>
          </div>
        </div>

        {/* Quick key */}
        <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="mb-2"><span className="text-[#ffd700]">T1</span> = Your direct recruits (FLAs)</p>
          <p className="mb-2"><span className="text-[#ff9500]">T2–T7</span> = Deeper network tiers</p>
          <p className="mb-2"><span className="text-white">FLA</span> = Front Line Agent</p>
          <p><span className="text-white">FLQA</span> = Qualifying FLA (2+ deals or $5K GCI in 6 mo)</p>
        </div>

        {/* Tier rates table */}
        <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="grid grid-cols-1 gap-1 text-[#9a9890]">
            <p><span className="text-[#ffd700]">T1:</span> 3.5%, $1,400 cap</p>
            <p><span className="text-[#ff9500]">T2:</span> 4.0%, $1,600 cap</p>
            <p><span className="text-[#ff6b6b]">T3:</span> 2.5%, $1,000 cap</p>
            <p><span className="text-[#c084fc]">T4:</span> 1.5%, $600 cap</p>
            <p><span className="text-[#60a5fa]">T5:</span> 1.0%, $400 cap</p>
            <p><span className="text-[#34d399]">T6:</span> 2.5%, $1,000 cap</p>
            <p><span className="text-[#f472b6]">T7:</span> 5.0%, $2,000 cap</p>
            <p className="mt-2 text-[#bfbdb0]">+ ~20% bonus on T1–T3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueShareVisualization({
  selectedScenario,
  setSelectedScenario,
  pulsingTier,
  onHoverChange,
  setIsAutoPlaying,
  setIsPaused,
  setPulsingTier,
  isEmbed = false,
}: {
  selectedScenario: number;
  setSelectedScenario: (i: number) => void;
  pulsingTier: number;
  onHoverChange: (hovering: boolean) => void;
  setIsAutoPlaying: (v: boolean) => void;
  setIsPaused: (v: boolean) => void;
  setPulsingTier: (v: number) => void;
  isEmbed?: boolean;
}) {
  const currentScenario = scenarios[selectedScenario];
  const adjustedResults = calculateTotalRevShare(currentScenario.tierCounts, currentScenario.avgGCI);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const results = adjustedResults;
  // Use max from current scenario so bars scale nicely within each view
  const maxEarnings = Math.max(...results.tiers.map(t => t.earnings), 1);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const handleTierHover = (tierIndex: number | null) => {
    setHoveredTier(tierIndex);
    onHoverChange(tierIndex !== null);
  };

  const handleScenarioClick = (index: number) => {
    setIsAutoPlaying(false);
    setSelectedScenario(index);
    setPulsingTier(-1);
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
      setPulsingTier(0);
    }, 500);
  };

  return (
    <div
      className={isEmbed ? 'overflow-hidden relative' : 'rounded-t-2xl overflow-hidden relative'}
      style={{
        background: isEmbed ? '#0a0a0a' : 'rgba(10,10,10,0.75)',
        backdropFilter: isEmbed ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isEmbed ? 'none' : 'blur(12px)',
        border: isEmbed ? 'none' : '1px solid rgba(255,215,0,0.2)',
        borderBottom: 'none',
      }}
    >
      <style>{pulseKeyframes}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center 50%, transparent 0%, rgba(10,10,10,0.2) 30%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.7) 100%)',
          zIndex: 1,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative" style={{ width: '600px', height: '600px' }}>
          {/* Central glow - pulses with each tier */}
          <div
            key={pulsingTier >= 0 ? `glow-pulse-${pulsingTier}` : 'glow-static'}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              width: '300px',
              height: '300px',
              background: `radial-gradient(circle, ${pulsingTier >= 0 ? TIER_COLORS[pulsingTier]?.primary || '#ffd700' : '#ffd700'}${pulsingTier >= 0 ? '15' : '06'} 0%, transparent 70%)`,
              animation: pulsingTier >= 0 ? 'ringPulse 1080ms ease-out forwards' : 'none',
              transition: 'background 0.3s ease-out',
            }}
          />
          {results.tiers.map((tier, i) => {
            const color = TIER_COLORS[i];
            const isPulsing = pulsingTier === i && !tier.isLocked;
            // When T7 (index 6) pulses during animation, all unlocked rings pulse together
            const allPulse = pulsingTier === 6 && !tier.isLocked && hoveredTier === null;
            const shouldPulse = isPulsing || allPulse;
            const isHovered = hoveredTier === i;
            const isActive = isHovered || shouldPulse;
            const size = 150 + i * 65;

            return (
              <div
                key={shouldPulse ? `ring-pulse-${i}-${pulsingTier}` : `ring-${i}`}
                className={`absolute top-1/2 left-1/2 rounded-full ${tier.isLocked ? 'opacity-10' : ''}`}
                style={{
                  width: size,
                  height: size,
                  transform: 'translate(-50%, -50%)',
                  border: `1.5px solid ${isActive ? color.primary + '60' : color.primary + '15'}`,
                  boxShadow: isActive ? `0 0 20px ${color.primary}40` : 'none',
                  animation: shouldPulse ? 'ringPulse 1080ms ease-out forwards' : 'none',
                  transition: isActive ? 'none' : 'border-color 0.3s, box-shadow 0.3s',
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        {/* Heading with H3 size range and tagline styling (glow, rotateX) */}
        <h2
          className="text-center mb-2"
          style={{
            fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
            fontSize: 'clamp(24px, calc(21.818px + 0.8727vw), 48px)',
            fontWeight: 600,
            color: '#bfbdb0',
            lineHeight: 1.1,
            transform: 'rotateX(15deg)',
            fontFeatureSettings: '"ss01" 1',
            textShadow: '0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8)',
            filter: 'drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6))',
          }}
        >
          eXp Revenue Share Potential
        </h2>
        <p className="text-center text-sm sm:text-body text-[#9a9890] mb-6 max-w-2xl mx-auto">
          $171M paid to eXp agents in 2024 through Revenue Share. A 7-tier system built to compound.
        </p>

        {/* Mobile: 2-col grid with Empire Builder spanning both | Desktop: Flex row */}
        <div className="grid grid-cols-2 gap-2 mb-2 sm:flex sm:flex-wrap sm:justify-center">
          {scenarios.map((scenario, i) => (
            <button
              key={i}
              onClick={() => handleScenarioClick(i)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm text-center ${
                i === 4 ? 'col-span-2' : ''
              } ${
                selectedScenario === i
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#ffed4a] text-black'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
              style={selectedScenario === i ? { boxShadow: '0 0 12px rgba(255,215,0,0.4), 0 2px 6px rgba(255,215,0,0.3)' } : {}}
            >
              {scenario.name}
            </button>
          ))}
        </div>

        {/* Fixed height container for description to prevent layout shift between tabs */}
        <div className="text-center mb-4 h-12 flex items-center justify-center">
          <p className="text-base text-[#9a9890]">
            {currentScenario.desc} <br className="sm:hidden" /><span className="whitespace-nowrap">{currentScenario.tierCounts.reduce((a, b) => a + b, 0).toLocaleString()} agents</span>
          </p>
        </div>

        {/* Bar chart container - fixed height to prevent layout shift between tabs */}
        <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 mb-0 pt-6 sm:pt-6 relative h-44 sm:h-52">
          {results.tiers.map((tier, i) => {
            const config = TIER_CONFIG[(i + 1) as keyof typeof TIER_CONFIG];
            const color = TIER_COLORS[i];
            const isHovered = hoveredTier === i;
            const isPulsing = pulsingTier === i && !tier.isLocked;
            // Calculate bar height in pixels - max 160px on desktop, scales down on mobile
            const maxBarPx = 160;
            const minBarPx = 16;
            const barHeightPx = Math.max((tier.earnings / maxEarnings) * maxBarPx, minBarPx);

            return (
              <Tooltip
                key={i}
                isVisible={isHovered}
                content={
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold" style={{ color: color.primary }}>{config.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background: tier.isLocked ? 'rgba(255,255,255,0.1)' : 'rgba(52,211,153,0.2)',
                          color: tier.isLocked ? '#9a9890' : '#34d399',
                        }}
                      >
                        {tier.isLocked ? `${config.minFLQAs} FLQAs to Unlock` : 'Unlocked'}
                      </span>
                    </div>
                    <p className="text-xs text-[#bfbdb0] mt-1">{config.desc}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div>Rate: {(config.rate * 100).toFixed(1)}% | Cap: ${config.cap}</div>
                      <div>{tier.agents.toLocaleString()} agents × ${tier.perAgent.toLocaleString()} = ${tier.earnings.toLocaleString()}</div>
                    </div>
                  </div>
                }
              >
                <div
                  className={`relative cursor-pointer ${tier.isLocked ? 'opacity-30' : ''}`}
                  style={{
                    width: 'clamp(36px, 10vw, 80px)',
                    height: `${barHeightPx}px`,
                    transformOrigin: 'bottom',
                    transition: 'height 0.5s ease-out',
                  }}
                  onMouseEnter={() => handleTierHover(i)}
                  onMouseLeave={() => handleTierHover(null)}
                  onClick={() => handleTierHover(hoveredTier === i ? null : i)}
                >
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    style={{
                      color: color.primary,
                      fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                      fontSize: 'clamp(10px, 2.5vw, 14px)',
                      fontWeight: 600,
                    }}
                  >
                    <ScrambleNumber
                      value={tier.earnings > 0 ? tier.earnings >= 1000000 ? (tier.earnings / 1000000).toFixed(1) + 'M' : (tier.earnings / 1000).toFixed(0) + 'k' : '0'}
                      prefix="$"
                    />
                  </div>

                  <div
                    key={isPulsing ? `pulse-${pulsingTier}` : 'static'}
                    className="absolute inset-0 rounded-t-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, ${color.secondary} 0%, ${color.primary} 100%)`,
                      boxShadow: isHovered ? `0 0 30px ${color.glow}` : `0 0 10px ${color.glow}`,
                      '--glow-color': color.glow,
                      animation: isPulsing ? 'barGlow 1080ms ease-out forwards' : 'none',
                    } as React.CSSProperties}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 10px)',
                        animation: isPulsing ? 'dataStream 1s linear infinite' : 'none',
                      }}
                    />
                  </div>

                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      color: '#2a2a2a',
                      fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                      fontSize: 'clamp(11px, 2.5vw, 16px)',
                      fontWeight: 600,
                    }}
                  >
                    <ScrambleNumber
                      value={tier.agents >= 1000 ? (tier.agents / 1000).toFixed(1) + 'k' : String(tier.agents)}
                    />
                  </div>

                  {isPulsing && (
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2 rounded-full"
                      style={{ background: color.primary, animation: 'ripple 0.8s ease-out' }}
                    />
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>

        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.5) 10%, rgba(255,215,0,0.7) 50%, rgba(255,215,0,0.5) 90%, transparent 100%)',
            boxShadow: '0 0 8px rgba(255,215,0,0.3)',
          }}
        />

        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 mt-2">
          {results.tiers.map((tier, i) => {
            const color = TIER_COLORS[i];
            return (
              <div
                key={i}
                style={{ width: 'clamp(36px, 10vw, 80px)' }}
                className="text-center cursor-pointer"
                onMouseEnter={() => handleTierHover(i)}
                onMouseLeave={() => handleTierHover(null)}
                onClick={() => handleTierHover(hoveredTier === i ? null : i)}
              >
                <div className="text-xs sm:text-sm font-bold" style={{ color: color.primary }}>T{tier.tier}</div>
              </div>
            );
          })}
        </div>

        {/* Info button and hint */}
        <div className="flex items-center justify-center gap-2 mt-1 mb-3">
          <p className="text-base text-[#9a9890]">Tap or hover tiers for details</p>
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
            style={{
              background: 'rgba(255,215,0,0.15)',
              border: '1px solid rgba(255,215,0,0.4)',
              color: '#ffd700',
            }}
            title="How to read this chart"
          >
            ?
          </button>
        </div>

        <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

        {/* Total earnings */}
        <div className="flex items-center justify-center py-3 px-4 rounded-xl" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
          {/* Total - centered */}
          <div className="text-center">
            <span
              className="text-[#ffd700]"
              style={{
                fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                fontSize: 'clamp(18px, 4vw, 36px)',
                fontWeight: 600,
              }}
            >
              <ScrambleNumber value={results.total.toLocaleString()} prefix="$" suffix="/yr" />
            </span>
            <div className="text-sm text-[#9a9890]">
              incl. 20% bonus on T1-3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * eXp Realty Revenue Share Calculator
 * Interactive visualization for projecting revenue share earnings
 * Supports ?embed=true for embedding in iframes (just the visualizer, no page chrome)
 */
function RevenueShareCalculatorContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [pulsingTier, setPulsingTier] = useState(-1);
  const [isPaused, setIsPaused] = useState(!isEmbed); // Start playing immediately in embed mode
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(isEmbed); // Already visible in embed mode
  const cardRef = useRef<HTMLDivElement>(null);

  // Start animation only when card is 50% visible
  useEffect(() => {
    if (isEmbed) return; // Skip observer in embed mode - already visible

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Start the animation after a brief delay once visible
          setTimeout(() => {
            setIsPaused(false);
            setPulsingTier(0);
          }, 500);
        }
      },
      { threshold: 0.5 } // 50% visibility
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, isEmbed]);

  // In embed mode, start animation immediately
  useEffect(() => {
    if (isEmbed && !isVisible) {
      setIsVisible(true);
      setTimeout(() => {
        setIsPaused(false);
        setPulsingTier(0);
      }, 300);
    }
  }, [isEmbed, isVisible]);

  useEffect(() => {
    if (isPaused || isHovering) return;

    const currentScenario = scenarios[selectedScenario];
    // Find the last tier that has agents (for balanced timing on smaller scenarios)
    const lastActiveTier = currentScenario.tierCounts.reduce((last, count, i) => count > 0 ? i : last, 0);

    const interval = setInterval(() => {
      setPulsingTier(prev => {
        const nextTier = prev + 1;

        // Switch scenarios after the last active tier pulses (not always after T7)
        if (nextTier > lastActiveTier) {
          if (isAutoPlaying) {
            // Brief pause at end of cycle, then switch button
            setIsPaused(true);
            setTimeout(() => {
              setSelectedScenario(s => (s + 1) % scenarios.length);
              // Longer pause before starting next cycle to balance dead time
              setTimeout(() => {
                setIsPaused(false);
                setPulsingTier(0);
              }, 600);
            }, 200);
          } else {
            // Manual tab click - stop after one playthrough
            setIsPaused(true);
          }
          return -1;
        }

        return nextTier;
      });
    }, 1080);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, isHovering, selectedScenario]);

  const sharedProps = {
    selectedScenario,
    setSelectedScenario,
    pulsingTier,
    onHoverChange: setIsHovering,
    setIsAutoPlaying,
    setIsPaused,
    setPulsingTier,
    isEmbed,
  };

  const embedRef = useRef<HTMLDivElement>(null);

  // Send height to parent window when in embed mode
  useEffect(() => {
    if (!isEmbed || !embedRef.current) return;

    const sendHeight = () => {
      if (embedRef.current && window.parent !== window) {
        const height = embedRef.current.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', modal: 'revshare', height }, '*');
      }
    };

    // Send initial height after a short delay to ensure content is rendered
    setTimeout(sendHeight, 100);

    // Observe size changes
    const observer = new ResizeObserver(sendHeight);
    observer.observe(embedRef.current);

    // Also send on any DOM changes (for dropdown open/close)
    const mutationObserver = new MutationObserver(sendHeight);
    mutationObserver.observe(embedRef.current, { childList: true, subtree: true, attributes: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [isEmbed]);

  // Embed mode: just the visualization component - solid background fills iframe
  if (isEmbed) {
    return (
      <>
        {/* Override all styles in embed mode for solid background */}
        <style>{`
          html, body {
            background: #0a0a0a !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: auto !important;
            overflow: hidden !important;
          }
          /* Hide star background canvas in embed mode */
          canvas {
            display: none !important;
          }
          /* Hide any other background elements */
          #star-background, [class*="star"], [class*="Star"] {
            display: none !important;
          }
          /* Ensure the Next.js wrapper also has background */
          #__next, [data-nextjs-scroll-focus-boundary] {
            background: #0a0a0a !important;
            height: auto !important;
            min-height: auto !important;
          }
          /* Remove inner border-radius and borders in embed mode - parent modal provides these */
          .rounded-t-2xl, .disclaimer-section {
            border-radius: 0 !important;
            border: none !important;
          }
          ${pulseKeyframes}
        `}</style>
        <div ref={embedRef} style={{ background: '#0a0a0a' }}>
          <RevenueShareVisualization {...sharedProps} />
          <DisclaimerSection />
        </div>
      </>
    );
  }

  // Full page mode
  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper fadeSpeed={1.5}>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <GreenLaserGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>7 TIERS OF OPPORTUNITY</H1>
            {/* Tagline with dark vignette behind for readability over green lasers */}
            <div className="relative mt-4">
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '150%',
                  height: '150px',
                  background: 'radial-gradient(ellipse 90% 80% at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                }}
              />
              <Tagline>
                How eXp's revenue share compounds into real wealth
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Revenue Share Visualization Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1100px] mx-auto" ref={cardRef}>
          <RevenueShareVisualization {...sharedProps} />

          {/* Disclaimer Dropdown */}
          <DisclaimerSection />
        </div>
      </section>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Build Your Income Stream?</H2>
            <p className="text-body mt-4 mb-8">
              Join Smart Agent Alliance and start building passive income that can outlast your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/about-exp-realty/">
                Learn About eXp
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}

export default function ExpRevenueShareCalculator() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a0a', minHeight: '100vh' }} />}>
      <RevenueShareCalculatorContent />
    </Suspense>
  );
}
