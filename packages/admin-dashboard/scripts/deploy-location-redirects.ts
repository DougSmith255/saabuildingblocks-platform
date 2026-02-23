/**
 * Deploy redirects for old /about-exp-realty/locations/* pages.
 * These were duplicative city/country-specific pages that were removed.
 * Redirect to /locations (the new consolidated locations page).
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const NAMESPACE_ID = process.env.REDIRECT_OVERRIDES_KV_NAMESPACE_ID || '';

const isDryRun = process.argv.includes('--dry-run');

async function writeKV(kvPath: string, target: string): Promise<boolean> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(kvPath)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'text/plain' },
    body: target,
  });
  if (!res.ok) {
    console.error(`  FAILED: ${kvPath}`);
    return false;
  }
  return true;
}

async function deploy(from: string, to: string): Promise<boolean> {
  if (isDryRun) {
    console.log(`  ${from}  ->  ${to}`);
    return true;
  }
  const withoutSlash = from.endsWith('/') ? from.slice(0, -1) : from;
  const withSlash = from.endsWith('/') ? from : from + '/';
  const ok1 = await writeKV(withoutSlash, to);
  const ok2 = await writeKV(withSlash, to);
  return ok1 && ok2;
}

// All old location pages found in Wayback Machine
const LOCATION_PAGES = [
  '/about-exp-realty/locations/best-real-estate-agency-in-brisbane',
  '/about-exp-realty/locations/best-real-estate-agency-in-dubai',
  '/about-exp-realty/locations/best-real-estate-agency-in-sydney-australia',
  '/about-exp-realty/locations/estate-agency-in-edinburgh',
  '/about-exp-realty/locations/estate-agency-in-glasgow',
  '/about-exp-realty/locations/estate-agency-in-leeds',
  '/about-exp-realty/locations/estate-agency-in-leicester',
  '/about-exp-realty/locations/estate-agency-in-liverpool',
  '/about-exp-realty/locations/estate-agency-in-london',
  '/about-exp-realty/locations/estate-agency-in-sheffield',
  '/about-exp-realty/locations/exp-realty-austin',
  '/about-exp-realty/locations/exp-realty-charlotte-best-exp-realty-sponsor-2024',
  '/about-exp-realty/locations/exp-realty-chicago',
  '/about-exp-realty/locations/exp-realty-columbus',
  '/about-exp-realty/locations/exp-realty-dallas',
  '/about-exp-realty/locations/exp-realty-denver',
  '/about-exp-realty/locations/exp-realty-el-paso',
  '/about-exp-realty/locations/exp-realty-fort-worth',
  '/about-exp-realty/locations/exp-realty-houston',
  '/about-exp-realty/locations/exp-realty-indianapolis',
  '/about-exp-realty/locations/exp-realty-jacksonville',
  '/about-exp-realty/locations/exp-realty-la',
  '/about-exp-realty/locations/exp-realty-nashville',
  '/about-exp-realty/locations/exp-realty-new-york',
  '/about-exp-realty/locations/exp-realty-okc',
  '/about-exp-realty/locations/exp-realty-philadelphia-best-exp-realty-sponsor-2024',
  '/about-exp-realty/locations/exp-realty-phoenix',
  '/about-exp-realty/locations/exp-realty-san-antonio',
  '/about-exp-realty/locations/exp-realty-san-diego',
  '/about-exp-realty/locations/exp-realty-san-jose',
  '/about-exp-realty/locations/exp-realty-seattle',
  '/about-exp-realty/locations/exp-realty-sf',
  '/about-exp-realty/locations/exp-realty-washington-dc',
  '/about-exp-realty/locations/real-estate-agency-in-adelaide',
  '/about-exp-realty/locations/real-estate-agency-in-birmingham',
  '/about-exp-realty/locations/real-estate-agency-in-bristol',
  '/about-exp-realty/locations/real-estate-agency-in-canberra',
  '/about-exp-realty/locations/real-estate-agency-in-geelong',
  '/about-exp-realty/locations/real-estate-agency-in-gold-coast',
  '/about-exp-realty/locations/real-estate-agency-in-melbourne',
  '/about-exp-realty/locations/real-estate-agency-in-newcastle',
  '/about-exp-realty/locations/real-estate-agency-in-nottingham',
  '/about-exp-realty/locations/real-estate-agency-in-perth',
  '/about-exp-realty/locations/real-estate-agency-in-rockingham',
];

const TARGET = '/locations';

async function main() {
  console.log('==========================================');
  console.log(' Deploy Location Page Redirects to KV');
  console.log('==========================================\n');

  if (isDryRun) console.log('*** DRY RUN ***\n');

  if (!isDryRun && (!ACCOUNT_ID || !API_TOKEN || !NAMESPACE_ID)) {
    console.error('Missing env vars.');
    process.exit(1);
  }

  let deployed = 0;
  let failed = 0;

  console.log(`Redirecting ${LOCATION_PAGES.length} old location pages to ${TARGET}\n`);

  for (const page of LOCATION_PAGES) {
    if (await deploy(page, TARGET)) {
      deployed++;
      if (!isDryRun) process.stdout.write(`\r  Deployed ${deployed}/${LOCATION_PAGES.length}...`);
    } else {
      failed++;
    }
    if (!isDryRun) await new Promise(r => setTimeout(r, 100));
  }

  if (!isDryRun) console.log();
  console.log(`\nDone! ${deployed} redirects deployed, ${failed} failed.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
