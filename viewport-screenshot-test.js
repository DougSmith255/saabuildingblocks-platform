const { chromium } = require('playwright');
const fs = require('fs');

const viewports = [
  { width: 375, height: 667, name: 'mobile-375' },
  { width: 414, height: 896, name: 'mobile-414' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 1280, height: 800, name: 'desktop-1280' },
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 1920, height: 1080, name: 'desktop-1920' },
  { width: 2560, height: 1440, name: 'desktop-2560' }
];

async function captureAndMeasure(page, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({
    path: `/home/claude-flow/screenshot-${viewport.name}.png`,
    fullPage: false
  });

  // Get detailed layout information
  const layoutInfo = await page.evaluate(() => {
    const getElementInfo = (selector, description) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      return {
        description,
        selector,
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        bottom: Math.round(rect.bottom),
        position: styles.position,
        display: styles.display,
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom
      };
    };

    // Find all major layout elements
    const header = getElementInfo('header, nav, [class*="header"], [class*="nav"]', 'Header/Nav');
    const main = getElementInfo('main, [class*="hero"], [class*="container"]', 'Main Container');
    const profileImg = getElementInfo('img', 'Profile Image');
    const h1 = getElementInfo('h1', 'H1 Title');
    const tagline = getElementInfo('h1 + p, p', 'Tagline');

    // Get all buttons/links
    const buttons = Array.from(document.querySelectorAll('a, button')).map((el, idx) => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      return {
        index: idx,
        text: el.textContent?.trim().substring(0, 30),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        position: styles.position
      };
    }).filter(b => b.width > 0 && b.height > 0);

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      elements: {
        header,
        main,
        profileImg,
        h1,
        tagline
      },
      buttons,
      scrollY: window.scrollY
    };
  });

  return { viewport: viewport.name, ...layoutInfo };
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const viewport of viewports) {
    console.log(`Capturing ${viewport.name}...`);
    const result = await captureAndMeasure(page, viewport);
    results.push(result);
  }

  await browser.close();

  // Save detailed results
  fs.writeFileSync(
    '/home/claude-flow/viewport-layout-analysis.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\nLayout analysis saved to viewport-layout-analysis.json');
  console.log('Screenshots saved as screenshot-*.png');

  // Print summary
  results.forEach(r => {
    console.log(`\n${r.viewport}:`);
    console.log(`  Profile Image: ${r.elements.profileImg?.height}px (top: ${r.elements.profileImg?.top}px)`);
    console.log(`  H1: ${r.elements.h1?.height}px (top: ${r.elements.h1?.top}px)`);
    console.log(`  Spacing (img→h1): ${r.elements.h1?.top - (r.elements.profileImg?.top + r.elements.profileImg?.height)}px`);
    console.log(`  Buttons found: ${r.buttons.length}`);
    if (r.buttons.length > 0) {
      console.log(`  First button position: ${r.buttons[0].position} (top: ${r.buttons[0].top}px)`);
    }
  });

  return results;
}

runTests().catch(console.error);
