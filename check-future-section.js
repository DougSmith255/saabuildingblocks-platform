const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const timestamp = Date.now();

  // Check agent attraction page - Built for Future section
  await page.goto(`https://saabuildingblocks.pages.dev/agent-attraction-template/?t=${timestamp}`, {
    waitUntil: 'networkidle0'
  });

  // Try to find and scroll to the "Built for Where Real Estate Is Going" heading
  await page.evaluate(() => {
    const headings = document.querySelectorAll('h2, .h2-container');
    for (const h of headings) {
      if (h.textContent.includes('Built for Where')) {
        h.scrollIntoView({ behavior: 'instant', block: 'center' });
        return;
      }
    }
    // Fallback: scroll to position
    window.scrollTo(0, 5500);
  });

  await new Promise(r => setTimeout(r, 2000)); // Wait for animation
  await page.screenshot({ path: '/var/www/html/screenshots/attraction-future-section.png' });
  console.log('Saved attraction-future-section.png');

  await browser.close();
})();
