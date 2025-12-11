# WordPress Blog & Media Migration Plan

## Overview

Migrate **only blog posts and their images** published/scheduled after **October 7, 2025 at 5:00 AM** from the old WordPress site (`smartagentalliance.com`) to the new headless WordPress setup (`wp.saabuildingblocks.com`).

**SCOPE LIMITATION**: This migration adds posts and images ONLY. No categories, tags, settings, or other WordPress configuration will be created or modified.

---

## Current Architecture

### Source (Old WordPress)
- **URL**: `https://smartagentalliance.com`
- **Status**: Requires authentication (401 on public REST API)
- **Username**: `dougsmart1`
- **App Password**: `zWUp ezw5 k9AP BY1x 5n27 5KxV`

### Destination (New Headless WordPress)
- **URL**: `https://wp.saabuildingblocks.com`
- **Status**: Public REST API available
- **Current Posts**: 4 posts exist (oldest: October 4, 2025)
- **Categories/Tags**: Already configured - DO NOT MODIFY

### Image CDN
- **Cloudflare Images**: Already configured
- **Existing Script**: `sync-cloudflare-images.ts` handles image upload
- **Mapping File**: `cloudflare-images-mapping.json`

---

## What Gets Migrated

### Posts
- All **published** posts with `date >= 2025-10-07T05:00:00`
- All **scheduled** posts with `date >= 2025-10-07T05:00:00`
- Post content, title, excerpt, slug, date, status
- Category/tag assignments (using existing destination IDs by slug match)
- Featured image reference
- SEO meta data (Rank Math)
- ACF custom fields (youtube_video_url, etc.)

### Images
- Featured images for migrated posts
- Images embedded within post content
- Media files uploaded after cutoff date

### What is NOT Migrated
- ❌ Categories (use existing)
- ❌ Tags (use existing)
- ❌ Users/Authors
- ❌ Settings
- ❌ Plugins
- ❌ Comments
- ❌ Pages

---

## Migration Process

### Step 1: Fetch Posts from Source
```
GET https://smartagentalliance.com/wp-json/wp/v2/posts
  ?after=2025-10-07T05:00:00
  &status=publish,future
  &per_page=100
  &_embed
  Authorization: Basic base64(user:app_password)
```

### Step 2: Build Category/Tag ID Mapping
- Fetch categories from source and destination
- Match by **slug** (not ID)
- If a category doesn't exist in destination, **skip it** (don't assign, don't create)

### Step 3: Migrate Images
For each post's featured image and embedded images:
1. Download from source
2. Upload to destination WordPress media library
3. Upload to Cloudflare Images (for CDN delivery)
4. Record old URL → new URL mapping

### Step 4: Create Posts in Destination
For each post:
1. Replace image URLs in content with new URLs
2. Map category/tag IDs to destination IDs
3. Create post via REST API
4. Skip if slug already exists

---

## Script Design

### File: `scripts/migrate-wordpress-content.ts`

```typescript
interface MigrationConfig {
  source: {
    url: string;
    user: string;
    appPassword: string;
  };
  destination: {
    url: string;
    user: string;
    appPassword: string;
  };
  cutoffDate: string;  // "2025-10-07T05:00:00"
  dryRun: boolean;
}

// Core functions
async function run(config: MigrationConfig): Promise<void> {
  // 1. Fetch posts from source after cutoff
  // 2. Build category/tag slug→ID mapping (destination only)
  // 3. For each post:
  //    a. Download & upload featured image
  //    b. Find & migrate embedded images in content
  //    c. Replace image URLs in content
  //    d. Map category/tag slugs to destination IDs
  //    e. Create post in destination (skip if exists)
  // 4. Output summary
}
```

---

## Environment Variables

```bash
# Add to .env.local for migration

# Source WordPress (old site)
SOURCE_WP_URL=https://smartagentalliance.com
SOURCE_WP_USER=dougsmart1
SOURCE_WP_APP_PASSWORD=zWUp ezw5 k9AP BY1x 5n27 5KxV

# Destination already configured:
# WORDPRESS_URL=https://wp.saabuildingblocks.com
# WORDPRESS_USER=developer
# WORDPRESS_APP_PASSWORD=<existing>
```

---

## Execution

```bash
# Dry run - see what would be migrated
npx tsx scripts/migrate-wordpress-content.ts --dry-run

# Actual migration
npx tsx scripts/migrate-wordpress-content.ts
```

---

## Verification

After migration:
- [ ] New posts appear in wp.saabuildingblocks.com admin
- [ ] Featured images display correctly
- [ ] In-content images load
- [ ] Categories assigned correctly (existing ones only)
- [ ] Dates match source
- [ ] Run `npm run build` to regenerate blog JSON
- [ ] Check blog pages on public site

---

## Risk Handling

| Scenario | Action |
|----------|--------|
| Post slug already exists | Skip (don't duplicate) |
| Category doesn't exist in destination | Don't assign that category |
| Image upload fails | Log error, continue with other posts |
| API rate limit | Add 1-second delay between requests |

---

## Timeline

| Step | Duration |
|------|----------|
| Script development | 1-2 hours |
| Dry run test | 5 minutes |
| Image migration | 10-30 minutes |
| Post migration | 5-10 minutes |
| Verification | 15 minutes |
| **Total** | **~2-3 hours** |

---

## Approval Needed

Please confirm:
1. ✅ Migrate published posts after Oct 7, 2025 5:00 AM
2. ✅ Migrate scheduled (future) posts after that date
3. ✅ Skip posts if slug already exists in destination
4. ✅ Skip category assignment if category doesn't exist
5. ✅ No categories/tags/settings will be created or modified

Ready to proceed with script implementation?
