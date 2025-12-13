const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Scroll in small increments from 0 to 800
  for (let pos = 0; pos <= 800; pos += 100) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(200);

    const state = await page.evaluate(() => {
      const section = document.querySelectorAll('main#main-content > section')[1];
      const rect = section.getBoundingClientRect();
      const style = getComputedStyle(section);
      return {
        scrollY: window.scrollY,
        sectionTop: Math.round(rect.top),
        viewportH: window.innerHeight,
        opacity: parseFloat(style.opacity).toFixed(3)
      };
    });

    console.log('scroll=' + state.scrollY + ': top=' + state.sectionTop + ', opacity=' + state.opacity);
  }

  await browser.close();
}

main().catch(console.error);
