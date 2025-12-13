const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const rect = hero.getBoundingClientRect();
    return {
      heroHeight: rect.height,
      heroTop: rect.top,
      heroBottom: rect.bottom,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      // Does hero fill entire viewport?
      fillsViewport: rect.height >= window.innerHeight
    };
  });
  
  console.log('Hero section info:', JSON.stringify(info, null, 2));
  
  // Now scroll and check again
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(200);
  
  const afterScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const rect = hero.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      heroTop: rect.top,
      heroBottom: rect.bottom,
      // Is hero exiting viewport (top going above viewport)?
      isExiting: rect.top < 0
    };
  });
  
  console.log('After 300px scroll:', JSON.stringify(afterScroll, null, 2));
  
  await browser.close();
}

main().catch(console.error);
