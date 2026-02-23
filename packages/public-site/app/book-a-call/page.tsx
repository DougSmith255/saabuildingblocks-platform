'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { H1, Tagline } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import CustomBookingWidget from './components/CustomBookingWidget';

/**
 * Book a Call Page
 *
 * Custom booking widget that connects to GoHighLevel calendar API
 * via Cloudflare Functions proxy. Replaces the GHL iframe embed
 * with a fully styled experience matching the SAA design system.
 *
 * Supports embed mode via ?embed=true (strips nav/footer via LayoutWrapper).
 * Supports agent referral tracking via ?agent=<slug>.
 */

function BookACallContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const agentSlug = searchParams.get('agent') || undefined;

  if (isEmbed) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1400px' }}>
          <CustomBookingWidget agentSlug={agentSlug} />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[50dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 pt-[150px] pb-16 md:pb-20">
          <QuantumGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>BOOK A CALL</H1>
              <Tagline className="mt-4" style={{ maxWidth: '70vw', margin: '1rem auto 0' }}>
                Schedule a one-on-one with our team to see if SAA is the right fit for you.
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Booking Widget Section */}
      <section className="relative pb-12 md:pb-20 px-4 sm:px-8 md:px-12" style={{ marginTop: '-2rem' }}>
        <div className="max-w-[1400px] mx-auto">
          <CustomBookingWidget agentSlug={agentSlug} />
        </div>
      </section>
    </main>
  );
}

export default function BookACallPage() {
  return (
    <Suspense>
      <BookACallContent />
    </Suspense>
  );
}
