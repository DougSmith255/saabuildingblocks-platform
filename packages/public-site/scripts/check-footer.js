const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 800, height: 500 } });

  console.log('Navigating to production site...');
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight + 1000));
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: '/tmp/footer-wide.jpg', quality: 40, type: 'jpeg' });

  // Check icon visibility and positions
  const iconInfo = await page.evaluate(() => {
    const links = document.querySelectorAll('footer .link');
    const logo = document.querySelector('footer .footer-logo');
    const logoContainer = document.querySelector('footer .footer-logo-container');

    return {
      iconCount: links.length,
      icons: Array.from(links).map(link => {
        const rect = link.getBoundingClientRect();
        const style = getComputedStyle(link);
        return {
          href: link.getAttribute('href'),
          visible: rect.width > 0 && rect.height > 0,
          inViewport: rect.left >= 0 && rect.right <= window.innerWidth,
          position: { left: rect.left, right: rect.right, width: rect.width },
          backgroundImage: style.backgroundImage?.substring(0, 50)
        };
      }),
      logoPosition: logo ? {
        textAlign: getComputedStyle(logo).textAlign,
        display: getComputedStyle(logo).display,
        justifyContent: getComputedStyle(logo).justifyContent
      } : null,
      logoContainerPosition: logoContainer ? {
        margin: getComputedStyle(logoContainer).margin,
        display: getComputedStyle(logoContainer).display,
        justifyContent: getComputedStyle(logoContainer).justifyContent
      } : null
    };
  });

  console.log('Icon info:', JSON.stringify(iconInfo, null, 2));
  console.log('\nScreenshot saved to /tmp/footer-wide.jpg');

  await browser.close();
}

main().catch(console.error);
