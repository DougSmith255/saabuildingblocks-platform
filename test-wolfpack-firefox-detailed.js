const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Loading page...');
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  // Check immediately after load
  console.log('\n=== IMMEDIATELY AFTER PAGE LOAD ===');
  const immediateCheck = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    if (!wolfPack) return { error: 'Not found' };
    
    const styles = window.getComputedStyle(wolfPack);
    const innerDiv = wolfPack.querySelector('div > div');
    const innerStyles = innerDiv ? window.getComputedStyle(innerDiv) : null;
    
    return {
      wrapperClass: wolfPack.className,
      wrapperOpacity: styles.opacity,
      wrapperAnimation: styles.animation,
      wrapperAnimationName: styles.animationName,
      wrapperAnimationDuration: styles.animationDuration,
      wrapperAnimationDelay: styles.animationDelay,
      innerBackgroundImage: innerStyles ? innerStyles.backgroundImage : 'no inner div',
      innerOpacity: innerStyles ? innerStyles.opacity : 'no inner div',
    };
  });
  console.log(JSON.stringify(immediateCheck, null, 2));
  
  // Take screenshot at start
  await page.screenshot({ path: '/home/claude-flow/wolfpack-firefox-immediate.png', fullPage: false });
  
  // Check at 0.5s
  await page.waitForTimeout(500);
  console.log('\n=== AT 0.5 SECONDS ===');
  const halfSecond = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(wolfPack);
    return {
      opacity: styles.opacity,
      animationPlayState: styles.animationPlayState,
    };
  });
  console.log(JSON.stringify(halfSecond, null, 2));
  await page.screenshot({ path: '/home/claude-flow/wolfpack-firefox-0.5s.png', fullPage: false });
  
  // Check at 1.5s
  await page.waitForTimeout(1000);
  console.log('\n=== AT 1.5 SECONDS ===');
  const onePointFive = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(wolfPack);
    return {
      opacity: styles.opacity,
    };
  });
  console.log(JSON.stringify(onePointFive, null, 2));
  await page.screenshot({ path: '/home/claude-flow/wolfpack-firefox-1.5s.png', fullPage: false });
  
  // Check at 3s (end)
  await page.waitForTimeout(1500);
  console.log('\n=== AT 3 SECONDS (END) ===');
  const threeSeconds = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(wolfPack);
    return {
      opacity: styles.opacity,
    };
  });
  console.log(JSON.stringify(threeSeconds, null, 2));
  await page.screenshot({ path: '/home/claude-flow/wolfpack-firefox-3s.png', fullPage: false });
  
  await browser.close();
  console.log('\n=== Screenshots saved ===');
})();
