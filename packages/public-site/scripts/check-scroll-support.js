const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const support = await page.evaluate(() => {
    return {
      supportsScrollTimeline: CSS.supports('animation-timeline: scroll()'),
      supportsViewTimeline: CSS.supports('animation-timeline: view()'),
      supportsAnimationRange: CSS.supports('animation-range: 0vh 100vh')
    };
  });
  
  console.log(JSON.stringify(support, null, 2));
  
  await browser.close();
}

main().catch(console.error);
