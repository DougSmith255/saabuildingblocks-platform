'use client';

import { H1, H2, CTAButton, CyberCardHolographic, FAQ } from '@saa/shared/components/saa';
import Image from 'next/image';

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
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            JOIN OUR EXP REALTY SPONSOR TEAM
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            Reach out, we'd love to answer all your questions and talk to you about joining our value-packed, record-breaking group.
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Meet Your Future Sponsors</H2>

          <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {/* Karrie Hill Card */}
            <CyberCardHolographic className="p-8 text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-amber-400/50">
                <Image
                  src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Contact-Us-Profile-Photos-1.png"
                  alt="Karrie Hill - eXp Realty Sponsor"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Karrie Hill</h3>
              <p className="text-amber-400 mb-4">Co-Founder, Smart Agent Alliance</p>
              <div className="space-y-2 text-gray-300">
                <p>
                  <a href="mailto:karrie.hill@exprealty.com" className="hover:text-amber-400 transition-colors">
                    karrie.hill@exprealty.com
                  </a>
                </p>
                <p>415-435-7777 (no text)</p>
              </div>
            </CyberCardHolographic>

            {/* Doug Smart Card */}
            <CyberCardHolographic className="p-8 text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-amber-400/50">
                <Image
                  src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Contact-Us-Profile-Photos.png"
                  alt="Doug Smart - eXp Realty Sponsor"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Doug Smart</h3>
              <p className="text-amber-400 mb-4">Co-Founder, Smart Agent Alliance</p>
              <div className="space-y-2 text-gray-300">
                <p>
                  <a href="mailto:doug.smart@exprealty.com" className="hover:text-amber-400 transition-colors">
                    doug.smart@exprealty.com
                  </a>
                </p>
                <p>314-320-5606</p>
              </div>
            </CyberCardHolographic>
          </div>

          <div className="text-center mt-12">
            <CTAButton href="https://join.exprealty.com/">
              Start Your Application
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Why Join The Wolf Pack?</H2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">2,900+</div>
              <h3 className="text-xl font-bold text-white mb-2">Realtors Strong</h3>
              <p className="text-gray-400">Join a community of over 2,900 Realtors committed to supporting one another's success.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">100%</div>
              <h3 className="text-xl font-bold text-white mb-2">Free Resources</h3>
              <p className="text-gray-400">No commission splits or fees. The Wolf Pack provides extraordinary value at no cost to you.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">#1</div>
              <h3 className="text-xl font-bold text-white mb-2">Retention Rate</h3>
              <p className="text-gray-400">The Wolf Pack has the highest retention rate of all teams at eXp and is one of the fastest growing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Frequently Asked Questions</H2>
          <FAQ items={faqs} allowMultiple={false} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Take the Next Step?</H2>
          <p className="text-gray-400 mb-8">
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
