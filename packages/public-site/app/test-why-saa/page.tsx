'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa';
import { CTAButton } from '@saa/shared/components/saa';

/**
 * Test page for "Why This Only Works at eXp Realty" section
 * 5 CREATIVE versions with unique animations
 */

// Shared content
const HEADLINE = "Why This Only Works at eXp Realty";
const STEPS = [
  { num: 1, label: "Traditional", title: "Centralized Support", desc: "Most brokerages provide tools, training, and support centrally.", dim: true },
  { num: 2, label: "Limited Sponsors", title: "Restricted Offerings", desc: "Sponsors can only offer what the brokerage provides.", dim: true },
  { num: 3, label: "eXp Model", title: "Entrepreneurial Freedom", desc: "eXp allows sponsors to build and deliver their own systems.", highlight: true },
  { num: 4, label: "SAA Choice", title: "We Invested In You", desc: "Smart Agent Alliance chose to build real infrastructure.", highlight: true },
];
const DIFFERENTIATOR = "eXp Realty is different.";
const KEY_POINT = "eXp is the only brokerage that allows sponsors to operate entrepreneurially — to build, fund, and deliver additional systems directly to agents.";
const TAGLINE = "When you succeed, we succeed.";
const CTA_TEXT = "See Our Systems";

// Brand colors
const BRAND_YELLOW = '#ffd700';

// Images
const DOUG_KARRIE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop';

// 3D Number Component
function Number3D({ num }: { num: number }) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-[36px] h-[36px] text-xl font-bold"
      style={{
        color: '#c4a94d',
        filter: 'drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(2px 2px 0 #2a2a1d)',
        transform: 'perspective(500px) rotateX(8deg)',
      }}
    >
      {num}
    </span>
  );
}

// ============================================================================
// VERSION 1: DECK STACK SCROLL
// Cards stacked that fan out/reveal as user scrolls - compact, interactive
// ============================================================================
function Version1() {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight / 2 - rect.top) / (rect.height / 2)));
      const newActive = Math.min(3, Math.floor(scrollProgress * 4));
      setActiveCard(newActive);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Deck of cards */}
          <div ref={containerRef} className="relative h-[320px] perspective-1000">
            {STEPS.map((step, i) => {
              const isActive = i <= activeCard;
              const offset = isActive ? (activeCard - i) * 8 : (3 - i) * 8;
              const rotation = isActive ? (activeCard - i) * -3 : 0;
              const scale = isActive ? 1 - (activeCard - i) * 0.03 : 0.85;
              const opacity = isActive ? 1 - (activeCard - i) * 0.15 : 0.3;

              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-2xl p-6 border-2 cursor-pointer transition-all duration-500"
                  style={{
                    backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.15)' : 'rgba(30, 30, 30, 0.95)',
                    borderColor: step.highlight ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255,255,255,0.1)',
                    transform: `translateY(${offset}px) rotate(${rotation}deg) scale(${scale})`,
                    opacity,
                    zIndex: isActive ? 10 - (activeCard - i) : i,
                  }}
                  onClick={() => setActiveCard(i)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {step.highlight ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                        <span className="text-lg font-bold" style={{ color: '#111' }}>{step.num}</span>
                      </div>
                    ) : (
                      <Number3D num={step.num} />
                    )}
                    <div>
                      <p className="text-body text-xs uppercase tracking-wider opacity-50">{step.label}</p>
                      <p className="text-body font-semibold" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
                    </div>
                  </div>
                  <p className="text-body text-sm opacity-80">{step.desc}</p>
                </div>
              );
            })}

            {/* Progress dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: i <= activeCard ? BRAND_YELLOW : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>

          {/* Key message */}
          <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-6 md:p-8">
            <p className="text-body text-2xl font-semibold mb-4" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            <p className="text-body leading-relaxed mb-4">{KEY_POINT}</p>
            <p className="text-body text-lg italic mb-6" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 2: HORIZONTAL SCROLL CAROUSEL
// Swipeable horizontal cards - space efficient, mobile-friendly
// ============================================================================
function Version2() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
    scrollRef.current?.addEventListener('scroll', checkScroll);
    return () => scrollRef.current?.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-8">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">Swipe to explore the journey</p>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-black transition-colors"
            >
              <span style={{ color: BRAND_YELLOW }}>←</span>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center hover:bg-black transition-colors"
            >
              <span style={{ color: BRAND_YELLOW }}>→</span>
            </button>
          )}

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] snap-center rounded-2xl p-5 border-2 transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.05)',
                  borderColor: step.highlight ? 'rgba(255, 215, 0, 0.35)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {step.highlight ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                      <span className="text-lg font-bold" style={{ color: '#111' }}>{step.num}</span>
                    </div>
                  ) : (
                    <Number3D num={step.num} />
                  )}
                  <p className="text-body text-xs uppercase tracking-wider opacity-50">{step.label}</p>
                </div>
                <p className="text-body font-semibold mb-2" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
                <p className="text-body text-sm opacity-70">{step.desc}</p>
              </div>
            ))}

            {/* Final CTA card */}
            <div
              className="flex-shrink-0 w-[280px] snap-center rounded-2xl p-5 border-2 flex flex-col justify-center"
              style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.4)' }}
            >
              <p className="text-body text-lg italic mb-4" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 3: FLIP CARDS
// Cards flip on hover/click to reveal more detail - interactive, compact
// ============================================================================
function Version3() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
          <p className="text-body opacity-60 mt-2">Click cards to flip</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="relative h-[200px] cursor-pointer group"
              style={{ perspective: '1000px' }}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <div
                className="absolute inset-0 transition-transform duration-500 preserve-3d"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl p-4 border-2 flex flex-col items-center justify-center text-center backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.05)',
                    borderColor: step.highlight ? 'rgba(255, 215, 0, 0.35)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {step.highlight ? (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: BRAND_YELLOW }}>
                      <span className="text-xl font-bold" style={{ color: '#111' }}>{step.num}</span>
                    </div>
                  ) : (
                    <div className="mb-3"><Number3D num={step.num} /></div>
                  )}
                  <p className="text-body text-xs uppercase tracking-wider opacity-50 mb-1">{step.label}</p>
                  <p className="text-body font-semibold text-sm" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
                  <p className="text-body text-xs opacity-50 mt-2">Tap to learn more</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl p-4 border-2 flex flex-col justify-center backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.08)',
                    borderColor: step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.2)',
                  }}
                >
                  <p className="text-body text-sm leading-relaxed">{step.desc}</p>
                  {step.highlight && (
                    <p className="text-body text-xs mt-3 italic" style={{ color: BRAND_YELLOW }}>This is the SAA difference</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-body text-xl font-semibold" style={{ color: BRAND_YELLOW }}>{DIFFERENTIATOR}</p>
            <p className="text-body text-lg italic opacity-80">{TAGLINE}</p>
          </div>
          <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 4: ACCORDION REVEAL
// Expandable sections - super compact, progressive disclosure
// ============================================================================
function Version4() {
  const [expanded, setExpanded] = useState<number>(2); // Start with eXp expanded

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-10">
          <H2>{HEADLINE}</H2>
        </div>

        <div className="space-y-2">
          {STEPS.map((step, i) => {
            const isExpanded = expanded === i;
            return (
              <div
                key={i}
                className="rounded-xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255,255,255,0.03)',
                  borderColor: isExpanded
                    ? (step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.3)')
                    : (step.highlight ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.08)'),
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? -1 : i)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    {step.highlight ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                        <span className="text-sm font-bold" style={{ color: '#111' }}>{step.num}</span>
                      </div>
                    ) : (
                      <Number3D num={step.num} />
                    )}
                    <div>
                      <p className="text-body text-xs uppercase tracking-wider opacity-50">{step.label}</p>
                      <p className="text-body font-semibold" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
                    </div>
                  </div>
                  <span
                    className="text-2xl transition-transform duration-300"
                    style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)', color: step.highlight ? BRAND_YELLOW : 'inherit' }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isExpanded ? '200px' : '0px' }}
                >
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-body opacity-80 pl-12">{step.desc}</p>
                    {step.highlight && i === 3 && (
                      <div className="mt-4 pl-12">
                        <p className="text-body italic mb-3" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
                        <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VERSION 5: TABBED INTERFACE WITH PROGRESS
// Tabs to switch views + progress indicator - modern, compact
// ============================================================================
function Version5() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsAnimating(false);
    }, 150);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const step = STEPS[activeTab];

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="text-center mb-8">
          <H2>{HEADLINE}</H2>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(i)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === i
                  ? (s.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.2)')
                  : 'rgba(255,255,255,0.05)',
                color: activeTab === i && s.highlight ? '#111' : 'inherit',
                border: activeTab === i ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((activeTab + 1) / 4) * 100}%`,
              backgroundColor: step.highlight ? BRAND_YELLOW : 'rgba(255,255,255,0.4)',
            }}
          />
        </div>

        {/* Content card */}
        <div className="grid md:grid-cols-5 gap-6">
          <div
            className={`md:col-span-3 rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{
              backgroundColor: step.highlight ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.05)',
              borderColor: step.highlight ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              {step.highlight ? (
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND_YELLOW }}>
                  <span className="text-xl font-bold" style={{ color: '#111' }}>{step.num}</span>
                </div>
              ) : (
                <Number3D num={step.num} />
              )}
              <div>
                <p className="text-body text-xs uppercase tracking-wider opacity-50">{step.label}</p>
                <p className="text-body text-xl font-semibold" style={step.highlight ? { color: BRAND_YELLOW } : undefined}>{step.title}</p>
              </div>
            </div>
            <p className="text-body text-lg leading-relaxed">{step.desc}</p>
            {step.highlight && activeTab === 3 && (
              <p className="text-body text-lg italic mt-4" style={{ color: BRAND_YELLOW }}>{TAGLINE}</p>
            )}
          </div>

          {/* Side panel with image/CTA */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-1 min-h-[150px]">
              <img
                src={DOUG_KARRIE_IMAGE}
                alt="Doug and Karrie"
                className="w-full h-full object-cover object-top"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-body text-sm font-medium" style={{ color: BRAND_YELLOW }}>Built by agents</p>
              </div>
            </div>
            <div className="rounded-2xl border p-4 text-center" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}>
              <CTAButton href="/exp-realty-sponsor">{CTA_TEXT}</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function TestWhySAAPage() {
  return (
    <main className="min-h-screen bg-[#111111]">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <a href="#v1" className="hover:underline" style={{ color: BRAND_YELLOW }}>V1: Deck Stack</a>
          <a href="#v2" className="hover:underline" style={{ color: BRAND_YELLOW }}>V2: Carousel</a>
          <a href="#v3" className="hover:underline" style={{ color: BRAND_YELLOW }}>V3: Flip Cards</a>
          <a href="#v4" className="hover:underline" style={{ color: BRAND_YELLOW }}>V4: Accordion</a>
          <a href="#v5" className="hover:underline" style={{ color: BRAND_YELLOW }}>V5: Tabs + Progress</a>
        </div>
      </div>

      {/* V1 */}
      <div id="v1" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V1: Deck Stack Scroll</h3>
          <p className="text-body text-sm opacity-50">Click cards or scroll to fan through the deck</p>
        </div>
        <Version1 />
      </div>

      {/* V2 */}
      <div id="v2" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V2: Horizontal Carousel</h3>
          <p className="text-body text-sm opacity-50">Swipe or use arrows to navigate</p>
        </div>
        <Version2 />
      </div>

      {/* V3 */}
      <div id="v3" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V3: Flip Cards</h3>
          <p className="text-body text-sm opacity-50">Click cards to flip and reveal details</p>
        </div>
        <Version3 />
      </div>

      {/* V4 */}
      <div id="v4" className="border-b border-white/10">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V4: Accordion</h3>
          <p className="text-body text-sm opacity-50">Click to expand sections</p>
        </div>
        <Version4 />
      </div>

      {/* V5 */}
      <div id="v5">
        <div className="text-center py-6 bg-white/5">
          <h3 className="text-body text-lg font-medium">V5: Tabs + Progress</h3>
          <p className="text-body text-sm opacity-50">Click tabs or watch auto-advance</p>
        </div>
        <Version5 />
      </div>
    </main>
  );
}
