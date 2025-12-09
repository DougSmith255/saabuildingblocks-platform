'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, ProfileCyberFrame } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';

// Cloudflare-ready image URLs (using same as WhoWeAre section)
const KARRIE_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Karrie-Profile-Picture.png';
const DOUG_PROFILE_IMAGE = 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png';

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
        "A master at all things creative. He is the creative director here at SmartAgentAlliance.com and loves to help agents with anything that has to do with design. In fact, he built this entire website, impressive huh?",
        "Doug worked in construction for 4 years on multi-million-dollar homes while in college. It means that he is a hard worker and will trudge through the mud for you, whatever it takes.",
        "He's also a huge fan of basketball and the modern-day equivalent to Arnold Schwarzenegger if he never took steroids, that means he likes the gym."
      ]
    },
    {
      tier: 2,
      name: "Karrie Hill, JD",
      title: "Co-Founder, Smart Agent Alliance",
      image: KARRIE_PROFILE_IMAGE,
      bio: [
        "Karrie loves providing clients and agents with unmatched value. She has the number 1 agent YouTube channel in Marin County, California. She is certified in Real Estate Negotiation, Home Marketing, Relocations and Express Offers (cash offers). She is a frequent guest on KDOW \"The Real Estate Report\".",
        "Karrie is a California attorney (inactive) having graduated top of her class at UC Berkeley law. Before becoming a realtor, Karrie bought and sold homes, practiced law, and spent over a decade as a professional stock trader.",
        "Karrie has raised three children and currently spends time with her husband and two little dogs – Baxter and Lily. She loves helping agents achieve their wildest hopes and dreams in the real estate business."
      ]
    }
  ];

  const uplinePartners = [
    {
      tier: 3,
      name: "Mike Sherrard",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/12/Upline-1.webp",
      bio: "#1 Personal Attractor at eXp. Most personally sponsored actively producing agents worldwide. Trained 1000s of agents every year how to scale their business with social media. Top 3 Realtor on YouTube Globally with 85,000+ subscribers. Co-Founder of the Wolf Pack."
    },
    {
      tier: 4,
      name: "Connor Steinbrook",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/12/Upline-2.webp",
      bio: "Top Social Media Influencer with a 35,000+ subscriber YouTube channel Investor Army. Top 43 Influencer at eXp Realty Who Built a Team of Over 2900 Agents in 4 Years. Co-Founder of the Wolf Pack."
    },
    {
      tier: 5,
      name: "Chris Soignier",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/12/Upline-3.webp",
      bio: "Broker Associate experienced in multi-family and commercial Real Estate investments. Chris is a Top 50 eXp Influencer amassing a Team of Agents Spanning Over 40 US States and 7 Countries."
    },
    {
      tier: 6,
      name: "Ian Flannigan",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/12/Upline-4.webp",
      bio: "Top 50 eXp Influencer. Built an international team of real estate agents in 7 years. Accomplished Entrepreneur, National Speaker, and Industry Leader with a strong passion for helping people achieve their personal and business goals."
    },
    {
      tier: 7,
      name: "Pat Hays",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/12/Upline-5.webp",
      bio: "Top Producing Real Estate Agent, Team Leader, Mentor. Who did $3.2 Million in Production His First Year in Real Estate. Pat has Built a Team of Over 2000 Agents Across North America in 42 States and 3 Canadian Provinces."
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>ABOUT US</H1>
          <Tagline className="mt-4">
            7 Layers of Support - Your eXp Realty Upline
          </Tagline>
        </div>
      </HeroSection>

      {/* Co-Founders Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Smart Agent Alliance Co-Founders</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Your first two points of contact. We focus on community, systems, training, and helping you grow as an agent.
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
                    {/* Tier Badge */}
                    <div className="absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold text-lg">{founder.tier}</span>
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
                  <h3 className="text-2xl font-bold text-[#e5e4dd] mb-1">{founder.name}</h3>
                  <p className="text-amber-400 mb-4">{founder.title}</p>
                  <div className="space-y-4 text-[#dcdbd5]">
                    {founder.bio.map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upline Partners Section */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <H2>Your Extended Upline - The Wolf Pack</H2>
              <p className="text-[#dcdbd5] mt-4">
                As part of Smart Agent Alliance, you also gain access to the Wolf Pack's resources, training, and community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uplinePartners.map((partner, index) => (
                <GenericCard key={index} padding="md" centered>
                  <div className="relative inline-block">
                    {/* Tier Badge */}
                    <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold text-sm">{partner.tier}</span>
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
                  <h4 className="text-xl font-bold text-[#e5e4dd] text-center mb-2">{partner.name}</h4>
                  <p className="text-[#dcdbd5]/80 text-sm text-center">{partner.bio}</p>
                </GenericCard>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Revenue Share Callout */}
      <LazySection height={200}>
        <section className="relative py-12 px-4 sm:px-8 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <GenericCard padding="lg" centered>
              <p className="text-[#dcdbd5] text-center mb-4">
                This same 7-tier structure works in reverse for agents you bring in - earning you passive income paid by eXp Realty, not your recruits.
              </p>
              <div className="flex justify-center">
                <CTAButton href="/exp-realty-revenue-share-calculator/">
                  Calculate Your Potential
                </CTAButton>
              </div>
            </GenericCard>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <H2>Ready to Join Smart Agent Alliance?</H2>
            <p className="text-[#dcdbd5] mt-4 mb-8">
              Get 7 layers of support above you, plus access to all our systems, training, and community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join Our Team
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
