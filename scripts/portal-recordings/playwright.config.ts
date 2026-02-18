import { defineConfig } from '@playwright/test';

/**
 * Portal Recording Configuration
 *
 * Records mobile-viewport videos of each portal section using Chromium.
 * Videos are saved to ./recordings/ and sized for a phone mockup frame.
 *
 * Phone mockup reference (from link page editor):
 *   Outer: 250px, padding 8px → inner screen: 234×460 (1:1.966 ratio)
 *   Recording viewport: 390×844 (iPhone 14 logical), 2× scale → 780×1688 actual pixels
 *
 * Usage:
 *   PORTAL_EMAIL=you@example.com PORTAL_PASSWORD=secret npx playwright test --config=scripts/portal-recordings/playwright.config.ts
 *   PORTAL_EMAIL=you@example.com PORTAL_PASSWORD=secret npx playwright test --config=scripts/portal-recordings/playwright.config.ts 02-system
 */
export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,       // Run sequentially — share auth state
  retries: 0,                 // No retries — we want clean single takes
  workers: 1,                 // Single worker for sequential execution
  reporter: 'list',

  use: {
    // Use Cloudflare Pages directly — Apache proxies /agent-portal/ to admin-dashboard
    baseURL: 'https://saabuildingblocks.pages.dev',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
    video: {
      mode: 'on',
      size: { width: 780, height: 1688 },
    },
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  projects: [
    {
      name: 'portal-mobile',
      use: {
        // Chromium with mobile emulation (no WebKit dependency)
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        colorScheme: 'dark',
        video: {
          mode: 'on',
          size: { width: 780, height: 1688 },
        },
      },
    },
  ],

  outputDir: './recordings',
});
