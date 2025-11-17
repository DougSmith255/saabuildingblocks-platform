const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1200, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('=== STEP 1: Capture BODY scrollbar ===');

  // Scroll down to make body scrollable and show scrollbar
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);

  // Get the exact position and properties of body scrollbar
  const bodyScrollbarInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const windowWidth = window.innerWidth;
    const scrollbarWidth = windowWidth - docWidth;

    return {
      visible: document.documentElement.scrollHeight > window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollbarWidth: scrollbarWidth,
      viewportWidth: windowWidth,
      scrollbarX: windowWidth - scrollbarWidth
    };
  });

  console.log('Body scrollbar info:', JSON.stringify(bodyScrollbarInfo, null, 2));

  // Capture just the scrollbar area from the right edge
  await page.screenshot({
    path: '/tmp/body-scrollbar-closeup.png',
    clip: {
      x: 1200 - 20,
      y: 200,
      width: 20,
      height: 300
    }
  });

  console.log('\n=== STEP 2: Capture MOBILE MENU scrollbar ===');

  // Go back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Set viewport to mobile size
  await page.setViewportSize({ width: 400, height: 600 });
  await page.waitForTimeout(500);

  // Open mobile menu
  console.log('Opening hamburger menu...');
  await page.click('.hamburger');
  await page.waitForTimeout(2000);

  // Click Resources button using evaluate to ensure it clicks the mobile menu button
  console.log('Clicking Resources in mobile menu...');
  await page.evaluate(() => {
    const menuButtons = document.querySelectorAll('#mobile-menu button');
    const resourcesBtn = Array.from(menuButtons).find(btn =>
      btn.textContent.includes('Resources')
    );
    if (resourcesBtn) {
      console.log('Found Resources button, clicking...');
      resourcesBtn.click();
      return true;
    }
    return false;
  });

  await page.waitForTimeout(1500);

  // Check if menu is scrollable
  const menuScrollbarInfo = await page.evaluate(() => {
    const menu = document.querySelector('#mobile-menu');
    if (!menu) return { error: 'Menu not found' };

    return {
      visible: menu.scrollHeight > menu.clientHeight,
      scrollHeight: menu.scrollHeight,
      clientHeight: menu.clientHeight,
      scrollTop: menu.scrollTop,
      classList: menu.className
    };
  });

  console.log('Mobile menu scrollbar info:', JSON.stringify(menuScrollbarInfo, null, 2));

  if (menuScrollbarInfo.visible) {
    // Scroll the menu to show scrollbar thumb in middle
    await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu');
      menu.scrollTop = 150;
    });
    await page.waitForTimeout(500);

    // Capture just the scrollbar area from the right edge
    await page.screenshot({
      path: '/tmp/menu-scrollbar-closeup.png',
      clip: {
        x: 400 - 20,
        y: 150,
        width: 20,
        height: 300
      }
    });

    console.log('\nBoth scrollbar closeups captured!');
    console.log('  Body scrollbar: /tmp/body-scrollbar-closeup.png');
    console.log('  Menu scrollbar: /tmp/menu-scrollbar-closeup.png');
  } else {
    console.log('ERROR: Mobile menu is not scrollable!');
  }

  await browser.close();
})();
