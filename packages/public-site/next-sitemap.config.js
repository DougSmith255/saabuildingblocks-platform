const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ---------------------------------------------------------------------------
// 1. Build path-based image lookup from blog post data + Cloudflare mapping
// ---------------------------------------------------------------------------

// Load slug → Cloudflare Images URL mapping (keyed by WordPress post_name)
const slugToFeatured = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'slug-to-cloudflare-featured.json'), 'utf8')
);

// Load all blog post chunks and build a path → Cloudflare image URL map.
// This resolves the mismatch between WordPress post_name slugs (JSON keys) and
// custom permalink slugs (what next-sitemap sees in the URL path).
const STANDALONE_CATEGORIES = ['about-exp-realty', 'exp-realty-sponsor'];
const pathToImage = {};
const pathToModified = {};

const chunkFiles = glob.sync(
  path.join(__dirname, 'public', 'blog-posts-chunk-*.json')
);
for (const chunkFile of chunkFiles) {
  const posts = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
  for (const post of posts) {
    // Compute URL path using the same logic as getPostUrl() in blog-post-urls.ts
    const uri =
      post.customUri ||
      `${(post.categories[0] || 'uncategorized').toLowerCase().replace(/\s+/g, '-')}/${post.slug}`;
    const firstSegment = uri.split('/')[0];
    const urlPath = STANDALONE_CATEGORIES.includes(firstSegment)
      ? `/${uri}`
      : `/blog/${uri}`;

    // Look up Cloudflare image by WordPress slug
    const cfImage = slugToFeatured[post.slug];
    if (cfImage) {
      pathToImage[urlPath] = cfImage.cloudflareUrl;
    }

    // Store WordPress modification date for sitemap lastmod
    if (post.modified) {
      pathToModified[urlPath] = new Date(post.modified).toISOString();
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Static page images (Cloudflare Images used on Next.js pages)
// ---------------------------------------------------------------------------
const CF_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

const staticPageImages = {
  '/': [
    `${CF_BASE}/doug-and-karrie-co-founders/desktop`,
  ],
  '/about-doug-smart': [
    `${CF_BASE}/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public`,
  ],
  '/about-karrie-hill': [
    `${CF_BASE}/4e2a3c105e488654-Karrie-Profile-Picture.png/public`,
  ],
  '/our-exp-team': [
    `${CF_BASE}/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop`,
    `${CF_BASE}/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public`,
    `${CF_BASE}/4e2a3c105e488654-Karrie-Profile-Picture.png/public`,
  ],
  '/exp-realty-sponsor': [
    `${CF_BASE}/portal-onboarding-screenshot/desktop2x`,
    `${CF_BASE}/saa-landing-page-phone-mockup/desktop`,
    `${CF_BASE}/saa-social-agent-academy/desktop`,
    `${CF_BASE}/saa-ai-agent-accelerator/desktop`,
    `${CF_BASE}/saa-attraction-page-screenshot/desktop2x`,
    `${CF_BASE}/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop`,
  ],
  '/freebies': [
    `${CF_BASE}/03ff008ff4e48e5c-This-or-that-WebP.webp/public`,
    `${CF_BASE}/7e81caf29f9fa3c2-Brokerage-Interview-Questions-WebP-2.webp/public`,
    `${CF_BASE}/5ee94ed87b4d1eb7-Open-House-Sign-In-Sheets-WebP-2.webp/public`,
    `${CF_BASE}/9308b112da094661-Seller-WebP.webp/public`,
    `${CF_BASE}/d402a3b65b35bc37-Buyer-WebP.webp/public`,
    `${CF_BASE}/c3cc2ab729e003c9-Tour-notes-WebP.webp/public`,
  ],
  '/about-exp-realty': [
    `${CF_BASE}/exp-x-logo-icon/public`,
  ],
};

// ---------------------------------------------------------------------------
// 3. Sitemap configuration
// ---------------------------------------------------------------------------

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://smartagentalliance.com',
  generateRobotsTxt: false, // We manage robots.txt manually for AI crawler control
  outDir: './out', // Static export directory

  // Generate sitemap index for large sites
  generateIndexSitemap: true,

  // Exclude non-public paths
  exclude: [
    '/testing-page',
    '/blog-preview',
    '/blog-posts-temp/*',
    '/master-controller/*',
    '/agent-portal',
    '/agent-portal/*',
  ],

  // Default change frequency and priority
  changefreq: 'weekly',
  priority: 0.7,

  // Transform function to customize each URL entry
  transform: async (config, urlPath) => {
    // Use WordPress modification date for blog posts, fall back to build time
    const lastmod = pathToModified[urlPath] || new Date().toISOString();

    // Homepage gets highest priority
    if (urlPath === '/') {
      return {
        loc: urlPath,
        changefreq: 'daily',
        priority: 1.0,
        lastmod,
        ...(staticPageImages['/'] && {
          images: staticPageImages['/'].map((url) => ({ loc: new URL(url) })),
        }),
      };
    }

    // Blog category pages
    if (urlPath.match(/^\/blog\/[^/]+\/?$/)) {
      return {
        loc: urlPath,
        changefreq: 'daily',
        priority: 0.8,
        lastmod,
      };
    }

    // Standalone category blog posts (about-exp-realty, exp-realty-sponsor)
    if (urlPath.match(/^\/(about-exp-realty|exp-realty-sponsor)\/[^/]+/)) {
      const imageUrl = pathToImage[urlPath];
      // Also check static page images for the landing pages
      const staticImages = staticPageImages[urlPath];
      const images = imageUrl
        ? [{ loc: new URL(imageUrl) }]
        : staticImages
          ? staticImages.map((url) => ({ loc: new URL(url) }))
          : undefined;
      return {
        loc: urlPath,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod,
        ...(images && { images }),
      };
    }

    // Individual blog posts
    if (urlPath.match(/^\/blog\/[^/]+\/[^/]+/)) {
      const imageUrl = pathToImage[urlPath];
      return {
        loc: urlPath,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod,
        ...(imageUrl && { images: [{ loc: new URL(imageUrl) }] }),
      };
    }

    // Static pages with images
    const staticImages = staticPageImages[urlPath];
    if (staticImages) {
      return {
        loc: urlPath,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod,
        images: staticImages.map((url) => ({ loc: new URL(url) })),
      };
    }

    // Default for other pages
    return {
      loc: urlPath,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths not automatically discovered
  additionalPaths: async (config) => {
    const paths = [];

    // Fetch activated agent link page slugs from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/agent_pages?activated=eq.true&select=slug,profile_image_url,updated_at`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );
        if (res.ok) {
          const agents = await res.json();
          for (const agent of agents) {
            const entry = {
              loc: `/${agent.slug}-links`,
              changefreq: 'weekly',
              priority: 0.5,
              lastmod: agent.updated_at || new Date().toISOString(),
            };
            if (agent.profile_image_url) {
              entry.images = [{ loc: new URL(agent.profile_image_url) }];
            }
            paths.push(entry);
          }
          console.log(`[sitemap] Added ${agents.length} agent link pages`);
        }
      } catch (err) {
        console.warn('[sitemap] Failed to fetch agent link pages:', err.message);
      }
    }

    return paths;
  },
};
