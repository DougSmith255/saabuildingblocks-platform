'use client';

import Image from 'next/image';
import { GenericCard } from '@saa/shared/components/saa';

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
    logo: '/images/schools/aceable-agent-logo.png',
    url: 'https://www.aceableagent.com/',
  },
  'The CE Shop': {
    name: 'The CE Shop',
    logo: '/images/schools/ce-shop-logo.png',
    url: 'https://www.theceshop.com/',
  },
  'Colibri Real Estate': {
    name: 'Colibri Real Estate',
    logo: '/images/schools/colibri-logo.png',
    url: 'https://www.colibrirealestate.com/',
  },
  'RealEstateU': {
    name: 'RealEstateU',
    logo: '/images/schools/realestateu-logo.png',
    url: 'https://www.realestateu.com/',
  },
  '360 Training': {
    name: '360 Training',
    logo: '/images/schools/360-training-logo.png',
    url: 'https://www.360training.com/',
  },
  'Allied Real Estate Schools': {
    name: 'Allied Real Estate Schools',
    logo: '/images/schools/allied-logo.png',
    url: 'https://www.alliedschools.com/',
  },
  'Kaplan': {
    name: 'Kaplan',
    logo: '/images/schools/kaplan-logo.png',
    url: 'https://www.kapre.com/',
  },
  'Colorado Real Estate School': {
    name: 'Colorado Real Estate School',
    logo: '/images/schools/colorado-re-school-logo.png',
    url: 'https://www.coloradorealestatelearning.com/',
  },
  'The Indiana Real Estate Institute': {
    name: 'Indiana Real Estate Institute',
    logo: '/images/schools/indiana-rei-logo.png',
    url: 'https://www.indianarealestatetraining.com/',
  },
  'McColly Real Estate': {
    name: 'McColly Real Estate',
    logo: '/images/schools/mccolly-logo.png',
    url: 'https://www.mccolly.com/',
  },
  'Cuyahoga Community College': {
    name: 'Cuyahoga Community College',
    logo: '/images/schools/tri-c-logo.png',
    url: 'https://www.tri-c.edu/',
  },
  'Illinois REALTORS': {
    name: 'Illinois REALTORS',
    logo: '/images/schools/illinois-realtors-logo.png',
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
        {/* Section Header */}
        <h2
          className="text-center mb-8 text-2xl md:text-3xl font-bold"
          style={{
            fontFamily: 'var(--font-taskor, sans-serif)',
            color: '#e5e4dd',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Featured Schools
        </h2>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolsData.map((school) => (
            <GenericCard
              key={school.name}
              className="flex flex-col items-center p-6"
              padding="md"
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
            </GenericCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SchoolCardsSection;
