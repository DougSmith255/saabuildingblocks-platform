const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      position: style.position,
      top: style.top,
      zIndex: style.zIndex,
      // Check parent overflow (sticky needs overflow visible on ancestors)
      parentOverflow: getComputedStyle(hero.parentElement).overflow,
      grandparentOverflow: getComputedStyle(hero.parentElement.parentElement).overflow
    };
  });
  
  console.log('Hero sticky check:', JSON.stringify(heroInfo, null, 2));
  
  await browser.close();
}

main().catch(console.error);
