# Deployment Tab - Quick Start

## ✅ What's Complete

All code is written and ready. The Deployment Tab provides:
- ✅ **"Regenerate Static CSS" button** - Updates CSS from Master Controller settings
- ✅ **"Deploy to Cloudflare" button** - Triggers GitHub Actions deployment
- ✅ **WordPress webhook endpoint** - Auto-deploys when blog posts published
- ✅ **Deployment history table** - Shows all CSS regenerations and deployments

## 🚀 Quick Setup (5 minutes)

### Step 1: GitHub Token (2 minutes)

```bash
# 1. Create token at: https://github.com/settings/tokens
#    - Name: "SAA Master Controller Deployment"
#    - Scopes: repo, workflow
#
# 2. Copy token and add to environment:

echo 'GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE' >> /home/claude-flow/packages/admin-dashboard/.env.local

# 3. Restart PM2 to load new token:
pm2 restart nextjs-saa
```

### Step 2: Database Migration (2 minutes)

```bash
# 1. Go to: https://supabase.com/dashboard
# 2. Click: SQL Editor → New Query
# 3. Copy SQL from:
cat /home/claude-flow/packages/admin-dashboard/supabase/migrations/20251030200000_create_deployment_logs.sql

# 4. Paste and click "Run"
# 5. Verify with: SELECT * FROM deployment_logs LIMIT 1;
```

### Step 3: Test It (1 minute)

```bash
# 1. Navigate to Master Controller:
#    https://saabuildingblocks.com/master-controller
#
# 2. Click "Deployment" tab
#
# 3. Test "Regenerate Static CSS" button
#    - Should see success toast
#    - Should display file size/timestamp
#
# 4. Test "Deploy to Cloudflare" button
#    - Should see "Deployment triggered" toast
#    - Check GitHub Actions: gh run list
```

## 📖 Detailed Documentation

- **Full setup guide:** `DEPLOYMENT_TAB_SETUP.md`
- **Implementation details:** `DEPLOYMENT_TAB_SUMMARY.md`
- **WordPress integration:** `DEPLOYMENT_WEBHOOK_SETUP.md`

## 🐛 Troubleshooting

**"Failed to trigger deployment"**
```bash
# Check GitHub token is set:
grep GITHUB_TOKEN /home/claude-flow/packages/admin-dashboard/.env.local

# If missing, add it (see Step 1 above)
```

**"Could not find table 'deployment_logs'"**
```bash
# Run the database migration (see Step 2 above)
```

## 🎉 What's Next?

After setup is complete:
1. Change typography/colors in Master Controller
2. Click "Regenerate Static CSS"
3. Click "Deploy to Cloudflare"
4. Wait 3-5 minutes for deployment
5. View changes at https://saabuildingblocks.pages.dev

**No more manual CSS regeneration or GitHub navigation needed!**

---

**Need help?** Check the full setup guide in `DEPLOYMENT_TAB_SETUP.md`
