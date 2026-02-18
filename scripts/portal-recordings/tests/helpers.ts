import { type Page, expect } from '@playwright/test';

// ── Credentials from environment ──
export const PORTAL_EMAIL = process.env.PORTAL_EMAIL ?? '';
export const PORTAL_PASSWORD = process.env.PORTAL_PASSWORD ?? '';

if (!PORTAL_EMAIL || !PORTAL_PASSWORD) {
  console.error('\n❌ Set PORTAL_EMAIL and PORTAL_PASSWORD environment variables.\n');
  process.exit(1);
}

// ── Timing helpers — deliberate pauses so recordings look natural ──
export const BEAT = 600;        // Short pause after a click
export const DWELL = 1800;      // Linger on a view so viewer can absorb
export const LONG_DWELL = 3000; // Longer pause on key moments
export const SCROLL_PAUSE = 800;

export async function beat(page: Page) { await page.waitForTimeout(BEAT); }
export async function dwell(page: Page) { await page.waitForTimeout(DWELL); }
export async function longDwell(page: Page) { await page.waitForTimeout(LONG_DWELL); }

// ── Login flow ──
export async function login(page: Page) {
  await page.goto('/agent-portal/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Let page fully render

  // Wait for the email input to be visible (handles loading screens)
  const emailInput = page.locator('#email');
  await emailInput.waitFor({ state: 'visible', timeout: 15_000 });

  // Fill credentials
  await emailInput.fill(PORTAL_EMAIL);
  await beat(page);

  const passwordInput = page.locator('#password');
  await passwordInput.fill(PORTAL_PASSWORD);
  await beat(page);

  // Click login button
  const loginButton = page.locator('button[type="submit"]').first();
  await loginButton.click();

  // Wait for portal to load (redirects to /agent-portal or /agent-portal/)
  await page.waitForURL('**/agent-portal**', { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(4000); // Let animations + data loading settle
}

// ── Navigate to a portal section via deep link ──
export async function goToSection(page: Page, sectionId: string) {
  await page.goto(`/agent-portal?section=${sectionId}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Let transition + content load
}

// ── Navigate to a section by clicking the mobile menu ──
export async function navigateViaMenu(page: Page, sectionId: string) {
  // Open hamburger menu (button labeled "Open menu" in the mobile header)
  const hamburger = page.locator('button:has-text("Open menu"), button:has-text("menu"), .mobile-menu-burger').first();
  await hamburger.click();
  await page.waitForTimeout(800); // Menu slide-up animation

  // Click the nav item by data-section attribute
  const navItem = page.locator(`[data-section="${sectionId}"]`);
  await navItem.waitFor({ state: 'visible', timeout: 5_000 });
  await navItem.click();
  await page.waitForTimeout(2000); // Section transition + content load
}

// ── Smooth scroll down by pixels ──
export async function smoothScroll(page: Page, pixels: number, duration = 800) {
  await page.evaluate(
    ([px, dur]) => {
      return new Promise<void>((resolve) => {
        const start = window.scrollY;
        const startTime = performance.now();
        function step(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / dur, 1);
          // Ease in-out cubic
          const eased = progress < 0.5
            ? 4 * progress ** 3
            : 1 - (-2 * progress + 2) ** 3 / 2;
          window.scrollTo(0, start + px * eased);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    },
    [pixels, duration] as const
  );
  await page.waitForTimeout(SCROLL_PAUSE);
}

// ── Scroll to bottom of scrollable content ──
export async function scrollToBottom(page: Page, step = 300) {
  let prevY = -1;
  let currentY = 0;
  while (currentY !== prevY) {
    prevY = currentY;
    await smoothScroll(page, step, 600);
    currentY = await page.evaluate(() => window.scrollY);
  }
}

// ── Scroll back to top ──
export async function scrollToTop(page: Page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(800);
}

// ── Tap an element with a slight delay (looks natural) ──
export async function tapElement(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 8_000 });
  await el.tap();
  await beat(page);
}

// ── Save the video file path after test ──
export function videoPath(testTitle: string): string {
  return `./recordings/${testTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.webm`;
}
