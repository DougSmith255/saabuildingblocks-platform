'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
import Image from 'next/image';

/**
 * Team Value / eXp Realty Sponsor Page
 * Showcases Wolf Pack benefits and value
 */
export default function ExpRealtySponsor() {
  const valueItems = [
    {
      title: "FREE Social Media Training Course",
      description: "Quick Wins, Massive Momentum, Tangible Results FASTER than Any Other Program.",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Social-Agent-Academy-2.0.png"
    },
    {
      title: "eXp Realty Success Course",
      description: "Quick Onboarding with Roadmaps to Quick Production & Revenue Share Wins",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Wolfpack-HUB.png"
    },
    {
      title: "Investor Courses",
      description: "From the #1 Real Estate Investor in all of eXp's 89,000+ agents",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Investor-1.png"
    },
    {
      title: "Live Training & Community",
      description: "5 MasterMind Video Support & Training Calls Each Week",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Mike-call-1.jpg"
    },
    {
      title: "Private Women's Weekly Call",
      description: "Dedicated support and community for women agents",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/women-of-the-wolf-pack.jpg"
    }
  ];

  const features = [
    { icon: "Video Marketing", title: "Video Marketing Training" },
    { icon: "Attraction Funnel", title: "Lead Attraction Funnels" },
    { icon: "Personal Branding", title: "Personal Branding" },
    { icon: "Streamlined Onboarding", title: "Streamlined Onboarding" },
    { icon: "Goal Setting", title: "Goal Setting Systems" },
    { icon: "Mindset", title: "Mindset Training" },
    { icon: "Prospecting", title: "Prospecting Strategies" },
    { icon: "Agent Attraction", title: "Agent Attraction" },
    { icon: "Production", title: "Production Systems" },
    { icon: "Support System", title: "24/7 Support System" }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <div className="mb-8">
            <Image
              src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/WP-Lettering-BRIGHTER3.png"
              alt="Wolf Pack"
              width={600}
              height={172}
              className="mx-auto"
            />
          </div>
          <H1 heroAnimate animationDelay="0.6s">
            THE WOLF PACK
          </H1>
          <div className="text-gray-300 text-lg mt-6 max-w-3xl mx-auto space-y-4" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            <p>
              Join our sponsorship group the <strong className="text-white">Wolf Pack!</strong>
            </p>
            <p>
              Free Resources, Tools, Training, Support, & Community
              <br />
              <strong className="text-amber-400">-- No Extra Cost or Split Ever!</strong>
            </p>
            <p className="text-gray-400">
              We partner with broker-owners, teams, top agents, growing agents, & brand-new agents.
              <br />
              We have <strong className="text-white">over 2,900</strong> agents located all over the US, Canada, Mexico, Australia, & more.
            </p>
          </div>
          <div className="mt-8" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both' }}>
            <CTAButton href="/join-exp-sponsor-team/">
              Book a Call With Us Today
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[900px] mx-auto">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Fvfx9unYI1M"
              title="Wolf Pack Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Value Stack Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[1400px] mx-auto">
          <H2 className="text-center mb-4">What You Get With The Wolf Pack</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Check out the immediate value that the Wolf Pack will provide you! We can help change your life.
          </p>

          <div className="space-y-16">
            {valueItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={800}
                      height={500}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Everything You Need to Succeed</H2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-amber-400/30 transition-colors"
              >
                <div className="text-3xl mb-3">
                  {index === 0 && "📹"}
                  {index === 1 && "🎯"}
                  {index === 2 && "✨"}
                  {index === 3 && "🚀"}
                  {index === 4 && "🎯"}
                  {index === 5 && "🧠"}
                  {index === 6 && "📞"}
                  {index === 7 && "🤝"}
                  {index === 8 && "📈"}
                  {index === 9 && "💬"}
                </div>
                <h4 className="text-white font-medium text-sm">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <CyberCardHolographic className="p-8">
              <div className="text-5xl font-bold text-amber-400 mb-2">2,900+</div>
              <p className="text-gray-300">Agents Strong</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-8">
              <div className="text-5xl font-bold text-amber-400 mb-2">24+</div>
              <p className="text-gray-300">Countries</p>
            </CyberCardHolographic>

            <CyberCardHolographic className="p-8">
              <div className="text-5xl font-bold text-amber-400 mb-2">5</div>
              <p className="text-gray-300">Weekly Calls</p>
            </CyberCardHolographic>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Join The Pack?</H2>
          <p className="text-gray-400 mb-8">
            Join our value-packed, record-breaking group and start your journey towards a more successful real estate career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
            </CTAButton>
            <CTAButton href="/about-exp-realty/">
              Learn About eXp Realty
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
