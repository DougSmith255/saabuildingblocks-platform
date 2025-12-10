'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';

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
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>INDUSTRY DOMINANCE</H1>
          <Tagline className="mt-4">
            Forbes. Glassdoor. RealTrends. The industry's biggest names recognize eXp's unstoppable rise.
          </Tagline>
        </div>
      </section>

      {/* Major Awards Grid */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Major Recognition</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              Year after year, the industry's most respected rankings prove what we already know.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorAwards.map((award, index) => (
              <GenericCard key={index} padding="md">
                <div className="text-link mb-2" style={{ fontSize: 'var(--font-size-caption)' }}>{award.year}</div>
                <h3 className="text-h5 mb-3">{award.title}</h3>
                <p className="text-body opacity-80">{award.detail}</p>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* RealTrends Section */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>RealTrends Dominance</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                The numbers don't lie. eXp leads where it matters.
              </p>
            </div>

            <GenericCard padding="lg">
              <ul className="space-y-4">
                {realTrendsAchievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-4 text-body">
                    <span className="text-link text-h5">✓</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </GenericCard>
          </div>
        </section>
      </LazySection>

      {/* Executive Recognition */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Leadership Excellence</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                eXp's executives setting the standard for the industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {executiveRecognition.map((exec, index) => (
                <GenericCard key={index} padding="md" centered>
                  <h3 className="text-h6 mb-2">{exec.name}</h3>
                  <p className="text-link" style={{ fontSize: 'var(--font-size-caption)' }}>{exec.award}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Wolf Pack Awards */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Wolf Pack Supremacy</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Inside eXp, the Wolf Pack leads the pack. Here's why agents stay.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {wolfPackAwards.map((award, index) => (
                <CyberCard key={index} padding="md">
                  <h3 className="text-h5 text-link mb-3">{award.title}</h3>
                  <p className="text-body">{award.description}</p>
                </CyberCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Join the Industry Leader</H2>
            <p className="text-body mt-4 mb-8">
              The fastest-growing brokerage. The highest retention group. Your move.
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
      </LazySection>
    </main>
  );
}
