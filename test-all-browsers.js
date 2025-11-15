const { firefox, chromium, webkit } = require('playwright');

async function testBrowser(browserType, browserName) {
  console.log(`\n=== Testing ${browserName} ===`);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  try {
    await page.goto('https://31.97.103.71/');
    await page.waitForLoadState('networkidle');
    
    // Open menu
    const hamburger = await page.locator('.hamburger');
    await hamburger.click();
    await page.waitForTimeout(1000);
    
    // Get body styles
    const bodyStyles = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.body);
      return {
        position: computed.position,
        overflow: computed.overflow,
        top: computed.top,
      };
    });
    
    console.log('Body styles:', bodyStyles);
    
    // Test scroll lock
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(100);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    
    const scrollDiff = scrollAfter - scrollBefore;
    console.log(`Scroll test: Before=${scrollBefore} After=${scrollAfter} Diff=${scrollDiff}`);
    
    if (scrollDiff === 0) {
      console.log(`✓ ${browserName} - Page LOCKED`);
    } else {
      console.log(`✗ ${browserName} - Page SCROLLED by ${scrollDiff}px`);
    }
  } catch (error) {
    console.log(`✗ ${browserName} - Error:`, error.message);
  } finally {
    await browser.close();
  }
}

(async () => {
  await testBrowser(firefox, 'Firefox');
  await testBrowser(chromium, 'Chrome');
  await testBrowser(webkit, 'WebKit (Safari)');
})();
