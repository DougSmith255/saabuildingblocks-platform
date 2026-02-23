/**
 * Shared JSON-LD structured data builders for blog posts.
 * Generates BlogPosting, VideoObject, and speakable schemas.
 */
import type { BlogPost } from '@/lib/wordpress/types';
import { getAuthorData } from '@/lib/author-data';

/** Strip HTML tags and get plain text for word counting */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
}

/**
 * Build full BlogPosting JSON-LD with all SEO-relevant fields:
 * - headline (from Rank Math SEO title)
 * - wordCount (signals content depth)
 * - articleSection (category for topic clustering)
 * - speakable (voice search eligibility)
 * - isPartOf (links to WebSite entity for E-E-A-T)
 * - video (VideoObject when YouTube URL present)
 */
export function buildBlogPostingSchema(
  post: BlogPost,
  postUrl: string,
) {
  const authorData = getAuthorData(post.author.name);
  const description = post.metaDescription || post.excerpt.slice(0, 160);
  const plainText = stripHtml(post.content);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  const author = authorData
    ? {
        '@type': 'Person' as const,
        name: authorData.name,
        url: authorData.profileUrl,
        jobTitle: authorData.jobTitle,
        sameAs: authorData.sameAs,
      }
    : {
        '@type': 'Person' as const,
        name: post.author.name,
      };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description,
    image: post.featuredImage?.url || 'https://smartagentalliance.com/og-image.jpg',
    datePublished: post.date,
    dateModified: post.modified,
    wordCount,
    articleSection: post.categories[0] || undefined,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'Smart Agent Alliance',
      '@id': 'https://smartagentalliance.com/#organization',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smartagentalliance.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://smartagentalliance.com${postUrl}`,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://smartagentalliance.com/#website',
      name: 'Smart Agent Alliance',
      url: 'https://smartagentalliance.com',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable="headline"]', '[data-speakable="summary"]'],
    },
  };

  return schema;
}

/**
 * Build VideoObject JSON-LD for posts with YouTube videos.
 * Returns null if no YouTube URL is present.
 */
export function buildVideoSchema(post: BlogPost) {
  if (!post.youtubeVideoUrl) return null;

  const videoId = extractYouTubeId(post.youtubeVideoUrl);
  if (!videoId) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt.slice(0, 160),
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    uploadDate: post.date,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
