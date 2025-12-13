const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check for any styles that might be setting opacity
  const cssRulesSettingOpacity = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    const results = [];
    
    // Check all stylesheets
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.style && rule.style.opacity) {
            // Check if this rule applies to our section
            try {
              if (section.matches(rule.selectorText)) {
                results.push({
                  selector: rule.selectorText,
                  opacity: rule.style.opacity
                });
              }
            } catch(e) {}
          }
        }
      } catch(e) {}
    }
    
    return results;
  });

  console.log('CSS rules setting opacity on section 2:', JSON.stringify(cssRulesSettingOpacity, null, 2));
  
  // Also check inline styles
  const inlineStyle = await page.evaluate(() => {
    const section = document.querySelectorAll('main#main-content > section')[1];
    return section.getAttribute('style');
  });
  console.log('\nInline style:', inlineStyle);
  
  await browser.close();
}

main().catch(console.error);
