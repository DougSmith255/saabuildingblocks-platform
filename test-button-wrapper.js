const playwright = require('playwright');

(async () => {
  const browser = await playwright.firefox.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://saabuildingblocks.pages.dev/', { waitUntil: 'networkidle' });
  
  const buttonData = await page.evaluate(() => {
    // Find button wrappers with hero-entrance-animate class
    const buttonWrappers = document.querySelectorAll('.hero-entrance-animate');
    
    return Array.from(buttonWrappers).map((wrapper, i) => {
      const styles = window.getComputedStyle(wrapper);
      const link = wrapper.querySelector('a');
      
      return {
        index: i,
        className: wrapper.className,
        href: link ? link.href : 'no link',
        animationDuration: styles.animationDuration,
        animationDelay: styles.animationDelay,
        animation: styles.animation,
      };
    });
  });
  
  console.log('Button Wrappers Found:', buttonData.length);
  buttonData.forEach(btn => {
    console.log(JSON.stringify(btn, null, 2));
  });
  
  await browser.close();
})();
