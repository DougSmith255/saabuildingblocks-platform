'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';

// Cloudflare-ready image URL (using same as WhoWeAre section)
const KARRIE_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Karrie-Profile-Picture.png';

/**
 * About Karrie Hill Page
 * Personal bio and background
 */
export default function AboutKarrieHill() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Title", value: "Strategic Advisor & eXp Certified Mentor" },
    { label: "Education", value: "JD, UC Berkeley Law (Top 5%)" },
    { label: "Location", value: "Tiburon, Marin County, CA" }
  ];

  const expertise = [
    "Sponsorship Strategy",
    "Team Building",
    "Career Development",
    "YouTube Marketing",
    "Negotiation",
    "Financial Analysis"
  ];

  const achievements = [
    "Six-figure income in first full year through YouTube marketing",
    "#1 Agent YouTube channel in Marin County, California",
    "Featured on HGTV and in national magazines for interior design",
    "Frequent guest on KDOW \"The Real Estate Report\"",
    "30+ year Marin County resident"
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>KARRIE HILL, JD</H1>
          <Tagline className="mt-4">
            Strategic Advisor, eXp Certified Mentor, and UC Berkeley Law Graduate
          </Tagline>
        </div>
      </HeroSection>

      {/* Profile Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Photo with ProfileCyberFrame (circular) */}
            <div className="lg:w-1/3 flex justify-center">
              <ProfileCyberFrame size="xl">
                <Image
                  src={KARRIE_PROFILE_IMAGE}
                  alt="Karrie Hill"
                  fill
                  sizes="(max-width: 768px) 224px, 256px"
                  className="object-cover"
                />
              </ProfileCyberFrame>
            </div>

            {/* Quick Stats */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <GenericCard key={index} padding="sm">
                    <p className="text-[#dcdbd5]/60 text-sm">{item.label}</p>
                    <p className="text-[#e5e4dd] font-medium">{item.value}</p>
                  </GenericCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <LazySection height={450}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <H2>About Karrie</H2>
            </div>

            <div className="space-y-6 text-[#dcdbd5]">
              <p>
                UC Berkeley Law graduate (<strong className="text-[#e5e4dd]">top 5% of her class</strong>), eXp Certified Mentor,
                and the strategic mind behind agent success at Smart Agent Alliance. Karrie built a
                <strong className="text-[#e5e4dd]"> six-figure real estate business in her first full year</strong>—no
                cold calls, no door knocking—using YouTube marketing strategies she now teaches to agents.
              </p>

              <p>
                Before real estate, Karrie practiced law, bought and sold homes, and spent over a decade as a
                professional stock trader. She holds the <strong className="text-[#e5e4dd]">#1 agent YouTube channel
                in Marin County, California</strong>, and is certified in Real Estate Negotiation, Home Marketing,
                Relocations, and Express Offers.
              </p>

              <p>
                A 30+ year Marin County resident, Karrie is passionate about helping agents achieve their wildest
                goals in real estate. She engineers results for agents who refuse to settle for average.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Achievements Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Achievements</H2>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <GenericCard key={index} padding="sm">
                  <div className="flex items-start gap-4">
                    <div className="text-amber-400 text-xl">✓</div>
                    <p className="text-[#dcdbd5]">{achievement}</p>
                  </div>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Expertise Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Areas of Expertise</H2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {expertise.map((skill, index) => (
                <GenericCard key={index} padding="sm" centered>
                  <p className="text-[#e5e4dd] font-medium">{skill}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Personal Section */}
      <LazySection height={250}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto text-center">
            <div className="text-center mb-12">
              <H2>Outside of Work</H2>
            </div>
            <p className="text-[#dcdbd5] max-w-2xl mx-auto">
              A 30+ year Marin County resident living in Tiburon with her husband and two dogs - Baxter and Lily.
              Karrie is a mother of three and grandmother. Her creative talents have been featured on HGTV and in
              national magazines for interior design work. She loves helping agents achieve their wildest hopes
              and dreams in the real estate business.
            </p>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <H2>Connect With Karrie</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              Ready to get mentorship from Karrie and join Smart Agent Alliance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join Our Team
              </CTAButton>
              <CTAButton href="/our-exp-team/">
                Meet The Team
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
