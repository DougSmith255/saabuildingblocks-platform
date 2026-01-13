# Port Assignments - SAA Infrastructure

**IMPORTANT: These ports are RESERVED. Do not use them for new services.**

## Application Ports (3000-3999)

| Port | Service | User | Description |
|------|---------|------|-------------|
| 3001 | public-site | - | Next.js public site (deployed to Cloudflare Pages, not PM2) |
| 3002 | admin-dashboard (nextjs-saa) | claude-flow | Next.js admin dashboard & API server |
| 3003-3099 | RESERVED | - | Future Next.js/Node applications |

## System Ports (Already in Use)

| Port | Service | Description |
|------|---------|-------------|
| 22 | SSH | Remote access |
| 25 | Postfix | Mail server |
| 53 | systemd-resolve | DNS |
| 80 | Apache | HTTP |
| 443 | Apache | HTTPS |
| 631 | CUPS | Print service |
| 3306 | MariaDB | MySQL database |
| 5678 | n8n | Workflow automation (if enabled) |
| 6379 | Redis | Cache/session store |
| 8000 | Docker | Listmonk |
| 8080 | Apache | Alternative HTTP |
| 8081 | Docker | Internal service |
| 8200 | Docker | Vault |

## Next Available Ports for New Services

When adding a new service, use these port ranges:

- **3003-3099**: Next.js / Node.js applications
- **4000-4099**: API microservices
- **5000-5099**: Python services
- **9000-9099**: Monitoring / metrics

## PM2 Process Management

The admin-dashboard runs under the `claude-flow` user's PM2:
```bash
sudo -u claude-flow pm2 list    # View processes
sudo -u claude-flow pm2 restart nextjs-saa  # Restart admin-dashboard
sudo -u claude-flow pm2 logs nextjs-saa     # View logs
```

Do NOT start duplicate PM2 processes under the root user.

## Adding a New Service Checklist

1. Check this file for available ports
2. Update this file with the new port assignment
3. Configure the service to use the assigned port
4. Test that no port conflicts exist before deploying
