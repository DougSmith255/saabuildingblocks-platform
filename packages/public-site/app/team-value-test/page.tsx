'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { H1, H2, Tagline, CTAButton, SecondaryButton, GenericCard, CyberCard, CyberCardGold, NeonGoldText, FAQ } from '@saa/shared/components/saa';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';
import { LazySection } from '@/components/shared/LazySection';
import Link from 'next/link';
import { CheckCircle, Users, Zap, BookOpen, Video, Target, MessageCircle, Award, Globe, DollarSign } from 'lucide-react';

/**
 * Team Value Page - Test Versions
 * URL: /team-value-test?v=1 through ?v=5
 */

// ============================================================================
// SHARED DATA
// ============================================================================

const faqItems = [
  {
    question: "Do I have to give up any commission or join a production team?",
    answer: "No. Smart Agent Alliance is not a production team and there are no commission splits. You keep your clients, your brand, and your full eXp compensation structure. You also may join an eXp production team after you join eXp through Smart Agent Alliance if you want that level of accountability."
  },
  {
    question: "Do I have to recruit or attend meetings to be part of Smart Agent Alliance?",
    answer: "No. There is no requirement to recruit, attend meetings, or implement any system. All tools, training, and sessions are optional. You choose what to use, when to use it, and how it fits your business. Agents who engage consistently tend to benefit more, but participation is always optional."
  },
  {
    question: "Can I access Smart Agent Alliance if I already joined eXp through another sponsor?",
    answer: "Smart Agent Alliance resources are available only to agents who are sponsored through a Smart Agent Alliance-aligned sponsor at eXp. If you have not yet joined eXp, naming a Smart Agent Alliance-aligned sponsor on your application ensures full access to systems, training, and community. If you've already joined eXp through a different sponsor, access to Smart Agent Alliance is not available."
  },
  {
    question: "How is Smart Agent Alliance compensated?",
    answer: "Agents pay Smart Agent Alliance nothing. Smart Agent Alliance is compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's. This structure aligns incentives around agent success, without requiring agents to pay fees or give up control."
  }
];

// ============================================================================
// VERSION SWITCHER
// ============================================================================

function VersionSwitcher({ currentVersion }: { currentVersion: number }) {
  return (
    <div className="fixed top-20 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
      <div className="text-xs text-white/60 mb-2">Test Version:</div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((v) => (
          <Link
            key={v}
            href={`/team-value-test?v=${v}`}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-all ${
              currentVersion === v
                ? 'bg-[#ffd700] text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {v}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SHARED HERO (unchanged from exp-realty-sponsor)
// ============================================================================

function HeroSection() {
  return (
    <StickyHeroWrapper>
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <QuantumGridEffect />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
          <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
            <img
              src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
              srcSet="
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
              "
              sizes="100vw"
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center 55%',
                maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
              }}
            />
          </div>
        </div>
        <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
          <H1>THE ALLIANCE</H1>
          <Tagline className="mt-4">
            3,700+ agents. One mission. Your success.
          </Tagline>
        </div>
      </section>
    </StickyHeroWrapper>
  );
}

// ============================================================================
// VERSION 1: CLEAN BASELINE (follows home page patterns exactly)
// ============================================================================

function Version1() {
  return (
    <>
      {/* Intro Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto text-center">
          <p className="text-body text-lg max-w-3xl mx-auto">
            We work with broker-owners, teams, top producers, growing agents, and brand-new licensees across the U.S., Canada, Mexico, Australia, and beyond.
          </p>
          <div className="mt-8">
            <CTAButton href="/join-exp-sponsor-team/">
              Book a Call
            </CTAButton>
          </div>
        </div>
      </section>

      {/* How Sponsorship Works */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>How Sponsorship Works at eXp Realty</H2>
              <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">
                And why it matters for your success
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <GenericCard padding="lg">
                <p className="text-body">
                  At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor is part of a broader upline structure, which includes up to seven levels of agents.
                </p>
              </GenericCard>

              <GenericCard padding="lg">
                <p className="text-body">
                  What that support looks like varies widely. <strong className="text-[#ffd700]">Many sponsors provide little or no ongoing value.</strong>
                </p>
              </GenericCard>

              <GenericCard padding="lg">
                <p className="text-body">
                  Smart Agent Alliance and the Wolf Pack are <strong className="text-[#ffd700]">organized support platforms</strong>, not production teams. Agents remain fully independent, keep their clients and brand, and are never required to give up a percentage of their commission to participate.
                </p>
              </GenericCard>

              <GenericCard padding="lg">
                <p className="text-body">
                  <strong className="text-[#ffd700]">Agents pay Smart Agent Alliance nothing.</strong> We are compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's. This structure aligns our incentives with agent success.
                </p>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* What You Get - Section Header */}
      <LazySection height={200}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>What You Get Inside Smart Agent Alliance</H2>
            <p className="text-body mt-4 opacity-80">
              Included at no cost when you join eXp through Smart Agent Alliance.
            </p>
          </div>
        </section>
      </LazySection>

      {/* Value Pillar 1: Done-For-You Value */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Header */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-[#ffd700]" />
                  </div>
                  <div>
                    <h3 className="text-h3">Done-For-You Value</h3>
                    <p className="text-[#00ff88] font-semibold">Up to $12,000/yr value</p>
                  </div>
                </div>
                <p className="text-body opacity-80 mb-6">
                  So you don't waste time learning systems just to implement them. Everything here is designed to grow your income while reducing complexity, cost, and frustration.
                </p>
                <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
              </div>

              {/* Right: Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Systems & Access</h4>
                  <p className="text-body text-sm opacity-80">Members-only portal, Personal Agent Link Page, ongoing updates</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Lead Generation</h4>
                  <p className="text-body text-sm opacity-80">BoldTrail Lead Magnet System, 8 landing pages, automated follow-up</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <Video className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Marketing Materials</h4>
                  <p className="text-body text-sm opacity-80">Canva social packs, open house sheets, engagement posts</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Passive Income Support</h4>
                  <p className="text-body text-sm opacity-80">Branded attraction webpage, live webinars, nurture campaigns</p>
                </GenericCard>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Value Pillar 2: Community */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 order-2 lg:order-1">
                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <Video className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Live Masterminds</h4>
                  <p className="text-body text-sm opacity-80">5x weekly live sessions led by Wolf Pack leaders</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">3,700+ Network</h4>
                  <p className="text-body text-sm opacity-80">Access agents spanning multiple markets and experience levels</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <MessageCircle className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Private Groups</h4>
                  <p className="text-body text-sm opacity-80">WhatsApp collaboration and referral groups</p>
                </GenericCard>

                <GenericCard padding="md" hover>
                  <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Private Meetups</h4>
                  <p className="text-body text-sm opacity-80">In-person events at eXp conferences</p>
                </GenericCard>
              </div>

              {/* Right: Header */}
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#ffd700]" />
                  </div>
                  <div>
                    <h3 className="text-h3">Community With Top Agents</h3>
                    <p className="text-[#00ff88] font-semibold">Priceless</p>
                  </div>
                </div>
                <p className="text-body opacity-80 mb-6">
                  This is not a Facebook group. It's an active learning environment built for remote agents. You gain exposure to real ideas, real wins, and practical strategies that agents are using right now.
                </p>
                <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Value Pillar 3: Training */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-[#ffd700]" />
                </div>
                <div className="text-left">
                  <h3 className="text-h3">Elite On-Demand Training</h3>
                  <p className="text-[#00ff88] font-semibold">$2,500 value, then $997/yr</p>
                </div>
              </div>
              <p className="text-body opacity-80 max-w-2xl mx-auto">
                Structured training for agents who want results faster, without guessing. Available for purchase independently, or free when you join through Smart Agent Alliance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <CyberCard padding="md" centered>
                <h4 className="text-h5 text-[#ffd700] mb-2">Social Agent Academy Pro</h4>
                <p className="text-body text-sm opacity-80">Create momentum and measurable results quickly</p>
              </CyberCard>

              <CyberCard padding="md" centered>
                <h4 className="text-h5 text-[#ffd700] mb-2">AI Agent Accelerator</h4>
                <p className="text-body text-sm opacity-80">Save time and increase output dramatically</p>
              </CyberCard>

              <CyberCard padding="md" centered>
                <h4 className="text-h5 text-[#ffd700] mb-2">Investor Agent Training</h4>
                <p className="text-body text-sm opacity-80">Attract and work with investor clients</p>
              </CyberCard>

              <CyberCard padding="md" centered>
                <h4 className="text-h5 text-[#ffd700] mb-2">New Agent Playbooks</h4>
                <p className="text-body text-sm opacity-80">Step-by-step clarity when it matters most</p>
              </CyberCard>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <SecondaryButton href="/courses/">Buy Now</SecondaryButton>
              <CTAButton href="/join-exp-sponsor-team/">Get It FREE</CTAButton>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Dual Advantage */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Your Dual Advantage</H2>
              <p className="text-h4 text-[#ffd700] mt-2">Smart Agent Alliance + Wolf Pack</p>
              <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">
                When you join Smart Agent Alliance, you don't just join one support system. You gain access to two of eXp's most established agent support organizations working together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GenericCard padding="lg" hover>
                <h4 className="text-h4 text-[#ffd700] mb-4">Why This Matters</h4>
                <ul className="space-y-3 text-body">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Systems are battle-tested at scale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Training, tools, support continuously refined</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Benefit from both organizations in alignment</span>
                  </li>
                </ul>
              </GenericCard>

              <GenericCard padding="lg" hover>
                <h4 className="text-h4 text-[#ffd700] mb-4">What You Get</h4>
                <ul className="space-y-3 text-body">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Full SAA systems and resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Full Wolf Pack training & leadership support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>One streamlined experience</span>
                  </li>
                </ul>
              </GenericCard>
            </div>

            <p className="text-body text-center mt-8 opacity-60 italic max-w-2xl mx-auto">
              This dual-layer support is not something you can buy separately. It only exists because of how Smart Agent Alliance is ideally positioned in the eXp organization.
            </p>

            {/* Video Placeholder */}
            <div className="mt-12 max-w-4xl mx-auto aspect-video bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎬</div>
                <p className="text-body opacity-60">ExpCon Video Placeholder</p>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>
            <div className="max-w-3xl mx-auto">
              <FAQ items={faqItems} />
            </div>
          </div>
        </section>
      </LazySection>

      {/* Final CTA */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <CyberCardGold padding="xl">
                <p className="text-h5 text-[#ffd700] mb-2">If you're evaluating eXp sponsors, structure matters.</p>
                <NeonGoldText as="h2" className="text-h2 mb-4">
                  Support Without Giving Up Independence
                </NeonGoldText>
                <p className="text-body mb-8 opacity-80">
                  Smart Agent Alliance provides systems, training, and community designed to support agent growth without commission splits, control, or loss of independence. With thousands of agents across multiple countries and consistent live collaboration, this is structure built for long-term success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton href="/join-exp-sponsor-team/">Join The Alliance</CTAButton>
                  <SecondaryButton href="/join-exp-sponsor-team/">Book a Call</SecondaryButton>
                  <SecondaryButton href="/about-exp-realty/">Learn about eXp</SecondaryButton>
                </div>
              </CyberCardGold>
            </div>

            <p className="text-sm text-center mt-8 opacity-50 max-w-2xl mx-auto">
              Smart Agent Alliance is a sponsor team and agent community within eXp Realty. eXp Realty is a licensed real estate brokerage, publicly traded under the symbol "EXPI".
            </p>
          </div>
        </section>
      </LazySection>
    </>
  );
}

// ============================================================================
// CUSTOM HOOKS FOR ANIMATIONS
// ============================================================================

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============================================================================
// VERSION 2: SCROLL REVEAL SHOWCASE
// ============================================================================

function Version2() {
  return (
    <>
      <style jsx global>{`
        /* Scroll Reveal Animations */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes clipReveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,215,0,0.2); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        .v2-reveal { opacity: 0; }
        .v2-reveal.visible { animation: fadeSlideUp 0.8s ease-out forwards; }
        .v2-reveal-left { opacity: 0; }
        .v2-reveal-left.visible { animation: fadeSlideLeft 0.8s ease-out forwards; }
        .v2-reveal-right { opacity: 0; }
        .v2-reveal-right.visible { animation: fadeSlideRight 0.8s ease-out forwards; }
        .v2-scale { opacity: 0; }
        .v2-scale.visible { animation: scaleIn 0.6s ease-out forwards; }
        .v2-clip { clip-path: inset(0 100% 0 0); }
        .v2-clip.visible { animation: clipReveal 1s ease-out forwards; }

        .v2-stagger-1 { animation-delay: 0.1s; }
        .v2-stagger-2 { animation-delay: 0.2s; }
        .v2-stagger-3 { animation-delay: 0.3s; }
        .v2-stagger-4 { animation-delay: 0.4s; }
        .v2-stagger-5 { animation-delay: 0.5s; }
        .v2-stagger-6 { animation-delay: 0.6s; }

        .v2-glow-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .v2-glow-card:hover {
          transform: translateY(-4px);
          animation: glowPulse 2s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.05);
        }

        .v2-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .v2-float-medium { animation: floatMedium 6s ease-in-out infinite; }

        .v2-gradient-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700, #00ff88, #ffd700, transparent);
          animation: v2-line-shimmer 3s ease-in-out infinite;
        }
        @keyframes v2-line-shimmer {
          0%, 100% { opacity: 0.5; filter: blur(0px); }
          50% { opacity: 1; filter: blur(1px); box-shadow: 0 0 10px rgba(255,215,0,0.5); }
        }
      `}</style>

      {/* Floating Background Elements - More visible orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="v2-float-slow absolute top-[15%] left-[5%] w-64 h-64 rounded-full bg-[#ffd700]/10 blur-[80px]" />
        <div className="v2-float-medium absolute top-[35%] right-[10%] w-80 h-80 rounded-full bg-[#ffd700]/8 blur-[100px]" />
        <div className="v2-float-slow absolute top-[65%] left-[15%] w-48 h-48 rounded-full bg-[#00ff88]/10 blur-[60px]" style={{ animationDelay: '2s' }} />
        <div className="v2-float-medium absolute top-[55%] right-[20%] w-72 h-72 rounded-full bg-[#ffd700]/6 blur-[90px]" style={{ animationDelay: '3s' }} />
        <div className="v2-float-slow absolute top-[85%] left-[40%] w-56 h-56 rounded-full bg-[#00ff88]/8 blur-[70px]" style={{ animationDelay: '4s' }} />
      </div>

      {/* Intro Section */}
      <V2Section className="py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V2RevealText className="text-body text-xl max-w-3xl mx-auto mb-8">
            We work with broker-owners, teams, top producers, growing agents, and brand-new licensees across the U.S., Canada, Mexico, Australia, and beyond.
          </V2RevealText>
          <V2Reveal delay={0.3}>
            <CTAButton href="/join-exp-sponsor-team/">Book a Call</CTAButton>
          </V2Reveal>
        </div>
      </V2Section>

      {/* Gradient Divider */}
      <div className="v2-gradient-line w-full max-w-md mx-auto" />

      {/* How Sponsorship Works */}
      <V2Section className="py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V2Reveal className="text-center mb-16">
            <H2>How Sponsorship Works at eXp Realty</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">(and Why It Matters)</p>
          </V2Reveal>

          <div className="max-w-4xl mx-auto space-y-8">
            <V2RevealCard direction="left" delay={0.1}>
              <GenericCard padding="lg" className="border-l-4 border-l-[#ffd700]">
                <p className="text-body text-lg">
                  At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor is part of a broader upline structure, which includes up to seven levels of agents.
                </p>
              </GenericCard>
            </V2RevealCard>

            <V2RevealCard direction="right" delay={0.2}>
              <GenericCard padding="lg" className="border-r-4 border-r-[#ffd700]">
                <p className="text-body text-lg">
                  What that support looks like varies widely. <strong className="text-[#ffd700]">Many sponsors provide little or no ongoing value.</strong>
                </p>
              </GenericCard>
            </V2RevealCard>

            <V2RevealCard direction="left" delay={0.3}>
              <GenericCard padding="lg" className="border-l-4 border-l-[#00ff88]">
                <p className="text-body text-lg">
                  Smart Agent Alliance and the Wolf Pack are <strong className="text-[#00ff88]">organized support platforms</strong>, not production teams. Agents remain fully independent, keep their clients and brand, and are never required to give up a percentage of their commission.
                </p>
              </GenericCard>
            </V2RevealCard>

            <V2RevealCard direction="right" delay={0.4}>
              <GenericCard padding="lg" className="border-r-4 border-r-[#ffd700]">
                <p className="text-body text-lg">
                  <strong className="text-[#ffd700]">Agents pay Smart Agent Alliance nothing.</strong> We are compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's.
                </p>
              </GenericCard>
            </V2RevealCard>
          </div>
        </div>
      </V2Section>

      {/* What You Get Header */}
      <V2Section className="py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V2Reveal>
            <H2 className="v2-clip visible">What You Get Inside Smart Agent Alliance</H2>
          </V2Reveal>
          <V2Reveal delay={0.2}>
            <p className="text-body mt-4 opacity-80">Included at no cost when you join eXp through Smart Agent Alliance.</p>
          </V2Reveal>
        </div>
      </V2Section>

      {/* Value Pillar 1: Done-For-You */}
      <V2Section className="py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <V2Reveal className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-[#ffd700]" />
                </div>
                <div>
                  <h3 className="text-h3">Done-For-You Value</h3>
                  <p className="text-[#00ff88] font-bold text-lg">Up to $12,000/yr value</p>
                </div>
              </div>
              <p className="text-body text-lg opacity-80 mb-8">
                So you don't waste time learning systems just to implement them. Everything here is designed to grow your income while reducing complexity, cost, and frustration.
              </p>
              <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
            </V2Reveal>

            <div className="order-1 lg:order-2 grid sm:grid-cols-2 gap-4">
              <V2StaggerCard index={0}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Systems & Access</h4>
                  <p className="text-body text-sm opacity-80">Members-only portal, Personal Agent Link Page, ongoing updates</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={1}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Lead Generation</h4>
                  <p className="text-body text-sm opacity-80">BoldTrail Lead Magnet System, 8 landing pages, automated follow-up</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={2}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Marketing Materials</h4>
                  <p className="text-body text-sm opacity-80">Canva social packs, open house sheets, engagement posts</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={3}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Passive Income Support</h4>
                  <p className="text-body text-sm opacity-80">Branded attraction webpage, live webinars, nurture campaigns</p>
                </GenericCard>
              </V2StaggerCard>
            </div>
          </div>
        </div>
      </V2Section>

      {/* Value Pillar 2: Community */}
      <V2Section className="py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid sm:grid-cols-2 gap-4">
              <V2StaggerCard index={0}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Live Masterminds</h4>
                  <p className="text-body text-sm opacity-80">5x weekly live sessions led by Wolf Pack leaders</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={1}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">3,700+ Network</h4>
                  <p className="text-body text-sm opacity-80">Access agents spanning multiple markets and experience levels</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={2}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Private Groups</h4>
                  <p className="text-body text-sm opacity-80">WhatsApp collaboration and referral groups</p>
                </GenericCard>
              </V2StaggerCard>

              <V2StaggerCard index={3}>
                <GenericCard padding="md" hover className="v2-glow-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-[#ffd700]" />
                  </div>
                  <h4 className="text-h5 mb-2">Private Meetups</h4>
                  <p className="text-body text-sm opacity-80">In-person events at eXp conferences</p>
                </GenericCard>
              </V2StaggerCard>
            </div>

            <V2Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#ffd700]" />
                </div>
                <div>
                  <h3 className="text-h3">Community With Top Agents</h3>
                  <p className="text-[#00ff88] font-bold text-lg">Priceless</p>
                </div>
              </div>
              <p className="text-body text-lg opacity-80 mb-8">
                This is not a Facebook group. It's an active learning environment built for remote agents. You gain exposure to real ideas, real wins, and practical strategies that agents are using right now.
              </p>
              <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
            </V2Reveal>
          </div>
        </div>
      </V2Section>

      {/* Value Pillar 3: Training */}
      <V2Section className="py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V2Reveal className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#ffd700]" />
              </div>
              <div className="text-left">
                <h3 className="text-h3">Elite On-Demand Training</h3>
                <p className="text-[#00ff88] font-bold text-lg">$2,500 value, then $997/yr</p>
              </div>
            </div>
            <p className="text-body text-lg opacity-80 max-w-2xl mx-auto">
              Structured training for agents who want results faster, without guessing. Available for purchase independently, or free when you join through Smart Agent Alliance.
            </p>
          </V2Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <V2StaggerCard index={0}>
              <CyberCard padding="md" centered className="h-full">
                <h4 className="text-h5 text-[#ffd700] mb-3">Social Agent Academy Pro</h4>
                <p className="text-body text-sm opacity-80">Create momentum and measurable results quickly</p>
              </CyberCard>
            </V2StaggerCard>

            <V2StaggerCard index={1}>
              <CyberCard padding="md" centered className="h-full">
                <h4 className="text-h5 text-[#ffd700] mb-3">AI Agent Accelerator</h4>
                <p className="text-body text-sm opacity-80">Save time and increase output dramatically</p>
              </CyberCard>
            </V2StaggerCard>

            <V2StaggerCard index={2}>
              <CyberCard padding="md" centered className="h-full">
                <h4 className="text-h5 text-[#ffd700] mb-3">Investor Agent Training</h4>
                <p className="text-body text-sm opacity-80">Attract and work with investor clients</p>
              </CyberCard>
            </V2StaggerCard>

            <V2StaggerCard index={3}>
              <CyberCard padding="md" centered className="h-full">
                <h4 className="text-h5 text-[#ffd700] mb-3">New Agent Playbooks</h4>
                <p className="text-body text-sm opacity-80">Step-by-step clarity when it matters most</p>
              </CyberCard>
            </V2StaggerCard>
          </div>

          <V2Reveal delay={0.5} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <SecondaryButton href="/courses/">Buy Now</SecondaryButton>
            <CTAButton href="/join-exp-sponsor-team/">Get It FREE</CTAButton>
          </V2Reveal>
        </div>
      </V2Section>

      {/* Dual Advantage */}
      <V2Section className="py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V2Reveal className="text-center mb-12">
            <H2>Your Dual Advantage</H2>
            <p className="text-h4 text-[#ffd700] mt-2">Smart Agent Alliance + Wolf Pack</p>
            <p className="text-body text-lg mt-4 max-w-3xl mx-auto opacity-80">
              When you join Smart Agent Alliance, you don't just join one support system. You gain access to two of eXp's most established agent support organizations working together.
            </p>
          </V2Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <V2RevealCard direction="left" delay={0.2}>
              <GenericCard padding="lg" hover className="h-full">
                <h4 className="text-h4 text-[#ffd700] mb-6">Why This Matters</h4>
                <ul className="space-y-4 text-body">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Systems are battle-tested at scale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Training, tools, support continuously refined</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Benefit from both organizations in alignment</span>
                  </li>
                </ul>
              </GenericCard>
            </V2RevealCard>

            <V2RevealCard direction="right" delay={0.3}>
              <GenericCard padding="lg" hover className="h-full">
                <h4 className="text-h4 text-[#ffd700] mb-6">What You Get</h4>
                <ul className="space-y-4 text-body">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Full SAA systems and resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>Full Wolf Pack training & leadership support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0 mt-0.5" />
                    <span>One streamlined experience</span>
                  </li>
                </ul>
              </GenericCard>
            </V2RevealCard>
          </div>

          <V2Reveal delay={0.4} className="text-center mt-10">
            <p className="text-body opacity-60 italic max-w-2xl mx-auto">
              This dual-layer support is not something you can buy separately. It only exists because of how Smart Agent Alliance is ideally positioned in the eXp organization.
            </p>
          </V2Reveal>

          {/* Video Placeholder */}
          <V2Reveal delay={0.5}>
            <div className="mt-12 max-w-4xl mx-auto aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-body opacity-60">ExpCon Video Placeholder</p>
              </div>
            </div>
          </V2Reveal>
        </div>
      </V2Section>

      {/* Animated Divider before FAQ */}
      <div className="w-full max-w-lg mx-auto py-8">
        <div className="v2-gradient-line h-[2px] w-full" />
      </div>

      {/* FAQ */}
      <V2Section className="py-8 md:py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V2Reveal className="text-center mb-10">
            <H2>Frequently Asked Questions</H2>
          </V2Reveal>
          <V2Reveal delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <FAQ items={faqItems} />
            </div>
          </V2Reveal>
        </div>
      </V2Section>

      {/* Final CTA */}
      <V2Section className="py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V2ScaleIn className="max-w-4xl mx-auto">
            <CyberCardGold padding="xl">
              <p className="text-h5 text-[#ffd700] mb-3">If you're evaluating eXp sponsors, structure matters.</p>
              <NeonGoldText as="h2" className="text-h2 mb-6">
                Support Without Giving Up Independence
              </NeonGoldText>
              <p className="text-body text-lg mb-10 opacity-80">
                Smart Agent Alliance provides systems, training, and community designed to support agent growth without commission splits, control, or loss of independence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/join-exp-sponsor-team/">Join The Alliance</CTAButton>
                <SecondaryButton href="/join-exp-sponsor-team/">Book a Call</SecondaryButton>
                <SecondaryButton href="/about-exp-realty/">Learn about eXp</SecondaryButton>
              </div>
            </CyberCardGold>
          </V2ScaleIn>

          <p className="text-sm text-center mt-10 opacity-50 max-w-2xl mx-auto">
            Smart Agent Alliance is a sponsor team and agent community within eXp Realty. eXp Realty is a licensed real estate brokerage, publicly traded under the symbol "EXPI".
          </p>
        </div>
      </V2Section>
    </>
  );
}

// V2 Helper Components
function V2Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`relative ${className}`}>{children}</section>;
}

function V2Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`v2-reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function V2RevealText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`v2-reveal ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function V2RevealCard({ children, direction = 'left', delay = 0 }: { children: React.ReactNode; direction?: 'left' | 'right'; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const className = direction === 'left' ? 'v2-reveal-right' : 'v2-reveal-left';
  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function V2StaggerCard({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.05);
  return (
    <div
      ref={ref}
      className={`v2-scale ${isVisible ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {children}
    </div>
  );
}

function V2ScaleIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal(0.2);
  return (
    <div ref={ref} className={`v2-scale ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ============================================================================
// VERSION 3: PARALLAX DEPTH EXPERIENCE
// ============================================================================

function Version3() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Parallax Animations */
        @keyframes v3-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes v3-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes v3-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes v3-draw-line {
          from { width: 0; }
          to { width: 100%; }
        }

        .v3-parallax-slow { transition: transform 0.1s linear; }
        .v3-parallax-medium { transition: transform 0.05s linear; }
        .v3-parallax-fast { transition: transform 0.02s linear; }

        .v3-float { animation: v3-float 6s ease-in-out infinite; }
        .v3-pulse { animation: v3-pulse 4s ease-in-out infinite; }
        .v3-rotate { animation: v3-rotate 20s linear infinite; }

        .v3-card-3d {
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
          transform-style: preserve-3d;
        }
        .v3-card-3d:hover {
          transform: translateY(-8px) rotateX(5deg) rotateY(-5deg);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.1);
        }

        .v3-gradient-border {
          position: relative;
        }
        .v3-gradient-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #ffd700, #00ff88, #ffd700);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .v3-gradient-border:hover::before {
          opacity: 1;
        }

        .v3-section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent);
          margin: 0 auto;
        }

        .v3-glow-orb {
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .v3-depth-text {
          text-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2);
        }

        /* Enhanced FAQ styling */
        .v3-faq-item {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .v3-faq-item:hover {
          transform: translateX(4px);
          box-shadow: -4px 0 0 #ffd700;
        }
      `}</style>

      {/* Parallax Background Orbs - Enhanced visibility */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Layer 1: Slow moving (far) */}
        <div
          className="v3-glow-orb absolute w-[500px] h-[500px] bg-[#ffd700]/15 v3-pulse"
          style={{
            top: '10%',
            left: '5%',
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="v3-glow-orb absolute w-80 h-80 bg-[#00ff88]/15 v3-pulse"
          style={{
            top: '50%',
            right: '10%',
            transform: `translateY(${scrollY * 0.08}px)`,
            animationDelay: '2s',
          }}
        />

        {/* Layer 2: Medium speed */}
        <div
          className="v3-glow-orb absolute w-48 h-48 bg-[#ffd700]/15 v3-float"
          style={{
            top: '30%',
            right: '20%',
            transform: `translateY(${scrollY * 0.12}px)`,
          }}
        />
        <div
          className="v3-glow-orb absolute w-32 h-32 bg-[#ffd700]/20 v3-float"
          style={{
            top: '70%',
            left: '15%',
            transform: `translateY(${scrollY * 0.15}px)`,
            animationDelay: '3s',
          }}
        />

        {/* Rotating ring */}
        <div
          className="absolute w-[800px] h-[800px] border border-[#ffd700]/5 rounded-full v3-rotate"
          style={{
            top: '20%',
            left: '50%',
            marginLeft: '-400px',
            transform: `translateY(${scrollY * 0.02}px)`,
          }}
        />
      </div>

      {/* Intro Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V3Reveal>
            <p className="text-body text-xl max-w-3xl mx-auto mb-8 v3-depth-text">
              We work with broker-owners, teams, top producers, growing agents, and brand-new licensees across the U.S., Canada, Mexico, Australia, and beyond.
            </p>
          </V3Reveal>
          <V3Reveal delay={0.2}>
            <CTAButton href="/join-exp-sponsor-team/">Book a Call</CTAButton>
          </V3Reveal>
        </div>
      </section>

      <div className="v3-section-divider w-full max-w-lg" />

      {/* How Sponsorship Works */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V3Reveal className="text-center mb-16">
            <H2 className="v3-depth-text">How Sponsorship Works at eXp Realty</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">(and Why It Matters)</p>
          </V3Reveal>

          <div
            className="max-w-4xl mx-auto space-y-8"
            style={{ transform: `translateY(${scrollY * -0.02}px)` }}
          >
            <V3Reveal delay={0.1}>
              <div className="v3-card-3d">
                <GenericCard padding="lg" className="border-l-4 border-l-[#ffd700]">
                  <p className="text-body text-lg">
                    At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor is part of a broader upline structure, which includes up to seven levels of agents.
                  </p>
                </GenericCard>
              </div>
            </V3Reveal>

            <V3Reveal delay={0.2}>
              <div className="v3-card-3d">
                <GenericCard padding="lg">
                  <p className="text-body text-lg">
                    What that support looks like varies widely. <strong className="text-[#ffd700]">Many sponsors provide little or no ongoing value.</strong>
                  </p>
                </GenericCard>
              </div>
            </V3Reveal>

            <V3Reveal delay={0.3}>
              <div className="v3-card-3d">
                <GenericCard padding="lg" className="border-l-4 border-l-[#00ff88]">
                  <p className="text-body text-lg">
                    Smart Agent Alliance and the Wolf Pack are <strong className="text-[#00ff88]">organized support platforms</strong>, not production teams. Agents remain fully independent.
                  </p>
                </GenericCard>
              </div>
            </V3Reveal>

            <V3Reveal delay={0.4}>
              <div className="v3-card-3d">
                <GenericCard padding="lg">
                  <p className="text-body text-lg">
                    <strong className="text-[#ffd700]">Agents pay Smart Agent Alliance nothing.</strong> We are compensated by eXp only from eXp's portion of the commission.
                  </p>
                </GenericCard>
              </div>
            </V3Reveal>
          </div>
        </div>
      </section>

      {/* What You Get Header */}
      <section className="relative py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V3Reveal>
            <H2 className="v3-depth-text">What You Get Inside Smart Agent Alliance</H2>
          </V3Reveal>
          <V3Reveal delay={0.2}>
            <p className="text-body mt-4 opacity-80">Included at no cost when you join eXp through Smart Agent Alliance.</p>
          </V3Reveal>
        </div>
      </section>

      {/* Value Pillars with 3D Cards */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          {/* Pillar 1 */}
          <div className="mb-24">
            <V3Reveal className="text-center mb-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Zap className="w-8 h-8 text-[#ffd700]" />
                <div className="text-left">
                  <h3 className="text-h4">Done-For-You Value</h3>
                  <p className="text-[#00ff88] font-semibold">Up to $12,000/yr value</p>
                </div>
              </div>
            </V3Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
              {[
                { icon: CheckCircle, title: 'Systems & Access', desc: 'Members-only portal, Personal Agent Link Page' },
                { icon: Target, title: 'Lead Generation', desc: 'BoldTrail System, 8 landing pages, automation' },
                { icon: Video, title: 'Marketing Materials', desc: 'Canva packs, open house sheets, posts' },
                { icon: DollarSign, title: 'Passive Income', desc: 'Attraction webpage, webinars, campaigns' },
              ].map((item, i) => (
                <V3Reveal key={i} delay={i * 0.1}>
                  <div className="v3-card-3d v3-gradient-border rounded-xl">
                    <GenericCard padding="lg" className="h-full">
                      <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-[#ffd700]" />
                      </div>
                      <h4 className="text-h5 mb-2">{item.title}</h4>
                      <p className="text-body text-sm opacity-80">{item.desc}</p>
                    </GenericCard>
                  </div>
                </V3Reveal>
              ))}
            </div>

            <V3Reveal delay={0.5} className="text-center mt-8">
              <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
            </V3Reveal>
          </div>

          {/* Pillar 2 */}
          <div className="mb-24">
            <V3Reveal className="text-center mb-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <Users className="w-8 h-8 text-[#ffd700]" />
                <div className="text-left">
                  <h3 className="text-h4">Community With Top Agents</h3>
                  <p className="text-[#00ff88] font-semibold">Priceless</p>
                </div>
              </div>
            </V3Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
              {[
                { icon: Video, title: 'Live Masterminds', desc: '5x weekly sessions with Wolf Pack leaders' },
                { icon: Users, title: '3,700+ Network', desc: 'Agents across markets and experience levels' },
                { icon: MessageCircle, title: 'Private Groups', desc: 'WhatsApp collaboration and referrals' },
                { icon: Globe, title: 'Private Meetups', desc: 'In-person events at eXp conferences' },
              ].map((item, i) => (
                <V3Reveal key={i} delay={i * 0.1}>
                  <div className="v3-card-3d v3-gradient-border rounded-xl">
                    <GenericCard padding="lg" className="h-full">
                      <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-[#ffd700]" />
                      </div>
                      <h4 className="text-h5 mb-2">{item.title}</h4>
                      <p className="text-body text-sm opacity-80">{item.desc}</p>
                    </GenericCard>
                  </div>
                </V3Reveal>
              ))}
            </div>

            <V3Reveal delay={0.5} className="text-center mt-8">
              <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
            </V3Reveal>
          </div>

          {/* Pillar 3 */}
          <div>
            <V3Reveal className="text-center mb-10">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <BookOpen className="w-8 h-8 text-[#ffd700]" />
                <div className="text-left">
                  <h3 className="text-h4">Elite On-Demand Training</h3>
                  <p className="text-[#00ff88] font-semibold">$2,500 value, then $997/yr</p>
                </div>
              </div>
            </V3Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" style={{ perspective: '1000px' }}>
              {[
                { title: 'Social Agent Academy Pro', desc: 'Momentum and measurable results' },
                { title: 'AI Agent Accelerator', desc: 'Save time, increase output' },
                { title: 'Investor Agent Training', desc: 'Work with investor clients' },
                { title: 'New Agent Playbooks', desc: 'Step-by-step clarity' },
              ].map((item, i) => (
                <V3Reveal key={i} delay={i * 0.1}>
                  <div className="v3-card-3d">
                    <CyberCard padding="md" centered className="h-full">
                      <h4 className="text-h5 text-[#ffd700] mb-3">{item.title}</h4>
                      <p className="text-body text-sm opacity-80">{item.desc}</p>
                    </CyberCard>
                  </div>
                </V3Reveal>
              ))}
            </div>

            <V3Reveal delay={0.5} className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <SecondaryButton href="/courses/">Buy Now</SecondaryButton>
              <CTAButton href="/join-exp-sponsor-team/">Get It FREE</CTAButton>
            </V3Reveal>
          </div>
        </div>
      </section>

      <div className="v3-section-divider w-full max-w-lg" />

      {/* Dual Advantage */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V3Reveal className="text-center mb-12">
            <H2 className="v3-depth-text">Your Dual Advantage</H2>
            <p className="text-h4 text-[#ffd700] mt-2">Smart Agent Alliance + Wolf Pack</p>
          </V3Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" style={{ perspective: '1000px' }}>
            <V3Reveal delay={0.1}>
              <div className="v3-card-3d h-full">
                <GenericCard padding="lg" className="h-full">
                  <h4 className="text-h4 text-[#ffd700] mb-6">Why This Matters</h4>
                  <ul className="space-y-4 text-body">
                    {['Battle-tested systems at scale', 'Continuously refined tools', 'Both organizations aligned'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              </div>
            </V3Reveal>

            <V3Reveal delay={0.2}>
              <div className="v3-card-3d h-full">
                <GenericCard padding="lg" className="h-full">
                  <h4 className="text-h4 text-[#ffd700] mb-6">What You Get</h4>
                  <ul className="space-y-4 text-body">
                    {['Full SAA systems and resources', 'Full Wolf Pack training', 'One streamlined experience'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#00ff88] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              </div>
            </V3Reveal>
          </div>

          {/* Video Placeholder */}
          <V3Reveal delay={0.3}>
            <div className="mt-12 max-w-4xl mx-auto aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-body opacity-60">ExpCon Video Placeholder</p>
              </div>
            </div>
          </V3Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V3Reveal className="text-center mb-12">
            <H2 className="v3-depth-text">Frequently Asked Questions</H2>
          </V3Reveal>
          <V3Reveal delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <FAQ items={faqItems} />
            </div>
          </V3Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V3Reveal className="max-w-4xl mx-auto">
            <CyberCardGold padding="xl">
              <p className="text-h5 text-[#ffd700] mb-3">If you're evaluating eXp sponsors, structure matters.</p>
              <NeonGoldText as="h2" className="text-h2 mb-6">
                Support Without Giving Up Independence
              </NeonGoldText>
              <p className="text-body text-lg mb-10 opacity-80">
                Systems, training, and community designed for agent growth without commission splits or loss of independence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/join-exp-sponsor-team/">Join The Alliance</CTAButton>
                <SecondaryButton href="/join-exp-sponsor-team/">Book a Call</SecondaryButton>
                <SecondaryButton href="/about-exp-realty/">Learn about eXp</SecondaryButton>
              </div>
            </CyberCardGold>
          </V3Reveal>

          <p className="text-sm text-center mt-10 opacity-50 max-w-2xl mx-auto">
            Smart Agent Alliance is a sponsor team within eXp Realty, publicly traded under "EXPI".
          </p>
        </div>
      </section>
    </>
  );
}

// V3 Helper Components
function V3Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// VERSION 4: INTERACTIVE SHOWCASE
// ============================================================================

function Version4() {
  return (
    <>
      <style jsx global>{`
        /* Interactive Animations */
        @keyframes v4-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes v4-border-trace {
          0% { clip-path: inset(0 100% 100% 0); }
          25% { clip-path: inset(0 0 100% 0); }
          50% { clip-path: inset(0 0 0 0); }
          75% { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(100% 0 0 100%); }
        }
        @keyframes v4-check-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes v4-count-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes v4-ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }

        .v4-interactive-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .v4-interactive-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 0 20px rgba(255,215,0,0.1);
        }
        .v4-interactive-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          border-radius: inherit;
          background: linear-gradient(90deg, #ffd700, #00ff88, #ffd700) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .v4-interactive-card:hover::before {
          opacity: 1;
        }

        .v4-shimmer-text {
          background: linear-gradient(90deg, #e5e4dd 0%, #ffd700 50%, #e5e4dd 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .v4-shimmer-text:hover {
          animation: v4-shimmer 2s linear infinite;
        }

        .v4-magnetic {
          transition: transform 0.2s ease-out;
        }

        .v4-stat-number {
          font-variant-numeric: tabular-nums;
        }

        .v4-check-animated path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
        }
        .v4-check-animated.visible path {
          animation: v4-check-draw 0.5s ease-out forwards;
        }

        .v4-expand-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-out, opacity 0.3s ease;
          opacity: 0;
        }
        .v4-expand-content.expanded {
          max-height: 500px;
          opacity: 1;
        }

        .v4-ripple-container {
          position: relative;
          overflow: hidden;
        }
        .v4-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,215,0,0.3);
          pointer-events: none;
          animation: v4-ripple 0.6s ease-out forwards;
        }
      `}</style>

      {/* Intro Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V4Reveal>
            <p className="text-body text-xl max-w-3xl mx-auto mb-8">
              We work with broker-owners, teams, top producers, growing agents, and brand-new licensees across the U.S., Canada, Mexico, Australia, and beyond.
            </p>
          </V4Reveal>
          <V4Reveal delay={0.2}>
            <V4MagneticButton>
              <CTAButton href="/join-exp-sponsor-team/">Book a Call</CTAButton>
            </V4MagneticButton>
          </V4Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <V4Counter value={3700} suffix="+" label="Agents Strong" />
            <V4Counter value={24} suffix="+" label="Countries" />
            <V4Counter value={5} suffix="x" label="Weekly Calls" />
            <V4Counter value={12000} prefix="$" suffix="/yr" label="Value Included" />
          </div>
        </div>
      </section>

      {/* How Sponsorship Works - Interactive Cards */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V4Reveal className="text-center mb-16">
            <H2 className="v4-shimmer-text inline-block cursor-pointer">How Sponsorship Works at eXp Realty</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto opacity-80">(and Why It Matters)</p>
          </V4Reveal>

          <div className="max-w-4xl mx-auto space-y-6">
            <V4ExpandCard
              title="Join eXp Directly"
              preview="Agents join the brokerage directly and name an individual sponsor..."
              content="At eXp Realty, agents join the brokerage directly and name an individual sponsor on their application. That sponsor is part of a broader upline structure, which includes up to seven levels of agents. What that support looks like varies widely."
              highlight="#ffd700"
            />
            <V4ExpandCard
              title="Not All Sponsors Are Equal"
              preview="Many sponsors provide little or no ongoing value..."
              content="Many sponsors provide little or no ongoing value. Smart Agent Alliance and the Wolf Pack are organized support platforms, not production teams. Agents remain fully independent, keep their clients and brand, and are never required to give up a percentage of their commission."
              highlight="#ff6b6b"
            />
            <V4ExpandCard
              title="Zero Cost to You"
              preview="Agents pay Smart Agent Alliance nothing..."
              content="Agents pay Smart Agent Alliance nothing. We are compensated by eXp only when agents close transactions, and only from eXp's portion of the commission, not the agent's. This structure aligns our incentives with your success."
              highlight="#00ff88"
            />
          </div>
        </div>
      </section>

      {/* Value Pillars - Interactive Grid */}
      <section className="relative py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12 text-center">
          <V4Reveal>
            <H2>What You Get Inside Smart Agent Alliance</H2>
          </V4Reveal>
        </div>
      </section>

      {/* Pillar 1 */}
      <section className="relative py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V4Reveal className="text-center mb-10">
            <div className="inline-flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#ffd700]" />
              </div>
              <div className="text-left">
                <h3 className="text-h3 v4-shimmer-text inline-block cursor-pointer">Done-For-You Value</h3>
                <p className="text-[#00ff88] font-bold text-lg">Up to $12,000/yr value</p>
              </div>
            </div>
          </V4Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Systems & Access', items: ['Members-only portal', 'Personal Agent Link Page', 'Ongoing updates'] },
              { icon: Target, title: 'Lead Generation', items: ['BoldTrail Lead Magnet System', '8 landing pages', 'Automated follow-up'] },
              { icon: Video, title: 'Marketing Materials', items: ['Canva social packs', 'Open house sheets', 'Engagement posts'] },
              { icon: DollarSign, title: 'Passive Income', items: ['Attraction webpage', 'Live webinars', 'Nurture campaigns'] },
            ].map((card, i) => (
              <V4Reveal key={i} delay={i * 0.1}>
                <V4InteractiveCard className="h-full">
                  <GenericCard padding="lg" className="h-full">
                    <div className="w-12 h-12 rounded-xl bg-[#ffd700]/10 flex items-center justify-center mb-4">
                      <card.icon className="w-6 h-6 text-[#ffd700]" />
                    </div>
                    <h4 className="text-h5 mb-4">{card.title}</h4>
                    <ul className="space-y-2">
                      {card.items.map((item, j) => (
                        <V4CheckItem key={j} delay={i * 0.1 + j * 0.1}>{item}</V4CheckItem>
                      ))}
                    </ul>
                  </GenericCard>
                </V4InteractiveCard>
              </V4Reveal>
            ))}
          </div>

          <V4Reveal delay={0.5} className="text-center mt-10">
            <V4MagneticButton>
              <CTAButton href="/join-exp-sponsor-team/">I Want This</CTAButton>
            </V4MagneticButton>
          </V4Reveal>
        </div>
      </section>

      {/* Pillar 2 & 3 - Similar structure */}
      <section className="relative py-16">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Community */}
            <div>
              <V4Reveal className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#ffd700]" />
                  </div>
                  <div>
                    <h3 className="text-h4">Community With Top Agents</h3>
                    <p className="text-[#00ff88] font-semibold">Priceless</p>
                  </div>
                </div>
              </V4Reveal>

              <div className="space-y-4">
                {['5x weekly live sessions', '3,700+ agent network', 'Private WhatsApp groups', 'In-person meetups'].map((item, i) => (
                  <V4Reveal key={i} delay={i * 0.1}>
                    <V4InteractiveCard>
                      <GenericCard padding="md" className="flex items-center gap-4">
                        <V4AnimatedCheck delay={i * 0.1} />
                        <span className="text-body">{item}</span>
                      </GenericCard>
                    </V4InteractiveCard>
                  </V4Reveal>
                ))}
              </div>
            </div>

            {/* Training */}
            <div>
              <V4Reveal className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ffd700]/5 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-[#ffd700]" />
                  </div>
                  <div>
                    <h3 className="text-h4">Elite On-Demand Training</h3>
                    <p className="text-[#00ff88] font-semibold">$2,500 value</p>
                  </div>
                </div>
              </V4Reveal>

              <div className="space-y-4">
                {['Social Agent Academy Pro', 'AI Agent Accelerator', 'Investor Agent Training', 'New Agent Playbooks'].map((item, i) => (
                  <V4Reveal key={i} delay={i * 0.1}>
                    <V4InteractiveCard>
                      <CyberCard padding="md" className="flex items-center gap-4">
                        <V4AnimatedCheck delay={i * 0.1} />
                        <span className="text-body text-[#ffd700]">{item}</span>
                      </CyberCard>
                    </V4InteractiveCard>
                  </V4Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Advantage */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V4Reveal className="text-center mb-12">
            <H2 className="v4-shimmer-text inline-block cursor-pointer">Your Dual Advantage</H2>
            <p className="text-h4 text-[#ffd700] mt-2">Smart Agent Alliance + Wolf Pack</p>
          </V4Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <V4Reveal delay={0.1}>
              <V4InteractiveCard className="h-full">
                <GenericCard padding="lg" className="h-full">
                  <h4 className="text-h4 text-[#ffd700] mb-6">Why This Matters</h4>
                  <ul className="space-y-4">
                    {['Battle-tested at scale', 'Continuously refined', 'Aligned organizations'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <V4AnimatedCheck delay={i * 0.15} />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              </V4InteractiveCard>
            </V4Reveal>

            <V4Reveal delay={0.2}>
              <V4InteractiveCard className="h-full">
                <GenericCard padding="lg" className="h-full">
                  <h4 className="text-h4 text-[#ffd700] mb-6">What You Get</h4>
                  <ul className="space-y-4">
                    {['Full SAA systems', 'Full Wolf Pack training', 'Streamlined experience'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <V4AnimatedCheck delay={i * 0.15} />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              </V4InteractiveCard>
            </V4Reveal>
          </div>

          {/* Video Placeholder */}
          <V4Reveal delay={0.3}>
            <div className="mt-12 max-w-4xl mx-auto aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <div className="text-center">
                <div className="text-5xl mb-4">▶️</div>
                <p className="text-body opacity-60">Click to Play Video</p>
              </div>
            </div>
          </V4Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V4Reveal className="text-center mb-12">
            <H2>Frequently Asked Questions</H2>
          </V4Reveal>
          <V4Reveal delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <FAQ items={faqItems} />
            </div>
          </V4Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-[1900px] mx-auto px-4 sm:px-8 md:px-12">
          <V4Reveal className="max-w-4xl mx-auto">
            <CyberCardGold padding="xl">
              <p className="text-h5 text-[#ffd700] mb-3">If you're evaluating eXp sponsors, structure matters.</p>
              <NeonGoldText as="h2" className="text-h2 mb-6">
                Support Without Giving Up Independence
              </NeonGoldText>
              <p className="text-body text-lg mb-10 opacity-80">
                Systems, training, and community designed for agent growth without commission splits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <V4MagneticButton><CTAButton href="/join-exp-sponsor-team/">Join The Alliance</CTAButton></V4MagneticButton>
                <V4MagneticButton><SecondaryButton href="/join-exp-sponsor-team/">Book a Call</SecondaryButton></V4MagneticButton>
                <V4MagneticButton><SecondaryButton href="/about-exp-realty/">Learn about eXp</SecondaryButton></V4MagneticButton>
              </div>
            </CyberCardGold>
          </V4Reveal>

          <p className="text-sm text-center mt-10 opacity-50 max-w-2xl mx-auto">
            Smart Agent Alliance is a sponsor team within eXp Realty, publicly traded under "EXPI".
          </p>
        </div>
      </section>
    </>
  );
}

// V4 Helper Components
function V4Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
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

function V4InteractiveCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`v4-interactive-card rounded-xl ${className}`}>{children}</div>;
}

function V4MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className="v4-magnetic inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

function V4Counter({ value, prefix = '', suffix = '', label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-h2 text-[#ffd700] v4-stat-number">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-body opacity-80">{label}</p>
    </div>
  );
}

function V4ExpandCard({ title, preview, content, highlight }: { title: string; preview: string; content: string; highlight: string }) {
  const [expanded, setExpanded] = useState(false);
  const borderClass = highlight === '#ffd700' ? 'border-l-[#ffd700]' : highlight === '#00ff88' ? 'border-l-[#00ff88]' : 'border-l-[#ff6b6b]';

  return (
    <V4InteractiveCard>
      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GenericCard padding="lg" className={`border-l-4 ${borderClass}`}>
          <div className="flex items-center justify-between">
            <h4 className="text-h5" style={{ color: highlight }}>{title}</h4>
            <span className="text-2xl transition-transform" style={{ transform: expanded ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
          </div>
          <p className="text-body opacity-70 mt-2">{expanded ? '' : preview}</p>
          <div className={`v4-expand-content ${expanded ? 'expanded' : ''}`}>
            <p className="text-body mt-4">{content}</p>
          </div>
        </GenericCard>
      </div>
    </V4InteractiveCard>
  );
}

function V4AnimatedCheck({ delay = 0 }: { delay?: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div ref={ref}>
      <svg
        className={`v4-check-animated w-6 h-6 ${isVisible ? 'visible' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00ff88"
        strokeWidth="3"
        style={{ animationDelay: `${delay}s` }}
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function V4CheckItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <li className="flex items-center gap-2 text-body text-sm opacity-80">
      <V4AnimatedCheck delay={delay} />
      <span>{children}</span>
    </li>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function TeamValueContent() {
  const searchParams = useSearchParams();
  const versionParam = searchParams.get('v');
  const version = versionParam ? parseInt(versionParam, 10) : 1;
  const currentVersion = version >= 1 && version <= 4 ? version : 1;

  return (
    <>
      <VersionSwitcher currentVersion={currentVersion} />
      <HeroSection />

      {currentVersion === 1 && <Version1 />}
      {currentVersion === 2 && <Version2 />}
      {currentVersion === 3 && <Version3 />}
      {currentVersion === 4 && <Version4 />}
    </>
  );
}

export default function TeamValueTest() {
  return (
    <main id="main-content">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-body opacity-60">Loading...</div>
        </div>
      }>
        <TeamValueContent />
      </Suspense>
    </main>
  );
}
