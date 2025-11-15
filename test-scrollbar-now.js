const { chromium, firefox, webkit } = require('playwright');

async function captureScrollbar(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 410, height: 700 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Click Resources to expand
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const buttons = Array.from(menu.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.trim() === 'Resources');
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  // Scroll to show scrollbar
  await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    menu.scrollTop = 150;
  });
  await page.waitForTimeout(500);
  
  // Move mouse to scrollbar area
  await page.mouse.move(405, 350);
  await page.waitForTimeout(300);
  
  // Get computed styles
  const styles = await page.evaluate(() => {
    const body = document.body;
    const menu = document.querySelector('#mobile-menu');
    
    // Check what CSS rules are applied
    const bodyStyles = window.getComputedStyle(body);
    const menuStyles = window.getComputedStyle(menu);
    
    return {
      body: {
        scrollbarColor: bodyStyles.scrollbarColor,
      },
      menu: {
        scrollbarColor: menuStyles.scrollbarColor,
        scrollBehavior: menuStyles.scrollBehavior,
      }
    };
  });
  
  console.log('Computed styles:', JSON.stringify(styles, null, 2));
  
  const filename = '/tmp/verify-scrollbar-' + browserName.toLowerCase() + '.png';
  await page.screenshot({ path: filename });
  console.log('Screenshot saved:', filename);
  
  await browser.close();
}

(async () => {
  await captureScrollbar(chromium, 'Chromium');
  await captureScrollbar(firefox, 'Firefox');
  await captureScrollbar(webkit, 'WebKit');
  console.log('\n========== All screenshots complete ==========');
})();
