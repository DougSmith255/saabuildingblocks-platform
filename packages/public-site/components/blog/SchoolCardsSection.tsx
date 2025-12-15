'use client';

import Image from 'next/image';
import { CyberCard } from '@saa/shared/components/saa';
import H2 from '@saa/shared/components/saa/headings/H2';

/**
 * School data for the cards section
 * Each school has a name, logo URL, and website link
 */
export interface SchoolData {
  name: string;
  logo: string;
  url: string;
}

/**
 * Master list of all real estate schools with their logos and URLs
 * Logos should be uploaded to Cloudflare Images or public folder
 */
export const SCHOOL_DATABASE: Record<string, SchoolData> = {
  'AceableAgent': {
    name: 'AceableAgent',
    logo: '/images/schools/aceable-agent-logo.svg',
    url: 'https://www.aceableagent.com/',
  },
  'The CE Shop': {
    name: 'The CE Shop',
    logo: '/images/schools/ce-shop-logo.svg',
    url: 'https://www.theceshop.com/',
  },
  'Colibri Real Estate': {
    name: 'Colibri Real Estate',
    logo: '/images/schools/colibri-logo.svg',
    url: 'https://www.colibrirealestate.com/',
  },
  'RealEstateU': {
    name: 'RealEstateU',
    logo: '/images/schools/realestateu-logo.svg',
    url: 'https://www.realestateu.com/',
  },
  '360 Training': {
    name: '360 Training',
    logo: '/images/schools/360-training-logo.svg',
    url: 'https://www.360training.com/',
  },
  'Allied Real Estate Schools': {
    name: 'Allied Real Estate Schools',
    logo: '/images/schools/allied-logo.svg',
    url: 'https://www.alliedschools.com/',
  },
  'Kaplan': {
    name: 'Kaplan',
    logo: '/images/schools/kaplan-logo.svg',
    url: 'https://www.kapre.com/',
  },
  'Colorado Real Estate School': {
    name: 'Colorado Real Estate School',
    logo: '/images/schools/colorado-re-school-logo.svg',
    url: 'https://www.coloradorealestatelearning.com/',
  },
  'The Indiana Real Estate Institute': {
    name: 'Indiana Real Estate Institute',
    logo: '/images/schools/indiana-rei-logo.svg',
    url: 'https://www.indianarealestatetraining.com/',
  },
  'McColly Real Estate': {
    name: 'McColly Real Estate',
    logo: '/images/schools/mccolly-logo.svg',
    url: 'https://www.mccolly.com/',
  },
  'Cuyahoga Community College': {
    name: 'Cuyahoga Community College',
    logo: '/images/schools/tri-c-logo.svg',
    url: 'https://www.tri-c.edu/',
  },
  'Illinois REALTORS': {
    name: 'Illinois REALTORS',
    logo: '/images/schools/illinois-realtors-logo.svg',
    url: 'https://www.illinoisrealtors.org/',
  },
};

/**
 * Mapping of blog post slugs to their featured schools
 * This determines which school cards appear on each post
 */
export const POST_SCHOOLS_MAP: Record<string, string[]> = {
  'texas-2': ['AceableAgent', 'The CE Shop', 'Colibri Real Estate', 'RealEstateU', '360 Training'],
  'florida-2': ['AceableAgent', 'The CE Shop', 'Colibri Real Estate', 'RealEstateU', '360 Training'],
  'california-2': ['AceableAgent', 'The CE Shop', 'Allied Real Estate Schools', 'RealEstateU', '360 Training'],
  'georgia-2': ['AceableAgent', 'The CE Shop', 'Colibri Real Estate', 'RealEstateU', '360 Training'],
  'michigan-2': ['AceableAgent', 'The CE Shop', 'Colibri Real Estate', 'RealEstateU'],
  'illinois-2': ['The CE Shop', 'Colibri Real Estate', 'Illinois REALTORS'],
  'ohio-2': ['The CE Shop', 'Colibri Real Estate', 'Cuyahoga Community College'],
  'colorado-2': ['The CE Shop', 'Colibri Real Estate', 'Colorado Real Estate School', 'Kaplan'],
  'indiana-2': ['The CE Shop', 'Colibri Real Estate', 'The Indiana Real Estate Institute', 'McColly Real Estate'],
  'missouri-2': ['The CE Shop', 'Colibri Real Estate', 'RealEstateU', '360 Training'],
  'oklahoma-2': ['The CE Shop', 'Colibri Real Estate', '360 Training'],
  'schools': ['AceableAgent', 'The CE Shop', 'Colibri Real Estate', 'RealEstateU', '360 Training'],
};

interface SchoolCardsSectionProps {
  /** Blog post slug to determine which schools to show */
  postSlug: string;
  /** Optional override for schools list */
  schools?: string[];
}

/**
 * SchoolCardsSection - Displays school cards in a 3x2 grid
 *
 * Features:
 * - 3 columns on desktop, 2 on tablet, 1 on mobile
 * - Max 6 schools (3x2 grid)
 * - Each card has: Logo, School name, "View Courses" button
 * - Dark mode styling only (matches blog post dark theme)
 * - All elements aligned consistently across cards
 */
export function SchoolCardsSection({ postSlug, schools: overrideSchools }: SchoolCardsSectionProps) {
  // Get schools for this post
  const schoolNames = overrideSchools || POST_SCHOOLS_MAP[postSlug] || [];

  // Limit to 6 schools max (3x2 grid)
  const limitedSchools = schoolNames.slice(0, 6);

  // Get school data for each
  const schoolsData = limitedSchools
    .map(name => SCHOOL_DATABASE[name])
    .filter(Boolean);

  if (schoolsData.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header with proper H2 styling and spacing */}
        <div className="mb-12">
          <H2>FEATURED SCHOOLS</H2>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolsData.map((school) => (
            <CyberCard
              key={school.name}
              className="flex flex-col items-center"
              padding="lg"
              centered={true}
            >
              {/* Logo Container - Fixed height for alignment */}
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <div className="relative w-full h-full max-w-[180px]">
                  <Image
                    src={school.logo}
                    alt={`${school.name} logo`}
                    fill
                    className="object-contain"
                    sizes="180px"
                    onError={(e) => {
                      // Hide broken image and show school name instead
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* School Name - Fixed height for alignment */}
              <h3
                className="text-center mb-4 h-14 flex items-center justify-center"
                style={{
                  fontFamily: 'var(--font-amulya, sans-serif)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#e5e4dd',
                  lineHeight: 1.3,
                }}
              >
                {school.name}
              </h3>

              {/* View Courses Button - Styled like SecondaryButton */}
              <a
                href={school.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3
                  rounded-xl
                  text-sm font-semibold uppercase tracking-wider
                  transition-all duration-300
                  hover:scale-105
                  mt-auto
                "
                style={{
                  fontFamily: 'var(--font-taskor, sans-serif)',
                  background: 'linear-gradient(180deg, #3d3d3d 0%, #2a2a2a 100%)',
                  color: '#ffd700',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                View Courses
              </a>
            </CyberCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SchoolCardsSection;
