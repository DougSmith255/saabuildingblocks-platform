'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';
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
    { title: "Video Marketing Training" },
    { title: "Lead Attraction Funnels" },
    { title: "Personal Branding" },
    { title: "Streamlined Onboarding" },
    { title: "Goal Setting Systems" },
    { title: "Mindset Training" },
    { title: "Prospecting Strategies" },
    { title: "Agent Attraction" },
    { title: "Production Systems" },
    { title: "24/7 Support System" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <div className="mb-8">
            <Image
              src="https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/WP-Lettering-BRIGHTER3.png"
              alt="Wolf Pack"
              width={600}
              height={172}
              className="mx-auto"
            />
          </div>
          <H1>THE WOLF PACK</H1>
          <Tagline className="mt-4">
            Free Resources, Tools, Training, Support, & Community — No Extra Cost or Split Ever!
          </Tagline>
        </div>
      </HeroSection>

      {/* Intro Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[#dcdbd5] text-lg">
            We partner with broker-owners, teams, top agents, growing agents, & brand-new agents.
            We have <strong className="text-[#e5e4dd]">over 2,900</strong> agents located all over the US, Canada, Mexico, Australia, & more.
          </p>
          <div className="mt-8">
            <CTAButton href="/join-exp-sponsor-team/">
              Book a Call With Us Today
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
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
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <H2>What You Get With The Wolf Pack</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Check out the immediate value that the Wolf Pack will provide you! We can help change your life.
            </p>
          </div>

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
                  <h3 className="text-2xl font-bold text-[#e5e4dd] mb-4">{item.title}</h3>
                  <p className="text-[#dcdbd5] text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Everything You Need to Succeed</H2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <GenericCard key={index} padding="md" centered hover>
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
                <h4 className="text-[#e5e4dd] font-medium text-sm">{feature.title}</h4>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <GenericCard padding="lg" centered>
              <div className="text-5xl font-bold text-amber-400 mb-2">2,900+</div>
              <p className="text-[#dcdbd5]">Agents Strong</p>
            </GenericCard>

            <GenericCard padding="lg" centered>
              <div className="text-5xl font-bold text-amber-400 mb-2">24+</div>
              <p className="text-[#dcdbd5]">Countries</p>
            </GenericCard>

            <GenericCard padding="lg" centered>
              <div className="text-5xl font-bold text-amber-400 mb-2">5</div>
              <p className="text-[#dcdbd5]">Weekly Calls</p>
            </GenericCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready to Join The Pack?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
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
    </main>
  );
}
