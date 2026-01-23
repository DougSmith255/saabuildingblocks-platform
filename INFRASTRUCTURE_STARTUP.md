# Infrastructure Startup Guide

**Last Updated:** 2026-01-21
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

## 🚨 SECURITY: Never Expose Dev Server Ports

**Last Incident:** January 2026 - Crypto miner malware infection

### The Attack Vector

Next.js development servers have **Hot Module Replacement (HMR)** endpoints that can be exploited for **Remote Code Execution (RCE)**. If dev server ports (3002, 3003, etc.) are exposed to the internet via firewall rules, attackers can:

1. Exploit HMR WebSocket endpoints
2. Execute arbitrary code on your server
3. Deploy crypto miners that consume 100%+ CPU
4. Create persistence mechanisms (random directories, zombie processes)

### Firewall Rules (CRITICAL!)

**Only these ports should be open to the internet:**

```bash
# Check current rules
sudo ufw status numbered

# REQUIRED configuration:
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Apache)
sudo ufw allow 443/tcp   # HTTPS (Apache)

# BLOCK these (if somehow allowed):
sudo ufw deny 3002/tcp   # Admin dashboard port
sudo ufw deny 3003/tcp   # Public site port
sudo ufw deny 3000/tcp   # Default Next.js port
```

**NEVER run:**
- `ufw allow 3002/tcp`
- `ufw allow 3003/tcp`
- `ufw allow 3000/tcp`

### Why Production Mode is Safe

**Development mode (`npm run dev`):**
- Exposes HMR endpoints (`/__nextjs_*`, `/_next/webpack-hmr`)
- WebSocket connections for hot reloading
- Source maps and debugging info
- **EXPLOITABLE** if port is exposed

**Production mode (`npm start` after `npm run build`):**
- No HMR endpoints
- No WebSocket for hot reloading
- Optimized, minified code
- **Secure** - but still should only bind to localhost

### Correct Setup

The admin-dashboard should:
1. Be built with `npm run build`
2. Run with `npm start` (not `npm run dev`)
3. Bind to `127.0.0.1:3002` (localhost only, set in package.json)
4. Be accessed via Apache reverse proxy on ports 80/443

```
Internet → Apache (443) → ProxyPass → localhost:3002 → Next.js
              ↑
         (only exposed port)
```

### Signs of Crypto Miner Infection

Watch for these indicators:

```bash
# High CPU with no obvious cause
top -c

# Random directory names (malware drops files)
ls -la /home/claude-flow/packages/admin-dashboard/ | grep -E '^d.*[a-zA-Z0-9]{10,}'

# Zombie processes (large numbers)
ps aux | grep -c 'Z'

# Suspicious outbound connections
netstat -an | grep ESTABLISHED

# Processes with random names
ps aux | grep -E '[a-zA-Z0-9]{8,}' | grep -v grep
```

### Recovery Steps (If Infected)

```bash
# 1. Find and kill miners
ps aux | grep -E '[a-zA-Z0-9]{8}' | awk '{print $2}' | xargs -r kill -9

# 2. Remove malware directories (random names)
cd /home/claude-flow/packages/admin-dashboard
find . -maxdepth 1 -type d -name '[a-zA-Z0-9]*' -exec rm -rf {} \; 2>/dev/null

# 3. Check and clean /tmp
rm -rf /tmp/package 2>/dev/null

# 4. Block exposed ports
sudo ufw deny 3002/tcp
sudo ufw deny 3003/tcp

# 5. Stop any dev servers
PM2_HOME=/home/ubuntu/.pm2 pm2 delete public-site 2>/dev/null

# 6. Verify firewall
sudo ufw status

# 7. Monitor for respawn (watch for 5+ minutes)
watch -n 5 'ps aux | head -20; echo "---"; netstat -tlnp | grep -E "3002|3003"'
```

### January 2026 Incident Details

**What happened:**
- Port 3003 was exposed via `ufw allow 3003/tcp`
- Attackers exploited Next.js dev server HMR endpoints
- Deployed crypto miners (`vzqoybipidiy`, `uF6Og2m+`)
- Created 1932+ random directories for persistence
- Backdoor process connecting to `104.243.43.115`
- 1929 zombie processes

**Resolution:**
- Killed all miner processes
- Removed 1932 malware directories
- Blocked ports 3002, 3003
- Verified firewall allows only 22, 80, 443
- System stable after 5+ minutes monitoring

**Lesson:** NEVER expose development server ports to the internet. Always use production builds behind Apache reverse proxy.

---

## Contacts / Escalation

For infrastructure issues, check:
1. PM2 logs: `PM2_HOME=/home/ubuntu/.pm2 pm2 logs`
2. Apache logs: `sudo tail -100 /var/log/apache2/saabuildingblocks_error.log`
3. System logs: `journalctl -xe`
4. **Security check:** `sudo ufw status` - verify only 22, 80, 443 are allowed
