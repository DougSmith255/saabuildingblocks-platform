const playwright = require('playwright');

(async () => {
  console.log('=== TESTING CLOUDFLARE DEPLOYED SITE ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading Cloudflare site...\n');

  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Wait a moment for page to load
  await page.waitForTimeout(500);

  // Check profile image animation
  const profileCheck = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    if (!img) return { error: 'Profile image not found' };

    const styles = window.getComputedStyle(img);
    return {
      hasAnimateClass: img.classList.contains('animate-in'),
      animation: styles.animation,
      animationDuration: styles.animationDuration,
      animationDelay: styles.animationDelay,
      animationName: styles.animationName,
      opacity: styles.opacity,
      allClasses: img.className,
    };
  });

  console.log('=== PROFILE IMAGE ON CLOUDFLARE ===');
  console.log(JSON.stringify(profileCheck, null, 2));

  // Track opacity over time to see if it's actually animating
  console.log('\n=== OPACITY TIMELINE (first 3 seconds) ===');
  const startTime = Date.now();
  for (let i = 0; i < 30; i++) {
    const elapsed = (Date.now() - startTime) / 1000;
    const opacity = await page.evaluate(() => {
      const img = document.querySelector('.profile-image');
      return img ? parseFloat(window.getComputedStyle(img).opacity) : null;
    });

    if (i % 5 === 0) {
      console.log(`${elapsed.toFixed(2)}s: opacity ${opacity?.toFixed(3)}`);
    }

    await page.waitForTimeout(100);
  }

  await browser.close();
})();
