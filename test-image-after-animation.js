const { firefox } = require('playwright');

(async () => {
  console.log('Testing Firefox image animation completion...\n');

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  await page.goto('https://saabuildingblocks.pages.dev', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Check immediately
  console.log('=== At 0s (page load) ===');
  let result = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Doug and Karrie"]');
    if (!img) return { found: false };
    const computed = window.getComputedStyle(img);
    return {
      found: true,
      opacity: computed.opacity,
      animation: computed.animation,
      visibility: computed.visibility,
      display: computed.display
    };
  });
  console.log(JSON.stringify(result, null, 2));

  // Wait 2 seconds (after animation should complete)
  await page.waitForTimeout(2000);
  console.log('\n=== At 2s (after 1.6s animation should complete) ===');
  result = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Doug and Karrie"]');
    if (!img) return { found: false };
    const computed = window.getComputedStyle(img);
    return {
      found: true,
      opacity: computed.opacity,
      animation: computed.animation,
      visibility: computed.visibility,
      display: computed.display
    };
  });
  console.log(JSON.stringify(result, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/home/claude-flow/screenshot-after-animation.png', fullPage: false });
  console.log('\n✓ Screenshot saved');

  await browser.close();
})();
