const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Get initial button state
  const initialState = await page.evaluate(() => {
    const wrapper = document.querySelector('.hero-content-wrapper');
    const buttons = document.querySelectorAll('.hero-content-wrapper a[class*="backdrop-blur"]');
    const lightBars = document.querySelectorAll('.hero-content-wrapper .cta-light-bar');
    
    return {
      wrapperStyle: wrapper ? {
        opacity: wrapper.style.opacity,
        filter: wrapper.style.filter,
        transform: wrapper.style.transform
      } : null,
      buttonCount: buttons.length,
      buttonStyles: Array.from(buttons).map(b => ({
        opacity: window.getComputedStyle(b).opacity,
        backdropFilter: window.getComputedStyle(b).backdropFilter,
        background: window.getComputedStyle(b).background,
        visibility: window.getComputedStyle(b).visibility
      })),
      lightBarCount: lightBars.length
    };
  });
  console.log('Initial state:', JSON.stringify(initialState, null, 2));
  
  // Scroll and check again
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(500);
  
  const afterScrollState = await page.evaluate(() => {
    const wrapper = document.querySelector('.hero-content-wrapper');
    const buttons = document.querySelectorAll('.hero-content-wrapper a[class*="backdrop-blur"]');
    const lightBars = document.querySelectorAll('.hero-content-wrapper .cta-light-bar');
    const body = document.body;
    
    return {
      bodyClasses: body.className,
      wrapperStyle: wrapper ? {
        opacity: wrapper.style.opacity,
        filter: wrapper.style.filter,
        transform: wrapper.style.transform
      } : null,
      buttonStyles: Array.from(buttons).map(b => ({
        opacity: window.getComputedStyle(b).opacity,
        backdropFilter: window.getComputedStyle(b).backdropFilter,
        background: window.getComputedStyle(b).background,
        visibility: window.getComputedStyle(b).visibility
      })),
    };
  });
  console.log('After 100px scroll:', JSON.stringify(afterScrollState, null, 2));
  
  await browser.close();
})();
