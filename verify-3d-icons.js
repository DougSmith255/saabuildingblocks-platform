const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  // Check locations page - stats section
  await page.goto(`https://saabuildingblocks.pages.dev/locations/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/locations-3d-icons.png' });
  console.log('Saved locations-3d-icons.png');

  // Check join page - Why Join section
  await page.goto(`https://saabuildingblocks.pages.dev/join-exp-sponsor-team/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/join-3d-icons.png' });
  console.log('Saved join-3d-icons.png');

  // Check brokerage page - eXp Edge section
  await page.goto(`https://saabuildingblocks.pages.dev/best-real-estate-brokerage/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/brokerage-3d-icons.png' });
  console.log('Saved brokerage-3d-icons.png');

  // Check FAQ arrows on join page
  await page.goto(`https://saabuildingblocks.pages.dev/join-exp-sponsor-team/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/faq-3d-arrows.png' });
  console.log('Saved faq-3d-arrows.png');

  await browser.close();
})();
