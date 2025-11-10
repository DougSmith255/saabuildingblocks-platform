const playwright = require('playwright');

(async () => {
  console.log('=== VERIFYING 2.5s DELAY FIX ===\n');
  console.log('Expected behavior with 2.5s delay:');
  console.log('- Page loads and becomes visible at ~1.5s');
  console.log('- Animation delay is 2.5s');
  console.log('- So animation starts ~1s AFTER page is visible');
  console.log('- User should see opacity 0→1 fade over 3 seconds\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  const pageLoadStart = Date.now();
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`, {
    waitUntil: 'networkidle'
  });

  const pageVisible = Date.now();
  const loadTime = (pageVisible - pageLoadStart) / 1000;
  console.log(`Page became visible after ${loadTime.toFixed(2)}s\n`);

  console.log('=== OPACITY TIMELINE (from when page is visible) ===\n');

  const samples = [];
  for (let i = 0; i < 50; i++) {
    const elapsed = (Date.now() - pageVisible) / 1000;
    const opacity = await page.evaluate(() => {
      const el = document.querySelector('.hero-animate-bg');
      return el ? parseFloat(window.getComputedStyle(el).opacity) : null;
    });

    samples.push({ time: elapsed, opacity });

    if (i === 0) {
      console.log(`0.00s: ${opacity.toFixed(3)} <- Should be ~0 (still in delay)`);
    } else if (i === 5) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity.toFixed(3)} <- Should be ~0`);
    } else if (i === 10) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity.toFixed(3)} <- Should be ~0.000-0.100 (animation starting)`);
    } else if (i === 20) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity.toFixed(3)} <- Should be ~0.300-0.400`);
    } else if (i === 30) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity.toFixed(3)} <- Should be ~0.600-0.700`);
    } else if (i === 40) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity.toFixed(3)} <- Should be ~1.000`);
    }

    await page.waitForTimeout(100);
  }

  console.log('\n=== VERDICT ===');
  const first = samples[0].opacity;
  const halfSec = samples[5].opacity;
  const oneSec = samples[10].opacity;

  if (first < 0.1 && halfSec < 0.1 && oneSec < 0.3) {
    console.log('✅ SUCCESS! Wolf pack starts at ~0 opacity when page is visible');
    console.log('✅ Animation appears to fade in smoothly over time');
  } else {
    console.log('❌ Still not working - opacity is too high too soon');
    console.log(`   First: ${first.toFixed(3)}, Half-sec: ${halfSec.toFixed(3)}, One-sec: ${oneSec.toFixed(3)}`);
  }

  await browser.close();
})();
