const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  // Check body and html attributes after menu opens
  const details = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const menu = document.querySelector('#mobile-menu');
    const wrapper = menu?.parentElement;
    
    return {
      body: {
        style: body.getAttribute('style'),
        dataAttrs: Array.from(body.attributes).filter(a => a.name.startsWith('data-')).map(a => a.name + '=' + a.value),
        ariaHidden: body.getAttribute('aria-hidden'),
      },
      html: {
        style: html.getAttribute('style'),
        dataAttrs: Array.from(html.attributes).filter(a => a.name.startsWith('data-')).map(a => a.name + '=' + a.value),
      },
      wrapper: wrapper ? {
        tag: wrapper.tagName,
        className: wrapper.className,
        dataAttrs: Array.from(wrapper.attributes).filter(a => a.name.startsWith('data-')).map(a => a.name + '=' + a.value),
        style: wrapper.getAttribute('style'),
      } : null,
    };
  });
  
  console.log('Detailed RemoveScroll check:');
  console.log(JSON.stringify(details, null, 2));
  
  await browser.close();
})();
