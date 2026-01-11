const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  // Check agent attraction page - Value Pillars section (01, 02, 03)
  await page.goto(`https://saabuildingblocks.pages.dev/agent-attraction-template/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });

  // Scroll to find the pillar section with 01, 02, 03
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/attraction-pillars.png' });
  console.log('Saved attraction-pillars.png');

  await browser.close();
})();
