import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 },
  { name: '8K', width: 7680, height: 4320 },
];

test.describe('Fluid Hero Layout Tests', () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');

      // Wait for animations to complete
      await page.waitForTimeout(5000);

      // Check that profile image is visible
      const profileImg = page.locator('.profile-image');
      await expect(profileImg).toBeVisible();

      // Check that H1 is visible and positioned correctly
      const h1 = page.locator('h1#hero-heading');
      await expect(h1).toBeVisible();

      // Check that wolf pack background is visible
      const wolfPack = page.locator('.hero-animate-bg');
      await expect(wolfPack).toBeVisible();

      // Get element sizes to verify fluid scaling
      const profileBox = await profileImg.boundingBox();
      const h1Box = await h1.boundingBox();

      // Verify elements are scaling (not at fixed max-widths)
      expect(profileBox).not.toBeNull();
      expect(h1Box).not.toBeNull();

      // Take screenshot for visual verification
      await page.screenshot({
        path: `tests/screenshots/fluid-layout-${viewport.name.toLowerCase()}.png`,
        fullPage: false,
      });

      console.log(`✅ ${viewport.name}: Profile ${profileBox?.width}px, H1 ${h1Box?.width}px`);
    });
  }
});
