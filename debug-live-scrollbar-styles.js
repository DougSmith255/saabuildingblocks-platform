const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('=== CHECKING BODY SCROLLBAR CSS ===\n');

  const bodyScrollbarCSS = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('body::-webkit-scrollbar')) {
            results.push({
              selector: rule.selectorText,
              css: text
            });
          }
        }
      } catch (e) {
        // Skip CORS
      }
    }
    return results;
  });

  console.log('Body scrollbar CSS rules:');
  bodyScrollbarCSS.forEach(rule => {
    console.log(`\n${rule.selector}`);
    console.log(rule.css);
  });

  // Open mobile menu
  console.log('\n\n=== OPENING MOBILE MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  // Click Resources
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('#mobile-menu button');
    const resourcesBtn = Array.from(buttons).find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1500);

  console.log('=== CHECKING MOBILE MENU SCROLLBAR CSS ===\n');

  const menuScrollbarCSS = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('mobile-menu') && text.includes('webkit-scrollbar')) {
            results.push({
              selector: rule.selectorText,
              css: text
            });
          }
        }
      } catch (e) {
        // Skip CORS
      }
    }
    return results;
  });

  console.log('Mobile menu scrollbar CSS rules:');
  menuScrollbarCSS.forEach(rule => {
    console.log(`\n${rule.selector}`);
    console.log(rule.css);
  });

  // Check if scrollbar-color is present anywhere
  console.log('\n\n=== CHECKING FOR SCROLLBAR-COLOR PROPERTY ===\n');

  const scrollbarColorRules = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('scrollbar-color')) {
            results.push({
              selector: rule.selectorText,
              css: text
            });
          }
        }
      } catch (e) {
        // Skip CORS
      }
    }
    return results;
  });

  console.log('Scrollbar-color rules found:');
  if (scrollbarColorRules.length === 0) {
    console.log('  NONE - Good! scrollbar-color is not interfering');
  } else {
    scrollbarColorRules.forEach(rule => {
      console.log(`\n${rule.selector}`);
      console.log(rule.css);
    });
  }

  await browser.close();
})();
