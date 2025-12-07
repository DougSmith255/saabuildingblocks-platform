'use client';

import { H1, H2, Tagline, CTAButton, GenericCard } from '@saa/shared/components/saa';
import HeroSection from '@/components/shared/HeroSection';
import Image from 'next/image';

/**
 * Freebies Page
 * Free downloadable resources for real estate agents
 */
export default function Freebies() {
  const freebies = [
    {
      title: '"This or That" Posts',
      description: 'Boost engagement with your audience with "This or That" social media posts!',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/This-or-that-WebP.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/YxtfQekzqmQfkp7G0XX3',
    },
    {
      title: 'Before Joining a Brokerage',
      description: '50+ essential questions to ask before choosing a brokerage!',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/Brokerage-Interview-Questions-WebP-2.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/V8owfiQpXTATkg8T8rxL',
    },
    {
      title: 'Open House Sign-in Sheets',
      description: 'Impress clients with these professional open house sign-in sheets! (Canva Templates)',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/Open-House-Sign-In-Sheets-WebP-2.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/as4ILKy1ddg2fiQnHnHU',
    },
    {
      title: 'Essential Buyer Checklist',
      description: 'Navigate each step with confidence: covers Pre-Offer, Offer, and Post-Offer essentials.',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/Seller-WebP.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/LiQ8PzwEGDeXmfFIr29l',
    },
    {
      title: 'Complete Listing Checklist',
      description: 'Prepare for a smooth sale with guidelines for Pre-Listing, Activation, and Closing.',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/Buyer-WebP.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/rFZeAYhV3bTJxlN7wGEt',
    },
    {
      title: 'Home Tour Note Sheet',
      description: 'Have your clients easily track their favorite features and deal-breakers at each home visit.',
      image: 'https://wp.saabuildingblocks.com/wp-content/uploads/2024/10/Tour-notes-WebP.webp',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/gbjJZg8kNe6g3GFuCDGW',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <HeroSection className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full text-center">
          <H1>FREEBIE DOWNLOADS</H1>
          <Tagline className="mt-4">
            Free tools to help you grow your real estate business
          </Tagline>
        </div>
      </HeroSection>

      {/* Download All CTA - Using generic card style */}
      <section className="relative py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="bg-white/5 rounded-xl p-10 md:p-12 border border-white/10">
            <h3 className="text-xl font-bold text-[#e5e4dd] mb-4">Want Everything?</h3>
            <p className="text-[#dcdbd5] mb-8 max-w-md mx-auto">
              Download all 6 resources in one click and start building your real estate toolkit today.
            </p>
            <CTAButton href="https://link.proedgemarketingcrm.com/widget/form/Qy4wih5GxV4dzudHGxPV">
              DOWNLOAD ALL ASSETS
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Freebies Grid */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <H2>Free Resources</H2>
            <p className="text-[#dcdbd5] mt-4 max-w-2xl mx-auto">
              Each download is designed to help you succeed in your real estate business. Click any card to get your free copy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freebies.map((freebie, index) => (
              <a
                key={index}
                href={freebie.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <GenericCard hover padding="md" className="h-full overflow-hidden">
                  <div className="flex flex-col h-full">
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg -mt-6 -mx-6 mb-4" style={{ width: 'calc(100% + 48px)' }}>
                      <Image
                        src={freebie.image}
                        alt={freebie.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-[#e5e4dd] mb-2 group-hover:text-[#ffd700] transition-colors">
                        {freebie.title}
                      </h3>
                      <p className="text-[#dcdbd5]/80 text-sm mb-4 flex-1">
                        {freebie.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#ffd700] text-sm font-medium group-hover:gap-3 transition-all">
                        Download Free
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </GenericCard>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Why We Give These Away</H2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">Help Agents Succeed</h3>
              <p className="text-[#dcdbd5]/80 text-sm">
                We believe in lifting up the entire industry with practical tools that work.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">Build Relationships</h3>
              <p className="text-[#dcdbd5]/80 text-sm">
                Great partnerships start with giving value first, no strings attached.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-[#e5e4dd] mb-2">Show Our Value</h3>
              <p className="text-[#dcdbd5]/80 text-sm">
                If our free stuff is this good, imagine what you get when you join the team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[800px] mx-auto text-center">
          <H2>Ready for More?</H2>
          <p className="text-[#dcdbd5] mt-4 mb-8">
            These freebies are just a taste. Join the Wolf Pack and get access to our full library of resources, training, and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/join-exp-sponsor-team/">
              Join The Wolf Pack
            </CTAButton>
            <CTAButton href="/exp-realty-sponsor/">
              See Team Benefits
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
