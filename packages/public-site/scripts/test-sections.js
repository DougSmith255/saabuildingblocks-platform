const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get section 2 animation state before scrolling to it
  const section2Before = await page.evaluate(() => {
    const sections = document.querySelectorAll('main#main-content > section');
    if (sections.length < 2) return { error: 'Not enough sections' };
    
    const section2 = sections[1];
    const style = getComputedStyle(section2);
    return {
      animationName: style.animationName,
      animationTimeline: style.animationTimeline,
      animationRange: style.animationRange,
      transform: style.transform,
      opacity: style.opacity,
      rect: {
        top: section2.getBoundingClientRect().top,
        bottom: section2.getBoundingClientRect().bottom
      }
    };
  });
  console.log('Section 2 BEFORE scrolling:', JSON.stringify(section2Before, null, 2));

  // Scroll to bring section 2 into view
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  const section2After = await page.evaluate(() => {
    const sections = document.querySelectorAll('main#main-content > section');
    const section2 = sections[1];
    const style = getComputedStyle(section2);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity,
      rect: {
        top: section2.getBoundingClientRect().top,
        bottom: section2.getBoundingClientRect().bottom
      }
    };
  });
  console.log('Section 2 AFTER scrolling 800px:', JSON.stringify(section2After, null, 2));

  await page.screenshot({ path: '/tmp/section2-test.jpg', quality: 40, type: 'jpeg' });
  
  await browser.close();
}

main().catch(console.error);
