# Deployment Tab Setup Guide

## Overview
This guide will help you complete the setup of the new Deployment Tab in Master Controller, which provides centralized control over:
- CSS regeneration from Master Controller settings
- Cloudflare Pages deployments
- WordPress webhook integration

## ✅ Completed Steps
- [x] Backend API routes created (`/api/master-controller/regenerate-css`, `/api/master-controller/deploy`, `/api/webhooks/wordpress`)
- [x] Frontend DeploymentTab component built
- [x] Migration SQL file created
- [x] WordPress webhook documentation created

## 🔧 Required Setup Steps

### Step 1: Add GitHub Token to Environment

**Why needed:** The deployment API needs to trigger GitHub Actions workflows.

1. **Create GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: `SAA Master Controller Deployment`
   - Select scopes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Add token to environment file:**
   ```bash
   # Edit the file
   nano /home/claude-flow/packages/admin-dashboard/.env.local

   # Add this line (replace with your actual token):
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Verify the token is set:**
   ```bash
   cd /home/claude-flow/packages/admin-dashboard
   grep GITHUB_TOKEN .env.local
   ```

### Step 2: Run Database Migration

**Why needed:** The deployment system logs all activities to the `deployment_logs` table.

1. **Open Supabase Dashboard:**
   - Go to https://supabase.com/dashboard
   - Select your project: `edpsaqcsoeccioapglhi`

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and execute the migration SQL:**
   ```bash
   # Option A: Copy from file
   cat /home/claude-flow/packages/admin-dashboard/supabase/migrations/20251030200000_create_deployment_logs.sql

   # Option B: Use the SQL output from run-migration-direct.js (see above)
   ```

4. **Paste into SQL Editor and click "Run"**

5. **Verify table was created:**
   ```sql
   SELECT * FROM deployment_logs LIMIT 1;
   ```

   You should see: "No rows returned" (table exists but is empty) ✅

### Step 3: Restart Admin Dashboard (if running)

**Why needed:** Load the new GitHub token into the environment.

```bash
cd /home/claude-flow/packages/admin-dashboard
pm2 restart nextjs-saa
# or if running in development:
# Press Ctrl+C and run: npm run dev
```

## 🧪 Testing Checklist

### Test 1: CSS Regeneration

1. **Navigate to Master Controller:**
   - URL: https://saabuildingblocks.com/master-controller
   - Or: http://localhost:3000/master-controller (if testing locally)

2. **Go to Deployment tab**

3. **Click "Regenerate Static CSS":**
   - Should see loading state
   - Should see success toast notification
   - Should display file size and timestamp
   - Check terminal logs for execution details

4. **Verify CSS file was updated:**
   ```bash
   ls -lh /home/claude-flow/packages/public-site/public/static-master-controller.css
   # Check the timestamp - should be recent
   ```

5. **Verify CSS contains latest settings:**
   ```bash
   grep "Generated:" /home/claude-flow/packages/public-site/public/static-master-controller.css
   # Should show today's date
   ```

### Test 2: Cloudflare Deployment Trigger

1. **Click "Deploy to Cloudflare":**
   - Should see loading state
   - Should see success toast: "Deployment triggered"
   - If you click again within 5 minutes, should see rate limit message

2. **Verify GitHub Actions workflow was triggered:**
   ```bash
   # Check recent workflow runs
   gh workflow list
   gh run list --workflow=deploy-cloudflare.yml --limit 5
   ```

3. **Check deployment logs in database:**
   - Go to Supabase Dashboard → Table Editor
   - Open `deployment_logs` table
   - Should see entry with:
     - `trigger_type`: 'deploy'
     - `triggered_by`: 'master-controller'
     - `status`: 'triggered'
     - Recent timestamp

### Test 3: Deployment History

1. **In the Deployment tab, scroll to "Recent Deployments" section**

2. **Should see:**
   - Table with your recent actions
   - Columns: Time, Type, Triggered By, Status, Duration
   - Most recent entries at top

3. **Trigger multiple actions to populate history:**
   - Regenerate CSS 2-3 times
   - Try deploying once
   - Refresh page - history should persist

### Test 4: End-to-End Workflow

1. **Make a typography change:**
   - Go to Typography tab
   - Change button size from 20-35px to 22-40px
   - Click "Save Typography Settings"

2. **Deploy the change:**
   - Go to Deployment tab
   - Click "Regenerate Static CSS"
   - Wait for success
   - Click "Deploy to Cloudflare"

3. **Wait for deployment (3-5 minutes):**
   ```bash
   # Monitor GitHub Actions
   gh run watch
   ```

4. **Verify on Cloudflare Pages:**
   - Go to https://saabuildingblocks.pages.dev
   - Inspect button elements
   - Should see new `font-size: clamp(22px, ..., 40px)`

## 🔗 Optional: Update WordPress Plugin

**Current state:** WordPress plugin fires webhook directly to GitHub Actions.

**New option:** Fire webhook to Master Controller instead (provides better logging and control).

### Steps to Update:

1. **In WordPress admin:**
   - Go to Plugins → Editor
   - Select "SAA Auto Rebuild"
   - Find the webhook URL (around line 50)

2. **Change webhook URL:**
   ```php
   // OLD:
   $webhook_url = 'https://api.github.com/repos/...';

   // NEW:
   $webhook_url = 'https://saabuildingblocks.com/api/webhooks/wordpress';
   ```

3. **Test by publishing a blog post:**
   - Create a new post or update existing
   - Publish/update
   - Check Supabase `deployment_logs` - should see entry with `trigger_type: 'blog'`

**Note:** This is optional. The old webhook will continue to work. The new endpoint just provides better visibility.

## 📊 Monitoring & Logs

### View API Logs (PM2):
```bash
pm2 logs nextjs-saa --lines 100
```

### View Deployment Logs (Supabase):
```sql
-- Recent deployments
SELECT * FROM deployment_logs
ORDER BY created_at DESC
LIMIT 10;

-- Failed deployments
SELECT * FROM deployment_logs
WHERE status = 'error'
ORDER BY created_at DESC;

-- Deployment stats
SELECT
  trigger_type,
  status,
  COUNT(*) as count,
  AVG(duration) as avg_duration_ms
FROM deployment_logs
GROUP BY trigger_type, status;
```

### View GitHub Actions:
```bash
# List workflows
gh workflow list

# View recent runs
gh run list --limit 10

# Watch live run
gh run watch
```

## 🐛 Troubleshooting

### Issue: "Failed to trigger deployment"

**Check:**
1. GitHub token is set in `.env.local`
2. Token has correct scopes (`repo`, `workflow`)
3. Token hasn't expired
4. PM2 process restarted after adding token

**Fix:**
```bash
cd /home/claude-flow/packages/admin-dashboard
grep GITHUB_TOKEN .env.local  # Should show token
pm2 restart nextjs-saa        # Reload environment
```

### Issue: "Could not find table 'deployment_logs'"

**Check:**
1. Migration was run successfully in Supabase Dashboard
2. Table exists in public schema

**Fix:**
```sql
-- Run in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'deployment_logs';
```

If returns no rows, re-run the migration SQL.

### Issue: Rate limit message even though 5+ minutes passed

**Check deployment_logs table:**
```sql
SELECT * FROM deployment_logs
WHERE trigger_type = 'deploy'
ORDER BY created_at DESC
LIMIT 1;
```

If timestamp is stuck, manually update:
```sql
UPDATE deployment_logs
SET created_at = NOW() - INTERVAL '10 minutes'
WHERE id = 'paste-id-here';
```

## ✅ Success Criteria

You'll know the setup is complete when:
- [x] GitHub token is in environment and valid
- [x] `deployment_logs` table exists in Supabase
- [x] Admin dashboard restarted with new token
- [x] "Regenerate CSS" button works and updates file
- [x] "Deploy to Cloudflare" button triggers GitHub Actions
- [x] Deployment history displays in UI
- [x] End-to-end workflow (change → regenerate → deploy) completes successfully

## 📚 Related Documentation

- **Deployment Tab Implementation:** `/home/claude-flow/DEPLOYMENT_TAB_IMPLEMENTATION.md`
- **WordPress Webhook Setup:** `/home/claude-flow/DEPLOYMENT_WEBHOOK_SETUP.md`
- **Migration SQL:** `/home/claude-flow/packages/admin-dashboard/supabase/migrations/20251030200000_create_deployment_logs.sql`

## 🎉 What's Next?

Once setup is complete:
1. You can delete the SAA Deploy plugin from WordPress (after updating webhook URL)
2. All deployment control is centralized in Master Controller
3. Full audit trail of all deployments in database
4. No more manual CSS regeneration required!

---

**Questions?** Check PM2 logs or Supabase logs for detailed error messages.
