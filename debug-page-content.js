const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'Authorization': 'Basic YnVpbGRlcl91c2VyOks4bU4jQnVpbGQ3JFEy'
  });

  console.log('Loading page...\n');

  await page.goto('https://saabuildingblocks.com/master-controller', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Get the page text content
  const bodyText = await page.evaluate(() => document.body.innerText);

  console.log('=== PAGE TEXT CONTENT ===');
  console.log(bodyText.substring(0, 2000));
  console.log('\n=== END ===');

  await browser.close();
})();
