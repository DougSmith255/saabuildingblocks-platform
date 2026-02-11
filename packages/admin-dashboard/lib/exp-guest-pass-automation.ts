/**
 * eXp World Guest Pass — Automated Browser Submission
 *
 * Uses Playwright to log into my.exprealty.com via Okta SSO, navigate to the
 * "eXp World Guest Passport Request" page via the profile dropdown, and submit
 * a guest pass request on behalf of Sheldon Smart.
 *
 * Flow:
 *  1. Navigate to https://my.exprealty.com/
 *  2. Handle cookie consent
 *  3. Sign in via Okta SSO if not already authenticated (email → password → verify)
 *  4. Click profile dropdown → select "eXp World Guest Passport Request"
 *  5. Fill guest form (firstName, lastName, email)
 *  6. Check "I understand" checkbox
 *  7. Submit "Request Guest Account"
 *
 * Sessions are persisted to disk so Okta login is skipped when still valid.
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs/promises';

const SESSION_DIR = '/tmp/exp-okta-session';
const STORAGE_STATE_PATH = path.join(SESSION_DIR, 'state.json');
const CREDENTIALS_PATH = path.join(SESSION_DIR, 'credentials.json');
const SCREENSHOT_DIR = path.join(SESSION_DIR, 'screenshots');
const TIMEOUT = 90_000; // 90s max per submission (longer due to navigation through portal)
const NAV_TIMEOUT = 30_000;

const MY_EXP_URL = 'https://my.exprealty.com/';

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
 * Uses pressSequentially instead of fill() to trigger Okta's JS event handlers.
 */
async function handleOktaLogin(page: Page): Promise<void> {
  // Read credentials from file to avoid dotenv-expand corrupting the $ in password
  let email = process.env.EXP_OKTA_EMAIL;
  let password = process.env.EXP_OKTA_PASSWORD;

  try {
    const creds = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    if (creds.email) email = creds.email;
    if (creds.password) password = creds.password;
  } catch {
    // Credentials file not found — fall back to env vars
  }

  if (!email || !password) {
    throw new Error('EXP_OKTA_EMAIL and EXP_OKTA_PASSWORD are required (env vars or credentials.json)');
  }

  // Wait for the Okta username field
  const usernameInput = page.locator('input[name="identifier"], input[name="username"], input#okta-signin-username');
  await usernameInput.waitFor({ state: 'visible', timeout: NAV_TIMEOUT });

  // Enter email using keystrokes (Okta needs real key events)
  await usernameInput.click();
  await usernameInput.pressSequentially(email, { delay: 30 });

  // Check "Keep me signed in" if available
  try {
    const keepSignedIn = page.locator('input[type="checkbox"][name="rememberMe"], label:has-text("Keep me signed in") input[type="checkbox"], [data-se="o-form-input-rememberMe"] input');
    const checkbox = keepSignedIn.first();
    if (await checkbox.isVisible({ timeout: 2000 })) {
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
  } catch {
    // "Keep me signed in" not present — fine
  }

  // Click Next/Submit
  const nextButton = page.locator('input[type="submit"][value="Next"], button[type="submit"]:has-text("Next"), input[type="submit"][value="Sign In"]');
  await nextButton.click();

  // Wait for password field (may be on same page or next page)
  const passwordInput = page.locator('input[name="credentials.passcode"], input[name="password"], input[type="password"]');
  await passwordInput.waitFor({ state: 'visible', timeout: NAV_TIMEOUT });
  await page.waitForTimeout(1000); // pause for Okta animations

  // Clear any previous value, then type password using keyboard events
  await passwordInput.click({ clickCount: 3 }); // select all
  await page.waitForTimeout(200);
  await page.keyboard.type(password, { delay: 50 });
  await page.waitForTimeout(500);

  // Brief pause before clicking Verify
  await page.waitForTimeout(300);

  // Click Verify/Sign In
  const verifyButton = page.locator('input[type="submit"][value="Verify"], button[type="submit"]:has-text("Verify"), input[type="submit"][value="Sign In"]');
  await verifyButton.click();

  // Wait for redirect back to my.exprealty.com (away from Okta domain)
  await page.waitForURL(/my\.exprealty\.com/, { timeout: NAV_TIMEOUT });
}

/**
 * Check if we're currently on the Okta login page
 */
function isOnOktaPage(page: Page): boolean {
  const url = page.url();
  return url.includes('okta.com') || url.includes('/login/login');
}

/**
 * Check if we're logged in to my.exprealty.com (can see dashboard / profile)
 */
async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Look for profile photo/avatar dropdown or common dashboard elements
    const profileIndicator = page.locator(
      '[class*="profile"], [class*="avatar"], [class*="user-menu"], ' +
      'img[alt*="profile" i], img[alt*="avatar" i], ' +
      '[data-testid*="profile"], [data-testid*="avatar"], ' +
      'button[aria-label*="profile" i], button[aria-label*="account" i]'
    );
    return await profileIndicator.first().isVisible({ timeout: 5000 });
  } catch {
    return false;
  }
}

/**
 * Navigate to the Guest Passport Request form via the profile dropdown.
 */
async function navigateToGuestPassForm(page: Page): Promise<void> {
  console.log('[exp-guest-pass] Navigating to Guest Passport Request via profile dropdown...');

  // Click the dropdown arrow / profile area in the top-right
  // Try multiple selectors for the profile dropdown trigger
  const dropdownTrigger = page.locator(
    // Common dropdown triggers near profile photo
    'button:near(img[alt*="profile" i]):visible, ' +
    'button:near(img[alt*="avatar" i]):visible, ' +
    '[class*="dropdown"] button:visible, ' +
    '[class*="profile"] button:visible, ' +
    '[class*="user-menu"] button:visible, ' +
    // Generic: clickable element with a caret/arrow near top-right
    'header button:has(svg):visible, ' +
    'nav button:has(svg):visible'
  );

  // Take a screenshot before attempting dropdown click (for debugging)
  await saveScreenshot(page, 'before-dropdown');

  // Try clicking the profile dropdown
  try {
    await dropdownTrigger.first().click({ timeout: 10_000 });
  } catch {
    // Fallback: try clicking any element that looks like a profile image
    console.log('[exp-guest-pass] Primary dropdown selector failed, trying fallback...');
    try {
      // Try right side of the header area
      const headerRight = page.locator('header >> nth=-1').locator('button, [role="button"], a').last();
      await headerRight.click({ timeout: 5000 });
    } catch {
      // Last resort: click near top-right of page where profile dropdowns typically are
      console.log('[exp-guest-pass] Fallback failed, trying coordinate click...');
      const viewport = page.viewportSize();
      if (viewport) {
        await page.mouse.click(viewport.width - 60, 30);
      }
    }
  }

  await page.waitForTimeout(1500); // Wait for dropdown to animate open
  await saveScreenshot(page, 'dropdown-open');

  // Click "eXp World Guest Passport Request" from the dropdown menu
  const guestPassLink = page.locator(
    'a:has-text("Guest Passport Request"), ' +
    'button:has-text("Guest Passport Request"), ' +
    '[role="menuitem"]:has-text("Guest Passport"), ' +
    'li:has-text("Guest Passport Request") a, ' +
    'li:has-text("Guest Passport Request") button, ' +
    ':text("eXp World Guest Passport Request")'
  );

  await guestPassLink.first().click({ timeout: 10_000 });

  // Wait for navigation to the guest pass form page
  await page.waitForLoadState('domcontentloaded', { timeout: NAV_TIMEOUT });
  await page.waitForTimeout(2000); // Allow form to fully render
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

    // Navigate to my.exprealty.com
    console.log('[exp-guest-pass] Navigating to my.exprealty.com...');
    await page.goto(MY_EXP_URL, {
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
    await page.waitForTimeout(2000); // Allow redirects to settle
    const loggedIn = await isLoggedIn(page);

    if (!loggedIn) {
      console.log('[exp-guest-pass] Not logged in, handling Okta SSO...');

      // my.exprealty.com may auto-redirect to Okta, or we may need to click sign-in
      if (!isOnOktaPage(page)) {
        try {
          const signInButton = page.locator(
            'button:has-text("Sign in"), a:has-text("Sign in"), ' +
            'button:has-text("Log in"), a:has-text("Log in"), ' +
            'button:has-text("Login"), a:has-text("Login")'
          );
          await signInButton.first().click({ timeout: 10_000 });
        } catch {
          // May have auto-redirected to Okta already
        }
        await page.waitForTimeout(2000);
      }

      // If we're on Okta, handle login
      if (isOnOktaPage(page)) {
        await handleOktaLogin(page);
      }

      // After login, wait for the dashboard to load
      await page.waitForTimeout(3000);
    }

    console.log('[exp-guest-pass] Logged in — navigating to guest pass form...');

    // Persist session AFTER confirming login
    await context.storageState({ path: STORAGE_STATE_PATH });

    // Navigate to the Guest Passport Request page via profile dropdown
    await navigateToGuestPassForm(page);

    // Wait for the guest pass form to be ready
    // The form should have First Name, Last Name, Email fields
    await page.getByText('First Name').first().waitFor({ state: 'visible', timeout: 15_000 });

    console.log('[exp-guest-pass] Form loaded — filling in guest details...');

    // Fill First Name
    const firstNameInput = page.getByLabel('First Name', { exact: false }).first();
    await firstNameInput.fill(input.firstName);

    // Fill Last Name
    const lastNameInput = page.getByLabel('Last Name', { exact: false }).first();
    await lastNameInput.fill(input.lastName);

    // Fill Email
    const emailInput = page.getByLabel('Email', { exact: false }).first();
    await emailInput.fill(input.email);

    // Check the "I understand" checkbox
    try {
      // Try label-based match first
      const iUnderstandCheckbox = page.locator(
        'label:has-text("I understand") input[type="checkbox"], ' +
        'input[type="checkbox"]:near(:text("I understand"))'
      );
      const checkbox = iUnderstandCheckbox.first();
      if (await checkbox.isVisible({ timeout: 3000 })) {
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }
      } else {
        // Fallback: check any visible checkbox on the form
        const anyCheckbox = page.locator('input[type="checkbox"]').first();
        if (await anyCheckbox.isVisible({ timeout: 2000 })) {
          if (!(await anyCheckbox.isChecked())) {
            await anyCheckbox.check();
          }
        }
      }
    } catch {
      console.log('[exp-guest-pass] Could not find checkbox — continuing without it');
    }

    // Take a pre-submit screenshot for debugging
    await saveScreenshot(page, 'pre-submit');

    // Click the "Request Guest Account" button
    const submitButton = page.locator(
      'button:has-text("Request Guest Account"), ' +
      'button:has-text("Request"), ' +
      'input[type="submit"][value*="Request"], ' +
      'button[type="submit"], ' +
      'input[type="submit"]'
    ).first();
    await submitButton.click();

    console.log('[exp-guest-pass] Form submitted — waiting for confirmation...');

    // Wait for confirmation (success message or page change)
    await page.waitForTimeout(3000);

    // Take a post-submit screenshot
    const screenshotPath = await saveScreenshot(page, 'post-submit');

    // Check for success indicators
    const pageContent = await page.textContent('body');
    const lowerContent = pageContent?.toLowerCase() || '';
    const hasError = lowerContent.includes('error') && !lowerContent.includes('no error');
    const hasSuccess = lowerContent.includes('success') ||
                       lowerContent.includes('guest account') ||
                       lowerContent.includes('invitation') ||
                       lowerContent.includes('submitted') ||
                       lowerContent.includes('request has been');

    // Save session after successful operation
    await context.storageState({ path: STORAGE_STATE_PATH });

    if (hasError && !hasSuccess) {
      return {
        success: false,
        error: 'Form submission may have failed — check screenshot for details',
        screenshotPath,
      };
    }

    console.log('[exp-guest-pass] Guest pass submitted successfully');
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
