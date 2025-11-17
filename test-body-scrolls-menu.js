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
  await page.waitForTimeout(1000);

  console.log('=== OPENING MOBILE MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(1500);

  // Check initial state
  const beforeScroll = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      windowScrollY: window.scrollY,
      documentScrollHeight: document.documentElement.scrollHeight,
      documentClientHeight: document.documentElement.clientHeight,
      bodyOverflow: window.getComputedStyle(document.body).overflowY,
      menuHeight: menu ? menu.offsetHeight : 0,
      menuOverflow: menu ? window.getComputedStyle(menu).overflow : null,
      menuPosition: menu ? window.getComputedStyle(menu).position : null
    };
  });

  console.log('Before scroll:', JSON.stringify(beforeScroll, null, 2));

  console.log('\n=== SCROLLING DOWN 200PX ===\n');
  
  // Try to scroll the page
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(500);

  const afterScroll = await page.evaluate(() => {
    return {
      windowScrollY: window.scrollY,
      documentScrollHeight: document.documentElement.scrollHeight,
      documentClientHeight: document.documentElement.clientHeight
    };
  });

  console.log('After scroll:', JSON.stringify(afterScroll, null, 2));
  
  if (afterScroll.windowScrollY > 0) {
    console.log('\n✅ SUCCESS: Body scroll is working! Menu content scrolled with page.');
  } else {
    console.log('\n❌ ISSUE: Body did not scroll. Menu might not be tall enough or scroll is blocked.');
  }

  // Take screenshot at scrolled position
  await page.screenshot({ path: '/tmp/menu-scrolled.png' });
  console.log('\nScreenshot saved: /tmp/menu-scrolled.png');

  await browser.close();
})();
