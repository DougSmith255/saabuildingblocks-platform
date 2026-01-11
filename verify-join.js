const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Join page - scroll to Why Join section
  await page.goto('https://saabuildingblocks.pages.dev/join-exp-sponsor-team/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/join-why-section.png' });
  
  console.log('Screenshot saved');
  await browser.close();
})();
