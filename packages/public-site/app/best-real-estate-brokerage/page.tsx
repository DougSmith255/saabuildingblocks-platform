import { CTAButton } from '@saa/shared/components/saa/buttons';
import { GenericCard, GrainCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Best Real Estate Brokerage - Comprehensive Comparison Hub
 * Combines cloud vs cloud, cloud vs traditional, and all 67 head-to-head comparison links
 */

const cloudFinancialData = [
  { metric: 'Founded', exp: '2009', real: '2014', lpt: '2021', fathom: '2010' },
  { metric: 'Agent Count', exp: '80,000+', real: '20,000+', lpt: '11,000+', fathom: '11,000+' },
  { metric: 'Glassdoor Rating', exp: '4.4 (2,100 reviews)', real: '4.4 (155 reviews)', lpt: '3.5 (70 reviews)', fathom: '4.6 (70 reviews)' },
  { metric: 'Glassdoor Top 100', exp: '2018-2024 (7 years)', real: '0', lpt: '0', fathom: '0' },
  { metric: 'Listed Stock', exp: 'EXPI (S&P 600)', real: 'REAL', lpt: 'Not Listed', fathom: 'FATH' },
  { metric: 'Profitable Quarters', exp: '15 of 20', real: '1 of 19', lpt: 'Not Public', fathom: '1 of 19' },
];

const cloudFeesData = [
  { metric: 'Commission Split', exp: '80/20 -> 100/0 + $16K ICON bonus', real: '85/15 -> 100/0 + $24K RSUs', lpt: '80/20 or $500/txn flat', fathom: '100/0, 88/12, or 80/20 (by plan)' },
  { metric: 'Production Cap', exp: '$16,000', real: '$12,000', lpt: '$15K or $5K (by plan)', fathom: '$0 / $9K / $12K (by plan)' },
  { metric: 'Annual Fees', exp: '$1,020/yr ($85/mo)', real: '$750/yr + $249 startup', lpt: '$500/yr + $89-$149/mo', fathom: '$700/yr + $99 activation' },
  { metric: 'Transaction Fees', exp: '$25 pre-cap; $250 post-cap (first 20), $75 after', real: '$0 pre-cap; $285 post-cap', lpt: '$195/txn (after $2.5K GCI)', fathom: '$465/txn ($165 post-cap)' },
  { metric: 'E&O Insurance', exp: '$40/txn ($500/yr cap)', real: '$40/txn (CBR fee)', lpt: '$0 (included in annual fee)', fathom: '$35/txn' },
  { metric: 'Broker Review Fee', exp: '$85/txn', real: 'Included', lpt: 'Included', fathom: 'Included' },
];

const cloudEarningsData = [
  { metric: 'Revenue Share Income', exp: 'Yes', real: 'Yes', lpt: 'Yes', fathom: 'Yes' },
  { metric: 'Stock Production Awards', exp: '$200 1st sale, $400 capping', real: '150 shares for capping', lpt: '75-150 shares for sales', fathom: 'None' },
  { metric: 'Top Agent Bonus', exp: 'ICON $16K stock award', real: '$24K RSUs (vest 3 yrs)', lpt: 'Stock awards (private)', fathom: 'None' },
];

const revShareData = [
  { metric: 'Total Paid to Agents', exp: '$889M+', real: '-', lpt: '-', fathom: '-' },
  { metric: 'Max $ Per Agent for Pool', exp: '$8,000/agent', real: '$7,200/agent', lpt: '$2,500-$7,500/agent', fathom: '$4,500-$6,000/agent' },
  { metric: 'Pool Size (if 30% cap)', exp: '$204,000,000', real: '$43,000,000', lpt: '$16,500,000', fathom: '$16,000,000' },
  { metric: 'Tiers', exp: '7', real: '5', lpt: '7', fathom: '5' },
  { metric: 'Earn from EVERY Downline', exp: 'Yes', real: 'No', lpt: 'No', fathom: 'No' },
  { metric: 'Fees to Earn Rev Share', exp: '$0', real: '$175/yr + 1.2%', lpt: '$0 (90 day wait)', fathom: '$0' },
  { metric: 'Willable Income', exp: 'Yes', real: 'Yes (with qualifications)', lpt: 'Yes', fathom: 'Yes' },
];

const cloudVsTraditionalData = [
  { category: 'Commission Split', traditional: '50/50 to 70/30 typical', exp: '80/20 to 100% (after $16K cap)' },
  { category: 'Monthly Fees', traditional: '$500-$2,000+ desk fees', exp: '$85/month flat' },
  { category: 'Franchise Fees', traditional: '6-8% of gross commission', exp: 'None' },
  { category: 'Royalty Fees', traditional: 'Up to 6% of commission', exp: 'None' },
  { category: 'Office Space', traditional: 'Fixed location required', exp: '4,000+ Regus locations worldwide' },
  { category: 'Technology', traditional: 'Varies, often outdated', exp: 'Full CRM, IDX website, kvCORE included' },
  { category: 'Training', traditional: 'Limited, location-dependent', exp: '50+ weekly sessions in eXp World' },
  { category: 'Stock Ownership', traditional: 'Not available', exp: 'Earn company stock' },
  { category: 'Revenue Share', traditional: 'Not available (KW has profit share)', exp: '7-tier passive income program' },
  { category: 'Geographic Reach', traditional: 'Local/regional only', exp: 'Global - 29+ countries' },
];

const comparisonLinks = {
  'eXp Realty': [
    { label: 'eXp Realty vs The Agency', href: '/brokerage-comparison/exp-agency' },
    { label: 'eXp Realty vs Berkshire Hathaway', href: '/brokerage-comparison/exp-bh' },
    { label: 'eXp Realty vs Century 21', href: '/brokerage-comparison/exp-c21' },
    { label: 'eXp Realty vs Coldwell Banker', href: '/brokerage-comparison/exp-cb' },
    { label: 'eXp Realty vs Compass', href: '/brokerage-comparison/exp-compass' },
    { label: 'eXp Realty vs Corcoran', href: '/brokerage-comparison/exp-corcoran' },
    { label: 'eXp Realty vs Douglas Elliman', href: '/brokerage-comparison/exp-elliman' },
    { label: 'eXp Realty vs Fathom Realty', href: '/brokerage-comparison/exp-fathom' },
    { label: 'eXp Realty vs Keller Williams', href: '/brokerage-comparison/exp-kw' },
    { label: 'eXp Realty vs LPT Realty', href: '/brokerage-comparison/exp-lpt' },
    { label: 'eXp Realty vs Real Brokerage', href: '/brokerage-comparison/exp-real' },
    { label: 'eXp Realty vs Redfin', href: '/brokerage-comparison/exp-redfin' },
    { label: 'eXp Realty vs RE/MAX', href: '/brokerage-comparison/exp-remax' },
    { label: "eXp Realty vs Sotheby's", href: '/brokerage-comparison/exp-sothebys' },
  ],
  'Fathom Realty': [
    { label: 'eXp Realty vs Fathom Realty', href: '/brokerage-comparison/exp-fathom' },
    { label: 'Fathom vs The Agency', href: '/brokerage-comparison/fathom-agency' },
    { label: 'Fathom vs Berkshire Hathaway', href: '/brokerage-comparison/fathom-bh' },
    { label: 'Fathom vs Better Homes', href: '/brokerage-comparison/fathom-bhg' },
    { label: 'Fathom vs Century 21', href: '/brokerage-comparison/fathom-c21' },
    { label: 'Fathom vs Coldwell Banker', href: '/brokerage-comparison/fathom-cb' },
    { label: 'Fathom vs Compass', href: '/brokerage-comparison/fathom-compass' },
    { label: 'Fathom vs Corcoran', href: '/brokerage-comparison/fathom-corcoran' },
    { label: 'Fathom vs Douglas Elliman', href: '/brokerage-comparison/fathom-elliman' },
    { label: 'Fathom vs Keller Williams', href: '/brokerage-comparison/fathom-kw' },
    { label: 'Fathom vs Redfin', href: '/brokerage-comparison/fathom-redfin' },
    { label: 'Fathom vs RE/MAX', href: '/brokerage-comparison/fathom-remax' },
    { label: "Fathom vs Sotheby's", href: '/brokerage-comparison/fathom-sothebys' },
    { label: 'LPT vs Fathom Realty', href: '/brokerage-comparison/lpt-fathom' },
    { label: 'Real vs Fathom', href: '/brokerage-comparison/real-fathom' },
  ],
  'Real Brokerage': [
    { label: 'eXp Realty vs Real Brokerage', href: '/brokerage-comparison/exp-real' },
    { label: 'Real vs The Agency', href: '/brokerage-comparison/real-agency' },
    { label: 'Real vs Berkshire Hathaway', href: '/brokerage-comparison/real-bh' },
    { label: 'Real vs Better Homes', href: '/brokerage-comparison/real-bhg' },
    { label: 'Real vs Coldwell Banker', href: '/brokerage-comparison/real-cb' },
    { label: 'Real vs Compass', href: '/brokerage-comparison/real-compass' },
    { label: 'Real vs Corcoran', href: '/brokerage-comparison/real-corcoran' },
    { label: 'Real vs Douglas Elliman', href: '/brokerage-comparison/real-elliman' },
    { label: 'Real vs Fathom', href: '/brokerage-comparison/real-fathom' },
    { label: 'Real vs Keller Williams', href: '/brokerage-comparison/real-kw' },
    { label: 'Real vs LPT Realty', href: '/brokerage-comparison/real-lpt' },
    { label: 'Real vs Redfin', href: '/brokerage-comparison/real-redfin' },
    { label: "Real vs Sotheby's", href: '/brokerage-comparison/real-sothebys' },
  ],
  'LPT Realty': [
    { label: 'eXp Realty vs LPT Realty', href: '/brokerage-comparison/exp-lpt' },
    { label: 'LPT vs The Agency', href: '/brokerage-comparison/lpt-agency' },
    { label: 'LPT vs Berkshire Hathaway', href: '/brokerage-comparison/lpt-bh' },
    { label: 'LPT vs Better Homes', href: '/brokerage-comparison/lpt-bhhs' },
    { label: 'LPT vs Century 21', href: '/brokerage-comparison/lpt-c21' },
    { label: 'LPT vs Coldwell Banker', href: '/brokerage-comparison/lpt-cb' },
    { label: 'LPT vs Compass', href: '/brokerage-comparison/lpt-compass' },
    { label: 'LPT vs Corcoran', href: '/brokerage-comparison/lpt-corcoran' },
    { label: 'LPT vs Douglas Elliman', href: '/brokerage-comparison/lpt-elliman' },
    { label: 'LPT vs Fathom Realty', href: '/brokerage-comparison/lpt-fathom' },
    { label: 'LPT vs Redfin', href: '/brokerage-comparison/lpt-redfin' },
    { label: 'LPT vs RE/MAX', href: '/brokerage-comparison/lpt-remax' },
    { label: "LPT vs Sotheby's", href: '/brokerage-comparison/lpt-sothebys' },
    { label: 'Real vs LPT Realty', href: '/brokerage-comparison/real-lpt' },
  ],
  'Compass': [
    { label: 'eXp Realty vs Compass', href: '/brokerage-comparison/exp-compass' },
    { label: 'Fathom vs Compass', href: '/brokerage-comparison/fathom-compass' },
    { label: 'LPT vs Compass', href: '/brokerage-comparison/lpt-compass' },
    { label: 'Real vs Compass', href: '/brokerage-comparison/real-compass' },
    { label: 'Coldwell Banker vs Compass', href: '/brokerage-comparison/cb-compass' },
    { label: 'Compass vs The Agency', href: '/brokerage-comparison/compass-agency' },
    { label: 'Compass vs Corcoran', href: '/brokerage-comparison/compass-corcoran' },
    { label: 'Compass vs Keller Williams', href: '/brokerage-comparison/compass-kw' },
    { label: 'Compass vs Redfin', href: '/brokerage-comparison/compass-redfin' },
    { label: "Compass vs Sotheby's", href: '/brokerage-comparison/compass-sothebys' },
  ],
  'Keller Williams': [
    { label: 'eXp Realty vs Keller Williams', href: '/brokerage-comparison/exp-kw' },
    { label: 'Fathom vs Keller Williams', href: '/brokerage-comparison/fathom-kw' },
    { label: 'Real vs Keller Williams', href: '/brokerage-comparison/real-kw' },
    { label: 'Berkshire Hathaway vs Keller Williams', href: '/brokerage-comparison/bh-kw' },
    { label: 'Century 21 vs Keller Williams', href: '/brokerage-comparison/c21-kw' },
    { label: 'Coldwell Banker vs Keller Williams', href: '/brokerage-comparison/cb-kw' },
    { label: 'Compass vs Keller Williams', href: '/brokerage-comparison/compass-kw' },
    { label: 'Keller Williams vs Redfin', href: '/brokerage-comparison/kw-redfin' },
    { label: "Sotheby's vs Keller Williams", href: '/brokerage-comparison/sothebys-kw' },
  ],
  "Sotheby's International Realty": [
    { label: "eXp Realty vs Sotheby's", href: '/brokerage-comparison/exp-sothebys' },
    { label: "Fathom vs Sotheby's", href: '/brokerage-comparison/fathom-sothebys' },
    { label: "LPT vs Sotheby's", href: '/brokerage-comparison/lpt-sothebys' },
    { label: "Real vs Sotheby's", href: '/brokerage-comparison/real-sothebys' },
    { label: "Compass vs Sotheby's", href: '/brokerage-comparison/compass-sothebys' },
    { label: "Sotheby's vs Berkshire Hathaway", href: '/brokerage-comparison/sothebys-bh' },
    { label: "Sotheby's vs Coldwell Banker", href: '/brokerage-comparison/sothebys-cb' },
    { label: "Sotheby's vs Keller Williams", href: '/brokerage-comparison/sothebys-kw' },
  ],
  'Coldwell Banker': [
    { label: 'eXp Realty vs Coldwell Banker', href: '/brokerage-comparison/exp-cb' },
    { label: 'Fathom vs Coldwell Banker', href: '/brokerage-comparison/fathom-cb' },
    { label: 'LPT vs Coldwell Banker', href: '/brokerage-comparison/lpt-cb' },
    { label: 'Real vs Coldwell Banker', href: '/brokerage-comparison/real-cb' },
    { label: 'Century 21 vs Coldwell Banker', href: '/brokerage-comparison/c21-cb' },
    { label: 'Coldwell Banker vs Compass', href: '/brokerage-comparison/cb-compass' },
    { label: 'Coldwell Banker vs Keller Williams', href: '/brokerage-comparison/cb-kw' },
    { label: "Sotheby's vs Coldwell Banker", href: '/brokerage-comparison/sothebys-cb' },
  ],
  'Berkshire Hathaway HomeServices': [
    { label: 'eXp Realty vs Berkshire Hathaway', href: '/brokerage-comparison/exp-bh' },
    { label: 'Fathom vs Berkshire Hathaway', href: '/brokerage-comparison/fathom-bh' },
    { label: 'LPT vs Berkshire Hathaway', href: '/brokerage-comparison/lpt-bh' },
    { label: 'Real vs Berkshire Hathaway', href: '/brokerage-comparison/real-bh' },
    { label: 'Berkshire Hathaway vs Keller Williams', href: '/brokerage-comparison/bh-kw' },
    { label: "Sotheby's vs Berkshire Hathaway", href: '/brokerage-comparison/sothebys-bh' },
  ],
  'Redfin': [
    { label: 'eXp Realty vs Redfin', href: '/brokerage-comparison/exp-redfin' },
    { label: 'Fathom vs Redfin', href: '/brokerage-comparison/fathom-redfin' },
    { label: 'LPT vs Redfin', href: '/brokerage-comparison/lpt-redfin' },
    { label: 'Real vs Redfin', href: '/brokerage-comparison/real-redfin' },
    { label: 'Compass vs Redfin', href: '/brokerage-comparison/compass-redfin' },
    { label: 'Keller Williams vs Redfin', href: '/brokerage-comparison/kw-redfin' },
  ],
  'The Agency': [
    { label: 'eXp Realty vs The Agency', href: '/brokerage-comparison/exp-agency' },
    { label: 'Fathom vs The Agency', href: '/brokerage-comparison/fathom-agency' },
    { label: 'LPT vs The Agency', href: '/brokerage-comparison/lpt-agency' },
    { label: 'Real vs The Agency', href: '/brokerage-comparison/real-agency' },
    { label: 'Compass vs The Agency', href: '/brokerage-comparison/compass-agency' },
  ],
  'Century 21': [
    { label: 'eXp Realty vs Century 21', href: '/brokerage-comparison/exp-c21' },
    { label: 'Fathom vs Century 21', href: '/brokerage-comparison/fathom-c21' },
    { label: 'LPT vs Century 21', href: '/brokerage-comparison/lpt-c21' },
    { label: 'Century 21 vs Coldwell Banker', href: '/brokerage-comparison/c21-cb' },
    { label: 'Century 21 vs Keller Williams', href: '/brokerage-comparison/c21-kw' },
  ],
  'Corcoran': [
    { label: 'eXp Realty vs Corcoran', href: '/brokerage-comparison/exp-corcoran' },
    { label: 'Fathom vs Corcoran', href: '/brokerage-comparison/fathom-corcoran' },
    { label: 'LPT vs Corcoran', href: '/brokerage-comparison/lpt-corcoran' },
    { label: 'Real vs Corcoran', href: '/brokerage-comparison/real-corcoran' },
    { label: 'Compass vs Corcoran', href: '/brokerage-comparison/compass-corcoran' },
  ],
  'Douglas Elliman': [
    { label: 'eXp Realty vs Douglas Elliman', href: '/brokerage-comparison/exp-elliman' },
    { label: 'Fathom vs Douglas Elliman', href: '/brokerage-comparison/fathom-elliman' },
    { label: 'LPT vs Douglas Elliman', href: '/brokerage-comparison/lpt-elliman' },
    { label: 'Real vs Douglas Elliman', href: '/brokerage-comparison/real-elliman' },
  ],
  'RE/MAX': [
    { label: 'eXp Realty vs RE/MAX', href: '/brokerage-comparison/exp-remax' },
    { label: 'Fathom vs RE/MAX', href: '/brokerage-comparison/fathom-remax' },
    { label: 'LPT vs RE/MAX', href: '/brokerage-comparison/lpt-remax' },
  ],
  'Better Homes & Gardens RE': [
    { label: 'Fathom vs Better Homes', href: '/brokerage-comparison/fathom-bhg' },
    { label: 'LPT vs Better Homes', href: '/brokerage-comparison/lpt-bhhs' },
    { label: 'Real vs Better Homes', href: '/brokerage-comparison/real-bhg' },
  ],
};

const editorialLinks = [
  { label: 'Best Real Estate Companies to Work For By Commission Splits in 2026', href: '/brokerage-comparison/commissions' },
  { label: "Real Estate Brokerage Reviews You Can Actually Trust", href: '/brokerage-comparison/reviews' },
  { label: "Top Real Estate Companies: Who's Really Got Your Back?", href: '/brokerage-comparison/profits' },
];

function ComparisonTable({ headers, rows, highlightCol }: {
  headers: string[];
  rows: { values: string[] }[];
  highlightCol?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <table className="w-full" style={{ fontSize: 'var(--font-size-caption)' }}>
        <thead>
          <tr className="bg-black/50">
            {headers.map((h, i) => (
              <th key={i} className="p-4 text-left text-link font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-body">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/10 hover:bg-white/5">
              {row.values.map((val, j) => (
                <td
                  key={j}
                  className={`p-4 ${j === 0 ? 'font-medium' : ''} ${highlightCol !== undefined && j === highlightCol ? 'text-green-400' : ''}`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BestRealEstateBrokerage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>KNOW THE NUMBERS</H1>
            <Tagline className="mt-4">Facts over feelings</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              Choosing a brokerage shapes your income, your daily experience, and your long-term wealth. We break down the numbers across 15 brokerages so you can compare with facts, not sales pitches.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <a href="#cloud-comparison" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">Cloud vs Cloud</a>
              <a href="#traditional-comparison" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">Cloud vs Traditional</a>
              <a href="#all-comparisons" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">All 67 Matchups</a>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Cloud-Based Brokerage Comparison */}
      <section id="cloud-comparison" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Cloud-Based Brokerage Comparison</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto">
              The four major cloud brokerages - eXp Realty, Real Brokerage, LPT Realty, and Fathom Realty - all promise low fees and high splits. The differences show up in financial stability, revenue share structure, and support.
            </p>
          </div>

          {/* Financial Strength */}
          <h3 className="text-h5 mb-4">Financial Strength</h3>
          <ComparisonTable
            headers={['Metric', 'eXp Realty', 'Real Brokerage', 'LPT Realty', 'Fathom Realty']}
            rows={cloudFinancialData.map(d => ({ values: [d.metric, d.exp, d.real, d.lpt, d.fathom] }))}
            highlightCol={1}
          />
          <p className="text-body mt-4 mb-10">
            eXp is the only cloud brokerage with consistent profitability. Real and Fathom have each posted just one profitable quarter. LPT is privately held, so financial data isn't available.
          </p>

          {/* Commission Splits & Fees */}
          <h3 className="text-h5 mb-4">Commission Splits & Fees</h3>
          <ComparisonTable
            headers={['Metric', 'eXp Realty', 'Real Brokerage', 'LPT Realty', 'Fathom Realty']}
            rows={cloudFeesData.map(d => ({ values: [d.metric, d.exp, d.real, d.lpt, d.fathom] }))}
          />

          {/* Earnings & Wealth Building */}
          <h3 className="text-h5 mb-4 mt-10">Earnings & Wealth Building</h3>
          <ComparisonTable
            headers={['Metric', 'eXp Realty', 'Real Brokerage', 'LPT Realty', 'Fathom Realty']}
            rows={cloudEarningsData.map(d => ({ values: [d.metric, d.exp, d.real, d.lpt, d.fathom] }))}
          />
        </div>
      </section>

      {/* Revenue Share Deep Dive */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Revenue Share Deep Dive</H2>
              <p className="text-body mt-4 max-w-3xl mx-auto">
                Revenue share is where long-term wealth is built. All four cloud brokerages offer it, but the structures differ significantly.
              </p>
            </div>

            <ComparisonTable
              headers={['Metric', 'eXp Realty', 'Real Brokerage', 'LPT Realty', 'Fathom Realty']}
              rows={revShareData.map(d => ({ values: [d.metric, d.exp, d.real, d.lpt, d.fathom] }))}
              highlightCol={1}
            />
            <p className="text-body mt-4">
              eXp's revenue share pool is nearly 5x larger than the next closest competitor. It's also the only program where you earn from every agent in your downline, regardless of their production level.
            </p>
          </div>
        </section>
      </LazySection>

      {/* Training & Support */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <h3 className="text-h5 mb-4">Training & Support</h3>
            <ComparisonTable
              headers={['Metric', 'eXp Realty', 'Real Brokerage', 'LPT Realty', 'Fathom Realty']}
              rows={[
                { values: ['Live Training Hours/Week', '50+', '30+', 'Daily live + on-demand', '600+ on-demand courses'] },
                { values: ['24/7 Support', 'Yes', 'Yes (AI + live)', 'Yes', 'No'] },
                { values: ['Sponsor Value (Free Mentorship)', 'Yes', 'No', 'No', 'No'] },
              ]}
              highlightCol={1}
            />
          </div>
        </section>
      </LazySection>

      {/* Cloud vs Traditional */}
      <LazySection height={600}>
        <section id="traditional-comparison" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Cloud vs Traditional Brokerages</H2>
              <p className="text-body mt-4 max-w-3xl mx-auto">
                Traditional brokerages built the industry. Cloud brokerages are reshaping it. Here's how they compare on the metrics that matter most to your income.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 text-center mb-12">
              <GrainCard padding="md">
                <div className="text-h4 text-link mb-2">$85</div>
                <p className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>eXp Monthly Fee</p>
                <p className="text-caption mt-1">vs $500-$2,000+ traditional</p>
              </GrainCard>
              <GrainCard padding="md">
                <div className="text-h4 text-link mb-2">100%</div>
                <p className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Commission After Cap</p>
                <p className="text-caption mt-1">vs 50-70% traditional</p>
              </GrainCard>
              <GrainCard padding="md">
                <div className="text-h4 text-link mb-2">$0</div>
                <p className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Franchise Fees</p>
                <p className="text-caption mt-1">vs 6-8% traditional</p>
              </GrainCard>
              <GrainCard padding="md">
                <div className="text-h4 text-link mb-2">7</div>
                <p className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>Revenue Share Tiers</p>
                <p className="text-caption mt-1">vs 0 traditional</p>
              </GrainCard>
            </div>

            <ComparisonTable
              headers={['Category', 'Traditional Brokerages', 'eXp Realty']}
              rows={cloudVsTraditionalData.map(d => ({ values: [d.category, d.traditional, d.exp] }))}
              highlightCol={2}
            />

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <GenericCard padding="md">
                <h3 className="text-h5 mb-6 text-center">Traditional Brokerages</h3>
                <h4 className="text-green-400 font-medium mb-3">Pros</h4>
                <ul className="space-y-2 mb-6">
                  {['Physical office for client meetings', 'Established local brand recognition', 'In-person mentorship available', 'Walk-in client opportunities'].map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-body"><span className="text-green-400">+</span>{p}</li>
                  ))}
                </ul>
                <h4 className="text-red-400 font-medium mb-3">Cons</h4>
                <ul className="space-y-2">
                  {['High desk fees ($500-$2,000+/month)', 'Franchise and royalty fees eat into commission', 'Lower commission splits (50-70%)', 'Limited to local market', 'No equity or stock ownership', 'No passive income opportunities', 'Outdated technology in many cases', 'Geographic restrictions on growth'].map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-body"><span className="text-red-400">-</span>{c}</li>
                  ))}
                </ul>
              </GenericCard>

              <GenericCard padding="md">
                <h3 className="text-h5 text-link mb-6 text-center">eXp Realty</h3>
                <h4 className="text-green-400 font-medium mb-3">Pros</h4>
                <ul className="space-y-2 mb-6">
                  {['Up to 100% commission after cap', 'Only $85/month - no desk fees', 'No franchise or royalty fees', 'Stock ownership opportunities', '7-tier revenue share program ($889M+ paid out)', 'Global reach - 29+ countries', 'Modern technology included (kvCORE, CRM, IDX)', '50+ weekly training sessions', 'Work from anywhere flexibility'].map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-body"><span className="text-green-400">+</span>{p}</li>
                  ))}
                </ul>
                <h4 className="text-red-400 font-medium mb-3">Cons</h4>
                <ul className="space-y-2">
                  {['No dedicated physical office', 'Requires self-motivation', 'Virtual model may not suit all clients', 'Building local presence takes effort'].map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-body"><span className="text-red-400">-</span>{c}</li>
                  ))}
                </ul>
              </GenericCard>
            </div>

            <div className="text-body mt-8 max-w-3xl mx-auto">
              <p className="mb-4">
                Traditional brokerages made sense when agents needed physical offices, fax machines, and local MLS access. Today, with cloud-based tools and remote work capabilities, eXp Realty offers a more cost-effective model with better earning potential.
              </p>
              <p>
                The question isn't just about commission splits. It's about building long-term wealth through <strong className="text-link">stock ownership</strong> and <strong className="text-link">revenue share</strong> - opportunities that traditional brokerages simply don't offer.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* What Actually Matters */}
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
              {[
                { title: 'Commission Structure', body: "Understand how different splits, caps, and fees affect your take-home pay. A lower cap doesn't always mean more money if transaction fees are higher." },
                { title: 'Technology & Tools', body: 'Compare CRM systems, lead generation, and marketing tools included with your fees versus what you\'d pay separately.' },
                { title: 'Passive Income', body: 'Revenue share and stock programs create wealth beyond your next deal. The size of the pool, number of tiers, and qualification requirements vary dramatically.' },
                { title: 'Support & Training', body: 'Mentorship, live training hours, and community support make the biggest difference in your first few years - and when markets shift.' },
              ].map((item, i) => (
                <GenericCard key={i} padding="md" className="h-full">
                  <h3 className="text-h6 mb-2">{item.title}</h3>
                  <p className="text-body">{item.body}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* All Comparisons */}
      <LazySection height={800}>
        <section id="all-comparisons" className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Every Brokerage Comparison - Head to Head</H2>
              <p className="text-body mt-4 max-w-3xl mx-auto">
                67 in-depth matchups plus editorial guides. Find any brokerage below to see every comparison it appears in.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(comparisonLinks).map(([brokerage, links]) => (
                <GenericCard key={brokerage} padding="md">
                  <h3 className="text-h6 mb-3 text-link">{brokerage} ({links.length})</h3>
                  <ul className="space-y-1">
                    {links.map((link, i) => (
                      <li key={i}>
                        <a href={link.href} className="text-body hover:text-link transition-colors" style={{ fontSize: 'var(--font-size-caption)' }}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </GenericCard>
              ))}
            </div>

            {/* Editorial */}
            <div className="mt-8">
              <GenericCard padding="md">
                <h3 className="text-h6 mb-3 text-link">Guides & Editorial</h3>
                <ul className="space-y-1">
                  {editorialLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-body hover:text-link transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>

            <FAQ
              items={[
                {
                  question: 'Which cloud brokerage has the best commission split?',
                  answer: 'All four cloud brokerages offer paths to 100% commission. eXp Realty starts at 80/20 with a $16K cap. Real Brokerage starts at 85/15 with a $12K cap. LPT Realty varies by plan ($5K-$15K cap). Fathom offers three plans with caps ranging from $0 to $12K.',
                },
                {
                  question: 'Which brokerage is the most financially stable?',
                  answer: "eXp Realty has the strongest financial health with 15 profitable quarters out of 20, compared to just 1 profitable quarter each for Real Brokerage and Fathom. eXp is listed on the S&P 600. LPT is privately held with no public financial data.",
                },
                {
                  question: "What makes eXp Realty's revenue share different?",
                  answer: "eXp has the largest revenue share pool ($204M if 30% of agents cap), offers 7 tiers of earnings, lets you earn from every downline agent regardless of production, has no fees to participate, and has paid out over $889 million to date. It's also willable income.",
                },
                {
                  question: 'Which brokerage offers the best training?',
                  answer: 'eXp Realty offers 50+ live training hours per week, the most of any cloud brokerage. Real Brokerage offers 30+ hours. LPT offers daily live sessions. Fathom has 600+ on-demand courses but no live training schedule.',
                },
                {
                  question: 'Can I build retirement income with these brokerages?',
                  answer: 'All four cloud brokerages offer some form of passive income through revenue share. eXp has the clearest path with no production requirements to earn. Real and Fathom require minimum production to maintain eligibility.',
                },
              ]}
              allowMultiple={false}
            />
          </div>
        </section>
      </LazySection>

      {/* CTA */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Make the Move?</H2>
            <p className="text-body mt-4 mb-4">
              Numbers change, but the fundamentals don't. A brokerage should help you earn more, keep more, and build wealth beyond your next closing.
            </p>
            <p className="text-body mb-8">
              See how the numbers work for your situation with our <a href="/exp-commission-calculator" className="text-link hover:underline">commission calculator</a>, or <a href="/book-a-call" className="text-link hover:underline">book a call</a> to talk through it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
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
