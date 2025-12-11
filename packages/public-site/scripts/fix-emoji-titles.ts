#!/usr/bin/env tsx
/**
 * Fix Emoji Titles Script
 *
 * Syncs RankMath SEO titles from source WordPress to destination,
 * fixing corrupted emojis that became question marks.
 *
 * USAGE:
 *   npx tsx scripts/fix-emoji-titles.ts --dry-run   # Preview only
 *   npx tsx scripts/fix-emoji-titles.ts             # Actual fix
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

interface PostData {
  id: number;
  slug: string;
  title: string;
  rankMathTitle: string;
}

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
 * Fetch all posts from source with RankMath meta
 */
async function fetchSourcePosts(): Promise<Map<string, PostData>> {
  const posts = new Map<string, PostData>();
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${SOURCE_URL}/wp-json/wp/v2/posts?status=publish,future&per_page=100&page=${page}&context=edit`,
      { headers: { 'Authorization': getSourceAuth() } }
    );

    if (!response.ok) {
      if (response.status === 400) break;
      throw new Error(`Source API error: ${response.status}`);
    }

    const items = await response.json();
    if (items.length === 0) {
      hasMore = false;
    } else {
      for (const post of items) {
        posts.set(post.slug, {
          id: post.id,
          slug: post.slug,
          title: post.title?.raw || post.title?.rendered || '',
          rankMathTitle: post.meta?.rank_math_title || '',
        });
      }
      page++;
    }
  }

  return posts;
}

/**
 * Fetch all posts from destination
 */
async function fetchDestinationPosts(): Promise<PostData[]> {
  const posts: PostData[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await localFetch(
      `/wp-json/wp/v2/posts?status=publish,future,draft&per_page=100&page=${page}&context=edit`,
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
        posts.push({
          id: post.id,
          slug: post.slug,
          title: post.title?.raw || post.title?.rendered || '',
          rankMathTitle: post.meta?.rank_math_title || '',
        });
      }
      page++;
    }
  }

  return posts;
}

/**
 * Update RankMath title on destination
 */
async function updateRankMathTitle(postId: number, title: string): Promise<boolean> {
  try {
    const response = await localFetch(
      `/wp-json/wp/v2/posts/${postId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': getDestAuth(),
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ meta: { rank_math_title: title } }),
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if title has corrupted emoji (starts with ? or has ? followed by space and text)
 */
function hasCorruptedEmoji(title: string): boolean {
  // Starts with ? followed by space or letter
  if (/^\?\s/.test(title) || /^\?[A-Za-z]/.test(title)) {
    return true;
  }
  // Has multiple ? at the start (double emoji that got corrupted)
  if (/^\?\?/.test(title)) {
    return true;
  }
  return false;
}

/**
 * Check if title has proper emoji at start
 */
function hasEmoji(title: string): boolean {
  // Check for common emoji ranges at the start
  const emojiRegex = /^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]|^[\u{1F600}-\u{1F64F}]|^[\u{1F680}-\u{1F6FF}]/u;
  return emojiRegex.test(title);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('   FIX EMOJI TITLES');
  console.log('   ' + (isDryRun ? '🔍 DRY RUN MODE' : '🚀 LIVE MODE'));
  console.log('='.repeat(70));

  if (!SOURCE_PASSWORD || !DEST_PASSWORD) {
    console.error('\n❌ ERROR: WordPress app passwords not configured');
    process.exit(1);
  }

  // Fetch all source posts
  console.log('\n📥 Fetching source posts...');
  const sourcePosts = await fetchSourcePosts();
  console.log(`   Found ${sourcePosts.size} source posts`);

  // Fetch all destination posts
  console.log('\n📥 Fetching destination posts...');
  const destPosts = await fetchDestinationPosts();
  console.log(`   Found ${destPosts.length} destination posts\n`);

  let fixed = 0;
  let skipped = 0;
  let noMatch = 0;
  let alreadyOk = 0;

  for (const destPost of destPosts) {
    const sourcePost = sourcePosts.get(destPost.slug);

    if (!sourcePost) {
      // No matching source post
      noMatch++;
      continue;
    }

    const destTitle = destPost.rankMathTitle;
    const sourceTitle = sourcePost.rankMathTitle;

    // Skip if source has no RankMath title
    if (!sourceTitle) {
      skipped++;
      continue;
    }

    // Check if destination title is corrupted or missing emoji
    const destCorrupted = hasCorruptedEmoji(destTitle);
    const sourceHasEmoji = hasEmoji(sourceTitle);
    const destHasEmoji = hasEmoji(destTitle);

    // If source has emoji and dest is corrupted or missing emoji, fix it
    if (sourceHasEmoji && (destCorrupted || !destHasEmoji || destTitle !== sourceTitle)) {
      console.log(`\n📄 ${destPost.slug}`);
      console.log(`   Dest:   "${destTitle.substring(0, 60)}..."`);
      console.log(`   Source: "${sourceTitle.substring(0, 60)}..."`);

      if (isDryRun) {
        console.log(`   [DRY RUN] Would update to source title`);
        fixed++;
        continue;
      }

      const success = await updateRankMathTitle(destPost.id, sourceTitle);
      if (success) {
        console.log(`   ✅ Fixed`);
        fixed++;
      } else {
        console.log(`   ❌ Failed to update`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      alreadyOk++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('   SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n📊 Results:`);
  console.log(`   Fixed:     ${fixed}`);
  console.log(`   Already OK: ${alreadyOk}`);
  console.log(`   Skipped:   ${skipped} (no source RankMath title)`);
  console.log(`   No match:  ${noMatch} (no matching source post)`);
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
