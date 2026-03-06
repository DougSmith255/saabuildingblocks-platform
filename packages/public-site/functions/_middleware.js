/**
 * Cloudflare Pages Middleware
 *
 * This middleware runs before all Pages Functions and can modify responses.
 * Used to handle:
 * - 404 redirect overrides via KV (instant redirects, no deploy needed)
 * - Security headers for agent attraction pages
 * - 404 error logging to Supabase for triage
 */

// Junk path patterns - skip logging for these (bots, probes, static files)
const JUNK_PATTERNS = [
  /\.(php\d?|phtml|asp|aspx|jsp|cgi|env|ini|yml|yaml|toml|xml|sql|bak|old|orig|swp)$/i,
  /wp-(admin|login|content|includes|json)/i,
  /\/xmlrpc\.php/i,
  /\/(\.git|\.env|\.svn|\.hg|\.DS_Store)/i,
  /\/(admin|administrator|phpmyadmin|mysql|cpanel|webmail)/i,
  /\.(woff2?|ttf|eot|ico|map)$/i,
  /\/favicon\./i,
  /\/_next\//,
  /\/node_modules\//,
  // Media file probes (bots probing for leaked media with hex filenames)
  /\.(ogg|mka|mkv|avi|mpeg|mpg|mp4|mp3|flac|wav|aac|webm|wmv|mov|m4a|m4v|3gp|flv|rar|zip|tar|gz|7z)$/i,
  // Hex/random-string filenames (32+ hex chars = hash probe, not real content)
  /^\/[0-9a-f]{16,}\.[a-z0-9]+$/i,
  // Common directory probes (vulnerability scanners looking for exposed directories)
  /^\/(vendor|assets|uploads?|files?|templates?|themes?|plugins?|modules?|includes?|components?|system|sites?|local|Public|web|www|static|dist|build|lib|src|conf|config|backup|tmp|temp|logs?|data|db|cache|storage|private|public_html|htdocs|cgi-bin|bin|scripts?|css|js|img|media)\//i,
  // Well-known scanner probes (non-standard .well-known paths)
  /^\/.well-known\/(?!acme-challenge)/i,
  // Double-extension and path-traversal probes
  /\.\.\//,
  /\/\/(\/)+/,
  // Common exploit path patterns
  /^\/(ALFA_DATA|alfacgiapi|eval-stdin|shell|c99|r57|wso|leaf|indoxploit)/i,
  /^\/(solr|actuator|telescope|debug|console|portal|manager|jmx|jolokia)\//i,
  // Bot form-fill probes (bots appending /fill or /1 to real pages)
  /\/(fill|submit|send|action|process)$/i,
  // CMS/platform version probes
  /^\/(magento_version|awsconfig|elmah|trace|server-info|server-status)/i,
  /^\/(servlet|axis2?|invoker|jboss|struts)\//i,
  // Common scanner one-word directory probes (backup, old, test, etc.)
  /^\/(backup|bak|bk|bc|bac|old|oldsite|old-site|new|test|demo|staging|dev|www|wp|wp-old|wordpress|site|sito|sitio|shop|main)\/?$/i,
  // Bare year paths (year archive probes)
  /^\/\d{4}\/?$/,
  // Joomla/Drupal/other CMS probes
  /^\/(media\/system|sites\/default|misc\/drupal)\//i,
];

// In-isolate rate limiter: avoid logging the same path more than once per 60s per edge location
const recentlyLogged = new Map();
const RATE_LIMIT_MS = 60_000;

/**
 * Fire-and-forget log of a 404 path to Supabase via RPC
 */
async function log404ToSupabase(path, referrer, userAgent, env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/rpc/upsert_404_path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        p_path: path,
        p_referrer: referrer || null,
        p_user_agent: userAgent || null,
      }),
    });
  } catch {
    // Fire-and-forget: swallow errors silently
  }
}

// Wildcard prefix redirects: [prefix, targetBase, splat]
// More specific prefixes listed first so they match before catch-alls.
// If splat=true, remainder after prefix is appended to targetBase.
// If splat=false, redirect goes to targetBase exactly (remainder discarded).
const WILDCARD_REDIRECTS = [
  // Old site structure: /real-estate-agent-job/* (sub-categories preserve slug)
  ['/real-estate-agent-job/entertainment/', '/blog/fun-for-agents/', true],
  ['/real-estate-agent-job/career/', '/blog/agent-career-info/', true],
  ['/real-estate-agent-job/marketing/', '/blog/marketing-mastery/', true],
  ['/real-estate-agent-job/clients/', '/blog/winning-clients/', true],
  ['/real-estate-agent-job/trends/', '/blog/industry-trends/', true],
  ['/real-estate-agent-job/', '/', false],
  // Old site structure: /real-talent/*
  ['/real-talent/entertainment/', '/blog/fun-for-agents/', true],
  ['/real-talent/', '/', false],
  // Blog prefix corrections (posts live at top-level, preserve slug)
  ['/blog/about-exp-realty/', '/about-exp-realty/', true],
  ['/blog/exp-realty-sponsor/', '/exp-realty-sponsor/', true],
  // Old WordPress category slugs (all discard remainder)
  ['/category/about-exp/', '/blog#category=about-exp-realty', false],
  ['/category/career/', '/blog#category=agent-career-info', false],
  ['/category/brokerage-comparison/', '/blog#category=brokerage-comparison', false],
  ['/category/exp-realty-sponsor-team/', '/blog#category=exp-realty-sponsor', false],
  ['/category/entertainment/', '/blog#category=fun-for-agents', false],
  ['/category/trends/', '/blog#category=industry-trends', false],
  ['/category/marketing/', '/blog#category=marketing-mastery', false],
  ['/category/uncategorized/', '/blog', false],
  ['/category/clients/', '/blog#category=winning-clients', false],
  ['/category/', '/blog', false],
  // Old sub-pages
  ['/best-real-estate-brokerage/matchup/', '/blog/brokerage-comparison/', true],
  ['/about-exp-realty/locations/', '/locations/', false],
  // become-real-estate-agent: specific sub-paths before catch-all
  ['/become-real-estate-agent/schools/', '/blog/real-estate-schools/', true],
  ['/become-real-estate-agent/license/', '/blog/become-an-agent/', true],
  ['/become-real-estate-agent/', '/blog#category=become-an-agent', false],
  ['/real-estate-schools-online/', '/', false],
  ['/join-exp-sponsor-team/', '/exp-realty-sponsor/', false],
  ['/tools/', '/', false],
  ['/wp-content/uploads/', '/', false],
  ['/agent-tools/', '/', false],
];

// Exact-match static redirects (paths stored without trailing slash)
const STATIC_REDIRECTS = new Map([
  // Blog category index pages
  ['/blog/brokerage-comparison', '/blog#category=brokerage-comparison'],
  ['/blog/marketing-mastery', '/blog#category=marketing-mastery'],
  ['/blog/agent-career-info', '/blog#category=agent-career-info'],
  ['/blog/winning-clients', '/blog#category=winning-clients'],
  ['/blog/fun-for-agents', '/blog#category=fun-for-agents'],
  ['/blog/industry-trends', '/blog#category=industry-trends'],
  ['/blog/real-estate-schools', '/blog#category=real-estate-schools'],
  ['/blog/become-an-agent', '/blog#category=become-an-agent'],
  ['/blog/about-exp-realty', '/blog#category=about-exp-realty'],
  ['/blog/exp-realty-sponsor', '/blog#category=exp-realty-sponsor'],
  // Old agent-tools exact matches
  ['/agent-tools/exp-realty-revenue-share-calculator', '/exp-realty-revenue-share-calculator/'],
  ['/agent-tools/exp-commission-and-fees-calculator', '/exp-commission-calculator/'],
  ['/agent-tools/should-you-join-exp', '/about-exp-realty/'],
  ['/agent-tools/content-idea-generator', '/'],
  ['/agent-tools/sites-and-software', '/'],
  // Old /our-exp-team sub-pages
  ['/our-exp-team/about-doug-smart', '/about-doug-smart/'],
  ['/our-exp-team/about-karrie-hill', '/about-karrie-hill/'],
  // Old linktree URLs → new link pages
  ['/doug-linktree', '/doug-smart-links/'],
  ['/karrie-linktree', '/karrie-hilljd-links/'],
  // Old parent index pages (no state/slug suffix)
  ['/become-real-estate-agent/schools', '/blog#category=real-estate-schools'],
  ['/become-real-estate-agent/license', '/blog#category=become-an-agent'],
  // best-real-estate-brokerage old sub-pages
  ['/best-real-estate-brokerage/commissions', '/best-real-estate-brokerage/'],
  ['/best-real-estate-brokerage/fees', '/best-real-estate-brokerage/'],
  ['/best-real-estate-brokerage/revenue-share', '/best-real-estate-brokerage/'],
  ['/best-real-estate-brokerage/new-agents', '/best-real-estate-brokerage/'],
  ['/best-real-estate-brokerage/profits', '/best-real-estate-brokerage/'],
  ['/best-real-estate-brokerage/reviews', '/best-real-estate-brokerage/'],
  // Removed duplicate brokerage-comparison posts -> correct category posts
  ['/blog/brokerage-comparison/fees', '/about-exp-realty/fees/'],
  ['/blog/brokerage-comparison/revenue-share', '/exp-realty-sponsor/revenue-share/'],
  ['/blog/brokerage-comparison/new-agents', '/exp-realty-sponsor/new-agents/'],
  // about-exp-realty slug changes
  ['/about-exp-realty/workplace', '/about-exp-realty/exp-workplace/'],
  ['/about-exp-realty/awards', '/awards/'],
  ['/about-exp-realty/locations', '/locations/'],
  // exp-realty-sponsor old sub-pages
  ['/exp-realty-sponsor/topics', '/exp-realty-sponsor/'],
  ['/exp-realty-sponsor/experienced-agents-old', '/exp-realty-sponsor/experienced-agents/'],
  ['/exp-realty-sponsor/keep-your-brand', '/exp-realty-sponsor/keep-brand/'],
  ['/exp-realty-sponsor/beyond-commissions', '/exp-realty-sponsor/'],
  // Legacy vanity URLs
  ['/should-you-join-exp', '/about-exp-realty/'],
  ['/join-exp-sponsor-team', '/exp-realty-sponsor/'],
  ['/shoould-you-join-exp-realty', '/'],
  ['/is-exp-an-pyramid-scheme-about-exp-page', '/'],
  ['/join-the-winning-team', '/'],
  ['/real-estate-commission-splits-13-brokerages-compared', '/best-real-estate-brokerage/'],
  ['/exp-realty-vs-redfin', '/best-real-estate-brokerage/'],
  ['/how-hard-is-the-real-estate-exam', '/blog#category=become-an-agent'],
  ['/pros-and-cons-of-360training', '/blog#category=real-estate-schools'],
  ['/online-real-estate-brokerage', '/best-real-estate-brokerage/online/'],
  ['/divisions-2', '/about-exp-realty/divisions/'],
  ['/linkedin-hashtags', '/blog/marketing-mastery/linkedin-hashtags/'],
  // Old page slugs
  ['/marketing', '/blog#category=marketing-mastery'],
  ['/education-and-training', '/'],
  ['/coming-soon', '/'],
  ['/developing-agent', '/'],
  ['/mentor', '/'],
  ['/quick-production', '/'],
  ['/compass-features', '/best-real-estate-brokerage/'],
  ['/growth-plan', '/'],
  ['/low-fees', '/'],
  ['/more-benefits', '/'],
  ['/blender', '/'],
  // Old WordPress image/attachment slugs
  ['/aceable-agent-logo', '/'],
  ['/corcoran-image', '/'],
  ['/join-team-logos', '/'],
  ['/resized-4', '/'],
  ['/new-gold-5', '/'],
  ['/1-agent-centric', '/'],
  ['/1-21', '/'],
  ['/100-commissions-potential-icon', '/'],
  ['/lead-magnet-mob-webp', '/'],
  ['/more-leadz-webp-updated', '/'],
  ['/synergstic-community-2', '/'],
  ['/mobile-2-0', '/'],
  ['/under-construction-2', '/'],
  ['/exp-realty-south-africa', '/locations/'],
  ['/exp-realty-us-greece', '/locations/'],
  ['/exp-realty-israel', '/locations/'],
  ['/real-estate-closing-gifts-sented-candle', '/'],
  ['/real-estate-closing-gifts-wine-oor-champeine', '/'],
  ['/real-estate-business-card', '/'],
]);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // --- STEP 1: Check REDIRECT_OVERRIDES KV for instant redirect ---
  if (context.env.REDIRECT_OVERRIDES) {
    try {
      const target = await context.env.REDIRECT_OVERRIDES.get(path);
      if (target) {
        return new Response(null, {
          status: 301,
          headers: { 'Location': target },
        });
      }
    } catch {
      // KV read failed - continue to normal pipeline
    }
  }

  // --- STEP 2: Check static redirect map (exact match, with/without trailing slash) ---
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  const staticTarget = STATIC_REDIRECTS.get(path) || STATIC_REDIRECTS.get(normalizedPath);
  if (staticTarget) {
    return new Response(null, {
      status: 301,
      headers: { 'Location': staticTarget },
    });
  }

  // --- STEP 3: Check wildcard prefix redirects ---
  for (const [prefix, targetBase, splat] of WILDCARD_REDIRECTS) {
    if (path.startsWith(prefix)) {
      const target = splat ? targetBase + path.slice(prefix.length) : targetBase;
      return new Response(null, {
        status: 301,
        headers: { 'Location': target },
      });
    }
  }

  // --- STEP 3b: Strip trailing pagination/null suffixes from content paths ---
  // Bots append /1, /2, /null etc. to blog and category pages
  const paginationMatch = path.match(/^(\/(?:blog\/[a-z-]+\/[a-z0-9-]+|about-exp-realty\/[a-z0-9-]+|exp-realty-sponsor\/[a-z0-9-]+))\/(\d+|null)\/?$/);
  if (paginationMatch) {
    return new Response(null, {
      status: 301,
      headers: { 'Location': paginationMatch[1] + '/' },
    });
  }

  // --- STEP 4: Normal request pipeline ---
  const response = await context.next();

  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response);

  // --- STEP 5: Agent page iframe embedding (existing logic) ---
  const isAgentPage = path.match(/^\/[a-z0-9-]+\/?$/i) &&
    !path.startsWith('/api') &&
    !path.startsWith('/agent-portal') &&
    !path.startsWith('/master-controller') &&
    !path.startsWith('/blog') &&
    !path.startsWith('/about') &&
    !path.startsWith('/_next') &&
    !path.startsWith('/fonts') &&
    !path.startsWith('/images') &&
    path !== '/' &&
    !path.endsWith('-links') &&
    !path.endsWith('-links/');

  if (isAgentPage) {
    newResponse.headers.delete('X-Frame-Options');
    newResponse.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://saabuildingblocks.pages.dev https://smartagentalliance.com");
  }

  // --- STEP 6: Log 404s to Supabase (fire-and-forget via waitUntil) ---
  if (response.status === 404) {
    // Skip junk paths
    const isJunk = JUNK_PATTERNS.some(pattern => pattern.test(path));

    if (!isJunk) {
      // Rate limit: skip if this path was logged recently in this isolate
      const now = Date.now();
      const lastLogged = recentlyLogged.get(path);

      if (!lastLogged || (now - lastLogged) > RATE_LIMIT_MS) {
        recentlyLogged.set(path, now);

        // Clean up old entries periodically (keep map from growing unbounded)
        if (recentlyLogged.size > 500) {
          for (const [key, timestamp] of recentlyLogged) {
            if ((now - timestamp) > RATE_LIMIT_MS) {
              recentlyLogged.delete(key);
            }
          }
        }

        const referrer = context.request.headers.get('referer') || '';
        const userAgent = context.request.headers.get('user-agent') || '';

        context.waitUntil(
          log404ToSupabase(path, referrer, userAgent, context.env)
        );
      }
    }
  }

  return newResponse;
}
