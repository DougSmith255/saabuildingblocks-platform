const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const support = await page.evaluate(() => {
    return {
      view: CSS.supports('animation-timeline: view()'),
      viewBlock: CSS.supports('animation-timeline: view(block)'),
      viewInline: CSS.supports('animation-timeline: view(inline)'),
      // view() doesn't take a scroller parameter like scroll()
    };
  });
  
  console.log('view() timeline support:', JSON.stringify(support, null, 2));
  
  await browser.close();
}

main().catch(console.error);
