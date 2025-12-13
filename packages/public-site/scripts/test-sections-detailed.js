const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check animation states at various scroll positions
  const positions = [0, 300, 600, 900, 1200];
  
  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(300);
    
    const state = await page.evaluate(() => {
      const sections = document.querySelectorAll('main#main-content > section');
      const results = [];
      
      for (let i = 0; i < Math.min(3, sections.length); i++) {
        const section = sections[i];
        const style = getComputedStyle(section);
        const rect = section.getBoundingClientRect();
        results.push({
          index: i,
          opacity: style.opacity,
          transform: style.transform.substring(0, 30),
          top: Math.round(rect.top),
          inViewport: rect.top < window.innerHeight && rect.bottom > 0
        });
      }
      
      return {
        scrollY: window.scrollY,
        sections: results
      };
    });
    
    console.log(`\nAt scroll ${pos}px:`);
    state.sections.forEach(s => {
      console.log(`  Section ${s.index}: opacity=${s.opacity}, transform=${s.transform}, top=${s.top}, inView=${s.inViewport}`);
    });
  }
  
  await browser.close();
}

main().catch(console.error);
