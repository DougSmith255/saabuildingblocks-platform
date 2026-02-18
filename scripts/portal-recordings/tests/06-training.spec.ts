import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop, beat } from './helpers';

/**
 * 06 — TRAINING / ELITE COURSES
 * ≈ 35-50 seconds
 *
 * Shows: Course library, click into a course, modules + progress, coaching calls.
 * Story: "Premium courses — structured modules, progress tracking, live coaching."
 */
test('06-training', async ({ page }) => {
  await login(page);

  await goToSection(page, 'courses');
  await longDwell(page); // Show courses landing view

  // Scroll to browse course cards
  await smoothScroll(page, 250);
  await dwell(page);

  // Tap on a course card to expand / enter it
  const courseCard = page.locator('[class*="course"] button, [class*="course"] a, [class*="card"] button').first();
  if (await courseCard.isVisible().catch(() => false)) {
    await courseCard.tap();
    await dwell(page);

    // Scroll to show course modules / content
    await smoothScroll(page, 300);
    await dwell(page);
  }

  // Continue scrolling to show more courses
  await smoothScroll(page, 300);
  await dwell(page);

  await smoothScroll(page, 250);
  await dwell(page);

  // Look for module progress or coaching call info
  const moduleItem = page.locator('[class*="module"], [class*="lesson"], [class*="progress"]').first();
  if (await moduleItem.isVisible().catch(() => false)) {
    await moduleItem.tap();
    await dwell(page);
  }

  await scrollToTop(page);
  await longDwell(page);
});
