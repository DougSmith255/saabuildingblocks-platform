# Background Removal Worker

Cloudflare Worker that uses Workers AI to remove backgrounds from profile images.

## Features

- AI-powered background removal using Cloudflare Workers AI
- R2 caching for processed images
- Supports URL-based and direct upload
- CORS enabled for cross-origin requests

## Endpoints

### GET /api/remove-background?url={imageUrl}

Remove background from an image URL.

```bash
curl "https://saabuildingblocks.com/api/remove-background?url=https://example.com/image.jpg"
```

### POST /api/remove-background

Remove background from uploaded image.

**Form Data:**
```bash
curl -X POST \
  -F "image=@profile.jpg" \
  "https://saabuildingblocks.com/api/remove-background"
```

**JSON (URL):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}' \
  "https://saabuildingblocks.com/api/remove-background"
```

**JSON (Base64):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"base64": "data:image/jpeg;base64,/9j/4AAQ..."}' \
  "https://saabuildingblocks.com/api/remove-background"
```

### GET /api/remove-background/health

Health check endpoint.

## Setup

### Prerequisites

1. Cloudflare account with Workers AI enabled
2. R2 bucket for caching (create one named `saa-profile-images`)
3. Wrangler CLI installed

### Installation

```bash
cd packages/admin-dashboard/workers/background-removal
npm install
```

### Create R2 Bucket

```bash
wrangler r2 bucket create saa-profile-images
```

### Development

```bash
npm run dev
```

### Deployment

```bash
# Deploy to production
npm run deploy:production

# Or deploy to default environment
npm run deploy
```

## Configuration

### wrangler.toml

- `AI` binding: Cloudflare Workers AI
- `CACHE_BUCKET` binding: R2 bucket for caching processed images
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### Environment Variables

Set in Cloudflare dashboard or wrangler.toml:

- `ALLOWED_ORIGINS`: CORS allowed origins

## Caching

Processed images are cached in R2 with the following strategy:

1. Cache key is generated from the source image URL hash
2. Cached images have a 1-year cache-control header
3. Cache hits return with `X-Cache: HIT` header

## Notes

### Cloudflare AI Models

The worker uses Cloudflare's AI models for background removal. The exact model availability may vary. The current implementation attempts to use:

1. Primary: Stable Diffusion-based processing
2. Fallback: Returns original image if AI processing fails

### Limitations

- Maximum image size depends on Worker memory limits
- Processing time varies based on image complexity
- AI model capabilities may change with Cloudflare updates

### Future Improvements

- [ ] Add support for batch processing
- [ ] Implement more sophisticated fallback models
- [ ] Add image format conversion options
- [ ] Webhook notification on processing complete
