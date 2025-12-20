'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { PathSelectorWithContent } from '@/app/components/sections/PathSelectorWithContent';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { SatelliteConstellationEffect } from '@/components/shared/hero-effects/SatelliteConstellationEffect';

/**
 * About eXp Realty Page
 * Overview of eXp Realty's features, benefits, and business model
 * Brand tone: awe-inspiring, futuristic, direct
 */
export default function AboutExpRealty() {
  const keyFeatures = [
    {
      title: "Commission Structure",
      description: "80/20 split until you cap at $16,000. Then 100% commission. ICON agents get the $16K back in stock."
    },
    {
      title: "$85/Month Flat",
      description: "No desk fees. No franchise fees. No royalty fees. Just $85/month covers everything."
    },
    {
      title: "Full Tech Stack",
      description: "kvCORE CRM, IDX website, automated marketing, transaction management—all included."
    },
    {
      title: "Lead Generation",
      description: "Access to Opcity, Referral Exchange, and other lead generation partnerships."
    },
    {
      title: "4,000+ Regus Offices",
      description: "Professional office space worldwide when you need to meet clients face-to-face."
    },
    {
      title: "2,000+ Support Staff",
      description: "Salaried employees dedicated to agent success—not competing against you."
    },
    {
      title: "50+ Weekly Trainings",
      description: "Live sessions in eXp World covering production, marketing, mindset, and more."
    },
    {
      title: "Your Brand, Your Way",
      description: "Full flexibility to build your personal brand. No mandatory brokerage branding."
    }
  ];

  const incomeStreams = [
    { title: "Commission", description: "Up to 100% on every deal after cap", number: "1" },
    { title: "Stock Awards", description: "Earn EXPI stock for milestones and production", number: "2" },
    { title: "Revenue Share", description: "7-tier passive income from agents you attract", number: "3" },
    { title: "Referrals", description: "25% referral fee for sending business to other agents", number: "4" }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <SatelliteConstellationEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>ABOUT EXP REALTY</H1>
            <Tagline className="mt-4">
              The network behind your net worth
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Path Selector - synced with homepage via localStorage */}
      <PathSelectorWithContent showContentBelow={false} />

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <CyberCard padding="md">
              <div className="text-h3 text-[#ffd700] mb-2">89,000+</div>
              <p className="text-body">Agents Worldwide</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-h3 text-[#ffd700] mb-2">24+</div>
              <p className="text-body">Countries</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-h3 text-[#ffd700] mb-2">100%</div>
              <p className="text-body">Commission After Cap</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-h3 text-[#ffd700] mb-2">$85</div>
              <p className="text-body">Per Month</p>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* Key Features Grid - Lazy loaded */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>What eXp Provides</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Everything you need to dominate your market. All included in your $85/month.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyFeatures.map((feature, index) => (
                <GenericCard key={index} padding="md" hover className="h-full">
                  <h3 className="text-h5 mb-2">{feature.title}</h3>
                  <p className="text-caption opacity-80">{feature.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Income Streams - Lazy loaded */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>4 Ways to Build Wealth</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Most brokerages offer one income stream. eXp offers four.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {incomeStreams.map((stream, index) => (
                <GenericCard key={index} padding="md" centered className="h-full">
                  <div className="text-h3 text-[#ffd700]/20 mb-2">{stream.number}</div>
                  <h3 className="text-h5 mb-2">{stream.title}</h3>
                  <p className="text-caption opacity-80">{stream.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Revenue Share Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <CyberCardGold padding="lg">
              <div className="text-center">
                <NeonGoldText as="h3" className="text-h4 mb-4">Revenue Share Program</NeonGoldText>
                <p className="text-body mb-4">
                  eXp's 7-tier revenue share program generates passive income that can continue
                  even after you leave the company—and can be willed to your loved ones.
                </p>
                <p className="text-body mb-6">
                  Potential: <strong className="text-[#ffd700]">$94,000+ per year</strong> in additional earnings.
                </p>
                <CTAButton href="/exp-realty-revenue-share-calculator/">
                  Calculate Your Potential
                </CTAButton>
              </div>
            </CyberCardGold>
          </div>
        </section>
      </LazySection>

      {/* Specialized Divisions - Lazy loaded */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Specialized Divisions</H2>
              <p className="text-body mt-4">Expand into new markets with eXp's specialized programs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GenericCard padding="md" hover>
                <h3 className="text-h5 mb-3">eXp Commercial</h3>
                <p className="text-body opacity-80">Access commercial real estate training, resources, and a network of commercial agents.</p>
              </GenericCard>

              <GenericCard padding="md" hover>
                <h3 className="text-h5 mb-3">eXp Luxury</h3>
                <p className="text-body opacity-80">Specialized marketing, training, and branding for high-end properties and clients.</p>
              </GenericCard>

              <GenericCard padding="md" hover>
                <h3 className="text-h5 mb-3">Healthcare Benefits</h3>
                <p className="text-body opacity-80">Access to Clearwater Healthcare for you and your family—a rarity in real estate.</p>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Make the Switch?</H2>
            <p className="text-body mt-4 mb-8">
              Join The Alliance and get access to additional training, systems, and support on top of everything eXp provides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                See What We Offer
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
