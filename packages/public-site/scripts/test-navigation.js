const { chromium } = require('playwright');

const URL = 'https://saabuildingblocks.pages.dev/';

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Track navigation events
  let navigationCount = 0;
  let lastNavigationType = '';

  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      navigationCount++;
      console.log(`Navigation #${navigationCount}: ${frame.url()}`);
    }
  });

  console.log(`\nNavigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle' });
  console.log('Initial page loaded\n');

  // Reset counter after initial load
  navigationCount = 0;

  // Test 1: Check if __headerSlideInPlayed flag is set
  const flagSet = await page.evaluate(() => {
    return window.__headerSlideInPlayed;
  });
  console.log(`__headerSlideInPlayed flag after initial load: ${flagSet}`);

  // Test 2: Find and click internal links, observe navigation type
  const testLinks = [
    { selector: 'a[href="/join"]', name: 'Get Started Now' },
    { selector: 'a[href="/webinar"]', name: 'Watch Free Webinar' },
  ];

  // First, let's see what links exist on the page
  const allLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href^="/"]');
    return Array.from(links).map(a => ({
      href: a.getAttribute('href'),
      text: a.textContent?.trim().substring(0, 50),
      tagName: a.tagName,
      className: a.className.substring(0, 100)
    }));
  });

  console.log('\n=== Internal links on page ===');
  allLinks.slice(0, 20).forEach(link => {
    console.log(`  ${link.href}: "${link.text}"`);
  });

  // Check the CTAButton and SecondaryButton rendered HTML
  console.log('\n=== Checking button components ===');

  // Find the "Get Started Now" button in FinalCTA
  const ctaButton = await page.evaluate(() => {
    const buttons = document.querySelectorAll('a');
    for (const btn of buttons) {
      if (btn.textContent?.includes('Get Started Now')) {
        return {
          tagName: btn.tagName,
          href: btn.getAttribute('href'),
          text: btn.textContent?.trim(),
          hasNextLinkDataAttribute: btn.hasAttribute('data-next-link'),
          className: btn.className.substring(0, 200),
          outerHTML: btn.outerHTML.substring(0, 500)
        };
      }
    }
    return null;
  });

  console.log('\nGet Started Now button:', JSON.stringify(ctaButton, null, 2));

  // Find the "Watch Free Webinar" button
  const webinarButton = await page.evaluate(() => {
    const buttons = document.querySelectorAll('a');
    for (const btn of buttons) {
      if (btn.textContent?.includes('Watch Free Webinar')) {
        return {
          tagName: btn.tagName,
          href: btn.getAttribute('href'),
          text: btn.textContent?.trim(),
          hasNextLinkDataAttribute: btn.hasAttribute('data-next-link'),
          className: btn.className.substring(0, 200),
          outerHTML: btn.outerHTML.substring(0, 500)
        };
      }
    }
    return null;
  });

  console.log('\nWatch Free Webinar button:', JSON.stringify(webinarButton, null, 2));

  // Test 3: Click an internal link and check if it's a client-side nav or full reload
  console.log('\n=== Testing navigation ===');

  // Set a marker in window to detect full page reload
  await page.evaluate(() => {
    window.__testNavigationMarker = 'set_before_click';
  });

  // Find a link to /join (with or without trailing slash)
  const joinLink = await page.$('a[href="/join/"]') || await page.$('a[href="/join"]');
  if (joinLink) {
    console.log('\nClicking /join link...');

    // Track if this is client-side or full reload
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => null),
      joinLink.click()
    ]);

    // Check if marker still exists (client-side nav preserves it, full reload loses it)
    const markerAfterNav = await page.evaluate(() => {
      return window.__testNavigationMarker;
    });

    if (markerAfterNav === 'set_before_click') {
      console.log('✅ CLIENT-SIDE NAVIGATION: Window marker preserved');
    } else {
      console.log('❌ FULL PAGE RELOAD: Window marker was lost');
    }

    // Check if header slide-in flag is still set
    const flagAfterNav = await page.evaluate(() => {
      return window.__headerSlideInPlayed;
    });
    console.log(`__headerSlideInPlayed after navigation: ${flagAfterNav}`);

    // Check current URL
    console.log(`Current URL: ${page.url()}`);
  } else {
    console.log('No /join link found');
  }

  await browser.close();
  console.log('\nTest complete!');
}

main().catch(console.error);
