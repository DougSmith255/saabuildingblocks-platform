'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';

const LaserGridEffect = dynamic(
  () => import('@/components/shared/hero-effects/LaserGridEffect').then(mod => ({ default: mod.LaserGridEffect })),
  { ssr: false }
);

/**
 * eXp Realty Revenue Share Calculator
 * Interactive calculator for projecting revenue share earnings
 */
export default function RevenueShareCalculator() {
  const [avgEarnings, setAvgEarnings] = useState(80000);
  const [tiers, setTiers] = useState([0, 0, 0, 0, 0, 0, 0]);

  // Tier configuration: rate, cap
  const tierConfig = [
    { tier: 1, rate: 0.035, cap: 1400, label: "Tier 1 (Direct)", bonusEligible: true },
    { tier: 2, rate: 0.04, cap: 1600, label: "Tier 2", bonusEligible: true },
    { tier: 3, rate: 0.025, cap: 1000, label: "Tier 3", bonusEligible: true },
    { tier: 4, rate: 0.01, cap: 400, label: "Tier 4", bonusEligible: false },
    { tier: 5, rate: 0.005, cap: 200, label: "Tier 5", bonusEligible: false },
    { tier: 6, rate: 0.0025, cap: 100, label: "Tier 6", bonusEligible: false },
    { tier: 7, rate: 0.001, cap: 50, label: "Tier 7", bonusEligible: false }
  ];

  const calculateRevShare = () => {
    let yearlyTotal = 0;
    let yearlyWithBonus = 0;
    const bonusMultiplier = 1.30; // ~30% adjustment bonus for Tiers 1-3

    tierConfig.forEach((config, index) => {
      const agentsInTier = tiers[index];
      const rawEarning = avgEarnings * config.rate;
      const cappedEarning = Math.min(rawEarning, config.cap);
      const tierTotal = cappedEarning * agentsInTier;

      yearlyTotal += tierTotal;

      if (config.bonusEligible) {
        yearlyWithBonus += tierTotal * bonusMultiplier;
      } else {
        yearlyWithBonus += tierTotal;
      }
    });

    return {
      monthly: yearlyTotal / 12,
      yearly: yearlyTotal,
      withBonus: yearlyWithBonus
    };
  };

  const results = calculateRevShare();

  const updateTier = (index: number, value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = Math.max(0, Math.min(100, value));
    setTiers(newTiers);
  };

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <LaserGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>PASSIVE INCOME POTENTIAL</H1>
            <Tagline className="mt-4">
              What 7 tiers could mean for you
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Calculator Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          {/* Average Earnings Input */}
          <div className="mb-12">
            <label className="block text-[#e5e4dd] font-medium mb-4">
              Average Agent Earnings Per Year
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={avgEarnings}
                onChange={(e) => setAvgEarnings(Number(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
              />
              <div className="bg-white/10 rounded-lg px-4 py-2 min-w-[120px] text-center">
                <span className="text-[#ffd700] font-bold">${avgEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tier Inputs */}
          <div className="space-y-6 mb-12">
            <div className="text-center mb-12">
              <H2>Agents by Tier</H2>
            </div>

            {tierConfig.map((config, index) => (
              <GenericCard key={index} padding="sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:w-1/3">
                    <p className="text-[#e5e4dd] font-medium">{config.label}</p>
                    <p className="text-caption" style={{ opacity: 0.6 }}>
                      {(config.rate * 100).toFixed(1)}% rate, ${config.cap} cap
                      {config.bonusEligible && <span className="text-[#ffd700]"> +bonus</span>}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={tiers[index]}
                      onChange={(e) => updateTier(index, Number(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tiers[index]}
                      onChange={(e) => updateTier(index, Number(e.target.value))}
                      className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#e5e4dd] text-center"
                    />
                  </div>
                </div>
              </GenericCard>
            ))}
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-6">
            <GenericCard padding="md" centered>
              <p className="text-body mb-2" style={{ opacity: 0.8 }}>Monthly Minimum</p>
              <p className="text-h3 text-[#e5e4dd]">
                ${results.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </GenericCard>

            <GenericCard padding="md" centered>
              <p className="text-body mb-2" style={{ opacity: 0.8 }}>Yearly Minimum</p>
              <p className="text-h3 text-[#e5e4dd]">
                ${results.yearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </GenericCard>

            <GenericCard padding="md" centered>
              <p className="text-body mb-2" style={{ opacity: 0.8 }}>With ~30% Bonus*</p>
              <p className="text-h3 text-[#ffd700]">
                ${results.withBonus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </GenericCard>
          </div>

          <p className="text-caption text-center mt-6" style={{ opacity: 0.6 }}>
            *~30% adjustment bonus applies to Tiers 1-3 (varies, not guaranteed)
          </p>
        </div>
      </section>

      {/* How It Works */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The Mechanics</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                How eXp's revenue share creates passive income for agents who grow the company.
              </p>
            </div>

            <div className="space-y-6 text-body">
              <p>
                eXp Realty's revenue share program allows agents to earn passive income by growing the company.
                When you sponsor other agents, you earn a percentage of their gross commission income (GCI)
                through a 7-tier system.
              </p>

              <GenericCard padding="md">
                <h3 className="text-h5 mb-4">Tier Structure:</h3>
                <ul className="space-y-2">
                  <li><strong className="text-[#ffd700]">Tier 1:</strong> Direct recruits - 3.5% rate, $1,400 cap per agent</li>
                  <li><strong className="text-[#ffd700]">Tier 2:</strong> Their recruits - 4% rate, $1,600 cap</li>
                  <li><strong className="text-[#ffd700]">Tier 3:</strong> 2.5% rate, $1,000 cap</li>
                  <li><strong className="text-[#ffd700]">Tiers 4-7:</strong> Decreasing rates (0.1%-1%) with caps</li>
                </ul>
              </GenericCard>

              <p>
                Higher tiers unlock as you recruit qualifying agents at lower tiers.
                Revenue share income is paid monthly, typically on the 20th of each month.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Disclaimer */}
      <section className="relative py-8 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl p-6">
            <p className="text-caption text-center" style={{ color: '#ffd700' }}>
              <strong>Important:</strong> Figures are illustrative only and do not represent actual or guaranteed income.
              Results depend on many factors including agent production, retention, and eXp Realty policies.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Build Your Income Stream?</H2>
            <p className="text-body mt-4 mb-8">
              Join the Alliance and start building passive income that can outlast your career.
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

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffd700;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffd700;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </main>
  );
}
