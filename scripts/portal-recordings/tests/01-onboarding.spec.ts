import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop, beat } from './helpers';

/**
 * 01 — ONBOARDING
 * ≈ 30-45 seconds
 *
 * Shows: Onboarding checklist, step expansion, checkbox completion, progress bar advancing.
 * Story: "From the moment you join, SAA walks you through everything."
 */
test('01-onboarding', async ({ page }) => {
  await login(page);

  // Should land on onboarding by default
  await goToSection(page, 'onboarding');
  await longDwell(page); // Show the full onboarding screen with progress bar

  // Scroll down slowly to reveal the checklist steps
  await smoothScroll(page, 300);
  await dwell(page);

  // Tap on step 4 (unchecked — "Complete Important Broker Tasks") to expand it
  const step4 = page.locator('h3:has-text("Complete Important Broker Tasks")').locator('..');
  const step4Card = step4.locator('..').locator('..');
  if (await step4Card.isVisible().catch(() => false)) {
    await step4Card.click();
    await dwell(page);
    await smoothScroll(page, 200);
    await dwell(page);
  }

  // Scroll more to show additional steps
  await smoothScroll(page, 350);
  await dwell(page);

  // Tap step 6 ("Set Up Your Link Page") to expand it — shows the passive income system info
  const step6 = page.locator('h3:has-text("Set Up Your Link Page")').locator('..');
  const step6Card = step6.locator('..').locator('..');
  if (await step6Card.isVisible().catch(() => false)) {
    await step6Card.click();
    await dwell(page);
    await smoothScroll(page, 200);
    await dwell(page);
  }

  // Scroll down to show the "Complete All Steps" section and "Need Help?" section
  await smoothScroll(page, 400);
  await dwell(page);

  // Scroll back up to show progress bar at top
  await scrollToTop(page);
  await longDwell(page);
});
