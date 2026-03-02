/**
 * Generate brokerage comparison chart images (PNG)
 *
 * Usage:
 *   node generate-comparison-image.mjs --pair exp-kw     # Single pair
 *   node generate-comparison-image.mjs --all             # All pairs
 *   node generate-comparison-image.mjs --all --out ./images  # Custom output dir
 *
 * Outputs ONE combined image per pair with all stats.
 */

import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FONTS_DIR = resolve(__dirname, '../public/fonts');
const IMAGES_DIR = resolve(__dirname, '../public/images');
const DATA_FILE = resolve(__dirname, 'brokerage-data.json');

// Load font files as base64
const taskorFont = readFileSync(resolve(FONTS_DIR, 'taskor-regular-webfont.woff2')).toString('base64');
const amulyaFont = readFileSync(resolve(FONTS_DIR, 'Amulya-Variable.woff2')).toString('base64');
const synonymFont = readFileSync(resolve(FONTS_DIR, 'Synonym-Variable.woff2')).toString('base64');
const logoSvg = readFileSync(resolve(IMAGES_DIR, 'saa-logo-gold.svg'), 'utf-8');
const logoBase64 = Buffer.from(logoSvg).toString('base64');

// Load brokerage data
const brokerageData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Parse CLI args
const args = process.argv.slice(2);
const pairIdx = args.indexOf('--pair');
const allFlag = args.includes('--all');
const outIdx = args.indexOf('--out');
const outputDir = outIdx >= 0 ? args[outIdx + 1] : '/home/ubuntu/tmp';

if (!pairIdx && !allFlag && pairIdx === -1) {
  console.error('Usage: node generate-comparison-image.mjs --pair <slug> | --all');
  process.exit(1);
}

// All stats in one image, grouped with section headers
const ALL_STATS = [
  { key: '_section', label: 'Financial Overview' },
  { key: 'glassdoorRating', label: 'Glassdoor Rating' },
  { key: 'commissionSplit', label: 'Commission Split' },
  { key: 'franchiseFee', label: 'Franchise / Royalty Fee' },
  { key: 'productionCap', label: 'Production Cap' },
  { key: 'monthlyFees', label: 'Monthly Fees' },
  { key: 'transactionFees', label: 'Transaction Fees' },
  { key: 'eoInsurance', label: 'E&O Insurance' },
  { key: '_section', label: 'Benefits & Perks' },
  { key: 'training', label: 'Training' },
  { key: 'support247', label: '24/7 Support' },
  { key: 'sponsorValue', label: 'Sponsor Value' },
  { key: 'revenueShareIncome', label: 'Revenue Share Income' },
  { key: 'retirementPath', label: 'Retirement Income Path' },
  { key: 'willableIncome', label: 'Willable Income' },
  { key: 'topAgentBonus', label: 'Top Agent Bonus' },
];

/**
 * Check if a value represents ambiguity/variance (ranges, "varies", etc.)
 */
function isAmbiguous(val) {
  const v = val.toLowerCase();
  return v.includes('varies') || v.includes('negotiable') || v.includes('unclear')
    || v.includes('unspecified') || v.includes('unverified')
    || (v.includes('-') && /\$\d/.test(v) && /\$.*-.*\$/.test(v)); // price ranges like $15K-$36K
}

/**
 * Extract the first dollar amount from a string for numeric comparison.
 * Returns null if no amount found.
 */
function extractDollarAmount(val) {
  const match = val.replace(/,/g, '').match(/\$(\d+(?:\.\d+)?)(K?)/i);
  if (!match) return null;
  let num = parseFloat(match[1]);
  if (match[2] && match[2].toUpperCase() === 'K') num *= 1000;
  return num;
}

/**
 * Determine advantage for a stat comparison.
 * Fixed values beat ambiguous ranges (certainty = advantage).
 */
function getAdvantage(key, valueA, valueB) {
  const a = (valueA || '').toLowerCase();
  const b = (valueB || '').toLowerCase();

  // Glassdoor: higher is better
  if (key === 'glassdoorRating') {
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);
    if (numA > numB) return { a: 'green', b: 'red' };
    if (numB > numA) return { a: 'red', b: 'green' };
    return { a: 'neutral', b: 'neutral' };
  }

  // Boolean-style fields: Yes > Limited/Unknown/401k > No/N/A
  if (['support247', 'sponsorValue', 'revenueShareIncome', 'retirementPath', 'willableIncome'].includes(key)) {
    function boolScore(v) {
      if (v.startsWith('yes')) return 3;
      if (v.includes('401') || v.includes('limited') || v.includes('unknown') || v.includes('unclear')) return 1;
      if (v.startsWith('no') || v.startsWith('n/a') || v === 'no') return 0;
      return 2; // anything else with substance
    }
    const scoreA = boolScore(a);
    const scoreB = boolScore(b);
    if (scoreA > scoreB) return { a: 'green', b: 'red' };
    if (scoreB > scoreA) return { a: 'red', b: 'green' };
    return { a: 'neutral', b: 'neutral' };
  }

  // Fee/cost fields: lower is better, but fixed beats ambiguous
  if (['franchiseFee', 'monthlyFees', 'transactionFees', 'eoInsurance'].includes(key)) {
    const isFreeA = a.includes('0%') || a.match(/^\$0\b/) || a.includes('included') || (a.startsWith('n/a') && !a.includes('franchise'));
    const isFreeB = b.includes('0%') || b.match(/^\$0\b/) || b.includes('included') || (b.startsWith('n/a') && !b.includes('franchise'));
    if (isFreeA && !isFreeB) return { a: 'green', b: 'red' };
    if (isFreeB && !isFreeA) return { a: 'red', b: 'green' };
    if (isFreeA && isFreeB) return { a: 'neutral', b: 'neutral' };

    // Fixed known value beats "varies" / ambiguous range
    const ambigA = isAmbiguous(valueA);
    const ambigB = isAmbiguous(valueB);
    if (!ambigA && ambigB) return { a: 'green', b: 'red' };
    if (ambigA && !ambigB) return { a: 'red', b: 'green' };

    // Both have concrete values - compare amounts
    const amtA = extractDollarAmount(valueA);
    const amtB = extractDollarAmount(valueB);
    if (amtA !== null && amtB !== null) {
      if (amtA < amtB) return { a: 'green', b: 'red' };
      if (amtB < amtA) return { a: 'red', b: 'green' };
    }
    return { a: 'neutral', b: 'neutral' };
  }

  // Production cap: fixed known cap beats ambiguous range, lower fixed cap beats higher
  if (key === 'productionCap') {
    const noCapA = a.includes('no cap') || a.includes('n/a');
    const noCapB = b.includes('no cap') || b.includes('n/a');

    // Having a cap is good (limits what you pay) vs no cap (unlimited exposure)
    const hasCapA = !noCapA && /\$\d/.test(a);
    const hasCapB = !noCapB && /\$\d/.test(b);

    if (hasCapA && !hasCapB) return { a: 'green', b: 'red' };
    if (hasCapB && !hasCapA) return { a: 'red', b: 'green' };
    if (noCapA && noCapB) return { a: 'neutral', b: 'neutral' };

    // Both have caps - fixed beats ambiguous range
    const ambigA = isAmbiguous(valueA);
    const ambigB = isAmbiguous(valueB);
    if (!ambigA && ambigB) return { a: 'green', b: 'red' };
    if (ambigA && !ambigB) return { a: 'red', b: 'green' };

    // Both fixed - lower cap is better
    const amtA = extractDollarAmount(valueA);
    const amtB = extractDollarAmount(valueB);
    if (amtA !== null && amtB !== null) {
      if (amtA < amtB) return { a: 'green', b: 'red' };
      if (amtB < amtA) return { a: 'red', b: 'green' };
    }
    return { a: 'neutral', b: 'neutral' };
  }

  // Commission: higher starting split is better, reaching 100% is best
  if (key === 'commissionSplit') {
    const hasHundredA = a.includes('100');
    const hasHundredB = b.includes('100');
    if (hasHundredA && !hasHundredB) return { a: 'green', b: 'red' };
    if (hasHundredB && !hasHundredA) return { a: 'red', b: 'green' };
    const splitA = a.match(/(\d+)\//);
    const splitB = b.match(/(\d+)\//);
    if (splitA && splitB) {
      if (parseInt(splitA[1]) > parseInt(splitB[1])) return { a: 'green', b: 'red' };
      if (parseInt(splitB[1]) > parseInt(splitA[1])) return { a: 'red', b: 'green' };
    }
    return { a: 'neutral', b: 'neutral' };
  }

  // Training: more/free is better
  if (key === 'training') {
    // "50+ live" or "30+ live" or "600+ on-demand" > "varies" or basic offerings
    const hasLiveA = a.match(/(\d+)\+?\s*live/);
    const hasLiveB = b.match(/(\d+)\+?\s*live/);
    const hasFreeA = a.includes('free');
    const hasFreeB = b.includes('free');
    const ambigA = a.includes('varies');
    const ambigB = b.includes('varies');

    if ((hasLiveA || hasFreeA) && ambigB) return { a: 'green', b: 'red' };
    if ((hasLiveB || hasFreeB) && ambigA) return { a: 'red', b: 'green' };
    if (hasLiveA && !hasLiveB && !hasFreeB) return { a: 'green', b: 'red' };
    if (hasLiveB && !hasLiveA && !hasFreeA) return { a: 'red', b: 'green' };
    return { a: 'neutral', b: 'neutral' };
  }

  // Top agent bonus: having one > "None"
  if (key === 'topAgentBonus') {
    const noneA = a.includes('none');
    const noneB = b.includes('none');
    if (!noneA && noneB) return { a: 'green', b: 'red' };
    if (noneA && !noneB) return { a: 'red', b: 'green' };
    return { a: 'neutral', b: 'neutral' };
  }

  return { a: 'neutral', b: 'neutral' };
}

function getColorForAdvantage(advantage) {
  if (advantage === 'green') return '#00ff88';
  if (advantage === 'red') return '#ff6b6b';
  return '#bfbdb0';
}

/**
 * Build HTML for one combined comparison image
 */
function buildComparisonHtml(nameA, nameB, dataA, dataB) {
  const rows = ALL_STATS.map(({ key, label }) => {
    // Section header row
    if (key === '_section') {
      return `
        <tr class="section-row">
          <td colspan="3" class="section-cell">${label}</td>
        </tr>
      `;
    }

    const valA = dataA[key] || 'N/A';
    const valB = dataB[key] || 'N/A';
    const adv = getAdvantage(key, valA, valB);

    // Glassdoor gets star display
    let displayA = valA;
    let displayB = valB;
    if (key === 'glassdoorRating') {
      const starsA = parseFloat(valA);
      const starsB = parseFloat(valB);
      displayA = `${'★'.repeat(Math.round(starsA))}${'☆'.repeat(5 - Math.round(starsA))} ${valA}/5`;
      displayB = `${'★'.repeat(Math.round(starsB))}${'☆'.repeat(5 - Math.round(starsB))} ${valB}/5`;
    }

    return `
      <tr>
        <td class="val-cell val-left" style="color: ${getColorForAdvantage(adv.a)}">${displayA}</td>
        <td class="label-cell">${label}</td>
        <td class="val-cell val-right" style="color: ${getColorForAdvantage(adv.b)}">${displayB}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@font-face {
  font-family: 'Taskor';
  src: url(data:font/woff2;base64,${taskorFont}) format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'Amulya';
  src: url(data:font/woff2;base64,${amulyaFont}) format('woff2');
  font-weight: 100 900;
}
@font-face {
  font-family: 'Synonym';
  src: url(data:font/woff2;base64,${synonymFont}) format('woff2');
  font-weight: 100 900;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #0a0a0a;
  width: 800px;
  overflow: hidden;
}

.container {
  width: 800px;
  padding: 28px 30px 20px;
}

/* Header bar */
.header {
  background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%);
  border: 1px solid rgba(255,215,0,0.3);
  border-radius: 8px;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
}

.header-title {
  font-family: 'Taskor', sans-serif;
  font-size: 22px;
  color: #ffd700;
  letter-spacing: 0.04em;
  text-align: center;
}

.header-vs {
  font-family: 'Taskor', sans-serif;
  font-size: 16px;
  color: rgba(255,215,0,0.5);
  padding: 0 4px;
}

/* Column headers */
.col-headers {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 8px;
}

.col-name {
  font-family: 'Taskor', sans-serif;
  font-size: 16px;
  letter-spacing: 0.03em;
  padding: 7px 14px;
  border-radius: 6px;
}

.col-name-left {
  color: #00ff88;
  background: rgba(0,255,136,0.06);
  border: 1px solid rgba(0,255,136,0.15);
}

.col-name-right {
  color: #e5e4dd;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Table */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 3px;
}

tr {
  background: rgba(255,255,255,0.02);
}

tr:nth-child(odd) {
  background: rgba(255,255,255,0.04);
}

td {
  padding: 9px 16px;
  vertical-align: middle;
}

.label-cell {
  font-family: 'Amulya', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #e5e4dd;
  text-align: center;
  width: 190px;
  white-space: nowrap;
  border-left: 1px solid rgba(255,215,0,0.1);
  border-right: 1px solid rgba(255,215,0,0.1);
}

.val-cell {
  font-family: 'Synonym', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
}

.val-left {
  text-align: right;
  padding-right: 20px;
}

.val-right {
  text-align: left;
  padding-left: 20px;
}

/* Section header rows */
.section-row {
  background: none !important;
}

.section-cell {
  font-family: 'Taskor', sans-serif;
  font-size: 13px;
  color: #ffd700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 12px 0 4px 0;
  border-bottom: 1px solid rgba(255,215,0,0.15);
}

/* Footer */
.footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,215,0,0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 26px;
  height: 26px;
  opacity: 0.7;
}

.footer-brand {
  font-family: 'Taskor', sans-serif;
  font-size: 11px;
  color: rgba(255,215,0,0.6);
  letter-spacing: 0.03em;
}

.footer-url {
  font-family: 'Synonym', sans-serif;
  font-size: 11px;
  color: #555;
}

/* Legend */
.legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 2px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Synonym', sans-serif;
  font-size: 10px;
  color: #777;
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <span class="header-title">${dataA.shortName || nameA}</span>
    <span class="header-vs">vs</span>
    <span class="header-title">${dataB.shortName || nameB}</span>
  </div>

  <!-- Column headers -->
  <div class="col-headers">
    <span class="col-name col-name-left">${nameA}</span>
    <span class="col-name col-name-right">${nameB}</span>
  </div>

  <!-- Comparison table -->
  <table>
    ${rows}
  </table>

  <!-- Legend -->
  <div class="legend">
    <div class="legend-item">
      <span class="legend-dot" style="background: #00ff88;"></span>
      Advantage
    </div>
    <div class="legend-item">
      <span class="legend-dot" style="background: #bfbdb0;"></span>
      Similar / Varies
    </div>
    <div class="legend-item">
      <span class="legend-dot" style="background: #ff6b6b;"></span>
      Disadvantage
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <img class="footer-logo" src="data:image/svg+xml;base64,${logoBase64}" alt="SAA" />
      <span class="footer-brand">Smart Agent Alliance</span>
    </div>
    <span class="footer-url">smartagentalliance.com</span>
  </div>

</div>
</body>
</html>`;
}

async function generateImage(browser, slug, outDir) {
  const pair = brokerageData.slugMapping[slug];
  if (!pair) {
    console.warn(`  Skipping ${slug}: no mapping found`);
    return null;
  }

  const [nameA, nameB] = pair;
  const dataA = brokerageData.brokerages[nameA];
  const dataB = brokerageData.brokerages[nameB];

  if (!dataA || !dataB) {
    console.warn(`  Skipping ${slug}: missing brokerage data for ${nameA} or ${nameB}`);
    return null;
  }

  const html = buildComparisonHtml(nameA, nameB, dataA, dataB);
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1600 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Get actual content height
  const bodyHeight = await page.evaluate(() => {
    const container = document.querySelector('.container');
    return container ? container.offsetHeight : 800;
  });

  const outputPath = resolve(outDir, `comparison-${slug}.png`);
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 800, height: bodyHeight },
    omitBackground: false,
  });

  await page.close();
  console.log(`  Created: ${outputPath} (${bodyHeight}px tall)`);
  return [outputPath];
}

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    if (allFlag) {
      const slugs = Object.keys(brokerageData.slugMapping);
      console.log(`Generating ${slugs.length} comparison images...`);
      const allOutDir = resolve(outputDir, 'comparison-images');
      mkdirSync(allOutDir, { recursive: true });

      let count = 0;
      for (const slug of slugs) {
        const result = await generateImage(browser, slug, allOutDir);
        if (result) count++;
      }
      console.log(`\nDone! Generated ${count} images.`);
    } else {
      const slug = args[pairIdx + 1];
      if (!slug) {
        console.error('Missing slug after --pair');
        process.exit(1);
      }
      console.log(`Generating comparison image for: ${slug}`);
      await generateImage(browser, slug, outputDir);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
