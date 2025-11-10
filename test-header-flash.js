const playwright = require('playwright');

(async () => {
  console.log('=== TESTING HEADER MENU FLASH ===\n');

  const browser = await playwright.firefox.launch({
    headless: true,
    slowMo: 0
  });

  const context = await browser.newContext();
  await context.clearCookies();
  const page = await context.newPage();

  console.log('Loading page... (WATCH THE HEADER)\n');

  const startTime = Date.now();
  await page.goto(`https://saabuildingblocks.pages.dev/?nocache=${Date.now()}`);

  // Get header menu information
  const headerInfo = await page.evaluate(() => {
    const menuItems = Array.from(document.querySelectorAll('header nav a, header nav button'));

    return menuItems.map(item => {
      const styles = window.getComputedStyle(item);
      return {
        text: item.textContent?.trim().substring(0, 30),
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        className: item.className,
        tagName: item.tagName,
      };
    });
  });

  console.log('=== MENU ITEMS ===');
  headerInfo.forEach((item, i) => {
    console.log(`\n${i + 1}. "${item.text}"`);
    console.log(`   Font: ${item.fontFamily}`);
    console.log(`   Size: ${item.fontSize}, Weight: ${item.fontWeight}`);
    console.log(`   Tag: ${item.tagName}, Class: ${item.className}`);
  });

  // Check if there are different font families
  const fonts = [...new Set(headerInfo.map(i => i.fontFamily))];
  console.log('\n=== FONTS USED ===');
  fonts.forEach(f => console.log(`- ${f}`));

  if (fonts.length > 1) {
    console.log('\n⚠️  MULTIPLE FONTS DETECTED - This could cause flash if fonts load at different times');
  }

  // Keep browser open to observe
  console.log('\n\nBrowser will stay open for 8 seconds so you can see the flash...\n');
  await page.waitForTimeout(8000);

  await browser.close();
})();
