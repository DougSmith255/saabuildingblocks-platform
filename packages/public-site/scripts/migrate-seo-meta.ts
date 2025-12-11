#!/usr/bin/env tsx
/**
 * RankMath SEO Meta Migration Script
 *
 * Scrapes SEO meta from source WordPress pages and updates destination posts.
 * Extracts: title, description, canonical, schema, and social meta from rendered HTML.
 *
 * USAGE:
 *   npx tsx scripts/migrate-seo-meta.ts --dry-run   # Preview only
 *   npx tsx scripts/migrate-seo-meta.ts             # Actual migration
 */

import { config } from 'dotenv';
import path from 'path';
import https from 'https';

// Allow self-signed certificates for localhost connections
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') });

// Configuration
const SOURCE_URL = 'https://smartagentalliance.com';
const DEST_HOST = 'wp.saabuildingblocks.com';
const DEST_USER = process.env.WORDPRESS_USER || 'dougsmart1';
const DEST_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const onlyRecent = args.includes('--recent'); // Only process posts migrated after Oct 7, 2025

interface SeoMeta {
  title: string;
  description: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: string;
}

interface PostInfo {
  id: number;
  slug: string;
  title: string;
  sourceUrl: string;
}

/**
 * Extract SEO meta from rendered HTML
 */
function extractSeoMeta(html: string): SeoMeta {
  const meta: SeoMeta = {
    title: '',
    description: '',
  };

  // Extract from head section
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return meta;
  const head = headMatch[1];

  // Title - check for og:title first (usually cleaner), fall back to <title>
  const ogTitleMatch = head.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
  const titleMatch = head.match(/<title[^>]*>(.*?)<\/title>/i);
  meta.title = ogTitleMatch?.[1] || titleMatch?.[1]?.replace(/\s*[-–|].*$/, '') || '';

  // Meta description
  const descMatch = head.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  meta.description = descMatch?.[1] || '';

  // Canonical URL
  const canonicalMatch = head.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  meta.canonicalUrl = canonicalMatch?.[1];

  // Robots
  const robotsMatch = head.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']robots["']/i);
  meta.robots = robotsMatch?.[1];

  // OpenGraph title (if different from regular title)
  if (ogTitleMatch) {
    meta.ogTitle = ogTitleMatch[1];
  }

  // OpenGraph description
  const ogDescMatch = head.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i);
  meta.ogDescription = ogDescMatch?.[1];

  // OpenGraph image
  const ogImageMatch = head.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
  meta.ogImage = ogImageMatch?.[1];

  // Twitter title
  const twitterTitleMatch = head.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:title["']/i);
  meta.twitterTitle = twitterTitleMatch?.[1];

  // Twitter description
  const twitterDescMatch = head.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:description["']/i);
  meta.twitterDescription = twitterDescMatch?.[1];

  // Twitter image
  const twitterImageMatch = head.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i)
    || head.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:image["']/i);
  meta.twitterImage = twitterImageMatch?.[1];

  // Schema.org JSON-LD (Article type)
  const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (schemaMatches) {
    for (const match of schemaMatches) {
      const content = match.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (content) {
        try {
          const json = JSON.parse(content[1].trim());
          // Look for Article schema
          if (json['@type'] === 'Article' || json['@type'] === 'BlogPosting') {
            meta.schema = content[1].trim();
            break;
          }
          // Check @graph for Article
          if (json['@graph']) {
            const article = json['@graph'].find((item: any) =>
              item['@type'] === 'Article' || item['@type'] === 'BlogPosting'
            );
            if (article) {
              meta.schema = JSON.stringify(article);
              break;
            }
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  return meta;
}

/**
 * Fetch page HTML from source
 */
async function fetchSourcePage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

/**
 * Local fetch for destination WordPress (bypass Cloudflare)
 */
function localFetch(
  urlPath: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  return new Promise((resolve, reject) => {
    const bodyBuffer = options.body ? Buffer.from(options.body, 'utf-8') : null;

    const reqOptions: https.RequestOptions = {
      hostname: '127.0.0.1',
      port: 443,
      path: urlPath,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Host': DEST_HOST,
        ...(bodyBuffer ? { 'Content-Length': bodyBuffer.length } : {}),
      },
      servername: DEST_HOST,
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode! >= 200 && res.statusCode! < 300,
          status: res.statusCode!,
          text: async () => data,
          json: async () => JSON.parse(data),
        });
      });
    });

    req.on('error', reject);
    if (bodyBuffer) req.write(bodyBuffer);
    req.end();
  });
}

/**
 * Get auth header
 */
function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${DEST_USER}:${DEST_PASSWORD}`).toString('base64')}`;
}

/**
 * Fetch destination posts
 */
async function fetchDestinationPosts(): Promise<PostInfo[]> {
  const posts: PostInfo[] = [];
  let page = 1;
  let hasMore = true;
  const cutoffDate = new Date('2025-10-07T05:00:00');

  while (hasMore) {
    const response = await localFetch(
      `/wp-json/wp/v2/posts?status=publish,future&per_page=100&page=${page}`,
      { headers: { 'Authorization': getAuthHeader() } }
    );

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`API error: ${response.status}`);
    }

    const items = await response.json();
    if (items.length === 0) {
      hasMore = false;
    } else {
      for (const post of items) {
        // Filter by date if --recent flag is set
        if (onlyRecent) {
          const postDate = new Date(post.date);
          if (postDate < cutoffDate) continue;
        }

        // Build source URL from slug and category structure
        const sourceUrl = `${SOURCE_URL}/${post.slug}/`;
        posts.push({
          id: post.id,
          slug: post.slug,
          title: post.title.rendered,
          sourceUrl,
        });
      }
      page++;
    }
  }

  return posts;
}

/**
 * Update post SEO meta
 */
async function updatePostSeoMeta(postId: number, meta: SeoMeta): Promise<boolean> {
  const updateData: Record<string, string> = {};

  if (meta.title) updateData.rank_math_title = meta.title;
  if (meta.description) updateData.rank_math_description = meta.description;
  if (meta.focusKeyword) updateData.rank_math_focus_keyword = meta.focusKeyword;
  if (meta.robots) updateData.rank_math_robots = meta.robots;
  if (meta.ogTitle) updateData.rank_math_facebook_title = meta.ogTitle;
  if (meta.ogDescription) updateData.rank_math_facebook_description = meta.ogDescription;
  if (meta.ogImage) updateData.rank_math_facebook_image = meta.ogImage;
  if (meta.twitterTitle) updateData.rank_math_twitter_title = meta.twitterTitle;
  if (meta.twitterDescription) updateData.rank_math_twitter_description = meta.twitterDescription;
  if (meta.twitterImage) updateData.rank_math_twitter_image = meta.twitterImage;
  // Note: We don't migrate schema because RankMath expects a specific internal format
  // and will auto-generate schema based on post content

  const response = await localFetch(
    `/wp-json/wp/v2/posts/${postId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meta: updateData }),
    }
  );

  return response.ok;
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('   RANKMATH SEO META MIGRATION');
  console.log('   ' + (isDryRun ? '🔍 DRY RUN MODE' : '🚀 LIVE MODE'));
  console.log('='.repeat(70));

  if (!DEST_PASSWORD) {
    console.error('\n❌ ERROR: WordPress app password not configured');
    process.exit(1);
  }

  // Fetch destination posts
  console.log('\n📥 Fetching destination posts...');
  const posts = await fetchDestinationPosts();
  console.log(`   Found ${posts.length} posts\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const post of posts) {
    console.log(`\n📄 Processing: "${post.title}"`);
    console.log(`   Slug: ${post.slug}`);

    try {
      // Try to fetch with the simple slug URL first
      let html: string;
      let sourceUrl = `${SOURCE_URL}/${post.slug}/`;

      try {
        html = await fetchSourcePage(sourceUrl);
      } catch {
        // If simple slug fails, try with category prefix (common patterns)
        const categoryPrefixes = ['about-exp-realty', 'exp-realty-sponsor', 'brokerage-comparison'];
        let found = false;

        for (const prefix of categoryPrefixes) {
          try {
            sourceUrl = `${SOURCE_URL}/${prefix}/${post.slug}/`;
            html = await fetchSourcePage(sourceUrl);
            found = true;
            break;
          } catch {
            continue;
          }
        }

        if (!found) {
          console.log(`   ⏭️  SKIPPED: Could not find source page`);
          skipped++;
          continue;
        }
      }

      console.log(`   Source: ${sourceUrl}`);

      // Extract SEO meta
      const meta = extractSeoMeta(html);

      if (!meta.title && !meta.description) {
        console.log(`   ⏭️  SKIPPED: No SEO meta found in source`);
        skipped++;
        continue;
      }

      console.log(`   Title: ${meta.title?.substring(0, 60)}...`);
      console.log(`   Description: ${meta.description?.substring(0, 60)}...`);
      console.log(`   Schema: ${meta.schema ? 'Found' : 'Not found'}`);

      if (isDryRun) {
        console.log(`   [DRY RUN] Would update post ${post.id}`);
        success++;
        continue;
      }

      // Update destination post
      const updated = await updatePostSeoMeta(post.id, meta);

      if (updated) {
        console.log(`   ✅ UPDATED: Post ID ${post.id}`);
        success++;
      } else {
        console.log(`   ❌ FAILED: Could not update post`);
        failed++;
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.log(`   ❌ ERROR: ${error}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('   MIGRATION SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n📊 Results:`);
  console.log(`   Success: ${success}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed:  ${failed}`);
  console.log('='.repeat(70) + '\n');
}

migrate().catch(console.error);
