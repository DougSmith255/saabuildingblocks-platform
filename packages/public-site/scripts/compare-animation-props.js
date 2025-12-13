const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // First test local file
  await page.goto('file:///tmp/scroll-test2.html');
  await page.waitForTimeout(500);
  
  const localBefore = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return Object.fromEntries(
      Array.from(style).filter(p => p.includes('animation') || p.includes('transform') || p.includes('opacity'))
        .map(p => [p, style.getPropertyValue(p)])
    );
  });

  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);
  
  const localAfter = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return {
      transform: style.transform,
      opacity: style.opacity
    };
  });

  console.log('=== LOCAL FILE (working) ===');
  console.log('Before scroll:', JSON.stringify(localBefore, null, 2));
  console.log('After 300px scroll:', JSON.stringify(localAfter, null, 2));

  // Now test live site
  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const liveBefore = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return Object.fromEntries(
      Array.from(style).filter(p => p.includes('animation') || p.includes('transform') || p.includes('opacity'))
        .map(p => [p, style.getPropertyValue(p)])
    );
  });

  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);
  
  const liveAfter = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      transform: style.transform,
      opacity: style.opacity
    };
  });

  console.log('\n=== LIVE SITE (NOT working) ===');
  console.log('Before scroll:', JSON.stringify(liveBefore, null, 2));
  console.log('After 300px scroll:', JSON.stringify(liveAfter, null, 2));
  
  await browser.close();
}

main().catch(console.error);
