const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 }); // 2x for detail
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle0' });
  
  // Wait for animation
  await new Promise(r => setTimeout(r, 2000));
  
  // Take screenshot of just the top-left corner where stars should be visible
  await page.screenshot({ 
    path: '/var/www/html/screenshots/stars-detail.png',
    clip: { x: 0, y: 100, width: 400, height: 300 }
  });
  
  console.log('Detail screenshot saved');
  
  await browser.close();
})();
