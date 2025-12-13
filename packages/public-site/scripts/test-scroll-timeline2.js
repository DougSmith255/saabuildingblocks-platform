const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // Test local file with scroll()
  await page.goto('file:///tmp/scroll-test2.html');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/tmp/scroll2-top.jpg', quality: 40, type: 'jpeg' });
  
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
  console.log('scroll() TEST - BEFORE:', JSON.stringify(before, null, 2));

  // Scroll 300px (50% of 600px viewport)
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/scroll2-half.jpg', quality: 40, type: 'jpeg' });
  
  const half = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('scroll() TEST - AFTER 300px (50%):', JSON.stringify(half, null, 2));

  // Scroll 600px (100%)
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/scroll2-full.jpg', quality: 40, type: 'jpeg' });
  
  const full = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('scroll() TEST - AFTER 600px (100%):', JSON.stringify(full, null, 2));
  
  await browser.close();
}

main().catch(console.error);
