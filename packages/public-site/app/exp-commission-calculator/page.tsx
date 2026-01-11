'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { H1, Tagline, CommissionCalculator } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { CalculatorDataStreamEffect } from './CalculatorDataStreamEffect';

/**
 * eXp Commission & Fees Calculator Page
 *
 * Dark theme with gold accents matching the site design.
 * Uses the new CommissionCalculator component with donut chart visualization.
 * Supports ?embed=true for embedding in iframes (just the calculator, no page chrome)
 */
function CalculatorContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  const embedRef = useRef<HTMLDivElement>(null);

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
          <CalculatorDataStreamEffect />
          <div className="relative z-10 max-w-[1900px] mx-auto w-full text-center">
            <H1>KNOW YOUR NUMBERS</H1>
            <Tagline className="mt-4">
              No hidden fees. Just facts.
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Calculator Section - z-10 to ensure it's above the fixed hero */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-[900px] mx-auto">
          <CommissionCalculator
            initialTransactions={12}
            initialCommission={10000}
          />
        </div>
      </section>
    </main>
  );
}

export default function ExpCommissionCalculator() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a0a', minHeight: '100vh' }} />}>
      <CalculatorContent />
    </Suspense>
  );
}
