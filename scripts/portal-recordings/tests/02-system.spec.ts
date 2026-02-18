import { test } from '@playwright/test';
import { login, goToSection, dwell, longDwell, smoothScroll, scrollToTop, beat, DWELL } from './helpers';

/**
 * 02 — YOUR SYSTEM (Link Page + Attraction + Analytics)
 * ≈ 60-75 seconds (longer video — these features interconnect)
 *
 * Shows: Link page editor → attraction page → analytics dashboard.
 * Story: "One link. One page. Visitors find you and request to join — every click tracked."
 */
test('02-system-link-attraction-analytics', async ({ page }) => {
  await login(page);

  // ── PART 1: Link Page ──
  await goToSection(page, 'linktree');
  await longDwell(page); // Show link page editor landing view

  // Scroll down to see editor content
  await smoothScroll(page, 250);
  await dwell(page);

  // Try tapping through link page tabs (shown as pills on mobile)
  for (const tabLabel of ['Style', 'Buttons', 'Social']) {
    const tab = page.locator(`button:has-text("${tabLabel}")`).first();
    if (await tab.isVisible().catch(() => false)) {
      await tab.tap();
      await page.waitForTimeout(DWELL);
    }
  }

  // Scroll down to see more content
  await smoothScroll(page, 200);
  await dwell(page);

  // Scroll back to top
  await scrollToTop(page);
  await beat(page);

  // ── PART 2: Agent Attraction Page ──
  // Use deep link — mobile menu nav items may be hidden when on linktree
  await goToSection(page, 'agent-page');
  await longDwell(page); // Show attraction page landing

  // Scroll to explore the attraction page content
  await smoothScroll(page, 300);
  await dwell(page);

  await smoothScroll(page, 250);
  await dwell(page);

  await scrollToTop(page);
  await beat(page);

  // ── PART 3: Analytics ──
  await goToSection(page, 'dashboard');
  await longDwell(page); // Show analytics dashboard

  // Scroll to reveal stats and charts
  await smoothScroll(page, 250);
  await dwell(page);

  await smoothScroll(page, 250);
  await dwell(page);

  // Scroll down more to see click data / charts
  await smoothScroll(page, 250);
  await dwell(page);

  // Back to top for a final overview shot
  await scrollToTop(page);
  await longDwell(page);
});
