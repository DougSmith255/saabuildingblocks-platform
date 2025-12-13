const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Screenshot before scroll
  await page.screenshot({ path: '/var/www/html/screenshots/current-1-noscroll.png', fullPage: false });
  console.log('Screenshot 1 saved (no scroll)');
  
  // Scroll 100px
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/var/www/html/screenshots/current-2-scroll100.png', fullPage: false });
  console.log('Screenshot 2 saved (100px scroll)');
  
  // Scroll 300px
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/var/www/html/screenshots/current-3-scroll300.png', fullPage: false });
  console.log('Screenshot 3 saved (300px scroll)');
  
  await browser.close();
})();
