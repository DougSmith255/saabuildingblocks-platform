const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  // Get all stylesheets
  const cssRules = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    let wolfPackRule = null;
    let bgZoomKeyframe = null;
    
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes('hero-animate-bg')) {
            wolfPackRule = {
              selector: rule.selectorText,
              cssText: rule.cssText,
              animation: rule.style.animation,
              animationDelay: rule.style.animationDelay,
              animationDuration: rule.style.animationDuration,
            };
          }
          if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'bgZoom2025') {
            bgZoomKeyframe = {
              name: rule.name,
              cssText: rule.cssText,
            };
          }
        }
      } catch (e) {
        // Skip CORS stylesheets
      }
    }
    
    return { wolfPackRule, bgZoomKeyframe };
  });
  
  console.log('=== DEPLOYED CSS ===\n');
  console.log('Wolf Pack Rule:');
  console.log(JSON.stringify(cssRules.wolfPackRule, null, 2));
  console.log('\nBgZoom Keyframe:');
  console.log(JSON.stringify(cssRules.bgZoomKeyframe, null, 2));
  
  await browser.close();
})();
