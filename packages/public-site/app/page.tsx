import { CTAButton } from '@saa/shared/components/saa';
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
              className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%]"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-70px)',
              }}
            />
            {/* Main image with combined radial + linear fade for smooth bottom */}
            <div
              className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
              style={{
                backgroundImage: 'url(https://wp.saabuildingblocks.com/wp-content/uploads/2025/10/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                maskImage: `
                  radial-gradient(ellipse 60% 65% at center 28%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.3) 75%, transparent 100%),
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 63%, transparent 65%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 60% 65% at center 28%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.3) 75%, transparent 100%),
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.8) 48%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 63%, transparent 65%)
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

        {/* Container - shifted down to recenter vertically */}
        <div className="relative z-10 w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)] mx-auto space-y-8 mt-[28vh]">
          {/* Headline Group */}
          <div className="space-y-10 text-center" style={{ perspective: '1000px' }}>
            {/* H1: 3D Neon Sign with individual letter flicker */}
            <h1
              id="hero-heading"
              className="text-h1 text-display"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(15deg)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                rowGap: 0,
                columnGap: '0.5em',
              }}
            >
              {['SMART', 'AGENT', 'ALLIANCE'].map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split('').map((char, charIndex) => {
                    // Alt glyphs: N = U+f015, E = U+f011, M = U+f016
                    let displayChar = char;
                    if (char === 'N') displayChar = '\uf015';
                    if (char === 'E') displayChar = '\uf011';
                    if (char === 'M') displayChar = '\uf016';

                    const globalIndex = wordIndex * 10 + charIndex;

                    return (
                      <span
                        key={charIndex}
                        className="neon-char"
                        data-char={displayChar}
                        style={{
                          transform: 'translateZ(20px)',
                          animation: `neonFlicker${(globalIndex % 3) + 1} ${6.5 + (globalIndex * 0.1)}s linear infinite`,
                          display: 'inline-block',
                        }}
                      >
                        {displayChar}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
            <p
              className="text-tagline"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(15deg) translateZ(20px)',
                color: '#dcdbd5',
                textShadow: `
                  -1px -1px 0 rgba(255,255,255, 0.4),
                  1px -1px 0 rgba(255,255,255, 0.4),
                  -1px 1px 0 rgba(255,255,255, 0.4),
                  1px 1px 0 rgba(255,255,255, 0.4),
                  0 -2px 8px #dcdbd5,
                  0 0 2px #dcdbd5,
                  0 0 5px #dcdbd5,
                  0 0 15px rgba(220,219,213,0.5),
                  0 0 2px #dcdbd5,
                  0 2px 3px #000
                `,
              }}
            >
              For Agents Who Want More
            </p>
          </div>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
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
