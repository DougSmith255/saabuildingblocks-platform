# Cloudflare Worker: Dynamic Image Variant Selector

This Worker provides **automatic responsive image delivery** by selecting the optimal Cloudflare Images variant based on the browser's viewport width.

## How It Works

```
User requests image → Worker intercepts → Selects variant → Redirects to Cloudflare Images
```

**Example flow:**
1. Browser requests: `https://saabuildingblocks.com/wp-content/uploads/2025/11/image.webp?w=640`
2. Worker reads `?w=640` parameter (from srcset)
3. Worker selects `tablet` variant (768px)
4. Worker redirects to: `https://imagedelivery.net/{hash}/{id}/tablet`
5. Browser caches the optimized image

## Variant Selection Logic

The Worker selects variants based on requested width:

| Requested Width | Variant | Image Size | Use Case |
|----------------|---------|------------|----------|
| ≤ 375px | `mobile` | 375px | Mobile phones |
| ≤ 768px | `tablet` | 768px | Tablets, small laptops |
| ≤ 1280px | `desktop` | 1280px | Desktop/laptop |
| > 1280px | `public` | Original | Large displays |

## Deployment

### Prerequisites

1. **Wrangler CLI installed:**
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare account logged in:**
   ```bash
   wrangler login
   ```

### Deploy Worker

```bash
cd /home/claude-flow/packages/public-site/workers
wrangler deploy
```

This will:
- Upload the Worker to Cloudflare
- Attach it to routes: `/wp-content/uploads/*`
- Enable automatic responsive image delivery

### Verify Deployment

```bash
# Test mobile variant (375px)
curl -I "https://saabuildingblocks.com/wp-content/uploads/2025/11/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp?w=375"

# Should redirect to: .../mobile variant

# Test tablet variant (768px)
curl -I "https://saabuildingblocks.com/wp-content/uploads/2025/11/Doug-and-karrie-co-founders-of-smart-agent-alliance.webp?w=768"

# Should redirect to: .../tablet variant
```

## Updating Image Mapping

When you add new images, update the `IMAGE_MAPPING` constant in `image-optimizer.js`:

```javascript
const IMAGE_MAPPING = {
  'new-image.webp': {
    id: 'cloudflare-image-id',
    hash: 'RZBQ4dWu2c_YEpklnDDxFg'
  }
};
```

**TODO:** Automate this by reading from `cloudflare-images-mapping.json` at build time.

## Performance

- **Latency:** 0-5ms (runs at Cloudflare edge)
- **Cost:** Free tier covers ~100,000 requests/day
- **Caching:** Browser caches final image (Worker only runs once per user)

## Client Hints Support

The Worker also supports [Client Hints](https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images-using-signed-url-tokens/) for even better optimization:

- `Viewport-Width` header
- `DPR` (Device Pixel Ratio) header

Modern browsers send these automatically when enabled.

## Troubleshooting

### Worker not intercepting requests

Check route configuration in wrangler.toml:
```bash
wrangler tail # View live Worker logs
```

### Images still serving from WordPress

Ensure Worker is deployed and routes are active:
```bash
wrangler deployments list
```

### Wrong variant selected

Check Worker logs to see width detection:
```bash
wrangler tail --format pretty
```

## Alternative: Use Cloudflare Pages Functions

Instead of a separate Worker, you can use [Pages Functions](https://developers.cloudflare.com/pages/functions/):

Create `functions/wp-content/uploads/[...path].js`:
```javascript
// Same logic as image-optimizer.js
// Automatically runs for /wp-content/uploads/* routes
```

This is simpler for Cloudflare Pages deployments.
