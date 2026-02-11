'use client';

import { CTAButton, SecondaryButton, NeonCard, NeonGoldText } from '@saa/shared/components/saa';

export function FinalCTA() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* CTA Card - Premium Gold Treatment */}
        <NeonCard padding="xl">
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
            <CTAButton href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>
              Join The Alliance
            </CTAButton>
            <SecondaryButton href="https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7">
              Watch Free Webinar
            </SecondaryButton>
          </div>

          {/* Trust Statement */}
          <p className="text-caption text-center opacity-60 mt-8">
            No commitment required. See if we're the right fit for you.
          </p>
        </NeonCard>
      </div>
    </section>
  );
}
