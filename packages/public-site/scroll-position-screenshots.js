const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'https://saabuildingblocks.pages.dev';
const OUTPUT_DIR = '/var/www/html/screenshots/scroll-debug';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function takeScrollScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-smooth-scrolling']
  });

  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const viewport of viewports) {
    console.log(`\n=== Testing ${viewport.name} (${viewport.width}x${viewport.height}) ===\n`);

    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    await page.evaluateOnNewDocument(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    });

    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 });
    await wait(4000);

    // Scroll to trigger lazy loading
    console.log('Scrolling to trigger lazy loading...');
    for (let i = 0; i < 30; i++) {
      await page.evaluate((scrollY) => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, i * 500);
      await wait(200);
    }

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(1000);

    // Find the exact pinning start positions by looking for ScrollTrigger data
    // We'll scroll incrementally and detect when elements become pinned

    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height: ${pageHeight}px`);

    // Find sections
    const sections = await page.evaluate(() => {
      const results = {};
      const h2Elements = document.querySelectorAll('h2');

      h2Elements.forEach(h2 => {
        const text = h2.textContent || '';

        if (text.includes('Built for Where Real Estate Is Going')) {
          let section = h2.closest('section');
          if (section) {
            results.builtForFuture = {
              top: section.getBoundingClientRect().top + window.scrollY,
              height: section.offsetHeight
            };
          }
        }

        if (text.includes('Why This Only Works at eXp')) {
          let section = h2.closest('section');
          if (section) {
            results.whyOnlyAtExp = {
              top: section.getBoundingClientRect().top + window.scrollY,
              height: section.offsetHeight
            };
          }
        }
      });

      return results;
    });

    console.log('Sections:', JSON.stringify(sections, null, 2));

    // For each section, scroll incrementally to find the exact pin start
    // and take a screenshot at that moment

    // === WHY ONLY AT EXP (Stacked Cards) - comes first on page ===
    if (sections.whyOnlyAtExp) {
      console.log('\n--- Finding WhyOnlyAtExp pin start ---');
      const sectionTop = sections.whyOnlyAtExp.top;

      // Start scrolling from before the section
      let pinStartScroll = null;

      for (let scrollPos = Math.max(0, sectionTop - viewport.height); scrollPos < sectionTop + viewport.height; scrollPos += 20) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollPos);
        await wait(100);

        // Check if the section is now pinned (position: fixed)
        const isPinned = await page.evaluate(() => {
          const sections = document.querySelectorAll('section');
          for (const section of sections) {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent.includes('Why This Only Works at eXp')) {
              const style = window.getComputedStyle(section);
              // GSAP adds pin-spacer and sets position fixed
              const trigger = section.closest('[data-scroll-trigger]') || section.parentElement;
              if (trigger) {
                const triggerStyle = window.getComputedStyle(trigger);
                return triggerStyle.position === 'fixed' || style.position === 'fixed';
              }
            }
          }
          return false;
        });

        if (isPinned && pinStartScroll === null) {
          pinStartScroll = scrollPos;
          console.log(`Pin starts at scroll: ${scrollPos}px`);
          break;
        }
      }

      // If we couldn't detect pin, estimate based on section position
      if (pinStartScroll === null) {
        // The current code uses 'top 40%'
        // This means pin starts when trigger top reaches 40% from viewport top
        pinStartScroll = sectionTop - (viewport.height * 0.40);
        console.log(`Estimated pin start at scroll: ${pinStartScroll}px (top 40%)`);
      }

      // Take screenshot at pin start
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pinStartScroll);
      await wait(500);

      // Draw a horizontal line at viewport center for reference
      await page.evaluate((vh) => {
        const line = document.createElement('div');
        line.id = 'center-line';
        line.style.cssText = `
          position: fixed;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: red;
          z-index: 99999;
          pointer-events: none;
        `;
        document.body.appendChild(line);
      }, viewport.height);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${viewport.name}-stacked-START.png`),
        fullPage: false
      });
      console.log(`Screenshot: ${viewport.name}-stacked-START.png at scroll ${pinStartScroll}px`);

      // Remove the line
      await page.evaluate(() => {
        const line = document.getElementById('center-line');
        if (line) line.remove();
      });
    }

    // === BUILT FOR FUTURE (Horizontal Cards) ===
    if (sections.builtForFuture) {
      console.log('\n--- Finding BuiltForFuture pin start ---');
      const sectionTop = sections.builtForFuture.top;

      // The current code uses 'top 10%' for mobile, 'top 20%' for desktop
      const startPercent = viewport.name === 'mobile' ? 0.10 : 0.20;
      const pinStartScroll = sectionTop - (viewport.height * startPercent);
      console.log(`Estimated pin start at scroll: ${pinStartScroll}px`);

      // Take screenshot at pin start
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pinStartScroll);
      await wait(500);

      // Draw a horizontal line at viewport center for reference
      await page.evaluate(() => {
        const line = document.createElement('div');
        line.id = 'center-line';
        line.style.cssText = `
          position: fixed;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: red;
          z-index: 99999;
          pointer-events: none;
        `;
        document.body.appendChild(line);
      });

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${viewport.name}-horizontal-START.png`),
        fullPage: false
      });
      console.log(`Screenshot: ${viewport.name}-horizontal-START.png at scroll ${pinStartScroll}px`);

      // Remove the line
      await page.evaluate(() => {
        const line = document.getElementById('center-line');
        if (line) line.remove();
      });
    }

    await page.close();
  }

  await browser.close();
  console.log('\n=== All screenshots complete ===');
  console.log(`View at: https://wp.saabuildingblocks.com/screenshots/scroll-debug/`);
}

takeScrollScreenshots().catch(console.error);
