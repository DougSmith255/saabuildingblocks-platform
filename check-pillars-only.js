const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  await page.goto(`https://saabuildingblocks.pages.dev/agent-attraction-template/?nocache=${timestamp}`, {
    waitUntil: 'networkidle0'
  });

  // Scroll just a little to see the pillars section (01, 02, 03)
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/pillars-centered.png' });
  console.log('Saved pillars-centered.png');

  await browser.close();
})();
