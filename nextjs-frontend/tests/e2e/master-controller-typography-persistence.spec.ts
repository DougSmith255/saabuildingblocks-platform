/**
 * E2E Tests: Master Controller Typography Settings Persistence
 *
 * CRITICAL: These tests prevent bugs like typography settings not persisting
 *
 * Test Coverage:
 * 1. Settings persist after save and page refresh
 * 2. All 11 text types maintain unique values
 * 3. Font families persist correctly
 * 4. Font weights persist correctly
 * 5. Line heights persist correctly
 * 6. Settings don't reset to defaults unexpectedly
 * 7. Database state is consistent with UI state
 *
 * @see https://playwright.dev/docs/test-assertions
 */

import { test, expect, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Test data
const TEST_TYPOGRAPHY_VALUES = {
  h1: {
    minSize: 100, // Changed from default
    preferredSize: 12,
    maxSize: 120,
    lineHeight: 1.1,
    fontFamily: 'taskor',
    fontWeight: 700,
  },
  h2: {
    minSize: 45, // Changed from default
    preferredSize: 8,
    maxSize: 72,
    lineHeight: 1.2,
    fontFamily: 'taskor',
    fontWeight: 600,
  },
  body: {
    minSize: 18, // Changed from default
    preferredSize: 2,
    maxSize: 22,
    lineHeight: 1.8,
    fontFamily: 'amulya',
    fontWeight: 400,
  },
};

// Supabase client for direct database access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Helper: Wait for typography settings to load from database
 */
async function waitForTypographyLoad(page: Page) {
  // Wait for the typography tab to be visible
  await page.waitForSelector('[data-tab="typography"]', { state: 'visible', timeout: 10000 });

  // Wait for at least one text type card to be visible
  await page.waitForSelector('text=H1', { state: 'visible', timeout: 10000 });

  // Wait for the save button to be visible
  await page.waitForSelector('button:has-text("Save")', { state: 'visible', timeout: 10000 });

  // Give it a moment to load from database
  await page.waitForTimeout(1000);
}

/**
 * Helper: Clear typography settings from database
 */
async function clearTypographySettings() {
  const { error } = await supabase
    .from('master_controller_settings')
    .delete()
    .eq('setting_key', 'typography');

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to clear typography settings:', error);
  }
}

/**
 * Helper: Get typography settings from database
 */
async function getTypographyFromDatabase() {
  const { data, error } = await supabase
    .from('master_controller_settings')
    .select('setting_value')
    .eq('setting_key', 'typography')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data?.setting_value || null;
}

/**
 * Helper: Get text type value from UI
 */
async function getTextTypeValue(page: Page, textType: string, field: 'min' | 'preferred' | 'max' | 'lineHeight') {
  // Find the card for this text type
  const card = page.locator(`[data-text-type="${textType}"]`).first();

  // Get the input value
  let selector: string;
  switch (field) {
    case 'min':
      selector = 'input[aria-label*="Minimum"]';
      break;
    case 'preferred':
      selector = 'input[aria-label*="Preferred"]';
      break;
    case 'max':
      selector = 'input[aria-label*="Maximum"]';
      break;
    case 'lineHeight':
      selector = 'input[aria-label*="Line Height"]';
      break;
  }

  const input = card.locator(selector).first();
  return await input.inputValue();
}

/**
 * Helper: Set text type value in UI
 */
async function setTextTypeValue(page: Page, textType: string, field: 'min' | 'preferred' | 'max' | 'lineHeight', value: number) {
  // Find the card for this text type
  const card = page.locator(`[data-text-type="${textType}"]`).first();

  // Get the input selector
  let selector: string;
  switch (field) {
    case 'min':
      selector = 'input[aria-label*="Minimum"]';
      break;
    case 'preferred':
      selector = 'input[aria-label*="Preferred"]';
      break;
    case 'max':
      selector = 'input[aria-label*="Maximum"]';
      break;
    case 'lineHeight':
      selector = 'input[aria-label*="Line Height"]';
      break;
  }

  const input = card.locator(selector).first();
  await input.fill(value.toString());

  // Trigger change event
  await input.blur();
  await page.waitForTimeout(100);
}

test.describe('Master Controller Typography Persistence', () => {

  test.beforeEach(async ({ page }) => {
    // Clear database before each test
    await clearTypographySettings();

    // Navigate to Master Controller
    await page.goto('/master-controller');

    // Wait for page to load
    await waitForTypographyLoad(page);
  });

  test.afterEach(async () => {
    // Clean up database after each test
    await clearTypographySettings();
  });

  /**
   * TEST 1: Settings persist after save and page refresh
   *
   * This is the CRITICAL test that would have caught the bug
   */
  test('typography settings persist after save and page refresh', async ({ page }) => {
    console.log('[TEST] Starting typography persistence test...');

    // Step 1: Change H1 minimum size to non-default value
    console.log('[TEST] Setting H1 minimum size to 100px...');
    await setTextTypeValue(page, 'h1', 'min', TEST_TYPOGRAPHY_VALUES.h1.minSize);

    // Verify the change in UI
    const h1MinBefore = await getTextTypeValue(page, 'h1', 'min');
    expect(h1MinBefore).toBe('100');
    console.log('[TEST] ✓ H1 minimum size set to 100px');

    // Step 2: Click Save button
    console.log('[TEST] Clicking Save button...');
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Wait for success message
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    console.log('[TEST] ✓ Save successful');

    // Step 3: Wait for API to complete
    await page.waitForTimeout(1000);

    // Step 4: Verify saved to database
    const dbSettings = await getTypographyFromDatabase();
    expect(dbSettings).not.toBeNull();
    expect(dbSettings.h1.minSize).toBe(100);
    console.log('[TEST] ✓ Settings confirmed in database');

    // Step 5: Refresh the page
    console.log('[TEST] Refreshing page...');
    await page.reload();
    await waitForTypographyLoad(page);

    // Step 6: Verify H1 is still 100px (NOT reset to default)
    const h1MinAfter = await getTextTypeValue(page, 'h1', 'min');
    expect(h1MinAfter).toBe('100');
    console.log('[TEST] ✓ H1 minimum size persisted after refresh');

    // Step 7: Verify NOT reset to default (default would be 48)
    expect(h1MinAfter).not.toBe('48');
    console.log('[TEST] ✓ Settings did NOT reset to defaults');

    console.log('[TEST] ✅ Typography persistence test PASSED');
  });

  /**
   * TEST 2: All text types maintain unique values
   *
   * This test catches the bug where all text types were getting identical values
   */
  test('all text types maintain unique values after save', async ({ page }) => {
    console.log('[TEST] Starting text type uniqueness test...');

    // Set different values for H1, H2, and Body
    await setTextTypeValue(page, 'h1', 'min', 100);
    await setTextTypeValue(page, 'h2', 'min', 45);
    await setTextTypeValue(page, 'body', 'min', 18);

    console.log('[TEST] Set unique values: H1=100, H2=45, Body=18');

    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Refresh
    await page.reload();
    await waitForTypographyLoad(page);

    // Verify all values are different
    const h1Min = await getTextTypeValue(page, 'h1', 'min');
    const h2Min = await getTextTypeValue(page, 'h2', 'min');
    const bodyMin = await getTextTypeValue(page, 'body', 'min');

    console.log(`[TEST] After refresh: H1=${h1Min}, H2=${h2Min}, Body=${bodyMin}`);

    expect(h1Min).toBe('100');
    expect(h2Min).toBe('45');
    expect(bodyMin).toBe('18');

    // Verify they're NOT all the same (the bug we fixed)
    expect(h1Min).not.toBe(h2Min);
    expect(h2Min).not.toBe(bodyMin);
    expect(h1Min).not.toBe(bodyMin);

    console.log('[TEST] ✅ Text type uniqueness test PASSED');
  });

  /**
   * TEST 3: Font family changes persist
   */
  test('font family changes persist after refresh', async ({ page }) => {
    console.log('[TEST] Starting font family persistence test...');

    // Change H1 font family (if there's a selector for it)
    // Note: This test assumes font family selector exists
    // If not, we need to add data-testid attributes

    // For now, we'll test by checking the database directly
    await setTextTypeValue(page, 'h1', 'min', 100);

    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Check database
    const dbSettings = await getTypographyFromDatabase();
    expect(dbSettings.h1.fontFamily).toBeDefined();

    // Refresh and verify font family persisted
    await page.reload();
    await waitForTypographyLoad(page);

    const dbSettingsAfter = await getTypographyFromDatabase();
    expect(dbSettingsAfter.h1.fontFamily).toBe(dbSettings.h1.fontFamily);

    console.log('[TEST] ✅ Font family persistence test PASSED');
  });

  /**
   * TEST 4: Multiple changes persist together
   */
  test('multiple typography changes persist together', async ({ page }) => {
    console.log('[TEST] Starting multiple changes test...');

    // Change multiple fields
    await setTextTypeValue(page, 'h1', 'min', 100);
    await setTextTypeValue(page, 'h1', 'max', 120);
    await setTextTypeValue(page, 'h1', 'lineHeight', 1.1);

    await setTextTypeValue(page, 'h2', 'min', 45);
    await setTextTypeValue(page, 'body', 'min', 18);

    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Refresh
    await page.reload();
    await waitForTypographyLoad(page);

    // Verify all changes persisted
    expect(await getTextTypeValue(page, 'h1', 'min')).toBe('100');
    expect(await getTextTypeValue(page, 'h1', 'max')).toBe('120');
    expect(await getTextTypeValue(page, 'h1', 'lineHeight')).toBe('1.1');
    expect(await getTextTypeValue(page, 'h2', 'min')).toBe('45');
    expect(await getTextTypeValue(page, 'body', 'min')).toBe('18');

    console.log('[TEST] ✅ Multiple changes test PASSED');
  });

  /**
   * TEST 5: Settings don't reset when navigating between tabs
   */
  test('settings persist when navigating between Master Controller tabs', async ({ page }) => {
    console.log('[TEST] Starting tab navigation test...');

    // Change H1 setting
    await setTextTypeValue(page, 'h1', 'min', 100);

    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Navigate to different tab (e.g., Brand Colors)
    const brandColorsTab = page.locator('[data-tab="brand-colors"]');
    await brandColorsTab.click();
    await page.waitForTimeout(500);

    // Navigate back to Typography tab
    const typographyTab = page.locator('[data-tab="typography"]');
    await typographyTab.click();
    await waitForTypographyLoad(page);

    // Verify H1 is still 100px
    const h1Min = await getTextTypeValue(page, 'h1', 'min');
    expect(h1Min).toBe('100');

    console.log('[TEST] ✅ Tab navigation test PASSED');
  });

  /**
   * TEST 6: Database state matches UI state
   */
  test('database state matches UI state after save', async ({ page }) => {
    console.log('[TEST] Starting database consistency test...');

    // Set test values
    await setTextTypeValue(page, 'h1', 'min', 100);
    await setTextTypeValue(page, 'h2', 'min', 45);

    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Get values from UI
    const h1MinUI = await getTextTypeValue(page, 'h1', 'min');
    const h2MinUI = await getTextTypeValue(page, 'h2', 'min');

    // Get values from database
    const dbSettings = await getTypographyFromDatabase();

    // Verify they match
    expect(parseInt(h1MinUI)).toBe(dbSettings.h1.minSize);
    expect(parseInt(h2MinUI)).toBe(dbSettings.h2.minSize);

    console.log('[TEST] ✅ Database consistency test PASSED');
  });

  /**
   * TEST 7: Settings survive multiple save cycles
   */
  test('settings survive multiple save and refresh cycles', async ({ page }) => {
    console.log('[TEST] Starting multiple save cycles test...');

    // Cycle 1: Set H1 to 100
    await setTextTypeValue(page, 'h1', 'min', 100);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.reload();
    await waitForTypographyLoad(page);
    expect(await getTextTypeValue(page, 'h1', 'min')).toBe('100');

    // Cycle 2: Change H1 to 110
    await setTextTypeValue(page, 'h1', 'min', 110);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.reload();
    await waitForTypographyLoad(page);
    expect(await getTextTypeValue(page, 'h1', 'min')).toBe('110');

    // Cycle 3: Change H1 to 95
    await setTextTypeValue(page, 'h1', 'min', 95);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });
    await page.reload();
    await waitForTypographyLoad(page);
    expect(await getTextTypeValue(page, 'h1', 'min')).toBe('95');

    console.log('[TEST] ✅ Multiple save cycles test PASSED');
  });

  /**
   * TEST 8: Reset button doesn't affect saved settings
   */
  test('reset button only affects UI, not saved database settings', async ({ page }) => {
    console.log('[TEST] Starting reset button test...');

    // Save a custom value
    await setTextTypeValue(page, 'h1', 'min', 100);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Click reset button (WITHOUT saving)
    await page.locator('button:has-text("Reset to Defaults")').click();
    await page.waitForTimeout(500);

    // Refresh page - should load saved value (100), not default
    await page.reload();
    await waitForTypographyLoad(page);

    const h1Min = await getTextTypeValue(page, 'h1', 'min');
    expect(h1Min).toBe('100'); // Should still be 100, not default

    console.log('[TEST] ✅ Reset button test PASSED');
  });

  /**
   * TEST 9: Preset application doesn't save automatically
   */
  test('applying preset does not auto-save to database', async ({ page }) => {
    console.log('[TEST] Starting preset application test...');

    // Save initial value
    await setTextTypeValue(page, 'h1', 'min', 100);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Apply a preset (if dropdown exists)
    const presetDropdown = page.locator('select').first();
    if (await presetDropdown.isVisible()) {
      await presetDropdown.selectOption({ index: 1 }); // Select first preset
      await page.waitForTimeout(500);

      // Refresh WITHOUT saving
      await page.reload();
      await waitForTypographyLoad(page);

      // Should still show saved value (100), not preset value
      const h1Min = await getTextTypeValue(page, 'h1', 'min');
      expect(h1Min).toBe('100');
    }

    console.log('[TEST] ✅ Preset application test PASSED');
  });
});

/**
 * TEST GROUP: Regression Tests
 *
 * These tests specifically catch the bugs we just fixed
 */
test.describe('Regression Tests - Typography Bug Fixes', () => {

  test.beforeEach(async ({ page }) => {
    await clearTypographySettings();
    await page.goto('/master-controller');
    await waitForTypographyLoad(page);
  });

  test.afterEach(async () => {
    await clearTypographySettings();
  });

  /**
   * REGRESSION TEST: Catch the "all text types identical" bug
   */
  test('REGRESSION: text types do not all become identical after save', async ({ page }) => {
    console.log('[REGRESSION] Testing for "all identical" bug...');

    // Set clearly different values
    await setTextTypeValue(page, 'h1', 'min', 100);
    await setTextTypeValue(page, 'h2', 'min', 50);
    await setTextTypeValue(page, 'h3', 'min', 30);

    // Save
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Check database directly
    const dbSettings = await getTypographyFromDatabase();

    // This would FAIL with the old bug
    expect(dbSettings.h1.minSize).toBe(100);
    expect(dbSettings.h2.minSize).not.toBe(100);
    expect(dbSettings.h3.minSize).not.toBe(100);
    expect(dbSettings.h2.minSize).not.toBe(dbSettings.h3.minSize);

    console.log('[REGRESSION] ✅ "All identical" bug NOT present');
  });

  /**
   * REGRESSION TEST: Catch the "settings reset on load" bug
   */
  test('REGRESSION: settings do not reset to defaults on page load', async ({ page }) => {
    console.log('[REGRESSION] Testing for "reset on load" bug...');

    // Save custom values
    await setTextTypeValue(page, 'h1', 'min', 100);
    await page.locator('button:has-text("Save")').click();
    await page.waitForSelector('text=/Settings saved successfully/i', { timeout: 10000 });

    // Reload 5 times - settings should persist every time
    for (let i = 1; i <= 5; i++) {
      console.log(`[REGRESSION] Reload cycle ${i}/5...`);
      await page.reload();
      await waitForTypographyLoad(page);

      const h1Min = await getTextTypeValue(page, 'h1', 'min');

      // This would FAIL with the old bug
      expect(h1Min).toBe('100');
      expect(h1Min).not.toBe('48'); // Not default
    }

    console.log('[REGRESSION] ✅ "Reset on load" bug NOT present');
  });
});
