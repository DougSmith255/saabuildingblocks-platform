const { firefox } = require('playwright');

(async () => {
  console.log('Starting Firefox...');
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 800, height: 600 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();
  
  console.log('Navigating to site...');
  await page.goto('https://31.97.103.71/', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('✓ Page loaded');
  
  // Wait for hamburger button
  await page.waitForSelector('.hamburger', { timeout: 10000 });
  console.log('✓ Hamburger button found');
  
  // Click hamburger to open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  console.log('✓ Menu opened');
  
  // Check if menu is visible
  const menuVisible = await page.isVisible('#mobile-menu');
  console.log('Menu visible:', menuVisible);
  
  // Check body styles after menu opens
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    return {
      position: computed.position,
      overflow: computed.overflow,
      top: computed.top
    };
  });
  console.log('\nBody styles:', JSON.stringify(bodyStyles, null, 2));
  
  // Check menu overlay styles
  const menuStyles = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (!menu) return { error: 'Menu not found' };
    const computed = window.getComputedStyle(menu);
    return {
      position: computed.position,
      overflowY: computed.overflowY
    };
  });
  console.log('Menu styles:', JSON.stringify(menuStyles, null, 2));
  
  // Check for RemoveScroll
  const removeScrollCheck = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    const parent = menu?.parentElement;
    return {
      parentTag: parent?.tagName,
      hasRemoveScrollAttr: parent?.hasAttribute('data-remove-scroll-bar')
    };
  });
  console.log('RemoveScroll:', JSON.stringify(removeScrollCheck, null, 2));
  
  // Test page scroll
  console.log('\n--- Testing page scroll ---');
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  
  console.log('Before:', scrollBefore, 'After:', scrollAfter);
  if (scrollAfter === scrollBefore) {
    console.log('✓ Page LOCKED');
  } else {
    console.log('✗ Page SCROLLED by', scrollAfter - scrollBefore, 'px');
  }
  
  await browser.close();
})();
