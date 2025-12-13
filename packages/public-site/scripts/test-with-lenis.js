const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  // Use a wider viewport to trigger Lenis (it's disabled on narrow/mobile)
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check Lenis status
  const lenisStatus = await page.evaluate(() => {
    return {
      lenisClass: document.documentElement.classList.contains('lenis'),
      windowLenis: typeof window.lenis !== 'undefined'
    };
  });
  console.log('Lenis status (desktop viewport):', JSON.stringify(lenisStatus));

  // Test scroll with mouse wheel (how Lenis intercepts)
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500); // Lenis animates slowly

  const afterWheel = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    return {
      scrollY: window.scrollY,
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('After mouse wheel scroll:', JSON.stringify(afterWheel, null, 2));

  await page.screenshot({ path: '/tmp/desktop-scroll.jpg', quality: 40, type: 'jpeg' });

  await browser.close();
}

main().catch(console.error);
