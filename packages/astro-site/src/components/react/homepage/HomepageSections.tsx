'use client';

import React, { lazy, Suspense } from 'react';
import { SecondaryButton } from '@saa/shared/components/saa/buttons';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';

// Lazy-load below-fold sections (replaces next/dynamic with React.lazy)
const ValuePillarsTab = lazy(() =>
  import('@public-site/app/components/sections/ValuePillarsTab').then(mod => ({ default: mod.ValuePillarsTab }))
);
const MediaLogos = lazy(() =>
  import('@public-site/app/components/sections/MediaLogos').then(mod => ({ default: mod.MediaLogos }))
);
const WatchAndDecide = lazy(() =>
  import('@public-site/app/components/sections/WatchAndDecide').then(mod => ({ default: mod.WatchAndDecide }))
);
const WhySAA = lazy(() =>
  import('@public-site/app/components/sections/WhySAA').then(mod => ({ default: mod.WhySAA }))
);
const WhyOnlyAtExp = lazy(() =>
  import('@public-site/app/components/sections/WhyOnlyAtExp').then(mod => ({ default: mod.WhyOnlyAtExp }))
);
const ProvenAtScale = lazy(() =>
  import('@public-site/app/components/sections/ProvenAtScale').then(mod => ({ default: mod.ProvenAtScale }))
);
const WhatYouGet = lazy(() =>
  import('@public-site/app/components/sections/WhatYouGet').then(mod => ({ default: mod.WhatYouGet }))
);
const BuiltForFuture = lazy(() =>
  import('@public-site/app/components/sections/BuiltForFuture').then(mod => ({ default: mod.BuiltForFuture }))
);
const MeetTheFounders = lazy(() =>
  import('@public-site/app/components/sections/MeetTheFounders').then(mod => ({ default: mod.MeetTheFounders }))
);

export function HomepageSections() {
  return (
    <Suspense fallback={null}>
      <ValuePillarsTab />
      <WhySAA />
      <ProvenAtScale />
      <WhatYouGet />
      <WhyOnlyAtExp />
      <MediaLogos />
      <MeetTheFounders variant="compact" />
      <BuiltForFuture />
      <GlassPanel variant="champagne" noBlur>
        <WatchAndDecide />
      </GlassPanel>

      {/* Bottom CTA Section */}
      <section className="py-16 md:py-20 px-6 text-center">
        <p className="text-body mx-auto mb-8" style={{ maxWidth: '700px' }}>
          If you want to understand exactly how sponsorship works, what you keep, and what you never give up, see how Smart Agent Alliance fits inside eXp Realty.
        </p>
        <SecondaryButton href="/exp-realty-sponsor/">
          See SAA&apos;s Full Value Stack
        </SecondaryButton>
      </section>
    </Suspense>
  );
}
