'use client';

import { H1, H2, Tagline, CTAButton, FAQ, GenericCard } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';

/**
 * Online Real Estate Brokerage Comparison Page
 * Compares eXp Realty, Real Broker, LPT Realty, and Fathom Realty
 */
export default function OnlineBrokerageComparison() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>CLOUD VS CLOUD</H1>
          <Tagline className="mt-4">
            eXp Realty vs Real Broker vs LPT Realty vs Fathom. The data tells the story.
          </Tagline>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <a href="#comparison-chart" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Chart Comparison
            </a>
            <a href="#detailed-analysis" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Detailed Analysis
            </a>
            <a href="#faq" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Chart Section */}
      <section id="comparison-chart" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>The Full Breakdown</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              Financial strength. Agent earnings. Fees. Support. Every metric that matters.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-300 border border-black"></span>
              <span className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Financial Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
              <span className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Agent Earnings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-black"></span>
              <span className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Agent Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-black"></span>
              <span className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Support</span>
            </div>
          </div>

          {/* Main Comparison Table */}
          <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <table className="w-full" style={{ fontSize: 'var(--font-size-caption)' }}>
              <thead>
                <tr className="bg-black/50 text-gold-500">
                  <th className="p-4 text-left text-link font-bold">Cloud Based Brokerage</th>
                  <th className="p-4 text-left text-link font-bold">eXp Realty</th>
                  <th className="p-4 text-left text-link font-bold">Real Broker</th>
                  <th className="p-4 text-left text-link font-bold">LPT Realty</th>
                  <th className="p-4 text-left text-link font-bold">Fathom Realty</th>
                </tr>
              </thead>
              <tbody className="text-body">
                {/* Financial Strength Rows */}
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">Founded</td>
                  <td className="p-4">2009</td>
                  <td className="p-4">2014</td>
                  <td className="p-4">2021</td>
                  <td className="p-4">2010</td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">GlassDoor Rating</td>
                  <td className="p-4">4.6 (3500 reviews)</td>
                  <td className="p-4">4.5 (109 reviews)</td>
                  <td className="p-4">4.3 (37 reviews)</td>
                  <td className="p-4">4.6 (425 reviews)</td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">GlassDoor Top 100</td>
                  <td className="p-4">2018-2024 (7 years)</td>
                  <td className="p-4">0</td>
                  <td className="p-4">0</td>
                  <td className="p-4">0</td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">Listed Stock</td>
                  <td className="p-4">EXPI (S&P 600) ~$14</td>
                  <td className="p-4">REAL ~$6</td>
                  <td className="p-4">Not Listed</td>
                  <td className="p-4">FATH ~$2</td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">Profitable Quarters</td>
                  <td className="p-4">
                    <span className="text-green-400">15 Profitable</span> / <span className="text-red-400">5 Non-Profitable</span>
                  </td>
                  <td className="p-4">
                    <span className="text-green-400">1 Profitable</span> / <span className="text-red-400">18 Non-Profitable</span>
                  </td>
                  <td className="p-4">Not Public</td>
                  <td className="p-4">
                    <span className="text-green-400">1 Profitable</span> / <span className="text-red-400">18 Non-Profitable</span>
                  </td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">Agent Count</td>
                  <td className="p-4">80,000+</td>
                  <td className="p-4">20,000+</td>
                  <td className="p-4">11,000+</td>
                  <td className="p-4">11,000+</td>
                </tr>

                {/* Agent Earnings Rows */}
                <tr className="border-t border-white/10 bg-green-500/10">
                  <td className="p-4 font-medium">Commission Split</td>
                  <td className="p-4">80/20 to 100/0 + $16K ICON bonus</td>
                  <td className="p-4">85/15 to 100/0 + $24K elite bonus</td>
                  <td className="p-4">80/20 to 100/0 (RSP) or 100/0 (BB)</td>
                  <td className="p-4">88/12 to 100/0 (Share) or 100/0 (Max)</td>
                </tr>
                <tr className="border-t border-white/10 bg-green-500/10">
                  <td className="p-4 font-medium">Income for Recruiting</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Yes</td>
                </tr>
                <tr className="border-t border-white/10 bg-green-500/10">
                  <td className="p-4 font-medium">Stock Production Awards</td>
                  <td className="p-4">$200 1st sale, $400 capping</td>
                  <td className="p-4">150 shares for capping</td>
                  <td className="p-4">75-150 shares for sales</td>
                  <td className="p-4">None</td>
                </tr>

                {/* Agent Fees Rows */}
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Production Cap</td>
                  <td className="p-4">$16K</td>
                  <td className="p-4">$12K</td>
                  <td className="p-4">$15K (RSP) / $5K (BB)</td>
                  <td className="p-4">$12K (Share) / $9K (Max)</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Annual Fees</td>
                  <td className="p-4">$1,020/yr ($85/mo)</td>
                  <td className="p-4">$750/yr (in 1st 3 sales)</td>
                  <td className="p-4">$500/yr + $0-149/mo</td>
                  <td className="p-4">$700/yr</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Transaction Fee (Post-Cap)</td>
                  <td className="p-4">$275</td>
                  <td className="p-4">$285 or 15%</td>
                  <td className="p-4">$195</td>
                  <td className="p-4">$165</td>
                </tr>

                {/* Support Rows */}
                <tr className="border-t border-white/10 bg-blue-500/10">
                  <td className="p-4 font-medium">Live Training Hours/Week</td>
                  <td className="p-4">50+</td>
                  <td className="p-4">30+</td>
                  <td className="p-4">None</td>
                  <td className="p-4">None</td>
                </tr>
                <tr className="border-t border-white/10 bg-blue-500/10">
                  <td className="p-4 font-medium">Free Sponsor Value</td>
                  <td className="p-4 text-green-400">Yes</td>
                  <td className="p-4 text-red-400">No</td>
                  <td className="p-4 text-red-400">No</td>
                  <td className="p-4 text-red-400">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Revenue Share Comparison */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Long-Term Wealth Building</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Revenue share determines your passive income potential. The differences are massive.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <table className="w-full" style={{ fontSize: 'var(--font-size-caption)' }}>
                <thead>
                  <tr className="bg-black/50">
                    <th className="p-4 text-left text-link font-bold">Rev Share MLM Brokerages</th>
                    <th className="p-4 text-left text-link font-bold">eXp Realty</th>
                    <th className="p-4 text-left text-link font-bold">Real Broker</th>
                    <th className="p-4 text-left text-link font-bold">LPT Realty</th>
                    <th className="p-4 text-left text-link font-bold">Fathom</th>
                  </tr>
                </thead>
                <tbody className="text-body">
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">Max $ for Rev Share Pool</td>
                    <td className="p-4">$8,000/agent</td>
                    <td className="p-4">$7,200/agent</td>
                    <td className="p-4">$2,500-7,500/agent</td>
                    <td className="p-4">$4,500-6,000/agent</td>
                  </tr>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">Pool Size (30% cap)</td>
                    <td className="p-4 text-green-400 font-bold">$204,000,000</td>
                    <td className="p-4">$43,000,000</td>
                    <td className="p-4">$16,500,000</td>
                    <td className="p-4">$16,000,000</td>
                  </tr>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">MLM Tiers</td>
                    <td className="p-4">7</td>
                    <td className="p-4">5</td>
                    <td className="p-4">7</td>
                    <td className="p-4">5</td>
                  </tr>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">Earn from EVERY Downline</td>
                    <td className="p-4 text-green-400">Yes</td>
                    <td className="p-4 text-red-400">No</td>
                    <td className="p-4 text-red-400">No</td>
                    <td className="p-4 text-red-400">No</td>
                  </tr>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">Fees to Earn Rev Share</td>
                    <td className="p-4 text-green-400">$0</td>
                    <td className="p-4">$175/yr + 1.2%</td>
                    <td className="p-4">$0 (90 day wait)</td>
                    <td className="p-4">$0</td>
                  </tr>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium">Willable Income</td>
                    <td className="p-4 text-green-400">Yes</td>
                    <td className="p-4">Yes (with qualifications)</td>
                    <td className="p-4">Yes</td>
                    <td className="p-4">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Detailed Analysis Section */}
      <LazySection height={800}>
        <section id="detailed-analysis" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Detailed Analysis</H2>
            </div>

            <div className="space-y-8 text-body">
              <GenericCard padding="md">
                <h3 className="text-h5 mb-3">Financial Strength and Profitability</h3>
                <p>eXp Realty demonstrates robust financial health with 15 profitable quarters out of 20. Real Broker and Fathom Realty each have only one profitable quarter out of 19, and LPT Realty's financial details are not publicly available. This profitability is reflected in their stock performance: eXp Realty (EXPI) trades around $14, Real Broker (REAL) around $6, and Fathom Realty (FATH) around $2.</p>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-h5 mb-3">Agent Count and Geographic Reach</h3>
                <p>eXp Realty leads with over 80,000 agents, operating in all 50 states and 24 countries. Real Broker follows with 20,000+ agents in 50 states and 2 countries. LPT Realty and Fathom Realty each have 11,000+ agents, but LPT Realty is active in 24 states and 1 country, while Fathom Realty covers 41 states and 5 countries.</p>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-h5 mb-3">Revenue Share and Stock Awards</h3>
                <p>eXp Realty leads with a potential revenue share pool of $204 million if 30% of its agents cap, significantly higher than Real Broker's $43 million and LPT Realty's $16.5 million. eXp Realty agents earn revenue share across seven tiers, compared to five tiers for both Real Broker and Fathom, and seven for LPT Realty. Only eXp offers stock awards for attracting agents and completing transactions.</p>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-h5 mb-3">Training and Support</h3>
                <p>Unique to eXp Realty is its extensive support system, including 50+ live training hours per week and a virtual world (eXp World 2.0). Real Broker offers 30+ live training hours but lacks a virtual world. LPT Realty and Fathom Realty do not provide such extensive training options. eXp Realty also offers healthcare options and a 60/40 mentorship program for the first three sales.</p>
              </GenericCard>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <CTAButton href="/about-exp-realty/">
                More About eXp
              </CTAButton>
              <CTAButton href="/join-exp-sponsor-team/">
                Join Our Team
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ Section */}
      <LazySection height={600}>
        <section id="faq" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>

            <FAQ
              items={[
                {
                  question: "Which online brokerage has the best commission split?",
                  answer: "All four brokerages offer paths to 100% commission. eXp Realty starts at 80/20 with a $16K cap, Real Broker at 85/15 with a $12K cap, LPT Realty varies by plan ($5K-15K cap), and Fathom offers 88/12 with a $9K-12K cap depending on the plan."
                },
                {
                  question: "Which brokerage is the most financially stable?",
                  answer: "eXp Realty demonstrates the strongest financial health with 15 profitable quarters out of 20, compared to just 1 profitable quarter for both Real Broker and Fathom. eXp is also listed on the S&P 600 with stock trading around $14."
                },
                {
                  question: "What makes eXp Realty's revenue share different?",
                  answer: "eXp Realty has the largest revenue share pool ($204M if 30% of agents cap), offers 7 tiers of earnings, allows you to earn from EVERY downline agent (not just qualifying ones), has no fees to participate, and provides a clear retirement and willable income path."
                },
                {
                  question: "Which brokerage offers the best training?",
                  answer: "eXp Realty offers 50+ live training hours per week, the most of any online brokerage. Real Broker offers 30+ hours. LPT Realty and Fathom do not offer live training beyond online courses."
                },
                {
                  question: "Can I build a retirement income with these brokerages?",
                  answer: "Yes, all four offer some form of passive income through revenue share. eXp Realty has the clearest path with no production requirements to earn, while Real Broker and Fathom require minimum production to maintain eligibility."
                }
              ]}
              allowMultiple={false}
            />
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Make the Move?</H2>
            <p className="text-body mt-4 mb-8">
              Stop leaving money on the table. Join the Alliance at eXp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join Our Team
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                Learn About Our Value
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
