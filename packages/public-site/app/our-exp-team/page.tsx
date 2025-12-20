'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCardGold, NeonGoldText, ProfileCyberFrame, Icon3D } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import Image from 'next/image';
import { QuantumGridEffect } from '@/components/shared/hero-effects/QuantumGridEffect';

// Cloudflare Images CDN URLs
const KARRIE_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public';
const DOUG_PROFILE_IMAGE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public';

/**
 * About Us / Our eXp Team Page
 */
export default function OurExpTeam() {
  const coFounders = [
    {
      tier: 1,
      name: "Doug Smart",
      title: "Co-Founder, Smart Agent Alliance",
      image: DOUG_PROFILE_IMAGE,
      bio: [
        "Top 0.1% eXp team builder and the architect behind Smart Agent Alliance's entire digital infrastructure. Doug built this website, the automation systems, agent webpages, and the technology stack that gives our agents an unfair advantage in their markets.",
        "With a Bachelor's degree in Industrial Design and a business minor, Doug spent four years building multi-million dollar homes during college—developing the work ethic and attention to detail he now applies to building systems for agents. He transforms complex technology into competitive advantages.",
        "Doug specializes in passive revenue systems, branding, and marketing automation. If it's digital and it helps agents win, he probably built it."
      ]
    },
    {
      tier: 2,
      name: "Karrie Hill, JD",
      title: "Co-Founder, Smart Agent Alliance",
      image: KARRIE_PROFILE_IMAGE,
      bio: [
        "UC Berkeley Law graduate (top 5% of her class), eXp Certified Mentor, and the strategic mind behind agent success at Smart Agent Alliance. Karrie built a six-figure real estate business in her first full year—no cold calls, no door knocking—using YouTube marketing strategies she now teaches to agents.",
        "Before real estate, Karrie practiced law, bought and sold homes, and spent over a decade as a professional stock trader. She holds the #1 agent YouTube channel in Marin County, California, and is certified in Real Estate Negotiation, Home Marketing, Relocations, and Express Offers.",
        "A 30+ year Marin County resident, Karrie is passionate about helping agents achieve their wildest goals in real estate. She engineers results for agents who refuse to settle for average."
      ]
    }
  ];

  const uplinePartners = [
    {
      tier: 3,
      name: "Mike Sherrard",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/c7d78c1c7d39f9bc-Upline-1.webp/public",
      bio: "#1 Personal Attractor at eXp. Top 3 Realtor on YouTube globally (85K+ subs). Trains thousands of agents annually on social media scaling. Co-Founder of the Wolf Pack."
    },
    {
      tier: 4,
      name: "Connor Steinbrook",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/c5b1dae986466b48-Upline-2.webp/public",
      bio: "Built a 2,900+ agent team in 4 years. Runs Investor Army YouTube (35K+ subs). Top 43 eXp Influencer. Co-Founder of the Wolf Pack."
    },
    {
      tier: 5,
      name: "Chris Soignier",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/0d57e885d0b45fb6-Upline-3.webp/public",
      bio: "Top 50 eXp Influencer. Multi-family and commercial specialist. Team spans 40+ US states and 7 countries."
    },
    {
      tier: 6,
      name: "Ian Flannigan",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/d2afacd47dcdf3a4-Upline-4.webp/public",
      bio: "Top 50 eXp Influencer. Built an international agent network in 7 years. National speaker and industry leader."
    },
    {
      tier: 7,
      name: "Pat Hays",
      image: "https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/8fee6badeca55e90-Upline-5.webp/public",
      bio: "$3.2M production in year one. Built a 2,000+ agent team across 42 states and 3 Canadian provinces."
    }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <QuantumGridEffect />

          {/* Wolf Pack Background Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="relative w-full min-w-[300px] max-w-[2000px] h-full">
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop"
                srcSet="
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                  https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
                "
                sizes="100vw"
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: 'center 55%',
                  maskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at center 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.15) 65%, transparent 85%)',
                }}
              />
            </div>
          </div>

          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>YOUR UPLINE</H1>
            <Tagline className="mt-4">
              7 tiers of proven expertise in your corner
            </Tagline>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Co-Founders Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Your Team Leaders</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              Your first two points of contact. We built the systems, run the community, and are personally invested in your success.
            </p>
          </div>

          <div className="space-y-16">
            {coFounders.map((founder, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="lg:w-1/3 flex justify-center">
                  <div className="relative">
                    {/* 3D Tier Number - z-20 to ensure it's above ProfileCyberFrame layers */}
                    <div className="absolute -top-4 -left-4 z-20">
                      <Icon3D>
                        <span
                          style={{
                            fontFamily: 'var(--font-taskor), sans-serif',
                            fontSize: 'clamp(43px, calc(39px + 1.60vw), 87px)',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {founder.tier}
                        </span>
                      </Icon3D>
                    </div>
                    <ProfileCyberFrame size="xl" index={index}>
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        sizes="(max-width: 768px) 224px, 256px"
                        className="object-cover"
                      />
                    </ProfileCyberFrame>
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <GenericCard padding="md">
                    <h3 className="text-h3 mb-1">{founder.name}</h3>
                    <p className="text-link mb-4">{founder.title}</p>
                    <div className="space-y-4 text-body">
                      {founder.bio.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </GenericCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upline Partners Section */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>5 More Tiers in Your Corner</H2>
              <p className="text-body mt-4">
                Your extended upline. Access to their resources, training, and a community of 3,700+ agents across 24+ countries.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uplinePartners.map((partner, index) => (
                <GenericCard key={index} padding="md" centered className="h-full">
                  <div className="relative inline-block">
                    {/* 3D Tier Number - z-20 to ensure it's above ProfileCyberFrame layers */}
                    <div className="absolute -top-3 -left-3 z-20">
                      <Icon3D>
                        <span
                          style={{
                            fontFamily: 'var(--font-taskor), sans-serif',
                            fontSize: 'var(--font-size-h2)',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {partner.tier}
                        </span>
                      </Icon3D>
                    </div>
                    <ProfileCyberFrame size="md" index={index}>
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 768px) 144px, 176px"
                        className="object-cover grayscale scale-110"
                      />
                    </ProfileCyberFrame>
                  </div>
                  <h4 className="text-h5 text-center mb-2">{partner.name}</h4>
                  <p className="text-body text-center">{partner.bio}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Revenue Share Callout */}
      <LazySection height={200}>
        <section className="relative py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <CyberCardGold padding="lg">
              <NeonGoldText as="p" className="text-h3 text-center mb-4">
                Passive Income Potential
              </NeonGoldText>
              <p className="text-body text-center mb-4">
                This same 7-tier structure works in reverse for agents you bring in - earning you passive income paid by eXp Realty, not your recruits.
              </p>
              <div className="flex justify-center">
                <CTAButton href="/exp-realty-revenue-share-calculator/">
                  View Your Potential
                </CTAButton>
              </div>
            </CyberCardGold>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Ready to Join The Alliance?</H2>
            <p className="text-body mt-4 mb-8">
              Get 7 layers of support above you, plus access to all our systems, training, and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                See Our Value
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
