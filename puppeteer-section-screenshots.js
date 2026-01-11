const puppeteer = require('puppeteer');

const url = process.argv[2];
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
  await new Promise(r => setTimeout(r, 3000));

  // Get page height
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Page height: ${pageHeight}px`);

  // Take screenshots at different scroll positions (approximate section locations)
  const sections = [
    { name: 'header', y: 0 },
    { name: 'var2', y: 1100 },
    { name: 'var3', y: 2200 },
    { name: 'var4', y: 3300 },
    { name: 'var6', y: 4400 },
    { name: 'var7', y: 5500 },
    { name: 'var8', y: 6600 },
    { name: 'var9', y: 7700 },
    { name: 'var10', y: 8800 },
  ];

  for (const section of sections) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), section.y);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `${outputDir}/exp-model-${section.name}.png` });
    console.log(`Screenshot saved: exp-model-${section.name}.png`);
  }

  await browser.close();
  console.log('Done!');
})();
