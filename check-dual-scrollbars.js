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
  await page.waitForTimeout(1500);

  console.log('=== BEFORE OPENING MENU ===\n');
  
  const beforeMenu = await page.evaluate(() => {
    return {
      bodyOverflow: window.getComputedStyle(document.body).overflowY,
      htmlOverflow: window.getComputedStyle(document.documentElement).overflowY,
      documentScrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      bodyHasScrollbar: document.documentElement.scrollHeight > window.innerHeight
    };
  });
  
  console.log('Before menu:', JSON.stringify(beforeMenu, null, 2));

  console.log('\n=== OPENING MOBILE MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(1500);

  const afterMenu = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      bodyOverflow: window.getComputedStyle(document.body).overflowY,
      htmlOverflow: window.getComputedStyle(document.documentElement).overflowY,
      documentScrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      bodyHasScrollbar: document.documentElement.scrollHeight > window.innerHeight,
      menuOverflow: menu ? window.getComputedStyle(menu).overflowY : null,
      menuHasScrollbar: menu ? menu.scrollHeight > menu.clientHeight : false,
      menuPosition: menu ? window.getComputedStyle(menu).position : null,
      bodyPosition: window.getComputedStyle(document.body).position
    };
  });
  
  console.log('After menu:', JSON.stringify(afterMenu, null, 2));

  if (afterMenu.bodyHasScrollbar && afterMenu.menuHasScrollbar) {
    console.log('\n❌ PROBLEM: Both body AND menu have scrollbars!');
    console.log('We need to hide the body scrollbar when menu is open.');
  } else if (afterMenu.menuHasScrollbar) {
    console.log('\n✅ GOOD: Only menu has scrollbar, body does not.');
  } else if (afterMenu.bodyHasScrollbar) {
    console.log('\n⚠️  Only body has scrollbar, menu does not.');
  }

  await browser.close();
})();
