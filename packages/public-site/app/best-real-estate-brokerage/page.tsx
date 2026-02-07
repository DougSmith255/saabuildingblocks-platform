'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import { GenericCyberCardGold } from '@saa/shared/components/saa/cards';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Best Real Estate Brokerage - Parent Comparison Page
 * Hub for all brokerage comparisons
 */
export default function BestRealEstateBrokerage() {
  const comparisons = [
    {
      title: "eXp vs Online Brokerages",
      description: "Compare eXp Realty to other cloud-based brokerages like Real, LPT Realty, and Fathom.",
      href: "/best-real-estate-brokerage/online/",
      highlight: "Cloud vs Cloud"
    },
    {
      title: "eXp vs Traditional Brokerages",
      description: "See how eXp stacks up against brick-and-mortar brokerages like Keller Williams, RE/MAX, and Coldwell Banker.",
      href: "/best-real-estate-brokerage/traditional/",
      highlight: "Cloud VS Traditional",
      tagline: "New School vs Old School"
    }
  ];

  const whyCompare = [
    {
      title: "Commission Structure",
      description: "Understand how different splits, caps, and fees affect your take-home pay."
    },
    {
      title: "Technology & Tools",
      description: "Compare CRM systems, lead generation, and marketing tools included."
    },
    {
      title: "Passive Income",
      description: "Evaluate revenue share and stock programs for long-term wealth building."
    },
    {
      title: "Support & Training",
      description: "See what mentorship, training, and community support each brokerage offers."
    }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>KNOW THE NUMBERS</H1>
              <Tagline className="mt-4">
                Facts over feelings
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Comparison Cards */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Pick Your Battle</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              See how eXp stacks up against the competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((comparison, index) => (
              <a key={index} href={comparison.href} className="block group">
                <GenericCard hover padding="lg" className="h-full">
                  <div className="text-link font-medium mb-1" style={{ fontSize: 'var(--font-size-caption)' }}>{comparison.highlight}</div>
                  {'tagline' in comparison && comparison.tagline && (
                    <div className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>{comparison.tagline}</div>
                  )}
                  <h3 className="text-h5 mb-3">{comparison.title}</h3>
                  <p className="text-body mb-4">{comparison.description}</p>
                  <span className="text-link group-hover:underline">View Comparison →</span>
                </GenericCard>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Compare Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>What Actually Matters</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Your brokerage choice impacts your income for years. Focus on these.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyCompare.map((item, index) => (
                <GenericCard key={index} padding="md" className="h-full">
                  <h3 className="text-h6 mb-2">{item.title}</h3>
                  <p className="text-body">{item.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* eXp Highlights */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The eXp Edge</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                The numbers speak for themselves.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center items-stretch">
              <GenericCyberCardGold padding="lg" className="h-full">
                <p className="text-h3 mb-2 stat-3d-text">100%</p>
                <p className="text-body">Commission After Cap</p>
                <p className="text-caption mt-1">Cap at just $16,000</p>
              </GenericCyberCardGold>

              <GenericCyberCardGold padding="lg" className="h-full">
                <p className="text-h3 mb-2 stat-3d-text">$85</p>
                <p className="text-body">Monthly Fee</p>
                <p className="text-caption mt-1">No desk or franchise fees</p>
              </GenericCyberCardGold>

              <GenericCyberCardGold padding="lg" className="h-full">
                <p className="text-h3 mb-2 stat-3d-text">4</p>
                <p className="text-body">Income Streams</p>
                <p className="text-caption mt-1">Commission, stock, rev share, referrals</p>
              </GenericCyberCardGold>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Make the Move?</H2>
            <p className="text-body mt-4 mb-8">
              Stop leaving money on the table. Join the Alliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/about-exp-realty/">
                Learn About eXp
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
