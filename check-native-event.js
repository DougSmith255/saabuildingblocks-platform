const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://saabuildingblocks.pages.dev/exp-commission-calculator/', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 3000));

  // Try native value setter
  const nativeTest = await page.evaluate(() => {
    const rangeInput = document.querySelector('input[type="range"]');
    if (!rangeInput) return { error: 'No range input' };

    const initialValue = rangeInput.value;

    // Get React's internal value setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    // Set value using native setter
    nativeInputValueSetter.call(rangeInput, 50);

    // Create and dispatch input event
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    rangeInput.dispatchEvent(inputEvent);

    // Wait a tick
    return new Promise(resolve => {
      setTimeout(() => {
        const labels = document.querySelectorAll('label');
        let transactionLabel = null;
        labels.forEach(l => {
          if (l.textContent.includes('Transactions')) {
            transactionLabel = l.textContent;
          }
        });

        resolve({
          initialValue,
          afterNativeSet: rangeInput.value,
          transactionLabel: transactionLabel
        });
      }, 100);
    });
  });

  console.log('=== NATIVE VALUE SETTER TEST ===');
  console.log(nativeTest);

  // Also try direct puppeteer interaction
  const rangeInput = await page.$('input[type="range"]');
  if (rangeInput) {
    // Focus and use keyboard
    await rangeInput.focus();

    // Try page.evaluate to call onChange directly
    const directCall = await page.evaluate(() => {
      const rangeInput = document.querySelector('input[type="range"]');
      const propsKey = Object.keys(rangeInput).find(key => key.startsWith('__reactProps'));
      if (propsKey && rangeInput[propsKey] && rangeInput[propsKey].onChange) {
        // Create a synthetic event
        const syntheticEvent = {
          target: { value: 75 },
          currentTarget: rangeInput,
          preventDefault: () => {},
          stopPropagation: () => {}
        };

        try {
          rangeInput[propsKey].onChange(syntheticEvent);
          return { success: true, called: 'onChange directly' };
        } catch (e) {
          return { error: e.message };
        }
      }
      return { error: 'No onChange found' };
    });

    console.log('\n=== DIRECT onChange CALL ===');
    console.log(directCall);

    // Check if state updated
    await new Promise(r => setTimeout(r, 500));
    const afterDirect = await page.evaluate(() => {
      const labels = document.querySelectorAll('label');
      let transactionLabel = null;
      labels.forEach(l => {
        if (l.textContent.includes('Transactions')) {
          transactionLabel = l.textContent;
        }
      });
      return { transactionLabel };
    });

    console.log('After direct call:', afterDirect);
  }

  await browser.close();
})();
