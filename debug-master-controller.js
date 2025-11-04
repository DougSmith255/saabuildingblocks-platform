/**
 * Debug script to load Master Controller and capture console errors
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // Capture failed requests
  const failedRequests = [];
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure()
    });
  });

  console.log('🔍 Loading Master Controller page...\n');

  try {
    // Set auth cookie (if needed)
    await page.setExtraHTTPHeaders({
      'Authorization': 'Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy'
    });

    // Navigate to Master Controller
    await page.goto('https://saabuildingblocks.com/master-controller', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait a bit for React to hydrate
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take screenshot
    await page.screenshot({ path: '/home/claude-flow/master-controller-debug.png', fullPage: true });

    // Get page content
    const content = await page.content();

    // Check for specific elements
    const hasTypographyTab = await page.$('.text-lg.font-semibold.text-\\[\\#e5e4dd\\]');
    const hasTextTypeCards = await page.$$('.p-6.rounded-lg.bg-\\[\\#404040\\]\\/30');

    console.log('📊 Debug Results:\n');
    console.log('✓ Page loaded successfully');
    console.log(`✓ Screenshot saved to: /home/claude-flow/master-controller-debug.png`);
    console.log(`✓ Typography tab found: ${hasTypographyTab ? 'YES' : 'NO'}`);
    console.log(`✓ Text type cards found: ${hasTextTypeCards.length} cards`);
    console.log('\n📝 Console Messages:');
    consoleMessages.forEach(msg => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });

    console.log('\n❌ Page Errors:');
    if (pageErrors.length === 0) {
      console.log('  (none)');
    } else {
      pageErrors.forEach(err => {
        console.log(`  ${err.message}`);
        if (err.stack) console.log(`    ${err.stack.substring(0, 200)}...`);
      });
    }

    console.log('\n🚫 Failed Requests:');
    if (failedRequests.length === 0) {
      console.log('  (none)');
    } else {
      failedRequests.forEach(req => {
        console.log(`  ${req.url} - ${req.failure}`);
      });
    }

    // Check if page has React error boundary
    const errorBoundaryText = await page.evaluate(() => {
      const body = document.body.innerText;
      if (body.includes('Error') || body.includes('crashed')) {
        return body.substring(0, 500);
      }
      return null;
    });

    if (errorBoundaryText) {
      console.log('\n⚠️  Error Boundary Detected:');
      console.log(errorBoundaryText);
    }

  } catch (error) {
    console.error('❌ Failed to load page:', error.message);
  } finally {
    await browser.close();
  }
})();
