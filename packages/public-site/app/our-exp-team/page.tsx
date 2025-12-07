'use client';

import { H1, H2, Tagline, CTAButton, CyberCardHolographic } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';
import Image from 'next/image';

/**
 * About Us / Our eXp Team Page
 */
export default function OurExpTeam() {
  const coFounders = [
    {
      name: "Karrie Hill, JD",
      title: "Global Team Leader",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Copy-of-Profiles-Momma.png",
      bio: [
        "Karrie loves providing clients and agents with unmatched value. She has the number 1 agent YouTube channel in Marin County, California. She is certified in Real Estate Negotiation, Home Marketing, Relocations and Express Offers (cash offers). She is a frequent guest on KDOW \"The Real Estate Report\".",
        "Karrie is a California attorney (inactive) having graduated top of her class at UC Berkeley law. Before becoming a realtor, Karrie bought and sold homes, practiced law, and spent over a decade as a professional stock trader.",
        "Karrie has raised three children and currently spends time with her husband and two little dogs – Baxter and Lily. She loves helping agents achieve their wildest hopes and dreams in the real estate business."
      ]
    },
    {
      name: "Doug Smart",
      title: "Global Team Leader",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Copy-of-Profiles-Me-2.png",
      bio: [
        "A master at all things creative. He is the creative director here at SmartAgentAlliance.com and loves to help agents with anything that has to do with design. In fact, he built this entire website, impressive huh?",
        "Doug worked in construction for 4 years on multi-million-dollar homes while in college. It means that he is a hard worker and will trudge through the mud for you, whatever it takes.",
        "He's also a huge fan of basketball and the modern-day equivalent to Arnold Schwarzenegger if he never took steroids, that means he likes the gym."
      ]
    }
  ];

  const uplinePartners = [
    {
      name: "Mike Sherrard",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Upline-1.png",
      bio: "#1 Personal Attractor at eXp. Most personally sponsored actively producing agents worldwide. Trained 1000s of agents every year how to scale their business with social media. Top 3 Realtor on YouTube Globally with 85,000+ subscribers. Co-Founder of the Wolf Pack."
    },
    {
      name: "Connor Steinbrook",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Upline-2.png",
      bio: "Top Social Media Influencer with a 35,000+ subscriber YouTube channel Investor Army. Top 43 Influencer at eXp Realty Who Built a Team of Over 2900 Agents in 4 Years. Co-Founder of the WolfPack."
    },
    {
      name: "Chris Soignier",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Upline-3.png",
      bio: "Broker Associate experienced in multi-family and commercial Real Estate investments. Chris is a Top 50 eXp Influencer amassing a Team of Agents Spanning Over 40 US States and 7 Countries."
    },
    {
      name: "Ian Flannigan",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Upline-4.png",
      bio: "Top 50 eXp Influencer. Built an international team of real estate agents in 7 years. Accomplished Entrepreneur, National Speaker, and Industry Leader with a strong passion for helping people achieve their personal and business goals."
    },
    {
      name: "Pat Hays",
      image: "https://wp.saabuildingblocks.com/wp-content/uploads/2023/11/Upline-5.png",
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
            We help agents achieve great success, time freedom, and a path to retirement with pay!
          </Tagline>
        </div>
      </HeroSection>

      {/* Co-Founders Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Our Co-Founders</H2>
          </div>

          <div className="space-y-16">
            {coFounders.map((founder, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="lg:w-1/3">
                  <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-amber-400/30">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
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
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Your Upline Partners When You Join Us</H2>
            <p className="text-[#dcdbd5] mt-4">
              Quick Wins, Massive Momentum, Tangible Results FASTER than Any Other Program.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uplinePartners.map((partner, index) => (
              <CyberCardHolographic key={index} className="p-6">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber-400/30">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#e5e4dd] text-center mb-2">{partner.name}</h4>
                <p className="text-[#dcdbd5]/80 text-sm text-center">{partner.bio}</p>
              </CyberCardHolographic>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready to Join Our Team?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            Partner with us and get access to all the resources, training, and support you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
            </CTAButton>
            <CTAButton href="/exp-realty-sponsor/">
              See Our Value
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
