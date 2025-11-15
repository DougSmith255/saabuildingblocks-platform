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
  
  // Measure scrollbar width on the actual page body
  const bodyScrollbarWidth = await page.evaluate(() => {
    return window.innerWidth - document.documentElement.clientWidth;
  });
  
  console.log('Body scrollbar width:', bodyScrollbarWidth + 'px');
  
  // Open mobile menu and check its scrollbar
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Open Resources to make menu scrollable
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  const menuScrollbarInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const styles = window.getComputedStyle(menu);
    return {
      scrollbarWidth: styles.scrollbarWidth,
      webkitScrollbarWidth: styles.width,
      computedWidth: menu.offsetWidth - menu.clientWidth,
    };
  });
  
  console.log('Mobile menu scrollbar info:', JSON.stringify(menuScrollbarInfo, null, 2));
  
  await browser.close();
})();
