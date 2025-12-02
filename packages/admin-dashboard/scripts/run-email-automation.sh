#!/bin/bash
#
# Email Automation Runner
# Loads environment variables and runs the email automation script
#

# Change to script directory
cd /home/claude-flow/packages/admin-dashboard

# Manually set required environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://edpsaqcsoeccioapglhi.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHNhcWNzb2VjY2lvYXBnbGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMzMDM3MSwiZXhwIjoyMDc0OTA2MzcxfQ.ne-D8B6J9g-ktxJMSQzbwozAdKAtmYxg0h2Lyq3BKFc"
export GHL_API_KEY="pit-7a10b4b4-ddb7-45a4-8460-ff2d36fbd407"
export GHL_LOCATION_ID="wmYRsn57bNL8Z2tMlIZ7"

# Run the automation script
npx tsx scripts/email-automation.ts >> /var/log/email-automation.log 2>&1

# Exit with the script's exit code
exit $?
