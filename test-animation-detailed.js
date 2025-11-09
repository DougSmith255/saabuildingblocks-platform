const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();

  await page.goto('https://saabuildingblocks.pages.dev', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Doug and Karrie"]');
    if (!img) return { found: false };

    const computed = window.getComputedStyle(img);

    // Check if keyframes exist
    const rules = Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules || []);
      } catch (e) {
        return [];
      }
    });

    const imgFadeInKeyframe = rules.find(rule =>
      rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'imgFadeIn'
    );

    return {
      found: true,
      opacity: computed.opacity,
      animation: computed.animation,
      animationName: computed.animationName,
      animationDuration: computed.animationDuration,
      animationDelay: computed.animationDelay,
      animationFillMode: computed.animationFillMode,
      animationPlayState: computed.animationPlayState,
      willChange: computed.willChange,
      keyframeExists: !!imgFadeInKeyframe,
      keyframeRules: imgFadeInKeyframe ? Array.from(imgFadeInKeyframe.cssRules).map(r => r.cssText) : null,
      // Check inline style
      inlineStyle: img.getAttribute('style')
    };
  });

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
