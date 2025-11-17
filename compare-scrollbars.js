const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Taking screenshot of body scrollbar...');

  // Scroll page to show body scrollbar
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: '/tmp/body-scrollbar.png',
    fullPage: false
  });

  console.log('Opening mobile menu...');

  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  // Open Resources to make menu scrollable
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  // Scroll menu to show scrollbar
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (menu) {
      menu.scrollTop = 100;
    }
  });
  await page.waitForTimeout(500);

  console.log('Taking screenshot of mobile menu scrollbar...');

  await page.screenshot({
    path: '/tmp/mobile-menu-scrollbar.png',
    fullPage: false
  });

  console.log('\nScreenshots saved:');
  console.log('  - /tmp/body-scrollbar.png');
  console.log('  - /tmp/mobile-menu-scrollbar.png');

  // Get detailed scrollbar info
  const scrollbarInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const body = document.body;

    const menuStyles = window.getComputedStyle(menu);
    const bodyStyles = window.getComputedStyle(body);

    return {
      menu: {
        scrollBehavior: menuStyles.scrollBehavior,
        overflowY: menuStyles.overflowY,
        scrollHeight: menu.scrollHeight,
        clientHeight: menu.clientHeight,
      },
      body: {
        scrollBehavior: bodyStyles.scrollBehavior,
        overflowY: bodyStyles.overflowY,
      }
    };
  });

  console.log('\nScrollbar properties:');
  console.log(JSON.stringify(scrollbarInfo, null, 2));

  await browser.close();
})();
