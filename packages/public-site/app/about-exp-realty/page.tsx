'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';

/**
 * About eXp Realty Page
 * Overview of eXp Realty's features, benefits, and business model
 */
export default function AboutExpRealty() {
  const keyFeatures = [
    {
      title: "Commission Structure",
      description: "Start at 80/20 split, cap at $16,000 paid to eXp, then earn 100%. ICON agents can receive the $16K back in company stock.",
      icon: "💰"
    },
    {
      title: "$85/Month",
      description: "Covers all services - no desk fees, franchise fees, or royalty fees.",
      icon: "📋"
    },
    {
      title: "CRM & Website",
      description: "Full CRM with IDX website and automated marketing included.",
      icon: "🌐"
    },
    {
      title: "Lead Generation",
      description: "Access to lead generation tools and partnerships.",
      icon: "🎯"
    },
    {
      title: "4,000+ Offices",
      description: "Access to Regus office locations worldwide.",
      icon: "🏢"
    },
    {
      title: "2,000+ Staff",
      description: "Salaried support staff ready to help you succeed.",
      icon: "👥"
    },
    {
      title: "50+ Weekly Trainings",
      description: "Live training sessions in eXp World metaverse.",
      icon: "📚"
    },
    {
      title: "Personal Branding",
      description: "Full flexibility to build your own brand.",
      icon: "✨"
    }
  ];

  const incomeStreams = [
    { title: "Production Commissions", description: "Earn up to 100% on your deals" },
    { title: "Stock Awards", description: "Receive company stock for milestones" },
    { title: "Revenue Share", description: "7-tier system for passive income" },
    { title: "Referral Income", description: "Earn from agent referrals" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>ABOUT EXP REALTY</H1>
          <Tagline className="mt-4">
            The fastest growing brokerage on the planet
          </Tagline>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <CyberCard padding="md">
              <div className="text-4xl font-bold text-amber-400 mb-2">89,000+</div>
              <p className="text-[#dcdbd5]">Agents Worldwide</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-4xl font-bold text-amber-400 mb-2">24+</div>
              <p className="text-[#dcdbd5]">Countries</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <p className="text-[#dcdbd5]">Commission After Cap</p>
            </CyberCard>

            <CyberCard padding="md">
              <div className="text-4xl font-bold text-amber-400 mb-2">$85</div>
              <p className="text-[#dcdbd5]">Per Month</p>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* Key Features Grid - Lazy loaded */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <H2>What eXp Provides</H2>
              <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
                Everything you need to build a successful real estate business, all included.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyFeatures.map((feature, index) => (
                <GenericCard key={index} padding="md" hover>
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-[#e5e4dd] font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#dcdbd5]/80 text-sm">{feature.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Income Streams - Lazy loaded */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <H2>4 Income Streams</H2>
              <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
                Multiple ways to build wealth as an eXp agent.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {incomeStreams.map((stream, index) => (
                <GenericCard key={index} padding="md" centered>
                  <div className="text-5xl font-bold text-amber-400/20 mb-2">{index + 1}</div>
                  <h3 className="text-[#e5e4dd] font-semibold text-xl mb-2">{stream.title}</h3>
                  <p className="text-[#dcdbd5]/80">{stream.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Revenue Share Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto text-center">
            <H2>Revenue Share Program</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              eXp's 7-tier revenue share program can generate significant passive income -
              potentially <strong className="text-amber-400">$94,000+ per year</strong> in additional earnings.
              This income can continue even after you leave the company and can be willed to your loved ones.
            </p>
            <CTAButton href="/exp-realty-revenue-share-calculator/">
              Calculate Your Potential
            </CTAButton>
          </div>
        </section>
      </LazySection>

      {/* Additional Benefits - Lazy loaded */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <H2>Additional Benefits</H2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GenericCard padding="md">
                <h3 className="text-[#e5e4dd] font-semibold text-xl mb-3">eXp Commercial</h3>
                <p className="text-[#dcdbd5]/80">Access to commercial real estate division for expanded opportunities.</p>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-[#e5e4dd] font-semibold text-xl mb-3">eXp Luxury</h3>
                <p className="text-[#dcdbd5]/80">Specialized luxury division for high-end properties and clients.</p>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-[#e5e4dd] font-semibold text-xl mb-3">Healthcare Options</h3>
                <p className="text-[#dcdbd5]/80">Access to Clearwater Healthcare benefits for you and your family.</p>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <H2>Ready to Learn More?</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              Discover why thousands of agents are joining eXp Realty every month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Wolf Pack
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                See Our Team Value
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
