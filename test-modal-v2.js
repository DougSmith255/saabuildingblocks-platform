const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    devtools: false
  });
  const page = await browser.newPage();

  // Enable console logging from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const delay = ms => new Promise(r => setTimeout(r, ms));

  // Test with the new preview deployment to bypass cache
  const testUrl = 'https://c3f5bf2a.saabuildingblocks.pages.dev';
  console.log('Loading:', testUrl);
  await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 60000 });

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

  // Fill form using evaluate
  console.log('Filling form...');
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      if (input.type === 'text' && input.name === 'firstName') input.value = 'Test';
      if (input.type === 'text' && input.name === 'lastName') input.value = 'User';
      if (input.type === 'email') input.value = 'test@example.com';
      if (input.type === 'tel') input.value = '5551234567';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  await delay(500);

  // Click submit
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    console.log('Clicking submit...');
    await submitBtn.click();
  }

  await delay(4000);
  await page.screenshot({ path: '/tmp/modal-test-instructions.png', fullPage: false });
  console.log('Screenshot saved - should show Instructions modal');

  // Check for close button with new z-index
  const closeBtn = await page.$('button[aria-label="Close modal"]');
  console.log('Close button found:', closeBtn !== null);

  if (closeBtn) {
    const box = await closeBtn.boundingBox();
    console.log('Close button bounding box:', box);

    // Check computed styles
    const styles = await closeBtn.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
        zIndex: style.zIndex,
        position: style.position,
        cursor: style.cursor,
      };
    });
    console.log('Button computed styles:', styles);

    // Check if there's anything overlapping the button
    const elemAtPoint = await page.evaluate((box) => {
      const el = document.elementFromPoint(box.x + box.width/2, box.y + box.height/2);
      return el ? {
        tagName: el.tagName,
        className: el.className,
        ariaLabel: el.getAttribute('aria-label'),
      } : null;
    }, box);
    console.log('Element at button center:', elemAtPoint);

    // Try clicking by coordinates
    console.log('Clicking at coordinates:', box.x + box.width/2, box.y + box.height/2);
    await page.mouse.click(box.x + box.width/2, box.y + box.height/2);

    await delay(1500);
    await page.screenshot({ path: '/tmp/modal-test-after-click.png', fullPage: false });

    // Check if modal is still there
    const modalStillThere = await page.$('button[aria-label="Close modal"]');
    console.log('Modal still visible after click:', modalStillThere !== null);

    if (modalStillThere) {
      console.log('CLICK FAILED - Modal is still open!');

      // Try using evaluate to directly call click
      console.log('Trying direct click via evaluate...');
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Close modal"]');
        if (btn) {
          console.log('Dispatching click event');
          btn.click();
        }
      });

      await delay(1000);
      const stillThere2 = await page.$('button[aria-label="Close modal"]');
      console.log('Modal after evaluate click:', stillThere2 !== null);
    }
  }

  await browser.close();
  console.log('Done');
})();
