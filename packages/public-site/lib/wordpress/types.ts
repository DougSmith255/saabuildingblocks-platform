/**
 * WordPress Blog Post Types
 * Type definitions for WordPress REST API responses
 */

export interface BlogPost {
  id: number;
  slug: string;
  /** Full permalink path extracted from WordPress link (e.g., 'real-estate-agent-job/career/part-time') */
  permalink: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
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
  categories: string[];
}

export interface WordPressPost {
  id: number;
  slug: string;
  /** Full URL to the post (e.g., 'https://wp.saabuildingblocks.com/real-estate-agent-job/career/part-time/') */
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
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
