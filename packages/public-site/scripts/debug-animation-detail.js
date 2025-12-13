const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Screenshot at top
  await page.screenshot({ path: '/tmp/hero-top.jpg', quality: 40, type: 'jpeg' });
  
  const beforeScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      transform: style.transform,
      opacity: style.opacity,
      animationName: style.animationName,
      animationTimeline: style.animationTimeline,
      animationRange: style.animationRange,
      animationPlayState: style.animationPlayState,
      animationDuration: style.animationDuration,
      animationFillMode: style.animationFillMode,
      animationIterationCount: style.animationIterationCount,
      animation: style.animation
    };
  });
  
  console.log('BEFORE SCROLL:', JSON.stringify(beforeScroll, null, 2));

  // Scroll down 500px
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  
  // Screenshot after scroll
  await page.screenshot({ path: '/tmp/hero-scrolled.jpg', quality: 40, type: 'jpeg' });

  const afterScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity,
      animationPlayState: style.animationPlayState
    };
  });
  
  console.log('AFTER SCROLL (500px):', JSON.stringify(afterScroll, null, 2));

  // Scroll more
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/hero-scrolled-more.jpg', quality: 40, type: 'jpeg' });

  const moreScroll = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  
  console.log('AFTER MORE SCROLL (800px):', JSON.stringify(moreScroll, null, 2));
  
  await browser.close();
}

main().catch(console.error);
