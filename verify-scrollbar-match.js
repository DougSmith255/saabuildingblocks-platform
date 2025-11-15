const { chromium, firefox, webkit } = require('playwright');

async function testScrollbarMatch(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check body scrollbar styles
  const bodyStyles = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body);
    return {
      colorScheme: computed.colorScheme,
      scrollbarColor: computed.scrollbarColor,
    };
  });
  
  console.log('Body scrollbar styles:', JSON.stringify(bodyStyles, null, 2));
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(2000);
  
  // Open Resources dropdown
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const resourcesBtn = buttons.find(btn => btn.textContent.includes('Resources'));
    if (resourcesBtn) resourcesBtn.click();
  });
  await page.waitForTimeout(1000);
  
  // Check mobile menu scrollbar styles
  const menuStyles = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const computed = window.getComputedStyle(menu);
    return {
      colorScheme: computed.colorScheme,
      scrollbarColor: computed.scrollbarColor,
      scrollBehavior: computed.scrollBehavior,
    };
  });
  
  console.log('Mobile menu scrollbar styles:', JSON.stringify(menuStyles, null, 2));
  console.log('Scrollbar colors match:', bodyStyles.scrollbarColor === menuStyles.scrollbarColor);
  
  // Take screenshot
  const filename = '/tmp/scrollbar-final-' + browserName.toLowerCase() + '.png';
  await page.screenshot({ path: filename });
  console.log('Screenshot saved:', filename);
  
  await browser.close();
}

(async () => {
  await testScrollbarMatch(chromium, 'Chromium');
  await testScrollbarMatch(firefox, 'Firefox');
  await testScrollbarMatch(webkit, 'WebKit');
  console.log('\n========== All tests complete ==========');
})();
