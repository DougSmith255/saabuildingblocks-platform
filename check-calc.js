const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect ALL console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 3000));

  console.log('All console messages:');
  consoleMessages.forEach(m => {
    console.log(`[${m.type}] ${m.text.substring(0, 300)}`);
  });

  // Check if window.__NEXT_DATA__ exists
  const hasNextData = await page.evaluate(() => {
    return typeof window.__NEXT_DATA__ !== 'undefined';
  });
  console.log('\nHas __NEXT_DATA__:', hasNextData);

  // Check if React is on the page
  const hasReact = await page.evaluate(() => {
    return typeof window.React !== 'undefined' ||
           document.querySelector('[data-reactroot]') !== null ||
           document.querySelector('#__next') !== null;
  });
  console.log('Has React markers:', hasReact);

  await browser.close();
})();
