'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';

// Cloudflare Images CDN URL
const KARRIE_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public';

/**
 * About Karrie Hill Page
 * Personal bio and background - Brand tone: awe-inspiring, futuristic, direct
 */
export default function AboutKarrieHill() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Credential", value: "eXp Certified Mentor" },
    { label: "Education", value: "JD, UC Berkeley Law (Top 5%)" },
    { label: "Base", value: "Tiburon, Marin County, CA" }
  ];

  const certifications = [
    "eXp Certified Mentor",
    "Real Estate Negotiation Expert",
    "Home Marketing Specialist",
    "Relocation Specialist",
    "Express Offers Certified"
  ];

  const achievements = [
    "Six-figure income in first full year—no cold calls, no door knocking",
    "#1 Agent YouTube channel in Marin County, California",
    "Featured on HGTV and in national magazines for interior design",
    "Frequent guest on KDOW \"The Real Estate Report\"",
    "Former professional stock trader (10+ years)",
    "UC Berkeley Law graduate (top 5% of class)"
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            {/* Dark elliptical vignette behind text for readability */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '200%',
                background: 'radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <H1>KARRIE HILL, JD</H1>
              <Tagline className="mt-4">
                Strategy meets success
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
                  src={KARRIE_PROFILE_IMAGE}
                  alt="Karrie Hill"
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
      <LazySection height={450}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The Strategist</H2>
            </div>

            <div className="space-y-6 text-body">
              <p>
                UC Berkeley Law graduate (<strong className="text-[#ffd700]">top 5% of her class</strong>), eXp Certified Mentor,
                and the strategic mind behind agent success at Smart Agent Alliance. Karrie built a
                <strong className="text-[#ffd700]"> six-figure real estate business in her first full year</strong>—no
                cold calls, no door knocking—using YouTube marketing strategies she now teaches to agents.
              </p>

              <p>
                Before real estate, Karrie practiced law, bought and sold homes, and spent over a decade as a
                professional stock trader. She holds the <strong className="text-[#e5e4dd]">#1 agent YouTube channel
                in Marin County, California</strong>, and is certified in Real Estate Negotiation, Home Marketing,
                Relocations, and Express Offers.
              </p>

              <p>
                A 30+ year Marin County resident. Karrie engineers results for agents who refuse to settle for average.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Achievements Section */}
      <LazySection height={450}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Track Record</H2>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <GenericCard key={index} padding="md">
                  <div className="flex items-start gap-4">
                    <div className="text-[#ffd700] text-h5 flex-shrink-0">✓</div>
                    <p className="text-body">{achievement}</p>
                  </div>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Certifications Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Certifications</H2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <GenericCard key={index} padding="sm" centered>
                  <p className="text-body font-medium">{cert}</p>
                </GenericCard>
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
              Get mentorship from Karrie and access the strategies that built a six-figure business in year one.
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
