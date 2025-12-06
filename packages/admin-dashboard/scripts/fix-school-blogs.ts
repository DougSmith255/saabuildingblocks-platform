#!/usr/bin/env tsx
/**
 * Fix Real Estate School Blogs
 * Strips Divi shortcodes and fixes heading structure based on analyzed patterns
 * Updates posts directly in WordPress via REST API
 */

import * as fs from 'fs';

const WP_API_BASE = 'https://wp.saabuildingblocks.com/wp-json/wp/v2';
const WP_USER = 'dougsmart1';
const WP_APP_PASSWORD = 'qFF8Ph4xkgiFeH78DWOGdf3z';

// School names that should be H2 headings
const SCHOOL_NAMES = [
  'The CE Shop',
  'Colibri Real Estate',
  'Kaplan Real Estate Education',
  'VanEd',
  'RealEstateU',
  '360 Training',
  '360Training',
  'Aceable Agent',
  'Real Estate Express',
  'PrepAgent',
  'Mbition',
  'Allied Schools',
  'OnCourse Learning',
  'AceableAgent',
  'StateWide Schools',
];

// Subsection names that should be H3 headings
const SUBSECTIONS = [
  'Pre-Licensing',
  'Exam Prep',
  'Post-Licensing',
  'Post Licensing',
  'Continuing Education',
  'Broker Licensing',
  'Pros:',
  'Cons:',
  'Our Review Process:',
  'Research and Data Collection:',
  'Evaluation Criteria:',
  'Scoring and Ranking:',
];

function stripDiviShortcodes(html: string): string {
  let result = html;

  // Remove all Divi shortcode tags
  result = result.replace(/\[et_pb_[^\]]*\]/g, '');
  result = result.replace(/\[\/et_pb_[^\]]*\]/g, '');
  result = result.replace(/\[\/?(vc_|fusion_|divi_|elementor-)[^\]]*\]/g, '');

  return result;
}

function fixHeadings(html: string): string {
  let result = html;

  // Remove empty heading tags
  result = result.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/g, '');

  // Fix school names - convert to H2 if they're in paragraphs or wrong heading levels
  for (const school of SCHOOL_NAMES) {
    // Match school name in bold within paragraph
    const boldPattern = new RegExp(`<p>\\s*<strong>${school}</strong>\\s*</p>`, 'gi');
    result = result.replace(boldPattern, `<h2 class="wp-block-heading">${school}</h2>`);

    // Match school name as H3 - upgrade to H2
    const h3Pattern = new RegExp(`<h3[^>]*>\\s*${school}\\s*</h3>`, 'gi');
    result = result.replace(h3Pattern, `<h2 class="wp-block-heading">${school}</h2>`);

    // Match school name alone in paragraph
    const pPattern = new RegExp(`<p>\\s*${school}\\s*</p>`, 'gi');
    result = result.replace(pPattern, `<h2 class="wp-block-heading">${school}</h2>`);
  }

  // Ensure subsections are H3
  for (const sub of SUBSECTIONS) {
    // Already H3 with inline styles - clean it
    const h3StylePattern = new RegExp(`<h3[^>]*>\\s*${sub}\\s*</h3>`, 'gi');
    result = result.replace(h3StylePattern, `<h3 class="wp-block-heading">${sub}</h3>`);

    // H2 subsection - downgrade to H3
    const h2Pattern = new RegExp(`<h2[^>]*>\\s*${sub}\\s*</h2>`, 'gi');
    result = result.replace(h2Pattern, `<h3 class="wp-block-heading">${sub}</h3>`);
  }

  // Clean up excessive whitespace
  result = result.replace(/<p>\s*<\/p>/g, '');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

async function fetchPost(postId: number): Promise<{ content: string; title: string }> {
  const response = await fetch(`${WP_API_BASE}/posts/${postId}`);
  const data = await response.json();
  return {
    content: data.content.rendered,
    title: data.title.rendered,
  };
}

async function updatePost(postId: number, content: string): Promise<boolean> {
  const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

  const response = await fetch(`${WP_API_BASE}/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to update post ${postId}:`, error);
    return false;
  }

  return true;
}

async function processPost(postId: number, dryRun: boolean = true): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);

  const { content, title } = await fetchPost(postId);
  console.log(`Processing: ${title} (ID: ${postId})`);

  // Check if already clean
  const hasDivi = content.includes('[et_pb_');
  const hasEmptyHeadings = /<h[1-6][^>]*>\s*<\/h[1-6]>/.test(content);

  console.log(`  Divi shortcodes: ${hasDivi ? 'YES - needs fixing' : 'clean'}`);
  console.log(`  Empty headings: ${hasEmptyHeadings ? 'YES - needs fixing' : 'clean'}`);

  if (!hasDivi && !hasEmptyHeadings) {
    console.log(`  ✓ Already clean, skipping`);
    return;
  }

  // Process content
  let cleaned = stripDiviShortcodes(content);
  cleaned = fixHeadings(cleaned);

  // Show heading structure
  const h2Matches = cleaned.match(/<h2[^>]*>.*?<\/h2>/g) || [];
  const h3Matches = cleaned.match(/<h3[^>]*>.*?<\/h3>/g) || [];

  console.log(`  H2 headings found: ${h2Matches.length}`);
  h2Matches.forEach(h => console.log(`    - ${h.replace(/<[^>]+>/g, '')}`));
  console.log(`  H3 headings found: ${h3Matches.length}`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would update post`);
    // Save to temp file for review
    fs.writeFileSync(`/tmp/fixed-${postId}.html`, cleaned);
    console.log(`  Saved preview to /tmp/fixed-${postId}.html`);
  } else {
    const success = await updatePost(postId, cleaned);
    if (success) {
      console.log(`  ✓ Updated successfully`);
    } else {
      console.log(`  ✗ Update failed`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');
  const singlePost = args.find(a => a.startsWith('--post='))?.split('=')[1];

  // Posts to fix (excluding already fixed: Oklahoma, Missouri, Indiana, Georgia)
  const postsToFix = [
    { id: 245590, name: 'Colorado' },
    { id: 245479, name: 'Ohio' },
    { id: 245393, name: 'Michigan' },
    { id: 245176, name: 'Illinois' },
    { id: 244788, name: 'Texas' },
    { id: 244753, name: 'Florida' },
    { id: 243048, name: 'California' },
    { id: 242995, name: 'General Schools' },
  ];

  console.log('Real Estate School Blog Fixer');
  console.log('=============================');
  console.log(`Mode: ${dryRun ? 'DRY RUN (use --execute to apply changes)' : 'EXECUTE'}`);

  if (singlePost) {
    const post = postsToFix.find(p => p.id === parseInt(singlePost));
    if (post) {
      await processPost(post.id, dryRun);
    } else {
      console.error(`Post ID ${singlePost} not found in list`);
    }
  } else {
    for (const post of postsToFix) {
      await processPost(post.id, dryRun);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(dryRun ? 'Dry run complete. Review /tmp/fixed-*.html files' : 'All posts updated!');
  console.log('Run with --execute to apply changes to WordPress');
}

main().catch(console.error);
