const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Track script loading
  const failedScripts = [];
  page.on('requestfailed', request => {
    if (request.resourceType() === 'script') {
      failedScripts.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    }
  });

  // Track all requests
  const loadedScripts = [];
  page.on('response', response => {
    if (response.url().endsWith('.js')) {
      loadedScripts.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  console.log('Failed scripts:', failedScripts);
  console.log('\nLoaded scripts (first 10):', loadedScripts.slice(0, 10));
  console.log('Total scripts loaded:', loadedScripts.length);

  // Check for non-200 responses
  const errorScripts = loadedScripts.filter(s => s.status !== 200);
  console.log('\nScripts with errors:', errorScripts);

  await browser.close();
})();
