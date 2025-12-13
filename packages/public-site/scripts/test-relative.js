const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('file:///tmp/view-test-relative.html');
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    const section = document.querySelector('.tall-section');
    const style = getComputedStyle(section);
    return {
      position: style.position,
      opacity: style.opacity,
      transform: style.transform,
      top: section.getBoundingClientRect().top
    };
  });
  
  console.log('With position:relative at scroll 0:', JSON.stringify(data, null, 2));
  
  await browser.close();
}

main().catch(console.error);
