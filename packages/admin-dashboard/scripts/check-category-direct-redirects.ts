/**
 * Check if /{category}/{slug} -> /blog/{category}/{slug} redirects exist
 * These are the WordPress-era URLs where posts lived at top-level category paths.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID || '';
const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

// Categories that now live under /blog/ (about-exp-realty and exp-realty-sponsor kept same paths)
const BLOG_CATEGORIES = [
  'marketing-mastery', 'agent-career-info', 'winning-clients',
  'industry-trends', 'fun-for-agents', 'brokerage-comparison',
  'real-estate-schools', 'become-an-agent',
];

async function getValue(key: string): Promise<string | null> {
  const res = await fetch(`${BASE}/values/${encodeURIComponent(key)}`, {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) return null;
  return res.text();
}

async function main() {
  // Sample a few from each category
  const samples = [
    '/marketing-mastery/chatgpt-prompts',
    '/agent-career-info/expenses',
    '/winning-clients/negotiate',
    '/industry-trends/nar-court-cases',
    '/fun-for-agents/best-cars',
    '/brokerage-comparison/exp-compass',
    '/real-estate-schools/florida',
    '/become-an-agent/california',
  ];

  console.log('Checking if /{category}/{slug} redirects exist:\n');
  let missing = 0;
  for (const path of samples) {
    const val = await getValue(path);
    if (val) {
      console.log(`  ${path}  ->  ${val}  (EXISTS)`);
    } else {
      console.log(`  ${path}  ->  (MISSING)`);
      missing++;
    }
  }
  console.log(`\n${missing}/${samples.length} are missing.`);
}

main();
