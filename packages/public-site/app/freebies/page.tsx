'use client';

import { useState } from 'react';
import { H1, H2, Tagline, CTAButton, GenericCard, FreebieDownloadModal } from '@saa/shared/components/saa';
import { LazySection } from '@/components/shared/LazySection';
import Image from 'next/image';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { ParticleStormEffect } from '@/components/shared/hero-effects/ParticleStormEffect';

interface Freebie {
  title: string;
  description: string;
  image: string;
  type: 'download' | 'canva';
  fileUrl: string;
  fileName: string;
}

/**
 * Freebies Page
 * Free downloadable resources for real estate agents
 */
export default function Freebies() {
  const [selectedFreebie, setSelectedFreebie] = useState<Freebie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const freebies: Freebie[] = [
    {
      title: '"This or That" Posts',
      description: 'Boost engagement with your audience with "This or That" social media posts! (Canva Template)',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/03ff008ff4e48e5c-This-or-that-WebP.webp/public',
      type: 'canva',
      fileUrl: 'https://www.canva.com/design/DAG9-31Bilg/k1JVE9ThGFrunUkHUAkj9A/view?utm_content=DAG9-31Bilg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
      fileName: 'This-or-That-Posts.canva',
    },
    {
      title: 'Before Joining a Brokerage',
      description: '50+ essential questions to ask before choosing a brokerage!',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/7e81caf29f9fa3c2-Brokerage-Interview-Questions-WebP-2.webp/public',
      type: 'download',
      fileUrl: '/freebies/brokerage-interview-questions.pdf',
      fileName: 'Brokerage-Interview-Questions.pdf',
    },
    {
      title: 'Open House Sign-in Sheets',
      description: 'Impress clients with these professional open house sign-in sheets! (Canva Templates)',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/5ee94ed87b4d1eb7-Open-House-Sign-In-Sheets-WebP-2.webp/public',
      type: 'canva',
      fileUrl: 'https://www.canva.com/design/DAGiYencGxg/SL6_rJR3hFb9t7G477qPxg/view?utm_content=DAGiYencGxg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
      fileName: 'Open-House-Sign-In-Sheets.canva',
    },
    {
      title: 'Essential Buyer Checklist',
      description: 'Navigate each step with confidence: covers Pre-Offer, Offer, and Post-Offer essentials.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/9308b112da094661-Seller-WebP.webp/public',
      type: 'download',
      fileUrl: '/freebies/buyer-checklist.pdf',
      fileName: 'Buyer-Checklist.pdf',
    },
    {
      title: 'Complete Listing Checklist',
      description: 'Prepare for a smooth sale with guidelines for Pre-Listing, Activation, and Closing.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/d402a3b65b35bc37-Buyer-WebP.webp/public',
      type: 'download',
      fileUrl: '/freebies/listing-checklist.pdf',
      fileName: 'Listing-Checklist.pdf',
    },
    {
      title: 'Home Tour Note Sheet',
      description: 'Have your clients easily track their favorite features and deal-breakers at each home visit.',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/c3cc2ab729e003c9-Tour-notes-WebP.webp/public',
      type: 'download',
      fileUrl: '/freebies/home-tour-notes.pdf',
      fileName: 'Home-Tour-Notes.pdf',
    },
    {
      title: 'Business Card Templates',
      description: 'Professional Canva business card designs to make a lasting impression!',
      image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/7e81caf29f9fa3c2-Brokerage-Interview-Questions-WebP-2.webp/public',
      type: 'canva',
      fileUrl: 'https://www.canva.com/design/DAGsotBSd5w/2AzNUwuAw_7j0c0EuRsD6g/view?utm_content=DAGsotBSd5w&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
      fileName: 'Business-Card-Templates.canva',
    },
  ];

  const handleFreebieClick = (freebie: Freebie) => {
    setSelectedFreebie(freebie);
    setShowModal(true);
  };

  return (
    <main id="main-content">
      {/* Hero Section */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <ParticleStormEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <div className="relative z-10">
              <H1>RESOURCES</H1>
              <Tagline className="mt-4">
                Value first. Always.
              </Tagline>
            </div>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Freebies Grid */}
      <LazySection height={800}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <H2>Your Arsenal</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Tools that actually move the needle. Click any card to grab your copy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freebies.map((freebie, index) => (
                <button
                  key={index}
                  onClick={() => handleFreebieClick(freebie)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group block text-left w-full"
                >
                  <GenericCard hover padding="md" className="h-full overflow-hidden">
                    <div className="flex flex-col h-full">
                      {/* Image */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg -mt-6 -mx-6 mb-4" style={{ width: 'calc(100% + 48px)' }}>
                        <Image
                          src={freebie.image}
                          alt={freebie.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          unoptimized
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Canva badge */}
                        {freebie.type === 'canva' && (
                          <div className="absolute top-3 right-3 bg-[#00c4cc] text-white text-xs font-semibold px-2 py-1 rounded">
                            Canva Template
                          </div>
                        )}
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
                          {freebie.type === 'canva' ? 'Get Template' : 'Download'}
                          {hoveredIndex === index ? (
                            freebie.type === 'canva' ? (
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                  <path strokeDasharray={42} d="M11 5h-6v14h14v-6"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="42;0" /></path>
                                  <path strokeDasharray={12} strokeDashoffset={12} d="M13 11l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" to={0} /></path>
                                  <path strokeDasharray={8} strokeDashoffset={8} d="M21 3h-6M21 3v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" to={0} /></path>
                                </g>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeDasharray={60} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 19h11c2.21 0 4 -1.79 4 -4c0 -2.21 -1.79 -4 -4 -4h-1v-1c0 -2.76 -2.24 -5 -5 -5c-2.42 0 -4.44 1.72 -4.9 4h-0.1c-2.76 0 -5 2.24 -5 5c0 2.76 2.24 5 5 5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0" /></path>
                                <path fill="currentColor" d="M10.5 10h3v0h2.5l-4 0l-4 0h2.5Z"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.4s" keyTimes="0;0.4;1" values="M10.5 10h3v0h2.5l-4 0l-4 0h2.5Z;M10.5 10h3v0h2.5l-4 4l-4 -4h2.5Z;M10.5 10h3v3h2.5l-4 4l-4 -4h2.5Z" /></path>
                              </svg>
                            )
                          ) : (
                            freebie.type === 'canva' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                  <path d="M11 5h-6v14h14v-6" />
                                  <path d="M13 11l7 -7" />
                                  <path d="M21 3h-6M21 3v6" />
                                </g>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 19h11c2.21 0 4 -1.79 4 -4c0 -2.21 -1.79 -4 -4 -4h-1v-1c0 -2.76 -2.24 -5 -5 -5c-2.42 0 -4.44 1.72 -4.9 4h-0.1c-2.76 0 -5 2.24 -5 5c0 2.76 2.24 5 5 5Z" />
                                <path fill="currentColor" d="M10.5 10h3v3h2.5l-4 4l-4 -4h2.5Z" />
                              </svg>
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </GenericCard>
                </button>
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

      {/* Freebie Download Modal */}
      <FreebieDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        freebie={selectedFreebie}
      />
    </main>
  );
}
