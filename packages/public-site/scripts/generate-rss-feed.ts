/**
 * Generate RSS feed (feed.xml) from blog post JSON data
 *
 * Reads the chunked blog-posts JSON files and generates a valid RSS 2.0 feed
 * with production URLs (smartagentalliance.com).
 *
 * Output: out/feed.xml (placed in build output, not public/)
 *
 * Run: tsx scripts/generate-rss-feed.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://smartagentalliance.com';
const FEED_TITLE = 'Smart Agent Alliance';
const FEED_DESCRIPTION = 'Real estate insights, marketing strategies, brokerage comparisons, and career tips for agents.';

// Standalone categories that don't use /blog/ prefix
const STANDALONE_CATEGORIES = ['about-exp-realty', 'exp-realty-sponsor'];

interface BlogPost {
  id: number;
  slug: string;
  customUri?: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  categories: string[];
  author: { name: string };
}

function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function getPostUrl(post: BlogPost): string {
  const uri =
    post.customUri ||
    `${categoryToSlug(post.categories[0] || 'uncategorized')}/${post.slug}`;

  const firstSegment = uri.split('/')[0];
  if (STANDALONE_CATEGORIES.includes(firstSegment)) {
    return `${SITE_URL}/${uri}`;
  }

  return `${SITE_URL}/blog/${uri}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function main() {
  const publicDir = join(process.cwd(), 'public');
  const outDir = join(process.cwd(), 'out');

  // Read all chunk files
  const allPosts: BlogPost[] = [];
  const chunkFiles = readdirSync(publicDir)
    .filter(f => f.startsWith('blog-posts-chunk-') && f.endsWith('.json'))
    .sort();

  for (const file of chunkFiles) {
    const data = JSON.parse(readFileSync(join(publicDir, file), 'utf-8'));
    allPosts.push(...data);
  }

  if (allPosts.length === 0) {
    console.log('No blog posts found, skipping RSS generation');
    return;
  }

  // Sort by date descending, take latest 30
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const feedPosts = allPosts.slice(0, 30);

  const lastBuildDate = new Date(feedPosts[0].modified || feedPosts[0].date).toUTCString();

  const items = feedPosts.map(post => {
    const url = getPostUrl(post);
    const pubDate = new Date(post.date).toUTCString();
    const excerpt = escapeXml(stripHtml(post.excerpt || '').slice(0, 500));
    const category = post.categories[0] || 'Uncategorized';

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${excerpt}</description>
      <category>${escapeXml(category)}</category>
      <dc:creator>${escapeXml(post.author.name)}</dc:creator>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${FEED_DESCRIPTION}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  // Write to out/ directory (post-build output)
  if (existsSync(outDir)) {
    writeFileSync(join(outDir, 'feed.xml'), rss, 'utf-8');
    console.log(`RSS feed generated: out/feed.xml (${feedPosts.length} posts)`);
  } else {
    // Fallback: write to public/ if out/ doesn't exist yet
    writeFileSync(join(publicDir, 'feed.xml'), rss, 'utf-8');
    console.log(`RSS feed generated: public/feed.xml (${feedPosts.length} posts)`);
  }
}

main();
