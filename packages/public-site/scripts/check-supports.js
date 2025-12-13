const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Test if @supports is matching
  const supportsInfo = await page.evaluate(() => {
    return {
      supportsScroll: CSS.supports('animation-timeline: scroll()'),
      supportsView: CSS.supports('animation-timeline: view()'),
      testElement: (() => {
        const div = document.createElement('div');
        div.style.animationTimeline = 'view()';
        return div.style.animationTimeline;
      })()
    };
  });

  console.log('Browser support:', JSON.stringify(supportsInfo, null, 2));
  
  // Check the computed animation on section 2
  const section2Anim = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    const style = getComputedStyle(section);
    
    // Get ALL animation properties
    const animProps = {};
    for (const prop of style) {
      if (prop.startsWith('animation')) {
        animProps[prop] = style.getPropertyValue(prop);
      }
    }
    return animProps;
  });
  
  console.log('\nSection 2 animation properties:', JSON.stringify(section2Anim, null, 2));
  
  await browser.close();
}

main().catch(console.error);
