/**
 * eXp World Guest Pass — Automated Browser Submission
 *
 * Uses Playwright to log into eXp's invite-a-guest portal via Okta SSO
 * and submit a guest pass request on behalf of Sheldon Smart.
 *
 * Flow:
 *  1. Navigate to inviteaguest.exprealty.com
 *  2. Handle cookie consent
 *  3. Sign in via Okta SSO (email → password → verify)
 *  4. Fill guest form (firstName, lastName, email)
 *  5. Accept sponsorship agreement
 *  6. Submit "Request Guest Account"
 *
 * Sessions are persisted to disk so Okta login is skipped when still valid.
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs/promises';

const SESSION_DIR = '/tmp/exp-okta-session';
const STORAGE_STATE_PATH = path.join(SESSION_DIR, 'state.json');
const SCREENSHOT_DIR = path.join(SESSION_DIR, 'screenshots');
const TIMEOUT = 60_000; // 60s max per submission
const NAV_TIMEOUT = 30_000;

interface GuestPassInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface GuestPassResult {
  success: boolean;
  error?: string;
  screenshotPath?: string;
}

async function ensureDirectories() {
  await fs.mkdir(SESSION_DIR, { recursive: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
}

async function hasValidSession(): Promise<boolean> {
  try {
    const stat = await fs.stat(STORAGE_STATE_PATH);
    // Session files older than 4 hours are considered stale
    const ageMs = Date.now() - stat.mtimeMs;
    return ageMs < 4 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

async function saveScreenshot(page: Page, label: string): Promise<string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(SCREENSHOT_DIR, `${label}-${ts}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

/**
 * Handle Okta SSO login flow.
 * Detects whether we're on the Okta login page and authenticates if so.
 */
async function handleOktaLogin(page: Page): Promise<void> {
  const email = process.env.EXP_OKTA_EMAIL;
  const password = process.env.EXP_OKTA_PASSWORD;

  if (!email || !password) {
    throw new Error('EXP_OKTA_EMAIL and EXP_OKTA_PASSWORD environment variables are required');
  }

  // Wait for the Okta username field
  const usernameInput = page.locator('input[name="identifier"], input[name="username"], input#okta-signin-username');
  await usernameInput.waitFor({ state: 'visible', timeout: NAV_TIMEOUT });

  // Enter email
  await usernameInput.fill(email);

  // Click Next/Submit
  const nextButton = page.locator('input[type="submit"][value="Next"], button[type="submit"]:has-text("Next"), input[type="submit"][value="Sign In"]');
  await nextButton.click();

  // Wait for password field (may be on same page or next page)
  const passwordInput = page.locator('input[name="credentials.passcode"], input[name="password"], input[type="password"]');
  await passwordInput.waitFor({ state: 'visible', timeout: NAV_TIMEOUT });

  // Enter password
  await passwordInput.fill(password);

  // Click Verify/Sign In
  const verifyButton = page.locator('input[type="submit"][value="Verify"], button[type="submit"]:has-text("Verify"), input[type="submit"][value="Sign In"]');
  await verifyButton.click();

  // Wait for redirect back to the invite portal (away from Okta domain)
  await page.waitForURL(/inviteaguest\.exprealty\.com/, { timeout: NAV_TIMEOUT });
}

/**
 * Check if we're currently on the Okta login page
 */
function isOnOktaPage(page: Page): boolean {
  const url = page.url();
  return url.includes('okta.com') || url.includes('/login');
}

/**
 * Check if we're on the invite form page (logged in)
 */
async function isOnInviteForm(page: Page): Promise<boolean> {
  try {
    // Look for the form fields that appear when logged in
    const firstNameField = page.locator('input[name="firstName"], input[placeholder*="First Name"], #firstName');
    return await firstNameField.isVisible({ timeout: 3000 });
  } catch {
    return false;
  }
}

export async function submitExpGuestPass(input: GuestPassInput): Promise<GuestPassResult> {
  await ensureDirectories();

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Try to reuse existing session
    const sessionValid = await hasValidSession();
    const contextOptions: Parameters<Browser['newContext']>[0] = {
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (sessionValid) {
      contextOptions.storageState = STORAGE_STATE_PATH;
    }

    context = await browser.newContext(contextOptions);
    context.setDefaultTimeout(TIMEOUT);

    const page = await context.newPage();

    // Navigate to the invite portal
    await page.goto('https://inviteaguest.exprealty.com/index.html', {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    });

    // Handle cookie consent if present
    try {
      const acceptCookies = page.locator('button:has-text("Accept All"), button:has-text("Accept"), a:has-text("Accept All")');
      await acceptCookies.click({ timeout: 5000 });
      await page.waitForTimeout(500);
    } catch {
      // Cookie banner may not appear — that's fine
    }

    // Check if we need to sign in
    const onForm = await isOnInviteForm(page);

    if (!onForm) {
      // Click "Sign in to invite a Guest" button if present
      try {
        const signInButton = page.locator('button:has-text("Sign in"), a:has-text("Sign in"), button:has-text("Log in"), a:has-text("Log in")');
        await signInButton.click({ timeout: 10_000 });
      } catch {
        // May have auto-redirected to Okta already
      }

      // Wait a moment for redirect
      await page.waitForTimeout(2000);

      // If we're on Okta, handle login
      if (isOnOktaPage(page)) {
        await handleOktaLogin(page);
      }

      // After login, wait for the form to appear
      await page.waitForTimeout(2000);
    }

    // Persist session for reuse
    await context.storageState({ path: STORAGE_STATE_PATH });

    // Now fill the guest form
    // Wait for form to be ready
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    // Fill First Name
    const firstNameInput = page.locator('input[name="firstName"], input#firstName, input[placeholder*="First Name"]').first();
    await firstNameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await firstNameInput.fill(input.firstName);

    // Fill Last Name
    const lastNameInput = page.locator('input[name="lastName"], input#lastName, input[placeholder*="Last Name"]').first();
    await lastNameInput.fill(input.lastName);

    // Fill Email
    const emailInput = page.locator('input[name="email"], input#email, input[placeholder*="Email"], input[type="email"]').first();
    await emailInput.fill(input.email);

    // Check the sponsorship agreement checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }

    // Take a pre-submit screenshot for debugging
    await saveScreenshot(page, 'pre-submit');

    // Click "Request Guest Account"
    const submitButton = page.locator('button:has-text("Request Guest Account"), input[type="submit"][value*="Request"], button[type="submit"]');
    await submitButton.click();

    // Wait for confirmation (success message or page change)
    await page.waitForTimeout(3000);

    // Take a post-submit screenshot
    const screenshotPath = await saveScreenshot(page, 'post-submit');

    // Check for success indicators
    const pageContent = await page.textContent('body');
    const hasError = pageContent?.toLowerCase().includes('error') && !pageContent?.toLowerCase().includes('no error');
    const hasSuccess = pageContent?.toLowerCase().includes('success') ||
                       pageContent?.toLowerCase().includes('guest account') ||
                       pageContent?.toLowerCase().includes('invitation') ||
                       pageContent?.toLowerCase().includes('submitted');

    // Save session after successful operation
    await context.storageState({ path: STORAGE_STATE_PATH });

    if (hasError && !hasSuccess) {
      return {
        success: false,
        error: 'Form submission may have failed — check screenshot for details',
        screenshotPath,
      };
    }

    return { success: true, screenshotPath };
  } catch (err) {
    // Try to capture failure screenshot
    let screenshotPath: string | undefined;
    try {
      if (context) {
        const pages = context.pages();
        if (pages.length > 0) {
          screenshotPath = await saveScreenshot(pages[0], 'error');
        }
      }
    } catch {
      // Screenshot capture failed — proceed with error reporting
    }

    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message, screenshotPath };
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}
