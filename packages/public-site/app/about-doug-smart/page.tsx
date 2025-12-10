'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';

// Cloudflare-ready image URL (using same as WhoWeAre section)
const DOUG_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png';

/**
 * About Doug Smart Page
 * Personal bio and background
 */
export default function AboutDougSmart() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Title", value: "Full-Stack Architect" },
    { label: "Ranking", value: "Top 0.1% eXp Team Builders (2025)" },
    { label: "Location", value: "San Jose, California" }
  ];

  const skills = [
    "Website Development",
    "Agent Webpages",
    "Marketing Automations",
    "Digital Infrastructure",
    "Branding & Design",
    "Passive Revenue Systems"
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>DOUG SMART</H1>
          <Tagline className="mt-4">
            Full-Stack Architect building the digital infrastructure that powers Smart Agent Alliance
          </Tagline>
        </div>
      </section>

      {/* Profile Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Photo with ProfileCyberFrame (circular) */}
            <div className="lg:w-1/3 flex justify-center">
              <ProfileCyberFrame size="xl">
                <Image
                  src={DOUG_PROFILE_IMAGE}
                  alt="Doug Smart"
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
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <H2>About Doug</H2>
            </div>

            <div className="space-y-6 text-[#dcdbd5]">
              <p>
                Top 0.1% eXp team builder and the architect behind Smart Agent Alliance's entire digital infrastructure.
                Doug built this website, the automation systems, agent webpages, and the technology stack that gives
                our agents an <strong className="text-[#e5e4dd]">unfair advantage</strong> in their markets.
              </p>

              <p>
                With a Bachelor's degree in Industrial Design and a business minor, Doug spent four years building
                multi-million dollar homes during college—developing the work ethic and attention to detail he now
                applies to building systems for agents. He transforms complex technology into competitive advantages.
              </p>

              <p>
                Doug specializes in passive revenue systems, branding, and marketing automation. If it's digital
                and it helps agents win, he probably built it.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Skills Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <H2>What Doug Builds</H2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
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
              Based in San Jose, California, Doug maintains a disciplined lifestyle. He's a huge fan of basketball
              and regularly hits the gym - essentially the modern-day equivalent to Arnold Schwarzenegger
              (if he never took steroids).
            </p>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <H2>Connect With Doug</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              Ready to join Smart Agent Alliance and leverage Doug's digital systems for your real estate business?
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
