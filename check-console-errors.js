const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();

  // Listen for console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ Console Error: ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️  Console Warning: ${text}`);
    } else if (text.includes('Lenis') || text.includes('scroll')) {
      console.log(`📝 Console: ${text}`);
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n✅ Page loaded, waiting for menu open...\n');

  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  console.log('\n✅ Menu opened, checking Lenis state...\n');

  const lenisState = await page.evaluate(() => {
    return {
      hasLenis: window.__lenis !== undefined,
      lenisProperties: window.__lenis ? Object.keys(window.__lenis) : []
    };
  });

  console.log('Lenis state:', JSON.stringify(lenisState, null, 2));

  await browser.close();
})();
