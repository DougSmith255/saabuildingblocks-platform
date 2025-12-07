'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';

/**
 * About eXp Realty Page
 * Overview of eXp Realty's features, benefits, and business model
 */
export default function AboutExpRealty() {
  const keyFeatures = [
    {
      title: "Commission Structure",
      description: "Start at 80/20 split, cap at $16,000 paid to eXp, then earn 100%. ICON agents can receive the $16K back in company stock.",
      icon: "💰"
    },
    {
      title: "$85/Month",
      description: "Covers all services - no desk fees, franchise fees, or royalty fees.",
      icon: "📋"
    },
    {
      title: "CRM & Website",
      description: "Full CRM with IDX website and automated marketing included.",
      icon: "🌐"
    },
    {
      title: "Lead Generation",
      description: "Access to lead generation tools and partnerships.",
      icon: "🎯"
    },
    {
      title: "4,000+ Offices",
      description: "Access to Regus office locations worldwide.",
      icon: "🏢"
    },
    {
      title: "2,000+ Staff",
      description: "Salaried support staff ready to help you succeed.",
      icon: "👥"
    },
    {
      title: "50+ Weekly Trainings",
      description: "Live training sessions in eXp World metaverse.",
      icon: "📚"
    },
    {
      title: "Personal Branding",
      description: "Full flexibility to build your own brand.",
      icon: "✨"
    }
  ];

  const incomeStreams = [
    { title: "Production Commissions", description: "Earn up to 100% on your deals" },
    { title: "Stock Awards", description: "Receive company stock for milestones" },
    { title: "Revenue Share", description: "7-tier system for passive income" },
    { title: "Referral Income", description: "Earn from agent referrals" }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            ABOUT EXP REALTY
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            The <strong className="text-white">fastest growing brokerage on the planet</strong> with over 89,000 agents globally.
            A borderless model with extraordinary features to help you succeed.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">89,000+</div>
              <p className="text-gray-300">Agents Worldwide</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">24+</div>
              <p className="text-gray-300">Countries</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <p className="text-gray-300">Commission After Cap</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">$85</div>
              <p className="text-gray-300">Per Month</p>
            </CyberCardHolographic>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-4">What eXp Provides</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to build a successful real estate business, all included.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-amber-400/30 transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Streams */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-4">4 Income Streams</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Multiple ways to build wealth as an eXp agent.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {incomeStreams.map((stream, index) => (
              <CyberCardHolographic key={index} className="p-6 text-center">
                <div className="text-5xl font-bold text-amber-400/20 mb-2">{index + 1}</div>
                <h3 className="text-xl font-bold text-white mb-2">{stream.title}</h3>
                <p className="text-gray-400">{stream.description}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Share Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[900px] mx-auto text-center">
          <H2 className="mb-4">Revenue Share Program</H2>
          <p className="text-gray-400 mb-8">
            eXp's 7-tier revenue share program can generate significant passive income -
            potentially <strong className="text-amber-400">$94,000+ per year</strong> in additional earnings.
            This income can continue even after you leave the company and can be willed to your loved ones.
          </p>
          <CTAButton href="/exp-realty-revenue-share-calculator/">
            Calculate Your Potential
          </CTAButton>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Additional Benefits</H2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">eXp Commercial</h3>
              <p className="text-gray-400">Access to commercial real estate division for expanded opportunities.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">eXp Luxury</h3>
              <p className="text-gray-400">Specialized luxury division for high-end properties and clients.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Healthcare Options</h3>
              <p className="text-gray-400">Access to Clearwater Healthcare benefits for you and your family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Learn More?</H2>
          <p className="text-gray-400 mb-8">
            Discover why thousands of agents are joining eXp Realty every month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
            </CTAButton>
            <CTAButton href="/exp-realty-sponsor/">
              See Our Team Value
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
