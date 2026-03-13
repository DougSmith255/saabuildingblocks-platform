import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Industry Trends Hub - Pillar Page
 * Links to all real estate industry analysis articles
 */

const articles = [
  { title: 'NAR Settlement Impact on Agent Fees', href: '/blog/industry-trends/nar-agent-fees', desc: 'How the NAR settlement changed commission structures and what it means for your business.' },
  { title: '10 Key NAR Court Findings', href: '/blog/industry-trends/nar-court-cases', desc: 'The court cases that reshaped buyer agent commissions and what every agent needs to know.' },
  { title: '9 Buyer Agent Problems from NAR Changes', href: '/blog/industry-trends/buyer-agent-problems', desc: 'The real challenges buyer agents face after the settlement and how to adapt.' },
  { title: 'Buyer Agent Commission Drop in 2026', href: '/blog/industry-trends/buyer-agent-commission', desc: 'The data behind commission compression and what top agents are doing differently.' },
  { title: 'Is Buyer Agent Pay Disappearing?', href: '/blog/industry-trends/buyer-agent-pay', desc: 'A clear-eyed look at where buyer agent compensation is heading and how to protect your income.' },
  { title: 'Sellers No Longer Pay Buyer Agents?', href: '/blog/industry-trends/buyer-pays-agent', desc: 'The reality behind the headlines and what the changes actually mean in practice.' },
  { title: 'Excel as a Buyer Agent in 2026', href: '/blog/industry-trends/buyer-change', desc: 'How to thrive as a buyer agent when the rules have changed.' },
  { title: 'Off-Market Listings Controversy', href: '/blog/industry-trends/exclusive-listings', desc: 'The Compass, Zillow, and eXp clash over pocket listings and what it means for the industry.' },
];

export default function IndustryTrends() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>REAL ESTATE INDUSTRY TRENDS</H1>
            <Tagline className="mt-4">Stay ahead of the changes reshaping the industry</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              The real estate industry is changing faster than ever. NAR settlements, commission restructuring, off-market listing debates, and shifting buyer-agent dynamics. These articles break down what is happening and what it means for your career.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* All Articles */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>All Industry Analysis</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                No spin - just clear analysis of what is changing and how to adapt.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <a key={a.href} href={a.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <h3 className="text-h6 mb-2">{a.title}</h3>
                    <p className="text-body mb-3" style={{ fontSize: 'var(--font-size-caption)' }}>{a.desc}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>Read analysis</span>
                  </GenericCard>
                </a>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>

            <FAQ
              items={[
                {
                  question: 'How did the NAR settlement change commissions?',
                  answer: 'The settlement eliminated the requirement for sellers to offer buyer agent compensation through the MLS. Buyer agents now need written agreements before showing homes. Most transactions still involve buyer agent compensation - it is just negotiated differently.',
                },
                {
                  question: 'Are agent commissions going down?',
                  answer: 'Average rates have dipped slightly, but the impact varies by market. Agents who clearly communicate their value still earn competitive commissions. The biggest change is how commissions are disclosed and negotiated, not necessarily the total amount.',
                },
                {
                  question: 'What is the controversy around off-market listings?',
                  answer: 'Some brokerages promote exclusive listings as a premium service, while others argue it reduces transparency and can hurt sellers by limiting exposure. The debate between maximum exposure and exclusive access continues to shape industry policy.',
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
            <H2>Navigate Change With the Right Brokerage</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              Industry shifts reward agents at brokerages built for the future. See how eXp's model positions agents to thrive regardless of market conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/best-real-estate-brokerage/">
                Compare Brokerages
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
