const { chromium } = require('playwright');

const viewports = [
  { width: 375, height: 667, name: 'Mobile 375px' },
  { width: 414, height: 896, name: 'Mobile 414px' },
  { width: 768, height: 1024, name: 'Tablet 768px' },
  { width: 1280, height: 800, name: 'Desktop 1280px' },
  { width: 1440, height: 900, name: 'Desktop 1440px' },
  { width: 1920, height: 1080, name: 'Desktop 1920px' },
  { width: 2560, height: 1440, name: 'Desktop 2560px' }
];

async function measureViewport(page, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  // Wait for animations to complete
  await page.waitForTimeout(5000);

  const measurements = await page.evaluate(() => {
    // Try to find all main elements
    const allImages = Array.from(document.querySelectorAll('img'));
    const allH1s = Array.from(document.querySelectorAll('h1'));
    const allParagraphs = Array.from(document.querySelectorAll('p'));
    const allButtons = Array.from(document.querySelectorAll('button, a[class*="button"], a[role="button"]'));

    // Get the main container
    const main = document.querySelector('main, .container, .hero, [class*="hero"]');

    // Find profile image (likely the first/largest image)
    const profileImage = allImages.find(img => {
      const rect = img.getBoundingClientRect();
      return rect.width > 100 && rect.height > 100;
    }) || allImages[0];

    // Get H1
    const h1 = allH1s[0];

    // Get tagline (first paragraph after h1 or visible paragraph)
    const tagline = allParagraphs.find(p => {
      const rect = p.getBoundingClientRect();
      return rect.height > 0 && rect.width > 0;
    });

    // Get all visible buttons
    const visibleButtons = allButtons.filter(btn => {
      const rect = btn.getBoundingClientRect();
      return rect.height > 0 && rect.width > 0;
    });

    // Calculate measurements
    const profileRect = profileImage?.getBoundingClientRect();
    const h1Rect = h1?.getBoundingClientRect();
    const taglineRect = tagline?.getBoundingClientRect();
    const mainRect = main?.getBoundingClientRect();

    let buttonGroupTop = Infinity;
    let buttonGroupBottom = 0;
    let buttonGroupHeight = 0;

    if (visibleButtons.length > 0) {
      visibleButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        buttonGroupTop = Math.min(buttonGroupTop, rect.top);
        buttonGroupBottom = Math.max(buttonGroupBottom, rect.bottom);
      });
      buttonGroupHeight = buttonGroupBottom - buttonGroupTop;
    }

    // Calculate spacing between elements
    const profileToH1 = (profileRect && h1Rect) ? h1Rect.top - profileRect.bottom : null;
    const h1ToTagline = (h1Rect && taglineRect) ? taglineRect.top - h1Rect.bottom : null;
    const taglineToButtons = (taglineRect && buttonGroupTop !== Infinity) ? buttonGroupTop - taglineRect.bottom : null;
    const foldClearance = buttonGroupBottom ? window.innerHeight - buttonGroupBottom : null;
    const buttonsVisible = buttonGroupBottom ? buttonGroupBottom <= window.innerHeight : false;

    // Calculate total content height
    const contentTop = Math.min(
      profileRect?.top ?? Infinity,
      h1Rect?.top ?? Infinity,
      mainRect?.top ?? Infinity
    );
    const contentBottom = Math.max(
      buttonGroupBottom || 0,
      h1Rect?.bottom || 0,
      profileRect?.bottom || 0
    );
    const contentHeight = contentBottom - contentTop;
    const viewportOccupancy = (contentHeight / window.innerHeight) * 100;

    // Determine scroll position
    const needsScroll = contentBottom > window.innerHeight;

    return {
      profileImageHeight: Math.round(profileRect?.height || 0),
      profileImageWidth: Math.round(profileRect?.width || 0),
      profileImageTop: Math.round(profileRect?.top || 0),

      h1Height: Math.round(h1Rect?.height || 0),
      h1Top: Math.round(h1Rect?.top || 0),

      taglineHeight: Math.round(taglineRect?.height || 0),
      taglineTop: Math.round(taglineRect?.top || 0),

      buttonGroupHeight: Math.round(buttonGroupHeight),
      buttonGroupTop: buttonGroupTop !== Infinity ? Math.round(buttonGroupTop) : null,
      buttonGroupBottom: Math.round(buttonGroupBottom),

      // Spacing measurements
      profileToH1Spacing: profileToH1 !== null ? Math.round(profileToH1) : null,
      h1ToTaglineSpacing: h1ToTagline !== null ? Math.round(h1ToTagline) : null,
      taglineToButtonsSpacing: taglineToButtons !== null ? Math.round(taglineToButtons) : null,
      foldClearance: foldClearance !== null ? Math.round(foldClearance) : null,

      // Visibility
      buttonsVisible,
      needsScroll,

      // Viewport info
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      contentHeight: Math.round(contentHeight),
      viewportOccupancy: viewportOccupancy.toFixed(1) + '%',

      // Element counts for debugging
      imageCount: allImages.length,
      h1Count: allH1s.length,
      paragraphCount: allParagraphs.length,
      buttonCount: visibleButtons.length,

      // Profile image computed styles
      profileImageComputedWidth: profileImage ? window.getComputedStyle(profileImage).width : null,
      profileImageComputedMaxWidth: profileImage ? window.getComputedStyle(profileImage).maxWidth : null,
    };
  });

  return { ...viewport, ...measurements };
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const viewport of viewports) {
    console.log(`Testing ${viewport.name}...`);
    const result = await measureViewport(page, viewport);
    results.push(result);
  }

  await browser.close();

  // Output results as JSON for parsing
  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  // Create a formatted table
  console.log('\n=== FORMATTED TABLE ===');
  console.log('Viewport | Profile Img | Profile→H1 | H1 Height | Tagline | H1→Tagline | Buttons | Tagline→Btns | Fold Clear | Visible | Content % |');
  console.log('---------|-------------|------------|-----------|---------|------------|---------|--------------|------------|---------|-----------|');
  results.forEach(r => {
    console.log(
      `${r.name.padEnd(20)} | ${r.profileImageHeight}px (${r.profileImageWidth}px) | ` +
      `${r.profileToH1Spacing !== null ? r.profileToH1Spacing + 'px' : 'N/A'} | ` +
      `${r.h1Height}px | ${r.taglineHeight}px | ` +
      `${r.h1ToTaglineSpacing !== null ? r.h1ToTaglineSpacing + 'px' : 'N/A'} | ` +
      `${r.buttonGroupHeight}px | ` +
      `${r.taglineToButtonsSpacing !== null ? r.taglineToButtonsSpacing + 'px' : 'N/A'} | ` +
      `${r.foldClearance !== null ? r.foldClearance + 'px' : 'N/A'} | ` +
      `${r.buttonsVisible ? 'Yes' : 'No'} | ${r.viewportOccupancy} |`
    );
  });

  return results;
}

runTests().catch(console.error);
