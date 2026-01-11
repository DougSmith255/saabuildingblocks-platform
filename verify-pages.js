const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Locations page
  await page.goto('https://saabuildingblocks.pages.dev/locations/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  await page.evaluate(() => window.scrollBy(0, 900));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/locations-numbers.png' });
  
  // Join page
  await page.goto('https://saabuildingblocks.pages.dev/join-exp-sponsor-team/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/join-numbers.png' });
  
  console.log('Screenshots saved');
  await browser.close();
})();
