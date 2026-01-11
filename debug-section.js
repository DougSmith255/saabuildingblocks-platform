const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Add cache busting
  await page.goto('https://saabuildingblocks.pages.dev/best-real-estate-brokerage/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  
  // Scroll to "The eXp Edge" section
  await page.evaluate(() => {
    const h2s = document.querySelectorAll('h2');
    for (const h2 of h2s) {
      if (h2.textContent.includes('eXp Edge')) {
        h2.scrollIntoView({ block: 'start' });
        break;
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ 
    path: '/var/www/html/screenshots/exp-edge-section.png',
    fullPage: false
  });
  
  console.log('Screenshot saved');
  await browser.close();
})();
