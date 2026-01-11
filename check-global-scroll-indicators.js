const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();
  const pages = [
    { url: '/', name: 'home' },
    { url: '/agent-attraction-template/', name: 'attraction' },
    { url: '/exp-realty-sponsor/', name: 'sponsor' },
    { url: '/locations/', name: 'locations' },
    { url: '/freebies/', name: 'freebies' }
  ];

  for (const p of pages) {
    await page.goto(`https://saabuildingblocks.pages.dev${p.url}?t=${timestamp}`, {
      waitUntil: 'networkidle0'
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: `/var/www/html/screenshots/scroll-${p.name}.png` });
    console.log(`Saved scroll-${p.name}.png`);
  }

  await browser.close();
})();
