/**
 * Remove old individual brokerage stat/comparison images from blog posts
 *
 * These are the individual "Features" cards and stat comparison cards
 * (Agent Satisfaction, Fees, Commission Splits, etc.) that have been
 * replaced by the new combined comparison chart images.
 *
 * The images are wrapped in <figure class="wp-block-image"> tags.
 * We remove the entire <figure>...</figure> element for each match.
 *
 * Usage:
 *   node remove-brokerage-stat-images.mjs              # Dry run
 *   node remove-brokerage-stat-images.mjs --apply      # Apply changes
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const WP_PATH = '/var/www/wordpress/';
const DRY_RUN = !process.argv.includes('--apply');

if (DRY_RUN) {
  console.log('DRY RUN - showing changes only. Use --apply to write to WordPress.\n');
} else {
  console.log('APPLYING changes to WordPress...\n');
}

// Image filename patterns to remove (matched against src attribute)
// These are the OLD individual stat card images, NOT the new combined comparison charts
const TARGET_IMAGE_PATTERNS = [
  // Individual brokerage "Features" cards
  'eXp-Realty-Features.webp',
  'Keller-Williams-Features.webp',
  'Compass-Features.webp',
  'Coldwell-Banker-Features.webp',
  'Sothebys-Features.webp',
  'Century-21-Features.webp',
  'Berkshire-Hathaway-Features.webp',
  'Redfin-Features.webp',
  'The-Agency-Features.webp',
  'Douglas-Elliman-Features.webp',
  'REMAX-Features.webp',
  'Better-Homes-And-Gardens-Brokerage-Features-for-Realtors.webp',
  'Fathom-Realty-Features.webp',
  'Cororan-Features.webp',
  'Real-Broker-Brokerage-Features.webp',
  'Real-Broker-Features-1.webp',
  'LPT-Realty-Brokerage-Features.webp',
  'Fathom-Realty-Commission-and-Fee-Breakdown.webp',

  // eXp-vs-* shared stat comparison cards
  'Commission-Splits-1.webp',
  'Agent-Satisfaction-1.webp',
  'Brokerage-Profitability-1.webp',
  'EO-Insurance-1.webp',
  'Fees-1.webp',
  'Training-and-Support-1.webp',
  'Technology-and-Resources-1.webp',
  'Why-Your-Brokerage-Choice-Matters-1.webp',
  'Brokerage-Availability.png',
  'Income-Opportunities.png',
  'eXps-Exclusive-Resources.png',
];

// All brokerage comparison post IDs (vs-vs posts only, excludes editorial posts)
const POST_IDS = [
  3717, 3718, 3719, 3720, 3721, 3722, 3724, 3725, 3726, 3727,
  3728, 3729, 3731, 3732, 3733, 3743, 3744, 3745, 3746, 3747,
  3748, 3749, 3750, 3752, 3753, 3754, 3755, 3758, 3759, 3760,
  3761, 3762, 3763, 3768, 3779, 3780, 3786, 3789, 3792, 3795,
  3800, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3815,
  3818, 3819, 3820, 3821, 3822, 3823, 3825, 3826, 3827, 3828,
];

/**
 * Check if an img src matches any of our target patterns
 */
function isTargetImage(src) {
  return TARGET_IMAGE_PATTERNS.some(pattern => src.includes(pattern));
}

/**
 * Get post content from WP-CLI
 */
function getPostContent(postId) {
  const tmpPath = `/home/ubuntu/tmp/wp-brok-${postId}.html`;
  try {
    return readFileSync(tmpPath, 'utf-8');
  } catch {
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
 * Update post content via WP-CLI
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
 * Remove standalone brokerage stat images from content.
 *
 * Three HTML patterns exist across posts:
 *
 * 1) Divi-cleaned posts: entire wrapper div
 *    <div class="brokerage-comparison-images" ...>
 *      <figure style="flex: 1;"><img .../></figure>
 *      <figure style="flex: 1;"><img .../></figure>
 *    </div>
 *
 * 2) Uncleaned posts: bare <figure class="wp-block-image"> elements
 *    <figure class="wp-block-image"><img src="..." /></figure>
 *
 * 3) Rare: bare <img> inside <p> tags
 */
function removeTargetImages(content) {
  let removedCount = 0;
  const removedFiles = [];

  let result = content;

  // Pattern 1: Divi-cleaned wrapper div with brokerage-comparison-images class
  // Remove the entire div if ALL images inside are targets
  const wrapperRegex = /<div class="brokerage-comparison-images"[^>]*>[\s\S]*?<\/div>/g;
  result = result.replace(wrapperRegex, (match) => {
    const srcs = [...match.matchAll(/src="([^"]*)"/g)].map(m => m[1]);
    const targetSrcs = srcs.filter(src => isTargetImage(src));
    if (targetSrcs.length > 0 && targetSrcs.length === srcs.length) {
      // All images in this wrapper are targets - remove entire div
      targetSrcs.forEach(src => {
        removedFiles.push(src.split('/').pop());
        removedCount++;
      });
      return '';
    } else if (targetSrcs.length > 0) {
      // Mixed: remove only matching figures inside
      let inner = match;
      for (const src of targetSrcs) {
        const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const figRegex = new RegExp(`\\s*<figure[^>]*>[\\s\\S]*?${escaped}[\\s\\S]*?<\\/figure>`, 'g');
        inner = inner.replace(figRegex, '');
        removedFiles.push(src.split('/').pop());
        removedCount++;
      }
      return inner;
    }
    return match;
  });

  // Pattern 2: <figure class="wp-block-image"> elements
  const figureRegex = /<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>[\s\S]*?<\/figure>/g;
  result = result.replace(figureRegex, (match) => {
    const srcMatch = match.match(/src="([^"]*)"/);
    if (srcMatch && isTargetImage(srcMatch[1])) {
      removedFiles.push(srcMatch[1].split('/').pop());
      removedCount++;
      return '';
    }
    return match;
  });

  // Pattern 3: bare <img> inside <p> tags
  const imgRegex = /<p>\s*<img[^>]*src="([^"]*)"[^>]*\/?>\s*<\/p>/g;
  result = result.replace(imgRegex, (match, src) => {
    if (isTargetImage(src)) {
      removedFiles.push(src.split('/').pop());
      removedCount++;
      return '';
    }
    return match;
  });

  return { content: result, removedCount, removedFiles };
}

async function main() {
  console.log(`Processing ${POST_IDS.length} brokerage comparison posts...\n`);

  let totalRemoved = 0;
  let postsUpdated = 0;
  let postsSkipped = 0;
  let postsFailed = 0;

  for (const postId of POST_IDS) {
    const content = getPostContent(postId);
    if (!content) {
      console.log(`  SKIP Post ${postId}: could not fetch content`);
      postsSkipped++;
      continue;
    }

    const { content: newContent, removedCount, removedFiles } = removeTargetImages(content);

    if (removedCount === 0) {
      console.log(`  SKIP Post ${postId}: no target images found`);
      postsSkipped++;
      continue;
    }

    // Safety: ensure we didn't remove too much (>30% of content)
    const ratio = (content.length - newContent.length) / content.length;
    if (ratio > 0.3) {
      console.log(`  WARN Post ${postId}: would remove ${(ratio * 100).toFixed(0)}% of content, skipping`);
      postsSkipped++;
      continue;
    }

    const fileList = removedFiles.map(f => f.replace(/\.webp|\.png/g, '')).join(', ');
    console.log(`  OK   Post ${postId}: removing ${removedCount} images (${fileList})`);

    if (!DRY_RUN) {
      const success = updatePostContent(postId, newContent);
      if (success) {
        postsUpdated++;
        totalRemoved += removedCount;
        // Clear cached content so re-runs see fresh data
        try { unlinkSync(`/home/ubuntu/tmp/wp-brok-${postId}.html`); } catch {}
      } else {
        postsFailed++;
      }
    } else {
      postsUpdated++;
      totalRemoved += removedCount;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log(`  ${DRY_RUN ? 'Would update' : 'Updated'}: ${postsUpdated} posts`);
  console.log(`  ${DRY_RUN ? 'Would remove' : 'Removed'}: ${totalRemoved} images`);
  console.log(`  Skipped: ${postsSkipped}`);
  if (postsFailed) console.log(`  Failed: ${postsFailed}`);
  if (DRY_RUN) console.log('  (Use --apply to write changes)');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
