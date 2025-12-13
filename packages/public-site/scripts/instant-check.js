const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  // Add event listener before navigation
  page.on('console', msg => {
    if (msg.text().includes('ANIM')) {
      console.log('PAGE:', msg.text());
    }
  });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'domcontentloaded' });
  
  // Inject observer immediately
  await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    if (section) {
      console.log('ANIM: Initial opacity =', getComputedStyle(section).opacity);
      
      // Watch for animation events
      section.addEventListener('animationstart', () => console.log('ANIM: animationstart fired'));
      section.addEventListener('animationend', () => console.log('ANIM: animationend fired'));
      section.addEventListener('animationiteration', () => console.log('ANIM: animationiteration fired'));
    }
  });

  await page.waitForTimeout(3000);
  
  const finalState = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    return {
      opacity: getComputedStyle(section).opacity
    };
  });
  
  console.log('Final opacity:', finalState.opacity);
  
  await browser.close();
}

main().catch(console.error);
