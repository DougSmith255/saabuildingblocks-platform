const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 800 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: '/tmp/homepage-hero.jpg', quality: 50, type: 'jpeg' });
  
  // Check if RevealMaskEffect is rendering
  const effectExists = await page.evaluate(() => {
    const effects = document.querySelectorAll('.absolute.inset-0.pointer-events-none');
    return effects.length;
  });
  
  console.log('Found effect divs:', effectExists);
  
  await browser.close();
}

main().catch(console.error);
