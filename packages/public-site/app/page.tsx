import dynamic from 'next/dynamic';
import { CTAButton, Tagline, H1 } from '@saa/shared/components/saa';
import { AgentCounter, TaglineCounterSuffix } from './components/AgentCounter';
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
 * HERO LAYOUT: Entire hero content (image + H1 + tagline + buttons) centered as one unit
 * - Flexbox centers the whole content block vertically
 * - Image and H1 overlap using negative margin
 * - Equal space above image and below buttons
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section */}
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
        }}
      >
        {/* Agent Counter - viewport-aware (only renders desktop OR mobile counter) */}
        <AgentCounter />

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

        {/* Hero Content Block - Image + H1 + Tagline + Buttons as one centered unit */}
        <div
          className="flex flex-col items-center w-full"
          style={{
            maxWidth: '1900px',
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
            }}
          >
            {/* Space cloud/mist backdrop */}
            <div
              className="hero-3d-backdrop absolute left-1/2 -translate-x-1/2 w-[110%] h-[110%]"
              style={{
                top: '0',
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
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
              }}
            />
          </div>

          {/* H1, Tagline, and Buttons - pulls up to overlap bottom 25% of image */}
          <div
            className="w-full px-4 sm:px-8 md:px-12 text-center pointer-events-auto z-[2]"
            style={{
              maxWidth: '1900px',
              // Pull up to overlap with bottom 25% of image
              // Image height = width / 1.8, so 25% = width / 7.2
              // But also capped by maxHeight: 50dvh, so we use a blend
              marginTop: 'calc(min(clamp(400px, 47.37vw, 900px) / 7.2, 12.5dvh) * -1)',
            }}
          >
            {/* Headline Group */}
            <div className="space-y-6 sm:space-y-8" style={{ perspective: '1000px' }}>
              <H1
                id="hero-heading"
                style={{
                  fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)',
                }}
              >
                SMART AGENT ALLIANCE
              </H1>
              <Tagline className="hero-tagline-mobile-spacing" counterSuffix={<TaglineCounterSuffix />}>
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
