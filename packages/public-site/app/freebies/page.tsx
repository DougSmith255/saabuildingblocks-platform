'use client';

import { H1, H2, Tagline, CTAButton, GenericCard, CyberCardGold, NeonGoldText } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
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
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/03ff008ff4e48e5c-This-or-that-WebP.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/YxtfQekzqmQfkp7G0XX3',
    },
    {
      title: 'Before Joining a Brokerage',
      description: '50+ essential questions to ask before choosing a brokerage!',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/7e81caf29f9fa3c2-Brokerage-Interview-Questions-WebP-2.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/V8owfiQpXTATkg8T8rxL',
    },
    {
      title: 'Open House Sign-in Sheets',
      description: 'Impress clients with these professional open house sign-in sheets! (Canva Templates)',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/5ee94ed87b4d1eb7-Open-House-Sign-In-Sheets-WebP-2.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/as4ILKy1ddg2fiQnHnHU',
    },
    {
      title: 'Essential Buyer Checklist',
      description: 'Navigate each step with confidence: covers Pre-Offer, Offer, and Post-Offer essentials.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/9308b112da094661-Seller-WebP.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/LiQ8PzwEGDeXmfFIr29l',
    },
    {
      title: 'Complete Listing Checklist',
      description: 'Prepare for a smooth sale with guidelines for Pre-Listing, Activation, and Closing.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/d402a3b65b35bc37-Buyer-WebP.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/rFZeAYhV3bTJxlN7wGEt',
    },
    {
      title: 'Home Tour Note Sheet',
      description: 'Have your clients easily track their favorite features and deal-breakers at each home visit.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/c3cc2ab729e003c9-Tour-notes-WebP.webp/public',
      downloadLink: 'https://link.proedgemarketingcrm.com/widget/form/gbjJZg8kNe6g3GFuCDGW',
    },
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
        <div className="max-w-[1900px] mx-auto w-full text-center">
          <H1>FREE RESOURCES</H1>
          <Tagline className="mt-4">
            Value first. Always.
          </Tagline>
        </div>
      </section>

      {/* Download All CTA - Premium gold card */}
      <section className="relative py-12 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <CyberCardGold padding="lg">
            <NeonGoldText as="h3" className="text-h3 mb-4">Grab Everything</NeonGoldText>
            <p className="text-body mb-8 max-w-md mx-auto">
              All 6 resources in one download. Build your arsenal today.
            </p>
            <CTAButton href="https://link.proedgemarketingcrm.com/widget/form/Qy4wih5GxV4dzudHGxPV">
              DOWNLOAD ALL ASSETS
            </CTAButton>
          </CyberCardGold>
        </div>
      </section>

      {/* Freebies Grid */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <H2>Your Free Arsenal</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Tools that actually move the needle. Click any card to grab your copy.
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
                        <h3 className="text-h6 mb-2 group-hover:text-[#ffd700] transition-colors">
                          {freebie.title}
                        </h3>
                        <p className="text-body mb-4 flex-1" style={{ opacity: 0.8 }}>
                          {freebie.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[#ffd700] font-medium group-hover:gap-3 transition-all" style={{ fontSize: 'var(--font-size-caption)' }}>
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
      </LazySection>

      {/* Why Free Section */}
      <LazySection height={350}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Why Free?</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Because value creates trust. And trust builds partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">Lift the Industry</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  When agents succeed, everyone wins. These tools work.
                </p>
              </GenericCard>

              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">Value First</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  Real partnerships start with giving, not asking.
                </p>
              </GenericCard>

              <GenericCard padding="md" centered className="h-full">
                <h3 className="text-h6 mb-2">This Is Just a Sample</h3>
                <p className="text-body" style={{ opacity: 0.8 }}>
                  If the free stuff is this good, imagine what members get.
                </p>
              </GenericCard>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Want the Full Arsenal?</H2>
            <p className="text-body mt-4 mb-8">
              These downloads are just a preview. Join the Alliance for the complete library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/join-exp-sponsor-team/">
                Join The Alliance
              </CTAButton>
              <CTAButton href="/exp-realty-sponsor/">
                See Team Benefits
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
