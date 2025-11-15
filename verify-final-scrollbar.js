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
  
  console.log('=== Testing Body Scrollbar ===');
  
  // Check body scrollbar computed width
  const bodyScrollbar = await page.evaluate(() => {
    // Create a temporary scrollable div to measure actual scrollbar
    const test = document.createElement('div');
    test.style.width = '100px';
    test.style.height = '100px';
    test.style.overflow = 'scroll';
    test.style.position = 'absolute';
    test.style.top = '-9999px';
    document.body.appendChild(test);
    
    const scrollbarWidth = test.offsetWidth - test.clientWidth;
    document.body.removeChild(test);
    
    return {
      measuredScrollbarWidth: scrollbarWidth,
    };
  });
  
  console.log('Body scrollbar:', JSON.stringify(bodyScrollbar, null, 2));
  
  // Open mobile menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Expand Resources
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const buttons = Array.from(menu.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.trim() === 'Resources');
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  console.log('\n=== Testing Mobile Menu Scrollbar ===');
  
  const menuScrollbar = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    
    return {
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      hasScrollbar: menu.scrollHeight > menu.clientHeight,
      measuredWidth: menu.offsetWidth - menu.clientWidth,
    };
  });
  
  console.log('Mobile menu scrollbar:', JSON.stringify(menuScrollbar, null, 2));
  console.log('\nScrollbar widths match:', bodyScrollbar.measuredScrollbarWidth === menuScrollbar.measuredWidth);
  
  await browser.close();
})();
