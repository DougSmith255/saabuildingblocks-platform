'use client';

import { H1, H2, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';

/**
 * eXp Realty Awards Page
 * Showcases company achievements and recognition
 */
export default function Awards() {
  const majorAwards = [
    {
      title: "Forbes Best Large Employers",
      year: "2024",
      detail: "#8 ranking - establishing eXp as a premier workplace in real estate"
    },
    {
      title: "Glassdoor Best Places to Work",
      year: "2024",
      detail: "#22 on U.S. Large List - maintaining this standing since 2018"
    },
    {
      title: "RealTrends #1 in Transactions",
      year: "2023",
      detail: "#1 in transaction sides for fourth consecutive year"
    },
    {
      title: "T3 Sixty Mega 1000",
      year: "2023",
      detail: "#1 in transaction sides and agent count"
    },
    {
      title: "Deloitte Technology Fast 500",
      year: "2023",
      detail: "Recognized on the 29th annual Technology Fast 500 list"
    },
    {
      title: "Bravo Growth Award",
      year: "2023",
      detail: "Third consecutive year - leading in revenue, production, and agent growth"
    }
  ];

  const realTrendsAchievements = [
    "#1 in transaction sides",
    "Leading independent brokerage",
    "#4 in sales volume among U.S. brokerages",
    "441% increase in transactions over three years",
    "Top 3 in GameChanger Awards 2023"
  ];

  const executiveRecognition = [
    { name: "Loran Coleman", award: "2023 HousingWire Woman of Influence" },
    { name: "Michael Valdes", award: "HousingWire Vanguard 2023" },
    { name: "Multiple Executives", award: "2024 Swanepoel Power 200 List (4 featured)" }
  ];

  const wolfPackAwards = [
    { title: "Highest Net Growth", description: "Highest net growth group at eXp Realty" },
    { title: "#1 Retention Rate", description: "Best retention rate company-wide" },
    { title: "Top Team Leaders", description: "Top-performing in personal attraction and investor channels" }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 md:px-12 py-32 flex items-center justify-center">
        <div className="max-w-[2500px] mx-auto w-full text-center">
          <H1 heroAnimate animationDelay="0.6s">
            AWARDS & RECOGNITION
          </H1>
          <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto" style={{ opacity: 0, animation: 'fadeInUp2025 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both' }}>
            eXp Realty's excellence recognized by <strong className="text-white">Forbes, Glassdoor, RealTrends</strong>, and industry leaders.
          </p>
        </div>
      </section>

      {/* Major Awards Grid */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-12">Major Awards</H2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorAwards.map((award, index) => (
              <CyberCardHolographic key={index} className="p-6">
                <div className="text-amber-400 text-sm font-medium mb-2">{award.year}</div>
                <h3 className="text-xl font-bold text-white mb-3">{award.title}</h3>
                <p className="text-gray-400">{award.detail}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* RealTrends Section */}
      <section className="py-16 px-4 sm:px-8 bg-gray-900">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">RealTrends Recognition</H2>

          <div className="bg-white/5 rounded-xl p-8 border border-white/10">
            <ul className="space-y-4">
              {realTrendsAchievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-4 text-gray-300">
                  <span className="text-amber-400 text-xl">✓</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Executive Recognition */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[900px] mx-auto">
          <H2 className="text-center mb-8">Executive Recognition</H2>

          <div className="grid md:grid-cols-3 gap-6">
            {executiveRecognition.map((exec, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">{exec.name}</h3>
                <p className="text-amber-400 text-sm">{exec.award}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wolf Pack Awards */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-[1200px] mx-auto">
          <H2 className="text-center mb-4">Wolf Pack Recognition</H2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Our sponsorship group's achievements within eXp Realty.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {wolfPackAwards.map((award, index) => (
              <CyberCardHolographic key={index} className="p-6 text-center">
                <h3 className="text-xl font-bold text-amber-400 mb-3">{award.title}</h3>
                <p className="text-gray-300">{award.description}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-black">
        <div className="max-w-[800px] mx-auto text-center">
          <H2 className="mb-4">Join an Award-Winning Brokerage</H2>
          <p className="text-gray-400 mb-8">
            Be part of the industry's most recognized and fastest-growing real estate company.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
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
