const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(500);
  
  // Get the RemoveScroll wrapper HTML
  const menuHTML = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (menu && menu.parentElement) {
      return {
        parentHTML: menu.parentElement.outerHTML.substring(0, 500),
        parentDatasets: Object.keys(menu.parentElement.dataset),
        parentAttrs: Array.from(menu.parentElement.attributes).map(a => `${a.name}="${a.value}"`),
        hasRemoveScrollClass: menu.parentElement.classList.contains('RemoveScroll'),
      };
    }
    return null;
  });
  
  console.log('Menu parent details:');
  console.log(JSON.stringify(menuHTML, null, 2));
  
  await browser.close();
})();
