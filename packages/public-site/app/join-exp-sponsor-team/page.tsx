'use client';

import { useState } from 'react';
import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, FAQ, ProfileCyberFrame, JoinModal, InstructionsModal } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { GreenLaserGridEffect } from '@/components/shared/hero-effects/GreenLaserGridEffect';
import { WatchAndDecide } from '@/app/components/sections/WatchAndDecide';

// Profile images from Cloudflare Images CDN
const KARRIE_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public';
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

/**
 * Join Our eXp Realty Sponsor Team Page
 */
export default function JoinExpSponsorTeam() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userName, setUserName] = useState('');

  const handleJoinSuccess = (data: { firstName: string }) => {
    setUserName(data.firstName);
    setShowJoinModal(false);
    setTimeout(() => {
      setShowInstructions(true);
    }, 300);
  };

  const faqs = [
    {
      question: "What is the Purpose of a Video Call with Karrie or Doug?",
      answer: "This is not a sales call. The call is to answer your questions and discuss whether eXp Realty and Smart Agent Alliance are a good fit for you. What problems are you hoping to solve? Do we offer resources for that issue? If it seems like potentially a good fit, we will point you in the direction of next steps for you to take so that you can understand more about what eXp Realty and Smart Agent Alliance offer."
    },
    {
      question: "What kind of training does eXp Realty provide?",
      answer: "eXp Realty offers lots of training opportunities: online courses, webinars, in-person conferences, Fast Start Series Training Program, and more. Also, eXp's ICON program ensures that agents get training from top producers and eXp's sponsorship groups allow agents to pick additional paths of desired training."
    },
    {
      question: "Is eXp Realty suitable for experienced agents?",
      answer: "Absolutely! eXp offers numerous advantages for experienced professionals. The company's great commissions and low fees, training programs, supportive community and revenue share income (that can keep coming with retirement and also be willed to your loved ones) enhances the careers of experienced/seasoned agents, brokers, and teams looking to take their business to the next level."
    },
    {
      question: "How does revenue sharing work at eXp Realty?",
      answer: "At eXp Realty, agents can earn additional income through revenue sharing when they grow the company by sponsoring other agents. Income paid to agents is paid from eXp's company dollar and never from agent sponsors. Revenue share payments are typically made monthly, currently on the 20th of each month."
    },
    {
      question: "Can I earn revenue share from agents in other countries?",
      answer: "Yes, eXp Realty's revenue share program is available internationally, allowing you to earn income from agents recruited not only all over the United States but also in 24 other countries."
    },
    {
      question: "What is the difference between an eXp sponsor and mentor?",
      answer: "Sponsors are chosen by agents when they sign up to join eXp. Agents do not pay their sponsor any split or fee. Sponsors are paid out of eXp's company dollar. Mentors are assigned to new agents after they become an agent with eXp. Mentors help with a new agent's first 3 transactions. New agents pay an additional 20% fee for their first 3 transactions to cover the associated costs of the mentorship program."
    },
    {
      question: "Can I join eXp Realty part-time?",
      answer: "Yes! One of the great advantages of joining eXp Realty is its flexibility. Whether you're looking for full-time or part-time opportunities in real estate, they welcome agents with different schedules and commitments. You can work at your own pace and create a schedule that suits your needs."
    },
    {
      question: "Why Do Some Agents Leave eXp Realty?",
      answer: "There are many reasons why agents leave eXp. First, agents who chose the wrong sponsorship group can end up feeling like they are on an island. Second, agents who don't plug into the community cannot feel the genuine culture of collaboration. Third, some agents leave to chase the latest knockoff cloud-based model. Many of those agents return to eXp later after they truly understand why eXp works better for them."
    }
  ];

  return (
    <main id="main-content">
      {/* Hero Section - fadeSpeed 1.5 = fades out 50% faster */}
      <StickyHeroWrapper fadeSpeed={1.5}>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <GreenLaserGridEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            {/* Dark elliptical vignette behind all text for readability over green lasers */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '200%',
                background: 'radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <H1>JOIN SMART AGENT ALLIANCE</H1>
              <div className="mt-4">
                <Tagline>
                  Your first step to more
                </Tagline>
              </div>
              {/* Hero CTA Button */}
              <div className="mt-8">
                <CTAButton
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowJoinModal(true);
                  }}
                >
                  Join The Alliance
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* The Only Video You Need Section */}
      <WatchAndDecide />

      {/* Contact Cards Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Meet Your Future Sponsors</H2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-[1900px] mx-auto">
            {/* Karrie Hill Card */}
            <GenericCard padding="lg" centered>
              <ProfileCyberFrame size="lg" index={1}>
                <Image
                  src={KARRIE_PROFILE_IMAGE}
                  alt="Karrie Hill - eXp Realty Sponsor"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover object-top"
                />
              </ProfileCyberFrame>
              <h3 className="text-h5 mb-2">Karrie Hill</h3>
              <p className="text-link">Co-Founder, Smart Agent Alliance</p>
            </GenericCard>

            {/* Doug Smart Card */}
            <GenericCard padding="lg" centered>
              <ProfileCyberFrame size="lg" index={0}>
                <Image
                  src={DOUG_PROFILE_IMAGE}
                  alt="Doug Smart - eXp Realty Sponsor"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover object-top"
                />
              </ProfileCyberFrame>
              <h3 className="text-h5 mb-2">Doug Smart</h3>
              <p className="text-link">Co-Founder, Smart Agent Alliance</p>
            </GenericCard>
          </div>

          <div className="text-center mt-12">
            <CTAButton href="mailto:team@smartagentalliance.com">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Why Join Section - Lazy loaded */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Why Join The Alliance?</H2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              <CyberCard padding="lg" className="h-full">
                <p className="text-h2 mb-4 stat-3d-text">3,700+</p>
                <h3 className="text-h6 mb-2" style={{ color: 'var(--color-header-text)' }}>Realtors Strong</h3>
                <p className="text-body">Join a community of over 3,700 Realtors committed to supporting one another's success.</p>
              </CyberCard>

              <CyberCard padding="lg" className="h-full">
                <p className="text-h2 mb-4 stat-3d-text">100%</p>
                <h3 className="text-h6 mb-2" style={{ color: 'var(--color-header-text)' }}>Free Resources</h3>
                <p className="text-body">No commission splits or fees. Smart Agent Alliance provides extraordinary value at no cost to you.</p>
              </CyberCard>

              <CyberCard padding="lg" className="h-full">
                <p className="text-h2 mb-4 stat-3d-text">#1</p>
                <h3 className="text-h6 mb-2" style={{ color: 'var(--color-header-text)' }}>Retention Rate</h3>
                <p className="text-body">Smart Agent Alliance has the highest retention rate of all teams at eXp and is one of the fastest growing.</p>
              </CyberCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ Section - Lazy loaded */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>
            <FAQ items={faqs} allowMultiple={false} />
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Take the Next Step?</H2>
            <p className="text-body mt-4 mb-8">
              Join the Smart Agent Alliance team at eXp Realty and start your journey towards a more successful real estate career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowJoinModal(true);
                }}
              >
                Join The Alliance
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                Learn About Our Value
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Join Modal */}
      <JoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
        sponsorName={null}
      />

      {/* Instructions Modal - shown after successful join */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        userName={userName}
      />
    </main>
  );
}
