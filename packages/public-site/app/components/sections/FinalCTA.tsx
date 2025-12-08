'use client';

import { CTAButton, SecondaryButton, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';

export function FinalCTA() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* CTA Card - Premium Gold Treatment */}
        <CyberCardGold padding="xl">
          {/* Header */}
          <div className="text-center mb-8 pt-4">
            <NeonGoldText as="h2" className="text-h2">
              Ready to Transform Your Real Estate Career?
            </NeonGoldText>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              Join the fastest-growing team at eXp Realty and start building the career - and life - you deserve.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href="/join">
              Get Started Now
            </CTAButton>
            <SecondaryButton href="/webinar">
              Watch Free Webinar
            </SecondaryButton>
          </div>

          {/* Trust Statement */}
          <p className="text-caption text-center opacity-60 mt-8">
            No commitment required. See if we're the right fit for you.
          </p>
        </CyberCardGold>
      </div>
    </section>
  );
}
