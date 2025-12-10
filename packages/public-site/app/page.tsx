import dynamic from 'next/dynamic';
import { CTAButton, Tagline, H1 } from '@saa/shared/components/saa';
import { StaticCounter } from './components/StaticCounter';
import { SectionSkeleton } from '@/components/shared/SectionSkeleton';

// PERFORMANCE OPTIMIZATION: Lazy-load below-fold sections
const ValueStack = dynamic(
  () => import('./components/sections/ValueStack').then(mod => ({ default: mod.ValueStack })),
  { loading: () => <SectionSkeleton height={600} /> }
);

const SocialProof = dynamic(
  () => import('./components/sections/SocialProof').then(mod => ({ default: mod.SocialProof })),
  { loading: () => <SectionSkeleton height={400} /> }
);

const WhyExpRealty = dynamic(
  () => import('./components/sections/WhyExpRealty').then(mod => ({ default: mod.WhyExpRealty })),
  { loading: () => <SectionSkeleton height={700} /> }
);

const WhoWeAre = dynamic(
  () => import('./components/sections/WhoWeAre').then(mod => ({ default: mod.WhoWeAre })),
  { loading: () => <SectionSkeleton height={500} /> }
);

const PathSelectorWithContent = dynamic(
  () => import('./components/sections/PathSelectorWithContent').then(mod => ({ default: mod.PathSelectorWithContent })),
  { loading: () => <SectionSkeleton height={800} /> }
);

// Counter animation (scramble effect) - loads after initial paint
const CounterAnimation = dynamic(
  () => import('./components/CounterAnimation').then(mod => ({ default: mod.CounterAnimation }))
);

/**
 * Homepage - Server Component with Static Content
 *
 * HERO LAYOUT: CSS Grid for zero-flash positioning
 * - Image container divided into 75%/25% rows
 * - H1 starts at row 2 (75% point of image)
 * - Both image and H1 container share same grid, ensuring alignment
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section
        className="relative min-h-[100dvh] w-full"
        aria-label="Hero"
        style={{
          maxWidth: '1900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8dvh 1rem clamp(20px, 5dvh, 60px)',
        }}
      >
        {/* Static Counter - positioned absolutely */}
        <StaticCounter />

        {/* Wolf Pack Background Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
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
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover wolf-pack-bg hero-bg"
              style={{
                objectPosition: 'center 55%',
                maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
              }}
            />
          </div>
        </div>

        {/* Image + H1 Grid Container */}
        {/* The image container is split 75%/25%, H1 starts at the 75% mark */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            // Single row - image and H1 overlap
            gridTemplateRows: '1fr',
            width: '100%',
            maxWidth: '1900px',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {/* Image Container with internal 75/25 split */}
          <div
            className="relative pointer-events-none z-[1]"
            style={{
              gridRow: '1',
              gridColumn: '1',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridTemplateRows: '75% 25%',
              width: 'clamp(400px, 47.37vw, 900px)',
              maxWidth: '95vw',
              aspectRatio: '900 / 500',
              maxHeight: '70dvh',
            }}
          >
            {/* Space cloud/mist backdrop - spans full image */}
            <div
              className="hero-3d-backdrop absolute left-1/2 -translate-x-1/2 w-[110%] h-[110%]"
              style={{
                gridRow: '1 / -1',
                top: '0',
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Main image - spans full container */}
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
              className="hero-3d-image profile-image object-contain"
              style={{
                gridRow: '1 / -1',
                gridColumn: '1',
                width: '100%',
                height: '100%',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
              }}
            />

            {/* H1 anchor - positioned at row 2 (75% down the image) */}
            {/* This element is inside the image's grid so it's relative to image height */}
            <div
              id="h1-anchor"
              style={{
                gridRow: '2',
                gridColumn: '1',
                width: '100%',
                height: '0',
                position: 'relative',
              }}
            >
              {/* H1 content positioned absolutely from this anchor */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[95vw] max-w-[1900px] px-4 sm:px-8 md:px-12 text-center pointer-events-auto z-[2]"
                style={{
                  top: '0',
                }}
              >
                {/* Headline Group */}
                <div className="space-y-4" style={{ perspective: '1000px' }}>
                  <H1
                    id="hero-heading"
                    style={{
                      fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)',
                    }}
                  >
                    SMART AGENT ALLIANCE
                  </H1>
                  <Tagline className="hero-tagline-mobile-spacing">
                    For Agents Who Want More
                  </Tagline>
                </div>

                {/* CTA Button Group */}
                <div className="flex flex-col sm:flex-row gap-0 sm:gap-3 justify-center items-center mt-6">
                  <CTAButton href="/join-exp-sponsor-team/">
                    JOIN THE ALLIANCE
                  </CTAButton>
                  <CTAButton href="/exp-realty-sponsor/">
                    LEARN MORE
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Animation - Hydrates after initial render */}
        <CounterAnimation />
      </section>

      {/* Homepage Sections */}
      <ValueStack />
      <SocialProof />
      <WhyExpRealty />
      <WhoWeAre />
      <PathSelectorWithContent />

    </main>
  );
}
