const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to https://saabuildingblocks.pages.dev...');
  await page.goto('https://saabuildingblocks.pages.dev', { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Wait for the counter to be visible
  await page.waitForTimeout(3000);

  // Take desktop screenshot
  await page.screenshot({ path: '/home/claude-flow/packages/public-site/scripts/desktop-screenshot.png', fullPage: false });
  console.log('Desktop screenshot saved to scripts/desktop-screenshot.png');

  // Find the counter element - looking for the element with the clamp font-size
  const counterInfo = await page.evaluate(() => {
    // Find elements with inline font-size containing clamp
    const allElements = document.querySelectorAll('*');
    const results = [];

    for (const el of allElements) {
      const inlineStyle = el.getAttribute('style');
      if (inlineStyle && inlineStyle.includes('clamp') && inlineStyle.includes('75px')) {
        const computedStyle = window.getComputedStyle(el);
        results.push({
          tagName: el.tagName,
          textContent: el.textContent.trim().substring(0, 50),
          inlineStyle: inlineStyle,
          computedFontSize: computedStyle.fontSize,
          computedFontFamily: computedStyle.fontFamily,
          classList: Array.from(el.classList),
          viewportWidth: window.innerWidth
        });
      }
    }

    return results;
  });

  console.log('\n=== Counter Elements Found ===');
  console.log(JSON.stringify(counterInfo, null, 2));

  // Also check for any CSS overrides
  const cssOverrides = await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    const overrides = [];

    try {
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.cssText && rule.cssText.includes('font-size') && rule.cssText.includes('!important')) {
              overrides.push(rule.cssText);
            }
          }
        } catch (e) {
          // CORS issues with external stylesheets
        }
      }
    } catch (e) {
      console.error('Error reading stylesheets:', e.message);
    }

    return overrides;
  });

  console.log('\n=== CSS Font-Size !important Overrides ===');
  console.log(JSON.stringify(cssOverrides, null, 2));

  // Now test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/claude-flow/packages/public-site/scripts/mobile-screenshot.png', fullPage: false });
  console.log('Mobile screenshot saved to scripts/mobile-screenshot.png');

  const mobileCounterInfo = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const results = [];

    for (const el of allElements) {
      const inlineStyle = el.getAttribute('style');
      if (inlineStyle && inlineStyle.includes('clamp') && inlineStyle.includes('75px')) {
        const computedStyle = window.getComputedStyle(el);
        results.push({
          tagName: el.tagName,
          textContent: el.textContent.trim().substring(0, 50),
          computedFontSize: computedStyle.fontSize,
          viewportWidth: window.innerWidth
        });
      }
    }

    return results;
  });

  console.log('\n=== Mobile Counter Elements ===');
  console.log(JSON.stringify(mobileCounterInfo, null, 2));

  await browser.close();
})();
