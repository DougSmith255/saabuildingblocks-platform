const puppeteer = require('puppeteer');

const url = process.argv[2] || 'https://81b5558b.saabuildingblocks.pages.dev/test-exp-model';
const outputDir = process.argv[3] || '/var/www/html/screenshots';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for page to settle
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshots at different scroll positions
  const sections = [
    { name: 'header', scroll: 0 },
    { name: 'var2-start', scroll: 200 },
    { name: 'var2-mid', scroll: 1500 },
    { name: 'var3', scroll: 3500 },
    { name: 'var6', scroll: 5000 },
    { name: 'var7', scroll: 9000 },
    { name: 'var8', scroll: 12000 },
    { name: 'var9', scroll: 15000 },
    { name: 'var10', scroll: 18000 },
    { name: 'tabbed', scroll: 21000 },
  ];

  for (const section of sections) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), section.scroll);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: `${outputDir}/test-${section.name}.png` });
    console.log(`Screenshot saved: test-${section.name}.png`);
  }

  await browser.close();
  console.log('Done!');
})();
