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

  // Open Resources to make menu scrollable
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  console.log('=== INSPECTING MOBILE MENU SCROLLBAR ===\n');

  const menuInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (!menu) return { error: 'Menu not found' };

    const styles = window.getComputedStyle(menu);

    return {
      id: menu.id,
      className: menu.className,
      overflow: styles.overflow,
      overflowY: styles.overflowY,
      scrollBehavior: styles.scrollBehavior,
      position: styles.position,
      // Check if element is actually scrollable
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      isScrollable: menu.scrollHeight > menu.clientHeight,
      // Look for any inline styles
      inlineStyle: menu.getAttribute('style') || 'none',
    };
  });

  console.log('Mobile Menu Element Info:');
  console.log(JSON.stringify(menuInfo, null, 2));

  // Check for any CSS rules affecting scrollbar
  const scrollbarRules = await page.evaluate(() => {
    const results = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          const text = rule.cssText;
          if (text.includes('-webkit-scrollbar') && text.includes('mobile-menu')) {
            results.push({
              selector: rule.selectorText,
              cssText: text,
              href: sheet.href || 'inline'
            });
          }
        }
      } catch (e) {
        // Skip CORS blocked sheets
      }
    }
    return results;
  });

  console.log('\n=== CSS RULES FOR MOBILE MENU SCROLLBAR ===');
  console.log(JSON.stringify(scrollbarRules, null, 2));

  // Check if there are any parent elements with overflow
  const parentOverflow = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const parents = [];
    let current = menu?.parentElement;

    while (current && current !== document.body) {
      const styles = window.getComputedStyle(current);
      if (styles.overflow !== 'visible' || styles.overflowY !== 'visible') {
        parents.push({
          tag: current.tagName,
          id: current.id || 'none',
          className: current.className || 'none',
          overflow: styles.overflow,
          overflowY: styles.overflowY,
        });
      }
      current = current.parentElement;
    }
    return parents;
  });

  console.log('\n=== PARENT ELEMENTS WITH OVERFLOW ===');
  console.log(JSON.stringify(parentOverflow, null, 2));

  // Check for nested scrollable elements inside mobile menu
  const nestedScrollable = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (!menu) return [];

    const scrollableElements = [];
    const walk = (element) => {
      if (element === menu) {
        Array.from(element.children).forEach(walk);
        return;
      }

      const styles = window.getComputedStyle(element);
      if (styles.overflowY === 'auto' || styles.overflowY === 'scroll') {
        scrollableElements.push({
          tag: element.tagName,
          id: element.id || 'none',
          className: element.className || 'none',
          overflowY: styles.overflowY,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
        });
      }

      Array.from(element.children).forEach(walk);
    };

    walk(menu);
    return scrollableElements;
  });

  console.log('\n=== NESTED SCROLLABLE ELEMENTS ===');
  console.log(JSON.stringify(nestedScrollable, null, 2));

  await browser.close();
})();
