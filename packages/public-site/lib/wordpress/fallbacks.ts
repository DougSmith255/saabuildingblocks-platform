/**
 * WordPress Fallback Utilities
 *
 * Provides graceful fallbacks for missing WordPress data:
 * - Author ID = 0 → "SAA Building Blocks Team"
 * - Missing featured_media → Placeholder image
 * - Empty tags/categories → Empty arrays
 *
 * @module lib/wordpress/fallbacks
 * @see /docs/AI-AGENT-PAGE-BUILDING-PROTOCOL.md
 */

/**
 * Default author when WordPress returns author ID = 0 or no author data
 */
export const DEFAULT_AUTHOR = {
  name: 'SAA Building Blocks Team',
  avatar: '/images/saa-avatar-default.svg',
} as const;

/**
 * Default featured image when WordPress returns featured_media = 0 or no image
 */
export const DEFAULT_FEATURED_IMAGE = {
  url: '/images/blog-placeholder.svg',
  alt: 'SAA Building Blocks Blog Post',
  width: 1200,
  height: 630,
} as const;

/**
 * Ensures a valid author object, using fallback if needed
 *
 * @param author - Author object from WordPress API (may be undefined or have empty name)
 * @returns Valid author object with name and optional avatar
 *
 * @example
 * ```tsx
 * const author = ensureAuthor(post.author);
 * // Returns: { name: 'SAA Building Blocks Team', avatar: '/images/saa-avatar-default.jpg' }
 * ```
 */
export function ensureAuthor(author?: { name: string; avatar?: string }) {
  // No author provided or author has empty name
  if (!author || !author.name || author.name.trim() === '') {
    return DEFAULT_AUTHOR;
  }

  // Author exists but has no avatar
  if (!author.avatar) {
    return {
      ...author,
      avatar: DEFAULT_AUTHOR.avatar,
    };
  }

  return author;
}

/**
 * Ensures a valid featured image object, using fallback if needed
 *
 * @param image - Featured image object from WordPress API (may be undefined or have empty URL)
 * @returns Valid featured image object with URL, alt text, width, and height
 *
 * @example
 * ```tsx
 * const featuredImage = ensureFeaturedImage(post.featuredImage);
 * // Returns placeholder if post.featuredImage is undefined or has no URL
 * ```
 */
export function ensureFeaturedImage(image?: {
  url: string;
  alt: string;
  width: number;
  height: number;
}) {
  // No image provided or image has empty URL
  if (!image || !image.url || image.url.trim() === '') {
    return DEFAULT_FEATURED_IMAGE;
  }

  return image;
}

/**
 * Ensures a valid categories array
 *
 * @param categories - Categories array from WordPress API (may be undefined)
 * @returns Valid categories array (empty array if undefined)
 *
 * @example
 * ```tsx
 * const categories = ensureCategories(post.categories);
 * // Returns: [] if post.categories is undefined
 * ```
 */
export function ensureCategories(categories?: string[]): string[] {
  return categories && Array.isArray(categories) ? categories : [];
}

/**
 * Cleans excerpt of shortcodes, HTML tags, and entities
 * Returns plain text suitable for display in blog cards
 *
 * @param excerpt - Raw excerpt from WordPress (may contain HTML, shortcodes, entities)
 * @param maxLength - Optional maximum length (truncates with ellipsis)
 * @returns Clean plain text excerpt
 *
 * @example
 * ```tsx
 * const clean = cleanExcerpt(post.excerpt, 160);
 * // Returns text without [et_pb_*] shortcodes, HTML tags, etc.
 * ```
 */
export function cleanExcerpt(excerpt: string, maxLength?: number): string {
  if (!excerpt) return '';

  // Remove Divi shortcodes like [et_pb_*] and [/et_pb_*]
  let cleaned = excerpt.replace(/\[\/?\s*et_pb[^\]]*\]/gi, '');

  // Remove any other shortcodes like [rank-math-*], [/shortcode], etc.
  cleaned = cleaned.replace(/\[\/?[^\]]+\]/g, '');

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#039;/g, "'");
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&hellip;/g, '...');
  cleaned = cleaned.replace(/&#8217;/g, "'");
  cleaned = cleaned.replace(/&#8220;/g, '"');
  cleaned = cleaned.replace(/&#8221;/g, '"');

  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Truncate if maxLength specified
  if (maxLength && cleaned.length > maxLength) {
    // Find last space before maxLength to avoid cutting words
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    cleaned = (lastSpace > maxLength - 30 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  return cleaned;
}

/**
 * Ensures valid excerpt text
 *
 * @param excerpt - Excerpt text from WordPress API (may be undefined or HTML)
 * @returns Clean excerpt text or default message
 *
 * @example
 * ```tsx
 * const excerpt = ensureExcerpt(post.excerpt);
 * // Returns cleaned excerpt or fallback text
 * ```
 */
export function ensureExcerpt(excerpt?: string): string {
  if (!excerpt || excerpt.trim() === '') {
    return 'Read this blog post to learn more.';
  }

  // Use cleanExcerpt to strip shortcodes, HTML, and entities
  const cleaned = cleanExcerpt(excerpt);

  return cleaned || 'Read this blog post to learn more.';
}

/**
 * Formats date string for display
 *
 * @param dateString - ISO date string from WordPress
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string
 *
 * @example
 * ```tsx
 * const formattedDate = formatDate(post.date);
 * // Returns: "January 15, 2025"
 * ```
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Truncates text to specified length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 160)
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * ```tsx
 * const shortExcerpt = truncateText(post.excerpt, 100);
 * // Returns text truncated to 100 characters with "..."
 * ```
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}
