# Deployment API Setup Guide

**Created:** 2025-10-30
**Purpose:** Backend APIs for Master Controller deployment functionality

---

## Overview

This guide documents the new deployment APIs that enable:
1. CSS regeneration from Master Controller settings
2. Manual Cloudflare deployments via GitHub Actions
3. WordPress webhook integration for automatic deployments

---

## Files Created

### 1. API Routes

#### `/app/api/master-controller/regenerate-css/route.ts`
**Purpose:** Regenerate static CSS from Master Controller settings

**Methods:**
- `POST` - Triggers CSS regeneration
- `GET` - Get status of current CSS file

**POST Response:**
```json
{
  "success": true,
  "message": "CSS regenerated successfully",
  "data": {
    "filePath": "/static-master-controller.css",
    "fileSize": "12KB",
    "fileSizeBytes": 12345,
    "source": "database",
    "timestamp": "2025-10-30T12:00:00Z",
    "duration": "1234ms",
    "generatedAt": "2025-10-30T12:00:00Z"
  }
}
```

**GET Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "filePath": "/static-master-controller.css",
    "fileSize": "12KB",
    "fileSizeBytes": 12345,
    "lastModified": "2025-10-30T12:00:00Z",
    "age": 3600000
  }
}
```

---

#### `/app/api/master-controller/deploy/route.ts`
**Purpose:** Trigger GitHub Actions workflow for Cloudflare deployment

**Methods:**
- `POST` - Trigger deployment workflow
- `GET` - Get deployment status and rate limit info

**Rate Limiting:** 1 deployment per 5 minutes

**POST Request:**
```json
{
  "deploymentType": "incremental",
  "skipBuildCache": false
}
```

**POST Response:**
```json
{
  "success": true,
  "message": "Deployment triggered successfully",
  "data": {
    "workflowUrl": "https://github.com/owner/repo/actions/workflows/deploy-cloudflare.yml",
    "status": "triggered",
    "deploymentType": "incremental",
    "skipBuildCache": false,
    "duration": "234ms",
    "triggeredAt": "2025-10-30T12:00:00Z",
    "note": "Workflow will start shortly. Check GitHub Actions for progress."
  }
}
```

**GET Response:**
```json
{
  "success": true,
  "data": {
    "canDeploy": true,
    "remainingSeconds": 0,
    "lastDeployment": "2025-10-30T11:55:00Z",
    "cooldownMinutes": 5,
    "recentDeployments": [...]
  }
}
```

---

#### `/app/api/webhooks/wordpress/route.ts`
**Purpose:** Receive WordPress blog post publish/update webhooks

**Methods:**
- `POST` - Receive webhook and trigger deployment
- `GET` - Health check endpoint

**POST Request (from WordPress):**
```json
{
  "post_id": 123,
  "post_slug": "my-blog-post",
  "post_title": "My Blog Post",
  "event_type": "publish"
}
```

**POST Response:**
```json
{
  "success": true,
  "message": "Deployment triggered successfully",
  "data": {
    "post_id": 123,
    "post_slug": "my-blog-post",
    "workflowUrl": "https://github.com/owner/repo/actions/workflows/deploy-cloudflare.yml",
    "status": "triggered",
    "duration": "234ms",
    "triggeredAt": "2025-10-30T12:00:00Z"
  }
}
```

---

### 2. Supabase Migration

**File:** `/supabase/migrations/20251030200000_create_deployment_logs.sql`

**Table:** `deployment_logs`

**Columns:**
- `id` (UUID, primary key)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `trigger_type` (text: 'css', 'deploy', 'blog')
- `triggered_by` (text: 'master-controller', 'wordpress', 'manual')
- `user_id` (UUID, optional - for admin-initiated deployments)
- `status` (text: 'triggered', 'running', 'success', 'error', 'cancelled')
- `duration` (integer, milliseconds)
- `metadata` (jsonb)
- `error_message` (text)
- `error_stack` (text)

**Indexes:**
- `idx_deployment_logs_trigger_type`
- `idx_deployment_logs_status`
- `idx_deployment_logs_user_id`
- `idx_deployment_logs_created_at`
- `idx_deployment_logs_triggered_by`

**RLS Policies:**
- Admin users can view all logs
- Admin users can insert logs
- Service role can manage all logs

---

## Environment Variables Required

### `.env.local` (admin-dashboard)

Add the following environment variable:

```bash
# =============================================================================
# GITHUB ACTIONS CONFIGURATION (for deployment APIs)
# =============================================================================
# GitHub Personal Access Token (PAT) for triggering workflows
# Required permissions: repo, workflow
# Generate at: https://github.com/settings/tokens/new
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitHub repository information (already exists in .env.local)
GITHUB_OWNER=DougSmith255
GITHUB_REPO=saabuildingblocks-platform
```

---

## Setup Instructions

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: `Master Controller Deployment API`
3. Expiration: 90 days (or custom)
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. Copy the token (format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Add Token to Environment

```bash
cd /home/claude-flow/packages/admin-dashboard

# Add to .env.local
echo "" >> .env.local
echo "# ==============================================================================" >> .env.local
echo "# GITHUB ACTIONS CONFIGURATION (for deployment APIs)" >> .env.local
echo "# ==============================================================================" >> .env.local
echo "GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE" >> .env.local
```

### Step 3: Run Database Migration

```bash
# Using Supabase CLI
cd /home/claude-flow/packages/admin-dashboard
npx supabase migration up

# OR manually in Supabase Dashboard
# Go to: https://edpsaqcsoeccioapglhi.supabase.co/project/_/sql
# Copy contents of: supabase/migrations/20251030200000_create_deployment_logs.sql
# Execute SQL
```

### Step 4: Restart Admin Dashboard

```bash
# If running with PM2
pm2 restart admin-dashboard

# If running with npm
cd /home/claude-flow/packages/admin-dashboard
npm run dev
```

### Step 5: Test APIs

```bash
# Test CSS regeneration
curl -X POST http://localhost:3001/api/master-controller/regenerate-css \
  -u builder_user:'K8mN#Build7$Q2' \
  -H "Content-Type: application/json"

# Test deployment status
curl -X GET http://localhost:3001/api/master-controller/deploy \
  -u builder_user:'K8mN#Build7$Q2'

# Test WordPress webhook health
curl -X GET http://localhost:3001/api/webhooks/wordpress
```

---

## Security Features

### 1. Authentication
- **Master Controller APIs:** Protected by HTTP Basic Auth (middleware)
- **WordPress Webhook:** Whitelisted in middleware (no auth required)
- **Future:** Add webhook signature validation for WordPress

### 2. Rate Limiting
- **Deployment API:** 1 deployment per 5 minutes
- **CSS Regeneration:** No rate limit (debounced on client-side)

### 3. Authorization
- **Admin Only:** Only admin users can trigger deployments
- **Service Role:** API routes use `SUPABASE_SERVICE_ROLE_KEY` for database operations

### 4. Logging
- All deployment activities logged to `deployment_logs` table
- Includes metadata (post_id, deployment_type, duration, etc.)
- Error tracking with stack traces (development only)

---

## Integration with Master Controller UI

The Master Controller UI will consume these APIs:

### CSS Regeneration
```typescript
// components/tabs/TypographyTab.tsx
const handleRegenCSS = async () => {
  const response = await fetch('/api/master-controller/regenerate-css', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  console.log('CSS regenerated:', result.data);
};
```

### Deploy to Cloudflare
```typescript
// components/DeploymentPanel.tsx
const handleDeploy = async () => {
  const response = await fetch('/api/master-controller/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deploymentType: 'incremental',
      skipBuildCache: false,
    }),
  });
  const result = await response.json();
  console.log('Deployment triggered:', result.data.workflowUrl);
};
```

---

## Monitoring & Debugging

### Check Deployment Logs

```sql
-- Recent deployments
SELECT * FROM deployment_logs
ORDER BY created_at DESC
LIMIT 10;

-- Failed deployments
SELECT * FROM deployment_logs
WHERE status = 'error'
ORDER BY created_at DESC;

-- Deployment statistics
SELECT
  trigger_type,
  status,
  COUNT(*) as count,
  AVG(duration) as avg_duration_ms
FROM deployment_logs
GROUP BY trigger_type, status;
```

### GitHub Workflow Status

Check workflow runs at:
https://github.com/DougSmith255/saabuildingblocks-platform/actions/workflows/deploy-cloudflare.yml

### API Logs

```bash
# Admin Dashboard logs (PM2)
pm2 logs admin-dashboard --lines 50

# Filter for deployment APIs
pm2 logs admin-dashboard --lines 200 | grep -E "(CSS Regeneration|Deploy|WordPress Webhook)"
```

---

## Troubleshooting

### Error: "GitHub token not configured"
**Solution:** Add `GITHUB_TOKEN` to `.env.local` (see Setup Instructions)

### Error: "Rate limit exceeded"
**Solution:** Wait 5 minutes between deployments, or check `GET /api/master-controller/deploy` for remaining time

### Error: "Failed to regenerate CSS"
**Solution:**
1. Check if `public-site` package has `generate:css` script
2. Verify Supabase credentials in `.env.local`
3. Check logs for specific error

### Error: "Failed to log to Supabase"
**Solution:** Non-fatal - deployment still works, but logs not saved. Check Supabase credentials.

---

## Future Enhancements

1. **Webhook Signature Validation**
   - Add HMAC signature verification for WordPress webhooks
   - Prevents unauthorized webhook triggers

2. **Deployment Queue**
   - Queue multiple deployments instead of rate limiting
   - Process sequentially with status tracking

3. **Real-time Status Updates**
   - WebSocket connection for deployment progress
   - Stream GitHub Actions logs to UI

4. **Deployment History UI**
   - Dashboard showing recent deployments
   - Filter by trigger type, status, date range

5. **Auto-deploy on Master Controller Changes**
   - Automatically trigger deployment when typography/colors saved
   - Optional - configurable in settings

---

## Related Documentation

- [Dual Deployment Architecture](/home/claude-flow/docs/DUAL-DEPLOYMENT-ARCHITECTURE.md)
- [Production Safety Rules](/home/claude-flow/docs/PRODUCTION-SAFETY-RULES.md)
- [GitHub Actions Workflow](/home/claude-flow/.github/workflows/deploy-cloudflare.yml)
- [Credential Inventory Report](/home/claude-flow/docs/security/CREDENTIAL_INVENTORY_REPORT.md)

---

## Support

For issues or questions:
1. Check logs: `pm2 logs admin-dashboard`
2. Review GitHub Actions: https://github.com/DougSmith255/saabuildingblocks-platform/actions
3. Check Supabase: https://edpsaqcsoeccioapglhi.supabase.co

---

**Status:** Ready for integration with Master Controller UI
**Next Steps:** Create frontend components to consume these APIs
