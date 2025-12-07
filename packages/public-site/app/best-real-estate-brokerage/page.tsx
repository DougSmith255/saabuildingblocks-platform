'use client';

import { H1, H2, Tagline, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';

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
      highlight: "Cloud vs Brick & Mortar"
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
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>BROKERAGE COMPARISONS</H1>
          <Tagline className="mt-4">
            Find the best real estate brokerage for your career. Compare commission structures, fees, technology, and wealth-building opportunities.
          </Tagline>
        </div>
      </HeroSection>

      {/* Comparison Cards */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Choose a Comparison</H2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((comparison, index) => (
              <a key={index} href={comparison.href} className="block group">
                <CyberCardHolographic className="p-8 h-full transition-transform group-hover:scale-[1.02]">
                  <div className="text-amber-400 text-sm font-medium mb-2">{comparison.highlight}</div>
                  <h3 className="text-xl font-bold text-[#e5e4dd] mb-3">{comparison.title}</h3>
                  <p className="text-[#dcdbd5]/80 mb-4">{comparison.description}</p>
                  <span className="text-amber-400 group-hover:underline">View Comparison →</span>
                </CyberCardHolographic>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Compare Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>What to Consider</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Choosing a brokerage is one of the most important decisions in your real estate career.
              Here's what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCompare.map((item, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">{item.title}</h3>
                <p className="text-[#dcdbd5]/80 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* eXp Highlights */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Why Agents Choose eXp</H2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <p className="text-[#dcdbd5]">Commission After Cap</p>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">Cap at just $16,000</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">$85</div>
              <p className="text-[#dcdbd5]">Monthly Fee</p>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">No desk or franchise fees</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">4</div>
              <p className="text-[#dcdbd5]">Income Streams</p>
              <p className="text-[#dcdbd5]/60 text-sm mt-1">Commission, stock, rev share, referrals</p>
            </CyberCardHolographic>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready to Make a Change?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            Join the Wolf Pack and get access to all the resources, training, and support you need to succeed at eXp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
            </CTAButton>
            <CTAButton href="/about-exp-realty/">
              Learn About eXp
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
