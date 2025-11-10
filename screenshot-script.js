const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenSizes = [
  { name: 'mobile-iphone-se', width: 375, height: 667 },
  { name: 'mobile-iphone-12', width: 390, height: 844 },
  { name: 'tablet-ipad', width: 768, height: 1024 },
  { name: 'desktop-laptop', width: 1280, height: 720 },
  { name: 'desktop-standard', width: 1920, height: 1080 },
  { name: 'desktop-large', width: 2560, height: 1440 }
];

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotDir = '/home/claude-flow/screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  for (const size of screenSizes) {
    console.log(`Taking screenshot: ${size.name} (${size.width}x${size.height})`);

    const page = await browser.newPage();
    await page.setViewport({ width: size.width, height: size.height });

    try {
      await page.goto('http://localhost:3001', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForSelector('h1', { timeout: 10000 });

      const screenshotPath = path.join(screenshotDir, `${size.name}-after.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false // Only above the fold
      });

      console.log(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.error(`Error taking screenshot for ${size.name}:`, error.message);
    }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots completed!');
}

takeScreenshots().catch(console.error);
