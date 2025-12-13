const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    bypassCSP: true,
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();
  
  // Clear cache and navigate
  await context.clearCookies();
  await page.goto('https://saabuildingblocks.pages.dev/?bust=' + Date.now() + Math.random(), { 
    waitUntil: 'networkidle'
  });
  
  const css = await page.evaluate(() => {
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          if (rule.cssText?.includes('section:not(:first-child)') && rule.cssText?.includes('section-scroll-in')) {
            return rule.cssText;
          }
        }
      } catch(e) {}
    }
    return 'not found';
  });
  
  console.log('Section rule:', css);
  
  await browser.close();
}

main().catch(console.error);
