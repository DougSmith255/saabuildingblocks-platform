const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  const rangeInput = await page.$('input[type="range"]');

  if (rangeInput) {
    const initialLabel = await page.evaluate(() => {
      const labels = document.querySelectorAll('label');
      for (const l of labels) {
        if (l.textContent.includes('Transactions')) return l.textContent;
      }
      return 'not found';
    });
    console.log('Initial label:', initialLabel);

    // Get bounding box and simulate mouse drag
    const box = await rangeInput.boundingBox();
    console.log('Box:', box);

    // Click and drag from center to right side
    const startX = box.x + box.width * 0.1;
    const endX = box.x + box.width * 0.9;
    const y = box.y + box.height / 2;

    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();

    await new Promise(r => setTimeout(r, 500));

    const afterLabel = await page.evaluate(() => {
      const labels = document.querySelectorAll('label');
      for (const l of labels) {
        if (l.textContent.includes('Transactions')) return l.textContent;
      }
      return 'not found';
    });
    console.log('After mouse drag label:', afterLabel);
  }

  await browser.close();
})();
