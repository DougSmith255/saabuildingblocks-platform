/**
 * Calculate reading time for blog post content
 *
 * Based on average reading speed of 200-250 words per minute.
 * Uses 200 WPM for a more conservative estimate.
 *
 * @param content - HTML or plain text content
 * @returns Reading time in minutes (e.g., "5 min read")
 */
export function calculateReadingTime(content: string): string {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');

  // Count words (split by whitespace, filter empty)
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // Calculate reading time (200 words per minute)
  const minutes = Math.ceil(wordCount / 200);

  // Return formatted string
  return `${minutes} min read`;
}

/**
 * Get just the numeric reading time in minutes
 *
 * @param content - HTML or plain text content
 * @returns Number of minutes
 */
export function getReadingTimeMinutes(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / 200);
}
