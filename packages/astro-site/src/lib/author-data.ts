/**
 * Shared author metadata for structured data (Person schema).
 * Reuses data from AuthorSection.tsx for consistent author info across
 * BlogPosting JSON-LD and other structured data needs.
 */

export interface AuthorData {
  name: string;
  jobTitle: string;
  image: string;
  profileUrl: string;
  sameAs: string[];
}

const AUTHORS: Record<string, AuthorData> = {
  'Doug Smart': {
    name: 'Doug Smart',
    jobTitle: 'Co-Founder, Smart Agent Alliance',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    profileUrl: 'https://smartagentalliance.com/about-doug-smart/',
    sameAs: [
      'https://www.linkedin.com/in/doug-smart-718425274/',
      'https://www.youtube.com/@SmartAgentAlliance',
    ],
  },
  'Karrie Hill': {
    name: 'Karrie Hill',
    jobTitle: 'Co-Founder, Smart Agent Alliance',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
    profileUrl: 'https://smartagentalliance.com/about-karrie-hill/',
    sameAs: [
      'https://www.linkedin.com/in/karrie-hill-j-d/',
      'https://www.youtube.com/@SmartAgentAlliance',
    ],
  },
};

const AUTHOR_ALIASES: Record<string, string> = {
  'karriehill': 'Karrie Hill',
  'karrie hill': 'Karrie Hill',
  'karrie-hill': 'Karrie Hill',
  'dougsmith': 'Doug Smart',
  'doug smart': 'Doug Smart',
  'doug-smart': 'Doug Smart',
  'dougsmart': 'Doug Smart',
};

/**
 * Look up structured author data by name (with alias support).
 * Returns undefined if the author is not in the known list.
 */
export function getAuthorData(authorName: string): AuthorData | undefined {
  const canonical = AUTHOR_ALIASES[authorName.toLowerCase()] || authorName;
  return AUTHORS[canonical];
}
