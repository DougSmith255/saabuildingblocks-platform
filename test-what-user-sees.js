const playwright = require('playwright');

(async () => {
  console.log('=== TESTING WHAT USER ACTUALLY SEES ===\n');

  const browser = await playwright.firefox.launch({
    headless: false, // Show browser so we can see what happens
    slowMo: 0
  });

  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Opening page (watch the browser window)...\n');

  // Track first paint
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Wait a bit to observe
  await page.waitForTimeout(6000);

  // Get what happened
  const analysis = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(wolfPack);

    return {
      finalOpacity: styles.opacity,
      animation: styles.animation,
    };
  });

  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(analysis, null, 2));
  console.log('\nDid you see the wolf pack image "pop in" or fade in smoothly?');

  await browser.close();
})();
