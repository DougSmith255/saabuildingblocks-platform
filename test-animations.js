const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');

async function testBrowser(browserType, browserName) {
  console.log(`\n========== Testing in ${browserName} ==========`);

  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console logs
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Navigate to the site
  try {
    await page.goto('https://saabuildingblocks.pages.dev', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
  } catch (error) {
    console.log(`Warning: ${error.message}`);
  }

  // Wait a moment for animations to potentially start
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({
    path: `/home/claude-flow/screenshot-${browserName}.png`,
    fullPage: true
  });

  // Check for h1 element and its styles
  const h1Info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return { found: false };

    const computed = window.getComputedStyle(h1);
    return {
      found: true,
      text: h1.textContent,
      opacity: computed.opacity,
      transform: computed.transform,
      transition: computed.transition,
      animation: computed.animation,
      classList: Array.from(h1.classList),
      visibility: computed.visibility,
      display: computed.display
    };
  });

  // Check for Framer Motion presence
  const framerMotionLoaded = await page.evaluate(() => {
    return typeof window.FramerMotion !== 'undefined' ||
           !!document.querySelector('[data-framer-motion-id]') ||
           !!document.querySelector('[style*="transform"]');
  });

  // Check for animation-related classes
  const animationClasses = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const animatedElements = [];

    allElements.forEach(el => {
      const className = typeof el.className === 'string' ? el.className : '';
      const hasAnimation = className && (
        className.includes('animate-') ||
        className.includes('transition-') ||
        className.includes('motion-')
      );

      if (hasAnimation) {
        animatedElements.push({
          tag: el.tagName,
          classes: el.className,
          computedTransform: window.getComputedStyle(el).transform
        });
      }
    });

    return animatedElements;
  });

  // Get computed styles of buttons
  const buttonInfo = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, a.button, [role="button"]');
    return Array.from(buttons).slice(0, 3).map(btn => {
      const computed = window.getComputedStyle(btn);
      return {
        text: btn.textContent?.trim(),
        opacity: computed.opacity,
        transform: computed.transform,
        transition: computed.transition,
        classList: Array.from(btn.classList)
      };
    });
  });

  console.log(`\n✓ Screenshot saved: screenshot-${browserName}.png`);
  console.log(`\n📊 H1 Info:`, JSON.stringify(h1Info, null, 2));
  console.log(`\n🎭 Framer Motion loaded:`, framerMotionLoaded);
  console.log(`\n🎨 Elements with animation classes:`, animationClasses.length);
  if (animationClasses.length > 0) {
    console.log(JSON.stringify(animationClasses.slice(0, 5), null, 2));
  }
  console.log(`\n🔘 Button Info:`, JSON.stringify(buttonInfo, null, 2));
  console.log(`\n📝 Console Logs (${consoleLogs.length} total):`,
    consoleLogs.slice(0, 10).join('\n'));

  await browser.close();

  return {
    browser: browserName,
    h1Info,
    framerMotionLoaded,
    animationClassCount: animationClasses.length,
    animationClasses: animationClasses.slice(0, 5),
    buttonInfo,
    consoleLogs: consoleLogs.slice(0, 10)
  };
}

(async () => {
  try {
    const results = {};

    // Test in Chromium
    results.chromium = await testBrowser(chromium, 'chromium');

    // Test in Firefox
    results.firefox = await testBrowser(firefox, 'firefox');

    // Test in WebKit (Safari)
    results.webkit = await testBrowser(webkit, 'webkit');

    // Save results to JSON
    fs.writeFileSync(
      '/home/claude-flow/animation-test-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n\n========== SUMMARY ==========');
    console.log('✓ All tests complete!');
    console.log('✓ Screenshots saved for all browsers');
    console.log('✓ Results saved to animation-test-results.json');

  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  }
})();
