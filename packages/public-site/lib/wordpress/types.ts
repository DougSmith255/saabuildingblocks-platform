/**
 * WordPress Blog Post Types
 * Type definitions for WordPress REST API responses
 */

export interface BlogPost {
  id: number;
  slug: string;
  /** Permalink Manager custom URI (e.g., 'about-exp-realty/technology') - source of truth for URL path */
  customUri?: string;
  /** Full permalink path extracted from WordPress link (e.g., 'blog/agent-career-info/part-time') */
  permalink: string;
  title: string;
  content: string;
  excerpt: string;
  /** Rank Math SEO meta description (preferred over excerpt for display) */
  metaDescription?: string;
  date: string;
  modified: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  /** Comparison images extracted from Divi shortcodes (for brokerage vs brokerage posts) */
  comparisonImages?: Array<{
    url: string;
    alt: string;
    title: string;
  }>;
  author: {
    name: string;
    avatar?: string;
  };
  categories: string[];
  /** YouTube video URL from ACF field (optional) */
  youtubeVideoUrl?: string;
}

export interface WordPressPost {
  id: number;
  slug: string;
  /** Full URL to the post (e.g., 'https://wp.saabuildingblocks.com/blog/agent-career-info/part-time/') */
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  /** ACF custom fields */
  acf?: {
    youtube_video_url?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ slug: string }>>;
    author?: Array<{
      name: string;
      avatar_urls?: { '96': string };
    }>;
  };
}

export interface WordPressAPIError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

/**
 * WordPress Page Types
 * Type definitions for WordPress Pages API
 */

export interface WordPressPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: string;
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
    avatar?: string;
  };
  template: string;
  parent: number;
  menuOrder: number;
}

export interface WordPressPageRaw {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  status: string;
  template?: string;
  parent: number;
  menu_order: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    author?: Array<{
      name: string;
      avatar_urls?: { '96': string };
    }>;
  };
}

/**
 * Category Configuration Types
 * For blog category template pages
 */

export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  title: string;
  tagline: string;
  backgroundImage: string;
  categorySlug: string;
  backButton: {
    label: string;
    href: string;
  };
  meta: {
    description: string;
    keywords: string[];
  };
}
