const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 410, height: 700 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Click Resources to expand the submenu using evaluate
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const buttons = Array.from(menu.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.trim() === 'Resources');
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  // Check if scrollbar is present
  const scrollInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      hasScrollbar: menu.scrollHeight > menu.clientHeight,
    };
  });
  
  console.log('Scroll info:', JSON.stringify(scrollInfo, null, 2));
  
  // Scroll to make scrollbar more visible
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    menu.scrollTop = 150;
  });
  await page.waitForTimeout(500);
  
  // Move mouse to right edge to show scrollbar
  await page.mouse.move(405, 350);
  await page.waitForTimeout(300);
  
  await page.screenshot({ path: '/tmp/scrollbar-expanded-resources.png' });
  console.log('Screenshot saved: /tmp/scrollbar-expanded-resources.png');
  
  await browser.close();
})();
