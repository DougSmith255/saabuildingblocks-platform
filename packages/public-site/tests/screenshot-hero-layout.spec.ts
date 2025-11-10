import { test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 720 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-2560', width: 2560, height: 1440 },
];

test.describe('Hero Layout Screenshots', () => {
  for (const viewport of VIEWPORTS) {
    test(`Screenshot ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3001');

      // Wait for animations and content to load
      await page.waitForTimeout(5000);

      // Take full page screenshot
      await page.screenshot({
        path: `/home/claude-flow/screenshot-${viewport.name}.png`,
        fullPage: false,
      });

      // Get H1 and button positions for debugging
      const h1 = page.locator('h1#hero-heading');
      const buttons = page.locator('.flex.flex-col.sm\\:flex-row.gap-3');

      const h1Box = await h1.boundingBox();
      const buttonsBox = await buttons.boundingBox();

      console.log(`\n${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log(`  H1: ${h1Box ? `top=${h1Box.y}px, height=${h1Box.height}px` : 'not found'}`);
      console.log(`  Buttons: ${buttonsBox ? `top=${buttonsBox.y}px, bottom=${buttonsBox.y + buttonsBox.height}px` : 'not found'}`);
      console.log(`  Viewport height: ${viewport.height}px`);
      console.log(`  Button clearance: ${buttonsBox ? viewport.height - (buttonsBox.y + buttonsBox.height) : 'N/A'}px`);
    });
  }
});
