'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, FAQ, ProfileCyberFrame } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';

// Profile images from Cloudflare Images CDN
const KARRIE_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public';
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

/**
 * Join Our eXp Realty Sponsor Team Page
 */
export default function JoinExpSponsorTeam() {
  const faqs = [
    {
      question: "What is the Purpose of a Video Call with Karrie or Doug?",
      answer: "This is not a sales call. The call is to answer your questions and discuss whether eXp Realty and the Wolf Pack are a good fit for you. What problems are you hoping to solve? Do we offer resources for that issue? If it seems like potentially a good fit, we will point you in the direction of next steps for you to take so that you can understand more about what eXp Realty and the Wolf Pack offer."
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
      question: "What sets the Wolf Pack apart from other real estate teams?",
      answer: "First, it's not a team that takes any part of your commissions. The Wolf Pack is a completely free team that stands out from other real estate teams because of its extraordinary value-packed resources and its strong sense of community, friendship, and collaboration. Members of the Wolf Pack can leverage each other's strengths and overcome challenges more effectively."
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
      question: "How do I join eXp Realty & the Wolf Pack?",
      answer: "Joining the eXp Realty Wolf Pack is easy! Simply reach out to us or explore our website to learn more about the benefits and opportunities. We'll guide you through the process and help you get started on your journey towards meeting your highest potential."
    },
    {
      question: "Are there any costs associated with participating in the revenue share program?",
      answer: "No, there are no additional costs or fees associated with participating in eXp Realty's revenue share program. It is completely free for all agents to participate and start earning revenue share income."
    },
    {
      question: "How many Realtors are part of The Pack?",
      answer: "The Wolf Pack at eXp Realty consists of over 2,900+ Realtors who are all committed to supporting one another's success. This vast network provides an invaluable opportunity for collaboration, mentorship, and growth within the real estate industry. The Wolf Pack has the highest retention rate of all teams at eXp and it is one of the fastest growing too."
    },
    {
      question: "Why Do Some Agents Leave eXp Realty?",
      answer: "There are many reasons why agents leave eXp. First, agents who chose the wrong sponsorship group can end up feeling like they are on an island. Second, agents who don't plug into the community cannot feel the genuine culture of collaboration. Third, some agents leave to chase the latest knockoff cloud-based model. Many of those agents return to eXp later after they truly understand why eXp works better for them."
    }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>JOIN THE WOLF PACK</H1>
          <Tagline className="mt-4">
            Book a call. Ask your questions. See if Smart Agent Alliance is the right fit for your goals.
          </Tagline>
        </div>
      </section>

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
              <p className="text-link mb-4">Co-Founder, Smart Agent Alliance</p>
              <div className="space-y-2 text-body">
                <p>
                  <a href="mailto:karrie.hill@exprealty.com" className="text-link transition-colors">
                    karrie.hill@exprealty.com
                  </a>
                </p>
                <p>415-435-7777 (no text)</p>
              </div>
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
              <p className="text-link mb-4">Co-Founder, Smart Agent Alliance</p>
              <div className="space-y-2 text-body">
                <p>
                  <a href="mailto:doug@smartagentalliance.com" className="text-link transition-colors">
                    doug@smartagentalliance.com
                  </a>
                </p>
                <p>314-320-5606</p>
              </div>
            </GenericCard>
          </div>

          <div className="text-center mt-12">
            <CTAButton href="https://join.exprealty.com/">
              Start Your Application
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

            <div className="grid md:grid-cols-3 gap-6">
              <CyberCard padding="md">
                <div className="text-4xl mb-4 text-[#ffd700]">2,900+</div>
                <h3 className="text-h6 mb-2">Realtors Strong</h3>
                <p className="text-body">Join a community of over 2,900 Realtors committed to supporting one another's success.</p>
              </CyberCard>

              <CyberCard padding="md">
                <div className="text-4xl mb-4 text-[#ffd700]">100%</div>
                <h3 className="text-h6 mb-2">Free Resources</h3>
                <p className="text-body">No commission splits or fees. The Wolf Pack provides extraordinary value at no cost to you.</p>
              </CyberCard>

              <CyberCard padding="md">
                <div className="text-4xl mb-4 text-[#ffd700]">#1</div>
                <h3 className="text-h6 mb-2">Retention Rate</h3>
                <p className="text-body">The Wolf Pack has the highest retention rate of all teams at eXp and is one of the fastest growing.</p>
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
              <CTAButton href="https://join.exprealty.com/">
                Apply Now
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
