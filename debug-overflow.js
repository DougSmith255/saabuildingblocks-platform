const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/best-real-estate-brokerage/?t=' + Date.now(), { 
    waitUntil: 'networkidle0' 
  });
  
  // Scroll to load lazy sections
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 500));
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Check overflow on all ancestors of the number element
  const overflowInfo = await page.evaluate(() => {
    const numberEl = document.querySelector('.text-h3');
    if (!numberEl) return { error: 'No number element found' };
    
    const results = [];
    let el = numberEl;
    
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      results.push({
        tag: el.tagName,
        className: (el.className || '').substring(0, 60),
        overflow: style.overflow,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        clipPath: style.clipPath,
        clip: style.clip,
        borderRadius: style.borderRadius
      });
      el = el.parentElement;
    }
    
    return results;
  });
  
  console.log('Overflow chain:', JSON.stringify(overflowInfo, null, 2));
  
  await browser.close();
})();
