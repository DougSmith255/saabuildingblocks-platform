import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Real Estate Schools Hub - Pillar Page
 * Links to all state-specific best online real estate school guides
 */

const stateSchools = [
  { state: 'California', href: '/real-estate-schools/california', hours: '135 hours', highlight: 'Largest market in the US' },
  { state: 'Colorado', href: '/real-estate-schools/colorado', hours: '168 hours', highlight: 'Fast-growing market' },
  { state: 'Florida', href: '/real-estate-schools/florida', hours: '63 hours', highlight: 'Lowest hour requirement' },
  { state: 'Georgia', href: '/real-estate-schools/georgia', hours: '75 hours', highlight: 'Strong agent demand' },
  { state: 'Illinois', href: '/real-estate-schools/illinois', hours: '90 hours', highlight: 'Chicago metro market' },
  { state: 'Indiana', href: '/real-estate-schools/indiana', hours: '90 hours', highlight: 'Affordable entry' },
  { state: 'Michigan', href: '/real-estate-schools/michigan', hours: '40 hours', highlight: 'Fewest hours required' },
  { state: 'Missouri', href: '/real-estate-schools/missouri', hours: '72 hours', highlight: 'Two major metros' },
  { state: 'Ohio', href: '/real-estate-schools/ohio', hours: '120 hours', highlight: 'Large agent pool' },
  { state: 'Oklahoma', href: '/real-estate-schools/oklahoma', hours: '90 hours', highlight: 'Growing market' },
  { state: 'Texas', href: '/real-estate-schools/texas', hours: '180 hours', highlight: 'Most hours required' },
];

export default function RealEstateSchools() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>BEST REAL ESTATE SCHOOLS</H1>
            <Tagline className="mt-4">Online courses reviewed by state</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              Choosing the right real estate school is your first step toward a successful career. We've reviewed the top online pre-licensing schools for 11 states, comparing course quality, pricing, exam prep, and pass rates so you can make an informed decision.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* General Guide */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Not Sure Where to Start?</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              If you're still deciding which school is right for you, start with our comprehensive overview that compares the top online platforms across all states.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <a href="/real-estate-schools/schools" className="block group">
              <GenericCard hover padding="lg">
                <div className="text-link font-medium mb-1" style={{ fontSize: 'var(--font-size-caption)' }}>GENERAL GUIDE</div>
                <h3 className="text-h5 mb-3">The Top 5 Real Estate Schools Online in 2026</h3>
                <p className="text-body mb-4">A nationwide comparison of the best online real estate schools, including pricing, course formats, and what to look for.</p>
                <span className="text-link group-hover:underline">Read the guide</span>
              </GenericCard>
            </a>
          </div>
        </div>
      </section>

      {/* State-by-State Guides */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Best Schools by State</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Each state has different pre-licensing hour requirements and approved schools. Find yours below for a detailed breakdown of the best options.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateSchools.map((s) => (
                <a key={s.state} href={s.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-h6">{s.state}</h3>
                      <span className="text-link font-medium" style={{ fontSize: 'var(--font-size-caption)' }}>{s.hours}</span>
                    </div>
                    <p className="text-caption mb-3">{s.highlight}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>View best schools</span>
                  </GenericCard>
                </a>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* What to Look For */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>What to Look for in a Real Estate School</H2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'State Approval', body: 'Make sure the school is approved by your state\'s real estate commission. Not all online schools are approved in every state.' },
                { title: 'Exam Prep Quality', body: 'The best schools include practice exams, flashcards, and test-taking strategies. Strong exam prep can make the difference between passing and failing.' },
                { title: 'Self-Paced vs Live', body: 'Most online schools offer self-paced courses, but some include live instructor sessions. Consider your learning style and schedule.' },
                { title: 'Post-License Support', body: 'Some schools offer continuing education (CE) credits and career support. Look for schools that help beyond just passing the exam.' },
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

      {/* After Licensing */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>After You Pass: Choosing a Brokerage</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Getting your license is step one. The brokerage you choose determines your commission splits, training quality, technology, and long-term income potential. Don't wait until after the exam to start researching.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/best-real-estate-brokerage/">
                Compare Brokerages
              </CTAButton>
              <CTAButton href="/become-an-agent/">
                How to Get Licensed
              </CTAButton>
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
                  question: 'Can I complete real estate school online?',
                  answer: "Yes. Most states now accept online pre-licensing courses. We review the best online schools for each state, covering course quality, pass rates, pricing, and exam prep options.",
                },
                {
                  question: 'How much does real estate school cost?',
                  answer: 'Online real estate school typically costs $100-$500 depending on the state, school, and package. Premium packages with exam prep and additional resources can run up to $800. Our state guides break down pricing for every major school.',
                },
                {
                  question: 'How long does it take to complete real estate school?',
                  answer: 'Required pre-licensing hours vary by state, from 40 hours (Michigan) to 180 hours (Texas). Most online schools let you work at your own pace, so completion time depends on how much time you dedicate. Many students finish in 4-12 weeks.',
                },
                {
                  question: 'What should I do after passing the real estate exam?',
                  answer: "After passing your exam, you need to choose a brokerage to hang your license with. This decision impacts your commission splits, training, technology, and long-term income. We recommend researching brokerages before you even start school so you can hit the ground running.",
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
            <H2>Ready to Start Your Real Estate Career?</H2>
            <p className="text-body mt-4 mb-8">
              Pick your state above to find the best school, then talk to us about what comes next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/book-a-call/">
                Book a Call
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
