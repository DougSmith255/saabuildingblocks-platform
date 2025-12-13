const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const section2Info = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    if (!section) return { error: 'No second section found' };
    
    const style = getComputedStyle(section);
    return {
      tagName: section.tagName,
      className: section.className,
      // All animation-related properties
      animation: {
        name: style.animationName,
        timeline: style.animationTimeline,
        range: style.animationRange,
        fillMode: style.animationFillMode,
        playState: style.animationPlayState,
        delay: style.animationDelay
      },
      // Current visual state
      visual: {
        opacity: style.opacity,
        transform: style.transform
      },
      // Potential overriding properties
      overrides: {
        willChange: style.willChange,
        contain: style.contain,
        contentVisibility: style.contentVisibility
      },
      // Element position
      position: {
        top: section.getBoundingClientRect().top,
        height: section.getBoundingClientRect().height
      }
    };
  });

  console.log('Section 2 details:', JSON.stringify(section2Info, null, 2));
  
  await browser.close();
}

main().catch(console.error);
