const { chromium } = require('playwright');

(async () => {
  console.log('\n========== Testing Scroll Lock Implementation ==========\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();

  // Navigate to site
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('1️⃣  Testing scroll before menu opens...');
  
  // Scroll down the page
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  
  const scrollBeforeMenu = await page.evaluate(() => window.scrollY);
  console.log(`   ✓ Page scrolled to: ${scrollBeforeMenu}px\n`);

  console.log('2️⃣  Opening mobile menu...');
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1500);
  
  console.log('   ✓ Menu opened\n');

  console.log('3️⃣  Testing that page scroll is locked...');
  
  // Try to scroll the page (should NOT work because Lenis is stopped)
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  
  const scrollDuringMenu = await page.evaluate(() => window.scrollY);
  console.log(`   Page scroll position: ${scrollDuringMenu}px`);
  
  if (scrollDuringMenu === scrollBeforeMenu) {
    console.log('   ✅ SUCCESS: Page scroll is locked (position unchanged)\n');
  } else {
    console.log('   ⚠️  WARNING: Page scroll changed (scroll lock may not be working)\n');
  }

  console.log('4️⃣  Testing menu scrollability...');
  
  // Open Resources dropdown to add height
  const resourcesButton = await page.locator('text=Resources').first();
  await resourcesButton.click();
  await page.waitForTimeout(1000);
  
  const menuInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu .os-viewport');
    if (!menu) return { found: false };
    
    // Try to scroll the menu
    menu.scrollTop = 100;
    
    return {
      found: true,
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      scrollTop: menu.scrollTop,
      hasScrollbar: menu.scrollHeight > menu.clientHeight,
    };
  });
  
  console.log('   Menu info:', JSON.stringify(menuInfo, null, 2));
  
  if (menuInfo.scrollTop > 0) {
    console.log('   ✅ SUCCESS: Menu is scrollable\n');
  } else {
    console.log('   ⚠️  WARNING: Menu scroll may not be working\n');
  }

  console.log('5️⃣  Closing menu and testing scroll restore...');
  
  // Close menu
  await page.click('.hamburger');
  await page.waitForTimeout(1500);
  
  const scrollAfterMenu = await page.evaluate(() => window.scrollY);
  console.log(`   Page scroll position after menu close: ${scrollAfterMenu}px`);
  
  if (scrollAfterMenu === scrollBeforeMenu) {
    console.log('   ✅ SUCCESS: Scroll position restored correctly\n');
  } else {
    console.log(`   ⚠️  WARNING: Scroll position changed (expected ${scrollBeforeMenu}px, got ${scrollAfterMenu}px)\n`);
  }

  // Take final screenshot
  await page.screenshot({ path: '/tmp/scroll-lock-test.png' });
  console.log('📸 Screenshot saved: /tmp/scroll-lock-test.png\n');

  await browser.close();
  
  console.log('========== Test Complete ==========\n');
})();
