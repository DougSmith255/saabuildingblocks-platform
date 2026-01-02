'use client';

import { H1, Tagline, CommissionCalculator } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { CalculatorDataStreamEffect } from './CalculatorDataStreamEffect';

/**
 * eXp Commission & Fees Calculator Page
 *
 * Dark theme with gold accents matching the site design.
 * Uses the new CommissionCalculator component with donut chart visualization.
 */
export default function ExpCommissionCalculator() {
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
          <CommissionCalculator
            initialTransactions={12}
            initialCommission={10000}
          />
        </div>
      </section>
    </main>
  );
}
