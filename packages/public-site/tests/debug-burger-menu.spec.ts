import { test, expect } from '@playwright/test';

test('Debug burger menu flash on mobile', async ({ page }) => {
  // Log all console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  // Navigate and capture initial load
  await page.goto('http://localhost:3001');

  // Take screenshot immediately after navigation starts
  await page.screenshot({ path: '/home/claude-flow/burger-0ms.png' });

  // Take screenshots at key intervals during load
  await page.waitForTimeout(100);
  await page.screenshot({ path: '/home/claude-flow/burger-100ms.png' });

  await page.waitForTimeout(400);
  await page.screenshot({ path: '/home/claude-flow/burger-500ms.png' });

  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/claude-flow/burger-1000ms.png' });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/home/claude-flow/burger-2000ms.png' });

  // Check hamburger menu visibility and styling
  const hamburger = page.locator('.hamburger');
  const isVisible = await hamburger.isVisible();
  const styles = await hamburger.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      opacity: computed.opacity,
      display: computed.display,
      visibility: computed.visibility,
      transform: computed.transform,
    };
  });

  console.log('Hamburger visible:', isVisible);
  console.log('Hamburger styles:', styles);

  // Check SVG line stroke color
  const lineStroke = await page.locator('.hamburger .line').first().evaluate((el) => {
    return window.getComputedStyle(el).stroke;
  });

  console.log('Line stroke color:', lineStroke);
});
