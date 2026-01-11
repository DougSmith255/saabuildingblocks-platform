const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle0' });
  
  // Wait a bit for canvas to initialize
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if canvas exists and has dimensions
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { exists: false };
    
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas);
    const ctx = canvas.getContext('2d');
    
    return {
      exists: true,
      width: canvas.width,
      height: canvas.height,
      styleWidth: style.width,
      styleHeight: style.height,
      position: style.position,
      zIndex: style.zIndex,
      top: rect.top,
      left: rect.left,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      className: canvas.className,
      hasContext: !!ctx
    };
  });
  
  console.log('Canvas Info:', JSON.stringify(canvasInfo, null, 2));
  
  // Check body background
  const bodyBg = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    return {
      background: style.background,
      backgroundColor: style.backgroundColor
    };
  });
  
  console.log('Body Background:', JSON.stringify(bodyBg, null, 2));
  
  await browser.close();
})();
