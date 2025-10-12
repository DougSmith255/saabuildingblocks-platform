#!/bin/bash

###############################################################################
# Pre-Deployment Test Script
#
# Runs critical E2E tests before deployment to catch bugs early
#
# Usage:
#   bash scripts/pre-deploy-tests.sh
#
# Exit codes:
#   0 - All tests passed, safe to deploy
#   1 - Tests failed, DO NOT DEPLOY
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "================================================================"
echo "🧪 PRE-DEPLOYMENT TEST SUITE"
echo "================================================================"
echo ""

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Missing environment variables${NC}"
  echo "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo "✓ Environment variables configured"
echo ""

# Check if Playwright is installed
if ! command -v npx playwright &> /dev/null; then
  echo -e "${YELLOW}⚠️  Playwright not found, installing...${NC}"
  npx playwright install --with-deps chromium
fi

echo "✓ Playwright installed"
echo ""

# Run typography persistence tests
echo "================================================================"
echo "📝 Running Typography Persistence Tests"
echo "================================================================"
echo ""

if npx playwright test master-controller-typography-persistence \
  --project=chromium \
  --reporter=list; then

  echo ""
  echo -e "${GREEN}✅ Typography persistence tests PASSED${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Typography persistence tests FAILED${NC}"
  echo ""
  echo "🚨 CRITICAL ERROR: Typography settings will NOT persist for users!"
  echo ""
  echo "🛑 DEPLOYMENT BLOCKED"
  echo ""
  echo "Action Required:"
  echo "  1. Review failed test output above"
  echo "  2. Check /api/master-controller/typography route"
  echo "  3. Verify database writes in Supabase"
  echo "  4. Fix bugs and re-run this script"
  echo ""
  echo "DO NOT DEPLOY until all tests pass!"
  echo ""
  exit 1
fi

# Run other critical tests (add more as needed)
echo "================================================================"
echo "🔍 Running Additional Critical Tests"
echo "================================================================"
echo ""

# Example: Run auth tests, API tests, etc.
# Add more test suites here as they become critical

echo "✓ All critical tests configured"
echo ""

# All tests passed
echo "================================================================"
echo -e "${GREEN}✅ ALL TESTS PASSED - SAFE TO DEPLOY${NC}"
echo "================================================================"
echo ""
echo "Deployment approved! ✓"
echo ""

exit 0
