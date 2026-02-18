import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop, beat } from './helpers';

/**
 * 05 — TEMPLATES
 * ≈ 25-35 seconds
 *
 * Shows: Template library, categories, preview a template.
 * Story: "Professional templates — grab, customize, deploy."
 */
test('05-templates', async ({ page }) => {
  await login(page);

  await goToSection(page, 'templates');
  await longDwell(page); // Show templates landing view

  // Scroll to browse template cards
  await smoothScroll(page, 250);
  await dwell(page);

  // Tap on a template card if available
  const templateCard = page.locator('[class*="template"] button, [class*="template"] a, [class*="card"] button').first();
  if (await templateCard.isVisible().catch(() => false)) {
    await templateCard.tap();
    await dwell(page);
  }

  // Scroll to see more templates
  await smoothScroll(page, 300);
  await dwell(page);

  await smoothScroll(page, 200);
  await dwell(page);

  await scrollToTop(page);
  await longDwell(page);
});
