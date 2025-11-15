const { chromium, firefox } = require('playwright');

async function testScrollbar(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  try {
    const browser = await browserType.launch({ headless: true });
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
    await page.waitForTimeout(1500);
    
    // Check if menu has scrollbar
    const scrollInfo = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (!menu) return { found: false };
      return {
        found: true,
        scrollHeight: menu.scrollHeight,
        clientHeight: menu.clientHeight,
        hasScrollbar: menu.scrollHeight > menu.clientHeight,
        overflowY: window.getComputedStyle(menu).overflowY,
      };
    });
    
    console.log('Menu scroll info:', JSON.stringify(scrollInfo, null, 2));
    
    // Scroll to trigger scrollbar visibility
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (menu) {
        menu.scrollTop = 200;
      }
    });
    await page.waitForTimeout(500);
    
    // Take screenshot
    const filename = '/tmp/scrollbar-detail-' + browserName.toLowerCase() + '.png';
    await page.screenshot({ path: filename });
    console.log('Screenshot saved: ' + filename);
    
    // Also check the actual rendered scrollbar color by inspecting a pixel
    const scrollbarPixels = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (!menu) return null;
      const rect = menu.getBoundingClientRect();
      // Sample pixel from right edge where scrollbar should be
      return {
        menuRight: rect.right,
        menuWidth: rect.width,
        windowWidth: window.innerWidth,
      };
    });
    console.log('Scrollbar position info:', JSON.stringify(scrollbarPixels, null, 2));
    
    await browser.close();
    return filename;
  } catch (error) {
    console.error('Error with ' + browserName + ':', error.message);
    return null;
  }
}

(async () => {
  await testScrollbar(chromium, 'Chromium');
  await testScrollbar(firefox, 'Firefox');
})();
