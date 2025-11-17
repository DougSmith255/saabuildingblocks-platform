const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 400, height: 600 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('=== BEFORE OPENING MENU ===\n');
  
  const beforeState = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    return {
      body: {
        overflow: window.getComputedStyle(body).overflow,
        overflowY: window.getComputedStyle(body).overflowY,
        width: body.offsetWidth,
        scrollbarWidth: window.innerWidth - body.offsetWidth
      },
      html: {
        overflow: window.getComputedStyle(html).overflow,
        overflowY: window.getComputedStyle(html).overflowY,
        width: html.offsetWidth
      },
      header: header ? {
        width: header.offsetWidth,
        position: window.getComputedStyle(header).position
      } : null,
      main: main ? {
        width: main.offsetWidth,
        position: window.getComputedStyle(main).position
      } : null,
      viewport: {
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth
      }
    };
  });
  
  console.log(JSON.stringify(beforeState, null, 2));

  console.log('\n=== OPENING MOBILE MENU ===\n');
  await page.click('.hamburger');
  await page.waitForTimeout(1500);

  console.log('=== AFTER OPENING MENU ===\n');
  
  const afterState = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const menu = document.querySelector('#mobile-menu');
    
    return {
      body: {
        overflow: window.getComputedStyle(body).overflow,
        overflowY: window.getComputedStyle(body).overflowY,
        width: body.offsetWidth,
        scrollbarWidth: window.innerWidth - body.offsetWidth,
        classList: body.className
      },
      html: {
        overflow: window.getComputedStyle(html).overflow,
        overflowY: window.getComputedStyle(html).overflowY,
        width: html.offsetWidth,
        classList: html.className
      },
      header: header ? {
        width: header.offsetWidth,
        position: window.getComputedStyle(header).position
      } : null,
      main: main ? {
        width: main.offsetWidth,
        position: window.getComputedStyle(main).position
      } : null,
      menu: menu ? {
        width: menu.offsetWidth,
        height: menu.offsetHeight,
        position: window.getComputedStyle(menu).position,
        overflow: window.getComputedStyle(menu).overflow,
        display: window.getComputedStyle(menu).display
      } : null,
      viewport: {
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth
      }
    };
  });
  
  console.log(JSON.stringify(afterState, null, 2));

  await browser.close();
})();
