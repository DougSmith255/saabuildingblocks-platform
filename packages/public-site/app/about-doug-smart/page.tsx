'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';

// Cloudflare-ready image URL (using same as WhoWeAre section)
const DOUG_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png';

/**
 * About Doug Smart Page
 * Personal bio and background - Brand tone: awe-inspiring, futuristic, direct
 */
export default function AboutDougSmart() {
  const highlights = [
    { label: "Role", value: "Co-Founder, Smart Agent Alliance" },
    { label: "Specialty", value: "Digital Systems Architect" },
    { label: "Ranking", value: "Top 0.1% eXp Team Builders" },
    { label: "Base", value: "San Jose, California" }
  ];

  const systemsBuilt = [
    { name: "Agent Websites", desc: "Custom IDX-integrated sites that convert" },
    { name: "Marketing Automations", desc: "Email sequences that nurture leads 24/7" },
    { name: "Lead Funnels", desc: "Capture systems that work while you sleep" },
    { name: "Brand Identity", desc: "Stand out in a sea of generic agents" },
    { name: "CRM Integrations", desc: "Tech that talks to each other seamlessly" },
    { name: "Revenue Systems", desc: "Passive income infrastructure" }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>DOUG SMART</H1>
          <Tagline className="mt-4">
            The architect behind every digital system that gives our agents an unfair advantage
          </Tagline>
        </div>
      </section>

      {/* Profile Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
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
                    <p className="text-[#dcdbd5]/60" style={{ fontSize: 'var(--font-size-caption)' }}>{item.label}</p>
                    <p className="text-[#e5e4dd] font-medium" style={{ fontSize: 'var(--font-size-body)' }}>{item.value}</p>
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
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>The Builder</H2>
            </div>

            <div className="space-y-6 text-body">
              <p>
                Doug is the architect behind Smart Agent Alliance's entire digital infrastructure. This website,
                the automation systems, agent webpages, and the technology stack that gives our agents an
                <strong className="text-[#ffd700]"> unfair advantage</strong> in their markets—he built it all.
              </p>

              <p>
                With a Bachelor's degree in Industrial Design and a business minor, Doug spent four years building
                multi-million dollar homes during college. That experience forged the work ethic and attention to
                detail he now applies to building systems for agents.
              </p>

              <p>
                His specialty: transforming complex technology into competitive advantages. Passive revenue systems,
                branding, marketing automation—if it's digital and it helps agents win, Doug probably built it.
              </p>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Systems Section */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Systems That Scale Your Business</H2>
              <p className="text-body mt-4">What you get access to when you join Smart Agent Alliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemsBuilt.map((system, index) => (
                <GenericCard key={index} padding="md" hover className="h-full">
                  <h3 className="text-h6 mb-2">{system.name}</h3>
                  <p className="text-body opacity-80">{system.desc}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Personal Section */}
      <LazySection height={250}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <div className="text-center mb-8">
              <H2>Beyond the Code</H2>
            </div>
            <p className="text-body max-w-2xl mx-auto">
              Based in San Jose, California. Basketball fanatic. Gym regular. The kind of disciplined
              focus that builds multi-million dollar homes also builds systems that scale businesses.
            </p>
          </div>
        </section>
      </LazySection>

      {/* Contact Section */}
      <LazySection height={200}>
        <section className="relative py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <CyberCard padding="lg">
              <div className="text-center">
                <h3 className="text-h5 mb-4">Get in Touch</h3>
                <a href="mailto:doug@smartagentalliance.com" className="text-link hover:underline">
                  doug@smartagentalliance.com
                </a>
                <p className="text-body opacity-60 mt-2" style={{ fontSize: 'var(--font-size-caption)' }}>314-320-5606</p>
              </div>
            </CyberCard>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Level Up?</H2>
            <p className="text-body mt-4 mb-8">
              Join Smart Agent Alliance and get access to the digital infrastructure that powers top-producing agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join Our Team
              </CTAButton>
              <CTAButton href="/our-exp-team/">
                Meet The Full Team
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
