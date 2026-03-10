'use client';

import dynamic from 'next/dynamic';
import '../styles/calculator.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';

const CommissionCalculator = dynamic(
  () => import('@saa/shared/components/saa/interactive').then(m => ({ default: m.CommissionCalculator })),
  { ssr: false }
);
import { GoldenRainEffect } from '@/components/shared/hero-effects/GoldenRainEffect';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * eXp Commission & Fees Calculator Page
 *
 * Dark theme with gold accents matching the site design.
 * Uses the new CommissionCalculator component with donut chart visualization.
 * Supports ?embed=true for embedding in iframes (just the calculator, no page chrome)
 */
function CalculatorContent() {
  const [isEmbed, setIsEmbed] = useState(false);
  useEffect(() => {
    setIsEmbed(new URLSearchParams(window.location.search).get('embed') === 'true');
  }, []);

  const embedRef = useRef<HTMLDivElement>(null);

  // Debounced Plausible tracking for calculator usage
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleInputChange = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('Calculator Used', { props: { calculator_type: 'commission' } });
      }
    }, 2000);
  }, []);

  // Send height to parent window when in embed mode
  useEffect(() => {
    if (!isEmbed || !embedRef.current) return;

    const sendHeight = () => {
      if (embedRef.current && window.parent !== window) {
        const height = embedRef.current.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', modal: 'calculator', height }, '*');
      }
    };

    // Send initial height
    sendHeight();

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

  // Embed mode: just the calculator component - solid background fills iframe
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
          /* Remove borders in embed mode - parent modal provides the border */
          .rounded-2xl, [class*="rounded-"] {
            border: none !important;
          }
        `}</style>
        <div ref={embedRef} style={{ background: '#0a0a0a' }}>
          <CommissionCalculator
            initialTransactions={12}
            initialCommission={10000}
            onInputChange={handleInputChange}
          />
        </div>
      </>
    );
  }

  // Full page mode
  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section - fadeSpeed 1.5 for quicker fade */}
      <StickyHeroWrapper fadeSpeed={1.5}>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <GoldenRainEffect />
          <div className="relative z-10 max-w-[1900px] mx-auto w-full text-center">
            <div className="relative z-10">
              <H1>KNOW YOUR NUMBERS</H1>
              <Tagline className="mt-4">
                No hidden fees. Just facts.
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Calculator Section - z-10 to ensure it's above the fixed hero */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-[900px] mx-auto">
          <CommissionCalculator
            initialTransactions={12}
            initialCommission={10000}
            onInputChange={handleInputChange}
          />
        </div>
      </section>

      {/* Supporting Content Section */}
      <section className="py-16 px-4 sm:px-8 relative z-10">
        <div className="max-w-[900px] mx-auto font-[var(--font-amulya)]">
          <H2>Understanding eXp Commission Splits</H2>

          <div className="mt-8 space-y-6 text-[#dcdbd5] text-base leading-relaxed">
            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">The 80/20 Split and Cap</h3>
              <p>eXp Realty uses a straightforward 80/20 commission split. You keep 80% of every commission until you hit the $16,000 annual cap. After that, you keep 100% of your commissions for the rest of your anniversary year.</p>
            </div>

            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">Post-Cap Transaction Fees</h3>
              <p>Once you cap, a small per-transaction fee applies: $250 per deal for the next 20 transactions, then just $75 per deal after that. High-producing agents keep the vast majority of their gross income.</p>
            </div>

            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">The $85 Brokerage Fee</h3>
              <p>Every transaction includes an $85 broker review fee that covers compliance, risk management, and administrative support. It applies whether you are pre-cap or post-cap.</p>
            </div>

            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">E&O Insurance</h3>
              <p>Errors and omissions insurance is $60 per transaction, capped at $750 per year. Once you hit the cap, no more E&O charges for the rest of your anniversary year.</p>
            </div>

            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">Why Your Keep Rate Improves With Production</h3>
              <p>The more you produce, the better your keep rate gets. After capping at $16,000, your effective split jumps well above 90%. Agents doing 30+ transactions per year routinely keep 95% or more of their gross commissions.</p>
            </div>

            <div>
              <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-lg mb-2">The Bigger Picture</h3>
              <p>This visualizer shows commission splits and fees only. eXp agents also earn ICON stock awards, equity through the Agent Equity Program, and revenue share income from agents they attract to the brokerage. When you factor those in, many agents effectively earn more than 100% of their commissions.</p>
            </div>
          </div>

          {/* Related Resources */}
          <div className="mt-12">
            <h3 className="font-[var(--font-taskor)] text-[#e5e4dd] text-xl mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/about-exp-realty/commission/" className="block p-4 rounded-lg border border-white/10 hover:border-[#00ff88]/30 transition-colors">
                <span className="text-[#00ff88] text-sm font-[var(--font-taskor)]">How the eXp Commission Split Is Structured</span>
              </a>
              <a href="/about-exp-realty/brokerage-fee/" className="block p-4 rounded-lg border border-white/10 hover:border-[#00ff88]/30 transition-colors">
                <span className="text-[#00ff88] text-sm font-[var(--font-taskor)]">What the $85 Brokerage Fee Covers</span>
              </a>
              <a href="/exp-realty-sponsor/commission-split-vs-net-income/" className="block p-4 rounded-lg border border-white/10 hover:border-[#00ff88]/30 transition-colors">
                <span className="text-[#00ff88] text-sm font-[var(--font-taskor)]">Commission Split vs Net Income for Realtors</span>
              </a>
              <a href="/exp-realty-sponsor/over-100-percent-commission/" className="block p-4 rounded-lg border border-white/10 hover:border-[#00ff88]/30 transition-colors">
                <span className="text-[#00ff88] text-sm font-[var(--font-taskor)]">What Over 100% Commission Payout Really Means</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ExpCommissionCalculator() {
  return <CalculatorContent />;
}
