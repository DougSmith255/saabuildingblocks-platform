const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('file:///tmp/view-test.html');
  await page.waitForTimeout(500);

  // Test at various scroll positions
  const positions = [0, 300, 600, 900];
  
  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(300);
    
    const state = await page.evaluate(() => {
      const sections = document.querySelectorAll('.section');
      return Array.from(sections).map((s, i) => {
        const style = getComputedStyle(s);
        const rect = s.getBoundingClientRect();
        return {
          index: i,
          opacity: parseFloat(style.opacity).toFixed(2),
          transform: style.transform.substring(0, 40),
          top: Math.round(rect.top)
        };
      });
    });
    
    console.log(`\nScroll ${pos}px:`);
    state.forEach(s => console.log(`  Section ${s.index}: opacity=${s.opacity}, top=${s.top}`));
  }
  
  await browser.close();
}

main().catch(console.error);
