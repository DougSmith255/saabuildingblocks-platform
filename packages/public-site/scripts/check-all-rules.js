const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const info = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    const style = getComputedStyle(hero);
    
    // Get all animation-related properties
    const animProps = {};
    for (let prop of style) {
      if (prop.startsWith('animation')) {
        animProps[prop] = style.getPropertyValue(prop);
      }
    }
    
    // Check if keyframe exists
    let keyframeExists = false;
    try {
      for (let sheet of document.styleSheets) {
        try {
          for (let rule of sheet.cssRules) {
            if (rule.name === 'hero-scroll-out') {
              keyframeExists = true;
            }
          }
        } catch(e) {}
      }
    } catch(e) {}
    
    return {
      animProps,
      keyframeExists,
      // Check if animation is being overridden
      animShorthand: style.animation,
      // Double check selector matching
      selectorTest: {
        hasMain: !!document.querySelector('main#main-content'),
        hasSection: !!document.querySelector('main#main-content > section'),
        isFirstChild: hero === document.querySelector('main#main-content > section:first-child'),
        bodyHasNoAttr: !document.body.hasAttribute('data-no-section-transitions')
      }
    };
  });
  
  console.log(JSON.stringify(info, null, 2));
  
  await browser.close();
}

main().catch(console.error);
