const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const delay = ms => new Promise(r => setTimeout(r, ms));

  console.log('Loading page...');
  await page.goto('https://saabuildingblocks.pages.dev', { waitUntil: 'networkidle2', timeout: 60000 });

  console.log('Looking for Join button...');
  const buttons = await page.$$('button, a');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && text.includes('JOIN')) {
      console.log('Found JOIN button, clicking...');
      await btn.click();
      break;
    }
  }

  await delay(2000);
  await page.screenshot({ path: '/tmp/modal-test-1.png', fullPage: false });
  console.log('Screenshot 1 saved');

  // Fill form using evaluate
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, i) => {
      if (input.type === 'text' && i === 0) input.value = 'Test';
      if (input.type === 'text' && i === 1) input.value = 'User';
      if (input.type === 'email') input.value = 'test@example.com';
      if (input.type === 'tel') input.value = '5551234567';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  await delay(1000);
  await page.screenshot({ path: '/tmp/modal-test-2.png', fullPage: false });

  // Click submit
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking submit...');
    await submitBtn.click();
  }

  await delay(3000);
  await page.screenshot({ path: '/tmp/modal-test-3.png', fullPage: false });
  console.log('Screenshot 3 saved - should show Instructions modal');

  // Check for close button
  const closeBtn = await page.$('button[aria-label="Close modal"]');
  console.log('Close button found:', closeBtn !== null);

  if (closeBtn) {
    const box = await closeBtn.boundingBox();
    console.log('Close button bounding box:', box);

    // Check if button is visible/clickable
    const isVisible = await closeBtn.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
        zIndex: style.zIndex,
        position: style.position,
      };
    });
    console.log('Button computed styles:', isVisible);

    // Try clicking
    console.log('Attempting to click close button...');
    await closeBtn.click();
    await delay(1000);
    await page.screenshot({ path: '/tmp/modal-test-4.png', fullPage: false });
    console.log('Screenshot 4 saved - after clicking X');

    // Check if modal is still there
    const modalStillThere = await page.$('button[aria-label="Close modal"]');
    console.log('Modal still visible after click:', modalStillThere !== null);
  }

  await browser.close();
  console.log('Done');
})();
