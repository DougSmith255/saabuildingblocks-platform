const { chromium, firefox } = require('playwright');

async function takeScreenshot(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  try {
    const browser = await browserType.launch({ headless: true });
    const context = await browser.newContext({ 
      ignoreHTTPSErrors: true,
      viewport: { width: 400, height: 800 }
    });
    const page = await context.newPage();
    
    await page.goto('https://31.97.103.71/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Open menu
    await page.click('.hamburger');
    await page.waitForTimeout(1500);
    
    // Scroll down in the menu to make scrollbar visible
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      if (menu) menu.scrollTop = 100;
    });
    await page.waitForTimeout(500);
    
    const filename = '/tmp/scrollbar-' + browserName.toLowerCase().replace(/\//g, '-') + '.png';
    await page.screenshot({ path: filename, fullPage: false });
    
    console.log('Screenshot saved: ' + filename);
    
    await browser.close();
    return filename;
  } catch (error) {
    console.error('Error with ' + browserName + ':', error.message);
    return null;
  }
}

(async () => {
  const files = [];
  
  files.push(await takeScreenshot(chromium, 'Chromium'));
  files.push(await takeScreenshot(firefox, 'Firefox'));
  
  console.log('\n========== Summary ==========');
  console.log('Screenshots saved to:');
  files.filter(f => f).forEach(f => console.log('  - ' + f));
})();
