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

  console.log('=== OPENING MOBILE MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(1500);

  const menuInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      found: !!menu,
      overflow: menu ? window.getComputedStyle(menu).overflowY : null,
      position: menu ? window.getComputedStyle(menu).position : null,
      scrollHeight: menu ? menu.scrollHeight : 0,
      clientHeight: menu ? menu.clientHeight : 0,
      canScroll: menu ? menu.scrollHeight > menu.clientHeight : false
    };
  });

  console.log('Menu info:', JSON.stringify(menuInfo, null, 2));

  if (menuInfo.canScroll) {
    console.log('\n=== MENU IS SCROLLABLE - TESTING SCROLL ===\n');
    
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (menu) menu.scrollTop = 100;
    });
    await page.waitForTimeout(500);

    const scrollResult = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      return {
        scrollTop: menu ? menu.scrollTop : 0,
        scrolledSuccessfully: menu && menu.scrollTop > 0
      };
    });

    console.log('Scroll result:', JSON.stringify(scrollResult, null, 2));
    
    if (scrollResult.scrolledSuccessfully) {
      console.log('\n✅ SUCCESS: Menu scrollbar is working!');
    } else {
      console.log('\n❌ FAILED: Menu did not scroll');
    }
  } else {
    console.log('\n⚠️  Menu content is shorter than viewport - no scroll needed yet');
  }

  await browser.close();
})();
