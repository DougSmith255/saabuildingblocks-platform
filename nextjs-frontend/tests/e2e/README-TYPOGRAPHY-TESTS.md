# Typography Settings Persistence - E2E Test Documentation

## 🎯 Overview

This test suite **prevents typography settings bugs from reaching production**. These tests would have caught the recent bug where typography settings weren't persisting correctly.

## 📋 Test Coverage

### Critical Tests (Must Pass)

1. **Typography settings persist after save and page refresh**
   - Changes saved to database
   - Settings load correctly on page refresh
   - Settings don't reset to defaults

2. **All text types maintain unique values**
   - H1, H2, H3, etc. have different sizes
   - No "all identical values" bug
   - Each text type maintains its own configuration

3. **Font family changes persist**
   - Font family selections save correctly
   - Font families load from database

4. **Multiple changes persist together**
   - All fields (size, weight, line height) save
   - Complex state changes persist correctly

5. **Tab navigation doesn't reset settings**
   - Settings persist when switching tabs
   - No state loss during navigation

6. **Database state matches UI state**
   - UI reflects database values
   - No sync issues

7. **Multiple save/refresh cycles work**
   - Settings survive multiple updates
   - No degradation over time

8. **Reset button doesn't affect saved settings**
   - Reset only affects UI
   - Database remains unchanged until explicit save

9. **Preset application doesn't auto-save**
   - Presets are preview-only
   - Must explicitly save after applying preset

### Regression Tests

1. **"All identical values" bug**
   - Ensures each text type has unique values
   - Catches the specific bug we just fixed

2. **"Reset on load" bug**
   - Ensures settings don't reset to defaults
   - Catches persistence failures

## 🚀 Running Tests

### Run All Typography Tests

```bash
cd /home/claude-flow/nextjs-frontend
npx playwright test master-controller-typography-persistence
```

### Run Specific Test

```bash
npx playwright test master-controller-typography-persistence -g "typography settings persist after save and page refresh"
```

### Run with UI (Debugging)

```bash
npx playwright test master-controller-typography-persistence --ui
```

### Run in Debug Mode

```bash
npx playwright test master-controller-typography-persistence --debug
```

### Run and Generate Report

```bash
npx playwright test master-controller-typography-persistence --reporter=html
npx playwright show-report
```

## 📊 Test Results Format

### Success Output

```
✓ [chromium] › master-controller-typography-persistence.spec.ts:95:3 › typography settings persist after save and page refresh (5s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:150:3 › all text types maintain unique values after save (4s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:195:3 › font family changes persist after refresh (3s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:235:3 › multiple typography changes persist together (6s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:275:3 › settings persist when navigating between Master Controller tabs (4s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:310:3 › database state matches UI state after save (3s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:345:3 › settings survive multiple save and refresh cycles (8s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:380:3 › reset button only affects UI, not saved database settings (4s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:410:3 › applying preset does not auto-save to database (4s)

Regression Tests:
✓ [chromium] › master-controller-typography-persistence.spec.ts:450:3 › REGRESSION: text types do not all become identical after save (3s)
✓ [chromium] › master-controller-typography-persistence.spec.ts:480:3 › REGRESSION: settings do not reset to defaults on page load (7s)

11 passed (51s)
```

### Failure Output

```
✗ [chromium] › master-controller-typography-persistence.spec.ts:95:3 › typography settings persist after save and page refresh (5s)

  Error: expect(received).toBe(expected) // Object.is equality

  Expected: "100"
  Received: "48"

    at tests/e2e/master-controller-typography-persistence.spec.ts:130:29

  [TEST] ✗ H1 minimum size did NOT persist after refresh
  [TEST] Expected: 100px
  [TEST] Received: 48px (default value)
  [TEST] ❌ Settings RESET TO DEFAULTS - BUG DETECTED
```

## 🔧 Environment Setup

### Required Environment Variables

```bash
# .env.local or .env.test
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Requirements

- Supabase database accessible
- `master_controller_settings` table exists
- Service role key has read/write permissions

### Pre-Test Checklist

- [ ] Supabase database is running
- [ ] Environment variables are set
- [ ] Next.js dev server can start
- [ ] Port 3000 is available

## 🐛 Debugging Failed Tests

### Test Failure: Settings Don't Persist

**Symptom:** Test fails at "Settings persist after save and page refresh"

**Debug Steps:**
1. Check API logs: `console.log` statements in test output
2. Verify database write: Check Supabase dashboard
3. Check API route: `/api/master-controller/typography`
4. Verify Zustand store: Check localStorage sync

**Common Causes:**
- API route not saving to database
- Database upsert failing
- Store not loading from database on mount
- Race condition between save and refresh

### Test Failure: All Values Identical

**Symptom:** Test fails at "All text types maintain unique values"

**Debug Steps:**
1. Check test output for actual values
2. Verify `batchUpdate` function in store
3. Check if `updateTextType` is spreading correctly
4. Look for object reference issues

**Common Causes:**
- Store using same reference for all text types
- Spread operator not creating deep copy
- State mutation instead of immutable update

### Test Failure: Database Mismatch

**Symptom:** Test fails at "Database state matches UI state"

**Debug Steps:**
1. Add `console.log(dbSettings)` before assertion
2. Add `console.log(uiValue)` before assertion
3. Check data type consistency (string vs number)
4. Verify Supabase column types

**Common Causes:**
- Type conversion issues (string/number)
- Missing fields in database
- Incorrect key names
- JSON serialization issues

## 📸 Screenshot on Failure

Tests automatically capture:
- Screenshot of failed state
- Video of test execution (on failure)
- Trace file for debugging

Location: `/home/claude-flow/nextjs-frontend/test-results/`

View trace:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: E2E Tests - Typography Persistence

on:
  push:
    branches: [main, master]
    paths:
      - 'app/master-controller/**'
      - 'app/api/master-controller/typography/**'
      - 'tests/e2e/master-controller-typography-persistence.spec.ts'
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run Typography Persistence Tests
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npx playwright test master-controller-typography-persistence

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

      - name: Notify on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '🚨 Typography persistence tests FAILED! Settings may not be persisting correctly.'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Pre-Commit Hook

```bash
#!/bin/bash
# .husky/pre-commit

# Run typography tests before commit
if git diff --cached --name-only | grep -E "(master-controller|typography)"; then
  echo "🧪 Running typography persistence tests..."
  npx playwright test master-controller-typography-persistence --project=chromium

  if [ $? -ne 0 ]; then
    echo "❌ Typography tests failed. Commit blocked."
    exit 1
  fi
fi
```

### Pre-Deploy Hook

```bash
#!/bin/bash
# scripts/pre-deploy.sh

echo "🧪 Running critical E2E tests before deployment..."

# Run typography persistence tests
npx playwright test master-controller-typography-persistence --project=chromium

if [ $? -ne 0 ]; then
  echo "❌ Typography persistence tests FAILED"
  echo "🛑 Deployment blocked - typography settings won't persist correctly"
  exit 1
fi

echo "✅ All critical tests passed - safe to deploy"
```

## 🔔 Alerting & Notifications

### Slack Notification Format

```
🚨 CRITICAL TEST FAILURE

Test: Typography Settings Persistence
Environment: Production
Status: FAILED ❌

Failed Test: "typography settings persist after save and page refresh"
Error: Settings reset to defaults after page refresh

Expected: H1 min size = 100px
Received: H1 min size = 48px (default)

🔍 Debug:
- Check /api/master-controller/typography route
- Verify Supabase database writes
- Review Zustand store load logic

📊 View full report: [Link to Playwright HTML Report]
🎥 View video: [Link to test recording]
📸 Screenshot: [Link to failure screenshot]

Action Required: Fix immediately - typography settings not persisting for users!
```

### Email Notification Template

```
Subject: 🚨 CRITICAL: Typography Persistence Tests Failed

Body:
The typography settings persistence tests have FAILED.

This means typography settings are NOT saving correctly,
and users will lose their customizations on page refresh.

Test Results: 1/11 failed
Failed Test: Typography settings persist after save and page refresh

Impact: HIGH - User settings not persisting
Severity: CRITICAL - Breaks Master Controller core functionality

Action Required:
1. Review failed test output
2. Check /api/master-controller/typography route
3. Verify database writes
4. Fix and re-run tests before deployment

View full report: [Link]
```

## 📝 Test Maintenance

### When to Update Tests

- **Add new text types**: Update `TEXT_TYPES` array
- **Change API endpoint**: Update fetch URLs
- **Add new typography fields**: Add test cases
- **Modify database schema**: Update database queries

### Test Ownership

- **Owner**: QA Team + Frontend Team
- **Reviewer**: Senior Frontend Developer
- **Notify on Failure**: @frontend-team, @qa-team

## 🎓 Learning from Bugs

### Bug This Test Suite Prevents

**Bug:** Typography settings didn't persist after save and page refresh.

**Root Cause:**
- Store loading from localStorage instead of database
- API not called on component mount
- Race condition between localStorage and database

**How Test Catches It:**
1. Test changes value to non-default (100px)
2. Test saves to database
3. Test refreshes page
4. Test verifies value is still 100px (NOT default 48px)
5. Test FAILS if value reset to default

**Why It's Important:**
- Without this test, bug reached production
- Users lost customizations on every refresh
- Master Controller became unusable
- Manual testing couldn't catch edge cases

## 🚀 Quick Reference Commands

```bash
# Run all typography tests
npm run test:typography

# Run with UI
npm run test:typography:ui

# Run in debug mode
npm run test:typography:debug

# Generate HTML report
npm run test:typography:report

# Run only regression tests
npx playwright test -g "REGRESSION"

# Run on specific browser
npx playwright test master-controller-typography-persistence --project=chromium
```

Add these to `package.json`:

```json
{
  "scripts": {
    "test:typography": "playwright test master-controller-typography-persistence",
    "test:typography:ui": "playwright test master-controller-typography-persistence --ui",
    "test:typography:debug": "playwright test master-controller-typography-persistence --debug",
    "test:typography:report": "playwright test master-controller-typography-persistence --reporter=html && playwright show-report"
  }
}
```

## ✅ Success Criteria

Tests are considered passing when:

1. **All 11 tests pass** in Chromium
2. **Test run time < 60 seconds**
3. **No flaky tests** (pass 3 times in a row)
4. **Database cleanup successful** (no orphaned records)
5. **Screenshots on failure** are captured

## 🔒 Security Notes

- Tests use `SUPABASE_SERVICE_ROLE_KEY` - **NEVER commit to repo**
- Environment variables must be in `.env.local` or CI secrets
- Test database should be separate from production
- Clean up test data after each run

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Typography Store Implementation](/app/master-controller/stores/typographyStore.ts)
- [Typography API Route](/app/api/master-controller/typography/route.ts)

---

**Last Updated:** 2025-10-12
**Maintained By:** QA Team + Frontend Team
**Questions?** Contact @frontend-team
