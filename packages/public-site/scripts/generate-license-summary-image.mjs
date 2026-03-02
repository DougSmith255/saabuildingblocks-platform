/**
 * Generate "Requirements at a Glance" license summary images (PNG)
 *
 * Usage:
 *   node generate-license-summary-image.mjs --state california       # Single state
 *   node generate-license-summary-image.mjs --all                    # All states
 *   node generate-license-summary-image.mjs --all --out ./images     # Custom output dir
 *
 * Outputs one image per state showing key licensing requirements.
 */

import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FONTS_DIR = resolve(__dirname, '../public/fonts');
const IMAGES_DIR = resolve(__dirname, '../public/images');
const DATA_FILE = resolve(__dirname, 'license-requirements-data.json');

// Load font files as base64
const taskorFont = readFileSync(resolve(FONTS_DIR, 'taskor-regular-webfont.woff2')).toString('base64');
const amulyaFont = readFileSync(resolve(FONTS_DIR, 'Amulya-Variable.woff2')).toString('base64');
const synonymFont = readFileSync(resolve(FONTS_DIR, 'Synonym-Variable.woff2')).toString('base64');
const logoSvg = readFileSync(resolve(IMAGES_DIR, 'saa-logo-gold.svg'), 'utf-8');
const logoBase64 = Buffer.from(logoSvg).toString('base64');

// Load license data
const licenseData = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));

// Parse CLI args
const args = process.argv.slice(2);
const stateIdx = args.indexOf('--state');
const allFlag = args.includes('--all');
const outIdx = args.indexOf('--out');
const outputDir = outIdx >= 0 ? args[outIdx + 1] : '/home/ubuntu/tmp';

if (stateIdx === -1 && !allFlag) {
  console.error('Usage: node generate-license-summary-image.mjs --state <slug> | --all');
  process.exit(1);
}

/**
 * Build HTML for a license requirements summary image
 */
function buildLicenseHtml(state) {
  const { education, exam, fees, governingBody, ageRequirement, backgroundCheck } = state;

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

/* Header */
.header {
  background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%);
  border: 1px solid rgba(255,215,0,0.3);
  border-radius: 8px;
  padding: 16px 28px;
  text-align: center;
  margin-bottom: 20px;
}

.header-title {
  font-family: 'Taskor', sans-serif;
  font-size: 22px;
  color: #ffd700;
  letter-spacing: 0.04em;
}

.header-subtitle {
  font-family: 'Amulya', sans-serif;
  font-size: 13px;
  color: rgba(255,215,0,0.5);
  margin-top: 4px;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 16px 18px;
}

.card-full {
  grid-column: 1 / -1;
}

.card-label {
  font-family: 'Taskor', sans-serif;
  font-size: 11px;
  color: #ffd700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,215,0,0.12);
}

/* Stat row */
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 0;
}

.stat-row + .stat-row {
  border-top: 1px solid rgba(255,255,255,0.04);
}

.stat-label {
  font-family: 'Amulya', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #bfbdb0;
}

.stat-value {
  font-family: 'Synonym', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #e5e4dd;
  text-align: right;
  max-width: 55%;
}

/* Big stat (hero number) */
.big-stat {
  text-align: center;
  padding: 6px 0;
}

.big-number {
  font-family: 'Synonym', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #00ff88;
  line-height: 1.1;
}

.big-unit {
  font-family: 'Amulya', sans-serif;
  font-size: 12px;
  color: #bfbdb0;
  margin-top: 2px;
}

/* Course detail */
.course-detail {
  font-family: 'Synonym', sans-serif;
  font-size: 12px;
  color: rgba(229,228,221,0.7);
  line-height: 1.4;
  margin-top: 6px;
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

/* Governing body highlight */
.gov-body {
  font-family: 'Synonym', sans-serif;
  font-size: 13px;
  color: #e5e4dd;
  line-height: 1.4;
}

.gov-url {
  font-family: 'Synonym', sans-serif;
  font-size: 12px;
  color: #00ff88;
  opacity: 0.8;
}
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <div class="header-title">${state.name} Real Estate License</div>
    <div class="header-subtitle">Requirements at a Glance</div>
  </div>

  <!-- Grid -->
  <div class="grid">

    <!-- Education Card -->
    <div class="card">
      <div class="card-label">Pre-Licensing Education</div>
      <div class="big-stat">
        <div class="big-number">${education.hours}</div>
        <div class="big-unit">Hours Required</div>
      </div>
      <div class="course-detail">${education.courses}</div>
    </div>

    <!-- Exam Card -->
    <div class="card">
      <div class="card-label">State Exam</div>
      <div class="stat-row">
        <span class="stat-label">Questions</span>
        <span class="stat-value">${exam.questions} multiple-choice</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Time Limit</span>
        <span class="stat-value">${exam.time}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Passing Score</span>
        <span class="stat-value">${exam.passingScore}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Breakdown</span>
        <span class="stat-value">${exam.sections}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Retakes</span>
        <span class="stat-value">${exam.attempts}</span>
      </div>
    </div>

    <!-- Fees Card -->
    <div class="card">
      <div class="card-label">Fees</div>
      <div class="stat-row">
        <span class="stat-label">Application</span>
        <span class="stat-value">${fees.application}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Exam</span>
        <span class="stat-value">${fees.exam}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Fingerprint</span>
        <span class="stat-value">${fees.fingerprint}</span>
      </div>
      <div class="stat-row" style="border-top: 1px solid rgba(255,215,0,0.15); margin-top: 4px; padding-top: 8px;">
        <span class="stat-label" style="color: #ffd700; font-weight: 700;">Total</span>
        <span class="stat-value" style="color: #ffd700; font-weight: 700;">${fees.total}</span>
      </div>
    </div>

    <!-- Requirements Card -->
    <div class="card">
      <div class="card-label">Other Requirements</div>
      <div class="stat-row">
        <span class="stat-label">Age</span>
        <span class="stat-value">${ageRequirement}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Background Check</span>
        <span class="stat-value">${backgroundCheck}</span>
      </div>
      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
        <div style="font-family: 'Amulya', sans-serif; font-size: 11px; color: #bfbdb0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Governing Body</div>
        <div class="gov-body">${governingBody.name}</div>
        <div class="gov-url">${governingBody.url}</div>
      </div>
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

async function generateImage(browser, stateSlug, outDir) {
  const state = licenseData.states[stateSlug];
  if (!state) {
    console.warn(`  Skipping ${stateSlug}: no data found`);
    return null;
  }

  const html = buildLicenseHtml(state);
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1600 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Get actual content height
  const bodyHeight = await page.evaluate(() => {
    const container = document.querySelector('.container');
    return container ? container.offsetHeight : 800;
  });

  const outputPath = resolve(outDir, `license-${stateSlug}.png`);
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 800, height: bodyHeight },
    omitBackground: false,
  });

  await page.close();
  console.log(`  Created: ${outputPath} (${bodyHeight}px tall)`);
  return outputPath;
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
      const slugs = Object.keys(licenseData.states);
      console.log(`Generating ${slugs.length} license summary images...`);
      const allOutDir = resolve(outputDir, 'license-images');
      mkdirSync(allOutDir, { recursive: true });

      let count = 0;
      for (const slug of slugs) {
        const result = await generateImage(browser, slug, allOutDir);
        if (result) count++;
      }
      console.log(`\nDone! Generated ${count} images in ${allOutDir}`);
    } else {
      const slug = args[stateIdx + 1];
      if (!slug) {
        console.error('Missing state slug after --state');
        process.exit(1);
      }
      console.log(`Generating license summary image for: ${slug}`);
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
