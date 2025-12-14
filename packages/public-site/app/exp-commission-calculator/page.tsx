'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { H1, Tagline, CyberCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects';

// Dynamic import for the data stream effect to prevent CLS
// The effect renders 440 animated elements - deferring prevents layout shifts during LCP
const CalculatorDataStreamEffect = dynamic(
  () => import('./CalculatorDataStreamEffect').then(mod => ({ default: mod.CalculatorDataStreamEffect })),
  { ssr: false }
);

/**
 * eXp Commission & Fees Calculator Page
 *
 * Dark theme with gold accents matching the site design.
 */
export default function ExpCommissionCalculator() {
  const [transactions, setTransactions] = useState(1);
  const [avgCommission, setAvgCommission] = useState(10000);
  const [results, setResults] = useState({
    expSplit: 0,
    brokerFee: 0,
    eoFee: 0,
    postCap250: 0,
    postCap75: 0,
    totalFees: 0,
    netCommission: 0,
  });

  // Calculate commission whenever inputs change
  useEffect(() => {
    const totalCommission = transactions * avgCommission;

    // Commission calculation
    const commissionPerDealToExp = 0.2 * avgCommission;
    const potentialExpCommission = transactions * commissionPerDealToExp;
    const expCommission = Math.min(potentialExpCommission, 16000);

    // Post-cap fees calculation
    const dealsAfterCap = Math.max((potentialExpCommission - 16000) / commissionPerDealToExp, 0);
    const postCapFirstTier = Math.min(dealsAfterCap, 20);
    const postCapSecondTier = Math.max(dealsAfterCap - 20, 0);
    const postCap250 = postCapFirstTier * 250;
    const postCap75 = postCapSecondTier * 75;

    // Other fees
    const eoFee = Math.min(transactions * 60, 750);
    const brokerFee = transactions * 25;

    // Total calculations
    const totalFees = expCommission + eoFee + brokerFee + postCap250 + postCap75;
    const netCommission = totalCommission - totalFees;

    setResults({
      expSplit: Math.round(expCommission),
      brokerFee: Math.round(brokerFee),
      eoFee: Math.round(eoFee),
      postCap250: Math.round(postCap250),
      postCap75: Math.round(postCap75),
      totalFees: Math.round(totalFees),
      netCommission: Math.round(netCommission),
    });
  }, [transactions, avgCommission]);

  const sliderProgress = ((transactions - 1) / 49) * 100;

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <CalculatorDataStreamEffect />
          <div className="relative z-10 max-w-[1900px] mx-auto w-full text-center">
            <H1>KNOW YOUR NUMBERS</H1>
            <Tagline className="mt-4">
              No hidden fees. Just facts.
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Calculator Section */}
      <section className="py-12 px-4">
        <div className="max-w-[700px] mx-auto">
          <CyberCard padding="lg" centered={false}>
            {/* Commission Input */}
            <div className="mb-8">
              <label
                htmlFor="avgCommission"
                className="block text-caption text-[#ffd700] uppercase tracking-wider mb-2"
              >
                Average Commission Per Deal ($)
              </label>
              <input
                type="number"
                id="avgCommission"
                value={avgCommission}
                onChange={(e) => setAvgCommission(parseFloat(e.target.value) || 0)}
                min={1}
                className="w-full px-4 py-3 bg-black/50 border border-[#ffd700]/30 rounded-lg text-[#e5e4dd] placeholder-[#e5e4dd]/40 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/50 transition-all text-lg font-mono"
              />
            </div>

            {/* Transaction Slider */}
            <div className="mb-8">
              <label className="block text-caption text-[#ffd700] uppercase tracking-wider mb-4">
                Number of Transactions
              </label>
              <div className="relative pt-8 pb-4">
                {/* Value bubble */}
                <div
                  className="absolute -top-0 px-3 py-1 bg-[#ffd700] text-[#191818] rounded font-bold text-sm transition-all"
                  style={{
                    left: `${sliderProgress}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {transactions}
                </div>

                {/* Custom slider */}
                <input
                  type="range"
                  id="transactions"
                  min={1}
                  max={50}
                  value={transactions}
                  onChange={(e) => setTransactions(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ffd700 0%, #ffd700 ${sliderProgress}%, rgba(255,215,0,0.2) ${sliderProgress}%, rgba(255,215,0,0.2) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-3 mb-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/30 border border-[#ffd700]/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-[#e5e4dd]/60 mb-1">To eXp (20%)</p>
                  <p className="text-lg font-bold text-[#ffd700] font-mono">
                    ${results.expSplit.toLocaleString()}
                  </p>
                </div>
                <div className="bg-black/30 border border-[#ffd700]/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-[#e5e4dd]/60 mb-1">$25/Deal Review</p>
                  <p className="text-lg font-bold text-[#ffd700] font-mono">
                    ${results.brokerFee.toLocaleString()}
                  </p>
                </div>
                <div className="bg-black/30 border border-[#ffd700]/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-[#e5e4dd]/60 mb-1">E&O Insurance</p>
                  <p className="text-lg font-bold text-[#ffd700] font-mono">
                    ${results.eoFee.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-[#ffd700]/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-[#e5e4dd]/60 mb-1">Post-Cap $250/deal</p>
                  <p className="text-lg font-bold text-[#ffd700] font-mono">
                    ${results.postCap250.toLocaleString()}
                  </p>
                </div>
                <div className="bg-black/30 border border-[#ffd700]/20 rounded-lg p-4 text-center">
                  <p className="text-xs text-[#e5e4dd]/60 mb-1">Post 20 Deals $75/deal</p>
                  <p className="text-lg font-bold text-[#ffd700] font-mono">
                    ${results.postCap75.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffd700]/10 border-2 border-[#ffd700]/40 rounded-lg p-6 text-center">
                <p className="text-sm text-[#ffd700]/80 uppercase tracking-wider mb-2">Total Fees</p>
                <p className="text-3xl font-bold text-[#ffd700] font-mono">
                  ${results.totalFees.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#10b981]/10 border-2 border-[#10b981]/40 rounded-lg p-6 text-center">
                <p className="text-sm text-[#10b981]/80 uppercase tracking-wider mb-2">Net Commission</p>
                <p className="text-3xl font-bold text-[#10b981] font-mono">
                  ${results.netCommission.toLocaleString()}
                </p>
              </div>
            </div>
          </CyberCard>

          {/* Info Box */}
          <LazySection height={350}>
            <CyberCard padding="md" centered={true} className="mt-8">
              <p className="text-[#e5e4dd]/80 mb-4">
                This calculator shows real estate agents their net commission at eXp Realty. It factors in:
              </p>
              <div className="space-y-2 text-sm text-[#e5e4dd]/70">
                <p><span className="text-[#ffd700] font-semibold">20% to eXp</span> (capped at $16k annually)</p>
                <p><span className="text-[#ffd700] font-semibold">$25/deal</span> broker review</p>
                <p><span className="text-[#ffd700] font-semibold">$60/deal</span> E&O Insurance (capped at $750)</p>
                <p><span className="text-[#ffd700] font-semibold">$250/deal</span> Post-cap (After 100% commission)</p>
                <p><span className="text-[#ffd700] font-semibold">$75/deal</span> after 20 more transactions Post-cap</p>
              </div>
              <p className="text-[#e5e4dd]/60 text-sm mt-4 italic">
                Calculator does not include additional stock awards, ICON rewards, or revenue share income.
              </p>
            </CyberCard>

            {/* CTA Section */}
            <h2 className="text-2xl font-bold text-[#ffd700] text-center mt-12 mb-6">
              Commission & Fees Fully Explained
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="/blog/about-exp/commission"
                className="px-6 py-3 bg-[#ffd700]/20 border-2 border-[#ffd700] rounded-lg text-[#ffd700] font-semibold text-center hover:bg-[#ffd700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
              >
                eXp Commission
              </a>
              <a
                href="/blog/about-exp/fees"
                className="px-6 py-3 bg-[#ffd700]/20 border-2 border-[#ffd700] rounded-lg text-[#ffd700] font-semibold text-center hover:bg-[#ffd700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
              >
                eXp Fees
              </a>
            </div>
          </LazySection>
        </div>
      </section>

      {/* Custom slider thumb styles and hide number input spinners */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #ffd700;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          transition: box-shadow 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #ffd700;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        input[type="range"]::-moz-range-thumb:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }
        /* Hide number input spinners */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </main>
  );
}
