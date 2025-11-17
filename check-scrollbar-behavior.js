const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1200, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('=== CHECKING BODY SCROLLBAR ===\n');
  
  const bodyScrollbar = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Scroll down to make scrollbar appear
    window.scrollTo(0, 500);
    
    return {
      bodyOverflow: window.getComputedStyle(body).overflow,
      bodyOverflowY: window.getComputedStyle(body).overflowY,
      htmlOverflow: window.getComputedStyle(html).overflow,
      htmlOverflowY: window.getComputedStyle(html).overflowY,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
      isScrollable: document.documentElement.scrollHeight > window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight
    };
  });
  
  console.log('Body scrollbar info:');
  console.log(JSON.stringify(bodyScrollbar, null, 2));

  await page.waitForTimeout(500);

  // Now switch to mobile viewport
  await page.setViewportSize({ width: 400, height: 600 });
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n=== MOBILE: BEFORE OPENING MENU ===\n');
  
  const mobileBeforeMenu = await page.evaluate(() => {
    return {
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
      bodyOverflowY: window.getComputedStyle(document.body).overflowY,
      htmlOverflowY: window.getComputedStyle(document.documentElement).overflowY
    };
  });
  
  console.log(JSON.stringify(mobileBeforeMenu, null, 2));

  console.log('\n=== MOBILE: OPENING MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(1500);

  // Click Resources to expand
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('#mobile-menu button');
    const resourcesBtn = Array.from(buttons).find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  const mobileWithMenu = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    
    return {
      menuExists: !!menu,
      menuOverflow: menu ? window.getComputedStyle(menu).overflow : null,
      menuOverflowY: menu ? window.getComputedStyle(menu).overflowY : null,
      menuScrollHeight: menu ? menu.scrollHeight : 0,
      menuClientHeight: menu ? menu.clientHeight : 0,
      menuIsScrollable: menu ? menu.scrollHeight > menu.clientHeight : false,
      bodyOverflowY: window.getComputedStyle(document.body).overflowY,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth
    };
  });
  
  console.log('Mobile menu info:');
  console.log(JSON.stringify(mobileWithMenu, null, 2));

  await browser.close();
})();
