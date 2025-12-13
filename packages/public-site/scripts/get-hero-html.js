const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    return {
      outerHTML: hero.outerHTML.substring(0, 500),
      className: hero.className,
      inlineStyle: hero.getAttribute('style'),
      // Get all CSS classes on body, html too
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className
    };
  });
  
  console.log('Hero info:');
  console.log('Classes:', heroInfo.className);
  console.log('Inline style:', heroInfo.inlineStyle);
  console.log('Body class:', heroInfo.bodyClass);
  console.log('HTML class:', heroInfo.htmlClass);
  console.log('\nHTML start:', heroInfo.outerHTML);
  
  await browser.close();
}

main().catch(console.error);
