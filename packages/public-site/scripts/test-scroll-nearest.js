const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // Test with explicit scroll(nearest) - the default
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        html, body { height: 100%; overflow: auto; }
        .hero { height: 100vh; background: blue; }
        .section { height: 100vh; background: red; }
        
        @keyframes fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }
        
        .hero {
          animation: fade-out linear both;
          animation-timeline: scroll(nearest);
          animation-range: 0px 600px;
        }
      </style>
    </head>
    <body>
      <div class="hero">Hero</div>
      <div class="section">Section</div>
      <div class="section">Section 2</div>
    </body>
    </html>
  `);
  
  await page.waitForTimeout(500);
  
  const before = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    return {
      transform: getComputedStyle(hero).transform,
      opacity: getComputedStyle(hero).opacity,
      timeline: getComputedStyle(hero).animationTimeline
    };
  });
  console.log('Before:', JSON.stringify(before, null, 2));
  
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);
  
  const after = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    return {
      scrollY: window.scrollY,
      transform: getComputedStyle(hero).transform,
      opacity: getComputedStyle(hero).opacity
    };
  });
  console.log('After 300px:', JSON.stringify(after, null, 2));
  
  await browser.close();
}

main().catch(console.error);
