'use client';

import { useEffect } from 'react';
import { H1, Tagline } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * Book a Call Page
 *
 * Embeds the GHL booking calendar for scheduling calls with SAA.
 * Uses the same hero pattern as other public pages.
 */
export default function BookACallPage() {
  // Track booking submission via GHL iframe postMessage
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Only accept messages from our GHL domain
      if (!event.origin.includes('smartagentalliance.com')) return;
      const data = event.data;
      if (!data) return;
      // GHL booking widgets send "set-sticky-contacts" after form submission
      // and various other signals on booking confirmation
      const isBooking =
        data === 'set-sticky-contacts' ||
        (typeof data === 'object' && (
          data.type === 'set-sticky-contacts' ||
          data.action === 'set-sticky-contacts' ||
          data.type === 'booking-confirmed' ||
          data.action === 'formSubmitted'
        ));
      if (isBooking && window.plausible) {
        window.plausible('Booking Submitted', { props: { page: '/book-a-call' } });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Load the GHL form embed script after mount
  useEffect(() => {
    const scriptId = 'ghl-form-embed';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://team.smartagentalliance.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

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

      {/* Booking Calendar Section */}
      <section className="relative pb-12 md:pb-20 px-4 sm:px-8 md:px-12" style={{ marginTop: '-2rem' }}>
        <div className="max-w-[1400px] mx-auto">
          <iframe
            src="https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7"
            style={{
              width: '100%',
              border: 'none',
              overflow: 'hidden',
              minHeight: '700px',
            }}
            scrolling="no"
            id="v5LFLy12isdGJiZmTxP7_1739836498498"
            title="Book a Call with Smart Agent Alliance"
          />
        </div>
      </section>
    </main>
  );
}
