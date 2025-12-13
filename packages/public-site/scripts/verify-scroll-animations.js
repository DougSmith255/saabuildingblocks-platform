const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/tmp/scroll-animation-screenshots';
const URL = 'https://saabuildingblocks.pages.dev/';

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 400, height: 300 }  // Very small viewport for tiny screenshots
  });

  const page = await context.newPage();

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Wait for animations to initialize
  await page.waitForTimeout(2000);

  // Screenshot 1: Initial state (top of page)
  console.log('Taking screenshot 1: Initial state (top)...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-initial-top.jpg'), fullPage: false, quality: 30, type: 'jpeg' });

  // Check DOM structure first
  console.log('\nChecking DOM structure...');
  const domInfo = await page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainContent = document.querySelector('main#main-content');
    const sections = mainContent ? mainContent.querySelectorAll(':scope > section') : [];
    const firstSection = sections[0];
    const secondSection = sections[1];

    // Check computed styles
    const firstSectionStyles = firstSection ? getComputedStyle(firstSection) : null;
    const secondSectionStyles = secondSection ? getComputedStyle(secondSection) : null;

    // Get the actual CSS rules that apply
    let cssRules = [];
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText && rule.cssText.includes('hero-scroll-out')) {
              cssRules.push(rule.cssText.substring(0, 200));
            }
            if (rule.cssText && rule.cssText.includes('section-scroll-in')) {
              cssRules.push(rule.cssText.substring(0, 200));
            }
          }
        } catch (e) {
          // Cross-origin stylesheet
        }
      }
    } catch (e) {}

    return {
      mainCount: mains.length,
      mainIds: Array.from(mains).map(m => m.id || '(no id)'),
      mainContentExists: !!mainContent,
      directChildSections: sections.length,
      firstSectionTag: firstSection?.tagName,
      firstSectionAnimation: firstSectionStyles?.animation || 'none',
      firstSectionAnimationName: firstSectionStyles?.animationName || 'none',
      firstSectionAnimationTimeline: firstSectionStyles?.animationTimeline || 'auto',
      firstSectionTransform: firstSectionStyles?.transform || 'none',
      firstSectionOpacity: firstSectionStyles?.opacity || '1',
      secondSectionAnimation: secondSectionStyles?.animation || 'none',
      secondSectionAnimationName: secondSectionStyles?.animationName || 'none',
      secondSectionAnimationTimeline: secondSectionStyles?.animationTimeline || 'auto',
      supportsScrollTimeline: CSS.supports('animation-timeline: view()'),
      bodyAttributes: {
        noSectionTransitions: document.body.hasAttribute('data-no-section-transitions'),
        heroOnlyTransitions: document.body.hasAttribute('data-hero-only-transitions')
      },
      cssRulesFound: cssRules.length,
      cssRulesSample: cssRules.slice(0, 3)
    };
  });

  console.log('DOM Structure:', JSON.stringify(domInfo, null, 2));

  // Screenshot 2: Scroll 50% of viewport
  console.log('\nScrolling 50% of viewport...');
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02-scroll-50pct.jpg'), quality: 30, type: 'jpeg' });

  // Check hero section transform after scrolling
  const heroStylesAfterScroll1 = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    if (!hero) return null;
    const styles = getComputedStyle(hero);
    return {
      transform: styles.transform,
      opacity: styles.opacity,
      animationName: styles.animationName,
      animationTimeline: styles.animationTimeline,
      animationPlayState: styles.animationPlayState
    };
  });
  console.log('Hero styles after 50% scroll:', heroStylesAfterScroll1);

  // Screenshot 3: Scroll 100% of viewport
  console.log('\nScrolling to 100% of viewport...');
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-scroll-100pct.jpg'), quality: 30, type: 'jpeg' });

  // Check hero section transform after scrolling more
  const heroStylesAfterScroll2 = await page.evaluate(() => {
    const hero = document.querySelector('main#main-content > section:first-child');
    if (!hero) return null;
    const styles = getComputedStyle(hero);
    return {
      transform: styles.transform,
      opacity: styles.opacity
    };
  });
  console.log('Hero styles after 100% scroll:', heroStylesAfterScroll2);

  // Screenshot 4: Scroll to second section
  console.log('\nScrolling to second section...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-second-section.jpg'), quality: 30, type: 'jpeg' });

  // Check second section styles
  const secondSectionStyles = await page.evaluate(() => {
    const section = document.querySelector('main#main-content > section:nth-child(2)');
    if (!section) return null;
    const styles = getComputedStyle(section);
    return {
      transform: styles.transform,
      opacity: styles.opacity,
      animationName: styles.animationName,
      animationTimeline: styles.animationTimeline
    };
  });
  console.log('Second section styles:', secondSectionStyles);

  // Screenshot 5: Further scroll to see more content
  console.log('\nScrolling further...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05-further-scroll.jpg'), quality: 30, type: 'jpeg' });

  await browser.close();

  console.log(`\n\nScreenshots saved to: ${OUTPUT_DIR}`);
  console.log('Files:');
  fs.readdirSync(OUTPUT_DIR).forEach(file => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, file));
    console.log(`  - ${file} (${Math.round(stat.size / 1024)}KB)`);
  });

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Main elements count: ${domInfo.mainCount} (should be 1)`);
  console.log(`main#main-content exists: ${domInfo.mainContentExists}`);
  console.log(`Direct child sections: ${domInfo.directChildSections}`);
  console.log(`Browser supports scroll-timeline: ${domInfo.supportsScrollTimeline}`);
  console.log(`First section animation-name: ${domInfo.firstSectionAnimationName}`);
  console.log(`First section animation-timeline: ${domInfo.firstSectionAnimationTimeline}`);
  console.log(`CSS rules found with animation names: ${domInfo.cssRulesFound}`);

  if (domInfo.firstSectionAnimationName === 'none' || domInfo.firstSectionAnimationName === '') {
    console.log('\n** WARNING: Animation name is "none" - CSS @keyframes may not be applied **');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
