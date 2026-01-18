# Infrastructure Startup Guide

**Last Updated:** 2026-01-18
**Server:** VPS at saabuildingblocks.com

---

## Quick Recovery Commands

If the site is down (503 errors), run these commands:

```bash
# Check PM2 status
PM2_HOME=/home/ubuntu/.pm2 pm2 status

# If no processes running, start the admin-dashboard:
cd /home/claude-flow/packages/admin-dashboard
PM2_HOME=/home/ubuntu/.pm2 pm2 start npm --name "admin-dashboard" -- start
PM2_HOME=/home/ubuntu/.pm2 pm2 save

# Restart Apache if needed
sudo systemctl restart apache2
```

---

## Architecture Overview

```
Internet
    │
    ▼
Apache (port 443, SSL)
    │
    ▼ ProxyPass to 127.0.0.1:3002
    │
PM2 → Next.js admin-dashboard (port 3002)
    │
    ├── /master-controller  → Master Controller UI
    ├── /agent-portal      → Agent Portal (Link Page, etc.)
    └── /api/*             → API routes
```

---

## Key Services

### 1. Apache Web Server
- **Config:** `/etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf`
- **Proxies to:** `http://127.0.0.1:3002`
- **SSL Certs:** Let's Encrypt at `/etc/letsencrypt/live/saabuildingblocks.com/`

```bash
# Check status
sudo systemctl status apache2

# Restart
sudo systemctl restart apache2

# View logs
sudo tail -f /var/log/apache2/saabuildingblocks_error.log
```

### 2. PM2 Process Manager
- **PM2_HOME:** `/home/ubuntu/.pm2` (IMPORTANT: must use this path!)
- **Process:** `admin-dashboard` runs Next.js on port 3002
- **Working Dir:** `/home/claude-flow/packages/admin-dashboard`

```bash
# Always use PM2_HOME for commands
PM2_HOME=/home/ubuntu/.pm2 pm2 status
PM2_HOME=/home/ubuntu/.pm2 pm2 logs admin-dashboard
PM2_HOME=/home/ubuntu/.pm2 pm2 restart admin-dashboard

# Save process list (for auto-restart on reboot)
PM2_HOME=/home/ubuntu/.pm2 pm2 save
```

### 3. Next.js Admin Dashboard
- **Location:** `/home/claude-flow/packages/admin-dashboard`
- **Port:** 3002
- **Start command:** `npm start` (runs `next start -p 3002 --hostname 127.0.0.1`)

---

## Common Issues & Solutions

### Issue: "Service Unavailable" (503)
**Cause:** PM2 process not running
**Solution:**
```bash
cd /home/claude-flow/packages/admin-dashboard
PM2_HOME=/home/ubuntu/.pm2 pm2 start npm --name "admin-dashboard" -- start
PM2_HOME=/home/ubuntu/.pm2 pm2 save
```

### Issue: PM2 shows no processes
**Cause:** Wrong PM2_HOME or PM2 daemon restarted
**Solution:**
```bash
# Resurrect saved processes
PM2_HOME=/home/ubuntu/.pm2 pm2 resurrect

# If that doesn't work, start manually (see above)
```

### Issue: Changes not reflected after deploy
**Cause:** Need to rebuild and restart
**Solution:**
```bash
cd /home/claude-flow/packages/admin-dashboard
npm run build
PM2_HOME=/home/ubuntu/.pm2 pm2 restart admin-dashboard
```

---

## Auto-Start Configuration

PM2 is configured to auto-start on system boot via systemd:
- **Service file:** `/etc/systemd/system/pm2-ubuntu.service`
- **PM2 dump file:** `/home/ubuntu/.pm2/dump.pm2`

If auto-start stops working:
```bash
# Re-enable startup
PM2_HOME=/home/ubuntu/.pm2 pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo systemctl enable pm2-ubuntu
PM2_HOME=/home/ubuntu/.pm2 pm2 save
```

---

## Related Services

- **n8n:** Running on port 8081, accessed via https://n8n.saabuildingblocks.com
- **WordPress (legacy):** https://wp.saabuildingblocks.com
- **Cloudflare Pages:** https://saabuildingblocks.pages.dev (static frontend mirror)

---

## Important Paths

| Path | Purpose |
|------|---------|
| `/home/claude-flow/` | Main project root |
| `/home/claude-flow/packages/admin-dashboard/` | Next.js app |
| `/home/claude-flow/packages/public-site/` | Public site (deployed to Cloudflare) |
| `/home/ubuntu/.pm2/` | PM2 home directory |
| `/var/www/html/` | Apache document root (WordPress) |
| `/etc/apache2/sites-enabled/` | Apache virtual host configs |

---

## Contacts / Escalation

For infrastructure issues, check:
1. PM2 logs: `PM2_HOME=/home/ubuntu/.pm2 pm2 logs`
2. Apache logs: `sudo tail -100 /var/log/apache2/saabuildingblocks_error.log`
3. System logs: `journalctl -xe`
