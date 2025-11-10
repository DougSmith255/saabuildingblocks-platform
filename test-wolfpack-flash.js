const playwright = require('playwright');

(async () => {
  console.log('=== TESTING WOLF PACK FLASH ISSUE ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading page and tracking wolf pack...\n');

  const startTime = Date.now();
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Sample opacity very quickly at the start
  console.log('=== OPACITY SAMPLES (first 2 seconds) ===\n');
  for (let i = 0; i < 20; i++) {
    const elapsed = (Date.now() - startTime) / 1000;
    const result = await page.evaluate(() => {
      const el = document.querySelector('.hero-animate-bg');
      if (!el) return { error: 'not found' };

      const styles = window.getComputedStyle(el);
      return {
        opacity: styles.opacity,
        animation: styles.animation,
        display: styles.display,
        visibility: styles.visibility,
      };
    });

    if (i === 0 || i === 2 || i === 5 || i === 10 || i === 15 || i === 19) {
      console.log(`${elapsed.toFixed(2)}s:`, JSON.stringify(result));
    }

    await page.waitForTimeout(100);
  }

  console.log('\n=== CHECKING CSS ANIMATION DEFINITION ===');
  const cssCheck = await page.evaluate(() => {
    // Check if animation is actually defined
    const el = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(el);

    // Try to get the keyframe
    let hasKeyframe = false;
    try {
      for (let sheet of document.styleSheets) {
        for (let rule of sheet.cssRules) {
          if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'bgZoom2025') {
            hasKeyframe = true;
            break;
          }
        }
      }
    } catch (e) {}

    return {
      animationName: styles.animationName,
      animationDuration: styles.animationDuration,
      animationDelay: styles.animationDelay,
      hasKeyframe: hasKeyframe,
      initialOpacity: styles.opacity,
    };
  });

  console.log(JSON.stringify(cssCheck, null, 2));

  await browser.close();
})();
