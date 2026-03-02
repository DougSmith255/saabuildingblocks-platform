#!/usr/bin/env tsx
/**
 * WordPress Divi Shortcode Cleanup Script
 *
 * Fetches all posts from WordPress REST API, identifies posts containing
 * Divi Builder shortcodes ([et_pb_*]), converts them to clean HTML,
 * and updates each post via the REST API.
 *
 * Usage:
 *   tsx scripts/cleanup-divi-wordpress.ts --dry-run   (preview changes, default)
 *   tsx scripts/cleanup-divi-wordpress.ts --live       (apply changes to WordPress)
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env.local') });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const WP_BASE = 'https://wp.saabuildingblocks.com/wp-json/wp/v2';
const WP_USER = process.env.WORDPRESS_USER || '';
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';
const PER_PAGE = 100;

if (!WP_USER || !WP_APP_PASSWORD) {
  console.error('Missing WORDPRESS_USER or WORDPRESS_APP_PASSWORD in .env.local');
  process.exit(1);
}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

const isLive = process.argv.includes('--live');
const isDryRun = !isLive;

// ---------------------------------------------------------------------------
// HTML entity decoding for shortcode attributes
// ---------------------------------------------------------------------------
function decodeEntities(text: string): string {
  return text
    .replace(/&#8221;/g, '"')   // right double quotation mark (used as opening quote in Divi)
    .replace(/&#8243;/g, '"')   // double prime (used as closing quote in Divi)
    .replace(/&#8220;/g, '"')   // left double quotation mark
    .replace(/&#8217;/g, "'")   // right single quotation mark
    .replace(/&#8216;/g, "'")   // left single quotation mark
    .replace(/&#038;/g, '&')    // ampersand
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'");
}

// ---------------------------------------------------------------------------
// Attribute parser - extracts key=value pairs from shortcode attributes string
// Handles both standard quotes and HTML entity quotes
// ---------------------------------------------------------------------------
function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!attrStr || !attrStr.trim()) return attrs;

  // First decode entities so all quotes become standard
  const decoded = decodeEntities(attrStr);

  // Match attr="value" patterns
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(decoded)) !== null) {
    attrs[match[1]] = match[2];
  }

  return attrs;
}

// ---------------------------------------------------------------------------
// Divi shortcode conversion - multi-pass, inside-out
// ---------------------------------------------------------------------------
function convertDiviToHtml(content: string): string {
  let result = content;

  // Pass 1: Extract [et_pb_text] inner content (contains well-formed HTML)
  result = result.replace(
    /\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/g,
    (_match, inner) => inner.trim()
  );

  // Pass 2: Convert [et_pb_image] to <figure><img></figure>
  // Image tags have empty content between open/close tags
  result = result.replace(
    /\[et_pb_image([^\]]*)\](?:[\s\S]*?\[\/et_pb_image\])?/g,
    (_match, attrStr) => {
      const attrs = parseAttributes(attrStr);
      const src = attrs.src || '';
      const alt = attrs.alt || attrs.title_text || '';
      if (!src) return '';
      return `<figure class="wp-block-image"><img src="${src}" alt="${alt}" /></figure>`;
    }
  );

  // Pass 3: Convert [et_pb_heading] to heading tags
  result = result.replace(
    /\[et_pb_heading([^\]]*)\](?:[\s\S]*?\[\/et_pb_heading\])?/g,
    (_match, attrStr) => {
      const attrs = parseAttributes(attrStr);
      const title = attrs.title || '';
      const level = attrs.title_level || 'h2';
      if (!title) return '';
      return `<${level}>${title}</${level}>`;
    }
  );

  // Pass 4: Extract [et_pb_code] inner content, strip line break holders
  result = result.replace(
    /\[et_pb_code[^\]]*\]([\s\S]*?)\[\/et_pb_code\]/g,
    (_match, inner) => {
      return inner
        .replace(/<!-- \[et_pb_line_break_holder\] -->/g, '\n')
        .trim();
    }
  );

  // Pass 5: Strip remaining layout wrappers and unknown [et_pb_*] tags
  // Opening tags: [et_pb_section ...], [et_pb_row ...], [et_pb_column ...], etc.
  result = result.replace(/\[et_pb_[^\]]*\]/g, '');
  // Closing tags: [/et_pb_section], [/et_pb_row], [/et_pb_column], etc.
  result = result.replace(/\[\/et_pb_[^\]]*\]/g, '');

  // Pass 6: Clean artifacts
  // Remove standalone line break holder comments (outside et_pb_code)
  result = result.replace(/<!-- \[et_pb_line_break_holder\] -->/g, '');

  // Collapse excessive blank lines (3+ newlines -> 2)
  result = result.replace(/\n{3,}/g, '\n\n');

  // Remove empty <p></p> tags
  result = result.replace(/<p>\s*<\/p>/g, '');

  return result.trim();
}

// ---------------------------------------------------------------------------
// WordPress API helpers
// ---------------------------------------------------------------------------
async function fetchAllPosts(): Promise<any[]> {
  const allPosts: any[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${WP_BASE}/posts?context=edit&per_page=${PER_PAGE}&page=${page}&status=publish`;
    console.log(`  Fetching page ${page}...`);

    const response = await fetch(url, {
      headers: { 'Authorization': AUTH_HEADER },
    });

    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }

    totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    const posts = await response.json();
    allPosts.push(...posts);

    console.log(`  Page ${page}/${totalPages}: ${posts.length} posts`);
    page++;
  }

  return allPosts;
}

async function updatePost(postId: number, content: string): Promise<boolean> {
  const url = `${WP_BASE}/posts/${postId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`  Failed to update post ${postId}: ${response.status} - ${body.slice(0, 200)}`);
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\nDivi Shortcode Cleanup - ${isDryRun ? 'DRY RUN' : 'LIVE MODE'}`);
  console.log('='.repeat(60));

  // Fetch all posts
  console.log('\nFetching all posts from WordPress...');
  const allPosts = await fetchAllPosts();
  console.log(`Total posts fetched: ${allPosts.length}`);

  // Identify Divi posts
  const diviPosts = allPosts.filter((p: any) => {
    const raw = p.content?.raw || '';
    return raw.includes('[et_pb_');
  });
  console.log(`Posts with Divi shortcodes: ${diviPosts.length}`);

  if (diviPosts.length === 0) {
    console.log('\nNo Divi posts found. Nothing to do.');
    return;
  }

  // Backup original content before any updates
  if (isLive) {
    const backupPath = join(process.env.HOME || '/home/ubuntu', 'tmp', `divi-backup-${Date.now()}.json`);
    const backupData = diviPosts.map((p: any) => ({
      id: p.id,
      title: p.title?.raw || p.title?.rendered || '',
      slug: p.slug,
      content_raw: p.content?.raw || '',
    }));
    writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`\nBackup saved: ${backupPath}`);
  }

  // Process each post
  console.log(`\nProcessing ${diviPosts.length} posts...\n`);
  let successCount = 0;
  let failCount = 0;

  for (const post of diviPosts) {
    const id = post.id;
    const title = (post.title?.raw || post.title?.rendered || '(untitled)').slice(0, 70);
    const rawContent = post.content?.raw || '';
    const cleanedContent = convertDiviToHtml(rawContent);

    // Count shortcodes removed
    const beforeCount = (rawContent.match(/\[et_pb_/g) || []).length;
    const afterCount = (cleanedContent.match(/\[et_pb_/g) || []).length;

    const sizeBefore = rawContent.length;
    const sizeAfter = cleanedContent.length;

    console.log(`[${id}] ${title}`);
    console.log(`  Shortcodes: ${beforeCount} -> ${afterCount} | Size: ${sizeBefore} -> ${sizeAfter} chars`);

    if (afterCount > 0) {
      console.log(`  WARNING: ${afterCount} shortcodes remain after cleanup`);
    }

    if (isDryRun) {
      // Show a preview snippet of the cleaned content
      const preview = cleanedContent.slice(0, 200).replace(/\n/g, ' ');
      console.log(`  Preview: ${preview}...`);
    } else {
      const success = await updatePost(id, cleanedContent);
      if (success) {
        successCount++;
        console.log(`  Updated successfully`);
      } else {
        failCount++;
      }
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    console.log('');
  }

  // Summary
  console.log('='.repeat(60));
  console.log('Summary:');
  console.log(`  Total Divi posts: ${diviPosts.length}`);
  if (isDryRun) {
    console.log('  Mode: DRY RUN (no changes made)');
    console.log('  Run with --live to apply changes');
  } else {
    console.log(`  Updated: ${successCount}`);
    console.log(`  Failed: ${failCount}`);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
