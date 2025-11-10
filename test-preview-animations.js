const playwright = require('playwright');

(async () => {
  console.log('=== TESTING PREVIEW URL ANIMATIONS ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading preview site...\n');

  await page.goto('http://31.97.103.71:3001/');

  // Wait for page to be fully loaded
  await page.waitForTimeout(1000);

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
    };
  });

  console.log('=== PROFILE IMAGE ===');
  console.log(JSON.stringify(profileCheck, null, 2));

  // Check wolf pack background
  const wolfCheck = await page.evaluate(() => {
    const bg = document.querySelector('.hero-animate-bg');
    if (!bg) return { error: 'Wolf pack bg not found' };

    const styles = window.getComputedStyle(bg);
    return {
      hasAnimateClass: bg.classList.contains('animate-in'),
      animation: styles.animation,
      animationDuration: styles.animationDuration,
      animationDelay: styles.animationDelay,
      animationName: styles.animationName,
      opacity: styles.opacity,
    };
  });

  console.log('\n=== WOLF PACK BACKGROUND ===');
  console.log(JSON.stringify(wolfCheck, null, 2));

  // Check H1 animation
  const h1Check = await page.evaluate(() => {
    const h1 = document.querySelector('#hero-heading');
    if (!h1) return { error: 'H1 not found' };

    const styles = window.getComputedStyle(h1);
    return {
      animation: styles.animation,
      animationDuration: styles.animationDuration,
      animationDelay: styles.animationDelay,
      animationName: styles.animationName,
      opacity: styles.opacity,
    };
  });

  console.log('\n=== H1 TITLE ===');
  console.log(JSON.stringify(h1Check, null, 2));

  await browser.close();
})();
