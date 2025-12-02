# Social Poster

Automate blog post distribution across social media platforms for Smart Agent Alliance.

## Architecture

- **Framework**: Next.js 16 + React 19
- **Deployment**: PM2 on port 3010
- **URL**: `https://saabuildingblocks.com/social-poster`
- **Reverse Proxy**: Apache → `localhost:3010`

## Features

- WordPress blog post URL input
- Multi-platform selection (X, LinkedIn, Facebook, Pinterest, Medium)
- Real-time platform connectivity status
- n8n workflow integration for automated posting
- Per-platform formatting and optimization

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### PM2 Production Deployment

```bash
# Build the application
cd /home/claude-flow/packages/social-poster
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

### Apache Configuration

The reverse proxy is configured in `/etc/apache2/sites-enabled/saabuildingblocks-nextjs-le-ssl.conf`:

```apache
<Location "/social-poster">
    ProxyPreserveHost On
    ProxyPass http://127.0.0.1:3010/social-poster
    ProxyPassReverse http://127.0.0.1:3010/social-poster
</Location>
```

## Environment Variables

Create `.env.local` with:

```env
# n8n Webhook
N8N_WEBHOOK_URL=https://n8n.saabuildingblocks.com/webhook/social-poster

# WordPress API
WORDPRESS_SAA_USERNAME=dougsmart1
WORDPRESS_SAA_PASSWORD=<app-password>
WORDPRESS_SAA_API_BASE=https://smartagentalliance.com/wp-json/wp/v2

# Social Media Platform API Keys (to be configured)
# TWITTER_API_KEY=
# LINKEDIN_CLIENT_ID=
# FACEBOOK_APP_ID=
# PINTEREST_APP_ID=
# MEDIUM_INTEGRATION_TOKEN=
```

## Workflow

1. User enters WordPress blog post URL
2. User selects target platforms
3. App calls n8n webhook with blog URL + platforms
4. n8n fetches WordPress post data (title, excerpt, image, content)
5. n8n formats content for each platform
6. n8n posts to selected platforms
7. n8n returns success/failure status for each platform
8. UI displays real-time posting status

## Next Steps

1. Create n8n workflow at `n8n.saabuildingblocks.com`
2. Configure social media platform OAuth/API keys
3. Test end-to-end posting workflow
4. Add post history tracking (optional)
