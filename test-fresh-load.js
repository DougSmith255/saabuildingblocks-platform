const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext({
    // Force fresh load, no cache
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  
  // Clear all cache and cookies
  await context.clearCookies();
  
  // Add cache-busting to URL
  const timestamp = Date.now();
  await page.goto(`https://saabuildingblocks.pages.dev/?t=${timestamp}`, { 
    waitUntil: 'networkidle',
  });
  
  // Get the wolf pack CSS directly from computed styles
  const wolfPackInfo = await page.evaluate(() => {
    const wolfPack = document.querySelector('.hero-animate-bg');
    if (!wolfPack) return { error: 'Element not found' };
    
    const styles = window.getComputedStyle(wolfPack);
    
    // Also check the source CSS file content
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => link.href);
    
    return {
      computedStyles: {
        animation: styles.animation,
        animationDelay: styles.animationDelay,
        animationDuration: styles.animationDuration,
        opacity: styles.opacity,
      },
      cssLinks: cssLinks,
      innerHTML: wolfPack.innerHTML.substring(0, 200),
    };
  });
  
  console.log('=== FRESH PAGE LOAD (bypassing cache) ===\n');
  console.log(JSON.stringify(wolfPackInfo, null, 2));
  
  // Now fetch the actual CSS file content
  if (wolfPackInfo.cssLinks && wolfPackInfo.cssLinks.length > 0) {
    console.log('\n=== Checking CSS file content ===');
    for (const cssLink of wolfPackInfo.cssLinks) {
      if (cssLink.includes('layout.css') || cssLink.includes('app')) {
        const cssContent = await page.evaluate(async (url) => {
          const response = await fetch(url);
          const text = await response.text();
          
          // Find hero-animate-bg rule
          const bgMatch = text.match(/\.hero-animate-bg[^}]+}/);
          const keyframeMatch = text.match(/@keyframes bgZoom2025[^}]+}[^}]*}/);
          
          return {
            url: url,
            hasBgRule: !!bgMatch,
            bgRule: bgMatch ? bgMatch[0] : null,
            hasKeyframe: !!keyframeMatch,
            keyframe: keyframeMatch ? keyframeMatch[0] : null,
          };
        }, cssLink);
        
        if (cssContent.hasBgRule || cssContent.hasKeyframe) {
          console.log(JSON.stringify(cssContent, null, 2));
        }
      }
    }
  }
  
  await browser.close();
})();
