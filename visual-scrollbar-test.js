const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 800 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  // Take screenshot with menu open
  await page.screenshot({ path: '/tmp/menu-scrollbar.png', fullPage: false });
  
  console.log('Screenshot saved to /tmp/menu-scrollbar.png');
  console.log('Check if scrollbar is visible and what color it is');
  
  await browser.close();
})();
