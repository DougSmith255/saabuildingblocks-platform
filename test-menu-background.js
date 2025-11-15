const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://31.97.103.71/');
  await page.waitForLoadState('networkidle');
  
  // Check background before menu opens
  const beforeBg = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    return {
      background: computed.background,
      backgroundColor: computed.backgroundColor,
      backgroundImage: computed.backgroundImage,
      paddingRight: computed.paddingRight,
    };
  });
  
  console.log('BEFORE menu open:');
  console.log(JSON.stringify(beforeBg, null, 2));
  
  // Check if profile image is visible
  const profileImageBefore = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    if (!img) return { found: false };
    const computed = window.getComputedStyle(img);
    return {
      found: true,
      src: img.src,
      opacity: computed.opacity,
      display: computed.display,
    };
  });
  
  console.log('\nProfile image BEFORE:');
  console.log(JSON.stringify(profileImageBefore, null, 2));
  
  // Open menu
  await page.click('.hamburger');
  await page.waitForTimeout(1000);
  
  const afterBg = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    return {
      background: computed.background,
      backgroundColor: computed.backgroundColor,
      backgroundImage: computed.backgroundImage,
      paddingRight: computed.paddingRight,
    };
  });
  
  console.log('\nAFTER menu open:');
  console.log(JSON.stringify(afterBg, null, 2));
  
  const profileImageAfter = await page.evaluate(() => {
    const img = document.querySelector('.profile-image');
    if (!img) return { found: false };
    const computed = window.getComputedStyle(img);
    return {
      found: true,
      src: img.src,
      opacity: computed.opacity,
      display: computed.display,
    };
  });
  
  console.log('\nProfile image AFTER:');
  console.log(JSON.stringify(profileImageAfter, null, 2));
  
  await browser.close();
})();
