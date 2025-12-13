const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('file:///tmp/view-test-tall.html');
  await page.waitForTimeout(500);

  // Test at various scroll positions
  const positions = [0, 300, 600, 900, 1200];
  
  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(300);
    
    const state = await page.evaluate(() => {
      const section = document.querySelector('.tall-section');
      const style = getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      return {
        opacity: parseFloat(style.opacity).toFixed(2),
        transform: style.transform,
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: rect.height
      };
    });
    
    console.log(`Scroll ${pos}px: opacity=${state.opacity}, top=${state.top}, bottom=${state.bottom}`);
  }
  
  await browser.close();
}

main().catch(console.error);
