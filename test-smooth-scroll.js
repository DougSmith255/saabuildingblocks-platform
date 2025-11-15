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
  
  // Open Resources dropdown to create scrollable content
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  // Check scroll-behavior CSS property
  const scrollBehavior = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollBehavior: window.getComputedStyle(menu).scrollBehavior,
      scrollTop: menu.scrollTop,
    };
  });
  
  console.log('Initial state:', JSON.stringify(scrollBehavior, null, 2));
  
  // Trigger mouse wheel scroll
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(800); // Wait for smooth scroll animation
  
  const afterScroll = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollTop: menu.scrollTop,
    };
  });
  
  console.log('After scroll:', JSON.stringify(afterScroll, null, 2));
  console.log('Scroll worked:', scrollBehavior.scrollTop !== afterScroll.scrollTop);
  console.log('Scroll behavior is smooth:', scrollBehavior.scrollBehavior === 'smooth');
  
  await browser.close();
})();
