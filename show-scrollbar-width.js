const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 410, height: 600 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Open Resources dropdown to make scrollbar appear
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  // Scroll down a bit to ensure scrollbar is visible
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (menu) menu.scrollTop = 100;
  });
  await page.waitForTimeout(500);
  
  // Move mouse to scrollbar area to trigger hover state
  await page.mouse.move(395, 300);
  await page.waitForTimeout(300);
  
  await page.screenshot({ path: '/tmp/scrollbar-width-test.png' });
  console.log('Screenshot saved: /tmp/scrollbar-width-test.png');
  
  await browser.close();
})();
