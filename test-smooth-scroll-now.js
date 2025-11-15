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
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Open Resources
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  console.log('Testing mouse wheel scroll...');
  
  const before = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollTop: menu.scrollTop,
      scrollBehavior: window.getComputedStyle(menu).scrollBehavior,
    };
  });
  
  console.log('Before:', JSON.stringify(before, null, 2));
  
  // Try mouse wheel
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(800);
  
  const after = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollTop: menu.scrollTop,
    };
  });
  
  console.log('After:', JSON.stringify(after, null, 2));
  console.log('Mouse wheel working:', before.scrollTop !== after.scrollTop);
  console.log('Smooth scroll enabled:', before.scrollBehavior === 'smooth');
  
  await browser.close();
})();
