'use client';

import { H1, H2, CTAButton } from '@saa/shared/components/saa';

/**
 * Should You Join eXp Quiz Page
 * Helps users determine if eXp Realty is a good fit
 */
export default function ShouldYouJoinExp() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            SHOULD YOU JOIN EXP?
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            Take this <strong className="text-amber-400">5-minute quiz</strong> to find out if eXp Realty is a good fit for you.
          </p>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
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

          <p className="text-gray-400 text-center mt-6">
            Based on the quiz above, you should be able to get a quick understanding of whether or not
            eXp Realty may be a good fit for you.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Learn More About eXp</H2>

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
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Why Agents Choose eXp</H2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Better Commission</h3>
              <p className="text-gray-400">Up to 100% commission after capping at $16K to eXp. No franchise or royalty fees.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">Revenue Share</h3>
              <p className="text-gray-400">7-tier revenue share program for passive income. Can be willed to your loved ones.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
              <p className="text-gray-400">89,000+ agents in 27+ countries. Build a truly international business.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">Training</h3>
              <p className="text-gray-400">50+ weekly training sessions, courses, and mentorship programs included.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Stock Awards</h3>
              <p className="text-gray-400">Earn equity in a publicly traded company through production milestones.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-gray-400">Join a collaborative culture with strong support and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Ready to Learn More?</H2>
          <p className="text-gray-400 mb-8">
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
