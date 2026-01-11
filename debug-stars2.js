const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle0' });
  
  // Wait for animation to start
  await new Promise(r => setTimeout(r, 3000));
  
  // Check if canvas has any non-transparent pixels drawn
  const canvasData = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'No canvas' };
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return { error: 'No context' };
    
    // Sample the canvas at various points
    const samples = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Sample 100 random points
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) { // If alpha > 0
        samples.push({ x, y, r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] });
      }
    }
    
    // Also get full image data stats
    const fullData = ctx.getImageData(0, 0, width, height).data;
    let nonTransparentPixels = 0;
    for (let i = 3; i < fullData.length; i += 4) {
      if (fullData[i] > 0) nonTransparentPixels++;
    }
    
    return {
      canvasWidth: width,
      canvasHeight: height,
      totalPixels: width * height,
      nonTransparentPixels,
      sampleHits: samples.length,
      samples: samples.slice(0, 5) // Just show first 5
    };
  });
  
  console.log('Canvas Data:', JSON.stringify(canvasData, null, 2));
  
  await browser.close();
})();
