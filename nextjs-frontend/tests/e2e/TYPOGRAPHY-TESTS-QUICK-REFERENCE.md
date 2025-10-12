# Typography Tests - Quick Reference Card

## 🚀 Run Tests (3 Ways)

### Method 1: Direct Playwright
```bash
cd /home/claude-flow/nextjs-frontend
npx playwright test master-controller-typography-persistence
```

### Method 2: With npm script (after adding to package.json)
```bash
npm run test:typography
```

### Method 3: Pre-deployment check
```bash
bash scripts/pre-deploy-tests.sh
```

---

## 🐛 Debug Failed Tests

### Run with UI
```bash
npx playwright test master-controller-typography-persistence --ui
```

### Run in debug mode (step through)
```bash
npx playwright test master-controller-typography-persistence --debug
```

### View trace file
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

---

## 📊 What Tests Catch

| Test | What It Catches |
|------|----------------|
| Settings persist after save | Settings reset to defaults |
| All values unique | "All identical" bug |
| Font family persists | Font selections don't save |
| Multiple changes persist | Complex state not saving |
| Tab navigation | State loss during navigation |
| Database matches UI | Sync issues |
| Multiple save cycles | Degradation over time |
| Reset button | Unwanted saves |
| Preset application | Auto-save bug |
| REGRESSION #1 | All values identical bug |
| REGRESSION #2 | Reset on load bug |

---

## 🔧 Environment Setup

### Required .env variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Install Playwright (first time only)
```bash
npx playwright install --with-deps chromium
```

---

## 📝 Add npm Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test:typography": "playwright test master-controller-typography-persistence",
    "test:typography:ui": "playwright test master-controller-typography-persistence --ui",
    "test:typography:debug": "playwright test master-controller-typography-persistence --debug",
    "test:typography:report": "playwright test master-controller-typography-persistence --reporter=html && playwright show-report",
    "test:pre-deploy": "bash scripts/pre-deploy-tests.sh"
  }
}
```

---

## ✅ Success Output

```
✓ typography settings persist after save and page refresh (5s)
✓ all text types maintain unique values after save (4s)
✓ font family changes persist after refresh (3s)
✓ multiple typography changes persist together (6s)
✓ settings persist when navigating between tabs (4s)
✓ database state matches UI state after save (3s)
✓ settings survive multiple save and refresh cycles (8s)
✓ reset button only affects UI (4s)
✓ applying preset does not auto-save (4s)
✓ REGRESSION: text types not all identical (3s)
✓ REGRESSION: settings don't reset on load (7s)

11 passed (51s)
```

---

## ❌ Failure Output

```
✗ typography settings persist after save and page refresh (5s)

Error: expect(received).toBe(expected)

Expected: "100"
Received: "48"

[TEST] ❌ Settings RESET TO DEFAULTS - BUG DETECTED
```

**Action:** Fix bug before deployment!

---

## 🔔 Automated Alerts

### GitHub Actions
- Runs on every push to `main`
- Comments on pull requests
- Blocks merge if tests fail

### Slack (if configured)
```
🚨 CRITICAL TEST FAILURE
Typography settings NOT persisting!
DO NOT DEPLOY until fixed.
```

### Deployment Blocker
```bash
❌ Typography persistence tests FAILED
🛑 DO NOT DEPLOY until tests pass
Exit code: 1
```

---

## 📚 Documentation

- **Main README:** `/tests/e2e/README-TYPOGRAPHY-TESTS.md`
- **Execution Summary:** `/tests/e2e/TYPOGRAPHY-TEST-EXECUTION-SUMMARY.md`
- **Complete Deliverables:** `/TYPOGRAPHY-TESTS-DELIVERABLES.md`
- **This Card:** `/tests/e2e/TYPOGRAPHY-TESTS-QUICK-REFERENCE.md`

---

## 🆘 Common Issues

### Issue: Tests fail with "Environment variable not set"
**Fix:** Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Issue: Tests timeout
**Fix:** Ensure Next.js dev server can start on port 3000

### Issue: Database connection fails
**Fix:** Check Supabase URL and service role key are correct

### Issue: All tests fail
**Fix:** Run `npx playwright install --with-deps chromium`

---

## 🎯 Files Created

1. `/tests/e2e/master-controller-typography-persistence.spec.ts` - Main test file
2. `/tests/e2e/README-TYPOGRAPHY-TESTS.md` - Comprehensive docs
3. `/tests/e2e/TYPOGRAPHY-TEST-EXECUTION-SUMMARY.md` - Execution guide
4. `/.github/workflows/typography-persistence-tests.yml` - CI/CD workflow
5. `/scripts/pre-deploy-tests.sh` - Pre-deployment script
6. `/TYPOGRAPHY-TESTS-DELIVERABLES.md` - Complete overview
7. **This file** - Quick reference card

---

## ⚡ TL;DR

```bash
# 1. Add npm scripts to package.json (see above)
# 2. Set environment variables in .env.local
# 3. Run tests
npm run test:typography

# 4. Before deployment
npm run test:pre-deploy
```

**If tests fail, DO NOT DEPLOY!**

---

**Print this card and keep it handy!** 📌
