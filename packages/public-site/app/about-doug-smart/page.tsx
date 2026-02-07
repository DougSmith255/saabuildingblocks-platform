'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import { GenericCyberCardGold } from '@saa/shared/components/saa/cards';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';

// Cloudflare Images CDN URL
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

/**
 * About Doug Smart Page
 * Personal bio and background - Brand tone: awe-inspiring, futuristic, direct
 */
export default function AboutDougSmart() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Specialty", value: "Full-Stack Developer" },
    { label: "Ranking", value: "Top 1% eXp Team Builders" },
    { label: "Base", value: "Tiburon, California" }
  ];

  const systemsBuilt = [
    { name: "Agent Attraction Pages", desc: "Custom websites that recruit agents to your team" },
    { name: "Marketing Automations", desc: "Email sequences that nurture leads 24/7" },
    { name: "Lead Funnels", desc: "Capture systems that work while you sleep" },
    { name: "Brand Identity", desc: "Stand out in a sea of generic agents" },
    { name: "Social Media Templates", desc: "Ready-to-post content that builds your brand" },
    { name: "Revenue Systems", desc: "Passive income infrastructure" }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>DOUG SMART</H1>
              <Tagline className="mt-4">
                Your unfair advantage, engineered
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Profile Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Photo with ProfileCyberFrame (circular) */}
            <div className="lg:w-1/3 flex justify-center">
              <ProfileCyberFrame size="xl">
                <Image
                  src={DOUG_PROFILE_IMAGE}
                  alt="Doug Smart"
                  fill
                  sizes="(max-width: 768px) 224px, 256px"
                  className="object-cover"
                />
              </ProfileCyberFrame>
            </div>

            {/* Quick Stats */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <GenericCard key={index} padding="sm">
                    <p className="text-[#dcdbd5]/60" style={{ fontSize: 'var(--font-size-caption)' }}>{item.label}</p>
                    <p className="text-[#e5e4dd] font-medium" style={{ fontSize: 'var(--font-size-body)' }}>{item.value}</p>
                  </GenericCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The Builder</H2>
            </div>

            <div className="space-y-6 text-body">
              <p>
                Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and
                automations powering production workflows and attraction tools across the organization.
              </p>

              <p>
                With a Bachelor's degree in Industrial Design and a business minor, Doug spent four years building
                multi-million dollar homes during college. That experience forged the work ethic and attention to
                detail he now applies to building systems for agents.
              </p>

              <p>
                His specialty: transforming complex technology into competitive advantages. Passive revenue systems,
                branding, marketing automation—if it's digital and it helps agents win, Doug probably built it.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Systems Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Systems That Scale Your Business</H2>
              <p className="text-body mt-4">What you get access to when you join Smart Agent Alliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemsBuilt.map((system, index) => (
                <GenericCyberCardGold key={index} padding="md" className="h-full">
                  <h3 className="text-h6 mb-2">{system.name}</h3>
                  <p className="text-body opacity-80">{system.desc}</p>
                </GenericCyberCardGold>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Level Up?</H2>
            <p className="text-body mt-4 mb-8">
              Join The Alliance and get access to the digital infrastructure that powers top-producing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/our-exp-team/">
                Meet The Team
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
