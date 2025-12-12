'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
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
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/33907e8d78946e3c-Social-Agent-Academy-PRO.webp/public"
    },
    {
      title: "Elite Training Courses",
      description: "Quick Onboarding with Roadmaps to Quick Production & Revenue Share Wins",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/f1fc2fdbb7666b9d-Free-Elite-Courses-Featured-Images.webp/public"
    },
    {
      title: "Live Training & Community",
      description: "5 MasterMind Video Support & Training Calls Each Week",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4c85e5e6f78b780b-5-weekly-mastermind-calls.webp/public"
    },
    {
      title: "Customizable Marketing Assets",
      description: "Ready-to-use templates to build your brand and generate leads",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/bee7eb0a134ef266-customizable-assets.webp/public"
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
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>THE WOLF PACK</H1>
          <Tagline className="mt-4">
            Free training, systems, and community that costs you nothing extra. No split increases. No hidden fees.
          </Tagline>
        </div>
      </section>

      {/* Intro Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto text-center">
          <p className="text-body">
            We partner with broker-owners, teams, top producers, growing agents, and brand-new licensees.
            <strong className="text-[#ffd700]"> 2,900+ agents</strong> across the US, Canada, Mexico, Australia, and beyond.
          </p>
          <div className="mt-8">
            <CTAButton href="/join-exp-sponsor-team/">
              Book a Call Today
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Video Section - Lazy loaded */}
      <LazySection height={500}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
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
      </LazySection>

      {/* Value Stack Section - Lazy loaded */}
      <LazySection height={1200}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>What You Get With The Wolf Pack</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Immediate access to systems, training, and resources that would cost thousands elsewhere. All free when you join.
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
                    <h3 className="text-h3 mb-4">{item.title}</h3>
                    <p className="text-body">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Features Grid - Lazy loaded */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The Full Arsenal</H2>
              <p className="text-body mt-4">Every tool, strategy, and system you need to dominate your market</p>
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
                  <h4 className="text-caption">{feature.title}</h4>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Stats Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <CyberCard padding="lg">
                <div className="text-5xl font-bold text-[#ffd700] mb-2">2,900+</div>
                <p className="text-body">Agents Strong</p>
              </CyberCard>

              <CyberCard padding="lg">
                <div className="text-5xl font-bold text-[#ffd700] mb-2">24+</div>
                <p className="text-body">Countries</p>
              </CyberCard>

              <CyberCard padding="lg">
                <div className="text-5xl font-bold text-[#ffd700] mb-2">5</div>
                <p className="text-body">Weekly Calls</p>
              </CyberCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Lazy loaded */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Run With The Pack?</H2>
            <p className="text-body mt-4 mb-8">
              Stop going it alone. Join 2,900+ agents who have access to the training, systems, and support that accelerates success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/about-exp-realty/">
                Learn About eXp
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
