import { CTAButton, Tagline, H1 } from '@saa/shared/components/saa';
import { HomepageClient } from './components/HomepageClient';
import { DynamicH1Container } from './components/DynamicH1Container';
import { ImageAnimationStyles } from './components/ImageAnimationStyles';
import { WolfPackAnimation } from './components/WolfPackAnimation';
import { MobileDebugOverlay } from './components/MobileDebugOverlay';

/**
 * Homepage - Server Component with Static Content
 * Client animations hydrate separately via HomepageClient
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24"
        aria-labelledby="hero-heading"
      >
        {/* Wolf Pack Background Image - furthest back layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
            <div
              className="absolute inset-0 hero-animate-bg"
              style={{
                backgroundImage: 'url(https://wp.saabuildingblocks.com/wp-content/uploads/2025/10/Smart-agent-alliance-and-the-wolf-pack.webp)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center 55%',
                maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
              }}
            />
          </div>
        </div>

        {/* Doug and Karrie Co-Founders Background Image - emerging from space mist */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]" style={{ perspective: '1000px' }}>
          <div className="relative w-[64vw] min-w-[400px] max-w-[900px] h-[84vh]">
            {/* Space cloud/mist backdrop */}
            <div
              className="hero-3d-backdrop absolute top-[8vh] left-1/2 -translate-x-1/2 w-[110%] h-[110%]"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Main image - using img tag so mask applies to actual image bounds */}
            <img
              src="https://wp.saabuildingblocks.com/wp-content/uploads/2025/11/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp"
              alt="Doug and Karrie - Co-founders of Smart Agent Alliance"
              className="hero-3d-image profile-image absolute top-[8vh] left-1/2 -translate-x-1/2 w-full h-auto max-h-full object-contain"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%)',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
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

        {/* Client-side animations (counter + neon flicker) */}
        <HomepageClient />

        {/* Wolf pack animation trigger */}
        <WolfPackAnimation />

        {/* Container - dynamically positioned to overlap profile image by 30% */}
        <DynamicH1Container>
          {/* Headline Group */}
          <div className="space-y-4 text-center" style={{ perspective: '1000px' }}>
            {/* H1: Using Master Controller H1 component with hero animation */}
            <H1 id="hero-heading" heroAnimate animationDelay="0.5s">
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

        {/* Image fade-in animation keyframes - Client component */}
        <ImageAnimationStyles />
      </section>

      {/* Mobile Debug Overlay - Press and hold 2s to toggle */}
      <MobileDebugOverlay />
    </main>
  );
}
