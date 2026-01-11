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
  
  // Get info about the CyberCard elements
  const cardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.cyber-card-plate');
    const results = [];
    
    for (const card of cards) {
      const style = window.getComputedStyle(card);
      const content = card.querySelector('.cyber-card-content');
      const contentStyle = content ? window.getComputedStyle(content) : null;
      
      // Find the number text element
      const numberEl = card.querySelector('.text-h3, .text-h2');
      const numberStyle = numberEl ? window.getComputedStyle(numberEl) : null;
      
      results.push({
        cardOverflow: style.overflow,
        cardBorderRadius: style.borderRadius,
        contentPadding: contentStyle ? contentStyle.padding : null,
        contentPaddingTop: contentStyle ? contentStyle.paddingTop : null,
        numberTransform: numberStyle ? numberStyle.transform : null,
        numberText: numberEl ? numberEl.textContent : null
      });
    }
    
    return results;
  });
  
  console.log('Card Info:', JSON.stringify(cardInfo, null, 2));
  
  await browser.close();
})();
