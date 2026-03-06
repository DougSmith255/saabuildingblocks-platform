'use client';

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
    <section className="py-6 md:py-8">
      <div className="max-w-[900px] mx-auto">
        {/* Section Header */}
        <h3
          className="text-center mb-4"
          style={{
            fontFamily: 'var(--font-taskor, sans-serif)',
            fontSize: 'clamp(0.85rem, calc(0.8rem + 0.3vw), 1.1rem)',
            fontWeight: 600,
            color: '#ffd700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Featured Schools
        </h3>

        {/* Grid - equal height cards */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))` }}
        >
          {schoolsData.map((school) => (
            <a
              key={school.name}
              href={school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(145deg, rgba(50,50,50,0.6) 0%, rgba(25,25,25,0.8) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                minHeight: '90px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* School Name */}
              <span
                className="text-center flex-1 flex items-center"
                style={{
                  fontFamily: 'var(--font-amulya, sans-serif)',
                  fontSize: 'clamp(0.8rem, calc(0.75rem + 0.2vw), 0.95rem)',
                  fontWeight: 500,
                  color: '#e5e4dd',
                  lineHeight: 1.3,
                }}
              >
                {school.name}
              </span>

              {/* View Courses - always aligned at bottom */}
              <span
                className="mt-2 opacity-50 group-hover:opacity-100 transition-opacity"
                style={{
                  fontFamily: 'var(--font-taskor, sans-serif)',
                  fontSize: '0.65rem',
                  color: '#ffd700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                View Courses →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SchoolCardsSection;
