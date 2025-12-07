'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';

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
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>AWARDS & RECOGNITION</H1>
          <Tagline className="mt-4">
            eXp Realty's excellence recognized by Forbes, Glassdoor, RealTrends, and industry leaders
          </Tagline>
        </div>
      </HeroSection>

      {/* Major Awards Grid */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Major Awards</H2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorAwards.map((award, index) => (
              <GenericCard key={index} padding="md">
                <div className="text-amber-400 text-sm font-medium mb-2">{award.year}</div>
                <h3 className="text-xl font-bold text-[#e5e4dd] mb-3">{award.title}</h3>
                <p className="text-[#dcdbd5]/80">{award.detail}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* RealTrends Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <H2>RealTrends Recognition</H2>
          </div>

          <GenericCard padding="lg">
            <ul className="space-y-4">
              {realTrendsAchievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-4 text-[#dcdbd5]">
                  <span className="text-amber-400 text-xl">✓</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </GenericCard>
        </div>
      </section>

      {/* Executive Recognition */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Executive Recognition</H2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {executiveRecognition.map((exec, index) => (
              <GenericCard key={index} padding="md" centered>
                <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">{exec.name}</h3>
                <p className="text-amber-400 text-sm">{exec.award}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* Wolf Pack Awards */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Wolf Pack Recognition</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Our sponsorship group's achievements within eXp Realty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {wolfPackAwards.map((award, index) => (
              <GenericCard key={index} padding="md" centered>
                <h3 className="text-xl font-bold text-amber-400 mb-3">{award.title}</h3>
                <p className="text-[#dcdbd5]">{award.description}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Join an Award-Winning Brokerage</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
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
    </main>
  );
}
