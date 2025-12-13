const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('=== Testing Scroll-Timeline CSS on saabuildingblocks.pages.dev ===\n');
  
  // Navigate to the site
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  // Check browser version
  const userAgent = await page.evaluate(() => navigator.userAgent);
  console.log('Browser User Agent:', userAgent);
  
  // Check if animation-timeline is supported
  const animationTimelineSupported = await page.evaluate(() => {
    return CSS.supports('animation-timeline', 'view()');
  });
  console.log('\n@supports (animation-timeline: view()):', animationTimelineSupported);
  
  // Check if the body has the data attribute
  const bodyDataAttr = await page.evaluate(() => {
    return {
      hasNoTransitions: document.body.hasAttribute('data-no-section-transitions'),
      hasHeroOnly: document.body.hasAttribute('data-hero-only-transitions')
    };
  });
  console.log('\nBody data attributes:', bodyDataAttr);
  
  // Find all sections in main
  const sectionInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return { error: 'No main element found' };
    
    const sections = main.querySelectorAll('section');
    const results = [];
    
    sections.forEach((section, index) => {
      const computedStyle = window.getComputedStyle(section);
      results.push({
        index,
        tagName: section.tagName,
        className: section.className.substring(0, 100),
        animationName: computedStyle.animationName,
        animationTimeline: computedStyle.animationTimeline,
        animationRange: computedStyle.animationRange,
        transform: computedStyle.transform,
        opacity: computedStyle.opacity,
        willChange: computedStyle.willChange,
        isDirectChild: section.parentElement === main
      });
    });
    
    return { sectionCount: sections.length, sections: results };
  });
  
  console.log('\n=== Section Analysis ===');
  console.log('Total sections found:', sectionInfo.sectionCount);
  
  if (sectionInfo.sections) {
    sectionInfo.sections.forEach((s, i) => {
      console.log(`\nSection ${i}:`);
      console.log('  Direct child of main:', s.isDirectChild);
      console.log('  animation-name:', s.animationName);
      console.log('  animation-timeline:', s.animationTimeline);
      console.log('  animation-range:', s.animationRange);
      console.log('  transform:', s.transform);
      console.log('  opacity:', s.opacity);
      console.log('  will-change:', s.willChange);
    });
  }
  
  // Check for the keyframes definition
  const keyframesFound = await page.evaluate(() => {
    const styleSheets = document.styleSheets;
    let found = false;
    let keyframeDetails = null;
    
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].type === CSSRule.KEYFRAMES_RULE && rules[j].name === 'section-depth-transition') {
            found = true;
            keyframeDetails = rules[j].cssText.substring(0, 500);
            break;
          }
        }
      } catch (e) {
        // CORS error, skip
      }
      if (found) break;
    }
    
    return { found, details: keyframeDetails };
  });
  
  console.log('\n=== Keyframes Check ===');
  console.log('@keyframes section-depth-transition found:', keyframesFound.found);
  if (keyframesFound.details) {
    console.log('Keyframe definition (first 500 chars):', keyframesFound.details);
  }
  
  // Check the actual CSS rules applied
  const cssRulesCheck = await page.evaluate(() => {
    const styleSheets = document.styleSheets;
    let scrollTimelineRules = [];
    
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.cssText && rule.cssText.includes('animation-timeline')) {
            scrollTimelineRules.push(rule.cssText.substring(0, 300));
          }
        }
      } catch (e) {
        // CORS error, skip
      }
    }
    
    return scrollTimelineRules;
  });
  
  console.log('\n=== CSS Rules with animation-timeline ===');
  cssRulesCheck.forEach((rule, i) => {
    console.log(`Rule ${i}:`, rule);
  });
  
  // Test scrolling and check if transforms change
  console.log('\n=== Scroll Test ===');
  
  // Get initial transform of first section
  const initialState = await page.evaluate(() => {
    const section = document.querySelector('main section');
    if (!section) return null;
    const style = window.getComputedStyle(section);
    return {
      transform: style.transform,
      opacity: style.opacity
    };
  });
  console.log('Initial state (before scroll):', initialState);
  
  // Scroll down
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);
  
  const afterScroll1 = await page.evaluate(() => {
    const section = document.querySelector('main section');
    if (!section) return null;
    const style = window.getComputedStyle(section);
    return {
      transform: style.transform,
      opacity: style.opacity,
      scrollY: window.scrollY
    };
  });
  console.log('After scrolling 1000px:', afterScroll1);
  
  // Scroll more
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(500);
  
  const afterScroll2 = await page.evaluate(() => {
    const section = document.querySelector('main section');
    if (!section) return null;
    const style = window.getComputedStyle(section);
    return {
      transform: style.transform,
      opacity: style.opacity,
      scrollY: window.scrollY
    };
  });
  console.log('After scrolling 2000px:', afterScroll2);
  
  await browser.close();
  console.log('\n=== Test Complete ===');
})();
