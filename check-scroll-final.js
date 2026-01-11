const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();
  
  // Check home page (should have indicator with tighter glow)
  await page.goto(`https://saabuildingblocks.pages.dev/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/var/www/html/screenshots/scroll-final-home.png' });
  console.log('Saved scroll-final-home.png');

  // Check login page (should NOT have indicator)
  await page.goto(`https://saabuildingblocks.pages.dev/agent-portal/login/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/var/www/html/screenshots/scroll-final-login.png' });
  console.log('Saved scroll-final-login.png');

  await browser.close();
})();
