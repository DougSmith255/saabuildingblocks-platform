const playwright = require('playwright');

(async () => {
  console.log('=== TESTING DEPLOYED PROFILE IMAGE ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading deployed site...\n');

  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Check if animate-in class is being added
  const classCheck = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    return {
      hasImage: !!img,
      hasAnimateInClass: img?.classList.contains('animate-in'),
      allClasses: img?.className,
      computedAnimation: img ? window.getComputedStyle(img).animation : null,
      computedOpacity: img ? window.getComputedStyle(img).opacity : null,
    };
  });

  console.log('=== CLASS AND ANIMATION CHECK ===');
  console.log(JSON.stringify(classCheck, null, 2));

  // Wait a bit and check again
  await page.waitForTimeout(500);

  const afterDelay = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    return {
      hasAnimateInClass: img?.classList.contains('animate-in'),
      computedAnimation: img ? window.getComputedStyle(img).animation : null,
      computedOpacity: img ? window.getComputedStyle(img).opacity : null,
    };
  });

  console.log('\n=== AFTER 500ms ===');
  console.log(JSON.stringify(afterDelay, null, 2));

  // Track opacity over time
  console.log('\n=== OPACITY TIMELINE ===');
  const startTime = Date.now();
  for (let i = 0; i < 30; i++) {
    const elapsed = (Date.now() - startTime) / 1000;
    const opacity = await page.evaluate(() => {
      const img = document.querySelector('.profile-image');
      return img ? parseFloat(window.getComputedStyle(img).opacity) : null;
    });

    if (i === 0 || i === 5 || i === 10 || i === 20) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity?.toFixed(3)}`);
    }

    await page.waitForTimeout(100);
  }

  await browser.close();
})();
