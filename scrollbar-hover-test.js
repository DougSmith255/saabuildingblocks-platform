const { chromium, firefox, webkit } = require('playwright');

async function captureScrollbar(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  try {
    const browser = await browserType.launch({ headless: true });
    const context = await browser.newContext({ 
      ignoreHTTPSErrors: true,
      viewport: { width: 410, height: 600 }
    });
    const page = await context.newPage();
    
    await page.goto('https://31.97.103.71/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Open menu
    await page.click('.hamburger');
    await page.waitForTimeout(2000);
    
    // Open Resources dropdown by clicking directly on the element
    const clicked = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (!menu) return false;
      
      // Find Resources button
      const buttons = Array.from(menu.querySelectorAll('button'));
      const resourcesBtn = buttons.find(btn => btn.textContent.trim() === 'Resources');
      if (resourcesBtn) {
        resourcesBtn.click();
        return true;
      }
      return false;
    });
    
    console.log('Resources button clicked:', clicked);
    await page.waitForTimeout(1000);
    
    // Trigger scrollbar by hovering over the right edge and scrolling
    await page.mouse.move(395, 300);
    await page.mouse.wheel(0, 50);
    await page.waitForTimeout(200);
    
    const filename = '/tmp/scrollbar-' + browserName.toLowerCase() + '-hover.png';
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
  await captureScrollbar(chromium, 'Chromium');
  await captureScrollbar(firefox, 'Firefox');
  await captureScrollbar(webkit, 'WebKit');
  
  console.log('\n========== All screenshots complete ==========');
})();
