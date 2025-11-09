const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');

async function testBrowser(browserType, browserName) {
  console.log(`\n========== Testing in ${browserName} ==========`);

  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console logs
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Navigate to the site
  try {
    await page.goto('https://saabuildingblocks.pages.dev', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
  } catch (error) {
    console.log(`Warning: ${error.message}`);
  }

  // Wait a moment for animations to potentially start
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({
    path: `/home/claude-flow/screenshot-images-${browserName}.png`,
    fullPage: true
  });

  // Check hero section image animations
  const imageInfo = await page.evaluate(() => {
    const results = {};

    // Check profile image (img tag)
    const profileImg = document.querySelector('img[alt*="Doug and Karrie"]');
    if (profileImg) {
      const computed = window.getComputedStyle(profileImg);
      results.profileImage = {
        found: true,
        src: profileImg.src.substring(0, 80) + '...',
        opacity: computed.opacity,
        animation: computed.animation,
        classList: Array.from(profileImg.classList),
        visibility: computed.visibility,
        display: computed.display
      };
    } else {
      results.profileImage = { found: false };
    }

    // Check hero-animate-bg wrapper (wolf pack)
    const bgWrapper = document.querySelector('.hero-animate-bg');
    if (bgWrapper) {
      const computed = window.getComputedStyle(bgWrapper);
      results.wolfPackBg = {
        found: true,
        hasClass: true,
        opacity: computed.opacity,
        animation: computed.animation,
        backgroundImage: computed.backgroundImage.substring(0, 80) + '...',
        visibility: computed.visibility
      };
    } else {
      results.wolfPackBg = { found: false };
    }

    // Check hero-animate-profile wrapper
    const profileWrapper = document.querySelector('.hero-animate-profile');
    if (profileWrapper) {
      const computed = window.getComputedStyle(profileWrapper);
      results.profileWrapper = {
        found: true,
        hasClass: true,
        opacity: computed.opacity,
        animation: computed.animation,
        visibility: computed.visibility
      };
    } else {
      results.profileWrapper = { found: false };
    }

    // Check all img tags on page
    const allImages = document.querySelectorAll('img');
    results.totalImages = allImages.length;
    results.imagesSample = Array.from(allImages).slice(0, 3).map(img => {
      const computed = window.getComputedStyle(img);
      return {
        src: img.src.substring(0, 60) + '...',
        opacity: computed.opacity,
        animation: computed.animation,
        classList: Array.from(img.classList)
      };
    });

    return results;
  });

  console.log(`\n📸 Image Animation Info:`);
  console.log(JSON.stringify(imageInfo, null, 2));

  console.log(`\n📝 Console Logs (${consoleLogs.length} total):`,
    consoleLogs.slice(0, 10).join('\n'));

  await browser.close();

  return {
    browser: browserName,
    imageInfo,
    consoleLogs: consoleLogs.slice(0, 10)
  };
}

(async () => {
  try {
    const results = {};

    // Test in Chromium
    results.chromium = await testBrowser(chromium, 'chromium');

    // Test in Firefox
    results.firefox = await testBrowser(firefox, 'firefox');

    // Test in WebKit (Safari)
    results.webkit = await testBrowser(webkit, 'webkit');

    // Save results to JSON
    fs.writeFileSync(
      '/home/claude-flow/image-animation-test-results.json',
      JSON.stringify(results, null, 2)
    );

    console.log('\n\n========== SUMMARY ==========');
    console.log('✓ All tests complete!');
    console.log('✓ Screenshots saved for all browsers');
    console.log('✓ Results saved to image-animation-test-results.json');

  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  }
})();
