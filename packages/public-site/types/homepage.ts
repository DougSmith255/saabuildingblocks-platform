export interface Highlight {
  title: string;
  description: string;
}

export interface TeamLeader {
  name: string;
  title: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
}

export interface TeamValue {
  title: string;
  description: string;
}

export interface HomepageData {
  highlights: Highlight[];
  leaders: TeamLeader[];
  values: TeamValue[];
  // Add other homepage data types here as needed
}
