const playwright = require('playwright');

(async () => {
  console.log('=== IMAGE LOAD TIMING TEST ===\n');

  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();

  const events = [];
  const startTime = Date.now();

  // Track all relevant events
  page.on('domcontentloaded', () => {
    events.push({ event: 'DOM_CONTENT_LOADED', time: Date.now() - startTime });
  });

  page.on('load', () => {
    events.push({ event: 'PAGE_LOAD', time: Date.now() - startTime });
  });

  console.log('Loading page...\n');
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Check image load status and animation immediately
  const imageCheck = await page.evaluate(() => {
    const wolfPackDiv = document.querySelector('.hero-animate-bg');
    const img = wolfPackDiv ? wolfPackDiv.querySelector('img') : null;

    return {
      divExists: !!wolfPackDiv,
      imgExists: !!img,
      imgSrc: img?.src || null,
      imgComplete: img?.complete || false,
      imgNaturalWidth: img?.naturalWidth || 0,
      divOpacity: wolfPackDiv ? window.getComputedStyle(wolfPackDiv).opacity : null,
      divAnimation: wolfPackDiv ? window.getComputedStyle(wolfPackDiv).animation : null,
    };
  });

  events.push({ event: 'INITIAL_CHECK', time: Date.now() - startTime, data: imageCheck });

  // Wait for networkidle
  await page.waitForLoadState('networkidle');
  events.push({ event: 'NETWORK_IDLE', time: Date.now() - startTime });

  // Check again after networkidle
  const afterNetworkIdle = await page.evaluate(() => {
    const wolfPackDiv = document.querySelector('.hero-animate-bg');
    const img = wolfPackDiv ? wolfPackDiv.querySelector('img') : null;

    return {
      imgComplete: img?.complete || false,
      imgNaturalWidth: img?.naturalWidth || 0,
      divOpacity: wolfPackDiv ? window.getComputedStyle(wolfPackDiv).opacity : null,
    };
  });

  events.push({ event: 'AFTER_NETWORK_IDLE', time: Date.now() - startTime, data: afterNetworkIdle });

  console.log('=== TIMELINE ===\n');
  events.forEach(e => {
    console.log(`${e.time}ms: ${e.event}`);
    if (e.data) {
      console.log(JSON.stringify(e.data, null, 2));
    }
  });

  console.log('\n=== ANALYSIS ===');
  if (!imageCheck.imgExists) {
    console.log('⚠️  NO IMAGE FOUND in .hero-animate-bg div!');
  } else if (!imageCheck.imgComplete) {
    console.log('⚠️  Image exists but was NOT loaded at initial check');
    console.log(`    Image loaded by network idle: ${afterNetworkIdle.imgComplete}`);
    console.log('🔍 POTENTIAL ISSUE: Image loads AFTER animation starts');
  } else {
    console.log('✅ Image was already loaded at initial check');
  }

  await browser.close();
})();
