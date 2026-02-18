import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop } from './helpers';

/**
 * 04 — SUPPORT
 * ≈ 20-30 seconds
 *
 * Shows: Support options, contact methods, community access.
 * Story: "Help is always one click away."
 */
test('04-support', async ({ page }) => {
  await login(page);

  await goToSection(page, 'support');
  await longDwell(page); // Show support landing view

  // Scroll to see contact options
  await smoothScroll(page, 250);
  await dwell(page);

  // Look for support action buttons
  const supportButton = page.locator('[class*="support"] button, [class*="contact"] button, a[href*="support"]').first();
  if (await supportButton.isVisible().catch(() => false)) {
    await supportButton.tap();
    await dwell(page);
  }

  // Scroll to see more support content
  await smoothScroll(page, 200);
  await dwell(page);

  await scrollToTop(page);
  await longDwell(page);
});
