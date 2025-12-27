'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, Icon3D, CTAButton } from '@saa/shared/components/saa';
import { Cloud, Bot, Smartphone, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

/**
 * Test page for two new sections:
 * 1. "Built for Where Real Estate Is Going" - 5 versions
 * 2. "Meet the Founders" - 5 versions
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
    bio: "Designs the systems, automation, and infrastructure that power the agent experience.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-smart-headshot/public",
  },
  {
    name: "Karrie Hill",
    title: "Co-Founder & eXp Certified Mentor",
    bio: "UC Berkeley Law (top 5%). Built a six-figure real estate business without cold calling or door knocking, now helping agents do the same.",
    image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/karrie-hill-headshot/public",
  },
];

// ============================================================================
// SECTION 1: BUILT FOR THE FUTURE - 5 VERSIONS
// ============================================================================

// Version 1A: Minimal Stagger Grid
function Future1() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: '800px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold mb-4 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {FUTURE_HEADLINE}
        </h2>
        <p
          className="text-body opacity-70 mb-10 transition-all duration-700"
          style={{
            opacity: isVisible ? 0.7 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.1s',
          }}
        >
          {FUTURE_SUBLINE}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {FUTURE_POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transitionDelay: `${0.2 + i * 0.1}s`,
                }}
              >
                <Icon3D><Icon className="w-8 h-8 mx-auto mb-3" /></Icon3D>
                <p className="text-body text-sm">{point.text}</p>
              </div>
            );
          })}
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.6s',
          }}
        >
          <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 1B: Horizontal Icons with Animated Line
function Future2() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 overflow-hidden">
      <style>{`
        @keyframes drawLine {
          from { width: 0; }
          to { width: 100%; }
        }
        .future2-line {
          animation: drawLine 1s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
      <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold mb-4 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {FUTURE_HEADLINE}
        </h2>
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
              <div className="future2-line h-full w-0" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_YELLOW}, transparent)` }} />
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4">
            {FUTURE_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="flex-1 relative z-10 transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${0.3 + i * 0.15}s`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: '#111',
                      border: `2px solid ${BRAND_YELLOW}`,
                      boxShadow: `0 0 20px rgba(255,215,0,0.3)`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: BRAND_YELLOW }} />
                  </div>
                  <p className="text-body text-sm">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.9s',
          }}
        >
          <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 1C: Floating Card with Glow
function Future3() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <style>{`
        @keyframes floatGlow {
          0%, 100% { box-shadow: 0 10px 40px rgba(255,215,0,0.15); }
          50% { box-shadow: 0 20px 60px rgba(255,215,0,0.25); }
        }
        .future3-float {
          animation: floatGlow 3s ease-in-out infinite;
        }
      `}</style>
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <div
          className={`future3-float rounded-2xl border p-8 md:p-10 transition-all duration-700 ${isVisible ? 'future3-float' : ''}`}
          style={{
            backgroundColor: 'rgba(25,20,10,0.95)',
            borderColor: 'rgba(255,215,0,0.3)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" style={{ color: BRAND_YELLOW }} />
            <span className="text-body text-sm uppercase tracking-wider opacity-60">The Future Is Now</span>
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
            {FUTURE_HEADLINE}
          </h2>
          <p className="text-body opacity-70 mb-6">{FUTURE_SUBLINE}</p>

          <ul className="space-y-3 mb-8">
            {FUTURE_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 transition-all duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: `${0.3 + i * 0.1}s`,
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: BRAND_YELLOW }} />
                  <span className="text-body">{point.text}</span>
                </li>
              );
            })}
          </ul>

          <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 1D: Split Screen with Parallax Effect
function Future4() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left - Text */}
          <div
            className="flex-1 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>
              {FUTURE_HEADLINE}
            </h2>
            <p className="text-body opacity-70 mb-6">{FUTURE_SUBLINE}</p>
            <CTAButton href="/about-exp-realty">Learn About eXp Realty</CTAButton>
          </div>

          {/* Right - Feature list */}
          <div
            className="flex-1 space-y-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
              transitionDelay: '0.2s',
            }}
          >
            {FUTURE_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-500 hover:translate-x-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transitionDelay: `${0.3 + i * 0.1}s`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}>
                    <Icon3D><Icon className="w-5 h-5" /></Icon3D>
                  </div>
                  <span className="text-body flex-1">{point.text}</span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Version 1E: Rotating Badge/Circle
function Future5() {
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
// SECTION 2: MEET THE FOUNDERS - 5 VERSIONS
// ============================================================================

// Version 2A: Side-by-Side Cards
function Founders1() {
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

// Version 2B: Overlapping Cards
function Founders2() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto text-center" style={{ maxWidth: '800px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold mb-12 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          Meet the Founders
        </h2>

        <div className="relative h-[350px] md:h-[280px] mb-10">
          {FOUNDERS.map((founder, i) => (
            <div
              key={i}
              className="absolute w-[85%] md:w-[55%] rounded-2xl border p-5 transition-all duration-700 hover:z-20"
              style={{
                backgroundColor: i === 0 ? 'rgba(40,35,10,0.98)' : 'rgba(25,25,25,0.98)',
                borderColor: i === 0 ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)',
                left: i === 0 ? '0' : 'auto',
                right: i === 1 ? '0' : 'auto',
                top: i === 0 ? '0' : '40px',
                zIndex: i === 0 ? 10 : 5,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) rotate(0deg)' : `translateY(40px) rotate(${i === 0 ? -5 : 5}deg)`,
                transitionDelay: `${0.2 + i * 0.2}s`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-16 h-16 rounded-full object-cover mb-3"
                  style={{ border: `3px solid ${BRAND_YELLOW}` }}
                />
                <h3 className="font-heading font-bold" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                <p className="text-body text-xs opacity-60 mb-2">{founder.title}</p>
                <p className="text-body text-sm">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.6s',
          }}
        >
          <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 2C: Horizontal Timeline
function Founders3() {
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

// Version 2D: Minimal Photo Focus
function Founders4() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <h2
          className="font-heading text-2xl md:text-3xl font-bold text-center mb-10 transition-all duration-700"
          style={{
            color: BRAND_YELLOW,
            opacity: isVisible ? 1 : 0,
          }}
        >
          Meet the Founders
        </h2>

        <div className="space-y-8 mb-10">
          {FOUNDERS.map((founder, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-6 transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : `translateX(${i === 0 ? -40 : 40}px)`,
                transitionDelay: `${0.2 + i * 0.2}s`,
                flexDirection: i % 2 === 1 ? 'row-reverse' : 'row',
              }}
            >
              <img
                src={founder.image}
                alt={founder.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover flex-shrink-0"
                style={{
                  boxShadow: `0 10px 40px rgba(255,215,0,0.2)`,
                  border: `3px solid rgba(255,215,0,0.3)`,
                }}
              />
              <div className={`text-center ${i % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="font-heading text-xl font-bold" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                <p className="text-body text-sm opacity-60 mb-2">{founder.title}</p>
                <p className="text-body">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.6s',
          }}
        >
          <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
        </div>
      </div>
    </section>
  );
}

// Version 2E: Compact Banner Style
function Founders5() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6">
      <div
        className="mx-auto rounded-2xl border overflow-hidden transition-all duration-700"
        style={{
          maxWidth: '900px',
          backgroundColor: 'rgba(25,20,10,0.95)',
          borderColor: 'rgba(255,215,0,0.2)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
        }}
      >
        <div className="p-6 md:p-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-center mb-6" style={{ color: BRAND_YELLOW }}>
            Meet the Founders
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {FOUNDERS.map((founder, i) => (
              <div
                key={i}
                className="flex-1 flex items-center gap-4 p-4 rounded-xl transition-all duration-500"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : `translateX(${i === 0 ? -20 : 20}px)`,
                  transitionDelay: `${0.3 + i * 0.15}s`,
                }}
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  style={{ border: `2px solid ${BRAND_YELLOW}` }}
                />
                <div>
                  <h3 className="font-heading font-bold text-sm" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                  <p className="text-body text-xs opacity-70">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <CTAButton href="/our-exp-team">Meet the Full Team</CTAButton>
          </div>
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
          <a href="#f1" className="hover:underline" style={{ color: BRAND_YELLOW }}>1A</a>
          <a href="#f2" className="hover:underline" style={{ color: BRAND_YELLOW }}>1B</a>
          <a href="#f3" className="hover:underline" style={{ color: BRAND_YELLOW }}>1C</a>
          <a href="#f4" className="hover:underline" style={{ color: BRAND_YELLOW }}>1D</a>
          <a href="#f5" className="hover:underline" style={{ color: BRAND_YELLOW }}>1E</a>
          <span className="opacity-30 mx-2">|</span>
          <span className="opacity-50 mr-2">FOUNDERS:</span>
          <a href="#m1" className="hover:underline" style={{ color: BRAND_YELLOW }}>2A</a>
          <a href="#m2" className="hover:underline" style={{ color: BRAND_YELLOW }}>2B</a>
          <a href="#m3" className="hover:underline" style={{ color: BRAND_YELLOW }}>2C</a>
          <a href="#m4" className="hover:underline" style={{ color: BRAND_YELLOW }}>2D</a>
          <a href="#m5" className="hover:underline" style={{ color: BRAND_YELLOW }}>2E</a>
        </div>
      </div>

      {/* Future Section Versions */}
      <div className="border-b border-white/10">
        <div className="text-center py-4 bg-yellow-500/10">
          <h3 className="font-heading text-lg font-bold" style={{ color: BRAND_YELLOW }}>Section 1: Built for Where Real Estate Is Going</h3>
        </div>
      </div>

      <div id="f1" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1A: Minimal Stagger Grid</span>
        </div>
        <Future1 />
      </div>

      <div id="f2" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1B: Horizontal Icons with Animated Line</span>
        </div>
        <Future2 />
      </div>

      <div id="f3" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1C: Floating Card with Glow</span>
        </div>
        <Future3 />
      </div>

      <div id="f4" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1D: Split Screen Layout</span>
        </div>
        <Future4 />
      </div>

      <div id="f5" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">1E: Rotating Badge Circle</span>
        </div>
        <Future5 />
      </div>

      {/* Founders Section Versions */}
      <div className="border-b border-white/10">
        <div className="text-center py-4 bg-yellow-500/10">
          <h3 className="font-heading text-lg font-bold" style={{ color: BRAND_YELLOW }}>Section 2: Meet the Founders</h3>
        </div>
      </div>

      <div id="m1" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2A: Side-by-Side Cards</span>
        </div>
        <Founders1 />
      </div>

      <div id="m2" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2B: Overlapping Cards</span>
        </div>
        <Founders2 />
      </div>

      <div id="m3" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2C: Horizontal Timeline</span>
        </div>
        <Founders3 />
      </div>

      <div id="m4" className="border-b border-white/10">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2D: Minimal Photo Focus</span>
        </div>
        <Founders4 />
      </div>

      <div id="m5">
        <div className="text-center py-3 bg-white/5">
          <span className="text-body text-sm opacity-70">2E: Compact Banner Style</span>
        </div>
        <Founders5 />
      </div>
    </main>
  );
}
