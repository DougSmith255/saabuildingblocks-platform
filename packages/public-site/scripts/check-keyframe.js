const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  
  const keyframeRule = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.name === 'section-scroll-in') {
            return rule.cssText;
          }
        }
      } catch(e) {}
    }
    return 'not found';
  });

  console.log('section-scroll-in keyframe:', keyframeRule);
  
  await browser.close();
}

main().catch(console.error);
