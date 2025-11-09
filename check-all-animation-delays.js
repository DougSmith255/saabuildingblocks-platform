const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  const allAnimations = await page.evaluate(() => {
    const elements = [
      { name: 'Wolf Pack', selector: '.hero-animate-bg' },
      { name: 'Profile Wrapper', selector: '.hero-animate-profile' },
      { name: 'Profile Image', selector: '.profile-image' },
      { name: 'H1', selector: 'h1.hero-entrance-animate' },
      { name: 'Tagline', selector: '.hero-tagline-mobile-spacing' },
      { name: 'Button 1', selector: 'a[href*="join"]' },
      { name: 'Button 2', selector: 'a[href*="learn"]' },
    ];
    
    return elements.map(({ name, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return { name, error: 'Not found' };
      
      // Check if it's wrapped in hero-entrance-animate
      const wrapper = el.closest('.hero-entrance-animate');
      const targetEl = wrapper || el;
      
      const styles = window.getComputedStyle(targetEl);
      return {
        name,
        element: targetEl.tagName + (targetEl.className ? '.' + targetEl.className.split(' ')[0] : ''),
        animationDelay: styles.animationDelay,
        animationDuration: styles.animationDuration,
        currentOpacity: styles.opacity,
      };
    });
  });
  
  console.log('=== ALL ANIMATION DELAYS ===\n');
  allAnimations.forEach(anim => {
    console.log(JSON.stringify(anim, null, 2));
  });
  
  await browser.close();
})();
