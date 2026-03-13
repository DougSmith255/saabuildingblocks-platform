import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Winning Clients Hub - Pillar Page
 * Links to all client acquisition and retention guides
 */

const articles = [
  { title: '15 Ways to Get Listings', href: '/blog/winning-clients/get-listings', desc: 'Proven methods to consistently land listing appointments and keep your pipeline full.' },
  { title: '10 Questions Homebuyers Ask', href: '/blog/winning-clients/homebuyer-questions', desc: 'The questions buyers will ask and how to answer them with confidence.' },
  { title: 'Listing Appointment Checklist', href: '/blog/winning-clients/listing-checklist', desc: 'Everything you need to prepare, present, and close at your next listing appointment.' },
  { title: 'Mastering Real Estate Negotiations', href: '/blog/winning-clients/negotiate', desc: 'Negotiation tactics that protect your clients and close more deals.' },
  { title: 'Client Gift Guide for Agents', href: '/blog/winning-clients/client-gifts', desc: '15+ thoughtful gift ideas that keep you top-of-mind after closing.' },
  { title: 'Final Walk-Through Guide', href: '/blog/winning-clients/walk-through', desc: 'What agents need to know about the final walk-through to avoid last-minute problems.' },
  { title: 'Buyer Agent Consultation Secrets', href: '/blog/winning-clients/buyer-consultation', desc: 'How to run a buyer consultation that wins trust and sets clear expectations.' },
  { title: 'Door Knocking for Real Estate', href: '/blog/winning-clients/door-knocking', desc: 'Turn cold doors into hot leads with scripts and strategies that actually work.' },
  { title: 'Open House Scripts That Convert', href: '/blog/winning-clients/open-house-scripts', desc: 'Top scripts to turn open house visitors into signed clients.' },
  { title: 'Real Estate Jokes for Ice-Breaking', href: '/blog/winning-clients/jokes', desc: 'Lighthearted humor that breaks the ice and builds rapport with clients.' },
  { title: 'Real Estate Math for Agents', href: '/blog/winning-clients/math', desc: 'Essential formulas for commissions, cap rates, ROI, and more - explained simply.' },
  { title: 'Listing Presentation Guide', href: '/blog/winning-clients/listing-presentation', desc: 'Build a listing presentation that stands out from every other agent in the room.' },
];

export default function WinningClients() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>WINNING CLIENTS</H1>
            <Tagline className="mt-4">12 guides to attract, convert, and keep clients</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              Getting clients is the job. These guides cover listing presentations, buyer consultations, negotiation tactics, lead conversion scripts, and the small touches that turn one transaction into a lifetime referral source.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* All Articles */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>All Client Guides</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                From first contact to closing gift - everything you need to win and keep clients.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <a key={a.href} href={a.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <h3 className="text-h6 mb-2">{a.title}</h3>
                    <p className="text-body mb-3" style={{ fontSize: 'var(--font-size-caption)' }}>{a.desc}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>Read guide</span>
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
                  question: 'How do I get more listings as a new agent?',
                  answer: 'Start with your sphere of influence, host open houses for other agents, door knock in target neighborhoods, and create local market content. Expired and FSBO listings are also high-conversion opportunities. Consistency matters more than any single tactic.',
                },
                {
                  question: 'What should I include in a listing presentation?',
                  answer: 'Your marketing plan (professional photos, staging, online exposure), a comparative market analysis, your track record, your communication plan, and a clear pricing strategy. Focus on what makes you different.',
                },
                {
                  question: 'How do I handle commission objections from buyers?',
                  answer: 'Be transparent about your value. Walk buyers through the services you provide - market analysis, negotiation, closing coordination, and more. Use a buyer consultation to set expectations early. Agents who clearly communicate value rarely lose clients over commission.',
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
            <H2>Win More Clients With Better Tools</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              Smart Agent Alliance members get listing presentation templates, buyer consultation scripts, and CRM workflows that help you convert more leads into signed clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/marketing-mastery/">
                Marketing Guides
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
