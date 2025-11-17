const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('=== CHECKING PROFILE IMAGE IN FIREFOX ===\n');

  const imageInfo = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    if (!img) return { found: false };
    
    return {
      found: true,
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentWidth: img.width,
      currentHeight: img.height,
      classList: img.className,
      hasAnimateClass: img.classList.contains('animate-in'),
      opacity: window.getComputedStyle(img).opacity,
      display: window.getComputedStyle(img).display
    };
  });

  console.log('Profile image info:', JSON.stringify(imageInfo, null, 2));

  if (imageInfo.found && !imageInfo.complete) {
    console.log('\n⚠️  Image found but not loaded');
  } else if (imageInfo.found && imageInfo.naturalWidth === 0) {
    console.log('\n❌ Image failed to load (naturalWidth is 0)');
  } else if (imageInfo.found) {
    console.log('\n✅ Image loaded successfully');
  } else {
    console.log('\n❌ Image element not found');
  }

  await page.screenshot({ path: '/tmp/firefox-profile-image.png' });
  console.log('\nScreenshot saved: /tmp/firefox-profile-image.png');

  await browser.close();
})();
