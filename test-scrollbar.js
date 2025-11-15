const { firefox, chromium } = require('playwright');

async function testBrowser(browserType, browserName) {
  console.log(`\n========== Testing ${browserName} ==========`);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 800 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Check page scrollbar
  const pageScrollbar = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.documentElement);
    return {
      colorScheme: computed.colorScheme,
      scrollbarWidth: computed.scrollbarWidth,
      scrollbarColor: computed.scrollbarColor,
    };
  });
  
  console.log('Page scrollbar styles:');
  console.log(JSON.stringify(pageScrollbar, null, 2));
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  // Check mobile menu scrollbar
  const menuScrollbar = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (!menu) return { found: false };
    const computed = window.getComputedStyle(menu);
    return {
      found: true,
      colorScheme: computed.colorScheme,
      scrollbarWidth: computed.scrollbarWidth,
      scrollbarColor: computed.scrollbarColor,
    };
  });
  
  console.log('\nMobile menu scrollbar styles:');
  console.log(JSON.stringify(menuScrollbar, null, 2));
  
  await browser.close();
}

(async () => {
  await testBrowser(chromium, 'Chromium/Chrome/Edge');
  await testBrowser(firefox, 'Firefox');
})();
