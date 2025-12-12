'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';

/**
 * eXp Realty Global Locations Page
 * Shows eXp's international presence
 */
export default function Locations() {
  const stats = [
    { value: "28+", label: "Countries" },
    { value: "89,000+", label: "Agents Worldwide" },
    { value: "4,000+", label: "Regus Offices" }
  ];

  const regions = [
    {
      name: "North America",
      countries: ["United States", "Canada", "Mexico", "Puerto Rico"]
    },
    {
      name: "Europe",
      countries: ["United Kingdom", "Germany", "France", "Spain", "Portugal", "Italy", "Poland", "Greece", "Türkiye", "Luxembourg"]
    },
    {
      name: "Asia-Pacific",
      countries: ["Australia", "New Zealand", "India", "Hong Kong", "Dubai (UAE)"]
    },
    {
      name: "Middle East & Africa",
      countries: ["Israel", "Egypt", "South Africa"]
    },
    {
      name: "Latin America & Caribbean",
      countries: ["Colombia", "Brazil", "Panama", "Chile", "Peru", "Dominican Republic"]
    }
  ];

  const agentBenefits = [
    { title: "80/20 Split → 100%", description: "Cap at $16K, then keep everything you earn" },
    { title: "kvCORE CRM", description: "Full CRM, IDX website, and marketing automation included" },
    { title: "$85/Month Flat", description: "No desk fees. No franchise fees. No royalty fees." },
    { title: "ICON Program", description: "Hit production goals, get your $16K cap back in stock" },
    { title: "Stock Equity", description: "Earn shares in a publicly traded company" },
    { title: "Global Referrals", description: "25% referral fee from agents in 28+ countries" }
  ];

  const teamBenefits = [
    { title: "Zero Royalty Fees", description: "Build your brand without paying royalties" },
    { title: "2,000+ Support Staff", description: "Salaried employees dedicated to your success" },
    { title: "Cloud Infrastructure", description: "No brick-and-mortar overhead costs" },
    { title: "International Expansion", description: "Grow your team across 28+ countries" }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>GLOBAL PRESENCE</H1>
          <Tagline className="mt-4">
            Real estate without boundaries
          </Tagline>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <CyberCard key={index} padding="lg">
                <div className="text-h2 text-[#ffd700] mb-2">{stat.value}</div>
                <p className="text-body">{stat.label}</p>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Where eXp Operates</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Real estate without borders. Build your business anywhere on the planet.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region, index) => (
                <GenericCard key={index} padding="md">
                  <h3 className="text-h5 text-[#ffd700] mb-4">{region.name}</h3>
                  <ul className="space-y-2">
                    {region.countries.map((country, cIndex) => (
                      <li key={cIndex} className="text-body flex items-center gap-2">
                        <span className="text-[#ffd700]">•</span>
                        {country}
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Agent Benefits */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Agent Advantages</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Everything you need to dominate your market—included, not extra.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentBenefits.map((benefit, index) => (
                <GenericCard key={index} padding="md" hover>
                  <h3 className="text-h6 text-[#e5e4dd] mb-2">{benefit.title}</h3>
                  <p className="text-body">{benefit.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Team Benefits */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Team & Brokerage Power</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Scale internationally without brick-and-mortar overhead.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamBenefits.map((benefit, index) => (
                <GenericCard key={index} padding="md">
                  <h3 className="text-h6 text-[#e5e4dd] mb-2">{benefit.title}</h3>
                  <p className="text-body">{benefit.description}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Revenue Share Note */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Borderless Revenue Share</H2>
            <p className="text-body mt-4 mb-8">
              eXp's revenue share program works internationally—earn passive income from agents you attract
              across the United States and <strong className="text-[#ffd700]">28+ other countries</strong>.
            </p>
            <CTAButton href="/exp-realty-revenue-share-calculator/">
              Calculate Your Potential
            </CTAButton>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Go Global?</H2>
            <p className="text-body mt-4 mb-8">
              Join the fastest-growing cloud brokerage and build without borders.
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
