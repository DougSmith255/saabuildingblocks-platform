const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Open mobile menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  console.log('Opening Resources dropdown...');
  const resourcesButton = await page.locator('button:has-text("Resources")');
  await resourcesButton.click();
  await page.waitForTimeout(500);
  
  // Check both dropdowns state
  const getDropdownHeights = async () => {
    return await page.evaluate(() => {
      const dropdowns = document.querySelectorAll('.mobile-dropdown');
      return Array.from(dropdowns).map((dd, i) => ({
        index: i,
        maxHeight: window.getComputedStyle(dd).maxHeight,
        opacity: window.getComputedStyle(dd).opacity,
      }));
    });
  };
  
  console.log('State after Resources fully open:');
  console.log(await getDropdownHeights());
  
  console.log('\nClicking Our Team dropdown...');
  const teamButton = await page.locator('button:has-text("Our Team")');
  
  await teamButton.click();
  await page.waitForTimeout(50);
  
  console.log('State 50ms after clicking Our Team:');
  console.log(await getDropdownHeights());
  
  await page.waitForTimeout(200);
  console.log('\nState 250ms after clicking Our Team:');
  console.log(await getDropdownHeights());
  
  await page.waitForTimeout(200);
  console.log('\nState 450ms after clicking Our Team:');
  console.log(await getDropdownHeights());
  
  await browser.close();
})();
