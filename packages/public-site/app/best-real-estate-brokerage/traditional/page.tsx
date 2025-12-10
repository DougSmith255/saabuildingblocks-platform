'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';

/**
 * Traditional Brokerage Comparison Page
 * Compares eXp Realty vs traditional brick-and-mortar brokerages
 */
export default function TraditionalBrokerageComparison() {
  const comparisonData = [
    {
      category: "Commission Split",
      traditional: "50/50 to 70/30 typical",
      exp: "80/20 to 100% (after $16K cap)"
    },
    {
      category: "Monthly Fees",
      traditional: "$500-$2,000+ desk fees",
      exp: "$85/month flat fee"
    },
    {
      category: "Franchise Fees",
      traditional: "6-8% of gross commission",
      exp: "None"
    },
    {
      category: "Royalty Fees",
      traditional: "Up to 6% of commission",
      exp: "None"
    },
    {
      category: "Office Space",
      traditional: "Fixed location required",
      exp: "4,000+ Regus locations worldwide"
    },
    {
      category: "Technology",
      traditional: "Varies, often outdated",
      exp: "Full CRM, IDX website, kvCORE included"
    },
    {
      category: "Training",
      traditional: "Limited, location-dependent",
      exp: "50+ weekly sessions in eXp World"
    },
    {
      category: "Stock Ownership",
      traditional: "Not available",
      exp: "Earn company stock"
    },
    {
      category: "Revenue Share",
      traditional: "Not available",
      exp: "7-tier passive income program"
    },
    {
      category: "Geographic Reach",
      traditional: "Local/regional only",
      exp: "Global - 27+ countries"
    }
  ];

  const traditionalPros = [
    "Physical office for client meetings",
    "Established local brand recognition",
    "In-person mentorship available",
    "Walk-in client opportunities"
  ];

  const traditionalCons = [
    "High desk fees ($500-$2,000+/month)",
    "Franchise and royalty fees eat into commission",
    "Lower commission splits (50-70%)",
    "Limited to local market",
    "No equity or stock ownership",
    "No passive income opportunities",
    "Outdated technology in many cases",
    "Geographic restrictions on growth"
  ];

  const expPros = [
    "Up to 100% commission after cap",
    "Only $85/month - no desk fees",
    "No franchise or royalty fees",
    "Stock ownership opportunities",
    "7-tier revenue share program",
    "Global reach - 27+ countries",
    "Modern technology included",
    "50+ weekly training sessions",
    "Work from anywhere flexibility"
  ];

  const expCons = [
    "No dedicated physical office",
    "Requires self-motivation",
    "Virtual model may not suit all clients",
    "Building local presence takes effort"
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>EXP VS TRADITIONAL BROKERAGES</H1>
          <Tagline className="mt-4">
            How does eXp Realty compare to traditional brick-and-mortar brokerages like Keller Williams, RE/MAX, and Coldwell Banker?
          </Tagline>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <GenericCard padding="md" centered>
              <div className="text-3xl font-bold text-amber-400 mb-2">$85</div>
              <p className="text-[#dcdbd5] text-sm">eXp Monthly Fee</p>
              <p className="text-[#dcdbd5]/60 text-xs mt-1">vs $500-$2,000+ traditional</p>
            </GenericCard>

            <GenericCard padding="md" centered>
              <div className="text-3xl font-bold text-amber-400 mb-2">100%</div>
              <p className="text-[#dcdbd5] text-sm">Commission After Cap</p>
              <p className="text-[#dcdbd5]/60 text-xs mt-1">vs 50-70% traditional</p>
            </GenericCard>

            <GenericCard padding="md" centered>
              <div className="text-3xl font-bold text-amber-400 mb-2">$0</div>
              <p className="text-[#dcdbd5] text-sm">Franchise Fees</p>
              <p className="text-[#dcdbd5]/60 text-xs mt-1">vs 6-8% traditional</p>
            </GenericCard>

            <GenericCard padding="md" centered>
              <div className="text-3xl font-bold text-amber-400 mb-2">7</div>
              <p className="text-[#dcdbd5] text-sm">Revenue Share Tiers</p>
              <p className="text-[#dcdbd5]/60 text-xs mt-1">vs 0 traditional</p>
            </GenericCard>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12">
              <H2>Side-by-Side Comparison</H2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-4 text-[#dcdbd5]/80 font-medium">Category</th>
                    <th className="text-left py-4 px-4 text-[#dcdbd5]/80 font-medium">Traditional</th>
                    <th className="text-left py-4 px-4 text-amber-400 font-medium">eXp Realty</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-4 text-[#e5e4dd] font-medium">{row.category}</td>
                      <td className="py-4 px-4 text-[#dcdbd5]/80">{row.traditional}</td>
                      <td className="py-4 px-4 text-green-400">{row.exp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Pros and Cons */}
      <LazySection height={700}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <H2>Pros & Cons</H2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional */}
              <div>
                <h3 className="text-xl font-bold text-[#e5e4dd] mb-6 text-center">Traditional Brokerages</h3>

                <div className="mb-6">
                  <h4 className="text-green-400 font-medium mb-3">Pros</h4>
                  <ul className="space-y-2">
                    {traditionalPros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-[#dcdbd5]">
                        <span className="text-green-400">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-red-400 font-medium mb-3">Cons</h4>
                  <ul className="space-y-2">
                    {traditionalCons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-[#dcdbd5]">
                        <span className="text-red-400">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* eXp */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-6 text-center">eXp Realty</h3>

                <div className="mb-6">
                  <h4 className="text-green-400 font-medium mb-3">Pros</h4>
                  <ul className="space-y-2">
                    {expPros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-[#dcdbd5]">
                        <span className="text-green-400">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-red-400 font-medium mb-3">Cons</h4>
                  <ul className="space-y-2">
                    {expCons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-[#dcdbd5]">
                        <span className="text-red-400">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Bottom Line */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto text-center">
            <H2>The Bottom Line</H2>
            <p className="text-[#dcdbd5] mt-4 mb-4">
              Traditional brokerages made sense when agents needed physical offices, fax machines, and local MLS access.
              Today, with cloud-based tools and remote work capabilities, eXp Realty offers a more cost-effective model
              with better earning potential.
            </p>
            <p className="text-[#dcdbd5] mb-8">
              The question isn't just about commission splits - it's about building long-term wealth through
              <strong className="text-amber-400"> stock ownership</strong> and <strong className="text-amber-400">revenue share</strong>,
              opportunities that traditional brokerages simply don't offer.
            </p>
          </div>
        </section>
      </LazySection>

      {/* Other Comparisons */}
      <LazySection height={250}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto text-center">
            <H2>More Comparisons</H2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <CTAButton href="/best-real-estate-brokerage/online/">
                vs Online Brokerages
              </CTAButton>
              <CTAButton href="/best-real-estate-brokerage/">
                All Comparisons
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <H2>Ready to Make the Switch?</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              Join thousands of agents who have moved from traditional brokerages to eXp Realty.
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
