const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  
  // Get all stylesheets and search for animation-timeline
  const cssInfo = await page.evaluate(() => {
    const styleSheets = document.styleSheets;
    const results = [];
    
    for (let sheet of styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          const text = rule.cssText || '';
          if (text.includes('animation-timeline')) {
            results.push(text.substring(0, 200));
          }
        }
      } catch (e) {
        // CORS blocked stylesheet
      }
    }
    return results;
  });
  
  console.log('Found animation-timeline rules:', cssInfo.length);
  cssInfo.forEach((r, i) => console.log(`\nRule ${i+1}:`, r));
  
  await browser.close();
}

main().catch(console.error);
