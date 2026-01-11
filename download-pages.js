const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
  { url: 'https://saabuildingblocks.pages.dev/', file: '/tmp/correct-deployment/homepage.html' },
  { url: 'https://saabuildingblocks.pages.dev/exp-commission-calculator/', file: '/tmp/correct-deployment/commission-calculator.html' },
  { url: 'https://saabuildingblocks.pages.dev/exp-realty-revenue-share-calculator/', file: '/tmp/correct-deployment/revshare-calculator.html' },
  { url: 'https://saabuildingblocks.pages.dev/doug-smart', file: '/tmp/correct-deployment/doug-smart.html' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const page of pages) {
    console.log('Fetching:', page.url);
    const p = await browser.newPage();
    await p.goto(page.url, { waitUntil: 'networkidle0', timeout: 30000 });
    const html = await p.content();
    fs.writeFileSync(page.file, html);
    console.log('Saved:', page.file, '- Size:', html.length);
    await p.close();
  }

  await browser.close();
  console.log('Done!');
})();
