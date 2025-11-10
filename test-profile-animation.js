const playwright = require('playwright');

(async () => {
  console.log('=== TESTING PROFILE IMAGE ANIMATION ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading page...\n');

  const startTime = Date.now();
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Check profile image immediately
  const profileCheck = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Doug and Karrie"]');
    if (!img) return { error: 'Image not found' };

    const styles = window.getComputedStyle(img);
    return {
      src: img.src,
      animation: styles.animation,
      opacity: styles.opacity,
      display: styles.display,
    };
  });

  console.log('=== PROFILE IMAGE AT PAGE LOAD ===');
  console.log(JSON.stringify(profileCheck, null, 2));

  // Sample opacity over time
  console.log('\n=== OPACITY OVER TIME ===\n');
  for (let i = 0; i < 30; i++) {
    const elapsed = (Date.now() - startTime) / 1000;
    const opacity = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="Doug and Karrie"]');
      return img ? window.getComputedStyle(img).opacity : 'NOT FOUND';
    });

    if (i === 0 || i === 2 || i === 5 || i === 10 || i === 20 || i === 29) {
      console.log(`${elapsed.toFixed(2)}s: opacity ${opacity}`);
    }

    await page.waitForTimeout(100);
  }

  // Check if animation class exists
  const animationCheck = await page.evaluate(() => {
    // Look for imgFadeIn keyframe
    let hasKeyframe = false;
    try {
      for (let sheet of document.styleSheets) {
        for (let rule of sheet.cssRules) {
          if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'imgFadeIn') {
            hasKeyframe = true;
            break;
          }
        }
      }
    } catch (e) {}

    return { hasImgFadeInKeyframe: hasKeyframe };
  });

  console.log('\n=== ANIMATION KEYFRAME CHECK ===');
  console.log(JSON.stringify(animationCheck, null, 2));

  await browser.close();
})();
