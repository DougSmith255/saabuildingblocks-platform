import dynamic from 'next/dynamic';
import { H1, Tagline } from '@saa/shared/components/saa/headings';
import './styles/hero.css';
import { AgentCounter, TaglineCounterSuffix } from './components/AgentCounter';
import { FixedHeroWrapper } from '@/components/shared/FixedHeroWrapper';
import { RevealMaskEffect } from '@/components/shared/RevealMaskEffect';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { HomepageSections } from './components/HomepageSections';

// Counter animation (scramble effect) - loads after initial paint
const CounterAnimation = dynamic(
  () => import('./components/CounterAnimation').then(mod => ({ default: mod.CounterAnimation }))
);

/**
 * Homepage - Server Component with Static Content
 *
 * HERO LAYOUT: Entire hero content (image + H1 + tagline + buttons) centered as one unit
 * - Flexbox centers the whole content block vertically
 * - Image and H1 overlap using negative margin
 * - Equal space above image and below buttons
 *
 * Below-fold sections are in HomepageSections (client component)
 * to allow ssr: false dynamic imports.
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section - Fixed in place, content scrolls over it */}
      <FixedHeroWrapper>
        <section
          className="relative min-h-[100dvh] w-full"
          aria-label="Hero"
          style={{
            maxWidth: '3000px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
        {/* Agent Counter - viewport-aware (only renders desktop OR mobile counter) */}
        <AgentCounter />

        {/* Reveal Mask Effect - Golden glow behind Doug & Karrie (dynamically loaded) */}
        <RevealMaskEffect />

        {/* Hero Content Block - Image + H1 + Tagline + Buttons as one centered unit */}
        {/* Mobile: 8% top padding to push content below header */}
        <div
          className="hero-content-wrapper flex flex-col items-center w-full pt-[8%] md:pt-0"
          style={{
            maxWidth: '3000px',
            overflow: 'visible',
          }}
        >
          {/* Doug and Karrie Image Container */}
          <div
            className="relative pointer-events-none z-[1]"
            style={{
              width: 'clamp(400px, 47.37vw, 900px)',
              maxWidth: '95vw',
              aspectRatio: '900 / 500',
              maxHeight: '50dvh',
              overflow: 'visible',
            }}
          >
            {/* Space cloud/mist backdrop - centered and extends beyond container on all sides */}
            <div
              className="hero-3d-backdrop absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Main image */}
            <img
              src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop"
              srcSet="
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/mobile 375w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/tablet 768w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop 1280w
              "
              sizes="(max-width: 480px) 375px, (max-width: 768px) 768px, 1280px"
              alt="Doug and Karrie - Co-founders of Smart Agent Alliance"
              width={900}
              height={500}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="hero-3d-image profile-image w-full h-full object-contain"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
              }}
            />
          </div>

          {/* H1, Tagline, and Buttons - pulls up to overlap bottom 25% of image */}
          <div
            className="w-full px-4 sm:px-8 md:px-12 text-center pointer-events-auto z-[2]"
            style={{
              maxWidth: '3000px',
              // Pull up to overlap with bottom 25% of image
              // Image height = width / 1.8, so 25% = width / 7.2
              // But also capped by maxHeight: 50dvh, so we use a blend
              marginTop: 'calc(min(clamp(400px, 47.37vw, 900px) / 7.2, 12.5dvh) * -1)',
            }}
          >
            {/* Headline Group */}
            <div style={{ perspective: '1000px' }} className="relative">
              <div className="relative z-10">
                <H1
                  id="hero-heading"
                  style={{ marginBottom: '3px' }}
                >
                  SMART AGENT ALLIANCE
                </H1>
                <Tagline className="hero-tagline-mobile-spacing" style={{ marginBottom: '0.25rem' }} counterSuffix={<TaglineCounterSuffix />}>
                  For Agents Who Want More
                </Tagline>
                <p className="text-body opacity-90">
                  Smart Agent Alliance costs agents nothing. Every system is delivered through our agent portal.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hero-cta-buttons flex justify-center items-center" style={{ marginTop: '14px' }}>
              <JoinAllianceCTA>JOIN THE ALLIANCE</JoinAllianceCTA>
            </div>
          </div>
        </div>

        {/* Counter Animation - Hydrates after initial render */}
        <CounterAnimation />

      </section>
      </FixedHeroWrapper>

      {/* Below-fold sections (client component for ssr: false dynamic imports) */}
      <HomepageSections />

    </main>
  );
}
