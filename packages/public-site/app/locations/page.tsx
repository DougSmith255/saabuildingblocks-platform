'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';

/**
 * eXp Realty Global Locations Page
 * Shows eXp's international presence
 */
export default function Locations() {
  const stats = [
    { value: "27+", label: "Countries" },
    { value: "88,000+", label: "Agents Worldwide" },
    { value: "10+", label: "Languages" }
  ];

  const regions = [
    {
      name: "North America",
      countries: ["United States", "Canada", "Mexico"]
    },
    {
      name: "Europe",
      countries: ["United Kingdom", "Germany", "France", "Spain", "Portugal", "Italy", "Poland", "Greece"]
    },
    {
      name: "Asia-Pacific",
      countries: ["Australia", "New Zealand", "India", "Hong Kong", "Japan"]
    },
    {
      name: "Other Regions",
      countries: ["Israel", "Colombia", "Brazil", "South Africa", "Puerto Rico"]
    }
  ];

  const agentBenefits = [
    { title: "75/25 Split", description: "Starting commission split with path to 100%" },
    { title: "CRM Tools", description: "Full CRM with portal access" },
    { title: "Custom Website", description: "IDX-integrated personal website" },
    { title: "24-Hour Payments", description: "Fast commission processing" },
    { title: "Stock Equity", description: "Shares in publicly traded company" },
    { title: "Global Referrals", description: "Earn from international referrals" }
  ];

  const teamBenefits = [
    { title: "Royalty-Free", description: "Own your brand without royalty fees" },
    { title: "Portal Coverage", description: "Administrative costs covered" },
    { title: "Support Staff", description: "Access to corporate support team" },
    { title: "International Expansion", description: "Grow across 27+ countries" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>EXP REALTY GLOBAL</H1>
          <Tagline className="mt-4">
            A truly borderless brokerage with agents across 27+ countries speaking 10+ languages
          </Tagline>
        </div>
      </HeroSection>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <GenericCard key={index} padding="lg" centered>
                <div className="text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <p className="text-[#dcdbd5]">{stat.label}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Where We Operate</H2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <GenericCard key={index} padding="md">
                <h3 className="text-xl font-bold text-amber-400 mb-4">{region.name}</h3>
                <ul className="space-y-2">
                  {region.countries.map((country, cIndex) => (
                    <li key={cIndex} className="text-[#dcdbd5] flex items-center gap-2">
                      <span className="text-amber-400">•</span>
                      {country}
                    </li>
                  ))}
                </ul>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Benefits */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Benefits for Individual Agents</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Everything you need to build a successful real estate business, anywhere in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentBenefits.map((benefit, index) => (
              <GenericCard key={index} padding="md" hover>
                <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">{benefit.title}</h3>
                <p className="text-[#dcdbd5]/80">{benefit.description}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Benefits */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Benefits for Teams & Brokerages</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Scale your business internationally without the traditional overhead.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamBenefits.map((benefit, index) => (
              <GenericCard key={index} padding="md">
                <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">{benefit.title}</h3>
                <p className="text-[#dcdbd5]/80">{benefit.description}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Share Note */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <H2>Global Revenue Share</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            eXp Realty's revenue share program is available internationally - you can earn income from agents
            recruited not only all over the United States but also in <strong className="text-amber-400">24+ other countries</strong>.
          </p>
          <CTAButton href="/exp-realty-revenue-share-calculator/">
            Calculate Your Potential
          </CTAButton>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready to Go Global?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            Join the fastest-growing global brokerage and expand your business across borders.
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
