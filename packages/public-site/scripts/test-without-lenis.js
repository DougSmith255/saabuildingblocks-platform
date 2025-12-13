const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check if Lenis is active
  const lenisInfo = await page.evaluate(() => {
    return {
      htmlHasLenis: document.documentElement.classList.contains('lenis'),
      lenisScrollProperty: document.documentElement.style.getPropertyValue('--lenis-scroll'),
      lenisObject: typeof window.lenis !== 'undefined'
    };
  });
  console.log('Lenis status:', JSON.stringify(lenisInfo, null, 2));
  
  // Try disabling Lenis and testing
  await page.evaluate(() => {
    // Remove lenis class 
    document.documentElement.classList.remove('lenis');
    document.documentElement.classList.remove('lenis-smooth');
    
    // Destroy lenis if it exists
    if (window.lenis) {
      window.lenis.destroy();
    }
  });
  
  await page.waitForTimeout(500);
  
  const beforeScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('Before scroll (Lenis disabled):', JSON.stringify(beforeScroll, null, 2));

  // Scroll using native scrollTo
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  
  const afterScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('After 300px scroll (Lenis disabled):', JSON.stringify(afterScroll, null, 2));

  await page.screenshot({ path: '/tmp/lenis-disabled.jpg', quality: 40, type: 'jpeg' });
  
  await browser.close();
}

main().catch(console.error);
