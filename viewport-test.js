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
    // Get profile image
    const profileImage = document.querySelector('img[alt*="profile" i], img[alt*="avatar" i], .profile-image, header img, main img');

    // Get H1
    const h1 = document.querySelector('h1');

    // Get tagline (usually p after h1 or with specific class)
    const tagline = document.querySelector('h1 + p, .tagline, .subtitle, h1 ~ p');

    // Get button group (look for multiple buttons or button container)
    const buttons = document.querySelectorAll('button, a[role="button"], .button');
    const buttonContainer = buttons[0]?.closest('div, nav') || buttons[0]?.parentElement;

    // Calculate measurements
    const profileRect = profileImage?.getBoundingClientRect();
    const h1Rect = h1?.getBoundingClientRect();
    const taglineRect = tagline?.getBoundingClientRect();

    let buttonGroupHeight = 0;
    let buttonBottom = 0;

    if (buttons.length > 0) {
      const buttonRects = Array.from(buttons).map(btn => btn.getBoundingClientRect());
      const topMost = Math.min(...buttonRects.map(r => r.top));
      const bottomMost = Math.max(...buttonRects.map(r => r.bottom));
      buttonGroupHeight = bottomMost - topMost;
      buttonBottom = bottomMost;
    }

    // Calculate spacing
    const profileToH1 = profileRect && h1Rect ? h1Rect.top - profileRect.bottom : null;
    const foldClearance = buttonBottom ? window.innerHeight - buttonBottom : null;
    const buttonsVisible = buttonBottom ? buttonBottom <= window.innerHeight : false;

    // Calculate content height percentage
    const contentTop = profileRect?.top || h1Rect?.top || 0;
    const contentBottom = buttonBottom || h1Rect?.bottom || 0;
    const contentHeight = contentBottom - contentTop;
    const viewportOccupancy = (contentHeight / window.innerHeight) * 100;

    return {
      profileImageHeight: profileRect?.height || 0,
      profileImageWidth: profileRect?.width || 0,
      profileToH1Spacing: profileToH1,
      h1Height: h1Rect?.height || 0,
      taglineHeight: taglineRect?.height || 0,
      buttonGroupHeight,
      foldClearance,
      buttonsVisible,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      contentHeight,
      viewportOccupancy: viewportOccupancy.toFixed(1),
      // Get computed styles
      profileImageStyles: profileImage ? {
        maxWidth: window.getComputedStyle(profileImage).maxWidth,
        maxHeight: window.getComputedStyle(profileImage).maxHeight,
        width: window.getComputedStyle(profileImage).width,
        height: window.getComputedStyle(profileImage).height
      } : null
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

  return results;
}

runTests().catch(console.error);
