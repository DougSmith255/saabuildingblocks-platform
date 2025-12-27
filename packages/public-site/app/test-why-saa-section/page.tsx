'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D, CTAButton } from '@saa/shared/components/saa';
import { Cloud, Bot, Smartphone, TrendingUp } from 'lucide-react';

/**
 * Test page for two new sections:
 * 1. "Built for Where Real Estate Is Going" - 2 versions (1B, 1E)
 * 2. "Meet the Founders" - 2 versions (2A, 2C)
 */

const BRAND_YELLOW = '#ffd700';

// ============================================================================
// SCROLL REVEAL HOOK
// ============================================================================
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============================================================================
// BUILT FOR THE FUTURE - CONTENT
// ============================================================================
const FUTURE_HEADLINE = "Built for Where Real Estate Is Going";
const FUTURE_SUBLINE = "The future of real estate is cloud-based, global, and technology-driven. SAA is already there.";

const FUTURE_POINTS = [
  { icon: Cloud, text: "Cloud-first brokerage model" },
  { icon: Bot, text: "AI-powered tools and training" },
  { icon: Smartphone, text: "Mobile-first workflows" },
  { icon: TrendingUp, text: "Sustainable income paths beyond transactions" },
];

// ============================================================================
// MEET THE FOUNDERS - CONTENT
// ============================================================================
const FOUNDERS = [
  {
    name: "Doug Smart",
    title: "Co-Founder & Full-Stack Architect",
    bio: "Top 0.1% eXp team builder. Designed and built SAA's core technology—from the agent portal and automation systems to the production and attraction tools that give our agents an unfair advantage.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public",
  },
  {
    name: "Karrie Hill, JD",
    title: "Co-Founder & eXp Certified Mentor",
    bio: "UC Berkeley Law (top 5%). Built a six-figure real estate business without cold calling or door knocking, now helping agents do the same.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public",
  },
];

// ============================================================================
// SECTION 1: BUILT FOR THE FUTURE - VERSION 1B
// ============================================================================

// Version 1B: Horizontal Icons with Animated Line
function Future1B() {
  const { ref, isVisible } = useScrollReveal();

  // Line animation takes 1s with 0.5s delay = completes at 1.5s
  // Each icon should reveal when line reaches it (at 25%, 50%, 75%, 100% of line)
  // Line duration is 1s, so icons reveal at: 0.5s + 0.25s, 0.5s + 0.5s, 0.5s + 0.75s, 0.5s + 1s
  const getIconDelay = (index: number) => 0.5 + (index * 0.25);
  const getTextDelay = (index: number) => 0.5 + (index * 0.25) + 0.15; // Text slightly after icon

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 overflow-hidden">
      <style>{`
        @keyframes drawLine {
          from { width: 0; }
          to { width: 100%; }
        }
        .future1b-line {
          animation: drawLine 1s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
      <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
        <div
          className="transition-all duration-700 mb-5"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <H2>{FUTURE_HEADLINE}</H2>
        </div>
        <p
          className="text-body opacity-70 mb-12 transition-all duration-700"
          style={{
            opacity: isVisible ? 0.7 : 0,
            transitionDelay: '0.15s',
          }}
        >
          {FUTURE_SUBLINE}
        </p>

        <div className="relative mb-12">
          {/* Connecting line */}
          <div className="absolute top-6 left-0 right-0 h-px bg-white/10 hidden md:block">
            {isVisible && (
              <div className="future1b-line h-full w-0" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_YELLOW}, transparent)` }} />
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {FUTURE_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="flex-1 relative z-10 flex flex-col items-center"
                >
                  {/* Icon circle - reveals when line reaches it */}
                  <div
                    className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transition-all duration-500"
                    style={{
                      backgroundColor: '#111',
                      border: `2px solid ${BRAND_YELLOW}`,
                      boxShadow: isVisible ? `0 0 20px rgba(255,215,0,0.3)` : 'none',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                      transitionDelay: `${getIconDelay(i)}s`,
                    }}
                  >
                    <Icon3D><Icon className="w-5 h-5" /></Icon3D>
                  </div>
                  {/* Text - fades in and down after icon reveals */}
                  <p
                    className="text-body text-sm transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                      transitionDelay: `${getTextDelay(i)}s`,
                    }}
                  >
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '1.6s',
          }}
        >
          <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 1E: Rotating Badge/Circle
function Future1E() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <style>{`
        @keyframes rotateBadge {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .future5-rotate {
          animation: rotateBadge 30s linear infinite;
        }
      `}</style>
      <div className="mx-auto text-center" style={{ maxWidth: '600px' }}>
        {/* Rotating outer ring */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div
            className={`absolute inset-0 rounded-full border-2 border-dashed ${isVisible ? 'future5-rotate' : ''}`}
            style={{ borderColor: 'rgba(255,215,0,0.3)' }}
          />
          {/* Icon positions */}
          {FUTURE_POINTS.map((point, i) => {
            const Icon = point.icon;
            const angle = (i * 90) * (Math.PI / 180);
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <div
                key={i}
                className="absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  backgroundColor: '#111',
                  border: `2px solid ${BRAND_YELLOW}`,
                  left: `calc(50% + ${x}px - 24px)`,
                  top: `calc(50% + ${y}px - 24px)`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1)' : 'scale(0)',
                  transitionDelay: `${0.3 + i * 0.15}s`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: BRAND_YELLOW }} />
              </div>
            );
          })}
          {/* Center text */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transitionDelay: '0.8s',
            }}
          >
            <span className="font-heading font-bold text-lg" style={{ color: BRAND_YELLOW }}>SAA</span>
          </div>
        </div>

        <h2
          className="font-heading text-xl md:text-2xl font-bold mb-3 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.2s',
          }}
        >
          {FUTURE_HEADLINE}
        </h2>
        <p
          className="text-body opacity-70 mb-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 0.7 : 0,
            transitionDelay: '0.3s',
          }}
        >
          {FUTURE_SUBLINE}
        </p>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.5s',
          }}
        >
          <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2: MEET THE FOUNDERS - VERSION 2A and 2C
// ============================================================================

// Version 2A: Side-by-Side Cards
function Founders2A() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold text-center mb-10 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Meet the Founders
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {FOUNDERS.map((founder, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 transition-all duration-500 hover:border-yellow-500/50"
              style={{
                backgroundColor: 'rgba(25,25,25,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${0.2 + i * 0.15}s`,
              }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-20 h-20 rounded-xl object-cover"
                  style={{ border: `2px solid ${BRAND_YELLOW}` }}
                />
                <div>
                  <h3 className="font-heading font-bold text-lg" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                  <p className="text-body text-sm opacity-60 mb-2">{founder.title}</p>
                  <p className="text-body text-sm">{founder.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.5s',
          }}
        >
          <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 2C: Horizontal Timeline
function Founders2C() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold mb-12 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
          }}
        >
          Meet the Founders
        </h2>

        <div className="relative mb-10">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent hidden md:block" />

          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
            {FOUNDERS.map((founder, i) => (
              <div
                key={i}
                className="relative transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : `translateY(${i === 0 ? -30 : 30}px)`,
                  transitionDelay: `${0.3 + i * 0.2}s`,
                }}
              >
                {/* Connector dot */}
                <div
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: BRAND_YELLOW,
                    top: i === 0 ? 'auto' : '-32px',
                    bottom: i === 0 ? '-32px' : 'auto',
                    boxShadow: `0 0 15px ${BRAND_YELLOW}`,
                  }}
                />
                <div
                  className="p-5 rounded-xl border text-center"
                  style={{
                    backgroundColor: 'rgba(25,25,25,0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    maxWidth: '280px',
                  }}
                >
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    style={{ border: `3px solid ${BRAND_YELLOW}` }}
                  />
                  <h3 className="font-heading font-bold" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                  <p className="text-body text-xs opacity-60 mb-2">{founder.title}</p>
                  <p className="text-body text-sm">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.7s',
          }}
        >
          <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestSectionsPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center text-xs">
          <span className="opacity-50 mr-2">FUTURE:</span>
          <a href="#f1b" className="hover:underline" style={{ color: BRAND_YELLOW }}>1B</a>
          <a href="#f1e" className="hover:underline" style={{ color: BRAND_YELLOW }}>1E</a>
          <span className="opacity-30 mx-2">|</span>
          <span className="opacity-50 mr-2">FOUNDERS:</span>
          <a href="#m2a" className="hover:underline" style={{ color: BRAND_YELLOW }}>2A</a>
          <a href="#m2c" className="hover:underline" style={{ color: BRAND_YELLOW }}>2C</a>
        </div>
      </div>

      {/* Future Section Versions */}
      <div className="border-b border-white/10">
        <div className="text-center py-4 bg-yellow-500/10">
          <h3 className="font-heading text-lg font-bold" style={{ color: BRAND_YELLOW }}>Section 1: Built for Where Real Estate Is Going</h3>
        </div>
      </div>

      <div id="f1b" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1B: Horizontal Icons with Animated Line</span>
        </div>
        <Future1B />
      </div>

      <div id="f1e" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1E: Rotating Badge Circle</span>
        </div>
        <Future1E />
      </div>

      {/* Founders Section Versions */}
      <div className="border-b border-white/10">
        <div className="text-center py-4 bg-yellow-500/10">
          <h3 className="font-heading text-lg font-bold" style={{ color: BRAND_YELLOW }}>Section 2: Meet the Founders</h3>
        </div>
      </div>

      <div id="m2a" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2A: Side-by-Side Cards</span>
        </div>
        <Founders2A />
      </div>

      <div id="m2c">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2C: Horizontal Timeline</span>
        </div>
        <Founders2C />
      </div>
    </main>
  );
}
