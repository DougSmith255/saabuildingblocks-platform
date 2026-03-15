import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Become an Agent Hub - Pillar Page
 * Links to all state-specific real estate licensing guides
 */

const stateLicensing = [
  { state: 'California', href: '/become-an-agent/california', hours: '135 hours', age: '18+' },
  { state: 'Colorado', href: '/become-an-agent/colorado', hours: '168 hours', age: '18+' },
  { state: 'Florida', href: '/become-an-agent/florida', hours: '63 hours', age: '18+' },
  { state: 'Georgia', href: '/become-an-agent/georgia', hours: '75 hours', age: '18+' },
  { state: 'Illinois', href: '/become-an-agent/illinois', hours: '90 hours', age: '18+' },
  { state: 'Indiana', href: '/become-an-agent/indiana', hours: '90 hours', age: '18+' },
  { state: 'Michigan', href: '/become-an-agent/michigan', hours: '40 hours', age: '18+' },
  { state: 'Missouri', href: '/become-an-agent/missouri', hours: '72 hours', age: '18+' },
  { state: 'Ohio', href: '/become-an-agent/ohio', hours: '120 hours', age: '18+' },
  { state: 'Oklahoma', href: '/become-an-agent/oklahoma', hours: '90 hours', age: '18+' },
  { state: 'Texas', href: '/become-an-agent/texas', hours: '180 hours', age: '18+' },
];

const steps = [
  { step: '1', title: 'Meet Your State Requirements', body: 'Most states require you to be 18+, have a high school diploma or GED, and pass a background check. No college degree needed.' },
  { step: '2', title: 'Complete Pre-Licensing Education', body: 'Take state-approved courses covering real estate principles, contracts, ethics, and your state\'s laws. Available online in most states.' },
  { step: '3', title: 'Pass the State Exam', body: 'A two-part exam covering national real estate principles and state-specific laws. Most states require 70-75% to pass.' },
  { step: '4', title: 'Choose a Brokerage', body: 'Your license must be held by a brokerage. This decision affects your commission, training, technology, and income potential.' },
  { step: '5', title: 'Activate Your License', body: 'Submit your application, pay fees, and start your career. Most states process applications within 2-4 weeks.' },
];

export default function BecomeAnAgent() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>GET YOUR REAL ESTATE LICENSE</H1>
            <Tagline className="mt-4">State-by-state licensing guides</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              Every state has different requirements for becoming a licensed real estate agent. We've created step-by-step guides for 11 states covering education requirements, exam details, costs, and timelines.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* The Process */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>How It Works</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              The licensing process is straightforward, though timelines and requirements vary by state.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((s) => (
              <GenericCard key={s.step} padding="md" className="h-full">
                <div className="text-link font-bold text-h4 mb-2">{s.step}</div>
                <h3 className="text-h6 mb-2">{s.title}</h3>
                <p className="text-body" style={{ fontSize: 'var(--font-size-caption)' }}>{s.body}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* State-by-State Guides */}
      <LazySection height={600}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Licensing Guides by State</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Each guide covers your state's specific requirements, approved schools, exam details, costs, and step-by-step instructions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateLicensing.map((s) => (
                <a key={s.state} href={s.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-h6">{s.state}</h3>
                      <span className="text-link font-medium" style={{ fontSize: 'var(--font-size-caption)' }}>{s.hours}</span>
                    </div>
                    <p className="text-caption mb-3">Minimum age: {s.age}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>View licensing guide</span>
                  </GenericCard>
                </a>
              ))}
            </div>

            <p className="text-body text-center mt-8" style={{ fontSize: 'var(--font-size-caption)' }}>
              Don't see your state? We're adding more guides. <a href="/book-a-call/" className="text-link hover:underline">Book a call</a> and we'll walk you through your state's requirements.
            </p>
          </div>
        </section>
      </LazySection>

      {/* Paired with Schools */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Find the Right School for Your State</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              Every licensing guide is paired with a school review for the same state. Know the requirements, then pick the best school.
            </p>
            <CTAButton href="/real-estate-schools/">
              Best Real Estate Schools by State
            </CTAButton>
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
                  question: 'How long does it take to get a real estate license?',
                  answer: "It depends on your state. Pre-licensing education ranges from 40 hours (Michigan) to 180 hours (Texas). Most people complete their coursework in 4-12 weeks studying part-time, then schedule the state exam within a few weeks. Total timeline is typically 2-4 months from start to licensed.",
                },
                {
                  question: 'How much does it cost to get a real estate license?',
                  answer: 'Total costs typically range from $300-$1,500 depending on the state. This includes pre-licensing courses ($100-$500), state exam fees ($50-$100), license application ($50-$300), background check ($30-$80), and any additional materials. Our state guides break down exact costs.',
                },
                {
                  question: 'Do I need a college degree to get a real estate license?',
                  answer: 'No. Most states only require you to be 18 or 19 years old, have a high school diploma or GED, and complete state-approved pre-licensing education. No college degree is required in any state.',
                },
                {
                  question: 'What is the real estate exam pass rate?',
                  answer: "First-time pass rates vary by state, typically ranging from 50% to 75%. The exam covers national real estate principles and state-specific laws. Strong exam prep and practice tests significantly improve your chances. Our state guides include exam tips and recommended prep resources.",
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
            <H2>Start Your Real Estate Career With the Right Team</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              The brokerage you choose after getting licensed is the single biggest factor in your success. Talk to us about what a career at eXp looks like with the Smart Agent Alliance.
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
