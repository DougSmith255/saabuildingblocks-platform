const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  // Home page scroll indicator
  await page.goto(`https://saabuildingblocks.pages.dev/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/var/www/html/screenshots/home-scroll-indicator.png' });
  console.log('Saved home-scroll-indicator.png');

  // Agent attraction scroll indicator
  await page.goto(`https://saabuildingblocks.pages.dev/agent-attraction-template/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/var/www/html/screenshots/attraction-scroll-indicator.png' });
  console.log('Saved attraction-scroll-indicator.png');

  await browser.close();
})();
