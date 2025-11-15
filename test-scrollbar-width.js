const { chromium, firefox, webkit } = require('playwright');

async function testScrollbarWidth(browserType, browserName) {
  console.log('\n========== Testing ' + browserName + ' ==========');
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ 
    ignoreHTTPSErrors: true,
    viewport: { width: 1200, height: 800 }
  });
  const page = await context.newPage();
  
  // Create a test page with scrollable content
  await page.setContent(`
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; }
          .scrollable {
            width: 500px;
            height: 300px;
            overflow-y: scroll;
            border: 2px solid red;
          }
          .content {
            height: 1000px;
            background: linear-gradient(white, gray);
          }
        </style>
      </head>
      <body>
        <h1>Default Scrollbar Width Test</h1>
        <div class="scrollable">
          <div class="content">Long content to trigger scrollbar</div>
        </div>
      </body>
    </html>
  `);
  
  await page.waitForTimeout(500);
  
  // Measure scrollbar width
  const scrollbarWidth = await page.evaluate(() => {
    const div = document.querySelector('.scrollable');
    return div.offsetWidth - div.clientWidth;
  });
  
  console.log('Default scrollbar width:', scrollbarWidth + 'px');
  
  await browser.close();
  return scrollbarWidth;
}

(async () => {
  const chromiumWidth = await testScrollbarWidth(chromium, 'Chromium');
  const firefoxWidth = await testScrollbarWidth(firefox, 'Firefox');
  const webkitWidth = await testScrollbarWidth(webkit, 'WebKit');
  
  console.log('\n========== Summary ==========');
  console.log('Chromium default scrollbar width:', chromiumWidth + 'px');
  console.log('Firefox default scrollbar width:', firefoxWidth + 'px');
  console.log('WebKit default scrollbar width:', webkitWidth + 'px');
})();
