import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Agent Career Info Hub - Pillar Page
 * Links to all career development guides for real estate agents
 */

const articles = [
  { title: 'Real Estate Agent Expenses in 2026', href: '/blog/agent-career-info/expenses', desc: 'What new agents should expect to spend in their first year and how to budget for it.' },
  { title: 'The Truth About Agent Hours', href: '/blog/agent-career-info/hours', desc: 'How many hours agents actually work, the flexibility trade-off, and schedule management.' },
  { title: 'Agent Side Hustles for 2026', href: '/blog/agent-career-info/side-hustles', desc: '11 ways to earn extra income that complement your real estate career.' },
  { title: 'Best Places to Be an Agent', href: '/blog/agent-career-info/best-places', desc: 'The top cities and markets where real estate agents earn the most and grow the fastest.' },
  { title: 'Game-Changing Agent Strategies', href: '/blog/agent-career-info/top-strategies', desc: 'Proven strategies top producers use to stay ahead of the competition.' },
  { title: 'How to Change Brokerages', href: '/blog/agent-career-info/change-brokerage', desc: 'A step-by-step guide to switching brokerages without losing momentum or clients.' },
  { title: 'I Got My License, Now What?', href: '/blog/agent-career-info/new-agent-steps', desc: '7 steps every newly licensed agent should take immediately to build momentum.' },
  { title: 'Starting in Real Estate', href: '/blog/agent-career-info/new-agent', desc: 'What new agents must know about the business before their first transaction.' },
  { title: 'How Hard Is the Real Estate Exam?', href: '/blog/agent-career-info/exam-difficulty', desc: 'Pass rates, study tips, and what to expect on exam day.' },
  { title: 'Recession-Proof Your Career', href: '/blog/agent-career-info/recession', desc: '16 steps to protect your income when the market gets tough.' },
  { title: '11 Ways Agents Use ChatGPT', href: '/blog/agent-career-info/chatgpt-uses', desc: 'Practical AI applications that save time on listings, emails, and client communication.' },
  { title: 'How Real Estate Teams Work', href: '/blog/agent-career-info/team-description', desc: 'Team structures, splits, roles, and how to decide if a team is right for you.' },
  { title: 'Questions Before Joining a Team', href: '/blog/agent-career-info/team-questions', desc: 'What to ask before signing on so you do not end up in the wrong team structure.' },
  { title: 'Real Estate Couples on Teams', href: '/blog/agent-career-info/couples', desc: 'How couples build successful real estate partnerships and manage work-life balance.' },
  { title: 'Brokerage Interview Questions', href: '/blog/agent-career-info/interview-questions', desc: '17 questions to ask any brokerage before you commit. Know before you sign.' },
  { title: 'Best Commissions by Brokerage', href: '/blog/agent-career-info/commissions', desc: 'How commission splits compare across the top brokerages in 2026.' },
  { title: 'Can You Succeed Part-Time?', href: '/blog/agent-career-info/part-time', desc: 'Realistic expectations for part-time agents and strategies to make it work.' },
  { title: 'Crush It With the Right Planner', href: '/blog/agent-career-info/planner', desc: 'How the right planning system keeps top agents organized and productive.' },
  { title: 'Unlicensed Assistant Roles', href: '/blog/agent-career-info/unlicensed-tasks', desc: 'What unlicensed assistants can and cannot do in a real estate office.' },
  { title: 'Buyer Agent Value: 117 Services', href: '/blog/agent-career-info/buyer-agent-value', desc: 'The complete list of services buyer agents provide - use this to demonstrate your value.' },
  { title: 'What Can Unlicensed Assistants Do?', href: '/blog/agent-career-info/what-can-an-unlicensed-real-estate-assistant-do', desc: 'Understanding the legal boundaries and opportunities for unlicensed real estate staff.' },
];

export default function AgentCareerInfo() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>REAL ESTATE CAREER GUIDE</H1>
            <Tagline className="mt-4">21 guides to build a career that lasts</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              From your first day to your tenth year, these guides cover the practical side of being a real estate agent - expenses, hours, team structures, career moves, and strategies the top producers actually use.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* All Articles */}
      <LazySection height={1000}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>All Career Guides</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Practical, no-fluff career advice written by agents who have been in the trenches.
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
                  question: 'How much do real estate agents make in their first year?',
                  answer: 'First-year income varies widely, but most agents earn between $30,000-$60,000. Top performers in strong markets can exceed $100,000. Income depends on your market, brokerage split, sphere of influence, and how quickly you build your pipeline.',
                },
                {
                  question: 'What expenses should new agents expect?',
                  answer: 'Expect $2,000-$5,000 in startup costs including licensing, MLS dues, association fees, business cards, and marketing materials. Ongoing monthly costs are typically $200-$500 for technology, marketing, and professional development.',
                },
                {
                  question: 'How many hours do real estate agents work?',
                  answer: 'Full-time agents typically work 40-50 hours per week with a flexible schedule. Evenings and weekends are the busiest for showings. The trade-off is freedom to structure your own time and take days off during slower periods.',
                },
                {
                  question: 'When should I switch brokerages?',
                  answer: 'Consider switching if your split no longer reflects your production, training is lacking, technology is outdated, or fees are eating into your income. Most agents evaluate their brokerage fit annually.',
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
            <H2>Build Your Career With the Right Support</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              The brokerage and team you choose shapes your entire career trajectory. See what Smart Agent Alliance offers agents at every level.
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
