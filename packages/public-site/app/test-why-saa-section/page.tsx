'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';
import { CyberCard, CyberCardGold } from '@saa/shared/components/saa/cards';
import { Users, DollarSign, Bot, GraduationCap, Globe, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Test page for "What You Get with Smart Agent Alliance" section designs
 * 5 alternative versions using animation and interactive techniques to minimize vertical space
 */

const BRAND_YELLOW = '#ffd700';
const HEADLINE = "What You Get with Smart Agent Alliance";
const SUBHEADLINE = "At a Glance";
const CTA_TEXT = "See the Full Value Stack";
const CTA_HREF = "/exp-realty-sponsor";

const BENEFITS = [
  {
    icon: Users,
    title: "Connected Leadership",
    description: "Direct access to Doug and Karrie Hopkins — the founders who built this from the ground up and stay actively engaged with every agent.",
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    description: "Revenue share, stock awards, and equity-building systems that create real wealth beyond your commissions.",
  },
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    description: "AI tools, automation, and lead generation built for you — no setup required, just plug in and produce.",
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    description: "World-class education on demand — from negotiation mastery to market analysis, available whenever you need it.",
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    description: "Network of 3,700+ agents sharing deals, insights, and opportunities across 5 countries and growing.",
  },
];

// ============================================================================
// SCROLL REVEAL HOOK
// ============================================================================
function useScrollReveal(threshold = 0.1) {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// VERSION 1: ACCORDION (Click to expand)
// ============================================================================
function Version1() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">{SUBHEADLINE}</p>
        </div>

        <div className="space-y-3 mb-10">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden border transition-all duration-300"
                style={{
                  backgroundColor: isOpen ? 'rgba(40, 35, 10, 0.95)' : 'rgba(25, 25, 25, 0.95)',
                  borderColor: isOpen ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255,255,255,0.1)',
                  boxShadow: isOpen ? '0 8px 32px rgba(255, 215, 0, 0.1)' : 'none',
                }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isOpen ? BRAND_YELLOW : 'rgba(255, 215, 0, 0.15)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: isOpen ? '#111' : BRAND_YELLOW }} />
                    </div>
                    <span
                      className="font-heading font-bold text-lg"
                      style={{ color: isOpen ? BRAND_YELLOW : 'inherit' }}
                    >
                      {benefit.title}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-5 h-5 transition-transform duration-300 flex-shrink-0"
                    style={{
                      color: BRAND_YELLOW,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? '200px' : '0',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="text-body px-5 pb-5 pl-[74px]">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <CTAButton href={CTA_HREF}>{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: TABS (Horizontal navigation with auto-rotation)
// ============================================================================

// V2-specific content with updated descriptions
const V2_BENEFITS = [
  {
    icon: Users,
    title: "Connected Leadership",
    tabLabel: "Connected",
    description: "Big enough to back you. Small enough to know you. Real access, real wins, real support.",
    autoAdvanceTime: 6000, // 6 seconds (longer text)
  },
  {
    icon: DollarSign,
    title: "Passive Income Infrastructure",
    tabLabel: "Passive",
    description: "We handle the structure so you can build long-term income without relying solely on transactions.",
    autoAdvanceTime: 5000, // 5 seconds
  },
  {
    icon: Bot,
    title: "Done-For-You Production Systems",
    tabLabel: "Done-For-You",
    description: "Curated systems designed to save time, not create tech overload.",
    autoAdvanceTime: 4000, // 4 seconds (short text)
  },
  {
    icon: GraduationCap,
    title: "Elite Training Libraries",
    tabLabel: "Elite",
    description: "AI, social media, investing, and modern production systems, available when you need them.",
    autoAdvanceTime: 5000, // 5 seconds
  },
  {
    icon: Globe,
    title: "Private Referrals & Global Collaboration",
    tabLabel: "Private",
    description: "Warm introductions and deal flow inside a global agent network.",
    autoAdvanceTime: 4000, // 4 seconds (short text)
  },
];

function Version2() {
  const [activeTab, setActiveTab] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal(0.3);

  const activeBenefit = V2_BENEFITS[activeTab];
  const Icon = activeBenefit.icon;

  // Auto-advance tabs with variable timing
  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveTab(prev => (prev + 1) % V2_BENEFITS.length);
    }, V2_BENEFITS[activeTab].autoAdvanceTime);
  };

  useEffect(() => {
    if (isVisible) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTab, isVisible]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // Timer will restart via the useEffect when activeTab changes
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        {/* Header with reveal animation */}
        <div
          className="text-center mb-10 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <H2>What You Get with SAA (At a Glance)</H2>
          <p className="text-body opacity-60 mt-2">Everything below is explained in detail on our Team Value page.</p>
        </div>

        {/* Tab buttons with staggered reveal */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.15s',
          }}
        >
          {V2_BENEFITS.map((benefit, i) => {
            const TabIcon = benefit.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => handleTabClick(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: isActive ? BRAND_YELLOW : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#111' : 'rgba(255,255,255,0.7)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <TabIcon className="w-4 h-4" />
                <span className="font-heading font-medium text-sm">{benefit.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active content card with reveal animation */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.3s',
          }}
        >
          <CyberCard padding="xl" className="mb-10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}
              >
                <Icon className="w-10 h-10" style={{ color: BRAND_YELLOW }} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: BRAND_YELLOW }}>
                  {activeBenefit.title}
                </h3>
                <p className="text-body text-lg">{activeBenefit.description}</p>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Progress indicators with reveal */}
        <div
          className="flex justify-center gap-2 mb-8 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: '0.45s',
          }}
        >
          {V2_BENEFITS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeTab ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                transform: i === activeTab ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* CTA with reveal */}
        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.6s',
          }}
        >
          <CTAButton href={CTA_HREF}>{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 3: CAROUSEL (Swipe/click navigation)
// ============================================================================
function Version3() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prev = () => goTo((currentIndex - 1 + BENEFITS.length) % BENEFITS.length);
  const next = () => goTo((currentIndex + 1) % BENEFITS.length);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">{SUBHEADLINE}</p>
        </div>

        {/* Carousel container */}
        <div className="relative mb-10">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', border: `1px solid ${BRAND_YELLOW}` }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: BRAND_YELLOW }} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)', border: `1px solid ${BRAND_YELLOW}` }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: BRAND_YELLOW }} />
          </button>

          {/* Cards stack */}
          <div className="relative h-[280px] md:h-[220px] mx-8">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              const offset = i - currentIndex;
              const isActive = i === currentIndex;

              // Wrap around logic
              let displayOffset = offset;
              if (offset > 2) displayOffset = offset - BENEFITS.length;
              if (offset < -2) displayOffset = offset + BENEFITS.length;

              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-2xl border p-6 transition-all duration-400 ease-out"
                  style={{
                    backgroundColor: isActive ? 'rgba(40, 35, 10, 0.98)' : 'rgba(25, 25, 25, 0.95)',
                    borderColor: isActive ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.1)',
                    transform: `translateX(${displayOffset * 30}px) scale(${1 - Math.abs(displayOffset) * 0.08})`,
                    opacity: Math.abs(displayOffset) > 1 ? 0 : 1 - Math.abs(displayOffset) * 0.4,
                    zIndex: 10 - Math.abs(displayOffset),
                    pointerEvents: isActive ? 'auto' : 'none',
                    boxShadow: isActive ? '0 10px 40px rgba(255, 215, 0, 0.15)' : 'none',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-5 h-full">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: BRAND_YELLOW }}
                    >
                      <Icon className="w-8 h-8" style={{ color: '#111' }} />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3 className="font-heading text-xl md:text-2xl font-bold mb-2" style={{ color: BRAND_YELLOW }}>
                        {benefit.title}
                      </h3>
                      <p className="text-body">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-6">
            {BENEFITS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === currentIndex ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                  transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <CTAButton href={CTA_HREF}>{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: FLIP CARDS (Hover/tap to reveal description)
// ============================================================================
function Version4() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">Click cards to reveal details</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            const isFlipped = flippedIndex === i;

            return (
              <div
                key={i}
                className="cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => setFlippedIndex(isFlipped ? null : i)}
              >
                <div
                  className="relative w-full h-[180px] md:h-[200px] transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-xl border p-4 flex flex-col items-center justify-center text-center"
                    style={{
                      backgroundColor: 'rgba(25, 25, 25, 0.95)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                      style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}
                    >
                      <Icon className="w-7 h-7" style={{ color: BRAND_YELLOW }} />
                    </div>
                    <h3 className="font-heading text-sm font-bold" style={{ color: BRAND_YELLOW }}>
                      {benefit.title}
                    </h3>
                    <p className="text-body text-xs opacity-50 mt-2">Tap to learn more</p>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-xl border p-4 flex flex-col justify-center"
                    style={{
                      backgroundColor: 'rgba(40, 35, 10, 0.98)',
                      borderColor: 'rgba(255, 215, 0, 0.4)',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Icon className="w-6 h-6 mb-2" style={{ color: BRAND_YELLOW }} />
                    <p className="text-body text-xs leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <CTAButton href={CTA_HREF}>{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 5: HORIZONTAL SCROLL CARDS (Compact, mobile-friendly)
// ============================================================================
function Version5() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">{SUBHEADLINE}</p>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory mb-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={i}
                className="flex-shrink-0 snap-center cursor-pointer transition-all duration-300"
                style={{
                  width: isExpanded ? '340px' : '200px',
                }}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                <div
                  className="h-[200px] rounded-xl border p-5 transition-all duration-300"
                  style={{
                    backgroundColor: isExpanded ? 'rgba(40, 35, 10, 0.98)' : 'rgba(25, 25, 25, 0.95)',
                    borderColor: isExpanded ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.1)',
                    boxShadow: isExpanded ? '0 8px 32px rgba(255, 215, 0, 0.15)' : 'none',
                  }}
                >
                  <div className="flex items-start gap-4 h-full">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isExpanded ? BRAND_YELLOW : 'rgba(255, 215, 0, 0.15)' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: isExpanded ? '#111' : BRAND_YELLOW }} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3
                        className="font-heading font-bold text-base mb-2"
                        style={{ color: BRAND_YELLOW }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className="text-body text-sm transition-opacity duration-300"
                        style={{
                          opacity: isExpanded ? 1 : 0.5,
                          display: isExpanded ? 'block' : '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {isExpanded ? benefit.description : 'Click to expand...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mb-8 md:hidden">
          {BENEFITS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
            />
          ))}
        </div>

        <div className="text-center">
          <CTAButton href={CTA_HREF}>{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestWhySAASectionPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <a href="#v1" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V1: Accordion</a>
          <a href="#v2" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V2: Tabs</a>
          <a href="#v3" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V3: Carousel</a>
          <a href="#v4" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V4: Flip Cards</a>
          <a href="#v5" className="hover:underline font-medium" style={{ color: BRAND_YELLOW }}>V5: Scroll Cards</a>
        </div>
      </div>

      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V1: Accordion</h3>
          <p className="text-body text-sm opacity-50">Click to expand - minimal vertical space, all content accessible</p>
        </div>
        <Version1 />
      </div>

      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V2: Tabs</h3>
          <p className="text-body text-sm opacity-50">Horizontal navigation with featured content card</p>
        </div>
        <Version2 />
      </div>

      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V3: Carousel</h3>
          <p className="text-body text-sm opacity-50">Stacked cards with arrow navigation</p>
        </div>
        <Version3 />
      </div>

      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V4: Flip Cards</h3>
          <p className="text-body text-sm opacity-50">Click to flip and reveal description</p>
        </div>
        <Version4 />
      </div>

      <div id="v5">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V5: Horizontal Scroll Cards</h3>
          <p className="text-body text-sm opacity-50">Mobile-friendly with expand on click</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
