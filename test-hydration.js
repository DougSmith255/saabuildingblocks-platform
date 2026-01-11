const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect console messages
  const logs = [];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message}));

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 3000));

  console.log('=== All console errors ===');
  logs.filter(l => l.type === 'error' || l.type === 'pageerror').forEach(l => console.log(l.type + ':', l.text));

  console.log('\n=== React/Hydration related ===');
  const reactErrors = logs.filter(l =>
    l.text.includes('Hydration') ||
    l.text.includes('hydrat') ||
    l.text.includes('418') ||
    l.text.includes('423') ||
    l.text.includes('React') ||
    l.type === 'error' ||
    l.type === 'pageerror'
  );
  reactErrors.forEach(l => console.log(l.type + ':', l.text));

  // Check if React hydrated
  const hydrationStatus = await page.evaluate(() => {
    const hasNextData = !!document.getElementById('__NEXT_DATA__');
    const hasReactRoot = !!document.querySelector('[data-reactroot]') || !!document.querySelector('#__next');

    // Try to find React fiber on range input
    const rangeInput = document.querySelector('input[type="range"]');
    let hasFiber = false;
    let fiberKeys = [];
    if (rangeInput) {
      for (const key in rangeInput) {
        if (key.startsWith('__react')) {
          hasFiber = true;
          fiberKeys.push(key);
        }
      }
    }

    return { hasNextData, hasReactRoot, hasFiber, fiberKeys };
  });

  console.log('\n=== Hydration Status ===');
  console.log(JSON.stringify(hydrationStatus, null, 2));

  await browser.close();
})();
