import dynamic from 'next/dynamic';
import Image from 'next/image';
import { CTAButton, Tagline, H1 } from '@saa/shared/components/saa';
import { OptimizedImage } from '@/components';
import { StaticCounter } from './components/StaticCounter';

// Homepage sections
import { ValueStack } from './components/sections/ValueStack';
import { SocialProof } from './components/sections/SocialProof';
import { WhyExpRealty } from './components/sections/WhyExpRealty';
import { WhoWeAre } from './components/sections/WhoWeAre';
import { PathSelector } from './components/sections/PathSelector';
import { BuiltForFuture } from './components/sections/BuiltForFuture';
import { FAQ } from './components/sections/FAQ';
import { FinalCTA } from './components/sections/FinalCTA';

// PERFORMANCE OPTIMIZATION: Lazy-load all JavaScript animations
// This reduces initial bundle size and eliminates 74s mobile blocking time!
// CSS animations (fade-in) work immediately, JavaScript enhancements load after

// Counter animation (scramble effect) - loads after initial paint
const CounterAnimation = dynamic(
  () => import('./components/CounterAnimation').then(mod => ({ default: mod.CounterAnimation }))
);

// Wolf pack background animation - loads after initial paint
const WolfPackAnimation = dynamic(
  () => import('./components/WolfPackAnimation').then(mod => ({ default: mod.WolfPackAnimation }))
);

// Defer loading of desktop-only positioning components (loaded separately from main bundle)
const HomepageClient = dynamic(() => import('./components/HomepageClient').then(mod => mod.HomepageClient));
const DynamicH1Container = dynamic(() => import('./components/DynamicH1Container').then(mod => mod.DynamicH1Container));

/**
 * Homepage - Server Component with Static Content
 * Client animations hydrate separately via HomepageClient
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section
        className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24"
        aria-labelledby="hero-heading"
      >
        {/* Wolf Pack Background Image - furthest back layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
            <div
              className="absolute inset-0 hero-animate-bg animate-in"
              style={{
                // Responsive background images using CSS image-set() - browser picks the best size
                // Mobile (<=375px): 28KB, Tablet (<=768px): 52KB, Desktop: 87KB (67% bandwidth savings on mobile!)
                backgroundImage: `image-set(
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile) 1x,
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet) 2x,
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop) 3x
                )`,
                // Fallback for browsers without image-set support
                // @ts-ignore
                WebkitBackgroundImage: `-webkit-image-set(
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile) 1x,
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet) 2x,
                  url(https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop) 3x
                )`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center 55%',
                backgroundAttachment: 'fixed',
                maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
              }}
            />
          </div>
        </div>

        {/* Doug and Karrie Co-Founders Background Image - emerging from space mist */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]" style={{ perspective: '1000px' }}>
          <div className="relative min-w-[400px] max-w-[900px]" style={{
            // At 1900px screen width: 47.37vw = 900px (starts scaling)
            // Below 1900px: scales down linearly
            // Above 1900px: clamped at 900px max
            width: 'clamp(400px, 47.37vw, 900px)',
            height: '84dvh', // Use dvh (dynamic viewport height) to prevent mobile chrome jitter
          }}>
            {/* Space cloud/mist backdrop */}
            <div
              className="hero-3d-backdrop absolute left-1/2 -translate-x-1/2 w-[110%] h-[110%]"
              style={{
                top: 'calc(8dvh + 15px)', // Pushed down 15px on mobile to avoid agent counter overlap
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Main image - Next.js Image component with preload for LCP */}
            <Image
              src="https://wp.saabuildingblocks.com/wp-content/uploads/2025/11/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp"
              alt="Doug and Karrie - Co-founders of Smart Agent Alliance"
              width={900}
              height={500}
              loading="eager"
              fetchPriority="high"
              quality={90}
              sizes="(max-width: 768px) 90vw, 900px"
              className="hero-3d-image profile-image absolute left-1/2 -translate-x-1/2 w-full h-auto max-h-full object-contain"
              style={{
                top: 'calc(8dvh + 15px)', // Pushed down 15px on mobile to avoid agent counter overlap
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Spaceman Background Image */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0">
          <div className="relative w-full max-w-[1200px] h-[80vh]">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
              style={{
                backgroundImage: 'url(/animations/spaceman.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom center',
                maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.6) 20%, black 40%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.6) 20%, black 40%)',
              }}
            />
          </div>
        </div>

        {/* Static Counter - Server Component (No Hydration Delay) */}
        <StaticCounter />

        {/* Counter Animation - Hydrates after counter is visible */}
        <CounterAnimation />

        {/* Trigger hero animations (wolf pack background and profile image fade-in) */}
        <WolfPackAnimation />

        {/* Desktop: JavaScript positioning (accurate) - Hidden on mobile */}
        <div className="hidden md:block">
          <HomepageClient />
          <DynamicH1Container>
          {/* Headline Group */}
          <div className="space-y-4 text-center" style={{ perspective: '1000px' }}>
            {/* H1: Using Master Controller H1 component with hero animation */}
            {/* Aggressive curve: reaches 150px at 3000px, drops fast to 1920px, then gradual */}
            <H1
              id="hero-heading"
              style={{
                fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)',
              }}
            >
              SMART AGENT ALLIANCE
            </H1>
            <Tagline className="hero-tagline-mobile-spacing" heroAnimate animationDelay="0.9s">
              For Agents Who Want More
            </Tagline>
          </div>

          {/* CTA Button Group - ensure 15px+ clearance from fold */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pb-6">
            <CTAButton href="/join-exp-sponsor-team/" heroAnimate animationDelay="1.3s">
              JOIN THE ALLIANCE
            </CTAButton>
            <CTAButton href="/exp-realty-sponsor/" heroAnimate animationDelay="1.7s">
              LEARN MORE
            </CTAButton>
          </div>
          </DynamicH1Container>
        </div>

        {/* Mobile: CSS-only positioning (optimized for performance) - Visible only on mobile */}
        <div
          className="md:hidden absolute left-1/2 -translate-x-1/2 z-10 w-[95%] space-y-8"
          style={{
            // Mobile-optimized CSS positioning
            // Current position covering 55% - need to move down to 75%
            // If 55% = 8dvh + 182px, then 75% needs more offset
            // Adjusting: 8dvh + 15px + (75% of image height)
            // Mobile image height ~222px, so 75% = 167px
            // But need to account for actual rendered position
            // Increasing offset to: 8dvh + 240px (moved down ~58px more)
            top: 'calc(8dvh + 240px)',
          }}
        >
          {/* Headline Group */}
          <div className="space-y-4 text-center" style={{ perspective: '1000px' }}>
            {/* H1: Using Master Controller H1 component with hero animation */}
            <H1
              id="hero-heading-mobile"
              style={{
                fontSize: 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)',
              }}
            >
              SMART AGENT ALLIANCE
            </H1>
            <Tagline className="hero-tagline-mobile-spacing" heroAnimate animationDelay="0.9s">
              For Agents Who Want More
            </Tagline>
          </div>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pb-6">
            <CTAButton href="/join-exp-sponsor-team/" heroAnimate animationDelay="1.3s">
              JOIN THE ALLIANCE
            </CTAButton>
            <CTAButton href="/exp-realty-sponsor/" heroAnimate animationDelay="1.7s">
              LEARN MORE
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Homepage Sections */}
      <ValueStack />
      <SocialProof />
      <WhyExpRealty />
      <WhoWeAre />
      <PathSelector />
      <BuiltForFuture />
      <FAQ />
      <FinalCTA />

    </main>
  );
}
