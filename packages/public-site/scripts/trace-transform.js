const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });

  await page.goto('https://saabuildingblocks.pages.dev/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Use CDP to get matched styles
  const client = await page.target().createCDPSession();
  
  // Get the hero element
  const heroHandle = await page.$('main#main-content > section:first-child');
  const { object } = await client.send('DOM.resolveNode', {
    objectId: await heroHandle.evaluate(el => el, heroHandle).then(r => r._remoteObject?.objectId)
  });
  
  // Get the DOM node
  const doc = await client.send('DOM.getDocument');
  const node = await client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: 'main#main-content > section:first-child'
  });
  
  // Get matched CSS rules
  const matched = await client.send('CSS.getMatchedStylesForNode', { nodeId: node.nodeId });
  
  // Find rules that set transform
  const transformRules = matched.matchedCSSRules?.filter(r => 
    r.rule.style.cssProperties.some(p => p.name === 'transform')
  ).map(r => ({
    selector: r.rule.selectorList.text,
    transform: r.rule.style.cssProperties.find(p => p.name === 'transform')
  }));
  
  console.log('Rules setting transform:', JSON.stringify(transformRules, null, 2));
  
  await browser.close();
}

main().catch(console.error);
