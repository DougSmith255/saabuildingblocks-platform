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

  // Check the range input's React props
  const inputStatus = await page.evaluate(() => {
    const rangeInput = document.querySelector('input[type="range"]');
    const textInput = document.querySelector('input[type="text"]');

    const getReactProps = (el) => {
      if (!el) return { exists: false };
      const reactKey = Object.keys(el).find(key => key.startsWith('__reactFiber') || key.startsWith('__reactProps'));
      const propsKey = Object.keys(el).find(key => key.startsWith('__reactProps'));

      let props = null;
      if (propsKey && el[propsKey]) {
        props = {
          hasOnChange: typeof el[propsKey].onChange === 'function',
          hasOnInput: typeof el[propsKey].onInput === 'function',
          hasValue: 'value' in el[propsKey],
          valueType: typeof el[propsKey].value,
          allPropKeys: Object.keys(el[propsKey])
        };
      }

      return {
        exists: true,
        hasReactFiber: !!reactKey,
        reactKey: reactKey || 'none',
        props: props,
        domValue: el.value,
        domDisabled: el.disabled,
        domReadOnly: el.readOnly
      };
    };

    return {
      rangeInput: getReactProps(rangeInput),
      textInput: getReactProps(textInput)
    };
  });

  console.log('=== RANGE INPUT ===');
  console.log(JSON.stringify(inputStatus.rangeInput, null, 2));

  console.log('\n=== TEXT INPUT ===');
  console.log(JSON.stringify(inputStatus.textInput, null, 2));

  // Try to actually use the range input
  const rangeTest = await page.evaluate(() => {
    const rangeInput = document.querySelector('input[type="range"]');
    if (!rangeInput) return { error: 'No range input' };

    const initialValue = rangeInput.value;

    // Try to change value directly
    rangeInput.value = '50';

    // Dispatch events
    rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
    rangeInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Check if the label updated
    const labels = document.querySelectorAll('label');
    let transactionLabel = null;
    labels.forEach(l => {
      if (l.textContent.includes('Transactions')) {
        transactionLabel = l.textContent;
      }
    });

    return {
      initialValue,
      afterChangeValue: rangeInput.value,
      transactionLabel: transactionLabel
    };
  });

  console.log('\n=== RANGE INTERACTION TEST ===');
  console.log(rangeTest);

  await browser.close();
})();
