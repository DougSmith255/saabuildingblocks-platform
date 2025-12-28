'use client';

import { useEffect, useRef, useState } from 'react';
import { H2, CTAButton } from '@saa/shared/components/saa';

const BRAND_YELLOW = '#ffd700';

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

export function MeetTheFounders() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 md:py-24 px-6 relative">
      {/* 3D Glass Plate Background */}
      <div
        className="absolute inset-x-0 inset-y-0 pointer-events-none rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.25) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          borderBottom: '2px solid rgba(0,0,0,0.5)',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 8px 32px rgba(0,0,0,0.4),
            0 2px 8px rgba(0,0,0,0.3)
          `,
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Animated shimmer wave */}
        <div
          className="absolute inset-0 founders-glass-shimmer"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.01) 20%, rgba(255,255,255,0.025) 35%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.025) 65%, rgba(255,255,255,0.01) 80%, transparent 100%)',
            backgroundSize: '300% 100%',
          }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      <style>{`
        @keyframes foundersGlassShimmer {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        .founders-glass-shimmer {
          animation: foundersGlassShimmer 20s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto text-center relative z-10" style={{ maxWidth: '1100px' }}>
        <div
          className="transition-all duration-700 mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <H2>Meet the Founders</H2>
        </div>

        <div className="relative mb-12">
          {/* Center connecting line */}
          <div
            className="absolute top-1/2 left-[10%] right-[10%] h-[2px] hidden md:block"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${BRAND_YELLOW}40 20%, ${BRAND_YELLOW}40 80%, transparent 100%)`,
            }}
          />

          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
            {FOUNDERS.map((founder, i) => (
              <div
                key={i}
                className="relative transition-all duration-700 flex-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : `translateY(${i === 0 ? -30 : 30}px)`,
                  transitionDelay: `${0.3 + i * 0.2}s`,
                  maxWidth: '420px',
                }}
              >
                {/* Connector dot on the line */}
                <div
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                  style={{
                    backgroundColor: BRAND_YELLOW,
                    top: i === 0 ? 'auto' : '-28px',
                    bottom: i === 0 ? '-28px' : 'auto',
                    boxShadow: `0 0 20px ${BRAND_YELLOW}`,
                  }}
                />
                <div
                  className="p-6 md:p-8 rounded-2xl border text-center hover:border-yellow-500/30 transition-colors duration-300"
                  style={{
                    backgroundColor: 'rgba(20,20,20,0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-4"
                    style={{ border: `3px solid ${BRAND_YELLOW}`, boxShadow: `0 0 25px rgba(255,215,0,0.3)` }}
                  />
                  <h3 className="font-heading font-bold text-lg md:text-xl mb-1" style={{ color: BRAND_YELLOW }}>{founder.name}</h3>
                  <p className="text-body text-sm opacity-60 mb-3">{founder.title}</p>
                  <p className="text-body text-sm md:text-base leading-relaxed">{founder.bio}</p>
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

export default MeetTheFounders;
