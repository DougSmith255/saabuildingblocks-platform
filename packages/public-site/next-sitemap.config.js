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
    '/real-estate-agent-job-posts-temp/*',
    '/master-controller/*',
  ],

  // Default change frequency and priority
  changefreq: 'weekly',
  priority: 0.7,

  // Transform function to customize each URL entry
  transform: async (config, path) => {
    // Homepage gets highest priority
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Blog category pages
    if (path.match(/^\/blog\/[^/]+\/?$/)) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Individual blog posts
    if (path.match(/^\/blog\/[^/]+\/[^/]+/)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      };
    }

    // Default for other pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths not automatically discovered
  // These are generated dynamically from WordPress at build time
  additionalPaths: async (config) => {
    const paths = [];

    // The static export already generates all blog paths from WordPress
    // next-sitemap will automatically discover them from the /out directory
    // No need to fetch from WordPress API here - pages are already built

    return paths;
  },
};
