'use client';

import dynamic from 'next/dynamic';
import { SecondaryButton } from '@saa/shared/components/saa/buttons';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';

// PERFORMANCE OPTIMIZATION: Lazy-load below-fold sections
// ssr: false + loading: null prevents ANY rendering during SSR (no height = no CLS)
// Sections load client-side only when JS hydrates
const ValuePillarsTab = dynamic(
  () => import('./sections/ValuePillarsTab').then(mod => ({ default: mod.ValuePillarsTab })),
  { ssr: false }
);

const MediaLogos = dynamic(
  () => import('./sections/MediaLogos').then(mod => ({ default: mod.MediaLogos })),
  { ssr: false }
);

const WatchAndDecide = dynamic(
  () => import('./sections/WatchAndDecide').then(mod => ({ default: mod.WatchAndDecide })),
  { ssr: false }
);

const WhySAA = dynamic(
  () => import('./sections/WhySAA').then(mod => ({ default: mod.WhySAA })),
  { ssr: false }
);

const WhyOnlyAtExp = dynamic(
  () => import('./sections/WhyOnlyAtExp').then(mod => ({ default: mod.WhyOnlyAtExp })),
  { ssr: false }
);

const ProvenAtScale = dynamic(
  () => import('./sections/ProvenAtScale').then(mod => ({ default: mod.ProvenAtScale })),
  { ssr: false }
);

const WhatYouGet = dynamic(
  () => import('./sections/WhatYouGet').then(mod => ({ default: mod.WhatYouGet })),
  { ssr: false }
);

const BuiltForFuture = dynamic(
  () => import('./sections/BuiltForFuture').then(mod => ({ default: mod.BuiltForFuture })),
  { ssr: false }
);

const MeetTheFounders = dynamic(
  () => import('./sections/MeetTheFounders').then(mod => ({ default: mod.MeetTheFounders })),
  { ssr: false }
);

/**
 * HomepageSections - Client component wrapper for below-fold dynamic sections
 *
 * Extracted from page.tsx so the homepage can be a Server Component.
 * All sections use ssr: false (requires 'use client' boundary).
 */
export function HomepageSections() {
  return (
    <>
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

      {/* Bottom CTA Section - Outside glass panel */}
      <section className="py-16 md:py-20 px-6 text-center">
        <p className="text-body mx-auto mb-8" style={{ maxWidth: '700px' }}>
          If you want to understand exactly how sponsorship works, what you keep, and what you never give up, see how Smart Agent Alliance fits inside eXp Realty.
        </p>
        <SecondaryButton href="/exp-realty-sponsor">
          See SAA&apos;s Full Value Stack
        </SecondaryButton>
      </section>
    </>
  );
}
