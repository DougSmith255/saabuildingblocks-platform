/**
 * Remove SAA promotional sections from blog posts
 *
 * These sections contain the team group photo (Smart-Agent-Alliance-eXp-Realty-Sponsor-Team.webp)
 * and promotional content about joining Smart Agent Alliance at eXp Realty.
 *
 * Two removal patterns:
 *   A) Dedicated SAA section: entire section from heading to next heading is promo (51 posts)
 *   B) Mixed section: heading has real content, promo starts partway through (3 posts)
 *
 * Usage:
 *   node remove-saa-promo-sections.mjs              # Dry run
 *   node remove-saa-promo-sections.mjs --apply      # Apply changes
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'fs';

const WP_PATH = '/var/www/wordpress/';
const DRY_RUN = !process.argv.includes('--apply');
const IMAGE_FILENAME = 'Smart-Agent-Alliance-eXp-Realty-Sponsor-Team';

if (DRY_RUN) {
  console.log('🔍 DRY RUN - showing changes only. Use --apply to write to WordPress.\n');
} else {
  console.log('✏️  APPLYING changes to WordPress...\n');
}

// Posts where the heading starts real content and transitions to promo midway.
// For these, we remove from the promo boundary onward (not the heading).
const MIXED_POSTS = new Set([3895, 3908, 3774]);

/**
 * Get post content from a pre-saved temp file or fetch from WP-CLI
 */
function getPostContent(postId) {
  const tmpPath = `/home/ubuntu/tmp/wp-${postId}.html`;
  try {
    return readFileSync(tmpPath, 'utf-8');
  } catch {
    // Fetch from WP-CLI
    try {
      const content = execSync(
        `wp post get ${postId} --field=post_content --path=${WP_PATH}`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      );
      writeFileSync(tmpPath, content);
      return content;
    } catch (err) {
      console.error(`  Failed to fetch post ${postId}:`, err.message);
      return null;
    }
  }
}

/**
 * Update post content via WP-CLI using a PHP file
 */
function updatePostContent(postId, content) {
  const tmpHtml = `/home/ubuntu/tmp/wp-update-${postId}.html`;
  const tmpPhp = `/home/ubuntu/tmp/wp-update-${postId}.php`;
  writeFileSync(tmpHtml, content);
  writeFileSync(tmpPhp, `<?php
$content = file_get_contents('${tmpHtml}');
wp_update_post(array('ID' => ${postId}, 'post_content' => $content));
echo 'Updated post ${postId}';
`);
  try {
    execSync(
      `wp eval-file ${tmpPhp} --path=${WP_PATH}`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    return true;
  } catch (err) {
    console.error(`  Failed to update post ${postId}:`, err.message);
    return false;
  } finally {
    try { unlinkSync(tmpHtml); } catch {}
    try { unlinkSync(tmpPhp); } catch {}
  }
}

/**
 * Find all h2/h3 heading positions in content
 */
function findHeadings(content) {
  const regex = /<h[23][^>]*>.*?<\/h[23]>/gs;
  const results = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0].replace(/<[^>]+>/g, '').trim(),
      raw: match[0],
    });
  }
  return results;
}

/**
 * Find the start of wp:block comment before a position
 * (walks back to find <!-- wp:paragraph, <!-- wp:media-text, etc.)
 */
function findBlockCommentBefore(content, pos) {
  const before = content.substring(0, pos);
  // Look for the last <!-- wp: block opening comment
  const lastComment = Math.max(
    before.lastIndexOf('<!-- wp:paragraph'),
    before.lastIndexOf('<!-- wp:media-text'),
    before.lastIndexOf('<!-- wp:separator'),
    before.lastIndexOf('<!-- wp:image'),
    before.lastIndexOf('<!-- wp:heading'),
  );
  return lastComment >= 0 ? lastComment : pos;
}

/**
 * For Pattern A (dedicated SAA section): find section boundaries from heading to next heading.
 * Also includes any wp:heading comment before the heading tag.
 */
function findFullSectionBounds(content, imgPos) {
  const headings = findHeadings(content);
  const before = headings.filter(h => h.start < imgPos);
  const after = headings.filter(h => h.start > imgPos);

  if (before.length === 0) return null;

  const prevHeading = before[before.length - 1];

  // Walk back to find the <!-- wp:heading comment before the heading
  const sectionStart = findBlockCommentBefore(content, prevHeading.start);

  // Section ends at the start of the next heading's wp:heading comment, or end of content
  let sectionEnd;
  if (after.length > 0) {
    sectionEnd = findBlockCommentBefore(content, after[0].start);
  } else {
    sectionEnd = content.length;
  }

  return { start: sectionStart, end: sectionEnd, heading: prevHeading.text };
}

/**
 * For Pattern B (mixed section): find where SAA promo starts within the section.
 * Keep the heading and real content, remove from the promo transition onward.
 */
function findPromoBounds(content, imgPos) {
  const headings = findHeadings(content);
  const before = headings.filter(h => h.start < imgPos);
  const after = headings.filter(h => h.start > imgPos);

  if (before.length === 0) return null;

  const prevHeading = before[before.length - 1];
  const sectionContent = content.substring(prevHeading.end, imgPos);

  // Look for transition markers (first one wins)
  const markers = [
    sectionContent.indexOf('Speaking of brokerage'),
    sectionContent.indexOf('Speaking of Brokerage'),
    sectionContent.indexOf('wp:media-text'),
    sectionContent.indexOf("here's where things get interesting"),
    sectionContent.indexOf("Here's where things get interesting"),
    sectionContent.indexOf('who you name as your sponsor'),
    sectionContent.indexOf('When you choose Smart Agent Alliance'),
  ].filter(pos => pos >= 0);

  if (markers.length === 0) {
    // Fallback: treat as Pattern A
    return findFullSectionBounds(content, imgPos);
  }

  const firstMarkerOffset = Math.min(...markers);
  const absoluteMarkerPos = prevHeading.end + firstMarkerOffset;

  // Walk back to find the block comment before the transition paragraph
  const promoStart = findBlockCommentBefore(content, absoluteMarkerPos);

  // Promo ends at next heading or end of content
  let promoEnd;
  if (after.length > 0) {
    promoEnd = findBlockCommentBefore(content, after[0].start);
  } else {
    promoEnd = content.length;
  }

  return { start: promoStart, end: promoEnd, heading: prevHeading.text + ' (partial)' };
}

/**
 * Known post IDs containing the SAA team image (from blog JSON chunk analysis)
 */
const KNOWN_POST_IDS = [
  3895, 3898, 3899, 3903, 3904, 3908, 3909, 3913, 3919, 3920,
  3650, 3651, 3652, 3653, 3654, 3655, 3656, 3657, 3659, 3660,
  3661, 3662, 3663, 3664, 3665, 3666, 3677, 3680, 3681, 3682,
  3687, 3698, 3704, 3714, 3715, 3717, 3718, 3719, 3721, 3727,
  3730, 3744, 3748, 3753, 3754, 3759, 3760, 3764, 3774, 3816,
  3817, 3820, 3831, 3844, 3858, 3861, 3865, 3867,
];

function getAllPostIds() {
  return KNOWN_POST_IDS;
}

async function main() {
  const postIds = getAllPostIds();
  console.log(`Found ${postIds.length} posts containing the SAA team image.\n`);

  let removed = 0;
  let failed = 0;
  let skipped = 0;

  for (const postId of postIds) {
    const content = getPostContent(postId);
    if (!content || !content.includes(IMAGE_FILENAME)) {
      console.log(`  ⏭  Post ${postId}: image not found in content, skipping`);
      skipped++;
      continue;
    }

    const imgPos = content.indexOf(IMAGE_FILENAME);
    const isMixed = MIXED_POSTS.has(postId);

    const bounds = isMixed
      ? findPromoBounds(content, imgPos)
      : findFullSectionBounds(content, imgPos);

    if (!bounds) {
      console.log(`  ⚠️  Post ${postId}: could not determine section bounds, skipping`);
      skipped++;
      continue;
    }

    const sectionText = content.substring(bounds.start, bounds.end);
    const sectionChars = sectionText.length;

    // Safety check: section should contain the image
    if (!sectionText.includes(IMAGE_FILENAME)) {
      console.log(`  ⚠️  Post ${postId}: calculated section doesn't contain image, skipping`);
      skipped++;
      continue;
    }

    // Safety check: section shouldn't be more than 40% of the content
    const ratio = sectionChars / content.length;
    if (ratio > 0.4) {
      console.log(`  ⚠️  Post ${postId}: section is ${(ratio * 100).toFixed(0)}% of content (${sectionChars}/${content.length}), skipping`);
      skipped++;
      continue;
    }

    const type = isMixed ? 'PARTIAL' : 'FULL';
    console.log(`  ✅ Post ${postId} [${type}]: removing "${bounds.heading}" (${sectionChars} chars, ${(ratio * 100).toFixed(0)}%)`);

    if (!DRY_RUN) {
      const newContent = content.substring(0, bounds.start) + content.substring(bounds.end);

      // Verify the image is gone
      if (newContent.includes(IMAGE_FILENAME)) {
        console.log(`     ❌ Image still present after removal, skipping`);
        failed++;
        continue;
      }

      const success = updatePostContent(postId, newContent);
      if (success) {
        removed++;
      } else {
        failed++;
      }
    } else {
      removed++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`  ${DRY_RUN ? 'Would remove' : 'Removed'}: ${removed}`);
  console.log(`  Skipped:  ${skipped}`);
  if (failed) console.log(`  Failed:   ${failed}`);
  if (DRY_RUN) console.log(`  (Use --apply to write changes)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
