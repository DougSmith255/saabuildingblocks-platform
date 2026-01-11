const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Collect page errors (uncaught exceptions)
  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait for potential lazy loading
  await new Promise(r => setTimeout(r, 5000));

  console.log('=== PAGE ERRORS (uncaught exceptions) ===');
  pageErrors.forEach(e => console.log(e));

  console.log('\n=== CONSOLE ERRORS ===');
  consoleMessages.filter(m => m.type === 'error').forEach(m => {
    console.log(`${m.text}`);
    if (m.location && m.location.url) {
      console.log(`  at ${m.location.url}:${m.location.lineNumber}`);
    }
  });

  console.log('\n=== CONSOLE WARNINGS ===');
  consoleMessages.filter(m => m.type === 'warning').forEach(m => {
    console.log(`${m.text.substring(0, 200)}`);
  });

  // Check React hydration status
  const reactStatus = await page.evaluate(() => {
    // Check for React internal fiber
    const rootElement = document.body.firstElementChild;
    if (rootElement) {
      const reactKey = Object.keys(rootElement).find(key => key.startsWith('__react'));
      return {
        hasReactFiber: !!reactKey,
        reactKey: reactKey || 'none',
        hasNextData: typeof window.__NEXT_DATA__ !== 'undefined',
        rootTagName: rootElement.tagName,
        rootId: rootElement.id || 'none'
      };
    }
    return { error: 'No root element' };
  });

  console.log('\n=== REACT STATUS ===');
  console.log(reactStatus);

  await browser.close();
})();
