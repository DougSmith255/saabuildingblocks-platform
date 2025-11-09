const playwright = require('playwright');

async function testWolfPackAnimation() {
  const browsers = ['chromium', 'firefox', 'webkit'];
  const results = {};

  for (const browserType of browsers) {
    console.log(`\n=== Testing ${browserType.toUpperCase()} ===`);

    const browser = await playwright[browserType].launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate and wait for page load
      await page.goto('https://saabuildingblocks.pages.dev/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait a bit for initial render
      await page.waitForTimeout(500);

      // Check wolf pack background animation properties
      const wolfPackData = await page.evaluate(() => {
        const wolfPackDiv = document.querySelector('.hero-animate-bg');
        if (!wolfPackDiv) return { error: 'Wolf pack element not found' };

        const styles = window.getComputedStyle(wolfPackDiv);
        const animation = styles.animation;

        return {
          element: 'hero-animate-bg',
          animation: animation,
          animationName: styles.animationName,
          animationDuration: styles.animationDuration,
          animationDelay: styles.animationDelay,
          animationTimingFunction: styles.animationTimingFunction,
          currentOpacity: styles.opacity,
        };
      });

      console.log('Wolf Pack Animation:', JSON.stringify(wolfPackData, null, 2));

      // Check other animation timings for comparison
      const otherElements = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const tagline = document.querySelector('.hero-tagline-mobile-spacing') || document.querySelector('p.text-tagline');
        const buttons = document.querySelectorAll('a[href*="join"], a[href*="learn"]');

        const getAnimationInfo = (el, name) => {
          if (!el) return null;
          const styles = window.getComputedStyle(el);
          return {
            element: name,
            animationDuration: styles.animationDuration,
            animationDelay: styles.animationDelay,
          };
        };

        return {
          h1: getAnimationInfo(h1, 'H1'),
          tagline: getAnimationInfo(tagline, 'Tagline'),
          button1: getAnimationInfo(buttons[0], 'Button 1'),
          button2: getAnimationInfo(buttons[1], 'Button 2'),
        };
      });

      console.log('Other Elements:', JSON.stringify(otherElements, null, 2));

      // Calculate total animation end time
      const calculations = await page.evaluate(() => {
        const buttons = document.querySelectorAll('a[href*="join"], a[href*="learn"]');
        if (buttons.length < 2) return null;

        const button2 = buttons[1].closest('.hero-entrance-animate') || buttons[1];
        const styles = window.getComputedStyle(button2);
        const delay = parseFloat(styles.animationDelay) || 0;
        const duration = parseFloat(styles.animationDuration) || 0;

        return {
          lastButtonDelay: delay + 's',
          lastButtonDuration: duration + 's',
          totalEndTime: (delay + duration) + 's',
          expectedWolfPackDuration: (delay + duration) + 's'
        };
      });

      console.log('Timing Calculations:', JSON.stringify(calculations, null, 2));

      results[browserType] = {
        wolfPack: wolfPackData,
        otherElements: otherElements,
        calculations: calculations
      };

      // Take screenshot at page load
      await page.screenshot({ path: `/home/claude-flow/wolfpack-test-${browserType}-start.png` });

      // Wait for animations to complete and take another screenshot
      await page.waitForTimeout(4000);
      await page.screenshot({ path: `/home/claude-flow/wolfpack-test-${browserType}-end.png` });

    } catch (error) {
      console.error(`Error in ${browserType}:`, error.message);
      results[browserType] = { error: error.message };
    }

    await browser.close();
  }

  // Write results to file
  const fs = require('fs');
  fs.writeFileSync(
    '/home/claude-flow/wolfpack-animation-test-results.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== TEST COMPLETE ===');
  console.log('Results saved to: wolfpack-animation-test-results.json');
  console.log('Screenshots saved as: wolfpack-test-{browser}-{start|end}.png');
}

testWolfPackAnimation().catch(console.error);
