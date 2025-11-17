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

  console.log('=== STEP 1: Check body scrollbar ===');

  // First, make body scrollable by scrolling down
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);

  // Take full page screenshot to see body scrollbar
  await page.screenshot({
    path: '/tmp/page-with-body-scrollbar.png',
    fullPage: false
  });

  console.log('Body scrollbar screenshot saved: /tmp/page-with-body-scrollbar.png');

  console.log('\n=== STEP 2: Open mobile menu and make it scrollable ===');

  // Scroll back to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Open hamburger menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  // Click to open "Our Team" dropdown
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const ourTeamBtn = buttons.find(btn => btn.textContent.includes('Our Team'));
    if (ourTeamBtn) ourTeamBtn.click();
  });
  await page.waitForTimeout(500);

  // Click to open "Resources" dropdown
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);

  // Check if menu is scrollable
  const menuStatus = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    return {
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      isScrollable: menu.scrollHeight > menu.clientHeight,
      scrollTop: menu.scrollTop
    };
  });

  console.log('Menu status:', menuStatus);

  if (menuStatus.isScrollable) {
    // Scroll menu a bit to show scrollbar thumb in the middle
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      menu.scrollTop = 150;
    });
    await page.waitForTimeout(500);

    // Take screenshot of mobile menu
    await page.screenshot({
      path: '/tmp/menu-with-scrollbar.png',
      fullPage: false
    });

    console.log('Mobile menu scrollbar screenshot saved: /tmp/menu-with-scrollbar.png');

    // Now get a closeup of just the right edge where scrollbar is
    const scrollbarClip = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      const rect = menu.getBoundingClientRect();
      return {
        x: rect.right - 20, // 20px from right edge to capture scrollbar
        y: rect.top + 50,
        width: 20,
        height: 200
      };
    });

    await page.screenshot({
      path: '/tmp/scrollbar-closeup.png',
      clip: scrollbarClip
    });

    console.log('Scrollbar closeup saved: /tmp/scrollbar-closeup.png');
  } else {
    console.log('ERROR: Menu is not scrollable!');
  }

  await browser.close();
})();
