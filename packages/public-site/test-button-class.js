const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get actual button class names
  const buttonInfo = await page.evaluate(() => {
    const wrapper = document.querySelector('.hero-content-wrapper');
    const allLinks = wrapper ? wrapper.querySelectorAll('a') : [];
    
    return Array.from(allLinks).map(link => ({
      className: link.className,
      hasBackdropBlur: link.className.includes('backdrop-blur'),
      computedBackdropFilter: window.getComputedStyle(link).backdropFilter
    }));
  });
  
  console.log('Button info:', JSON.stringify(buttonInfo, null, 2));
  
  await browser.close();
})();
