const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Test the exact selector used in FixedHeroWrapper
  const selectorTest = await page.evaluate(() => {
    const heroSection = document.querySelector('section');
    const contentWrapper = heroSection ? heroSection.querySelector('.hero-content-wrapper') : null;
    const backdropElements = contentWrapper ? contentWrapper.querySelectorAll('[class*="backdrop-blur"]') : [];
    
    return {
      heroSectionFound: !!heroSection,
      contentWrapperFound: !!contentWrapper,
      backdropElementsCount: backdropElements.length,
      backdropElementsInfo: Array.from(backdropElements).map(el => ({
        tagName: el.tagName,
        hasClass: el.className.includes('backdrop-blur')
      }))
    };
  });
  
  console.log('Selector test:', JSON.stringify(selectorTest, null, 2));
  
  await browser.close();
})();
