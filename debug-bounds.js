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
  
  // Get bounding boxes
  const boundInfo = await page.evaluate(() => {
    const numberEl = document.querySelector('.text-h3');
    const cardPlate = document.querySelector('.cyber-card-plate');
    const cardContent = document.querySelector('.cyber-card-content');
    
    if (!numberEl || !cardPlate) return { error: 'Elements not found' };
    
    const numberRect = numberEl.getBoundingClientRect();
    const plateRect = cardPlate.getBoundingClientRect();
    const contentRect = cardContent.getBoundingClientRect();
    
    const numberStyle = window.getComputedStyle(numberEl);
    
    return {
      number: {
        top: numberRect.top,
        bottom: numberRect.bottom,
        height: numberRect.height,
        text: numberEl.textContent,
        fontSize: numberStyle.fontSize,
        lineHeight: numberStyle.lineHeight,
        transform: numberStyle.transform
      },
      cardPlate: {
        top: plateRect.top,
        bottom: plateRect.bottom,
        height: plateRect.height
      },
      cardContent: {
        top: contentRect.top,
        bottom: contentRect.bottom, 
        paddingTop: window.getComputedStyle(cardContent).paddingTop
      },
      gapFromNumberTopToCardTop: numberRect.top - plateRect.top,
      gapFromNumberTopToContentTop: numberRect.top - contentRect.top
    };
  });
  
  console.log('Bounding info:', JSON.stringify(boundInfo, null, 2));
  
  await browser.close();
})();
