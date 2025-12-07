'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';

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
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            EXP REALTY GLOBAL
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            A truly borderless brokerage with agents across <strong className="text-white">27+ countries</strong> speaking
            <strong className="text-white"> 10+ languages</strong>. Join the global real estate revolution.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[900px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <CyberCardHolographic key={index} className="p-8">
                <div className="text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <p className="text-gray-300">{stat.label}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Where We Operate</H2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-amber-400 mb-4">{region.name}</h3>
                <ul className="space-y-2">
                  {region.countries.map((country, cIndex) => (
                    <li key={cIndex} className="text-gray-300 flex items-center gap-2">
                      <span className="text-amber-400">•</span>
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Benefits */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-4">Benefits for Individual Agents</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to build a successful real estate business, anywhere in the world.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentBenefits.map((benefit, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-amber-400/30 transition-colors">
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Benefits */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-4">Benefits for Teams & Brokerages</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Scale your business internationally without the traditional overhead.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamBenefits.map((benefit, index) => (
              <CyberCardHolographic key={index} className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Share Note */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto text-center">
          <H2 className="mb-4">Global Revenue Share</H2>
          <p className="text-gray-300 mb-8">
            eXp Realty's revenue share program is available internationally - you can earn income from agents
            recruited not only all over the United States but also in <strong className="text-amber-400">24+ other countries</strong>.
          </p>
          <CTAButton href="/exp-realty-revenue-share-calculator/">
            Calculate Your Potential
          </CTAButton>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Go Global?</H2>
          <p className="text-gray-400 mb-8">
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

      <style jsx>{`
        @keyframes fadeInUp2025 {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </main>
  );
}
