const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Opening mobile menu...');
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  console.log('Clicking Resources button to expand...');
  // Click the Resources button specifically
  await page.click('button:has-text("Resources")');
  await page.waitForTimeout(1500);

  // Check menu height
  const info = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      isScrollable: menu.scrollHeight > menu.clientHeight
    };
  });

  console.log('Menu info:', info);

  if (info.isScrollable) {
    console.log('Menu is scrollable - scrolling to show scrollbar...');
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      menu.scrollTop = 100;
    });
    await page.waitForTimeout(500);
  }

  console.log('Taking screenshot...');
  await page.screenshot({
    path: '/tmp/menu-resources-expanded.png',
    fullPage: false
  });

  console.log('Screenshot saved: /tmp/menu-resources-expanded.png');

  await browser.close();
})();
