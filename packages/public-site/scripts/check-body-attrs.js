const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const body = document.body;
    const hero = document.querySelector('main#main-content > section:first-child');
    
    // Get ALL computed animation properties on hero
    const heroStyle = getComputedStyle(hero);
    
    // Check if there's any inline style overriding
    return {
      bodyDataAttrs: Array.from(body.attributes).filter(a => a.name.startsWith('data-')).map(a => ({ name: a.name, value: a.value })),
      bodyClass: body.className,
      heroInlineStyle: hero.getAttribute('style'),
      heroComputedAnimation: {
        animation: heroStyle.animation,
        animationName: heroStyle.animationName,
        animationDuration: heroStyle.animationDuration,
        animationTimeline: heroStyle.animationTimeline,
        animationRange: heroStyle.animationRange,
        animationPlayState: heroStyle.animationPlayState,
        animationDelay: heroStyle.animationDelay
      },
      // Check for will-change which might create a new stacking context
      heroWillChange: heroStyle.willChange,
      heroZIndex: heroStyle.zIndex,
      // Check if animation is being applied from @supports
      supportsAnimationTimeline: CSS.supports('animation-timeline: view()')
    };
  });
  
  console.log(JSON.stringify(info, null, 2));
  
  await browser.close();
}

main().catch(console.error);
