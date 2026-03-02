/**
 * Fix factual errors in license guide blog posts via WP-CLI
 *
 * Usage:
 *   node fix-license-blog-errors.mjs              # Dry-run (show changes only)
 *   node fix-license-blog-errors.mjs --apply      # Apply changes to WordPress
 *
 * Verified errors found by auditing post content against official state websites.
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

const WP_PATH = '/var/www/wordpress/';
const DRY_RUN = !process.argv.includes('--apply');

if (DRY_RUN) {
  console.log('🔍 DRY RUN - showing changes only. Use --apply to write to WordPress.\n');
} else {
  console.log('✏️  APPLYING changes to WordPress...\n');
}

/**
 * Define all fixes: { postId, state, replacements: [{ old, new, description }] }
 */
const FIXES = [
  {
    postId: 3812,
    state: 'California',
    replacements: [
      {
        old: 'As of 2023, the fee is $245.',
        new: 'As of 2024, the fee is $350.',
        description: 'License application fee: $245 → $350',
      },
      {
        old: 'a fee of $60',
        new: 'a fee of $100',
        description: 'Exam fee: $60 → $100 per attempt',
      },
      {
        old: '(You can get this done at UPS for $65)',
        new: '(Typically costs $70-$85, varies by provider)',
        description: 'Fingerprint fee: UPS $65 → $70-$85 varies',
      },
    ],
  },
  {
    postId: 3793,
    state: 'Illinois',
    replacements: [
      {
        old: 'As of 2024, the fee is $125.',
        new: 'As of 2024, the fee is $150.',
        description: 'Application fee in body: $125 → $150',
      },
      {
        old: 'Application Fee: $125',
        new: 'Application Fee: $150',
        description: 'Application fee list item: $125 → $150',
      },
      {
        old: 'application fee ($125)',
        new: 'application fee ($150)',
        description: 'Application fee in cost breakdown: $125 → $150',
      },
      {
        old: 'score at least 75% on both the national and Illinois-specific portions of the exam',
        new: 'score at least 70% on the national portion and 75% on the Illinois-specific portion of the exam',
        description: 'Pass score: flat 75% both → 70% national, 75% state',
      },
    ],
  },
  {
    postId: 3787,
    state: 'Ohio',
    replacements: [
      {
        old: 'complete 120 hours of pre-licensing education',
        new: 'complete 100 hours of pre-licensing education',
        description: 'Pre-licensing hours in body: 120 → 100',
      },
      {
        old: 'Complete 120 hours of pre-licensing education',
        new: 'Complete 100 hours of pre-licensing education',
        description: 'Pre-licensing hours in list: 120 → 100',
      },
    ],
  },
  {
    postId: 3785,
    state: 'Colorado',
    replacements: [
      {
        old: 'pay the $485 application fee',
        new: 'pay the $83 application fee',
        description: 'Application fee in body: $485 → $83',
      },
      {
        old: 'the fee for a Salesperson License in Colorado is $485',
        new: 'the fee for a Salesperson License in Colorado is $83',
        description: 'Application fee in detail: $485 → $83',
      },
      {
        old: 'Application Fee: $485</li>\n<li>',
        new: 'Application Fee: $83</li>\n<li>',
        description: 'Application fee in cost list: $485 → $83',
      },
      {
        old: '<strong>Application Fee:</strong> $485',
        new: '<strong>Application Fee:</strong> $83',
        description: 'Application fee in summary: $485 → $83',
      },
    ],
  },
  {
    postId: 3777,
    state: 'Indiana',
    replacements: [
      {
        old: 'The Ohio Real Estate Exam is a comprehensive test that lasts 3 hours and consists of 120 multiple-choice questions. To pass, you need to achieve a score of at least 70%. If you do not pass on your first attempt, you will need to submit a new application and pay the exam fee of $61 for each attempt.',
        new: 'The Indiana Real Estate Exam is a comprehensive test that lasts 4 hours and consists of 130 multiple-choice questions (80 national + 50 state-specific). To pass, you need to achieve a score of at least 75%. If you do not pass on your first attempt, you will need to submit a new application and pay the exam fee of $53 for each attempt.',
        description: 'Fix wrong state name (Ohio→Indiana) + exam details (120→130 questions, 3→4 hrs, 70→75%, $61→$53)',
      },
      {
        old: 'The Ohio pre-licensing course includes in-depth instruction on various critical areas of real estate. This includes a focus on civil rights laws, real estate finance, agency laws, and property transactions, providing you with the comprehensive knowledge needed for success in the profession.',
        new: 'The Indiana pre-licensing course includes in-depth instruction on various critical areas of real estate. This includes a focus on civil rights laws, real estate finance, agency laws, and property transactions, providing you with the comprehensive knowledge needed for success in the profession.',
        description: 'Fix wrong state name in course description: Ohio→Indiana',
      },
      {
        old: 'dive deep into Ohio-specific real estate laws',
        new: 'dive deep into Indiana-specific real estate laws',
        description: 'Fix wrong state name in curriculum: Ohio→Indiana',
      },
      {
        old: "along with Ohio\u2019s Civil Rights Act",
        new: "along with Indiana\u2019s Civil Rights Law",
        description: 'Fix wrong state civil rights law name: Ohio→Indiana',
      },
      {
        old: 'Free Ohio Real Estate Practice Exam',
        new: 'Free Indiana Real Estate Practice Exam',
        description: 'Fix wrong state name in practice exam link text',
      },
      {
        old: 'answer at least 60 out of 75 national questions and 38 out of 50 state-specific questions',
        new: 'answer at least 56 out of 80 national questions and 38 out of 50 state-specific questions',
        description: 'Fix exam breakdown: 75→80 national questions, 60→56 correct needed (70% of 80)',
      },
    ],
  },
];

/**
 * Get post content via WP-CLI
 */
function getPostContent(postId) {
  try {
    return execSync(
      `wp post get ${postId} --field=post_content --path=${WP_PATH}`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
  } catch (err) {
    console.error(`  Failed to fetch post ${postId}:`, err.message);
    return null;
  }
}

/**
 * Update post content via WP-CLI using a PHP file (safe for any HTML content)
 */
function updatePostContent(postId, content) {
  const tmpHtml = `/home/ubuntu/tmp/wp-fix-${postId}.html`;
  const tmpPhp = `/home/ubuntu/tmp/wp-fix-${postId}.php`;
  writeFileSync(tmpHtml, content);
  // Write a PHP script that reads the HTML file and updates the post
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

async function main() {
  let totalFixes = 0;
  let totalApplied = 0;
  let totalSkipped = 0;

  for (const fix of FIXES) {
    console.log(`\n📋 ${fix.state} (Post ID: ${fix.postId})`);
    console.log('─'.repeat(50));

    const content = getPostContent(fix.postId);
    if (!content) {
      console.log('  ⚠️  Could not fetch post content, skipping');
      continue;
    }

    let updatedContent = content;
    let changesMade = 0;

    for (const rep of fix.replacements) {
      if (updatedContent.includes(rep.old)) {
        updatedContent = updatedContent.replace(rep.old, rep.new);
        console.log(`  ✅ ${rep.description}`);
        changesMade++;
        totalFixes++;
      } else {
        console.log(`  ⏭  NOT FOUND: ${rep.description}`);
        totalSkipped++;
      }
    }

    if (changesMade === 0) {
      console.log('  ℹ️  No changes needed for this post');
      continue;
    }

    if (!DRY_RUN) {
      const success = updatePostContent(fix.postId, updatedContent);
      if (success) {
        console.log(`  💾 Updated post ${fix.postId} (${changesMade} changes)`);
        totalApplied += changesMade;
      } else {
        console.log(`  ❌ Failed to update post ${fix.postId}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`  Fixes found:   ${totalFixes}`);
  console.log(`  Not found:     ${totalSkipped}`);
  if (!DRY_RUN) {
    console.log(`  Applied:       ${totalApplied}`);
  } else {
    console.log(`  (Use --apply to write changes)`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
