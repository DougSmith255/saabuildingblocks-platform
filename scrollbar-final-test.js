const { chromium, firefox, webkit } = require('playwright');

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
    // Wait for slide-down animation to complete
    await page.waitForTimeout(2000);
    
    // Click Resources dropdown using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
      if (resourcesBtn) resourcesBtn.click();
    });
    await page.waitForTimeout(1000);
    
    // Scroll to make scrollbar active
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (menu) menu.scrollTop = 100;
    });
    await page.waitForTimeout(500);
    
    // Check scroll info
    const scrollInfo = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (!menu) return { found: false };
      return {
        found: true,
        scrollHeight: menu.scrollHeight,
        clientHeight: menu.clientHeight,
        hasScrollbar: menu.scrollHeight > menu.clientHeight,
      };
    });
    
    console.log('Menu scroll info:', JSON.stringify(scrollInfo, null, 2));
    
    // Take screenshot
    const filename = '/tmp/scrollbar-' + browserName.toLowerCase() + '-final.png';
    await page.screenshot({ path: filename });
    console.log('Screenshot saved: ' + filename);
    
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
  await testScrollbar(webkit, 'WebKit');
})();
