const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const before = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity,
      animationTimeline: style.animationTimeline
    };
  });
  console.log('Before:', JSON.stringify(before, null, 2));

  // Use mouse wheel to scroll
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);
  
  const afterWheel = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('After mouse wheel:', JSON.stringify(afterWheel, null, 2));

  await page.screenshot({ path: '/tmp/after-wheel.jpg', quality: 40, type: 'jpeg' });
  
  await browser.close();
}

main().catch(console.error);
