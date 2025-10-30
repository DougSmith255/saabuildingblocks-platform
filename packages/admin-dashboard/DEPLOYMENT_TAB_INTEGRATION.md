# Deployment Tab - Integration Guide

## Overview

The Deployment Tab provides a centralized UI in Master Controller for:
1. **CSS Regeneration** - Generate static CSS from Master Controller settings stored in Supabase
2. **Cloudflare Deployment** - Deploy to Cloudflare Pages global CDN via GitHub Actions

## Files Created/Modified

### New Files

1. **Component:**
   - `/home/claude-flow/packages/admin-dashboard/app/master-controller/components/tabs/DeploymentTab.tsx`
   - Main UI component with CSS regeneration and deployment controls

### Modified Files

1. **Master Controller Page:**
   - `/home/claude-flow/packages/admin-dashboard/app/master-controller/page.tsx`
   - Added 'deployment' tab type
   - Added Rocket icon import
   - Added DeploymentTab dynamic import
   - Added tab to navigation array
   - Added tab render condition

## Existing API Routes (Already Implemented)

The following API routes already exist and are fully functional:

1. **`POST /api/master-controller/regenerate-css`**
   - Executes `npm run generate:css` in public-site package
   - Reads typography + colors from Supabase
   - Generates `/public/static-master-controller.css`
   - Returns: file stats (size, source, timestamp, duration)

2. **`GET /api/master-controller/regenerate-css`**
   - Returns current CSS file stats without regenerating
   - Used for initial load

3. **`POST /api/master-controller/deploy`**
   - Triggers GitHub Actions workflow: `.github/workflows/deploy-cloudflare.yml`
   - Uses `workflow_dispatch` event
   - Logs to Supabase `deployment_logs` table
   - Rate limited: 1 deploy per 5 minutes
   - Returns: workflow URL for progress tracking

4. **`GET /api/master-controller/deploy`**
   - Returns rate limit status (can deploy, remaining seconds)
   - Returns recent deployments from `deployment_logs` table
   - Used for deployment history display

## UI Features

### CSS Generation Section
- **Regenerate CSS Button** - Triggers static CSS generation
- **Real-time Status** - Shows last generation timestamp, file size, source
- **Loading States** - Spinner while regenerating
- **Success/Error Messages** - Toast-style notifications

### Deployment Section
- **Deploy to Cloudflare Button** - Triggers GitHub Actions workflow
- **Last Deployment Status** - Shows most recent deployment (pending/success/failed)
- **Rate Limiting UI** - Shows remaining cooldown time (5 minutes)
- **Workflow URL** - Link to GitHub Actions for progress tracking

### Deployment History Table
- **Last 5 Deployments** - Timestamp, status, duration, URL
- **Status Icons** - CheckCircle (success), XCircle (failed), Clock (pending)
- **Error Details** - Shows error message for failed deployments

## Styling Consistency

The DeploymentTab matches existing Master Controller styling:

- **Glass morphism cards** with `backdrop-filter: blur(8px)`
- **Gold accents** (`#ffd700`) for primary actions
- **Green accents** (`#00ff88`) for success states
- **Dark backgrounds** (`#191818`, `#404040`)
- **Consistent typography** with clamp() sizing
- **Lucide icons** for consistency

## Data Flow

### CSS Regeneration Flow
```
User clicks "Regenerate CSS"
  ↓
POST /api/master-controller/regenerate-css
  ↓
npm run generate:css in public-site
  ↓
Read Supabase (typography + colors)
  ↓
Generate public/static-master-controller.css
  ↓
Return stats (size, source, timestamp)
  ↓
UI updates with new stats
```

### Deployment Flow
```
User clicks "Deploy to Cloudflare"
  ↓
POST /api/master-controller/deploy
  ↓
Check rate limit (5 min cooldown)
  ↓
Trigger GitHub Actions workflow_dispatch
  ↓
Log to Supabase deployment_logs
  ↓
Return workflow URL
  ↓
UI shows success + link to GitHub
  ↓
(After 3 seconds) Reload deployment history
```

## Environment Variables Required

These must be set for deployment to work:

```env
# GitHub API (for triggering workflows)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=DougSmith255
GITHUB_REPO=saabuildingblocks-platform

# Supabase (for logging and settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Cloudflare (used by GitHub Actions workflow)
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
```

## Database Schema (Supabase)

The API relies on existing Supabase tables:

### `deployment_logs` Table
```sql
CREATE TABLE deployment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trigger_type TEXT NOT NULL, -- 'deploy' | 'css-regenerate'
  status TEXT NOT NULL,        -- 'triggered' | 'success' | 'error'
  duration INTEGER,            -- milliseconds
  metadata JSONB               -- deployment details
);
```

### `master_controller` Table
```sql
-- Typography settings
INSERT INTO master_controller (key, value) VALUES ('typography', '{...}');

-- Brand colors
INSERT INTO master_controller (key, value) VALUES ('brand_colors', '{...}');

-- Spacing settings
INSERT INTO master_controller (key, value) VALUES ('spacing', '{...}');
```

## Testing Checklist

### Manual Testing

1. **CSS Regeneration:**
   - [ ] Click "Regenerate CSS"
   - [ ] Verify loading spinner shows
   - [ ] Verify success message appears
   - [ ] Verify stats update (size, source, timestamp)
   - [ ] Verify file exists at `public-site/public/static-master-controller.css`

2. **Deployment:**
   - [ ] Click "Deploy to Cloudflare"
   - [ ] Verify loading state shows
   - [ ] Verify success message with workflow URL
   - [ ] Verify GitHub Actions workflow starts
   - [ ] Verify deployment history updates after 3 seconds
   - [ ] Try deploying again immediately → verify rate limit message

3. **UI/UX:**
   - [ ] Verify glass morphism styling matches other tabs
   - [ ] Verify responsive layout on mobile
   - [ ] Verify icons display correctly (Lucide icons)
   - [ ] Verify status colors (gold, green, red) are correct
   - [ ] Verify table scrolls horizontally on mobile

### Error Scenarios

1. **CSS Generation Fails:**
   - [ ] Verify error message shows
   - [ ] Verify error persists for 7 seconds
   - [ ] Verify button re-enables

2. **Deployment Rate Limited:**
   - [ ] Deploy twice within 5 minutes
   - [ ] Verify rate limit message shows remaining seconds
   - [ ] Verify button stays disabled

3. **Deployment Fails:**
   - [ ] Trigger with invalid GITHUB_TOKEN
   - [ ] Verify error message shows
   - [ ] Verify error logs to deployment_logs

## Integration with Existing System

### Fits into Dual Deployment Architecture

The Deployment Tab is the **UI interface** for the existing dual deployment system:

1. **VPS Deployment (admin-dashboard):**
   - Master Controller runs here
   - Deployment Tab UI accessible at `/master-controller?tab=deployment`
   - Admin triggers CSS regeneration + deployment manually

2. **Cloudflare Pages Deployment (public-site):**
   - Static CSS generated by admin
   - Deployed via GitHub Actions workflow
   - Distributed to 300+ edge locations

### Workflow Integration

The Deployment Tab triggers the existing GitHub Actions workflow:

```yaml
# .github/workflows/deploy-cloudflare.yml
name: Deploy to Cloudflare Pages
on:
  workflow_dispatch:
    inputs:
      deployment_type:
        type: choice
        options: [incremental, full]
      skip_build_cache:
        type: boolean
      triggered_by:
        type: string
```

## Troubleshooting

### CSS Regeneration Not Working

**Symptoms:** Button clicks but no CSS generated

**Debugging:**
```bash
# Check if public-site has generate:css script
cd /home/claude-flow/packages/public-site
npm run generate:css

# Check Supabase connection
curl "https://YOUR_SUPABASE_URL/rest/v1/master_controller?key=eq.typography" \
  -H "apikey: YOUR_ANON_KEY"

# Check API logs
tail -f /home/claude-flow/packages/admin-dashboard/.next/server/app/api/master-controller/regenerate-css/route.log
```

### Deployment Not Triggering

**Symptoms:** Button clicks but workflow doesn't start

**Debugging:**
```bash
# Verify GitHub token has repo scope
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/user

# Verify workflow file exists
gh api repos/DougSmith255/saabuildingblocks-platform/actions/workflows

# Check rate limiting
curl http://localhost:3000/api/master-controller/deploy
```

### Deployment History Not Loading

**Symptoms:** Empty table despite deployments

**Debugging:**
```sql
-- Check deployment_logs table
SELECT * FROM deployment_logs
WHERE trigger_type = 'deploy'
ORDER BY created_at DESC
LIMIT 5;

-- Check table permissions
SELECT * FROM pg_policies WHERE tablename = 'deployment_logs';
```

## Future Enhancements

Potential improvements (not yet implemented):

1. **Real-time Deployment Status:**
   - Poll GitHub API for workflow run status
   - Show progress bar (queued → running → completed)
   - WebSocket for live updates

2. **Deployment Queue:**
   - Queue multiple deployments
   - Show pending deployments
   - Cancel queued deployments

3. **Automated Deployments:**
   - Auto-deploy on Master Controller save
   - Schedule deployments (e.g., daily at 2am)
   - Webhook from Supabase on settings change

4. **Deployment Rollback:**
   - List previous deployments with links
   - One-click rollback to previous version
   - Diff view (compare deployments)

5. **Multi-Environment Support:**
   - Deploy to staging first
   - Promote staging to production
   - Environment-specific settings

## Support

For issues or questions:
- Check API logs: `/api/master-controller/*`
- Check GitHub Actions logs: https://github.com/DougSmith255/saabuildingblocks-platform/actions
- Check Supabase logs: Supabase Dashboard → Logs
- Review CLAUDE.md deployment documentation
