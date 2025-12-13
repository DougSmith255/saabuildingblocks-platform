const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Go to the live site
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  // Wait for page to fully load
  await page.waitForTimeout(2000);
  
  // Screenshot 1: Initial state (no scroll)
  await page.screenshot({ path: '/var/www/html/screenshots/button-test-1-initial.png', fullPage: false });
  console.log('Screenshot 1: Initial state saved');
  
  // Screenshot 2: Scroll down just a tiny bit (50px)
  await page.evaluate(() => window.scrollTo(0, 50));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/var/www/html/screenshots/button-test-2-scroll-50px.png', fullPage: false });
  console.log('Screenshot 2: After 50px scroll saved');
  
  // Screenshot 3: Scroll down 100px
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/var/www/html/screenshots/button-test-3-scroll-100px.png', fullPage: false });
  console.log('Screenshot 3: After 100px scroll saved');
  
  // Screenshot 4: Scroll down 200px
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/var/www/html/screenshots/button-test-4-scroll-200px.png', fullPage: false });
  console.log('Screenshot 4: After 200px scroll saved');
  
  // Screenshot 5: Scroll down 400px
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/var/www/html/screenshots/button-test-5-scroll-400px.png', fullPage: false });
  console.log('Screenshot 5: After 400px scroll saved');
  
  await browser.close();
  console.log('Done! Check /var/www/html/screenshots/');
})();
