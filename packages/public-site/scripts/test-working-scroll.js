const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // Test the working local file
  await page.goto('file:///tmp/scroll-test.html');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/tmp/test-top.jpg', quality: 40, type: 'jpeg' });
  
  const before = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return {
      transform: style.transform,
      opacity: style.opacity,
      animationTimeline: style.animationTimeline,
      animationRange: style.animationRange
    };
  });
  console.log('TEST FILE - BEFORE:', JSON.stringify(before, null, 2));

  // Scroll
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/test-scrolled.jpg', quality: 40, type: 'jpeg' });
  
  const after = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('TEST FILE - AFTER 500px:', JSON.stringify(after, null, 2));
  
  await browser.close();
}

main().catch(console.error);
