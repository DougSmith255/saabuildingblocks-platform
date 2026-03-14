'use client';

import dynamic from 'next/dynamic';
import { SecondaryButton } from '@saa/shared/components/saa/buttons';

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
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,215,0,0.03) 0%, rgba(255,215,0,0.04) 50%, rgba(255,215,0,0.03) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.2), inset 0 8px 20px -8px rgba(255,215,0,0.25), inset 0 20px 40px -20px rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(0,0,0,0.7), inset 0 -2px 6px 0 rgba(0,0,0,0.5), inset 0 -10px 25px -8px rgba(0,0,0,0.6), inset 0 -25px 50px -20px rgba(0,0,0,0.45)',
        }}
      >
        {/* Dots texture */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] rounded-3xl"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '8px 8px' }}
        />
        <div className="relative z-10">
          <WatchAndDecide />
        </div>
      </div>

      {/* Bottom CTA Section - Outside glass panel */}
      <section className="py-16 md:py-20 px-6 text-center">
        <p className="text-body mx-auto mb-8" style={{ maxWidth: '700px' }}>
          If you want to understand exactly how sponsorship works, what you keep, and what you never give up, see how Smart Agent Alliance fits inside eXp Realty.
        </p>
        <SecondaryButton href="/exp-realty-sponsor">
          See SAA&apos;s Value
        </SecondaryButton>
      </section>
    </>
  );
}
