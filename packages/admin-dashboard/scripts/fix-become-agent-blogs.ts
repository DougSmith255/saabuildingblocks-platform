#!/usr/bin/env tsx
/**
 * Fix "Become an Agent" Blogs
 * Strips Divi shortcodes and adds proper H2/H3 headings based on content structure
 * Updates posts directly in WordPress via REST API
 */

const WP_API_BASE = 'https://wp.saabuildingblocks.com/wp-json/wp/v2';
const WP_USER = 'dougsmart1';
const WP_APP_PASSWORD = 'qFF8Ph4xkgiFeH78DWOGdf3z';

interface HeadingInsert {
  before: string | RegExp;
  heading: string;
  level: 'h2' | 'h3';
}

// Define where headings should be inserted based on content patterns
const HEADING_PATTERNS: HeadingInsert[] = [
  // Main sections (H2)
  { before: /Before we dive into the detailed process/, heading: 'Basic Requirements', level: 'h2' },
  { before: /prospective real estate agents must complete \d+ hours/, heading: 'Pre-Licensing Education', level: 'h2' },
  { before: /Selecting the right real estate school is crucial/, heading: 'Choosing a Real Estate School', level: 'h2' },
  { before: /After completing your pre-licensing education, the next important step is to submit/, heading: 'Submit Your License Application', level: 'h2' },
  { before: /Real Estate Exam is a comprehensive test/, heading: 'Pass the Real Estate Exam', level: 'h2' },
  { before: /After you pass the real estate exam, the next step is to complete the fingerprinting/, heading: 'Complete Fingerprinting & Background Check', level: 'h2' },
  { before: /After completing the exam and fingerprinting requirements, the next crucial step is to submit your Sales Associate/, heading: 'Submit Your Sales Associate License Application', level: 'h2' },
  { before: /Once you pass the exam, you need to find a sponsoring broker/, heading: 'Find a Sponsoring Broker', level: 'h2' },
  { before: /When you join Smart Agent Alliance/, heading: 'Why Join Smart Agent Alliance?', level: 'h2' },
  { before: /Embarking on a real estate career involves some initial expenses/, heading: 'Costs and Financial Planning', level: 'h2' },
  { before: /When you join a brokerage .* many will require you to become a member/, heading: 'Association and MLS Fees', level: 'h2' },

  // FAQ section patterns
  { before: /<strong>1\. Age and Education<\/strong>.*must be at least 18/, heading: 'Frequently Asked Questions', level: 'h2' },
  { before: /The cost to get a real estate license .* includes several key expenses/, heading: 'How much does it cost to get a real estate license?', level: 'h3' },
  { before: /The time it takes to get a real estate license .* varies based on individual/, heading: 'How long does it take to get a real estate license?', level: 'h3' },
  { before: /The pass rate for the .* real estate exam is approximately/, heading: 'What is the pass rate for the real estate exam?', level: 'h3' },
  { before: /If you fail the .* real estate exam, you can retake/, heading: 'What happens if I fail the real estate exam?', level: 'h3' },
  { before: /To renew your .* real estate license, follow these steps/, heading: 'How do I renew my real estate license?', level: 'h3' },

  // Subsections (H3)
  { before: /To be eligible for a real estate license .* you must be at least 18 years old/, heading: 'Age Requirement', level: 'h3' },
  { before: /don't need to be a .* resident to apply/, heading: 'Residency Requirements', level: 'h3' },
  { before: /ethical behavior is vital.*will perform a thorough background check/, heading: 'Background Check Requirements', level: 'h3' },
  { before: /pre-licensing course includes in-depth instruction/, heading: 'What the Course Covers', level: 'h3' },
  { before: /Start by researching various real estate schools/, heading: 'Research Schools', level: 'h3' },
  { before: /Decide whether you prefer online or in-person/, heading: 'Online vs In-Person Classes', level: 'h3' },
  { before: /Evaluate the course materials and support services/, heading: 'Evaluate Course Materials', level: 'h3' },
  { before: /Create a daily study schedule/, heading: 'Study Tips', level: 'h3' },
  { before: /Commission generally takes several weeks to process/, heading: 'Application Processing Time', level: 'h3' },
  { before: /can monitor the status of your application online/, heading: 'Track Your Application', level: 'h3' },
  { before: /Go over the textbooks and notes from your pre-license/, heading: 'Exam Preparation Tips', level: 'h3' },
  { before: /Ensure you arrive at the exam center early/, heading: 'Exam Day Tips', level: 'h3' },
  { before: /Before scheduling your fingerprinting appointment/, heading: 'Scheduling Your Fingerprinting', level: 'h3' },
  { before: /Real Estate Commission.*will conduct a background check using your fingerprints/, heading: 'Background Check Process', level: 'h3' },
  { before: /Find a supportive and collaborative environment/, heading: 'What to Look For in a Broker', level: 'h3' },
  { before: /Choosing the right broker is crucial/, heading: 'Top Brokerages to Consider', level: 'h3' },
  { before: /At Smart Agent Alliance, we prioritize organization/, heading: 'Smart Agent Alliance Benefits', level: 'h3' },
  { before: /The Wolf Pack team at eXp Realty/, heading: 'Wolf Pack Benefits', level: 'h3' },
  { before: /eXp Realty offers a comprehensive range of benefits/, heading: 'Why eXp Realty?', level: 'h3' },
  { before: /All stated fees are subject to change/, heading: 'Initial Expenses Breakdown', level: 'h3' },
  { before: /<strong>Create a Budget<\/strong>/, heading: 'Financial Planning Tips', level: 'h3' },
  { before: /<strong>Commission Structure<\/strong>.*typically earn commissions/, heading: 'Understanding Your Income', level: 'h3' },
];

function stripDiviShortcodes(html: string): string {
  let result = html;
  result = result.replace(/\[et_pb_[^\]]*\]/g, '');
  result = result.replace(/\[\/et_pb_[^\]]*\]/g, '');
  result = result.replace(/\[\/?(vc_|fusion_|divi_|elementor-)[^\]]*\]/g, '');
  return result;
}

function addHeadings(html: string): string {
  let result = html;

  for (const pattern of HEADING_PATTERNS) {
    const regex = typeof pattern.before === 'string'
      ? new RegExp(`(<p>[^<]*${pattern.before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*</p>)`, 'i')
      : new RegExp(`(<p>[^<]*)(${pattern.before.source})`, 'i');

    if (regex.test(result)) {
      const headingTag = `<${pattern.level} class="wp-block-heading">${pattern.heading}</${pattern.level}>\n\n`;

      if (typeof pattern.before === 'string') {
        result = result.replace(regex, `${headingTag}$1`);
      } else {
        result = result.replace(regex, `${headingTag}$1$2`);
      }
    }
  }

  return result;
}

function cleanupHtml(html: string): string {
  let result = html;

  // Remove empty paragraphs
  result = result.replace(/<p>\s*<\/p>/g, '');

  // Remove empty headings
  result = result.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/g, '');

  // Clean up excessive whitespace
  result = result.replace(/\n{3,}/g, '\n\n');

  // Remove inline styles from headings (keep class only)
  result = result.replace(/<(h[1-6])[^>]*style="[^"]*"[^>]*>/g, '<$1 class="wp-block-heading">');

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

  const hasDivi = content.includes('[et_pb_');
  console.log(`  Divi shortcodes: ${hasDivi ? 'YES' : 'clean'}`);

  // Process content
  let cleaned = stripDiviShortcodes(content);
  cleaned = addHeadings(cleaned);
  cleaned = cleanupHtml(cleaned);

  // Count headings
  const h2Matches = cleaned.match(/<h2[^>]*>.*?<\/h2>/g) || [];
  const h3Matches = cleaned.match(/<h3[^>]*>.*?<\/h3>/g) || [];

  console.log(`  H2 headings added: ${h2Matches.length}`);
  h2Matches.slice(0, 10).forEach(h => console.log(`    - ${h.replace(/<[^>]+>/g, '')}`));
  if (h2Matches.length > 10) console.log(`    ... and ${h2Matches.length - 10} more`);

  console.log(`  H3 headings added: ${h3Matches.length}`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would update post`);
    const fs = await import('fs');
    fs.writeFileSync(`/tmp/become-fixed-${postId}.html`, cleaned);
    console.log(`  Saved preview to /tmp/become-fixed-${postId}.html`);
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

  // All "Become an Agent" posts
  const postsToFix = [
    { id: 246345, name: 'Oklahoma' },
    { id: 245964, name: 'Missouri' },
    { id: 245909, name: 'Indiana' },
    { id: 245781, name: 'Georgia' },
    { id: 245571, name: 'Colorado' },
    { id: 245476, name: 'Ohio' },
    { id: 245404, name: 'Michigan' },
    { id: 245174, name: 'Illinois' },
    { id: 244839, name: 'Texas' },
    { id: 244723, name: 'Florida' },
    { id: 242802, name: 'California' },
    { id: 242943, name: 'General License Guide' },
  ];

  console.log('"Become an Agent" Blog Fixer');
  console.log('============================');
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
  if (dryRun) {
    console.log('Dry run complete. Review /tmp/become-fixed-*.html files');
    console.log('Run with --execute to apply changes to WordPress');
  } else {
    console.log('All posts updated!');
    console.log('Run npm run generate:blog-posts to sync to Cloudflare');
  }
}

main().catch(console.error);
