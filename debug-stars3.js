const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Check stacking order - what elements have z-index
  const stackingInfo = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const stackingElements = [];
    
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const zIndex = style.zIndex;
      const position = style.position;
      
      // Only care about positioned elements with z-index
      if (position !== 'static' && zIndex !== 'auto') {
        const rect = el.getBoundingClientRect();
        stackingElements.push({
          tag: el.tagName,
          className: el.className.substring(0, 50),
          zIndex: parseInt(zIndex),
          position,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          background: style.backgroundColor
        });
      }
    });
    
    // Sort by z-index
    stackingElements.sort((a, b) => a.zIndex - b.zIndex);
    
    return stackingElements.filter(e => e.zIndex <= 0 || e.height > 100);
  });
  
  console.log('Stacking elements (negative or large):', JSON.stringify(stackingInfo, null, 2));
  
  await browser.close();
})();
