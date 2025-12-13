const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // Test local file first
  await page.goto('file:///tmp/view-test-tall.html');
  await page.waitForTimeout(500);
  
  const localData = await page.evaluate(() => {
    const section = document.querySelector('.tall-section');
    const style = getComputedStyle(section);
    return {
      animationName: style.animationName,
      animationTimeline: style.animationTimeline,
      animationRange: style.animationRange,
      opacity: style.opacity,
      transform: style.transform,
      display: style.display,
      visibility: style.visibility,
      position: style.position,
      overflow: style.overflow
    };
  });
  console.log('LOCAL FILE (works):', JSON.stringify(localData, null, 2));

  // Test live site
  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const liveData = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    const style = getComputedStyle(section);
    return {
      animationName: style.animationName,
      animationTimeline: style.animationTimeline,
      animationRange: style.animationRange,
      opacity: style.opacity,
      transform: style.transform,
      display: style.display,
      visibility: style.visibility,
      position: style.position,
      overflow: style.overflow
    };
  });
  console.log('\nLIVE SITE (broken):', JSON.stringify(liveData, null, 2));
  
  await browser.close();
}

main().catch(console.error);
