#!/usr/bin/env tsx
/**
 * RankMath SEO Meta Migration Script (API Version)
 *
 * Fetches RankMath SEO meta directly from source WordPress API
 * and updates destination posts.
 *
 * USAGE:
 *   npx tsx scripts/migrate-seo-meta-api.ts --dry-run   # Preview only
 *   npx tsx scripts/migrate-seo-meta-api.ts             # Actual migration
 *   npx tsx scripts/migrate-seo-meta-api.ts --recent    # Only posts after Oct 7, 2025
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
const SOURCE_USER = process.env.SOURCE_WP_USER || 'dougsmart1';
const SOURCE_PASSWORD = process.env.SOURCE_WP_APP_PASSWORD || '';

const DEST_HOST = 'wp.saabuildingblocks.com';
const DEST_USER = process.env.WORDPRESS_USER || 'dougsmart1';
const DEST_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const onlyRecent = args.includes('--recent');

interface SeoMeta {
  title: string;
  description: string;
  focusKeyword: string;
  robots?: string;
}

interface PostInfo {
  destId: number;
  sourceId: number;
  slug: string;
  title: string;
}

/**
 * Get auth header
 */
function getSourceAuth(): string {
  return `Basic ${Buffer.from(`${SOURCE_USER}:${SOURCE_PASSWORD}`).toString('base64')}`;
}

function getDestAuth(): string {
  return `Basic ${Buffer.from(`${DEST_USER}:${DEST_PASSWORD}`).toString('base64')}`;
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
 * Fetch SEO meta from source WordPress API
 */
async function fetchSourceSeoMeta(postId: number): Promise<SeoMeta | null> {
  try {
    const response = await fetch(
      `${SOURCE_URL}/wp-json/wp/v2/posts/${postId}?context=edit`,
      { headers: { 'Authorization': getSourceAuth() } }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const meta = data.meta || {};

    return {
      title: meta.rank_math_title || '',
      description: meta.rank_math_description || '',
      focusKeyword: meta.rank_math_focus_keyword || '',
      robots: meta.rank_math_robots || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fetch source posts with their IDs
 */
async function fetchSourcePosts(): Promise<Map<string, number>> {
  const slugToId = new Map<string, number>();
  let page = 1;
  let hasMore = true;
  const cutoffDate = '2025-10-07T05:00:00';

  while (hasMore) {
    const url = onlyRecent
      ? `${SOURCE_URL}/wp-json/wp/v2/posts?status=publish,future&per_page=100&page=${page}&after=${cutoffDate}`
      : `${SOURCE_URL}/wp-json/wp/v2/posts?status=publish,future&per_page=100&page=${page}`;

    const response = await fetch(url, {
      headers: { 'Authorization': getSourceAuth() }
    });

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`Source API error: ${response.status}`);
    }

    const posts = await response.json();
    if (posts.length === 0) {
      hasMore = false;
    } else {
      for (const post of posts) {
        slugToId.set(post.slug, post.id);
      }
      page++;
    }
  }

  return slugToId;
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
      { headers: { 'Authorization': getDestAuth() } }
    );

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`Dest API error: ${response.status}`);
    }

    const items = await response.json();
    if (items.length === 0) {
      hasMore = false;
    } else {
      for (const post of items) {
        if (onlyRecent) {
          const postDate = new Date(post.date);
          if (postDate < cutoffDate) continue;
        }

        posts.push({
          destId: post.id,
          sourceId: 0, // Will be filled later
          slug: post.slug,
          title: post.title.rendered,
        });
      }
      page++;
    }
  }

  return posts;
}

/**
 * Update post SEO meta on destination
 */
async function updatePostSeoMeta(postId: number, meta: SeoMeta): Promise<boolean> {
  const updateData: Record<string, string> = {};

  if (meta.title) updateData.rank_math_title = meta.title;
  if (meta.description) updateData.rank_math_description = meta.description;
  if (meta.focusKeyword) updateData.rank_math_focus_keyword = meta.focusKeyword;
  if (meta.robots) updateData.rank_math_robots = meta.robots;

  try {
    const response = await localFetch(
      `/wp-json/wp/v2/posts/${postId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': getDestAuth(),
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ meta: updateData }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.log(`   API Error ${response.status}: ${text.substring(0, 100)}`);
    }

    return response.ok;
  } catch (error) {
    console.log(`   Exception: ${error}`);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('   RANKMATH SEO META MIGRATION (API VERSION)');
  console.log('   ' + (isDryRun ? '🔍 DRY RUN MODE' : '🚀 LIVE MODE'));
  console.log('='.repeat(70));

  if (!SOURCE_PASSWORD || !DEST_PASSWORD) {
    console.error('\n❌ ERROR: WordPress app passwords not configured');
    process.exit(1);
  }

  // Fetch source posts to get slug -> ID mapping
  console.log('\n📥 Fetching source posts...');
  const sourceSlugToId = await fetchSourcePosts();
  console.log(`   Found ${sourceSlugToId.size} source posts`);

  // Fetch destination posts
  console.log('\n📥 Fetching destination posts...');
  const destPosts = await fetchDestinationPosts();
  console.log(`   Found ${destPosts.length} destination posts\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const post of destPosts) {
    console.log(`\n📄 Processing: "${post.title}"`);
    console.log(`   Slug: ${post.slug}`);

    // Find source post ID
    const sourceId = sourceSlugToId.get(post.slug);
    if (!sourceId) {
      console.log(`   ⏭️  SKIPPED: No matching source post found`);
      skipped++;
      continue;
    }

    console.log(`   Source ID: ${sourceId} → Dest ID: ${post.destId}`);

    // Fetch SEO meta from source
    const meta = await fetchSourceSeoMeta(sourceId);
    if (!meta || (!meta.title && !meta.description && !meta.focusKeyword)) {
      console.log(`   ⏭️  SKIPPED: No SEO meta in source`);
      skipped++;
      continue;
    }

    console.log(`   Title: ${meta.title?.substring(0, 50)}${meta.title?.length > 50 ? '...' : ''}`);
    console.log(`   Description: ${meta.description?.substring(0, 50)}${meta.description?.length > 50 ? '...' : ''}`);
    console.log(`   Focus Keyword: ${meta.focusKeyword || '(none)'}`);

    if (isDryRun) {
      console.log(`   [DRY RUN] Would update post ${post.destId}`);
      success++;
      continue;
    }

    // Update destination post
    const updated = await updatePostSeoMeta(post.destId, meta);

    if (updated) {
      console.log(`   ✅ UPDATED: Post ID ${post.destId}`);
      success++;
    } else {
      console.log(`   ❌ FAILED: Could not update post`);
      failed++;
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
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
