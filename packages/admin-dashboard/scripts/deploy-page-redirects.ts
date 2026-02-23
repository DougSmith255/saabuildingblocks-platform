/**
 * Deploy redirects for old page URL patterns that changed structure.
 *
 * 1. /how-to-get-a-real-estate-license/in-{state} -> /blog/become-an-agent/{state}
 * 2. /real-estate-schools-online/in-{state} -> /blog/real-estate-schools/{state}
 * 3. One-off old blog title URLs
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID || '';

const isDryRun = process.argv.includes('--dry-run');

async function writeKV(kvPath: string, target: string): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(kvPath)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'text/plain',
    },
    body: target,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  FAILED: ${kvPath} -> ${err}`);
    return false;
  }
  return true;
}

async function deploy(from: string, to: string): Promise<boolean> {
  if (isDryRun) {
    console.log(`  ${from}  ->  ${to}`);
    return true;
  }

  // Both with and without trailing slash
  const withoutSlash = from.endsWith('/') ? from.slice(0, -1) : from;
  const withSlash = from.endsWith('/') ? from : from + '/';

  const ok1 = await writeKV(withoutSlash, to);
  const ok2 = await writeKV(withSlash, to);
  return ok1 && ok2;
}

const STATES = [
  'california', 'florida', 'texas', 'illinois', 'michigan',
  'ohio', 'colorado', 'georgia', 'indiana', 'missouri', 'oklahoma',
];

async function main() {
  console.log('==========================================');
  console.log(' Deploy Old Page Redirects to KV');
  console.log('==========================================\n');

  if (isDryRun) console.log('*** DRY RUN ***\n');

  if (!isDryRun && (!ACCOUNT_ID || !API_TOKEN || !NAMESPACE_ID)) {
    console.error('Missing env vars.');
    process.exit(1);
  }

  let deployed = 0;
  let failed = 0;

  // --- become-an-agent state pages ---
  console.log('--- /how-to-get-a-real-estate-license/ -> /blog/become-an-agent/ ---');

  // Parent page
  if (await deploy('/how-to-get-a-real-estate-license', '/blog/become-an-agent/license')) deployed++; else failed++;

  // California had a different slug format
  if (await deploy('/how-to-get-a-real-estate-license/how-to-get-a-real-estate-license-in-california', '/blog/become-an-agent/california')) deployed++; else failed++;

  // Other states: /how-to-get-a-real-estate-license/in-{state}
  for (const state of STATES) {
    if (await deploy(`/how-to-get-a-real-estate-license/in-${state}`, `/blog/become-an-agent/${state}`)) deployed++; else failed++;
  }

  console.log();

  // --- real-estate-schools state pages ---
  console.log('--- /real-estate-schools-online/ -> /blog/real-estate-schools/ ---');

  // Parent page
  if (await deploy('/real-estate-schools-online', '/blog/real-estate-schools/schools')) deployed++; else failed++;

  // California had a different slug format
  if (await deploy('/real-estate-schools-online/best-online-real-estate-schools-in-california', '/blog/real-estate-schools/california')) deployed++; else failed++;

  // Other states: /real-estate-schools-online/in-{state}
  for (const state of STATES) {
    if (await deploy(`/real-estate-schools-online/in-${state}`, `/blog/real-estate-schools/${state}`)) deployed++; else failed++;
  }

  console.log();

  // --- One-off old blog title URLs from Wayback Machine ---
  console.log('--- One-off old blog title URLs ---');

  const oneOffs: Array<[string, string]> = [
    ['/chatgpt-for-realtors-2024-11-essential-uses-to-outsmart-your-competition', '/blog/agent-career-info/chatgpt-uses'],
    ['/a-i-for-realtors', '/blog/agent-career-info/chatgpt-uses'],
    ['/a-lawyer-turned-realtor-why-i-chose-exp-realty-as-my-brokerage', '/blog/about-exp-realty/lawyer-to-realtor'],
    ['/about-exp', '/about-exp-realty'],
    ['/about-exp-our-free-team', '/exp-realty-sponsor/smart-agent-alliance'],
    ['/about-us', '/'],
    ['/become-real-estate-agent', '/blog/become-an-agent/license'],
    ['/best-exp-realty-sponsor', '/exp-realty-sponsor/find-yours'],
    ['/buyer-agent-presentation', '/blog/winning-clients/buyer-consultation'],
    ['/buyer-agent-value-117-services', '/blog/agent-career-info/buyer-agent-value'],
    ['/buyer-agents-must-act-now-sellers-no-longer-to-pay-buyer-agent', '/blog/industry-trends/buyer-agent-commission'],
    ['/century-21-vs-coldwell-banker', '/blog/brokerage-comparison/c21-cb'],
    ['/century-21-vs-keller-williams', '/blog/brokerage-comparison/c21-kw'],
    ['/compass-vs-keller-williams', '/blog/brokerage-comparison/compass-kw'],
    ['/contact-us', '/book-a-call'],
    ['/exp-realty-awards-2024', '/awards'],
    ['/exp-realty-commission-and-fees-2024', '/blog/about-exp-realty/fees'],
    ['/exp-realty-commission-and-fees-2024-everything-you-must-know', '/blog/about-exp-realty/fees'],
    ['/exp-realty-explained-in-9-minutes', '/blog/about-exp-realty/faqs'],
    ['/exp-realty-healthcare', '/blog/about-exp-realty/healthcare'],
    ['/exp-realty-revenue-share-2', '/blog/exp-realty-sponsor/revenue-share'],
    ['/exp-realty-sponsor-the-wolf-pack-a-powerful-team-for-2024', '/exp-realty-sponsor/smart-agent-alliance'],
    ['/exp-realty-vs-compass', '/blog/brokerage-comparison/exp-compass'],
    ['/exp-realty-vs-lpt-realty', '/blog/brokerage-comparison/exp-lpt'],
    ['/exp-realty-vs-real', '/blog/brokerage-comparison/exp-real'],
    ['/exp-revenue-share', '/blog/about-exp-realty/revenue-share'],
    ['/fathom-vs-compass', '/blog/brokerage-comparison/fathom-compass'],
    ['/fathom-vs-corcoran', '/blog/brokerage-comparison/fathom-corcoran'],
    ['/fathom-vs-redfin', '/blog/brokerage-comparison/fathom-redfin'],
    ['/fathom-vs-sothebys', '/blog/brokerage-comparison/fathom-sothebys'],
    ['/free-real-estate-leads-for-agents-15-proven-strategies-for-2024', '/blog/marketing-mastery/free-leads'],
    ['/free-team', '/exp-realty-sponsor/smart-agent-alliance'],
    ['/future-of-real-estate-buyer-agents-5-possible-outcomes', '/blog/industry-trends/buyer-agent-problems'],
    ['/join-exp-sponsor-team', '/book-a-call'],
    ['/join-our-exp-realty-sponsor-team', '/book-a-call'],
    ['/join-top-real-estate-brokerage-firms', '/book-a-call'],
    ['/linkedin-real-estate-leads-top-7-proven-strategies-for-2024', '/blog/marketing-mastery/linkedin-tips'],
    ['/listing-presentation-tips-outshine-the-competition-in-2024', '/blog/winning-clients/listing-presentation'],
    ['/lpt-vs-berkshire-hathaway', '/blog/brokerage-comparison/lpt-bhhs'],
    ['/lpt-vs-better-homes', '/blog/brokerage-comparison/lpt-bhhs'],
    ['/lpt-vs-fathom', '/blog/brokerage-comparison/lpt-fathom'],
    ['/lpt-vs-redfin', '/blog/brokerage-comparison/lpt-redfin'],
    ['/lpt-vs-the-agency', '/blog/brokerage-comparison/lpt-agency'],
    ['/master-chatgpt-the-ultimate-2024-guide-for-real-estate-agents', '/blog/marketing-mastery/chatgpt-prompts'],
    ['/members-only', '/'],
    ['/more-youtube-views-for-real-estate-agents-7-game-changing-tips-for-2024', '/blog/marketing-mastery/youtube-growth'],
    ['/nar-changes-effecting-buyer-agents', '/blog/industry-trends/nar-court-cases'],
    ['/new-real-estate-agent-tips-15-keys-to-thrive-in-your-career', '/blog/marketing-mastery/new-agent-tips'],
    ['/online-brokerage-comparison', '/best-real-estate-brokerage'],
    ['/open-house-tips-for-real-estate-agents-in-2024-to-get-quality-leads', '/blog/marketing-mastery/open-house-tips'],
    ['/our-exp-team/about-doug-smart', '/about-doug-smart'],
    ['/our-exp-team/about-karrie-hill', '/about-karrie-hill'],
    ['/questions-to-ask-before-joining-a-real-estate-team', '/blog/agent-career-info/team-questions'],
    ['/real-estate-agent-freebie', '/freebies'],
    ['/real-estate-agent-job', '/blog'],
    ['/real-estate-agent-training', '/blog/about-exp-realty/training'],
    ['/real-estate-social-media-marketing-for-agents-get-started-and-avoid-social-media-mistakes', '/blog/marketing-mastery/social-media-use'],
    ['/real-estate-this-or-that-post', '/blog/marketing-mastery/this-or-that-posts'],
    ['/real-vs-compass', '/blog/brokerage-comparison/real-compass'],
    ['/real-vs-fathom', '/blog/brokerage-comparison/real-fathom'],
    ['/real-vs-lpt', '/blog/brokerage-comparison/real-lpt'],
    ['/real-vs-redfin', '/blog/brokerage-comparison/real-redfin'],
    ['/realtors-should-do-youtube-in-2024-its-not-too-late-but-it-will-be', '/blog/marketing-mastery/youtube-launch'],
    ['/recession-proof-real-estate-agent-top-16-strategies-for-2024-success', '/blog/agent-career-info/recession'],
    ['/social-media-leads-for-agents', '/blog/marketing-mastery/youtube-leads'],
    ['/social-media-marketing-for-real-estate-agents-2024-guide-to-winning', '/blog/marketing-mastery/social-tips'],
    ['/start-a-youtube-channel-for-real-estate-agents-step-by-step-guide-in-2024', '/blog/marketing-mastery/youtube-launch'],
    ['/starting-youtube-for-realtors-saa', '/blog/marketing-mastery/youtube-launch'],
    ['/team-benefits', '/exp-realty-sponsor/smart-agent-alliance'],
    ['/tools', '/exp-commission-calculator'],
    ['/tools/brokerage-comparison', '/best-real-estate-brokerage'],
    ['/tools/brokerage-comparison/brokerage-comparisons', '/best-real-estate-brokerage'],
    ['/tools/exp-realty-revenue-share-calculator', '/exp-realty-revenue-share-calculator'],
    ['/tools/online-real-estate-brokerage', '/best-real-estate-brokerage'],
    ['/tools/real-estate-social-network', '/blog/marketing-mastery/social-network'],
    ['/tools/should-you-join-exp', '/blog/about-exp-realty/fit'],
    ['/agent-tools', '/exp-commission-calculator'],
    ['/agent-tools/exp-commission-and-fees-calculator', '/exp-commission-calculator'],
    ['/agent-tools/exp-realty-revenue-share-calculator', '/exp-realty-revenue-share-calculator'],
    ['/everything-real-estate', '/blog'],
    ['/is-exp-realty-good-for-new-agents-the-truth-revealed', '/blog/about-exp-realty/new-agents'],
    ['/brokerage-interview-questions', '/blog/agent-career-info/interview-questions'],
    ['/what-can-an-unlicensed-real-estate-assistant-do-2', '/blog/agent-career-info/unlicensed-tasks'],
    ['/about-exp-realty/locations', '/locations'],
    ['/about-exp-realty/workplace', '/blog/about-exp-realty/exp-workplace'],
    ['/about-exp-realty/topics', '/blog'],
    ['/about-exp-realty/awards', '/awards'],
  ];

  for (const [from, to] of oneOffs) {
    if (await deploy(from, to)) deployed++; else failed++;
  }

  if (!isDryRun) {
    // Small delay between writes
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\nDone! ${deployed} redirects deployed, ${failed} failed.`);
  if (isDryRun) console.log(`(${deployed * 2} KV entries with slash variants)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
