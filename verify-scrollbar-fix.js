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

  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  // Open Resources
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  console.log('=== CHECKING IF SCROLLBAR-WIDTH: THIN IS REMOVED ===\n');

  const cssRules = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('mobile-menu-overlay') && text.includes('scrollbar')) {
            results.push({
              selector: rule.selectorText || 'unknown',
              cssText: text.replace(/\s+/g, ' ').trim(),
            });
          }
        }
      } catch (e) {
        // Skip CORS blocked sheets
      }
    }
    return results;
  });

  console.log('Found CSS rules for mobile-menu-overlay scrollbar:');
  cssRules.forEach(rule => {
    console.log(`\nSelector: ${rule.selector}`);
    console.log(`CSS: ${rule.cssText}`);

    if (rule.cssText.includes('scrollbar-width')) {
      const match = rule.cssText.match(/scrollbar-width:\s*([^;]+)/);
      if (match) {
        console.log(`⚠️  FOUND scrollbar-width: ${match[1]}`);
      }
    }
  });

  console.log('\n=== VERIFICATION ===');
  const hasThin = cssRules.some(r => r.cssText.includes('scrollbar-width') && r.cssText.includes('thin'));
  console.log(`scrollbar-width: thin present: ${hasThin ? '❌ YES (BAD)' : '✅ NO (GOOD)'}`);

  const has12px = cssRules.some(r => r.cssText.includes('width: 12px'));
  console.log(`width: 12px present: ${has12px ? '✅ YES (GOOD)' : '❌ NO (BAD)'}`);

  const has4pxRadius = cssRules.some(r => r.cssText.includes('border-radius: 4px'));
  console.log(`border-radius: 4px present: ${has4pxRadius ? '✅ YES (GOOD)' : '❌ NO (BAD)'}`);

  await browser.close();
})();
