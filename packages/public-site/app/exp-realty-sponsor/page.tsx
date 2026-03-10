'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { H1, Tagline } from '@saa/shared/components/saa/headings';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { AgentCounter, MobileAgentCounter } from '@/app/components/AgentCounter';

// Counter animation (scramble effect) - loads after initial paint
const CounterAnimation = dynamic(
  () => import('@/app/components/CounterAnimation').then(mod => ({ default: mod.CounterAnimation }))
);

// Below-fold sections - code-split into separate chunk (~130KB)
const SponsorSections = dynamic(
  () => import('./components/SponsorSections'),
  { ssr: false }
);

export default function ExpRealtySponsor() {
  // Handle hash scroll on mount (e.g. /exp-realty-sponsor#agent-portal-walkthrough)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Delay to let React hydrate and layout settle
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main id="main-content">
      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />

          {/* Agent Counter - viewport-aware (only renders desktop OR mobile counter) */}
          <AgentCounter />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
                "
                sizes="100vw"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 55%',
                  maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                }}
              />
            </div>
          </div>
          <div className="max-w-[2500px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>Smart Agent Alliance</H1>
              <Tagline className="mt-4" style={{ maxWidth: '95%', marginLeft: 'auto', marginRight: 'auto' }}>Premium Tools. Modern Training. Zero Cost.</Tagline>
              <p className="text-body opacity-90 mt-2">
                All Smart Agent Alliance systems live inside the agent portal.
              </p>
              {/* Mobile counter - centered below tagline, visible only < 780px */}
              <MobileAgentCounter />
            </div>
          </div>

          {/* Counter Animation - Hydrates after initial render */}
          <CounterAnimation />
        </section>
      </StickyHeroWrapper>

      {/* Below-fold sections - lazy loaded */}
      <SponsorSections />

    </main>
  );
}
