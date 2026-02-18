import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop, beat } from './helpers';

/**
 * 03 — TEAM CALLS
 * ≈ 25-35 seconds
 *
 * Shows: Team call schedule, upcoming calls, call details.
 * Story: "Weekly team calls — you're never building alone."
 */
test('03-team-calls', async ({ page }) => {
  await login(page);

  await goToSection(page, 'calls');
  await longDwell(page); // Show the team calls landing view

  // Scroll to see call schedule
  await smoothScroll(page, 250);
  await dwell(page);

  // Look for clickable call cards or schedule items
  const callCard = page.locator('[class*="call"] button, [class*="call"] a, [class*="schedule"] button').first();
  if (await callCard.isVisible().catch(() => false)) {
    await callCard.tap();
    await dwell(page);
  }

  // Continue scrolling to see more content
  await smoothScroll(page, 300);
  await dwell(page);

  await smoothScroll(page, 200);
  await dwell(page);

  // Back to top
  await scrollToTop(page);
  await longDwell(page);
});
