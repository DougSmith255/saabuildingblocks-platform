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

  // Open Resources dropdown
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  // Scroll menu to make scrollbar active
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (menu) menu.scrollTop = 100;
  });
  await page.waitForTimeout(500);

  console.log('=== CHECKING ALL SCROLLBAR CSS RULES ===\n');

  const allScrollbarCSS = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('scrollbar') &&
              (text.includes('mobile-menu') || text.includes('body') || text.includes('::-webkit-scrollbar'))) {
            results.push({
              selector: rule.selectorText || 'unknown',
              cssText: text,
              href: sheet.href || 'inline'
            });
          }
        }
      } catch (e) {
        // Skip CORS
      }
    }
    return results;
  });

  console.log('All scrollbar-related CSS rules:');
  allScrollbarCSS.forEach((rule, i) => {
    console.log(`\n${i + 1}. ${rule.selector}`);
    console.log(`   ${rule.cssText}`);
  });

  console.log('\n=== TESTING SCROLLBAR VISIBILITY ===\n');

  // Inject test CSS to make scrollbar VERY visible
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      #mobile-menu::-webkit-scrollbar {
        width: 20px !important;
        background: red !important;
      }
      #mobile-menu::-webkit-scrollbar-track {
        background: yellow !important;
      }
      #mobile-menu::-webkit-scrollbar-thumb {
        background: blue !important;
        border: 2px solid green !important;
      }
    `;
    document.head.appendChild(style);
  });

  await page.waitForTimeout(1000);

  console.log('Injected bright test colors - check if scrollbar is now visible');
  console.log('Taking screenshot with test colors...');

  await page.screenshot({ path: '/tmp/scrollbar-test-colors.png' });
  console.log('Screenshot saved: /tmp/scrollbar-test-colors.png');

  console.log('\nBrowser window will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
