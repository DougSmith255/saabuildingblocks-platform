/**
 * WordPress Blog Post Types
 * Type definitions for WordPress REST API responses
 */

export interface BlogPost {
  id: number;
  slug: string;
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
