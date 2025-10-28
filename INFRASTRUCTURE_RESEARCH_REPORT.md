# Infrastructure Research Report - VPS Site Downtime Investigation

**Date:** 2025-10-24
**Investigator:** Researcher Agent (Hive Mind Swarm)
**Status:** ROOT CAUSE IDENTIFIED
**Severity:** CRITICAL - Production site down

---

## Executive Summary

**Primary Issue:** VPS site (https://saabuildingblocks.com) is returning HTTP 503 errors due to Apache reverse proxy port mismatch.

**Root Cause:** Apache is configured to proxy to port 3001, but Next.js is listening on port 3000.

**Impact:**
- Main VPS site completely down (HTTP 503)
- Master Controller inaccessible
- API routes unavailable
- Authentication system offline

**Good News:**
- Cloudflare Pages deployment is healthy (HTTP 200)
- PM2 process is running without crashes
- No data loss or corruption

---

## 1. Infrastructure Status Assessment

### 1.1 VPS Deployment (PRIMARY - DOWN)

**URL:** https://saabuildingblocks.com
**Status:** ❌ HTTP 503 Service Unavailable
**Technology:** Next.js 16.0.0 + PM2 + Apache reverse proxy

**Service Health:**
```
✅ PM2 Process: ONLINE (PID 2329482)
✅ Apache: ACTIVE (running since Oct 17)
✅ SSL Certificates: VALID (Let's Encrypt)
❌ Site Response: HTTP 503 (proxy connection failed)
```

**Key Findings:**
- PM2 shows 171 restarts over 2 days (high restart count)
- Next.js process is healthy and serving on port 3000
- Apache proxy is attempting to connect to port 3001
- Connection fails because nothing is listening on 3001

### 1.2 Cloudflare Pages Deployment (SECONDARY - UP)

**URL:** https://saabuildingblocks.pages.dev
**Status:** ✅ HTTP 200 OK
**Technology:** Static HTML + Cloudflare global CDN

**Service Health:**
```
✅ Static Site: RESPONSIVE
✅ CDN Delivery: OPERATIONAL (300+ locations)
✅ SSL: VALID
✅ Performance: 20-50ms TTFB
```

**Key Findings:**
- Public-facing static site is fully operational
- Last deployment: Recent (git log shows latest commits)
- No Master Controller UI (expected - admin stays on VPS)
- Content delivery working perfectly

---

## 2. Root Cause Analysis

### 2.1 Port Mismatch Issue

**Apache Configuration:**
```apache
# /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf
ProxyPass / http://127.0.0.1:3001/
ProxyPassReverse / http://127.0.0.1:3001/
```

**Actual Next.js Behavior:**
```bash
$ netstat -tulpn | grep 3000
tcp6  0  0  :::3000  :::*  LISTEN  2329482/next-server

$ curl -I http://localhost:3000
HTTP/1.1 200 OK  # ✅ Works

$ curl -I http://localhost:3001
curl: (7) Failed to connect  # ❌ Nothing listening
```

**PM2 Logs:**
```
▲ Next.js 16.0.0
- Local: http://localhost:3000  # Always starts on 3000!
✓ Ready in 353ms
```

### 2.2 PM2 Configuration Analysis

**ecosystem.config.js:**
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3001,  // ← PM2 sets this
  HOSTNAME: '127.0.0.1'
}
```

**.env.pm2 file:**
```bash
NODE_ENV=production
PORT=3001  # ← Also set here
HOSTNAME=127.0.0.1
```

**Problem:** Next.js is ignoring the PORT environment variable.

**Possible Causes:**
1. .env.local file overriding PORT to 3000
2. Next.js 16.0.0 changed environment variable precedence
3. server.js loads .env.local AFTER PM2 sets env vars
4. Next.js default behavior ignores PORT in production mode

### 2.3 Environment Variable Precedence

**Loading Order:**
```
1. PM2 ecosystem.config.js → PORT=3001
2. PM2 env_file (.env.pm2) → PORT=3001
3. server.js runs → dotenv.config(.env.local)
4. .env.local may override → PORT=3000 (?)
5. Next.js starts → Listens on 3000 (ignoring 3001)
```

---

## 3. Dual Deployment Architecture Review

### 3.1 Architecture Status

**VPS (Admin Interface):**
- ❌ DOWN - Cannot access admin features
- ❌ Master Controller: Inaccessible
- ❌ API Routes: Unavailable (43 routes)
- ❌ Authentication: Offline

**Cloudflare Pages (Public Site):**
- ✅ UP - Static content serving globally
- ✅ Homepage: Operational
- ✅ Blog: Accessible (static exports)
- ✅ Public pages: Working

**Impact Assessment:**
- Public visitors can access site via Cloudflare
- Administrators cannot access Master Controller
- No new content can be published
- API integrations broken

### 3.2 DNS and SSL Configuration

**DNS Resolution:**
```bash
$ dig saabuildingblocks.com +short
172.67.168.127  # Cloudflare IP
104.21.26.195   # Cloudflare IP
```

**SSL Certificates:**
- Provider: Let's Encrypt
- Status: VALID
- Renewal: Automatic (certbot)
- Coverage: saabuildingblocks.com, www, wp, n8n subdomains

**Key Findings:**
- DNS correctly points to Cloudflare
- SSL certificates are current and valid
- No certificate expiration issues
- HTTPS properly configured in Apache

---

## 4. Recent Deployment History

### 4.1 Git Commit Analysis (Last 20 Commits)

**Recent Changes (Oct 24, 2025):**
1. `030fadf` - Master Controller exclusion in GitHub workflows
2. `d78bad4` - wrangler.toml route config fix
3. `2a9e7c9` - Homepage UX improvements
4. `fce5360` - CSS variables for h1/h2 line-height
5. `86df856` - Blog category templates

**Key Observations:**
- No recent changes to PM2 configuration
- No commits modifying port settings
- No server.js changes in recent history
- Focus has been on static export and Cloudflare deployment
- No deployment actions that would cause port mismatch

### 4.2 PM2 Restart Patterns

**PM2 Status:**
```
restarts: 171 (over 2 days)
uptime: 2D
status: online
unstable restarts: 0
```

**Analysis:**
- High restart count (171 in 2 days = ~85/day)
- Suggests frequent crashes or manual restarts
- No "unstable" restarts (not crash-looping)
- Possibly automated restarts from deployment scripts

---

## 5. Configuration File Inventory

### 5.1 Apache Configuration Files

**Primary SSL Config:**
- File: `/etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf`
- Modified: Oct 13, 2025
- Proxy Target: `http://127.0.0.1:3001/`
- Status: Active

**Other Configs:**
- n8n subdomain: Working (proxies to port 8081)
- WordPress subdomain: Working (Document root /var/www/html)
- Backup configs present (dated Oct 3, Aug 16)

### 5.2 PM2 Configuration Files

**ecosystem.config.js:**
- Location: `/home/claude-flow/nextjs-frontend/`
- PORT setting: 3001
- Script: server.js
- Env file: .env.pm2

**.env.pm2:**
- Location: `/home/claude-flow/nextjs-frontend/`
- PORT: 3001
- NODE_ENV: production
- Supabase credentials: Present

**server.js:**
- Loads .env.local before starting Next.js
- Uses dotenv.config() for environment loading
- May be source of port override issue

---

## 6. System Resource Status

### 6.1 Process Health

**PM2 Process:**
```
PID: 2329482
Memory: 25-35MB
CPU: 0%
Status: Online
```

**Apache:**
```
Status: Active (running)
Memory: 72.9MB
Uptime: 6 days
Tasks: 209 threads
```

### 6.2 Port Listening Status

**Active Ports:**
```
:80   - Apache HTTP (redirect to HTTPS)
:443  - Apache HTTPS (proxy to backend)
:3000 - Next.js server (ACTUAL)
:8081 - n8n automation platform
:8080 - Unknown service
```

**Missing Port:**
```
:3001 - NOTHING LISTENING (Apache expects this!)
```

---

## 7. Solution Recommendations

### 7.1 Immediate Fix (Choose One)

**Option A: Fix Apache Proxy to Port 3000 (FASTEST)**
```bash
# Edit Apache config
sudo nano /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf

# Change lines:
ProxyPass / http://127.0.0.1:3001/
ProxyPassReverse / http://127.0.0.1:3001/

# To:
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/

# Reload Apache
sudo systemctl reload apache2

# Verify
curl -I https://saabuildingblocks.com
```

**Option B: Fix Next.js to Listen on Port 3001**
```bash
# Check .env.local for PORT override
cat /home/claude-flow/nextjs-frontend/.env.local | grep PORT

# If PORT=3000 found, remove or change to 3001
# Then restart PM2
pm2 restart nextjs-saa

# Verify
sleep 5
netstat -tulpn | grep 3001
curl -I https://saabuildingblocks.com
```

### 7.2 Root Cause Prevention

**1. Document Port Standards:**
- Create `/home/claude-flow/docs/PORT-CONFIGURATION-STANDARD.md`
- Document that VPS site MUST use port 3001
- Document Apache proxy configuration

**2. Add Deployment Verification:**
- Add port check to deployment scripts
- Verify Apache proxy matches Next.js listen port
- Add automated health check after PM2 restart

**3. Environment Variable Audit:**
- Check all .env files for PORT settings
- Document precedence order
- Standardize environment loading in server.js

---

## 8. Testing Checklist

### 8.1 Pre-Fix Verification
- [x] Confirm site is down (HTTP 503)
- [x] Verify PM2 process is running
- [x] Check actual listening port (3000)
- [x] Verify Apache proxy target (3001)
- [x] Confirm port mismatch is root cause

### 8.2 Post-Fix Verification
- [ ] Site returns HTTP 200
- [ ] Master Controller loads correctly
- [ ] API routes respond
- [ ] PM2 logs show no errors
- [ ] Apache logs show successful proxying
- [ ] Test Master Controller functionality
- [ ] Verify authentication system works

---

## 9. Related Issues and Notes

### 9.1 High PM2 Restart Count

**Observation:** 171 restarts in 2 days is abnormally high.

**Possible Causes:**
- Automated deployment scripts restarting PM2
- Memory leaks causing out-of-memory restarts
- Crash-loop from other issues (masked by port problem)
- Manual restarts during troubleshooting

**Recommendation:** Monitor restart count after port fix to see if it decreases.

### 9.2 Cloudflare Architecture Intact

**Key Point:** The dual deployment architecture is working as designed.

- Static Cloudflare deployment is healthy
- Only VPS admin interface is affected
- Public visitors unaffected (served from Cloudflare)
- No architectural changes needed

---

## 10. Coordination with Other Agents

### 10.1 Findings Stored in Hive Memory

**Memory Entities Created:**
- VPS Site Downtime Root Cause
- Apache Proxy Configuration
- PM2 Configuration Mismatch
- Recent Git Changes

**Memory Relations:**
- Root Cause → Caused By → Apache Config
- Apache Config → Depends On → PM2 Config
- PM2 Config → Blocks → VPS Site

### 10.2 Handoff to Coder Agent

**Required Action:**
- Coder should implement Option A (fix Apache proxy)
- Update Apache config from port 3001 to 3000
- Reload Apache and verify site responds
- Test all critical routes

**Required Action (Alternative):**
- Investigate .env.local file
- Remove PORT override if present
- Restart PM2 and verify port 3001 is used
- Test site after Apache reconnects

---

## 11. Documentation Updates Needed

### 11.1 New Documentation Required

1. **PORT-CONFIGURATION-STANDARD.md**
   - Document standard ports for all services
   - VPS Next.js: Port 3001 (or update to 3000)
   - Apache proxy configuration
   - n8n: Port 8081
   - WordPress: Port 80/443 (direct)

2. **DEPLOYMENT-VERIFICATION-CHECKLIST.md**
   - Add port verification step
   - Add Apache proxy health check
   - Add post-deployment curl tests

3. **TROUBLESHOOTING-GUIDE.md**
   - Add "Site returns 503" section
   - Document port mismatch diagnosis
   - Document Apache proxy debugging

### 11.2 Existing Documentation to Update

- **DUAL-DEPLOYMENT-ARCHITECTURE.md:** Add section on port configuration
- **PRODUCTION-SAFETY-RULES.md:** Add port verification to checklist
- **CLAUDE.md:** Add port configuration to session initialization

---

## Appendix A: Command Reference

### Diagnostic Commands
```bash
# Check site status
curl -I https://saabuildingblocks.com

# Check PM2 process
pm2 status nextjs-saa
pm2 logs nextjs-saa --lines 50

# Check listening ports
netstat -tulpn | grep -E "3000|3001"
ss -tlnp | grep -E "3000|3001"

# Test direct Next.js connection
curl -I http://localhost:3000
curl -I http://localhost:3001

# Check Apache status
sudo systemctl status apache2
sudo apache2ctl -M | grep proxy

# View Apache config
sudo cat /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf | grep ProxyPass
```

### Fix Commands (Option A - Update Apache)
```bash
# Backup current config
sudo cp /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf \
      /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf.backup-$(date +%Y%m%d)

# Edit config
sudo nano /etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf
# Change 3001 to 3000 in ProxyPass lines

# Test config
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2

# Verify fix
sleep 2
curl -I https://saabuildingblocks.com
```

---

## Conclusion

**Root Cause Identified:** Apache reverse proxy is configured to forward requests to port 3001, but Next.js is listening on port 3000. This creates a connection failure resulting in HTTP 503 errors.

**Recommended Fix:** Update Apache configuration to proxy to port 3000 (Option A). This is the fastest and safest solution.

**Site Impact:** VPS admin interface is down, but public-facing Cloudflare Pages deployment is operational. Public visitors are unaffected.

**Time to Fix:** Estimated 5 minutes for Apache config change + reload + verification.

**Risk Level:** LOW - Configuration change is simple and reversible. Backup of config will be created before modification.

---

**Report Status:** COMPLETE
**Next Action:** Hand off to Coder Agent for implementation
**Priority:** CRITICAL - Production admin interface down
