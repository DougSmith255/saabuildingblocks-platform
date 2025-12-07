'use client';

import { H1, H2, CTAButton, FAQ } from '@saa/shared/components/saa';

/**
 * Online Real Estate Brokerage Comparison Page
 * Compares eXp Realty, Real Broker, LPT Realty, and Fathom Realty
 */
export default function OnlineBrokerageComparison() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.5) 100%), url(https://wp.saabuildingblocks.com/wp-content/uploads/2025/02/Online-Compare-Brokerages-desktop.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            ONLINE REAL ESTATE BROKERAGE COMPARISON
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            Comparing eXp Realty, Real Broker, LPT Realty, and Fathom Realty
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both' }}>
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
      <section id="comparison-chart" className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[1400px] mx-auto">
          <H2 className="text-center mb-4">Who Comes Out on Top?</H2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Comparing Financial Strength, Agent Earnings, Agent Fees, and Support for online real estate brokerages
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-300 border border-black"></span>
              <span className="text-gray-300 text-sm">Financial Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
              <span className="text-gray-300 text-sm">Agent Earnings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-black"></span>
              <span className="text-gray-300 text-sm">Agent Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-black"></span>
              <span className="text-gray-300 text-sm">Support</span>
            </div>
          </div>

          {/* Main Comparison Table */}
          <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-gold-500">
                  <th className="p-4 text-left text-amber-400 font-bold">Cloud Based Brokerage</th>
                  <th className="p-4 text-left text-amber-400 font-bold">eXp Realty</th>
                  <th className="p-4 text-left text-amber-400 font-bold">Real Broker</th>
                  <th className="p-4 text-left text-amber-400 font-bold">LPT Realty</th>
                  <th className="p-4 text-left text-amber-400 font-bold">Fathom Realty</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
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
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">States</td>
                  <td className="p-4">50</td>
                  <td className="p-4">50</td>
                  <td className="p-4">24</td>
                  <td className="p-4">41</td>
                </tr>
                <tr className="border-t border-white/10 bg-yellow-500/10">
                  <td className="p-4 font-medium">Countries</td>
                  <td className="p-4">24</td>
                  <td className="p-4">2</td>
                  <td className="p-4">1</td>
                  <td className="p-4">5</td>
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
                <tr className="border-t border-white/10 bg-green-500/10">
                  <td className="p-4 font-medium">Discounted Stock Purchase</td>
                  <td className="p-4">10% commission at 5% discount</td>
                  <td className="p-4">5-10% with bonus</td>
                  <td className="p-4">No Listed Stock</td>
                  <td className="p-4">No</td>
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
                  <td className="p-4 font-medium">Joining Fee</td>
                  <td className="p-4">$64</td>
                  <td className="p-4">$249</td>
                  <td className="p-4">$0</td>
                  <td className="p-4">$0</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Annual Fees</td>
                  <td className="p-4">$1,020/yr ($85/mo)</td>
                  <td className="p-4">$750/yr (in 1st 3 sales)</td>
                  <td className="p-4">$500/yr + $0-149/mo</td>
                  <td className="p-4">$700/yr</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Transaction Fee (Pre-Cap)</td>
                  <td className="p-4">$25</td>
                  <td className="p-4">$0</td>
                  <td className="p-4">$195</td>
                  <td className="p-4">$165-465</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">Transaction Fee (Post-Cap)</td>
                  <td className="p-4">$275</td>
                  <td className="p-4">$285 or 15%</td>
                  <td className="p-4">$195</td>
                  <td className="p-4">$165</td>
                </tr>
                <tr className="border-t border-white/10 bg-red-500/10">
                  <td className="p-4 font-medium">E&O Insurance</td>
                  <td className="p-4">$60/sale (capped $750)</td>
                  <td className="p-4">$30/sale</td>
                  <td className="p-4">$60/sale (capped $500)</td>
                  <td className="p-4">$35/sale</td>
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
                  <td className="p-4 font-medium">Mentorship</td>
                  <td className="p-4">60/40 for 1st 3 sales</td>
                  <td className="p-4">50/50 to 70/30</td>
                  <td className="p-4">55/45 for 1st 3 sales</td>
                  <td className="p-4">70/30 for 1st 3 sales</td>
                </tr>
                <tr className="border-t border-white/10 bg-blue-500/10">
                  <td className="p-4 font-medium">Free Sponsor Value</td>
                  <td className="p-4 text-green-400">Yes</td>
                  <td className="p-4 text-red-400">No</td>
                  <td className="p-4 text-red-400">No</td>
                  <td className="p-4 text-red-400">No</td>
                </tr>
                <tr className="border-t border-white/10 bg-blue-500/10">
                  <td className="p-4 font-medium">Healthcare Options</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">No</td>
                  <td className="p-4">Yes</td>
                </tr>
                <tr className="border-t border-white/10 bg-blue-500/10">
                  <td className="p-4 font-medium">Partner Benefits</td>
                  <td className="p-4">33 partners</td>
                  <td className="p-4">10 partners</td>
                  <td className="p-4">3 partners</td>
                  <td className="p-4">2 partners</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <CTAButton href="/best-real-estate-brokerage/matchup/">
              Head-to-Head Brokerage Comparisons
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Revenue Share Comparison */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1400px] mx-auto">
          <H2 className="text-center mb-4">Who Has Better Long Term Benefits?</H2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Revenue share is a big player when it comes to long term benefits for online real estate brokerages
          </p>

          <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black">
                  <th className="p-4 text-left text-amber-400 font-bold">Rev Share MLM Brokerages</th>
                  <th className="p-4 text-left text-amber-400 font-bold">eXp Realty</th>
                  <th className="p-4 text-left text-amber-400 font-bold">Real Broker</th>
                  <th className="p-4 text-left text-amber-400 font-bold">LPT Realty</th>
                  <th className="p-4 text-left text-amber-400 font-bold">Fathom</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
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
                  <td className="p-4 font-medium">Retirement Income Path</td>
                  <td className="p-4 text-green-400">Yes</td>
                  <td className="p-4">Yes (with qualifications)</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Unknown</td>
                </tr>
                <tr className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4 font-medium">Willable Income</td>
                  <td className="p-4 text-green-400">Yes</td>
                  <td className="p-4">Yes (with qualifications)</td>
                  <td className="p-4">Yes</td>
                  <td className="p-4">Yes</td>
                </tr>
                <tr className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4 font-medium">Stock Awards for Attracting</td>
                  <td className="p-4">$200</td>
                  <td className="p-4">75 shares</td>
                  <td className="p-4">$0</td>
                  <td className="p-4">$0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed Analysis Section */}
      <section id="detailed-analysis" className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[1000px] mx-auto">
          <H2 className="text-center mb-8">Detailed Analysis</H2>

          <div className="space-y-8 text-gray-300">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Founding Year and Agent Satisfaction</h3>
              <p>eXp Realty, founded in 2009, boasts a strong GlassDoor rating of 4.6 from 3,500 reviews and has consistently made it to GlassDoor's top 100 companies list from 2018 to 2024. Real Broker, established in 2014, holds a 4.5 rating from 109 reviews. LPT Realty, the newest at 2021, has a rating of 4.3 from 37 reviews. Fathom Realty, founded in 2010, also enjoys a high rating of 4.6 from 425 reviews but hasn't made the GlassDoor top 100 list.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Financial Strength and Profitability</h3>
              <p>eXp Realty demonstrates robust financial health with 15 profitable quarters out of 20. Real Broker and Fathom Realty each have only one profitable quarter out of 19, and LPT Realty's financial details are not publicly available. This profitability is reflected in their stock performance: eXp Realty (EXPI) trades around $14, Real Broker (REAL) around $6, and Fathom Realty (FATH) around $2.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Agent Count and Geographic Reach</h3>
              <p>eXp Realty leads with over 80,000 agents, operating in all 50 states and 24 countries. Real Broker follows with 20,000+ agents in 50 states and 2 countries. LPT Realty and Fathom Realty each have 11,000+ agents, but LPT Realty is active in 24 states and 1 country, while Fathom Realty covers 41 states and 5 countries.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Commission Splits and Incentives</h3>
              <p>eXp Realty offers an 80/20 split, with the potential to earn 100% commission and a $16K ICON agent bonus. Real Broker provides an 85/15 split, also moving to 100% with a $24K elite agent bonus. LPT Realty offers varying splits, including 80/20 to 100/0 if RSP or 100/0 if BB, plus stock for top agent bonuses. Fathom Realty offers an 88/12 to 100/0 split under their SHARE program or 100/0 if in the MAX program.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Revenue Share and Stock Awards</h3>
              <p>eXp Realty leads with a potential revenue share pool of $204 million if 30% of its agents cap, significantly higher than Real Broker's $43 million and LPT Realty's $16.5 million. eXp Realty agents earn revenue share across seven tiers, compared to five tiers for both Real Broker and Fathom, and seven for LPT Realty. Only eXp offers stock awards for attracting agents and completing transactions.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Additional Benefits and Training</h3>
              <p>Unique to eXp Realty is its extensive support system, including 50+ live training hours per week and a virtual world (eXp World 2.0). Real Broker offers 30+ live training hours but lacks a virtual world. LPT Realty and Fathom Realty do not provide such extensive training options. eXp Realty also offers healthcare options and a 60/40 mentorship program for the first three sales.</p>
            </div>
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

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Frequently Asked Questions</H2>

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
                question: "What are the annual fees at each brokerage?",
                answer: "eXp Realty: $1,020/yr ($85/mo). Real Broker: $750/yr paid in first 3 sales. LPT Realty: $500/yr + optional monthly plans ($0-149/mo). Fathom: $700/yr due at first sale or year-end."
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

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Make the Move?</H2>
          <p className="text-gray-400 mb-8">
            Join the Smart Agent Alliance team at eXp Realty and get access to exclusive training, tools, and support.
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
