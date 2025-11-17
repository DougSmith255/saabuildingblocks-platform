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

  console.log('Opening Resources dropdown...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1500);

  console.log('Scrolling menu to middle position...');
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (menu) {
      menu.scrollTop = menu.scrollHeight / 2;
    }
  });
  await page.waitForTimeout(500);

  console.log('Taking full screenshot...');
  await page.screenshot({
    path: '/tmp/mobile-menu-with-resources-open.png',
    fullPage: false
  });

  console.log('Screenshot saved: /tmp/mobile-menu-with-resources-open.png');

  await browser.close();
})();
