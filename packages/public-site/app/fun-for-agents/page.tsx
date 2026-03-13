import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Fun for Agents Hub - Pillar Page
 * Links to entertainment and lifestyle content for real estate agents
 */

const articles = [
  { title: '15 Must-Read Books for Agents', href: '/blog/fun-for-agents/books', desc: 'The best real estate, business, and mindset books that top producers recommend.' },
  { title: 'Top 10 Real Estate Shows', href: '/blog/fun-for-agents/tv-shows', desc: 'The best real estate TV shows of all time - from guilty pleasures to actual learning.' },
  { title: 'Top 10 Real Estate Movies', href: '/blog/fun-for-agents/movies', desc: 'Movies every agent should watch - deals, drama, and lessons from the big screen.' },
  { title: 'Memorable Realtors in Movies', href: '/blog/fun-for-agents/realtors-in-movies', desc: 'The 10 most iconic real estate characters in film history.' },
  { title: 'Best Cars for Real Estate Agents', href: '/blog/fun-for-agents/best-cars', desc: 'Top 10 vehicles that balance professionalism, comfort, and client impressions.' },
  { title: '10 Gifts for Real Estate Agents', href: '/blog/fun-for-agents/realtor-gifts', desc: 'Thoughtful gift ideas for the agent in your life (or yourself).' },
  { title: "Ryan Serhant's Net Worth", href: '/blog/fun-for-agents/serhant-worth', desc: 'How Ryan Serhant built his empire and what agents can learn from his trajectory.' },
];

export default function FunForAgents() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>FUN FOR AGENTS</H1>
            <Tagline className="mt-4">Entertainment, books, and lifestyle for real estate pros</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              Not everything has to be about lead gen and commission splits. Here is the lighter side of real estate - the best books, movies, TV shows, cars, and gift ideas for agents.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* All Articles */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>All Articles</H2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <a key={a.href} href={a.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <h3 className="text-h6 mb-2">{a.title}</h3>
                    <p className="text-body mb-3" style={{ fontSize: 'var(--font-size-caption)' }}>{a.desc}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>Read more</span>
                  </GenericCard>
                </a>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Get Serious About Your Career?</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              When you are done binge-watching real estate shows, check out our marketing and career guides - or talk to us about joining eXp with the Smart Agent Alliance.
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
