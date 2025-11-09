const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Opening page and recording wolf pack opacity over time...\n');

  // Start recording opacity values
  const opacityLog = [];

  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });

  // Record opacity every 100ms for 5 seconds
  const startTime = Date.now();
  for (let i = 0; i < 50; i++) {
    const elapsed = Date.now() - startTime;
    const opacity = await page.evaluate(() => {
      const wolfPack = document.querySelector('.hero-animate-bg');
      if (!wolfPack) return 'NOT FOUND';
      return window.getComputedStyle(wolfPack).opacity;
    });

    opacityLog.push({
      time: `${(elapsed / 1000).toFixed(2)}s`,
      opacity: opacity,
      percentage: `${(parseFloat(opacity) * 100).toFixed(1)}%`
    });

    // Take screenshots at key moments
    if (i === 0) {
      await page.screenshot({ path: '/home/claude-flow/wolfpack-visual-start.png' });
    } else if (i === 5) {
      await page.screenshot({ path: '/home/claude-flow/wolfpack-visual-0.5s.png' });
    } else if (i === 15) {
      await page.screenshot({ path: '/home/claude-flow/wolfpack-visual-1.5s.png' });
    } else if (i === 25) {
      await page.screenshot({ path: '/home/claude-flow/wolfpack-visual-2.5s.png' });
    } else if (i === 35) {
      await page.screenshot({ path: '/home/claude-flow/wolfpack-visual-3.5s.png' });
    }

    await page.waitForTimeout(100);
  }

  console.log('=== WOLF PACK OPACITY OVER TIME ===\n');
  opacityLog.forEach((log, i) => {
    // Highlight key moments
    let marker = '';
    if (i === 0) marker = ' <- START';
    if (i === 5) marker = ' <- Should be at 0% (0.5s delay)';
    if (i === 15) marker = ' <- Should be ~30%';
    if (i === 25) marker = ' <- Should be ~60%';
    if (i === 35) marker = ' <- Should be ~100% (3.5s total)';

    console.log(`${log.time}: opacity ${log.opacity} (${log.percentage})${marker}`);
  });

  // Check the actual CSS being applied
  console.log('\n=== WOLF PACK CSS PROPERTIES ===\n');
  const cssProps = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    const styles = window.getComputedStyle(wolfPack);

    // Also check for any inline styles or other animations
    const inlineStyle = wolfPack.getAttribute('style');

    return {
      className: wolfPack.className,
      inlineStyle: inlineStyle || 'none',
      animation: styles.animation,
      animationName: styles.animationName,
      animationDuration: styles.animationDuration,
      animationDelay: styles.animationDelay,
      animationTimingFunction: styles.animationTimingFunction,
      animationFillMode: styles.animationFillMode,
    };
  });
  console.log(JSON.stringify(cssProps, null, 2));

  console.log('\n=== Screenshots saved ===');
  console.log('- wolfpack-visual-start.png (0s)');
  console.log('- wolfpack-visual-0.5s.png (should be invisible)');
  console.log('- wolfpack-visual-1.5s.png (should be ~30% visible)');
  console.log('- wolfpack-visual-2.5s.png (should be ~60% visible)');
  console.log('- wolfpack-visual-3.5s.png (should be fully visible)');

  await page.waitForTimeout(2000);
  await browser.close();
})();
