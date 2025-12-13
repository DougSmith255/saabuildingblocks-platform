const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check the actual DOM structure and if view() is being applied
  const debug = await page.evaluate(() => {
    const main = document.querySelector('main#main-content');
    const hero = main?.querySelector('section:first-child');
    
    if (!hero) return { error: 'No hero section found' };
    
    const heroStyles = getComputedStyle(hero);
    const mainStyles = getComputedStyle(main);
    
    // Check for overflow: hidden which can break view()
    let parent = hero.parentElement;
    const parentOverflows = [];
    while (parent) {
      const style = getComputedStyle(parent);
      parentOverflows.push({
        tag: parent.tagName,
        id: parent.id,
        overflow: style.overflow,
        overflowY: style.overflowY,
        position: style.position,
        contain: style.contain
      });
      parent = parent.parentElement;
    }
    
    return {
      heroTag: hero.tagName,
      heroId: hero.id,
      heroClass: hero.className,
      heroAnimation: heroStyles.animation,
      heroAnimationName: heroStyles.animationName,
      heroAnimationTimeline: heroStyles.animationTimeline,
      heroOverflow: heroStyles.overflow,
      heroPosition: heroStyles.position,
      heroContain: heroStyles.contain,
      mainOverflow: mainStyles.overflow,
      mainPosition: mainStyles.position,
      parentOverflows
    };
  });

  console.log(JSON.stringify(debug, null, 2));
  
  await browser.close();
}

main().catch(console.error);
