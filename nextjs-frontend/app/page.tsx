'use client';

import { CTAButton, CyberText3D } from '@/components/saa';
import SlotCounter from 'react-slot-counter';
import { useState, useEffect } from 'react';

export default function Home() {
  // Counter animation loop state
  const [counterValue, setCounterValue] = useState("0000");
  const [startValue, setStartValue] = useState("0000");
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Initial animation from 0000 to 3700
    const firstTimeout = setTimeout(() => {
      setCounterValue("3700");
    }, 100);

    // Loop: hold at 3700 for 3s, then reset instantly to 0000 and animate to 3700
    const interval = setInterval(() => {
      // Instant reset to 0000 (no animation)
      setStartValue("0000");
      setCounterValue("0000");

      // After a tiny delay, animate to 3700
      setTimeout(() => {
        setStartValue("0000");
        setCounterValue("3700");
      }, 50);
    }, 5000); // 2s animation + 3s hold at 3700

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

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
          <div className="relative w-full max-w-[960px] h-[84vh]">
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
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.1) 85%, transparent 95%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 60% 65% at center 28%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.3) 75%, transparent 100%),
                  linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.1) 85%, transparent 95%)
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-50px) rotateX(5deg)',
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
              }}
            />
            {/* Subtle glow around the image */}
            <div
              className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%]"
              style={{
                background: 'radial-gradient(ellipse 45% 55% at center 35%, rgba(255,215,0,0.03) 0%, rgba(255,215,0,0.01) 50%, transparent 80%)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(-45px)',
                pointerEvents: 'none',
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

        {/* Agent Counter - Top Right, Below Header */}
        <div
          className="absolute z-50"
          style={{
            top: '120px',
            right: '2rem',
          }}
        >
          <div
            className="flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-synonym)',
              fontWeight: 100,
              color: 'var(--color-body-text)',
            }}
          >
            {/* SlotCounter Numbers (LARGEST) */}
            <div
              style={{
                fontSize: 'clamp(2.5rem, 1.2vw + 2.16rem, 4.32rem)',
                maskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 35%, black 45%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)',
              }}
            >
              <SlotCounter
                value={counterValue}
                startValue={startValue}
                autoAnimationStart
                duration={2.5}
                speed={1.6}
                dummyCharacterCount={15}
                hasInfiniteList={true}
                delay={0.12}
                startFromLastDigit={true}
                animateUnchanged={true}
                direction="bottom-up"
              />
            </div>
            {/* + Symbol (MEDIUM) */}
            <span style={{ fontSize: 'clamp(2rem, 0.55vw + 1.824rem, 2.88rem)' }}>+</span>
            {/* AGENTS Text (SMALLEST) */}
            <span style={{ fontSize: 'clamp(1.5rem, 0.1875vw + 1.44rem, 1.8rem)' }}>AGENTS</span>
          </div>
        </div>

        {/* Container - shifted down to recenter vertically */}
        <div className="relative z-10 w-[clamp(95%,calc(95%+(80%-95%)*((100vw-300px)/1750)),80%)] mx-auto space-y-8 mt-[28vh]">
          {/* Headline Group */}
          <div className="space-y-4 text-center" style={{ perspective: '1000px' }}>
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
                gap: '0.5em',
                lineHeight: '0.67',
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

      {/* CSS Animations - 3D Neon Sign Effect */}
      <style jsx>{`
        /* Flicker effect based on texteffects.dev technique */
        @keyframes neonFlicker1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker2 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker3 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 15px #ffb347,
              0 0 2px #ffd700,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        /* 3D Neon Character Structure */
        .neon-char {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
        }

        /* Metal backing plate - SOLID 3D metal casing with chrome finish */
        .neon-char::before {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #5a5240 0%,
            #4a4238 15%,
            #3a3228 35%,
            #2a2218 50%,
            #3a3228 65%,
            #4a4238 85%,
            #5a5240 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
            1px 1px 0 #2a2a2a,
            2px 2px 0 #1a1a1a,
            3px 3px 0 #0f0f0f,
            4px 4px 0 #0a0a0a,
            5px 5px 0 #050505,
            -1px -1px 0 #4a4a4a,
            -1px 0 0 #3a3a3a,
            0 -1px 0 #3a3a3a,
            6px 6px 12px rgba(0,0,0,0.9),
            8px 8px 20px rgba(0,0,0,0.8),
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.1) brightness(1.05);
          pointer-events: none;
        }

        /* Main letter - dark gray (backlit look) */
        .neon-char {
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }

        /* White neon flicker animations - same as gold but with white color (#e5e4dd) */
        @keyframes neonFlickerWhite1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #e5e4dd;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #e5e4dd,
              0 0 2px #e5e4dd,
              0 0 5px #e5e4dd,
              0 0 15px #dcdbd5,
              0 0 2px #e5e4dd,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlickerWhite2 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #e5e4dd;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #e5e4dd,
              0 0 2px #e5e4dd,
              0 0 5px #e5e4dd,
              0 0 15px #dcdbd5,
              0 0 2px #e5e4dd,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlickerWhite3 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #e5e4dd;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #e5e4dd,
              0 0 2px #e5e4dd,
              0 0 5px #e5e4dd,
              0 0 15px #dcdbd5,
              0 0 2px #e5e4dd,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        /* White 3D Neon Character Structure */
        .neon-char-white {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
        }

        /* Metal backing plate for white neon */
        .neon-char-white::before {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #5a5240 0%,
            #4a4238 15%,
            #3a3228 35%,
            #2a2218 50%,
            #3a3228 65%,
            #4a4238 85%,
            #5a5240 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
            1px 1px 0 #2a2a2a,
            2px 2px 0 #1a1a1a,
            3px 3px 0 #0f0f0f,
            4px 4px 0 #0a0a0a,
            5px 5px 0 #050505,
            -1px -1px 0 #4a4a4a,
            -1px 0 0 #3a3a3a,
            0 -1px 0 #3a3a3a,
            6px 6px 12px rgba(0,0,0,0.9),
            8px 8px 20px rgba(0,0,0,0.8),
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.1) brightness(1.05);
          pointer-events: none;
        }

        /* Main letter for white neon - dark gray (backlit look) */
        .neon-char-white {
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }

        /* Static white neon glow - no animation */
        .neon-text-white-static {
          color: #e5e4dd;
          text-shadow:
            -1px -1px 0 rgba(255,255,255, 0.4),
            1px -1px 0 rgba(255,255,255, 0.4),
            -1px 1px 0 rgba(255,255,255, 0.4),
            1px 1px 0 rgba(255,255,255, 0.4),
            0 -2px 8px #e5e4dd,
            0 0 2px #e5e4dd,
            0 0 5px #e5e4dd,
            0 0 15px #dcdbd5,
            0 0 2px #e5e4dd,
            0 2px 3px #000;
        }

      `}</style>
    </main>
  );
}
