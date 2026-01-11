const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  // Force cache bust
  await page.goto(`https://saabuildingblocks.pages.dev/agent-attraction-template/?nocache=${timestamp}`, {
    waitUntil: 'networkidle0'
  });

  // Screenshot 1: Pillars section (01, 02, 03)
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/var/www/html/screenshots/issue-pillars.png' });
  console.log('Saved issue-pillars.png');

  // Screenshot 2: Built for Future section
  await page.evaluate(() => {
    const headings = document.querySelectorAll('h2');
    for (const h of headings) {
      if (h.textContent && h.textContent.includes('Built')) {
        h.scrollIntoView({ behavior: 'instant', block: 'start' });
        return;
      }
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/var/www/html/screenshots/issue-future.png' });
  console.log('Saved issue-future.png');

  await browser.close();
})();
