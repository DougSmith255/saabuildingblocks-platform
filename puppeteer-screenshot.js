const puppeteer = require('puppeteer');

const url = process.argv[2];
const outputPath = process.argv[3];
const width = parseInt(process.argv[4]) || 1920;
const height = parseInt(process.argv[5]) || 1080;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: outputPath, fullPage: true });

  console.log(`Screenshot saved to ${outputPath}`);

  await browser.close();
})();
