const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  
  const cssInfo = await page.evaluate(() => {
    const styleSheets = document.styleSheets;
    const results = [];
    
    for (let sheet of styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          const text = rule.cssText || '';
          if (text.includes('hero-scroll-out')) {
            results.push(text);
          }
        }
      } catch (e) {}
    }
    return results;
  });
  
  console.log('Hero scroll-out rules:');
  cssInfo.forEach((r, i) => console.log(`\nRule ${i+1}:`, r));
  
  await browser.close();
}

main().catch(console.error);
