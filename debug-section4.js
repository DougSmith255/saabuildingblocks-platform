const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/best-real-estate-brokerage/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  
  // Scroll incrementally to trigger lazy loading
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 500));
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ 
    path: '/var/www/html/screenshots/exp-edge-section4.png',
    fullPage: false
  });
  
  console.log('Screenshot saved');
  await browser.close();
})();
