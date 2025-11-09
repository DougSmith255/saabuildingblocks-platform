const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  const timestamp = Date.now();
  console.log('Loading fresh page...\n');
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${timestamp}`, { waitUntil: 'networkidle' });

  console.log('=== OPACITY TRACKING (fresh load) ===\n');

  // Record opacity immediately and over time
  const startTime = Date.now();
  const samples = [];

  for (let i = 0; i < 40; i++) {
    const elapsed = (Date.now() - startTime) / 1000;
    const opacity = await page.evaluate(() => {
      const el = document.querySelector('.hero-animate-bg');
      return el ? window.getComputedStyle(el).opacity : 'NOT FOUND';
    });

    samples.push({ time: elapsed.toFixed(2), opacity: parseFloat(opacity).toFixed(3) });

    if (i < 10 || i % 5 === 0) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity}`);
    }

    await page.waitForTimeout(100);
  }

  // Calculate if it's behaving correctly
  console.log('\n=== ANALYSIS ===');
  const firstOpacity = parseFloat(samples[0].opacity);
  const at500ms = parseFloat(samples[5].opacity); // Should be ~0
  const at2s = parseFloat(samples[20].opacity); // Should be ~0.5
  const at3_5s = parseFloat(samples[35].opacity); // Should be ~1.0

  console.log(`Start (0s): ${firstOpacity.toFixed(3)} - Should be ~0`);
  console.log(`At 0.5s: ${at500ms.toFixed(3)} - Should be ~0 (delay)`);
  console.log(`At 2s: ${at2s.toFixed(3)} - Should be ~0.5 (50% through)`);
  console.log(`At 3.5s: ${at3_5s.toFixed(3)} - Should be ~1.0 (100%)`);

  await browser.close();
})();
