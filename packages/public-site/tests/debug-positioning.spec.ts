import { test } from '@playwright/test';

test('Debug 1280x720 positioning', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(6000);

  await page.screenshot({ path: '/home/claude-flow/debug-1280.png' });
});
