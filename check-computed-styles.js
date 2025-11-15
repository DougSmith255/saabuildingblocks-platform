const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Get BEFORE styles
  const beforeStyles = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const computed = window.getComputedStyle(body);
    
    return {
      body: {
        position: computed.position,
        overflow: computed.overflow,
        touchAction: computed.touchAction,
        paddingRight: computed.paddingRight,
      },
      html: {
        overflow: window.getComputedStyle(html).overflow,
      }
    };
  });
  
  console.log('BEFORE menu open:');
  console.log(JSON.stringify(beforeStyles, null, 2));
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  // Get AFTER styles
  const afterStyles = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const computed = window.getComputedStyle(body);
    
    return {
      body: {
        position: computed.position,
        overflow: computed.overflow,
        touchAction: computed.touchAction,
        paddingRight: computed.paddingRight,
        inlineStyle: body.getAttribute('style'),
      },
      html: {
        overflow: window.getComputedStyle(html).overflow,
      },
      scrollLocked: body.getAttribute('data-scroll-locked'),
    };
  });
  
  console.log('\nAFTER menu open:');
  console.log(JSON.stringify(afterStyles, null, 2));
  
  await browser.close();
})();
