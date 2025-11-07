import { CTAButton, Tagline, H1 } from '@saa/shared/components/saa';
import { HomepageClient } from './components/HomepageClient';

/**
 * Homepage - Server Component with Static Content
 * Client animations hydrate separately via HomepageClient
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-8 md:px-12 py-16 sm:py-20 md:py-24"
        aria-labelledby="hero-heading"
      >
        {/* Wolf Pack Background Image - furthest back layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
            <div
              className="absolute inset-0"
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
          <div className="relative w-[64vw] min-w-[400px] max-w-[960px] h-[84vh]">
            {/* Space cloud/mist backdrop */}
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[110%] h-[110%]"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-70px)',
              }}
            />
            {/* Main image with tighter gradient attached to image base */}
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full h-full"
              style={{
                backgroundImage: 'url(https://wp.saabuildingblocks.com/wp-content/uploads/2025/10/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                maskImage: `
                  radial-gradient(ellipse 55% 60% at center 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.1) 82%, transparent 92%),
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 65%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.05) 92%, transparent 96%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 55% 60% at center 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 68%, rgba(0,0,0,0.1) 82%, transparent 92%),
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 65%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.25) 85%, rgba(0,0,0,0.05) 92%, transparent 96%)
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-50px) rotateX(5deg)',
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

        {/* Container - shifted up by 15% from 28vh */}
        <div className="relative z-10 w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)] mx-auto space-y-8 mt-[23.8vh]">
          {/* Headline Group */}
          <div className="space-y-10 text-center" style={{ perspective: '1000px' }}>
            {/* H1: Using Master Controller H1 component */}
            <H1 id="hero-heading">
              SMART AGENT ALLIANCE
            </H1>
            <Tagline>
              For Agents Who Want More
            </Tagline>
          </div>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <CTAButton href="/sign-up">
              JOIN THE ALLIANCE
            </CTAButton>
            <CTAButton href="/about">
              LEARN MORE
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
