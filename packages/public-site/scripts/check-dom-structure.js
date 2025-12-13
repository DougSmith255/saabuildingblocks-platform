const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get the DOM path from body to section 2
  const domPath = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    const path = [];
    let el = section;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      path.unshift({
        tag: el.tagName,
        id: el.id || null,
        overflow: style.overflow,
        position: style.position
      });
      el = el.parentElement;
    }
    return path;
  });

  console.log('DOM path to section 2:', JSON.stringify(domPath, null, 2));
  
  await browser.close();
}

main().catch(console.error);
