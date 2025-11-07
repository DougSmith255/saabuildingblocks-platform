const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to https://saabuildingblocks.pages.dev...');
  await page.goto('https://saabuildingblocks.pages.dev', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Get detailed CSS cascade information
  const detailedInfo = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');

    for (const el of allElements) {
      const inlineStyle = el.getAttribute('style');
      if (inlineStyle && inlineStyle.includes('clamp') && inlineStyle.includes('75px')) {
        const computedStyle = window.getComputedStyle(el);

        // Get all matched CSS rules
        const matchedRules = [];
        const sheets = Array.from(document.styleSheets);

        try {
          for (const sheet of sheets) {
            try {
              const rules = Array.from(sheet.cssRules || []);
              for (const rule of rules) {
                if (rule.style && rule.style.fontSize) {
                  // Check if this rule applies to our element
                  try {
                    if (el.matches(rule.selectorText)) {
                      matchedRules.push({
                        selector: rule.selectorText,
                        fontSize: rule.style.fontSize,
                        priority: rule.style.getPropertyPriority('font-size'),
                        cssText: rule.cssText.substring(0, 200)
                      });
                    }
                  } catch (e) {
                    // Invalid selector
                  }
                }
              }
            } catch (e) {
              // CORS or other errors
            }
          }
        } catch (e) {
          console.error('Error reading stylesheets');
        }

        return {
          tagName: el.tagName,
          textContent: el.textContent.trim().substring(0, 50),
          inlineStyle: inlineStyle,
          computedFontSize: computedStyle.fontSize,
          computedFontFamily: computedStyle.fontFamily,
          classList: Array.from(el.classList),
          id: el.id,
          parentElement: {
            tagName: el.parentElement?.tagName,
            classList: Array.from(el.parentElement?.classList || []),
            id: el.parentElement?.id
          },
          matchedCSSRules: matchedRules,
          // Check if element is inside agent-counter-wrapper
          hasCounterWrapper: !!el.closest('.agent-counter-wrapper'),
          // Get the actual element hierarchy
          hierarchy: (() => {
            const path = [];
            let current = el;
            while (current && current.tagName !== 'BODY') {
              path.unshift({
                tag: current.tagName,
                classes: Array.from(current.classList),
                id: current.id
              });
              current = current.parentElement;
            }
            return path;
          })()
        };
      }
    }

    return null;
  });

  console.log('\n=== DETAILED COUNTER INSPECTION (Desktop 1920x1080) ===');
  console.log(JSON.stringify(detailedInfo, null, 2));

  await browser.close();
})();
