'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';

/**
 * Should You Join eXp Quiz Page
 * Helps users determine if eXp Realty is a good fit
 */
export default function ShouldYouJoinExp() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>SHOULD YOU JOIN EXP?</H1>
          <Tagline className="mt-4">
            Take this 5-minute quiz to find out if eXp Realty is a good fit for you
          </Tagline>
        </div>
      </HeroSection>

      {/* Quiz Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="aspect-[4/3] min-h-[500px]">
              <iframe
                src="https://www.proprofs.com/quiz-school/ugc/story.php?title=should-you-join-exp-realty"
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full min-h-[500px]"
                title="Should You Join eXp Realty Quiz"
                allowFullScreen
              />
            </div>
          </div>

          <p className="text-[#dcdbd5] text-center mt-6">
            Based on the quiz above, you should be able to get a quick understanding of whether or not
            eXp Realty may be a good fit for you.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Learn More About eXp</H2>
          </div>

          <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Fvfx9unYI1M"
              title="eXp Realty Revenue Sharing Explained"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Why eXp Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Why Agents Choose eXp</H2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <GenericCard padding="md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Better Commission</h3>
              <p className="text-[#dcdbd5]/80">Up to 100% commission after capping at $16K to eXp. No franchise or royalty fees.</p>
            </GenericCard>

            <GenericCard padding="md">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Revenue Share</h3>
              <p className="text-[#dcdbd5]/80">7-tier revenue share program for passive income. Can be willed to your loved ones.</p>
            </GenericCard>

            <GenericCard padding="md">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Global Reach</h3>
              <p className="text-[#dcdbd5]/80">89,000+ agents in 27+ countries. Build a truly international business.</p>
            </GenericCard>

            <GenericCard padding="md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Training</h3>
              <p className="text-[#dcdbd5]/80">50+ weekly training sessions, courses, and mentorship programs included.</p>
            </GenericCard>

            <GenericCard padding="md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Stock Awards</h3>
              <p className="text-[#dcdbd5]/80">Earn equity in a publicly traded company through production milestones.</p>
            </GenericCard>

            <GenericCard padding="md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#e5e4dd] mb-2">Community</h3>
              <p className="text-[#dcdbd5]/80">Join a collaborative culture with strong support and accountability.</p>
            </GenericCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready to Learn More?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            Connect with our team to get all your questions answered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Talk to Us
            </CTAButton>
            <CTAButton href="/about-exp-realty/">
              Learn About eXp
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
