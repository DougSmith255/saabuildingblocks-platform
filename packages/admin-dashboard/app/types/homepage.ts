/**
 * Homepage API Types
 */

export interface Highlight {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

export interface TeamValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface TeamLeader {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
}

export interface HomepageData {
  title: string;
  description: string;
  hero: {
    heading: string;
    subheading: string;
    cta_text: string;
    cta_url: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  highlights?: Highlight[];
  values?: TeamValue[];
  leaders?: TeamLeader[];
}

export interface HomepageResponse {
  data: HomepageData;
  updated_at: string;
}
