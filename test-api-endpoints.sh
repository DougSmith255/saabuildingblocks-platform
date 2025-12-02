#!/bin/bash

# Email Automation API Testing Script
# Tests all 13 API endpoints

API_BASE="http://localhost:3002/api/email-automations"

echo "================================================"
echo "Email Automation API Endpoint Tests"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local url="$3"
  local data="$4"

  echo -n "Testing: $name... "

  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [[ "$http_code" =~ ^(200|201)$ ]]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    echo "Response: $body"
    ((TESTS_FAILED++))
    return 1
  fi
}

echo "Starting API tests..."
echo ""

# ============================================================================
# Test 1: Categories - List All
# ============================================================================
echo "1. Categories API"
echo "-------------------"
test_endpoint "GET categories" "GET" "$API_BASE/categories"

# ============================================================================
# Test 2: Categories - Get Single (using first category)
# ============================================================================
# First, get the category ID from the list
CATEGORY_ID=$(curl -s "$API_BASE/categories" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CATEGORY_ID" ]; then
  test_endpoint "GET single category" "GET" "$API_BASE/categories/$CATEGORY_ID"
else
  echo -e "${YELLOW}⚠ SKIP${NC} - No categories found for single category test"
fi

# ============================================================================
# Test 3: Templates - List All
# ============================================================================
echo ""
echo "2. Templates API"
echo "-------------------"
test_endpoint "GET templates" "GET" "$API_BASE/templates"

# ============================================================================
# Test 4: Templates - Filter by category
# ============================================================================
if [ -n "$CATEGORY_ID" ]; then
  test_endpoint "GET templates (filtered)" "GET" "$API_BASE/templates?category_id=$CATEGORY_ID"
fi

# ============================================================================
# Test 5: Templates - Get Single
# ============================================================================
TEMPLATE_ID=$(curl -s "$API_BASE/templates" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TEMPLATE_ID" ]; then
  test_endpoint "GET single template" "GET" "$API_BASE/templates/$TEMPLATE_ID"
else
  echo -e "${YELLOW}⚠ SKIP${NC} - No templates found for single template test"
fi

# ============================================================================
# Test 6: Templates - Preview
# ============================================================================
if [ -n "$TEMPLATE_ID" ]; then
  PREVIEW_DATA='{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }'
  test_endpoint "POST template preview" "POST" "$API_BASE/templates/$TEMPLATE_ID/preview" "$PREVIEW_DATA"
fi

# ============================================================================
# Test 7: Schedules - List All
# ============================================================================
echo ""
echo "3. Schedules API"
echo "-------------------"
test_endpoint "GET schedules" "GET" "$API_BASE/schedules"

# ============================================================================
# Test 8: Schedules - Filter upcoming
# ============================================================================
test_endpoint "GET schedules (upcoming)" "GET" "$API_BASE/schedules?upcoming=true"

# ============================================================================
# Test 9: Schedules - Create New (if we have a template)
# ============================================================================
if [ -n "$TEMPLATE_ID" ]; then
  CREATE_SCHEDULE='{
    "template_id": "'$TEMPLATE_ID'",
    "schedule_name": "Test Schedule 2025",
    "schedule_year": 2025,
    "send_time": "09:00:00",
    "timezone": "America/New_York",
    "ghl_tag_filter": "active-downline",
    "auto_calculate_date": true
  }'

  if test_endpoint "POST create schedule" "POST" "$API_BASE/schedules" "$CREATE_SCHEDULE"; then
    # Get the newly created schedule ID
    NEW_SCHEDULE_ID=$(curl -s -X POST -H "Content-Type: application/json" -d "$CREATE_SCHEDULE" "$API_BASE/schedules" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -n "$NEW_SCHEDULE_ID" ]; then
      # Test getting single schedule
      test_endpoint "GET single schedule" "GET" "$API_BASE/schedules/$NEW_SCHEDULE_ID"

      # Clean up: Delete the test schedule
      curl -s -X DELETE "$API_BASE/schedules/$NEW_SCHEDULE_ID" > /dev/null
      echo "   (Test schedule cleaned up)"
    fi
  fi
fi

# ============================================================================
# Test 10: Send Logs - List All
# ============================================================================
echo ""
echo "4. Send Logs API"
echo "-------------------"
test_endpoint "GET send logs" "GET" "$API_BASE/send-logs"

# ============================================================================
# Test 11: Send Logs - Statistics
# ============================================================================
test_endpoint "GET send logs statistics" "GET" "$API_BASE/send-logs/statistics"

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "================================================"
echo "Test Summary"
echo "================================================"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
