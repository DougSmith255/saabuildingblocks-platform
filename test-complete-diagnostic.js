const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('=== COMPREHENSIVE WOLF PACK DIAGNOSTIC ===\n');

  // Track when page starts loading
  const pageLoadStart = Date.now();
  console.log('Page load initiated...\n');

  // Navigate to page
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`, {
    waitUntil: 'domcontentloaded'
  });

  const domContentLoaded = Date.now();
  console.log(`DOM Content Loaded after ${domContentLoaded - pageLoadStart}ms\n`);

  // Check CSS immediately
  const cssCheck = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    if (!wolfPack) return { error: 'Element not found' };

    const styles = window.getComputedStyle(wolfPack);

    return {
      element: {
        className: wolfPack.className,
        display: styles.display,
        visibility: styles.visibility,
      },
      animation: {
        raw: styles.animation,
        name: styles.animationName,
        duration: styles.animationDuration,
        delay: styles.animationDelay,
        timingFunction: styles.animationTimingFunction,
        fillMode: styles.animationFillMode,
      },
      currentOpacity: styles.opacity,
    };
  });

  console.log('=== CSS AT DOM CONTENT LOADED ===');
  console.log(JSON.stringify(cssCheck, null, 2));

  // Now wait for networkidle and check again
  await page.waitForLoadState('networkidle');
  const networkIdle = Date.now();
  console.log(`\nNetwork Idle after ${networkIdle - pageLoadStart}ms\n`);

  // Sample opacity at regular intervals starting from NOW (when user can see page)
  console.log('=== OPACITY TIMELINE (from when page is visible) ===\n');
  const samples = [];
  const visualStart = Date.now();

  for (let i = 0; i < 50; i++) {
    const elapsed = (Date.now() - visualStart) / 1000;
    const opacity = await page.evaluate(() => {
      const el = document.querySelector('.hero-animate-bg');
      return el ? window.getComputedStyle(el).opacity : 'NOT FOUND';
    });

    samples.push({ time: elapsed, opacity: parseFloat(opacity) });

    // Log key moments
    if (i === 0) {
      console.log(`0.00s: ${opacity} <- FIRST VISIBLE MOMENT (should be ~0 with 1s delay)`);
    } else if (i === 5) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity} <- After 0.5s`);
    } else if (i === 10) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity} <- After 1s (delay should end here)`);
    } else if (i === 20) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity} <- After 2s (50% through 3s animation)`);
    } else if (i === 30) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity} <- After 3s`);
    } else if (i === 40) {
      console.log(`${elapsed.toFixed(2)}s: ${opacity} <- After 4s (should be 1.0)`);
    }

    await page.waitForTimeout(100);
  }

  // Analysis
  console.log('\n=== ANALYSIS ===');
  const firstOpacity = samples[0].opacity;
  const at500ms = samples[5].opacity;
  const at1000ms = samples[10].opacity;
  const at2000ms = samples[20].opacity;
  const at3000ms = samples[30].opacity;
  const at4000ms = samples[40].opacity;

  console.log(`\nExpected behavior with "animation: bgZoom2025 3s linear 1s both":`);
  console.log(`- 0s-1s: opacity should stay at 0 (delay)`);
  console.log(`- 1s-4s: opacity should linearly fade 0→1 over 3 seconds`);
  console.log(`\nActual behavior:`);
  console.log(`At 0.00s: ${firstOpacity.toFixed(3)} (expected: ~0.000)`);
  console.log(`At 0.50s: ${at500ms.toFixed(3)} (expected: ~0.000)`);
  console.log(`At 1.00s: ${at1000ms.toFixed(3)} (expected: ~0.000, animation just starting)`);
  console.log(`At 2.00s: ${at2000ms.toFixed(3)} (expected: ~0.333, 1s into 3s fade)`);
  console.log(`At 3.00s: ${at3000ms.toFixed(3)} (expected: ~0.667, 2s into 3s fade)`);
  console.log(`At 4.00s: ${at4000ms.toFixed(3)} (expected: 1.000, animation complete)`);

  // Calculate the discrepancy
  const timeGap = networkIdle - pageLoadStart;
  console.log(`\n=== TIMING GAP IDENTIFIED ===`);
  console.log(`Time from page load start to network idle: ${timeGap}ms`);
  console.log(`Animation starts: When DOM is rendered (during page load)`);
  console.log(`User sees page: After network idle (~${timeGap}ms later)`);
  console.log(`\nThis means the animation has already progressed ${(timeGap / 1000).toFixed(2)}s`);
  console.log(`before the user can even see the page!`);

  await browser.close();
})();
