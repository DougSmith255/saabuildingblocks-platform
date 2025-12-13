const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check if the inline opacity is being applied to buttons during scroll
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(1000);
  
  const afterScroll = await page.evaluate(() => {
    const wrapper = document.querySelector('.hero-content-wrapper');
    const buttons = document.querySelectorAll('.hero-content-wrapper a[class*="backdrop-blur"]');
    
    return {
      wrapperInlineOpacity: wrapper ? wrapper.style.opacity : null,
      buttonInlineStyles: Array.from(buttons).map(b => ({
        inlineOpacity: b.style.opacity,
        inlineStyle: b.getAttribute('style')
      }))
    };
  });
  
  console.log('After scroll - checking if buttons have inline opacity applied:');
  console.log(JSON.stringify(afterScroll, null, 2));
  
  await browser.close();
})();
