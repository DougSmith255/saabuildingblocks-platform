/**
 * Cloudflare Pages Function: Dynamic Agent Pages
 *
 * Serves agent pages from Cloudflare KV at the edge.
 * Data is pre-cached in KV, so reads are < 10ms globally.
 *
 * Route: /{slug} (single path segment, not matching static pages)
 *
 * Two page types:
 * 1. Agent Attraction Page: /{slug} (e.g., /doug-smart)
 *    - Full landing page with star background, profile, social, phone
 * 2. Agent Links Page: /{slug}-links (e.g., /doug-smart-links)
 *    - Linktree-style page with profile, social, buttons
 *
 * Flow:
 * 1. Check if slug matches a known static page -> pass through
 * 2. Check if slug ends with "-links" -> use links page template
 * 3. Check KV for agent page data
 * 4. If found, render and return HTML
 * 5. If not found, pass through to static 404
 */

// Known static page slugs - these pass through to static content
export const STATIC_SLUGS = new Set([
  'about-doug-smart',
  'about-exp-realty',
  'about-karrie-hill',
  'agent-attraction-template',
  'agent-portal',
  'awards',
  'best-real-estate-brokerage',
  'blog',
  'cookie-policy',
  'disclaimer',
  'doug-linktree',
  'exp-commission-calculator',
  'exp-realty-revenue-share-calculator',
  'exp-realty-sponsor',
  'freebies',
  'join-exp-sponsor-team',
  'karrie-linktree',
  'locations',
  'master-controller',
  'our-exp-team',
  'privacy-policy',
  'should-you-join-exp',
  'terms-of-use',
  // System paths
  '_next',
  'fonts',
  'images',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'manifest.json',
]);

/**
 * NOTE: convertToAltGlyphs is no longer needed!
 * The Taskor font now has an ss01 stylistic set that automatically
 * substitutes N, E, M with their alternate glyphs when font-feature-settings: "ss01" 1 is applied.
 * This means real letters are in the DOM (SEO/copy-paste friendly) while visually
 * displaying the alternate glyphs.
 */

/**
 * Generate the complete HTML page for an agent
 * @param agent - Agent data from KV
 * @param siteUrl - Base URL of the site (e.g., https://smartagentalliance.com)
 */
export function generateAgentPageHTML(agent, siteUrl = 'https://smartagentalliance.com') {
  // Check if agent page is active (support both field names)
  const isActive = agent.activated ?? agent.is_active ?? false;
  if (!isActive) {
    return null; // Return null to indicate page should not be shown
  }

  const fullName = `${agent.display_first_name} ${agent.display_last_name}`.trim();
  const title = `${fullName} | Smart Agent Alliance`;

  // Analytics domain (always use smartagentalliance.com for Plausible)
  const analyticsDomain = 'smartagentalliance.com';

  // Build social links array
  const socialLinks = [];
  if (agent.facebook_url) socialLinks.push({ platform: 'facebook', url: agent.facebook_url, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' });
  if (agent.instagram_url) socialLinks.push({ platform: 'instagram', url: agent.instagram_url, icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' });
  if (agent.twitter_url) socialLinks.push({ platform: 'twitter', url: agent.twitter_url, icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' });
  if (agent.youtube_url) socialLinks.push({ platform: 'youtube', url: agent.youtube_url, icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' });
  if (agent.tiktok_url) socialLinks.push({ platform: 'tiktok', url: agent.tiktok_url, icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' });
  if (agent.linkedin_url) socialLinks.push({ platform: 'linkedin', url: agent.linkedin_url, icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' });

  const socialLinksHTML = socialLinks.map(link => `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link" title="${link.platform}">
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="${link.icon}"/>
      </svg>
    </a>
  `).join('');

  // Phone display
  const phoneHTML = agent.show_phone && agent.phone ? `
    <div class="phone-section">
      <a href="tel:${escapeHTML(agent.phone)}" class="phone-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        ${escapeHTML(agent.phone)}
        ${agent.phone_text_only ? '<span class="text-only">(Text Only)</span>' : ''}
      </a>
    </div>
  ` : '';

  // Profile image
  const profileImageHTML = agent.profile_image_url ? `
    <div class="profile-image-container">
      <img src="${escapeHTML(agent.profile_image_url)}" alt="${escapeHTML(fullName)}" class="profile-image" />
    </div>
  ` : `
    <div class="profile-image-container">
      <div class="profile-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="${escapeHTML(fullName)} - Real Estate Agent at eXp Realty. Connect with me today!" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${escapeHTML(title)}" />
  <meta property="og:description" content="${escapeHTML(fullName)} - Real Estate Agent at eXp Realty" />
  ${agent.profile_image_url ? `<meta property="og:image" content="${escapeHTML(agent.profile_image_url)}" />` : ''}

  <!-- Fonts -->
  <link rel="preconnect" href="${siteUrl}" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico" />

  <style>
    @font-face {
      font-family: 'Taskor';
      src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2') format('woff2');
      font-display: swap;
      font-weight: 400;
    }
    @font-face {
      font-family: 'Synonym';
      src: url('${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2') format('woff2');
      font-display: swap;
      font-weight: 100 900;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: 'Synonym', system-ui, -apple-system, sans-serif;
      background: radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%);
      background-color: rgb(12, 12, 12);
      color: #e5e4dd;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 480px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .profile-image-container {
      width: 144px;
      height: 144px;
      margin-bottom: 1.5rem;
      position: relative;
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid #ffd700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    }

    .profile-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid #ffd700;
      background: rgba(255, 215, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffd700;
    }

    h1 {
      font-family: 'Taskor', 'Synonym', system-ui, sans-serif;
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      color: #ffd700;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    }

    .subtitle {
      font-size: 1rem;
      color: #dcdbd5;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .social-link {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e5e4dd;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background: rgba(255, 215, 0, 0.2);
      color: #ffd700;
      transform: translateY(-2px);
    }

    .phone-section {
      margin-bottom: 2rem;
    }

    .phone-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #e5e4dd;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      transition: all 0.2s ease;
    }

    .phone-link:hover {
      background: rgba(255, 215, 0, 0.2);
      color: #ffd700;
    }

    .text-only {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-left: 0.25rem;
    }

    .cta-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cta-button {
      display: block;
      width: 100%;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #ffd700 0%, #e6c200 100%);
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }

    .secondary-button {
      display: block;
      width: 100%;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: #e5e4dd;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 500;
      font-size: 1rem;
      text-align: center;
      transition: all 0.2s ease;
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    .secondary-button:hover {
      background: rgba(255, 215, 0, 0.1);
      border-color: rgba(255, 215, 0, 0.5);
    }

    .footer {
      margin-top: auto;
      padding-top: 3rem;
      text-align: center;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: rgba(255, 215, 0, 0.6);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .footer-logo:hover {
      color: #ffd700;
    }

    .footer-text {
      color: rgba(220, 219, 213, 0.4);
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    /* Star background effect */
    .stars {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: -1;
      background-image:
        radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(255,215,0,0.2), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
        radial-gradient(2px 2px at 160px 120px, rgba(255,215,0,0.15), transparent),
        radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.3), transparent);
      background-size: 250px 200px;
      animation: twinkle 8s ease-in-out infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="stars"></div>

  <div class="container">
    ${profileImageHTML}

    <h1>${escapeHTML(fullName)}</h1>
    <p class="subtitle">Real Estate Agent @ eXp Realty</p>

    ${socialLinks.length > 0 ? `
    <div class="social-links">
      ${socialLinksHTML}
    </div>
    ` : ''}

    ${phoneHTML}

    <div class="cta-section">
      <a href="${siteUrl}/join-exp-sponsor-team/" class="cta-button">
        Join My Team at eXp Realty
      </a>
      <a href="${siteUrl}/" class="secondary-button">
        Learn About Smart Agent Alliance
      </a>
    </div>

    <footer class="footer">
      <a href="${siteUrl}/" class="footer-logo">
        Smart Agent Alliance
      </a>
      <p class="footer-text">Powered by Smart Agent Alliance</p>
    </footer>
  </div>

  <!-- Plausible Analytics -->
  <script defer data-domain="${analyticsDomain}" src="https://plausible.saabuildingblocks.com/js/script.js"></script>
</body>
</html>`;
}


/**
 * generateAttractionPageHTML - Creates the full agent attraction page
 *
 * This is a converted version of the React agent-attraction-template component
 * rendered as static HTML with vanilla JavaScript for interactivity.
 *
 * @param agent - Agent data from KV store
 * @param siteUrl - Base URL of the site
 * @param escapeHTML - Function to escape HTML entities
 * @param escapeJS - Function to escape JS strings
 */

function generateAttractionPageHTML(agent, siteUrl = 'https://smartagentalliance.com', escapeHTML, escapeJS) {
  const isActive = agent.activated ?? agent.is_active ?? false;
  if (!isActive) return null;

  // Agent data extraction
  const fullName = `${agent.display_first_name} ${agent.display_last_name}`.trim();
  const firstName = agent.display_first_name || 'Agent';
  const displayName = fullName || 'Smart Agent Alliance';
  const title = `Join ${firstName}'s Team | Smart Agent Alliance`;
  const analyticsDomain = 'smartagentalliance.com';

  // Agent-specific customization
  const agentImageUrl = agent.profile_image_url || `${siteUrl}/images/default-profile.png`;
  const agentExpEmail = agent.exp_email || 'doug.smart@expreferral.com';
  const agentFullLegalName = agent.full_legal_name || fullName || 'Sheldon Douglas Smart';
  const agentTagline = `Join ${displayName}'s Team`;

  // Cloudflare Images CDN
  const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="Join ${escapeHTML(displayName)}'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="Join ${escapeHTML(displayName)}'s team at eXp Realty">
  <meta property="og:image" content="${escapeHTML(agentImageUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(title)}">
  <link rel="icon" href="https://saabuildingblocks.pages.dev/favicon.ico">
  <link rel="preconnect" href="https://saabuildingblocks.pages.dev" crossorigin="">
  <link rel="preconnect" href="https://imagedelivery.net" crossorigin="">
  <link rel="preload" href="https://saabuildingblocks.pages.dev/_next/static/media/Amulya_Variable-s.6f10ee89.woff2" as="font" type="font/woff2" crossorigin="">
  <link rel="preload" href="https://saabuildingblocks.pages.dev/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin="">
  <link rel="preload" href="https://saabuildingblocks.pages.dev/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2" as="font" type="font/woff2" crossorigin="">

  <!-- Plausible Analytics -->
  <script defer="" data-domain="smartagentalliance.com" src="https://plausible.io/js/script.js"></script>

  <style>
    /* Font Faces */
    @font-face { font-family: 'Taskor'; src: url('https://saabuildingblocks.pages.dev/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2') format('woff2'); font-display: swap; font-weight: 400; }
    @font-face { font-family: 'Amulya'; src: url('https://saabuildingblocks.pages.dev/_next/static/media/Amulya_Variable-s.6f10ee89.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }
    @font-face { font-family: 'Synonym'; src: url('https://saabuildingblocks.pages.dev/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }

    /* CSS Custom Properties */
    :root {
      --font-taskor: 'Taskor', serif;
      --font-amulya: 'Amulya', system-ui, sans-serif;
      --font-synonym: 'Synonym', system-ui, sans-serif;
      --color-brandGold: #ffd700;
      --color-headingText: #e5e4dd;
      --color-bodyText: #bfbdb0;
      --font-size-h1: clamp(38px, calc(27.82px + 4.07vw), 150px);
      --font-size-h2: clamp(28px, calc(24.00px + 1.60vw), 72px);
      --font-size-body: clamp(16px, calc(14.91px + 0.44vw), 28px);
      --font-size-tagline: clamp(21px, calc(17.45px + 1.42vw), 60px);
      --font-size-button: clamp(16px, calc(14.55px + 0.58vw), 32px);
      --section-padding-y: clamp(4rem, calc(3rem + 2vw), 6rem);
    }

    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      scroll-behavior: smooth;
      background: transparent;
      overscroll-behavior: none;
    }

    body {
      font-family: var(--font-synonym), system-ui, -apple-system, sans-serif;
      background: radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%);
      background-color: rgb(12, 12, 12);
      color: var(--color-bodyText);
      min-height: 100vh;
      line-height: 1.6;
      overscroll-behavior: none;
    }

    /* Typography */
    .text-h1 {
      font-family: var(--font-taskor), sans-serif;
      font-size: var(--font-size-h1);
      line-height: 1.1;
      font-weight: 400;
      color: var(--color-brandGold);
    }

    .text-h2 {
      font-family: var(--font-taskor), sans-serif;
      font-size: var(--font-size-h2);
      line-height: 1.1;
      font-weight: 700;
      color: var(--color-headingText);
    }

    .text-tagline {
      font-family: var(--font-taskor), sans-serif;
      font-size: var(--font-size-tagline);
      line-height: 1.4;
      font-weight: 400;
    }

    .text-body {
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: var(--font-size-body);
      line-height: 1.6;
      color: var(--color-bodyText);
    }

    .font-heading {
      font-family: var(--font-taskor), system-ui, sans-serif;
    }

    /* H1 Neon Sign Effect */
    .h1-neon {
      color: #ffd700;
      transform: perspective(800px) rotateX(12deg);
      font-feature-settings: "ss01" 1;
      text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
        0 0 0.05em #ffd700, 0 0 0.09em rgba(255, 215, 0, 0.8),
        0 0 0.13em rgba(255, 215, 0, 0.55), 0 0 0.18em rgba(255, 179, 71, 0.35),
        0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      animation: h1GlowBreathe 4s ease-in-out infinite;
    }

    @keyframes h1GlowBreathe {
      0%, 100% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25)); }
      50% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45)); }
    }

    /* H2 Metal Backing Effect */
    .h2-container {
      display: flex;
      justify-content: center;
      gap: 0.5em;
      flex-wrap: wrap;
      position: relative;
      padding-left: 0.35em;
      padding-right: 0.35em;
      font-feature-settings: "ss01" 1;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2.5rem;
    }

    .h2-word {
      display: inline-block;
      position: relative;
      color: #bfbdb0;
      text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.4);
    }

    .h2-word::before {
      content: "";
      position: absolute;
      top: -0.25em;
      left: -0.3em;
      right: -0.3em;
      bottom: -0.25em;
      background: linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%);
      border-radius: 0.15em;
      z-index: -1;
      border-top: 2px solid rgba(180,180,180,0.45);
      border-left: 1px solid rgba(130,130,130,0.35);
      border-right: 1px solid rgba(60,60,60,0.6);
      border-bottom: 2px solid rgba(0,0,0,0.7);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.25),
        0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
    }

    .h2-word::after {
      content: "";
      position: absolute;
      top: -0.25em;
      left: -0.3em;
      right: -0.3em;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%);
      border-radius: 0.15em 0.15em 0 0;
      z-index: -1;
      pointer-events: none;
    }

    /* Tagline */
    .tagline {
      text-align: center;
      transform: rotateX(15deg);
      position: relative;
      color: #bfbdb0;
      font-feature-settings: "ss01" 1;
      text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8);
      filter: drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6));
    }

    /* Tagline ellipse gradient background for readability */
    .tagline-backdrop {
      position: relative;
      display: inline-block;
    }

    .tagline-backdrop::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 140px;
      background: radial-gradient(ellipse 60% 50% at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
      z-index: -1;
      pointer-events: none;
    }

    /* CTA Button */
    .cta-button {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      height: clamp(45px, calc(43.182px + 0.7273vw), 65px);
      min-width: 180px;
      background: rgb(45,45,45);
      border-radius: 12px;
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      border-left: none;
      border-right: none;
      color: var(--color-headingText);
      font-family: var(--font-taskor), sans-serif;
      font-size: var(--font-size-button);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5);
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      z-index: 10;
      -webkit-appearance: none;
      appearance: none;
    }

    .cta-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to left, rgba(255,255,255,0.15), transparent);
      width: 50%;
      transform: skewX(45deg);
    }

    .cta-button:hover {
      /* No transform - button face stays stationary */
    }

    .cta-button-wrapper {
      position: relative;
      display: inline-block;
      padding: 8px 0;
    }

    .cta-light-bar {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 10px;
      background: #ffd700;
      border-radius: 6px;
      transition: width 0.5s ease;
      animation: ctaLightPulse 2s ease-in-out infinite;
    }

    .cta-light-bar-top { top: 3px; z-index: 5; } /* Half (5px) sticks out above button, behind button face */
    .cta-light-bar-bottom { bottom: 3px; z-index: 5; } /* Half (5px) sticks out below button, behind button face */
    .cta-button-wrapper:hover .cta-light-bar { width: 80%; }

    @keyframes ctaLightPulse {
      0%, 100% { opacity: 0.8; box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      50% { opacity: 1; box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    /* Organic light bar pulse animation - matches globals.css ctaLightPulseOpacity */
    @keyframes ctaLightPulseOpacity {
      0% { opacity: 0.55; }
      13% { opacity: 0.95; }
      28% { opacity: 0.6; }
      41% { opacity: 0.85; }
      54% { opacity: 0.5; }
      67% { opacity: 1; }
      83% { opacity: 0.7; }
      100% { opacity: 0.55; }
    }

    /* Light bar pulse classes - matches globals.css */
    .cta-light-bar-pulse {
      position: relative;
      --glow-color: 255, 215, 0;
    }

    .cta-light-bar-pulse::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 0 0 6px 2px rgba(var(--glow-color), 0.45), 0 0 20px 8px rgba(var(--glow-color), 0.15);
      pointer-events: none;
    }

    .cta-light-bar-pulse::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 0 0 10px 4px rgba(var(--glow-color), 0.5), 0 0 35px 15px rgba(var(--glow-color), 0.2);
      pointer-events: none;
      animation: ctaLightPulseOpacity 2.4s linear infinite;
      animation-delay: inherit;
      will-change: opacity;
      transform: translateZ(0);
    }

    /* Side light bar hover expansion */
    .group:hover .cta-light-bar-side {
      height: 38px !important;
    }

    /* Hero Section */
    .hero-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 0;
      pointer-events: none;
    }

    .hero-content { pointer-events: auto; }

    .hero-spacer { height: 100svh; }

    .hero-section {
      min-height: 100dvh;
      width: 100%;
      max-width: 3000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hero-content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 3000px;
      padding-top: 8%;
      transition: transform 0.1s linear, filter 0.1s linear, opacity 0.1s linear;
    }

    @media (min-width: 768px) {
      .hero-content-wrapper { padding-top: 0; }
    }

    .hero-image-container {
      position: relative;
      pointer-events: none;
      z-index: 1;
      width: clamp(420px, 52vw, 1000px);
      max-width: 95vw;
      aspect-ratio: 900 / 500;
      max-height: 55dvh;
    }

    .hero-3d-backdrop {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 110%;
      height: 110%;
      top: 0;
      background: radial-gradient(ellipse 60% 50% at center 45%, rgba(100,80,150,0.15) 0%, rgba(50,40,80,0.1) 40%, transparent 70%);
      filter: blur(40px);
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%);
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
      /* Hide alt text while loading */
      color: transparent;
      font-size: 0;
    }

    .hero-text-wrapper {
      width: 100%;
      padding: 0 16px;
      text-align: center;
      pointer-events: auto;
      z-index: 2;
      max-width: 3000px;
      margin-top: calc(min(clamp(400px, 47.37vw, 900px) / 7.2, 12.5dvh) * -1);
    }

    @media (min-width: 640px) { .hero-text-wrapper { padding: 0 32px; } }
    @media (min-width: 768px) { .hero-text-wrapper { padding: 0 48px; } }

    /* Reveal Mask Effect */
    .reveal-mask-effect {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 0;
    }

    .reveal-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 61% 43% at 50% 42%, rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%);
    }

    .reveal-ring {
      position: absolute;
      border: 2px solid rgba(255,215,0,0.25);
      border-radius: 35%;
      left: 50%;
      top: 42%;
    }

    .reveal-ring-outer {
      width: min(68vw, 595px);
      height: min(68vw, 595px);
      transform: translate(-50%, -50%);
    }

    .reveal-ring-inner {
      width: min(51vw, 442px);
      height: min(51vw, 442px);
      border-color: rgba(255,215,0,0.18);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .hero-vignette {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: calc(100% + 100px);
      background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%);
      pointer-events: none;
    }

    /* Agent Counter (Desktop - corner position) */
    .agent-counter {
      position: absolute;
      z-index: 50;
      left: 8px;
      top: 130px;
    }

    @media (min-width: 1024px) {
      .agent-counter { left: auto; right: 32px; }
    }

    /* Hide desktop counter on mobile (<500px) */
    @media (max-width: 499px) {
      .agent-counter { display: none !important; }
    }

    .counter-digit {
      display: inline-block;
      width: 0.6em;
      text-align: center;
    }

    /* Tagline Counter Suffix (Mobile - inline with tagline) */
    .tagline-counter-suffix {
      display: none;
      align-items: baseline;
      gap: 0;
    }

    /* Show tagline counter on mobile (<500px) */
    @media (max-width: 499px) {
      .tagline-counter-suffix {
        display: inline-flex !important;
      }
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: fixed;
      bottom: max(32px, calc(env(safe-area-inset-bottom, 0px) + 24px));
      right: 32px;
      pointer-events: none;
      z-index: -1;
      filter: drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6));
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }

    @keyframes scrollBounce {
      0% { transform: translateY(0); }
      100% { transform: translateY(30px); }
    }

    @keyframes scrollOpacity {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .scroll-arrow-container { animation: scrollBounce 1.5s infinite; }

    .scroll-arrow {
      animation: scrollOpacity 1.5s infinite;
    }

    .scroll-arrow:last-child {
      animation-direction: reverse;
      margin-top: -6px;
    }

    .scroll-arrow > div {
      width: 36px;
      height: 36px;
      border-right: 8px solid #bfbdb0;
      border-bottom: 8px solid #bfbdb0;
      border-radius: 4px;
      transform: rotate(45deg) translateZ(1px);
      filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 2px rgba(255,255,255,0.8));
    }

    /* Glass Panel */
    .glass-panel {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
    }

    /* Bottom glass panel - only round top corners */
    .glass-panel-bottom {
      border-radius: 24px 24px 0 0;
    }

    .glass-panel-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(247,231,206,0.04) 0%, rgba(247,231,206,0.05) 50%, rgba(247,231,206,0.04) 100%);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25),
        inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.2),
        inset 0 8px 20px -8px rgba(247,231,206,0.3), inset 0 20px 40px -20px rgba(255,255,255,0.15),
        inset 0 -1px 0 0 rgba(0,0,0,0.7), inset 0 -2px 6px 0 rgba(0,0,0,0.5),
        inset 0 -10px 25px -8px rgba(0,0,0,0.6), inset 0 -25px 50px -20px rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
    }

    /* Champagne variant with dots texture */
    .glass-panel-champagne::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
      background-size: 8px 8px;
      pointer-events: none;
    }

    .glass-panel-texture {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
      background-size: 8px 8px;
    }

    .glass-panel-content { position: relative; z-index: 10; }

    /* Value Pillars Tab */
    .value-pillars-tab {
      position: relative;
      z-index: 10;
      margin-bottom: -38px;
    }

    .value-pillars-shadow {
      position: absolute;
      left: 32px;
      right: 32px;
      bottom: -12px;
      height: 35px;
      background: radial-gradient(ellipse 60% 100% at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%);
      filter: blur(12px);
      z-index: -1;
      border-radius: 50%;
    }

    .value-pillars-bg {
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(22, 22, 22, 0.94) 0%, rgba(15, 15, 15, 0.97) 100%);
      pointer-events: none;
    }

    @keyframes whiteVignetteGlow {
      0%, 100% { box-shadow: inset 0 20px 30px -15px rgba(255, 255, 255, 0.12), inset 0 -20px 30px -15px rgba(255, 255, 255, 0.12), inset 20px 0 30px -15px rgba(255, 255, 255, 0.12), inset -20px 0 30px -15px rgba(255, 255, 255, 0.12); }
      50% { box-shadow: inset 0 35px 45px -20px rgba(255, 255, 255, 0.22), inset 0 -35px 45px -20px rgba(255, 255, 255, 0.22), inset 35px 0 45px -20px rgba(255, 255, 255, 0.22), inset -35px 0 45px -20px rgba(255, 255, 255, 0.22); }
    }

    .value-pillars-glow {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
      border-radius: 24px;
      animation: whiteVignetteGlow 4s ease-in-out infinite;
    }

    /* Pillar numbers (01, 02, 03) - 25% larger with gold glow */
    .pillar-number-large {
      color: #bca24a;
      font-weight: 700;
      min-width: 1.5em;
      font-size: 1.75em; /* 75% larger than text */
      text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
        0 0 0.05em #bca24a, 0 0 0.09em rgba(188, 162, 74, 0.8),
        0 0 0.13em rgba(188, 162, 74, 0.55), 0 0 0.18em rgba(188, 162, 74, 0.35),
        0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25));
      animation: pillarGlowBreathe 4s ease-in-out infinite;
    }

    /* Pillar labels (Smart Agent Alliance, Inside eXp Realty, etc) - gold glow, same size as text */
    .pillar-label {
      color: #bca24a;
      font-weight: 700;
      text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
        0 0 0.05em #bca24a, 0 0 0.09em rgba(188, 162, 74, 0.8),
        0 0 0.13em rgba(188, 162, 74, 0.55), 0 0 0.18em rgba(188, 162, 74, 0.35),
        0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25));
      animation: pillarGlowBreathe 4s ease-in-out infinite;
    }

    /* Pillar description text - body font, no glow */
    .pillar-description {
      color: #bfbdb0;
      font-weight: 400;
      font-family: var(--font-synonym), system-ui, sans-serif;
    }

    .pillar-text {
      color: #bfbdb0;
      font-weight: 400;
    }

    /* Pillar row responsive text sizing: text-sm on mobile, text-base on md+ */
    .pillar-row { font-size: 0.875rem; } /* 14px - text-sm */
    @media (min-width: 768px) { .pillar-row { font-size: 1rem; } } /* 16px - text-base */

    @keyframes pillarGlowBreathe {
      0%, 100% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25)); }
      50% { filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(188, 162, 74, 0.45)); }
    }

    .icon-3d {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #c4a94d;
      filter: drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
      transform: perspective(500px) rotateX(8deg);
    }
    .icon-3d-green {
      color: #00cc66;
      filter: drop-shadow(-1px -1px 0 #66ff99) drop-shadow(1px 1px 0 #009944) drop-shadow(3px 3px 0 #1d2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
    }
    .icon-3d-purple {
      color: #9933ff;
      filter: drop-shadow(-1px -1px 0 #cc88ff) drop-shadow(1px 1px 0 #6622aa) drop-shadow(3px 3px 0 #1d1d2a) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
    }

    /* Why eXp Realty 5-Card Layout */
    .why-exp-grid-top {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .why-exp-grid-bottom {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 768px) {
      .why-exp-grid-top {
        grid-template-columns: repeat(3, 1fr);
      }
      .why-exp-grid-bottom {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .why-exp-card {
      padding: 1.5rem;
      border-radius: 1rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.7s ease-out;
      opacity: 0;
      transform: translateY(30px);
    }
    .why-exp-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .why-exp-card-heading {
      font-weight: bold;
      margin-bottom: 0.5rem;
      font-size: clamp(24px, calc(22.55px + 0.58vw), 40px);
    }

    /* Secondary Button Styles */
    .secondary-button-wrapper {
      position: relative;
      display: inline-block;
    }
    .secondary-button {
      display: inline-block;
      padding: 12px 24px;
      background: transparent;
      color: #e5e4dd;
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .secondary-button:hover {
      border-color: rgba(255,215,0,0.6);
      background: rgba(255,215,0,0.1);
    }
    .secondary-light-bar {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      opacity: 0.7;
    }
    .secondary-light-bar-top {
      top: 0;
    }
    .secondary-light-bar-bottom {
      bottom: 0;
    }

    /* Sections */
    .section { padding: 64px 24px; }
    @media (min-width: 768px) { .section { padding: 96px 48px; } }

    .section-content {
      max-width: 1300px;
      margin: 0 auto;
    }

    .section-center { text-align: center; }

    /* Bento Cards */
    .bento-card {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
      border: 1px solid rgba(255,255,255,0.1);
      transition: transform 0.5s ease, box-shadow 0.5s ease;
    }

    .bento-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }

    .bento-card-content { padding: 32px; }
    @media (min-width: 768px) { .bento-card-content { padding: 40px; } }

    .bento-image {
      transition: transform 0.7s ease;
    }

    .bento-card:hover .bento-image { transform: scale(1.05); }

    /* Check Icon 3D */
    .check-3d {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      color: #c4a94d;
      filter: drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(2px 2px 0 #2a2a1d) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5));
      transform: perspective(500px) rotateX(8deg);
      flex-shrink: 0;
    }

    /* What You Get - Blur Reveal Cards */
    .wyg-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 1200px) {
      .wyg-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .wyg-grid .wyg-full-width {
        grid-column: 1 / -1;
      }
    }
    .wyg-blur-card {
      transition: filter 0.1s ease-out, opacity 0.1s ease-out, transform 0.1s ease-out;
    }
    .wyg-card-inner {
      border-radius: 1rem;
      overflow: hidden;
      position: relative;
      min-height: 160px;
      height: 100%;
    }
    .wyg-card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
    }
    .wyg-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(30,30,30,0.88) 0%, rgba(40,40,40,0.75) 50%, rgba(50,50,50,0.6) 100%);
    }
    .wyg-card-accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #ffd700;
    }
    .wyg-card-content {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
    }
    .wyg-card-icon {
      flex-shrink: 0;
    }
    .wyg-card-title {
      font-family: var(--font-amulya), system-ui, sans-serif;
      font-weight: 700;
      font-size: clamp(20px, calc(18px + 0.5vw), 28px);
      color: var(--color-heading, #f5f5f0);
      margin-bottom: 0.5rem;
    }
    .wyg-card-desc {
      color: #d1d5db;
      font-family: var(--font-synonym);
      font-size: var(--font-size-body);
      line-height: 1.6;
    }

    /* WhyOnlyAtExp - 3D Rotating Card Stack with ScrollTrigger */
    .why-only-section {
      position: relative;
    }
    .why-only-trigger {
      /* This gets pinned by GSAP ScrollTrigger */
    }
    .why-only-content {
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(180deg, rgba(255,190,0,0.032) 0%, rgba(255,190,0,0.04) 50%, rgba(255,190,0,0.032) 100%);
      box-shadow:
        0 8px 32px rgba(0,0,0,0.4),
        0 4px 12px rgba(0,0,0,0.25),
        inset 0 1px 0 0 rgba(255,255,255,0.35),
        inset 0 2px 4px 0 rgba(255,255,255,0.2),
        inset 0 8px 20px -8px rgba(255,190,0,0.3),
        inset 0 20px 40px -20px rgba(255,255,255,0.15),
        inset 0 -1px 0 0 rgba(0,0,0,0.7),
        inset 0 -2px 6px 0 rgba(0,0,0,0.5),
        inset 0 -10px 25px -8px rgba(0,0,0,0.6),
        inset 0 -25px 50px -20px rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
      transform: translateY(30px);
    }
    .why-only-noise {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 24px;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.06;
      mix-blend-mode: overlay;
    }
    .why-only-card-stack {
      position: relative;
      height: 280px;
      width: 100%;
      perspective: 1200px;
    }
    @media (min-width: 768px) {
      .why-only-card-stack {
        height: 340px;
      }
    }
    .why-only-card {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      backface-visibility: hidden;
      transform-origin: center bottom;
      transition: background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    .why-only-card-dark {
      background: linear-gradient(180deg, rgba(40,40,40,0.98), rgba(20,20,20,0.99));
      border: 1px solid rgba(255,215,0,0.27);
      box-shadow: 0 0 40px rgba(255,215,0,0.08), 0 30px 60px -30px rgba(0,0,0,0.8);
    }
    .why-only-card-highlight {
      background:
        radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
        radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
        radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
        radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
        linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%);
      border: 2px solid rgba(180,150,50,0.5);
      box-shadow: 0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25);
    }
    .why-only-number-badge {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    @media (min-width: 768px) {
      .why-only-number-badge {
        width: 64px;
        height: 64px;
      }
    }
    .why-only-number-badge-dark {
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.15);
    }
    .why-only-number-badge-highlight {
      background: rgba(42,42,42,0.9);
      border: 3px solid rgba(42,42,42,0.7);
      box-shadow: 0 0 30px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,0,0,0.15);
    }
    .why-only-number-3d {
      font-weight: bold;
      font-size: 32px;
      color: #c4a94d;
      filter: drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
      transform: perspective(500px) rotateX(8deg);
    }
    .why-only-number-3d-highlight {
      color: #9a9a9a;
      filter: drop-shadow(-1px -1px 0 #ccc) drop-shadow(1px 1px 0 #666) drop-shadow(2px 2px 0 #444) drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5));
    }
    .why-only-card-text {
      font-family: var(--font-heading), system-ui, sans-serif;
      font-weight: bold;
      line-height: 1.4;
      padding: 0 0.5rem;
      font-size: clamp(24px, calc(22.55px + 0.58vw), 40px);
    }
    .why-only-card-text-light {
      color: #e5e5e5;
    }
    .why-only-card-text-dark {
      color: #2a2a2a;
    }
    /* Progress bar */
    .why-only-progress-bar {
      width: 256px;
      height: 12px;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
      border: 1px solid rgba(245, 245, 240, 0.25);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05);
    }
    @media (min-width: 768px) {
      .why-only-progress-bar {
        width: 320px;
      }
    }
    .why-only-progress-fill {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(180deg, #ffe566 0%, #ffd700 40%, #cc9900 100%);
      box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd700, 0 0 32px rgba(255,215,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4);
      transition: width 0.05s ease-out;
    }
    /* Responsive grid for WhyOnly section */
    @media (min-width: 768px) {
      .why-only-grid-responsive {
        grid-template-columns: 1fr 1fr !important;
      }
    }

    /* Media Logos */
    .media-logos-section { position: relative; padding: 64px 0; overflow: hidden; }
    @media (min-width: 768px) { .media-logos-section { padding: 96px 0; } }

    .media-logos-container { position: relative; z-index: 10; }

    .portal-edge-left {
      position: absolute;
      left: 0;
      z-index: 20;
      pointer-events: none;
      top: -8px;
      bottom: -8px;
      width: 12px;
      border-radius: 0 12px 12px 0;
      background: radial-gradient(ellipse 200% 50% at 0% 50%, rgba(255,200,50,0.35) 0%, rgba(255,180,0,0.2) 40%, rgba(180,140,0,0.1) 70%, rgba(100,80,0,0.05) 100%);
      border-right: 1px solid rgba(255,190,0,0.4);
      box-shadow: inset -3px 0 6px rgba(255,200,50,0.2), inset -1px 0 2px rgba(255,220,100,0.3), 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3);
      transform: perspective(500px) rotateY(-3deg);
      transform-origin: right center;
    }

    .portal-edge-right {
      position: absolute;
      right: 0;
      z-index: 20;
      pointer-events: none;
      top: -8px;
      bottom: -8px;
      width: 12px;
      border-radius: 12px 0 0 12px;
      background: radial-gradient(ellipse 200% 50% at 100% 50%, rgba(255,200,50,0.35) 0%, rgba(255,180,0,0.2) 40%, rgba(180,140,0,0.1) 70%, rgba(100,80,0,0.05) 100%);
      border-left: 1px solid rgba(255,190,0,0.4);
      box-shadow: inset 3px 0 6px rgba(255,200,50,0.2), inset 1px 0 2px rgba(255,220,100,0.3), -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3);
      transform: perspective(500px) rotateY(3deg);
      transform-origin: left center;
    }

    .logo-track-container {
      position: relative;
      margin-left: 12px;
      margin-right: 12px;
      overflow: hidden;
      border-radius: 12px;
    }

    .logo-track-shadow-left {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
      pointer-events: none;
      width: 30px;
      background: radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
    }

    .logo-track-shadow-right {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
      pointer-events: none;
      width: 30px;
      background: radial-gradient(ellipse 100% 60% at 100% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
    }

    .logo-track {
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 32px 0;
      will-change: transform;
    }

    @media (min-width: 768px) { .logo-track { gap: 64px; } }

    /* 3D Logo Effect */
    .logo-3d-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #c4a94d;
      filter: drop-shadow(-1px -1px 0 #e6d99a) drop-shadow(1px 1px 0 #756429) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
      transform: perspective(500px) rotateX(8deg);
      width: 120px;
      height: 120px;
    }

    .logo-img {
      height: 70px;
      width: auto;
      object-fit: contain;
      max-width: clamp(200px, 18vw, 300px);
      filter: brightness(0) invert(0.8);
    }

    @media (min-width: 768px) {
      .logo-img {
        height: 72px;
      }
    }

    /* Video Player */
    .video-player-container { width: 100%; }

    .video-frame {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
      border: 1px solid rgba(150,150,150,0.4);
      padding: 4px;
    }

    .video-wrapper {
      position: relative;
      padding-top: 56.25%;
      background: #1a1a1a;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }

    .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      pointer-events: none;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      cursor: pointer;
      background: transparent;
      transition: background 0.2s ease;
    }

    .video-overlay:hover { background: rgba(0, 0, 0, 0.15); }
    .video-overlay:hover .overlay-play-btn { transform: scale(1.1); }

    .overlay-play-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 215, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2);
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .overlay-play-btn svg {
      width: 36px;
      height: 36px;
      fill: #1a1a1a;
      margin-left: 4px;
    }

    .overlay-play-btn.is-playing svg { margin-left: 0; }
    .video-overlay.is-playing .overlay-play-btn { opacity: 0; }
    .video-overlay.is-playing:hover .overlay-play-btn { opacity: 1; }

    .scrubber-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      padding: 8px 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      cursor: pointer;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .scrubber-container.visible { opacity: 1; }

    .scrubber-watched {
      position: absolute;
      bottom: 8px;
      left: 0;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    .scrubber-current {
      position: absolute;
      bottom: 8px;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #ffd700, #ffcc00);
      border-radius: 2px;
      z-index: 1;
    }

    .scrubber-thumb {
      position: absolute;
      bottom: 4px;
      width: 14px;
      height: 14px;
      background: #ffd700;
      border-radius: 50%;
      transform: translateX(-50%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 2;
      transition: transform 0.1s ease;
    }

    .scrubber-container:hover .scrubber-thumb,
    .scrubber-container:active .scrubber-thumb {
      transform: translateX(-50%) scale(1.3);
    }

    .video-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.95) 100%);
      border-top: 1px solid rgba(255,215,0,0.2);
      border-radius: 0 0 8px 8px;
    }

    .control-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .control-btn:hover {
      background: rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.4);
      color: #ffd700;
    }

    .control-btn:active { transform: scale(0.95); }
    .control-btn svg { width: 18px; height: 18px; }

    .control-btn--play {
      background: linear-gradient(135deg, #ffd700 0%, #e6c200 100%);
      border-color: #ffd700;
      color: #1a1a1a;
      width: 40px;
      height: 40px;
    }

    .control-btn--play:hover {
      background: linear-gradient(135deg, #ffe033 0%, #ffd700 100%);
      color: #1a1a1a;
    }

    .control-btn--play svg {
      width: 20px;
      height: 20px;
      fill: #1a1a1a;
      stroke: #1a1a1a;
    }

    .rewind-text {
      position: absolute;
      font-size: 8px;
      font-weight: 700;
      bottom: 4px;
      right: 4px;
    }

    .time-display {
      font-family: var(--font-synonym), monospace;
      font-size: 0.85rem;
      color: #bfbdb0;
      margin: 0 0.5rem;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .volume-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }

    .volume-slider {
      width: 80px;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      background: #ffd700;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.1s ease;
    }

    .volume-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: #ffd700;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }

    .progress-area { text-align: center; margin-top: 1.5rem; }

    .progress-bar {
      width: 100%;
      max-width: 400px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      margin: 0 auto 1rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #ffd700, #00ff88);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    @media (max-width: 600px) {
      .video-controls { flex-wrap: wrap; gap: 0.4rem; padding: 0.5rem; }
      .time-display { order: 10; width: 100%; text-align: center; margin: 0.25rem 0 0; }
      .volume-controls { margin-left: 0; }
      .volume-slider { width: 60px; }
    }

    /* Modals */
    .modal-container {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
    }

    .modal-container.open { display: flex; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(8px);
    }

    .modal-wrapper {
      position: relative;
      z-index: 100001;
      max-width: 520px;
      width: 100%;
      max-height: 90vh;
      margin: auto;
    }

    .modal {
      position: relative;
      background: #151517;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem 2rem 2rem 2rem;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .modal-close-btn {
      position: absolute;
      top: -12px;
      right: -12px;
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      padding: 0;
      margin: 0;
      background: rgba(40, 40, 40, 0.95);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100005;
    }

    .modal-close-btn:hover {
      background: rgba(60, 60, 60, 0.95);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .modal-close-btn svg { pointer-events: none; display: block; flex-shrink: 0; }

    /* Tool Modal (fits content) */
    .tool-modal-wrapper {
      position: relative;
      z-index: 100001;
      width: auto;
      max-width: 95vw;
      margin: auto;
    }

    .tool-modal {
      position: relative;
      background: #0a0a0a;
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 16px;
      padding: 0;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 0 30px rgba(255,215,0,0.2), 0 10px 40px rgba(0,0,0,0.5);
    }

    .tool-modal iframe {
      display: block;
      border: none;
      border-radius: 0;
      background: #0a0a0a;
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
      margin: 0;
      padding: 0;
    }

    .tool-modal iframe.loaded {
      opacity: 1;
    }

    /* Loading spinner for tool modals */
    .tool-modal-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      transition: opacity 0.3s ease-out;
    }

    .tool-modal-spinner.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .spinner-ring {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(255, 215, 0, 0.2);
      border-top-color: #ffd700;
      border-radius: 50%;
      animation: spinnerRotate 1s linear infinite;
    }

    @keyframes spinnerRotate {
      to { transform: rotate(360deg); }
    }

    #calculator-modal .tool-modal iframe {
      width: 900px;
      max-width: 95vw;
      height: auto;
      max-height: 85vh;
    }

    #revshare-modal .tool-modal iframe {
      width: 900px;
      max-width: 95vw;
      height: auto;
      max-height: 85vh;
    }

    @media (max-width: 768px) {
      #calculator-modal .tool-modal iframe {
        width: 95vw;
        height: auto;
        max-height: 85vh;
      }
      #revshare-modal .tool-modal iframe {
        width: 95vw;
        height: auto;
        max-height: 90vh;
      }
    }

    /* Join Modal */
    .join-modal-title {
      font-family: var(--font-amulya), system-ui, sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .join-modal-subtitle {
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group { margin-bottom: 1rem; }

    .form-label {
      display: block;
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: 0.875rem;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: rgba(255, 215, 0, 0.5);
    }

    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #1a1a1c;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: 1rem;
      box-sizing: border-box;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
    }

    .form-select option { background: #1a1a1c; color: #fff; }

    .form-submit {
      width: 100%;
      margin-top: 1.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #ffd700, #e6c200);
      color: #2a2a2a;
      font-family: var(--font-taskor), system-ui, sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .form-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .form-message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
      font-size: 0.9rem;
    }

    .form-message.success { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
    .form-message.error { background: rgba(255, 68, 68, 0.1); color: #ff4444; }

    /* Instructions Modal */
    .instructions-modal { text-align: center; }

    .success-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      background: rgba(0, 255, 136, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-icon svg { width: 32px; height: 32px; stroke: #00ff88; }

    .instructions-title {
      font-family: var(--font-amulya), system-ui, sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .instructions-subtitle {
      font-family: var(--font-synonym), system-ui, sans-serif;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2rem;
    }

    .instructions-list { text-align: left; margin-bottom: 2rem; }

    .instruction-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .instruction-item:last-child { margin-bottom: 0; }

    .instruction-number {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #ffd700, #e6c200);
      color: #2a2a2a;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .instruction-content { flex: 1; }

    .instruction-title {
      display: block;
      color: #fff;
      font-family: var(--font-amulya), system-ui, sans-serif;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .instruction-text {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    .instruction-text a { color: #ffd700; }
    .instruction-text strong { color: #fff; }

    .instructions-cta {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #ffd700, #e6c200);
      color: #2a2a2a;
      font-family: var(--font-taskor), system-ui, sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: block;
      text-decoration: none;
      text-align: center;
    }

    .instructions-footer {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .instructions-footer a { color: #ffd700; text-decoration: none; }

    /* Grid utilities */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @media (min-width: 768px) {
      .md:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      .md:col-span-5 { grid-column: span 5 / span 5; }
      .md:col-span-7 { grid-column: span 7 / span 7; }
      .md:col-span-8 { grid-column: span 8 / span 8; }
    }

    /* Why SAA section grid - two cards side by side */
    .why-saa-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      align-items: stretch;
    }
    @media (min-width: 768px) {
      .why-saa-grid {
        grid-template-columns: 7fr 5fr;
        gap: 1.5rem;
      }
    }
    .why-saa-right-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }
    @media (min-width: 768px) {
      .why-saa-right-column {
        gap: 1.5rem;
      }
    }

    /* Expand reveal animation - cards open from edges with rounded corners */
    .expand-card-wrapper {
      position: relative;
      height: 100%;
    }
    .expand-card-frame {
      position: absolute;
      top: 0;
      overflow: hidden;
      height: 100%;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
      transition: width 0.15s ease-out;
    }
    .expand-card-frame-left {
      left: 0;
    }
    .expand-card-frame-right {
      right: 0;
    }
    .expand-card-content-inner {
      position: absolute;
      top: 0;
      height: 100%;
    }
    .expand-card-content-left {
      left: 0;
    }
    .expand-card-content-right {
      right: 0;
    }

    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    @media (min-width: 768px) {
      .md:gap-6 { gap: 1.5rem; }
    }

    /* Flex utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
    .flex-1 { flex: 1 1 0%; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .gap-3 { gap: 0.75rem; }

    /* Spacing */
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mt-12 { margin-top: 3rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
    @media (min-width: 768px) {
      .md:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
      .md:py-32 { padding-top: 8rem; padding-bottom: 8rem; }
    }

    /* Text utilities */
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-3xl { font-size: 1.875rem; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .opacity-70 { opacity: 0.7; }
    .opacity-80 { opacity: 0.8; }

    /* Width utilities */
    .w-full { width: 100%; }
    .max-w-xl { max-width: 36rem; }
    .max-w-2xl { max-width: 42rem; }
    .max-w-4xl { max-width: 56rem; }

    /* Scroll reveal animation */
    .scroll-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s ease-out, transform 0.7s ease-out;
    }

    .scroll-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Cyber Card Gold */
    .cyber-card-gold {
      perspective: 1000px;
      display: block;
    }

    .cyber-card-gold-frame {
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(0);
      border: 10px solid #ffd700;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 0 4px 1px rgba(255, 215, 0, 0.5), 0 0 8px 2px rgba(255, 215, 0, 0.35),
        0 0 16px 4px rgba(255, 215, 0, 0.2), 0 0 24px 6px rgba(255, 215, 0, 0.1), 0 4px 12px rgba(0,0,0,0.3);
      overflow: visible;
    }

    @keyframes cyberCardGoldOrganicPulse {
      0% { opacity: 0.55; }
      13% { opacity: 0.95; }
      28% { opacity: 0.6; }
      41% { opacity: 0.85; }
      54% { opacity: 0.5; }
      67% { opacity: 1; }
      83% { opacity: 0.7; }
      100% { opacity: 0.55; }
    }

    .cyber-card-gold-frame::after {
      content: "";
      position: absolute;
      top: -12px;
      left: -12px;
      right: -12px;
      bottom: -12px;
      border-radius: 18px;
      border: 2px solid rgba(255,255,255,0.4);
      box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.6), 0 0 12px 4px rgba(255, 215, 0, 0.4),
        0 0 20px 6px rgba(255, 215, 0, 0.25), 0 0 32px 10px rgba(255, 215, 0, 0.12), 0 6px 16px rgba(0,0,0,0.35);
      pointer-events: none;
      z-index: -1;
      animation: cyberCardGoldOrganicPulse 2.4s linear infinite;
      will-change: opacity;
    }

    .cyber-card-gold-frame::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 6px;
      border: 2px solid rgba(255,255,255,0.5);
      pointer-events: none;
      z-index: 1;
    }

    .cyber-card-gold-content {
      position: relative;
      z-index: 2;
      transform-style: preserve-3d;
      transform: translateZ(0);
      padding: 24px;
      text-align: center;
    }

    /* Founder Card Styles */
    .founder-card {
      text-align: center;
      padding: 1.5rem 2rem;
      background-color: rgba(20,20,20,0.75);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      transition: border-color 0.3s ease;
    }
    .founder-card:hover {
      border-color: rgba(255, 215, 0, 0.3);
    }

    /* Profile Cyber Frame - circular image with 3D metal frame */
    .profile-cyber-frame {
      width: 192px;
      height: 192px;
      position: relative;
      margin: 0 auto 24px auto;
    }
    /* 3D Metal Frame */
    .profile-cyber-frame-metal {
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border-radius: 9999px;
      background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
      border: 1px solid rgba(150,150,150,0.4);
      box-shadow:
        0 4px 20px rgba(0,0,0,0.6),
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 0 15px rgba(255,215,0,0.15);
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .profile-cyber-frame:hover .profile-cyber-frame-metal {
      box-shadow:
        0 4px 25px rgba(0,0,0,0.7),
        inset 0 1px 0 rgba(255,255,255,0.2),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 0 25px rgba(255,215,0,0.3);
      border-color: rgba(255,215,0,0.3);
    }
    /* Inner container */
    .profile-cyber-frame-inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 9999px;
      overflow: hidden;
      background-color: #0a0a0a;
    }
    /* Holographic sheen */
    .profile-cyber-frame-inner::before {
      content: "";
      position: absolute;
      top: -100%;
      left: -100%;
      right: -100%;
      bottom: -100%;
      border-radius: 9999px;
      pointer-events: none;
      z-index: 10;
      background: linear-gradient(
        25deg,
        transparent 0%,
        transparent 35%,
        rgba(255,255,255,0.08) 42%,
        rgba(255,255,255,0.15) 50%,
        rgba(255,255,255,0.08) 58%,
        transparent 65%,
        transparent 100%
      );
      transform: translateX(-20%);
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .profile-cyber-frame:hover .profile-cyber-frame-inner::before {
      transform: translateX(60%);
    }
    /* Gold accent glow ring */
    .profile-cyber-frame-ring {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 9999px;
      pointer-events: none;
      border: 2px solid rgba(255,215,0,0.4);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .profile-cyber-frame:hover .profile-cyber-frame-ring {
      border-color: rgba(255,215,0,0.7);
      box-shadow: 0 0 12px rgba(255,215,0,0.4);
    }

    @keyframes profileFramePulse {
      0%, 100% {
        box-shadow:
          0 0 8px rgba(255, 215, 0, 0.5),
          0 0 16px rgba(255, 215, 0, 0.3),
          0 0 24px rgba(255, 215, 0, 0.2);
      }
      50% {
        box-shadow:
          0 0 12px rgba(255, 215, 0, 0.7),
          0 0 24px rgba(255, 215, 0, 0.5),
          0 0 36px rgba(255, 215, 0, 0.3);
      }
    }

    .profile-cyber-frame-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: #1a1a1a;
    }

    .profile-cyber-frame-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Founder Name - gold glow style */
    /* Founder name - H1-style glow with H3 sizing */
    .founder-name {
      font-family: var(--font-taskor), sans-serif;
      font-size: clamp(27px, calc(25.36px + 0.65vw), 45px);
      line-height: 1.3;
      font-weight: 700;
      color: #ffd700;
      transform: perspective(800px) rotateX(12deg);
      font-feature-settings: "ss01" 1;
      text-shadow:
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        0 0 0.05em #ffd700,
        0 0 0.09em rgba(255, 215, 0, 0.8),
        0 0 0.13em rgba(255, 215, 0, 0.55),
        0 0 0.18em rgba(255, 179, 71, 0.35),
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      animation: h1GlowBreathe 4s ease-in-out infinite;
      margin-bottom: 0.25rem;
      text-align: center;
    }
    .founder-title {
      font-family: 'Synonym', system-ui, sans-serif;
      font-size: var(--font-size-body);
      color: #e5e4dd;
      opacity: 0.6;
      margin-bottom: 0.75rem;
    }
    .founder-bio {
      font-family: 'Synonym', system-ui, sans-serif;
      font-size: var(--font-size-body);
      color: #e5e4dd;
      line-height: 1.6;
      flex: 1;
    }
    /* Position number for leadership cards - 3D icon style (no circle) */
    .position-number {
      position: absolute;
      top: -15px;
      right: -10px;
      font-family: var(--font-taskor), 'Taskor', system-ui, sans-serif;
      font-size: clamp(43px, calc(39px + 1.60vw), 87px);
      font-weight: 700;
      z-index: 20;
      color: #c4a94d;
      filter: drop-shadow(-1px -1px 0 #ffe680) drop-shadow(1px 1px 0 #8a7a3d) drop-shadow(3px 3px 0 #2a2a1d) drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5));
      transform: perspective(500px) rotateX(8deg);
      line-height: 1;
    }
    /* Bio dropdown/accordion - discreet text link style */
    .founder-bio-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      cursor: pointer;
      padding: 0;
      margin-top: 0.5rem;
      background: transparent;
      border: none;
      color: #e5e4dd;
      opacity: 0.6;
      font-family: 'Synonym', system-ui, sans-serif;
      font-size: 13px;
      transition: opacity 0.3s ease;
    }
    .founder-bio-toggle:hover {
      opacity: 0.8;
    }
    .founder-bio-toggle svg {
      transition: transform 0.3s ease;
      opacity: 0.7;
    }
    .founder-bio-toggle.open svg {
      transform: rotate(180deg);
    }
    .founder-bio-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
      opacity: 0;
      margin-top: 0;
    }
    .founder-bio-content.open {
      max-height: 200px;
      opacity: 1;
      margin-top: 0.75rem;
    }
    /* Leadership grid - 3 columns */
    .leadership-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 768px) {
      .leadership-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
      }
    }
    @keyframes h1GlowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45));
      }
    }

    /* BuiltForFuture - Horizontal Scroll Cards with ScrollTrigger */
    .built-future-section {
      position: relative;
      padding-top: 4rem;
    }
    @media (min-width: 768px) {
      .built-future-section {
        padding-top: 6rem;
      }
    }
    .built-future-trigger {
      /* Gets pinned by ScrollTrigger */
    }
    .built-future-content {
      position: relative;
      transform: translateY(30px);
    }
    /* Data stream background */
    .data-stream-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }
    .data-stream-column {
      position: absolute;
      top: 0;
      height: 100%;
      overflow: hidden;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.4;
    }
    .data-stream-char {
      position: absolute;
    }
    /* Portal edges */
    .portal-edge-left {
      position: absolute;
      left: 0;
      z-index: 20;
      pointer-events: none;
      top: -40px;
      bottom: -40px;
      width: 12px;
      border-radius: 0 12px 12px 0;
      background: linear-gradient(90deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%);
      border-right: 1px solid rgba(255,190,0,0.3);
      box-shadow: 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3);
      transform: perspective(500px) rotateY(-3deg);
      transform-origin: right center;
    }
    .portal-edge-right {
      position: absolute;
      right: 0;
      z-index: 20;
      pointer-events: none;
      top: -40px;
      bottom: -40px;
      width: 12px;
      border-radius: 12px 0 0 12px;
      background: linear-gradient(270deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%);
      border-left: 1px solid rgba(255,190,0,0.3);
      box-shadow: -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3);
      transform: perspective(500px) rotateY(3deg);
      transform-origin: left center;
    }
    /* Cards container */
    .built-future-cards-container {
      position: relative;
      margin-left: 12px;
      margin-right: 12px;
      overflow-x: clip;
      overflow-y: visible;
    }
    .built-future-cards-track {
      display: flex;
      padding: 3rem 0;
    }
    /* Individual cards */
    .built-future-card-wrapper {
      flex-shrink: 0;
      width: 280px;
      transition: transform 0.1s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out;
    }
    @media (min-width: 640px) {
      .built-future-card-wrapper {
        width: 560px;
      }
    }
    .built-future-card {
      padding: 2rem;
      border-radius: 1rem;
      min-height: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      transition: background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    .built-future-card-inactive {
      background: linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98));
      border: 2px solid rgba(255,215,0,0.13);
    }
    .built-future-card-active {
      background:
        radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
        radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%),
        radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%),
        radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%),
        linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%);
      border: 2px solid rgba(180,150,50,0.5);
      box-shadow: 0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25);
    }
    .built-future-card-image {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      z-index: 10;
      transition: background-color 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    @media (min-width: 768px) {
      .built-future-card-image {
        width: 200px;
        height: 200px;
      }
    }
    .built-future-card-image-inactive {
      background-color: rgba(17,17,17,0.5);
      border: 3px solid #ffd700;
    }
    .built-future-card-image-active {
      background-color: rgba(20,18,12,0.85);
      border: 3px solid rgba(40,35,20,0.8);
      box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2);
    }
    .built-future-card-title {
      font-family: var(--font-heading), system-ui, sans-serif;
      font-weight: bold;
      font-size: clamp(1.25rem, 2vw, 1.5rem);
      text-align: center;
      position: relative;
      z-index: 10;
      transition: color 0.2s ease-out;
    }
    .built-future-card-title-light {
      color: #e5e4dd;
    }
    .built-future-card-title-dark {
      color: #2a2a2a;
    }
    /* Progress bar */
    .built-future-progress-bar {
      width: 256px;
      height: 12px;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
      border: 1px solid rgba(245, 245, 240, 0.25);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05);
    }
    @media (min-width: 768px) {
      .built-future-progress-bar {
        width: 320px;
      }
    }
    .built-future-progress-fill {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(180deg, #ffe566 0%, #ffd700 40%, #cc9900 100%);
      box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd700, 0 0 32px rgba(255,215,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4);
      transition: width 0.05s ease-out;
    }
    /* Keep old styles for backwards compatibility */
    .future-text-h4 {
      font-weight: bold;
      color: #e5e4dd;
      font-size: clamp(18px, calc(16.73px + 0.51vw), 32px);
    }
    /* Hide line on mobile */
    @media (max-width: 767px) {
      .future-line-container { display: none; }
      .future-points-row {
        flex-direction: column !important;
        gap: 2rem !important;
      }
      /* Founders grid stacks on mobile */
      .founders-grid {
        grid-template-columns: 1fr !important;
      }
      /* Why eXp grid stacks on mobile */
      .why-exp-grid {
        grid-template-columns: 1fr !important;
      }
      /* Proven at Scale grid stacks on mobile */
      .proven-scale-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* FAQ Styles */
    .faq-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      background: rgba(30, 30, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.3s ease;
    }

    .faq-item:hover {
      border-color: rgba(255, 215, 0, 0.3);
    }

    .faq-item.active {
      border-color: rgba(255, 215, 0, 0.5);
    }

    .faq-question {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      background: transparent;
      border: none;
      color: var(--color-headingText);
      font-family: var(--font-amulya), system-ui, sans-serif;
      font-size: clamp(1rem, 2vw, 1.125rem);
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .faq-question:hover {
      color: #ffd700;
    }

    .faq-chevron {
      flex-shrink: 0;
      transition: transform 0.3s ease;
      color: rgba(255, 255, 255, 0.5);
    }

    .faq-item.active .faq-chevron {
      transform: rotate(180deg);
      color: #ffd700;
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }

    .faq-answer p {
      padding: 0 1.5rem 1.25rem;
      font-size: clamp(0.875rem, 2vw, 1rem);
      line-height: 1.7;
      color: var(--color-bodyText);
    }

    .faq-item.active .faq-answer {
      max-height: 300px;
    }

    /* Check icon 3D style */
    .check-3d {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      background: linear-gradient(180deg, #3d3d3d 0%, #2a2a2a 100%);
      border-radius: 50%;
      color: #ffd700;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 2px rgba(0, 0, 0, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.4);
    }

    /* Glass panel marigold variant with crosshatch texture */
    .glass-panel-marigold {
      background:
        /* Crosshatch texture overlay */
        repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px),
        repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px),
        /* Base marigold gradient */
        linear-gradient(180deg,
          rgba(255, 190, 0, 0.032) 0%,
          rgba(255, 190, 0, 0.04) 50%,
          rgba(255, 190, 0, 0.032) 100%);
      background-size: 16px 16px, 16px 16px, 100% 100%;
    }

    /* Glass panel marigold variant with noise texture */
    .glass-panel-marigold-noise {
      background: linear-gradient(180deg,
        rgba(255, 190, 0, 0.032) 0%,
        rgba(255, 190, 0, 0.04) 50%,
        rgba(255, 190, 0, 0.032) 100%);
    }
    .glass-panel-marigold-noise::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.06;
      mix-blend-mode: overlay;
      border-radius: inherit;
      pointer-events: none;
    }

    /* Prevent body scroll when modal is open */
    body.modal-open { overflow: hidden; }
    html.modal-open { overflow: hidden; }
  </style>

  <!-- GSAP and Lenis for scroll animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.3.15/dist/lenis.min.js"></script>
</head>
<body>
  <!-- Star Field Background -->
  <canvas id="star-canvas" style="position: fixed; top: 0px; left: 0px; width: 800px; height: 600px; z-index: -1; pointer-events: none; background: transparent;" width="800" height="600"></canvas>
  <div style="position: fixed; inset: 0; z-index: -2; background: radial-gradient(ellipse at bottom, #282828 0%, #0c0c0c 100%);"></div>

  <main id="main-content">
    <!-- Hero Section - Fixed -->
    <div class="hero-fixed">
      <div class="hero-content">
        <section class="hero-section" aria-label="Hero">
          <!-- Agent Counter (Desktop) -->
          <div class="agent-counter" id="agent-counter-desktop" style="opacity: 1; filter: blur(0px) brightness(1);">
            <span style="display: inline-flex; align-items: center; gap: 0.25em; font-size: clamp(1.75rem, 2.625vw, 2.1875rem);">
              <span style="display: inline; color: #bfbdb0; font-family: var(--font-synonym), monospace; font-weight: 300; font-size: calc(1em + 10px);">
                <span class="counter-digit">1</span><span class="counter-digit">6</span><span class="counter-digit">8</span><span class="counter-digit">8</span><span>+</span>
              </span>
              <span style="color: #bfbdb0; font-family: var(--font-taskor), sans-serif; font-feature-settings: 'ss01' 1; text-transform: uppercase; letter-spacing: 0.05em; text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8); filter: drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6));">AGENTS</span>
            </span>
          </div>

          <!-- Reveal Mask Effect -->
          <div class="reveal-mask-effect hero-effect-layer" style="opacity: 1; visibility: visible;">
            <div class="reveal-glow" style="background: radial-gradient(52.3329% 36.633% at 50% 42%, rgba(255, 215, 0, 0.2) 0%, rgba(255, 180, 0, 0.12) 35%, rgba(255, 150, 0, 0.06) 55%, transparent 80%);"></div>
            <div class="reveal-ring reveal-ring-outer" style="transform: translate(-50%, -50%) rotate(9.55757deg); border-radius: 41.3239%;"></div>
            <div class="reveal-ring reveal-ring-inner" style="transform: translate(-50%, -50%) rotate(-4.77878deg); border-radius: 28.6761%;"></div>
            <div class="hero-vignette"></div>
          </div>

          <!-- Hero Content -->
          <div class="hero-content-wrapper" id="hero-content-wrapper" style="transform-origin: center center; transform: scale(1) translateY(0px); filter: blur(0px) brightness(1); opacity: 1;">
            <!-- Profile Image -->
            <div class="hero-image-container">
              <div class="hero-3d-backdrop"></div>
              <img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(displayName)}" width="900" height="500" loading="eager" fetchpriority="high" decoding="async" class="hero-image">
            </div>

            <!-- Hero Text -->
            <div class="hero-text-wrapper" style="perspective: 1000px;">
              <h1 id="hero-heading" class="text-h1 h1-neon" style="font-size: clamp(50px, calc(30px + 4vw + 0.3vh), 150px); margin-bottom: 3px;">
                SMART AGENT ALLIANCE
              </h1>
              <div class="tagline-backdrop">
                <p class="text-tagline tagline">
                Join ${escapeHTML(displayName)}'s Team<span class="tagline-counter-suffix"><span style="display: inline; color: #bfbdb0; font-family: var(--font-synonym), monospace; font-weight: 300; font-size: 1em;"> (</span><span style="display: inline; color: #bfbdb0; font-family: var(--font-synonym), monospace; font-weight: 300; font-size: 1em;" class="counter-numbers-tagline"><span class="counter-digit-tagline">1</span><span class="counter-digit-tagline">6</span><span class="counter-digit-tagline">8</span><span class="counter-digit-tagline">8</span><span>+ </span></span><span style="color: #bfbdb0; font-family: var(--font-taskor), sans-serif; font-feature-settings: 'ss01' 1; text-transform: uppercase; letter-spacing: 0.05em;">AGENTS)</span></span>
              </p>
              </div>
              <div class="flex justify-center items-center" style="margin-top: 14px;">
                <div class="cta-button-wrapper">
                  <div class="cta-light-bar cta-light-bar-top"></div>
                  <a href="#watch-and-decide" class="cta-button">WATCH &amp; DECIDE</a>
                  <div class="cta-light-bar cta-light-bar-bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Hero Spacer -->
    <div class="hero-spacer" aria-hidden="true"></div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator" id="scroll-indicator" style="opacity: 1; transform: scale(1);">
      <div class="scroll-arrow-container">
        <div class="scroll-arrow"><div></div></div>
        <div class="scroll-arrow"><div></div></div>
      </div>
    </div>

    <!-- Value Pillars Tab -->
    <div class="value-pillars-tab">
      <div class="value-pillars-shadow"></div>
      <div class="value-pillars-bg"></div>
      <div class="value-pillars-glow"></div>
      <div class="glass-panel">
        <div class="glass-panel-bg">
          <div class="glass-panel-texture"></div>
        </div>
        <div class="glass-panel-content">
          <section class="px-6" style="padding-top: calc(1.5rem + 15px); padding-bottom: calc(1.5rem + 15px); text-align: center;">
            <div style="display: inline-block; text-align: left;">
                <div class="flex items-center gap-3 pillar-row">
                  <span class="pillar-number-large text-body">01</span>
                  <span class="pillar-text text-body"><span class="pillar-label">Smart Agent Alliance</span><span class="pillar-description">, sponsor support built and provided at no cost to agents.</span></span>
                </div>
                <div class="flex items-center gap-3 pillar-row">
                  <span class="pillar-number-large text-body">02</span>
                  <span class="pillar-text text-body"><span class="pillar-label">Inside eXp Realty</span><span class="pillar-description">, the largest independent real estate brokerage in the world.</span></span>
                </div>
                <div class="flex items-center gap-3 pillar-row">
                  <span class="pillar-number-large text-body">03</span>
                  <span class="pillar-text text-body"><span class="pillar-label">Stronger Together</span><span class="pillar-description">, eXp infrastructure plus SAA systems drive higher agent success.</span></span>
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Why Smart Agent Alliance Section - Expand Reveal -->
    <section class="section py-24 md:py-32 px-6 overflow-hidden relative" id="why-saa-section">
      <div style="max-width: 1500px; margin: 0 auto;">
        <!-- Header - always visible, no animation -->
        <div class="text-center mb-12">
          <h2 class="text-h2 h2-container">
            <span class="h2-word">Why</span>
            <span class="h2-word">Smart</span>
            <span class="h2-word">Agent</span>
            <span class="h2-word">Alliance</span>
            <span class="h2-word">(SAA)?</span>
          </h2>
        </div>
        <div class="why-saa-grid">
          <!-- Left Card - expands from left using clip-path -->
          <div class="expand-reveal-element" data-expand-id="saa-left" data-expand-dir="left" style="height: 100%;">
            <div id="saa-left-frame" class="rounded-2xl overflow-hidden" style="border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)); clip-path: inset(0 100% 0 0 round 16px); transition: clip-path 0.1s ease-out; height: 100%;">
              <div id="saa-left-content" style="padding: 2rem 2.5rem; opacity: 0;">
                <p class="font-bold" style="font-family: var(--font-amulya); color: #ffd700; font-size: 1.875rem;">Elite systems. Proven training. Real community.</p>
                <p class="text-body mt-3 opacity-70">Most eXp sponsors offer little or no ongoing value.</p>
                <p class="font-bold mt-5" style="font-family: var(--font-amulya); color: #ffd700; font-size: 1.5rem;">Smart Agent Alliance was built differently.</p>
                <p class="text-body mt-3" style="line-height: 1.6;">We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.</p>
                <div class="grid grid-cols-2 mt-8" style="gap: 0.5rem 1rem;">
                  <div class="flex items-center gap-3">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                    <span class="text-body font-medium">Not a production team</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                    <span class="text-body font-medium">No commission splits</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                    <span class="text-body font-medium">No sponsor team fees</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                    <span class="text-body font-medium">No required meetings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Right Card - Aligned Incentives - expands from right using clip-path -->
          <div class="expand-reveal-element" data-expand-id="saa-right" data-expand-dir="right" style="height: 100%; min-height: 300px;">
            <div id="saa-right-frame" class="rounded-2xl overflow-hidden" style="position: relative; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); clip-path: inset(0 0 0 100% round 16px); transition: clip-path 0.1s ease-out; height: 100%; min-height: 300px;">
              <!-- Image is always visible -->
              <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-aligned-incentives-value-multiplication/public" alt="Smart Agent Alliance aligned incentives model" class="bento-image" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center;">
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);"></div>
              <!-- Caption is always visible -->
              <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px;">
                <p class="font-bold" style="font-family: var(--font-amulya); color: #ffd700; font-size: 23px;">Aligned Incentives</p>
                <p class="text-body opacity-70 mt-1">When you succeed, we succeed</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Disclaimer - fade up -->
        <div class="expand-reveal-element text-center mt-12" data-expand-id="saa-disclaimer">
          <p class="text-body mx-auto" style="color: #e5e4dd; max-width: 700px; font-size: clamp(16px, calc(14.91px + 0.44vw), 28px);">SAA resources are available to agents who select a SAA-aligned sponsor at the time they join eXp Realty.</p>
        </div>
      </div>
    </section>

    <!-- Proven at Scale Section -->
    <div class="glass-panel" style="margin-top: 32px;">
      <div class="glass-panel-bg glass-panel-champagne"></div>
      <div class="glass-panel-content">
        <section style="padding: var(--section-padding-y) 1.5rem; position: relative; overflow: hidden;">
          <!-- Wolf Pack Background -->
          <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop" srcset="
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/mobile 640w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/tablet 1024w,
                https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/6dc6fe182a485b79-Smart-agent-alliance-and-the-wolf-pack.webp/desktop 2000w
              " sizes="100vw" alt="" aria-hidden="true" style="width: 100%; height: 100%; object-fit: cover; object-position: center 55%; mask-image: radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%); -webkit-mask-image: radial-gradient(ellipse 70% 65% at center 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 70%, transparent 90%);">
          </div>

          <div style="max-width: 1600px; margin: 0 auto; position: relative; z-index: 10;">
            <div class="proven-scale-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: center;">
              <!-- Left Content -->
              <div>
                <!-- H2 - always visible, no animation -->
                <h2 class="text-h2 h2-container" style="justify-content: flex-start; text-align: left;">
                  <span class="h2-word">Proven</span>
                  <span class="h2-word">at</span>
                  <span class="h2-word">Scale</span>
                </h2>

                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                  <div class="scroll-reveal" style="display: flex; align-items: center; gap: 1rem;">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></span>
                    <p class="text-body">One of the fastest-growing sponsor organizations at eXp Realty</p>
                  </div>
                  <div class="scroll-reveal" style="display: flex; align-items: center; gap: 1rem; transition-delay: 0.1s;">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                    <p class="text-body">Consistently strong agent retention</p>
                  </div>
                  <div class="scroll-reveal" style="display: flex; align-items: center; gap: 1rem; transition-delay: 0.2s;">
                    <span class="icon-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>
                    <p class="text-body">Supporting agents across the U.S., Canada, Mexico, Australia, and beyond</p>
                  </div>
                </div>

                <div class="scroll-reveal" style="transition-delay: 0.3s;">
                  <div class="cta-button-wrapper" style="display: inline-block;">
                    <div class="cta-light-bar cta-light-bar-top"></div>
                    <a href="#watch-and-decide" class="cta-button">Learn More About SAA</a>
                    <div class="cta-light-bar cta-light-bar-bottom"></div>
                  </div>
                </div>
              </div>

              <!-- Right - Counter Card -->
              <div class="scroll-reveal" style="transition-delay: 0.2s;">
                <div class="cyber-card-gold">
                  <div class="cyber-card-gold-frame">
                    <div class="cyber-card-gold-content">
                      <span class="icon-3d" style="margin: 0 auto 0.5rem; display: block; width: fit-content;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>
                      <p style="font-family: 'Amulya', var(--font-amulya), sans-serif; font-size: clamp(1.875rem, 4vw, 2.5rem); font-weight: 700; color: #bfbdb0; text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.4); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; text-align: center; margin: 0;">3700+</p>
                      <p class="text-body" style="text-align: center; margin-top: 0.25rem;">Agents in Sponsor Network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- What You Get Section - Blur Reveal Cards -->
    <section style="padding: var(--section-padding-y) 1.5rem; position: relative;" id="what-you-get-section">
      <div style="max-width: 1500px; margin: 0 auto; position: relative; z-index: 10;">
        <div class="text-center" style="margin-bottom: 3rem;">
          <h2 class="text-h2 h2-container">
            <span class="h2-word">What</span>
            <span class="h2-word">You</span>
            <span class="h2-word">Get</span>
            <span class="h2-word">with</span>
            <span class="h2-word">SAA</span>
          </h2>
          <p class="text-body" style="opacity: 0.6; margin-top: 1rem; max-width: 700px; margin-left: auto; margin-right: auto;">Smart Agent Alliance provides systems, training, income infrastructure, and collaboration through five core pillars.</p>
        </div>

        <!-- Blur Reveal Cards - 2 columns on 1200px+, 1 column below -->
        <div class="wyg-grid" style="max-width: 1400px; margin: 0 auto;" id="wyg-cards">
          <!-- Card 1: Connected Leadership -->
          <div class="wyg-blur-card" data-wyg-card="0">
            <div class="wyg-card-inner">
              <div class="wyg-card-bg" style="background-image: url('https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-connected-leadership/public');"></div>
              <div class="wyg-card-overlay"></div>
              <div class="wyg-card-accent"></div>
              <div class="wyg-card-content">
                <div class="wyg-card-icon">
                  <span class="icon-3d" style="width: 56px; height: 56px;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span>
                </div>
                <div>
                  <h3 class="wyg-card-title">Connected Leadership and Community</h3>
                  <p class="text-body wyg-card-desc">Big enough to back you. Small enough to know you. Real access, real wins, real support.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Passive Income -->
          <div class="wyg-blur-card" data-wyg-card="1">
            <div class="wyg-card-inner">
              <div class="wyg-card-bg" style="background-image: url('https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-passive-income/public');"></div>
              <div class="wyg-card-overlay"></div>
              <div class="wyg-card-accent"></div>
              <div class="wyg-card-content">
                <div class="wyg-card-icon">
                  <span class="icon-3d" style="width: 56px; height: 56px;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></span>
                </div>
                <div>
                  <h3 class="wyg-card-title">Passive Income Infrastructure</h3>
                  <p class="text-body wyg-card-desc">We handle the structure so you can build long-term income without relying solely on transactions.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Done-For-You -->
          <div class="wyg-blur-card" data-wyg-card="2">
            <div class="wyg-card-inner">
              <div class="wyg-card-bg" style="background-image: url('https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-done-for-you/public');"></div>
              <div class="wyg-card-overlay"></div>
              <div class="wyg-card-accent"></div>
              <div class="wyg-card-content">
                <div class="wyg-card-icon">
                  <span class="icon-3d" style="width: 56px; height: 56px;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>
                </div>
                <div>
                  <h3 class="wyg-card-title">Done-For-You Production Systems</h3>
                  <p class="text-body wyg-card-desc">Curated systems designed to save time, not create tech overload.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Elite Training -->
          <div class="wyg-blur-card" data-wyg-card="3">
            <div class="wyg-card-inner">
              <div class="wyg-card-bg" style="background-image: url('https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-elite-training/public');"></div>
              <div class="wyg-card-overlay"></div>
              <div class="wyg-card-accent"></div>
              <div class="wyg-card-content">
                <div class="wyg-card-icon">
                  <span class="icon-3d" style="width: 56px; height: 56px;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></span>
                </div>
                <div>
                  <h3 class="wyg-card-title">Elite Training Libraries</h3>
                  <p class="text-body wyg-card-desc">AI, social media, investing, and modern production systems, available when you need them.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Private Referrals -->
          <div class="wyg-blur-card wyg-full-width" data-wyg-card="4">
            <div class="wyg-card-inner">
              <div class="wyg-card-bg" style="background-image: url('https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-tab-private-referrals/public');"></div>
              <div class="wyg-card-overlay"></div>
              <div class="wyg-card-accent"></div>
              <div class="wyg-card-content">
                <div class="wyg-card-icon">
                  <span class="icon-3d" style="width: 56px; height: 56px;"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>
                </div>
                <div>
                  <h3 class="wyg-card-title">Private Referrals &amp; Global Collaboration</h3>
                  <p class="text-body wyg-card-desc">Warm introductions and deal flow inside a global agent network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Only at eXp Section - Scroll-Triggered 3D Card Stack -->
    <section class="why-only-section" id="why-only-section">
      <div class="why-only-trigger" id="why-only-trigger">
        <div class="why-only-content" id="why-only-content">
          <!-- Noise overlay -->
          <div class="why-only-noise"></div>

          <!-- Content -->
          <div style="position: relative; z-index: 10; padding: 4rem 1.5rem;">
            <div style="max-width: 1600px; margin: 0 auto;">
              <!-- Section Header -->
              <div class="text-center" style="margin-bottom: 2rem;">
                <h2 class="text-h2 h2-container" style="max-width: 100%;">
                  <span class="h2-word">Why</span>
                  <span class="h2-word">This</span>
                  <span class="h2-word">Only</span>
                  <span class="h2-word">Works</span>
                  <span class="h2-word">at</span>
                  <span class="h2-word">eXp</span>
                  <span class="h2-word">Realty</span>
                </h2>
              </div>

              <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: start;" class="why-only-grid-responsive">
                <!-- Left Column: Card Stack + Progress Bar -->
                <div style="display: flex; flex-direction: column; position: relative; z-index: 10;">
                  <!-- 3D Rotating Card Stack -->
                  <div class="why-only-card-stack" id="why-only-card-stack">
                    <!-- Card 1 -->
                    <div class="why-only-card why-only-card-dark" data-card-index="0" id="why-only-card-0">
                      <div class="why-only-number-badge why-only-number-badge-dark">
                        <span class="why-only-number-3d">1</span>
                      </div>
                      <p class="why-only-card-text why-only-card-text-light">Most real estate brokerages provide tools, training, and support centrally.</p>
                    </div>
                    <!-- Card 2 -->
                    <div class="why-only-card why-only-card-dark" data-card-index="1" id="why-only-card-1">
                      <div class="why-only-number-badge why-only-number-badge-dark">
                        <span class="why-only-number-3d">2</span>
                      </div>
                      <p class="why-only-card-text why-only-card-text-light">Even when sponsorship exists, sponsors are limited to offering only what the brokerage provides.</p>
                    </div>
                    <!-- Card 3 (Highlighted) -->
                    <div class="why-only-card why-only-card-highlight" data-card-index="2" id="why-only-card-2">
                      <div class="why-only-number-badge why-only-number-badge-highlight">
                        <span class="why-only-number-3d why-only-number-3d-highlight">3</span>
                      </div>
                      <p class="why-only-card-text why-only-card-text-dark">eXp Realty sponsorship works differently.</p>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div style="display: flex; justify-content: center; margin-top: 4rem;">
                    <div class="why-only-progress-bar">
                      <div class="why-only-progress-fill" id="why-only-progress-fill" style="width: 0%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Key message card -->
                <figure style="border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; position: relative; overflow: hidden; min-height: 340px; z-index: 1;">
                  <div style="position: absolute; inset: 0;">
                    <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-entrepreneurial-sponsor-v2/desktop" alt="eXp Realty sponsor delivering entrepreneurial systems to real estate agents" title="eXp Realty Entrepreneurial Sponsor Systems" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                    <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%);"></div>
                  </div>
                  <figcaption style="position: relative; z-index: 10; padding: 1.5rem 2rem; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                    <p style="font-family: var(--font-heading), system-ui, sans-serif; font-size: clamp(1.25rem, 2vw, 1.5rem); font-weight: bold; color: #ffd700; margin-bottom: 1rem;">eXp Realty Sponsorship is Different.</p>
                    <p class="text-body" style="line-height: 1.6; margin-bottom: 1rem;">It is the only brokerage that allows sponsors to build and deliver real systems, training, and support. Most sponsors don't use that freedom. Smart Agent Alliance does.</p>
                    <p class="text-body" style="color: #ffd700; font-style: italic; font-size: clamp(18px, 2vw, 20px); margin-bottom: 1.5rem;">When you succeed, we succeed.</p>
                    <a href="/exp-realty-sponsor" class="cta-button" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; width: fit-content;">See Our Systems</a>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Media Logos Section (Why eXp Realty?) - 5-Card Layout -->
    <section class="media-logos-section scroll-reveal" id="media-logos-section">
      <div class="text-center px-4 relative" style="z-index: 10;">
        <h2 class="text-h2 h2-container" style="max-width: 100%;">
          <span class="h2-word">Why</span>
          <span class="h2-word">eXp</span>
          <span class="h2-word">Realty?</span>
        </h2>

        <!-- Cards Grid: 3 on top, 2 on bottom -->
        <div class="mx-auto mb-8" style="max-width: 1800px;">
          <!-- Top Row - 3 cards -->
          <div class="why-exp-grid-top">
            <!-- Card 1: Profitable -->
            <div class="why-exp-card scroll-reveal" style="background: rgba(10,10,10,0.6); border: 1px solid rgba(255,215,0,0.15); transition-delay: 0s;">
              <div class="mb-4">
                <span class="icon-3d" style="width: 80px; height: 80px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </span>
              </div>
              <h3 class="why-exp-card-heading" style="color: #e5e4dd;">Proven Profitability</h3>
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); opacity: 0.9;">The only cumulatively profitable public real estate company.</p>
            </div>

            <!-- Card 2: Cloud-Based -->
            <div class="why-exp-card scroll-reveal" style="background: rgba(10,10,10,0.6); border: 1px solid rgba(255,215,0,0.15); transition-delay: 0.1s;">
              <div class="mb-4">
                <span class="icon-3d" style="width: 80px; height: 80px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
                </span>
              </div>
              <h3 class="why-exp-card-heading" style="color: #e5e4dd;">Cloud-First Pioneer</h3>
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); opacity: 0.9;">S&amp;P 600 SmallCap. First cloud-based brokerage.</p>
            </div>

            <!-- Card 3: Sponsor Choice -->
            <div class="why-exp-card scroll-reveal" style="background: rgba(10,10,10,0.6); border: 1px solid rgba(255,215,0,0.15); transition-delay: 0.2s;">
              <div class="mb-4">
                <span class="icon-3d" style="width: 80px; height: 80px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
              </div>
              <h3 class="why-exp-card-heading" style="color: #e5e4dd;">Choose Your Sponsor</h3>
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); opacity: 0.9;">Choose your sponsor. Access real support.</p>
            </div>
          </div>

          <!-- Bottom Row - 2 cards with colored borders and buttons -->
          <div class="why-exp-grid-bottom">
            <!-- Card 4: Commission - Green -->
            <div class="why-exp-card scroll-reveal" style="background: rgba(10,10,10,0.6); border: 2px solid rgba(0,204,102,0.5); transition-delay: 0.1s;">
              <div class="mb-4">
                <span class="icon-3d icon-3d-green" style="width: 80px; height: 80px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                </span>
              </div>
              <h3 class="why-exp-card-heading" style="color: #00cc66;">Industry-Leading Splits</h3>
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); opacity: 0.9; margin-bottom: 1rem;">80/20 split until cap → 100% commission. Flat monthly fee.</p>
              <div style="margin-top: auto; padding: 0.5rem 0;">
                <div class="group" style="position: relative; display: inline-block;">
                  <button id="btn-commission-calculator" style="position: relative; display: flex; justify-content: center; align-items: center; height: clamp(45px, calc(43.182px + 0.7273vw), 65px); padding: 0.5rem 1.25rem; background-color: rgb(45,45,45); border-radius: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); border-left: none; border-right: none; box-shadow: 0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5); color: var(--color-headingText, #e5e4dd); font-family: var(--font-taskor), Taskor, system-ui, sans-serif; font-size: var(--font-size-button, 20px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; white-space: nowrap; overflow: hidden; z-index: 10; cursor: pointer;">
                    <span style="position: absolute; inset: 0; background: linear-gradient(to left, rgba(255,255,255,0.15), transparent); width: 50%; transform: skewX(45deg); pointer-events: none;"></span>
                    Commission Calculator
                  </button>
                  <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #00cc66; border-radius: 6px; z-index: 5; --glow-color: 0, 255, 136; transition: height 0.5s ease;"></div>
                  <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: auto; right: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #00cc66; border-radius: 6px; z-index: 5; --glow-color: 0, 255, 136; transition: height 0.5s ease;"></div>
                </div>
              </div>
            </div>

            <!-- Card 5: RevShare - Purple -->
            <div class="why-exp-card scroll-reveal" style="background: rgba(10,10,10,0.6); border: 2px solid rgba(153,51,255,0.5); transition-delay: 0.2s;">
              <div class="mb-4">
                <span class="icon-3d icon-3d-purple" style="width: 80px; height: 80px;">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                </span>
              </div>
              <h3 class="why-exp-card-heading" style="color: #9933ff;">Passive Income Potential</h3>
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); opacity: 0.9; margin-bottom: 1rem;">Optional revenue share income + stock opportunities.</p>
              <div style="margin-top: auto; padding: 0.5rem 0;">
                <div class="group" style="position: relative; display: inline-block;">
                  <button id="btn-revshare-visualizer" style="position: relative; display: flex; justify-content: center; align-items: center; height: clamp(45px, calc(43.182px + 0.7273vw), 65px); padding: 0.5rem 1.25rem; background-color: rgb(45,45,45); border-radius: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); border-left: none; border-right: none; box-shadow: 0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5); color: var(--color-headingText, #e5e4dd); font-family: var(--font-taskor), Taskor, system-ui, sans-serif; font-size: var(--font-size-button, 20px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; white-space: nowrap; overflow: hidden; z-index: 10; cursor: pointer;">
                    <span style="position: absolute; inset: 0; background: linear-gradient(to left, rgba(255,255,255,0.15), transparent); width: 50%; transform: skewX(45deg); pointer-events: none;"></span>
                    RevShare Visualizer
                  </button>
                  <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #9933ff; border-radius: 6px; z-index: 5; --glow-color: 191, 95, 255; transition: height 0.5s ease;"></div>
                  <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: auto; right: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #9933ff; border-radius: 6px; z-index: 5; --glow-color: 191, 95, 255; transition: height 0.5s ease;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo Carousel -->
      <div class="media-logos-container">
        <div class="portal-edge-left"></div>
        <div class="portal-edge-right"></div>
        <div class="logo-track-container">
          <div class="logo-track-shadow-left"></div>
          <div class="logo-track-shadow-right"></div>
          <div class="logo-track" id="logo-track" style="transform: translateX(-32.5px);">
            
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/wsj-logo/public" alt="The Wall Street Journal" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/cnbc-logo/public" alt="CNBC" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/fox-business-logo/public" alt="Fox Business" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/bloomberg-logo/public" alt="Bloomberg" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/yahoo-finance-logo/public" alt="Yahoo Finance" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/forbes-logo/public" alt="Forbes" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/business-insider-logo/public" alt="Business Insider" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/market-watch-logo/public" alt="MarketWatch" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/reuters-logo/public" alt="Reuters" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/usa-today-logo/public" alt="USA Today" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/la-times-logo/public" alt="Los Angeles Times" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/washington-post-logo/public" alt="The Washington Post" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/nasdaq-logo/public" alt="Nasdaq" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/barrons-logo/public" alt="Barron's" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/new-york-post-logo/public" alt="New York Post" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/wsj-logo/public" alt="The Wall Street Journal" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/cnbc-logo/public" alt="CNBC" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/fox-business-logo/public" alt="Fox Business" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/bloomberg-logo/public" alt="Bloomberg" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/yahoo-finance-logo/public" alt="Yahoo Finance" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/forbes-logo/public" alt="Forbes" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/business-insider-logo/public" alt="Business Insider" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/market-watch-logo/public" alt="MarketWatch" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/reuters-logo/public" alt="Reuters" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/usa-today-logo/public" alt="USA Today" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/la-times-logo/public" alt="Los Angeles Times" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/washington-post-logo/public" alt="The Washington Post" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/nasdaq-logo/public" alt="Nasdaq" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/barrons-logo/public" alt="Barron's" loading="eager" class="logo-img"></span>
    </div>
  
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; min-width: clamp(180px, 15vw, 200px);">
      <span class="logo-3d-wrapper"><img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/new-york-post-logo/public" alt="New York Post" loading="eager" class="logo-img"></span>
    </div>
  
          </div>
        </div>
      </div>
    </section>

    <!-- Your Support Network Section -->
    <div class="glass-panel" style="margin-top: 32px;">
      <div class="glass-panel-bg glass-panel-marigold"></div>
      <div class="glass-panel-content">
        <section style="padding: var(--section-padding-y) 1.5rem; position: relative;">
          <div style="max-width: 1500px; margin: 0 auto; position: relative; z-index: 10;">
            <!-- Header - always visible, no animation -->
            <div style="text-align: center; margin-bottom: 3rem;">
              <h2 class="text-h2 h2-container">
                <span class="h2-word">Your</span>
                <span class="h2-word">Support</span>
                <span class="h2-word">Network</span>
              </h2>
            </div>

            <!-- Three column layout - Agent, Doug, Karrie -->
            <div class="leadership-grid">
              <!-- Column 1 - Agent (Your Sponsor) -->
              <div class="scroll-reveal" style="transition: all 0.7s ease; transition-delay: 0.2s;">
                <div class="founder-card" style="padding: 1.5rem 2rem; border-radius: 1rem; border: 1px solid rgba(255,215,0,0.3); text-align: center; background-color: rgba(20,20,20,0.75); height: 100%; display: flex; flex-direction: column; transition: border-color 0.3s ease;">
                  <div class="profile-cyber-frame" style="width: 192px; height: 192px; margin: 0 auto 24px auto; position: relative;">
                    <div class="profile-cyber-frame-metal"></div>
                    <div class="profile-cyber-frame-inner">
                      <div style="position: relative; width: 100%; height: 100%;">
                        <img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(displayName)}" style="width: 100%; height: 100%; object-fit: cover; background-color: #d8d8da;">
                      </div>
                    </div>
                    <div class="profile-cyber-frame-ring"></div>
                  </div>
                  <h3 class="founder-name">${escapeHTML(displayName)}</h3>
                  <p class="founder-title">SAA Team Member</p>
                </div>
              </div>

              <!-- Column 2 - Doug -->
              <div class="scroll-reveal" style="transition: all 0.7s ease; transition-delay: 0.35s;">
                <div class="founder-card" style="padding: 1.5rem 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); text-align: center; background-color: rgba(20,20,20,0.75); height: 100%; display: flex; flex-direction: column; transition: border-color 0.3s ease;">
                  <div class="profile-cyber-frame" style="width: 192px; height: 192px; margin: 0 auto 24px auto; position: relative;">
                    <div class="profile-cyber-frame-metal"></div>
                    <div class="profile-cyber-frame-inner">
                      <div style="position: relative; width: 100%; height: 100%;">
                        <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public" alt="Doug Smart" style="width: 100%; height: 100%; object-fit: cover;">
                      </div>
                    </div>
                    <div class="profile-cyber-frame-ring"></div>
                  </div>
                  <h3 class="founder-name">Doug Smart</h3>
                  <p class="founder-title">Co-Founder &amp; Full-Stack Developer</p>
                  <button class="founder-bio-toggle" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('open');">
                    <span>About Doug</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                  </button>
                  <div class="founder-bio-content">
                    <p class="founder-bio" style="margin: 0;">Top 1% eXp team builder. Designed and built this website, the agent portal, and the systems and automations powering production workflows and attraction tools across the organization.</p>
                  </div>
                </div>
              </div>

              <!-- Column 3 - Karrie -->
              <div class="scroll-reveal" style="transition: all 0.7s ease; transition-delay: 0.5s;">
                <div class="founder-card" style="padding: 1.5rem 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); text-align: center; background-color: rgba(20,20,20,0.75); height: 100%; display: flex; flex-direction: column; transition: border-color 0.3s ease;">
                  <div class="profile-cyber-frame" style="width: 192px; height: 192px; margin: 0 auto 24px auto; position: relative;">
                    <div class="profile-cyber-frame-metal"></div>
                    <div class="profile-cyber-frame-inner">
                      <div style="position: relative; width: 100%; height: 100%;">
                        <img src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public" alt="Karrie Hill" style="width: 100%; height: 100%; object-fit: cover;">
                      </div>
                    </div>
                    <div class="profile-cyber-frame-ring"></div>
                  </div>
                  <h3 class="founder-name">Karrie Hill</h3>
                  <p class="founder-title">Co-Founder &amp; California Lawyer</p>
                  <button class="founder-bio-toggle" onclick="this.classList.toggle('open'); this.nextElementSibling.classList.toggle('open');">
                    <span>About Karrie</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
                  </button>
                  <div class="founder-bio-content">
                    <p class="founder-bio" style="margin: 0;">UC Berkeley Law (top 5%). Built a six-figure real estate business in her first full year without cold calling or door knocking, now helping agents do the same.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional layers note -->
            <div class="scroll-reveal" style="text-align: center; margin-top: 2rem; transition: all 0.7s ease; transition-delay: 0.6s;">
              <p style="font-size: clamp(16px, calc(14.91px + 0.44vw), 28px); color: #e5e4dd; opacity: 0.9;">+4 more layers of leadership support</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Built for Where Real Estate Is Going - Horizontal Scroll Cards -->
    <section style="position: relative; padding-top: 4rem;" id="built-for-future">
      <!-- Fixed background animation - outside pinned content -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; z-index: 0;">
        <!-- GrayscaleDataStream will be rendered here by JS -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden; z-index: 0;" id="grayscale-data-stream"></div>
      </div>

      <!-- Invisible wrapper that gets pinned -->
      <div id="built-future-trigger" style="position: relative; z-index: 1;">
        <!-- Content - animates upward -->
        <div id="built-future-content" style="position: relative; transform: translateY(30px);">
          <!-- Section Header -->
          <div style="text-align: center; margin-bottom: 1rem; padding-left: 1.5rem; padding-right: 1.5rem;">
            <h2 class="text-h2 h2-container" style="max-width: 100%;">
              <span class="h2-word">Built</span>
              <span class="h2-word">for</span>
              <span class="h2-word">Where</span>
              <span class="h2-word">Real</span>
              <span class="h2-word">Estate</span>
              <span class="h2-word">Is</span>
              <span class="h2-word">Going</span>
            </h2>
          </div>
          <p class="text-body" style="opacity: 0.7; margin-bottom: 3rem; text-align: center; max-width: 42rem; margin-left: auto; margin-right: auto; padding-left: 1.5rem; padding-right: 1.5rem;">The future of real estate is cloud-based, global, and technology-driven. SAA is already there.</p>

          <!-- Horizontal Scroll Cards Container with Portal Edges -->
          <div style="position: relative;">
            <!-- 3D Curved Portal Edges - raised bars that cards slide under -->
            <!-- Left curved bar -->
            <div style="position: absolute; left: 0; z-index: 20; pointer-events: none; top: -40px; bottom: -40px; width: 12px; border-radius: 0 12px 12px 0; background: linear-gradient(90deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%); border-right: 1px solid rgba(255,190,0,0.3); box-shadow: 3px 0 12px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.3); transform: perspective(500px) rotateY(-3deg); transform-origin: right center;"></div>
            <!-- Right curved bar -->
            <div style="position: absolute; right: 0; z-index: 20; pointer-events: none; top: -40px; bottom: -40px; width: 12px; border-radius: 12px 0 0 12px; background: linear-gradient(270deg, rgba(30,28,20,0.95) 0%, rgba(40,35,25,0.9) 100%); border-left: 1px solid rgba(255,190,0,0.3); box-shadow: -3px 0 12px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.3); transform: perspective(500px) rotateY(3deg); transform-origin: left center;"></div>

            <!-- Inner container - clips cards horizontally at inner edge of bars, but allows vertical overflow for glow -->
            <div style="position: relative; margin-left: 12px; margin-right: 12px; overflow-x: clip; overflow-y: visible;">
              <!-- Cards track -->
              <div style="padding-top: 3rem; padding-bottom: 3rem;">
                <div id="built-future-track" style="display: flex; gap: 24px;">
                  <!-- Cards are generated by JavaScript -->
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Plasma Tube Progress Bar -->
          <div style="display: flex; justify-content: center; margin-top: 2rem; padding-left: 1.5rem; padding-right: 1.5rem;">
            <div style="width: 320px; height: 12px; border-radius: 9999px; overflow: hidden; position: relative; background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%); border: 1px solid rgba(245, 245, 240, 0.25); box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05);">
              <div id="built-future-progress" style="height: 100%; border-radius: 9999px; width: 0%; background: linear-gradient(180deg, #ffe566 0%, #ffd700 40%, #cc9900 100%); box-shadow: 0 0 8px #ffd700, 0 0 16px #ffd700, 0 0 32px rgba(255,215,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4);"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Watch and Decide Section -->
    <div class="glass-panel glass-panel-bottom">
      <div class="glass-panel-bg">
        <div class="glass-panel-texture"></div>
      </div>
      <div class="glass-panel-content">
        <section id="watch-and-decide" class="section py-16 md:py-24 px-4">
          <div style="max-width: 1900px; margin: 0 auto;">
            <div class="text-center mb-8 md:mb-12">
              <h2 class="text-h2 h2-container">
                <span class="h2-word">The</span>
                <span class="h2-word">Only</span>
                <span class="h2-word">Video</span>
                <span class="h2-word">You</span>
                <span class="h2-word">Need</span>
              </h2>
              <p class="text-body mt-4 max-w-2xl mx-auto opacity-80">Everything about eXp Realty, Smart Agent Alliance, and how the model works — explained in full.</p>
            </div>
            <div class="max-w-4xl mx-auto">
              <!-- Video Player -->
              <div class="video-player-container">
                <div class="video-frame">
                  <div class="video-wrapper" id="video-wrapper">
                    <iframe id="video-iframe" src="https://customer-2twfsluc6inah5at.cloudflarestream.com/f8c3f1bd9c2db2409ed0e90f60fd4d5b/iframe?controls=false&amp;poster=https%3A%2F%2Fimagedelivery.net%2FRZBQ4dWu2c_YEpklnDDxFg%2Fexp-realty-smart-agent-alliance-explained%2Fdesktop&amp;letterboxColor=transparent" loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowfullscreen=""></iframe>
                    <div class="video-overlay" id="video-overlay">
                      <div class="overlay-play-btn" id="play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      </div>
                    </div>
                    <div class="scrubber-container" id="scrubber-container">
                      <div class="scrubber-watched" id="scrubber-watched"></div>
                      <div class="scrubber-current" id="scrubber-current"></div>
                      <div class="scrubber-thumb" id="scrubber-thumb"></div>
                    </div>
                  </div>
                  <div class="video-controls">
                    <button class="control-btn control-btn--play" id="btn-play" aria-label="Play">
                      <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                    <button class="control-btn" id="btn-rewind" aria-label="Rewind 15 seconds" title="Rewind 15s">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                      <span class="rewind-text">15</span>
                    </button>
                    <button class="control-btn" id="btn-restart" aria-label="Restart video" title="Restart">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
                    </button>
                    <div class="time-display" id="time-display">0:00 / 0:00</div>
                    <div class="volume-controls">
                      <button class="control-btn" id="btn-mute" aria-label="Mute">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                      </button>
                      <input type="range" min="0" max="1" step="0.1" value="1" class="volume-slider" id="volume-slider" aria-label="Volume">
                    </div>
                  </div>
                </div>
                <div class="progress-area">
                  <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
                  <p class="text-body" id="progress-message">Most questions are answered here, once you've watched 50%, the option to book a call becomes available.</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div id="join-the-alliance" class="flex flex-col items-center gap-4 mt-8" style="flex-direction: column;">
                <div class="cta-button-wrapper">
                  <div class="cta-light-bar cta-light-bar-top"></div>
                  <button class="cta-button" id="btn-join-alliance">JOIN THE ALLIANCE</button>
                  <div class="cta-light-bar cta-light-bar-bottom"></div>
                </div>
                <div id="book-call-wrapper" style="opacity: 0.4; filter: blur(1px) grayscale(0.8); pointer-events: none; transition: all 0.5s ease; padding: 0.5rem 0;">
                  <div class="group" style="position: relative; display: inline-block;">
                    <a href="https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7" target="_blank" rel="noopener noreferrer" id="btn-book-call" style="position: relative; display: flex; justify-content: center; align-items: center; height: clamp(45px, calc(43.182px + 0.7273vw), 65px); padding: 0.5rem 1.25rem; background-color: rgb(45,45,45); border-radius: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5); color: var(--color-headingText, #e5e4dd); font-family: var(--font-taskor), Taskor, system-ui, sans-serif; font-size: var(--font-size-button, 20px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; text-decoration: none; white-space: nowrap; overflow: hidden; z-index: 10;">
                      <span style="position: absolute; inset: 0; background: linear-gradient(to left, rgba(255,255,255,0.15), transparent); width: 50%; transform: skewX(45deg); pointer-events: none;"></span>
                      BOOK A CALL
                    </a>
                    <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #ffd700; border-radius: 6px; z-index: 5; --glow-color: 255, 215, 0; transition: height 0.5s ease;"></div>
                    <div class="cta-light-bar cta-light-bar-pulse cta-light-bar-side" style="position: absolute; top: 50%; left: auto; right: -5px; transform: translateY(-50%); width: 10px; height: 18px; background: #ffd700; border-radius: 6px; z-index: 5; --glow-color: 255, 215, 0; transition: height 0.5s ease;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  </main>

  <!-- Join Modal -->
  <div class="modal-container" id="join-modal">
    <div class="modal-backdrop" id="join-modal-backdrop"></div>
    <div class="modal-wrapper">
      <button class="modal-close-btn" id="join-modal-close" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="modal">
        <h3 class="join-modal-title">Join Smart Agent Alliance</h3>
        <p class="join-modal-subtitle">Take the first step towards building your dream career at eXp Realty.</p>
        <form id="join-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name *</label>
              <input type="text" id="firstName" name="firstName" class="form-input" required="">
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name *</label>
              <input type="text" id="lastName" name="lastName" class="form-input" required="">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="email">Email *</label>
            <input type="email" id="email" name="email" class="form-input" required="">
          </div>
          <div class="form-group">
            <label class="form-label" for="country">Country *</label>
            <select id="country" name="country" class="form-select" required="">
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" class="form-submit" id="join-submit">Get Started</button>
          <div class="form-message" id="join-message" style="display: none;"></div>
        </form>
      </div>
    </div>
  </div>

  <!-- Instructions Modal -->
  <div class="modal-container" id="instructions-modal">
    <div class="modal-backdrop" id="instructions-modal-backdrop"></div>
    <div class="modal-wrapper">
      <button class="modal-close-btn" id="instructions-modal-close" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="modal instructions-modal">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3 class="instructions-title">Welcome, <span id="user-name-display">Agent</span>!</h3>
        <p class="instructions-subtitle">Follow these steps to join Smart Agent Alliance at eXp Realty.</p>
        <div class="instructions-list">
          <div class="instruction-item">
            <div class="instruction-number">1</div>
            <div class="instruction-content">
              <strong class="instruction-title">Start Your Application</strong>
              <p class="instruction-text">Visit <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer">joinapp.exprealty.com</a> to begin your eXp Realty application.</p>
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-number">2</div>
            <div class="instruction-content">
              <strong class="instruction-title">Search for Your Sponsor</strong>
              <p class="instruction-text">Enter <strong>${escapeHTML(agentExpEmail)}</strong> and click Search. Select <strong>${escapeHTML(displayName)}</strong> as your sponsor.</p>
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-number">3</div>
            <div class="instruction-content">
              <strong class="instruction-title">Complete Your Application</strong>
              <p class="instruction-text">Fill out the application form and submit. You'll receive a confirmation email from eXp.</p>
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-number">4</div>
            <div class="instruction-content">
              <strong class="instruction-title">Activate Your Agent Portal</strong>
              <p class="instruction-text">Once your license transfers, you'll receive an email to activate your Smart Agent Alliance portal with all your onboarding materials and resources.</p>
            </div>
          </div>
          <div class="instruction-item">
            <div class="instruction-number">5</div>
            <div class="instruction-content">
              <strong class="instruction-title">eXp Realty Support</strong>
              <p class="instruction-text">For application issues, call <strong>833-303-0610</strong> or email <a href="mailto:expertcare@exprealty.com">expertcare@exprealty.com</a>.</p>
            </div>
          </div>
        </div>
        <a href="https://joinapp.exprealty.com/" target="_blank" rel="noopener noreferrer" class="instructions-cta">Join eXp with SAA</a>
        <p class="instructions-footer">Questions? Email us at <a href="mailto:team@smartagentalliance.com">team@smartagentalliance.com</a></p>
      </div>
    </div>
  </div>

  <!-- Commission Calculator Modal -->
  <div class="modal-container" id="calculator-modal">
    <div class="modal-backdrop" id="calculator-modal-backdrop"></div>
    <div class="tool-modal-wrapper">
      <button class="modal-close-btn" id="calculator-modal-close" aria-label="Close calculator">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="tool-modal">
        <div class="tool-modal-spinner" id="calculator-spinner">
          <div class="spinner-ring"></div>
        </div>
        <iframe id="calculator-iframe" src="" title="Commission Calculator" loading="lazy"></iframe>
      </div>
    </div>
  </div>

  <!-- RevShare Visualizer Modal -->
  <div class="modal-container" id="revshare-modal">
    <div class="modal-backdrop" id="revshare-modal-backdrop"></div>
    <div class="tool-modal-wrapper">
      <button class="modal-close-btn" id="revshare-modal-close" aria-label="Close visualizer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="tool-modal">
        <div class="tool-modal-spinner" id="revshare-spinner">
          <div class="spinner-ring"></div>
        </div>
        <iframe id="revshare-iframe" src="" title="Revenue Share Visualizer" loading="lazy"></iframe>
      </div>
    </div>
  </div>

  <script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>
  <script>
    (function() {
      // Constants
      const STORAGE_KEY = 'agent_attraction_video';
      const UNLOCK_THRESHOLD = 50;
      const SPONSOR_NAME = "${escapeJS(displayName)}";

      // Video Player State
      let player = null;
      let isPlaying = false;
      let isDragging = false;
      let duration = 0;
      let maxWatchedTime = 0;
      let progress = 0;
      let thresholdReached = false;

      // DOM Elements
      const videoIframe = document.getElementById('video-iframe');
      const videoOverlay = document.getElementById('video-overlay');
      const playBtn = document.getElementById('play-btn');
      const btnPlay = document.getElementById('btn-play');
      const btnRewind = document.getElementById('btn-rewind');
      const btnRestart = document.getElementById('btn-restart');
      const btnMute = document.getElementById('btn-mute');
      const volumeSlider = document.getElementById('volume-slider');
      const timeDisplay = document.getElementById('time-display');
      const scrubberContainer = document.getElementById('scrubber-container');
      const scrubberWatched = document.getElementById('scrubber-watched');
      const scrubberCurrent = document.getElementById('scrubber-current');
      const scrubberThumb = document.getElementById('scrubber-thumb');
      const progressFill = document.getElementById('progress-fill');
      const progressMessage = document.getElementById('progress-message');
      const bookCallWrapper = document.getElementById('book-call-wrapper');
      const videoWrapper = document.getElementById('video-wrapper');

      // Modal Elements
      const joinModal = document.getElementById('join-modal');
      const instructionsModal = document.getElementById('instructions-modal');
      const calculatorModal = document.getElementById('calculator-modal');
      const revshareModal = document.getElementById('revshare-modal');
      const calculatorIframe = document.getElementById('calculator-iframe');
      const revshareIframe = document.getElementById('revshare-iframe');
      const calculatorSpinner = document.getElementById('calculator-spinner');
      const revshareSpinner = document.getElementById('revshare-spinner');
      const joinForm = document.getElementById('join-form');
      const joinSubmit = document.getElementById('join-submit');
      const joinMessage = document.getElementById('join-message');
      const userNameDisplay = document.getElementById('user-name-display');

      // Initialize
      function init() {
        // Load saved progress
        const savedProgress = parseFloat(localStorage.getItem(STORAGE_KEY + '_progress') || '0');
        const savedMaxTime = parseFloat(localStorage.getItem(STORAGE_KEY + '_maxTime') || '0');
        const savedPosition = parseFloat(localStorage.getItem(STORAGE_KEY + '_position') || '0');

        progress = savedProgress;
        maxWatchedTime = savedMaxTime;

        if (savedProgress >= UNLOCK_THRESHOLD) {
          thresholdReached = true;
          unlockBookCall();
          updateProgressUI();
        }

        // Initialize Cloudflare Stream player
        if (window.Stream && videoIframe) {
          initPlayer();
        }

        // Set up event listeners
        setupEventListeners();
        setupScrollEffects();
        setupScrollReveal();
        setupCounterAnimation();
        setupLogoAnimation();
        setupRevealMaskAnimation();
        setupWhatYouGetBlurReveal();
        setupWhySAAClipReveal();
        setupDeckStack();
        initGrayscaleDataStream();
        setupBuiltForFutureScrollAnimation();
      }

      function initPlayer() {
        player = window.Stream(videoIframe);

        player.addEventListener('play', () => {
          isPlaying = true;
          updatePlayButton();
          videoOverlay.classList.add('is-playing');
          playBtn.classList.add('is-playing');
        });

        player.addEventListener('pause', () => {
          isPlaying = false;
          updatePlayButton();
          videoOverlay.classList.remove('is-playing');
          playBtn.classList.remove('is-playing');
        });

        player.addEventListener('ended', () => {
          isPlaying = false;
          updatePlayButton();
          videoOverlay.classList.remove('is-playing');
          playBtn.classList.remove('is-playing');
        });

        player.addEventListener('loadedmetadata', () => {
          duration = player.duration || 0;
          const savedPosition = parseFloat(localStorage.getItem(STORAGE_KEY + '_position') || '0');
          if (savedPosition > 0 && duration > 0) {
            player.currentTime = Math.min(savedPosition, duration - 1);
          }
        });

        player.addEventListener('volumechange', () => {
          volumeSlider.value = player.muted ? 0 : player.volume;
          updateMuteButton();
        });

        player.addEventListener('timeupdate', () => {
          const time = player.currentTime || 0;
          duration = player.duration || 0;

          // Update UI
          timeDisplay.textContent = formatTime(time) + ' / ' + formatTime(duration);

          // Save position
          localStorage.setItem(STORAGE_KEY + '_position', time.toString());

          // Update scrubber
          if (!isDragging && duration > 0) {
            const pct = (time / duration) * 100;
            scrubberCurrent.style.width = pct + '%';
            scrubberThumb.style.left = pct + '%';
          }

          // Track progress
          if (duration > 0 && time > maxWatchedTime) {
            maxWatchedTime = time;
            localStorage.setItem(STORAGE_KEY + '_maxTime', maxWatchedTime.toString());
            scrubberWatched.style.width = (maxWatchedTime / duration) * 100 + '%';

            const newProgress = (maxWatchedTime / duration) * 100;
            if (newProgress > progress) {
              progress = newProgress;
              localStorage.setItem(STORAGE_KEY + '_progress', progress.toString());
              updateProgressUI();

              if (progress >= UNLOCK_THRESHOLD && !thresholdReached) {
                thresholdReached = true;
                unlockBookCall();
              }
            }
          }
        });
      }

      function setupEventListeners() {
        // Video controls
        videoOverlay.addEventListener('click', togglePlayPause);
        btnPlay.addEventListener('click', togglePlayPause);
        btnRewind.addEventListener('click', () => { if (player) player.currentTime = Math.max(0, player.currentTime - 15); });
        btnRestart.addEventListener('click', () => { if (player) player.currentTime = 0; });
        btnMute.addEventListener('click', () => { if (player) { player.muted = !player.muted; updateMuteButton(); } });
        volumeSlider.addEventListener('input', (e) => { if (player) { player.volume = e.target.value; player.muted = e.target.value == 0; } });

        // Scrubber
        videoWrapper.addEventListener('mouseenter', () => scrubberContainer.classList.add('visible'));
        videoWrapper.addEventListener('mouseleave', () => { if (!isDragging) scrubberContainer.classList.remove('visible'); });

        scrubberContainer.addEventListener('mousedown', (e) => {
          isDragging = true;
          seekToPosition(e);
        });

        document.addEventListener('mousemove', (e) => {
          if (isDragging) seekToPosition(e);
        });

        document.addEventListener('mouseup', () => {
          isDragging = false;
        });

        // Modals
        document.getElementById('btn-join-alliance').addEventListener('click', () => openModal('join'));
        document.getElementById('join-modal-close').addEventListener('click', () => closeModal('join'));
        document.getElementById('join-modal-backdrop').addEventListener('click', () => closeModal('join'));
        document.getElementById('instructions-modal-close').addEventListener('click', () => closeModal('instructions'));
        document.getElementById('instructions-modal-backdrop').addEventListener('click', () => closeModal('instructions'));

        // Calculator modals
        document.getElementById('btn-commission-calculator').addEventListener('click', () => openModal('calculator'));
        document.getElementById('calculator-modal-close').addEventListener('click', () => closeModal('calculator'));
        document.getElementById('calculator-modal-backdrop').addEventListener('click', () => closeModal('calculator'));
        document.getElementById('btn-revshare-visualizer').addEventListener('click', () => openModal('revshare'));
        document.getElementById('revshare-modal-close').addEventListener('click', () => closeModal('revshare'));
        document.getElementById('revshare-modal-backdrop').addEventListener('click', () => closeModal('revshare'));

        // Iframe load handlers - hide spinner and fade in content
        calculatorIframe.addEventListener('load', () => {
          if (calculatorIframe.src) {
            calculatorSpinner.classList.add('hidden');
            calculatorIframe.classList.add('loaded');
          }
        });
        revshareIframe.addEventListener('load', () => {
          if (revshareIframe.src) {
            revshareSpinner.classList.add('hidden');
            revshareIframe.classList.add('loaded');
          }
        });

        // Listen for messages from embedded iframes (height changes, dropdown open, etc.)
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'setHeight') {
            // Dynamically set iframe height to match content
            const iframe = event.data.modal === 'calculator' ? calculatorIframe : revshareIframe;
            if (iframe && event.data.height) {
              iframe.style.height = event.data.height + 'px';
            }
          }
          if (event.data && event.data.type === 'scrollToBottom') {
            // Scroll the modal wrapper to show expanded content
            const modalWrapper = event.data.modal === 'calculator'
              ? document.querySelector('#calculator-modal .tool-modal-wrapper')
              : document.querySelector('#revshare-modal .tool-modal-wrapper');
            if (modalWrapper) {
              modalWrapper.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }
        });

        // Form submission
        joinForm.addEventListener('submit', handleFormSubmit);

        // Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (joinModal.classList.contains('open')) closeModal('join');
            if (instructionsModal.classList.contains('open')) closeModal('instructions');
            if (calculatorModal.classList.contains('open')) closeModal('calculator');
            if (revshareModal.classList.contains('open')) closeModal('revshare');
          }
        });
      }

      function togglePlayPause() {
        if (!player) return;
        if (isPlaying) player.pause();
        else player.play();
      }

      function updatePlayButton() {
        const svg = isPlaying
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        btnPlay.innerHTML = svg;
        playBtn.innerHTML = svg;
      }

      function updateMuteButton() {
        const vol = player ? (player.muted ? 0 : player.volume) : 1;
        let svg;
        if (vol === 0) {
          svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
        } else if (vol < 0.5) {
          svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        } else {
          svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        }
        btnMute.innerHTML = svg;
      }

      function seekToPosition(e) {
        if (!player || duration <= 0) return;
        const rect = scrubberContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        const requestedTime = pct * duration;
        const newTime = Math.min(requestedTime, maxWatchedTime);
        player.currentTime = newTime;
        scrubberCurrent.style.width = (newTime / duration) * 100 + '%';
        scrubberThumb.style.left = (newTime / duration) * 100 + '%';
      }

      function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + String(s).padStart(2, '0');
      }

      function updateProgressUI() {
        const fillPct = thresholdReached ? 100 : Math.min((progress / UNLOCK_THRESHOLD) * 100, 100);
        progressFill.style.width = fillPct + '%';
        progressMessage.textContent = progress >= UNLOCK_THRESHOLD
          ? "You're all set! Book a call if you'd like to talk before joining."
          : "Most questions are answered here, once you've watched 50%, the option to book a call becomes available.";
      }

      function unlockBookCall() {
        bookCallWrapper.style.opacity = '1';
        bookCallWrapper.style.filter = 'none';
        bookCallWrapper.style.pointerEvents = 'auto';
      }

      // Modal functions
      function getModal(type) {
        switch(type) {
          case 'join': return joinModal;
          case 'instructions': return instructionsModal;
          case 'calculator': return calculatorModal;
          case 'revshare': return revshareModal;
          default: return null;
        }
      }

      function openModal(type) {
        const modal = getModal(type);
        if (!modal) return;

        // For tool modals, load the iframe src when opening (using actual React pages with embed mode)
        if (type === 'calculator' && calculatorIframe) {
          // Reset state: show spinner, hide iframe
          calculatorIframe.classList.remove('loaded');
          calculatorSpinner.classList.remove('hidden');
          calculatorIframe.src = '/exp-commission-calculator/?embed=true';
        } else if (type === 'revshare' && revshareIframe) {
          // Reset state: show spinner, hide iframe
          revshareIframe.classList.remove('loaded');
          revshareSpinner.classList.remove('hidden');
          revshareIframe.src = '/exp-realty-revenue-share-calculator/?embed=true';
        }

        modal.classList.add('open');
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
      }

      function closeModal(type) {
        const modal = getModal(type);
        if (!modal) return;

        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');

        // Clear iframe src when closing to stop any running scripts
        if (type === 'calculator' && calculatorIframe) {
          calculatorIframe.src = '';
          calculatorIframe.classList.remove('loaded');
        } else if (type === 'revshare' && revshareIframe) {
          revshareIframe.src = '';
          revshareIframe.classList.remove('loaded');
        }
      }

      // Form submission
      async function handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          country: document.getElementById('country').value,
          sponsorName: SPONSOR_NAME
        };

        joinSubmit.disabled = true;
        joinSubmit.textContent = 'Submitting...';
        joinMessage.style.display = 'none';

        try {
          const response = await fetch('/api/join-team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          const result = await response.json();

          if (result.success) {
            // Save to localStorage
            localStorage.setItem('saa_join_submitted', JSON.stringify(formData));

            // Close join modal and open instructions immediately
            closeModal('join');
            userNameDisplay.textContent = formData.firstName;
            setTimeout(() => openModal('instructions'), 300);

            // Reset form
            joinForm.reset();
          } else {
            joinMessage.className = 'form-message error';
            joinMessage.textContent = result.error || 'Something went wrong. Please try again.';
            joinMessage.style.display = 'block';
          }
        } catch (err) {
          joinMessage.className = 'form-message error';
          joinMessage.textContent = 'Network error. Please check your connection.';
          joinMessage.style.display = 'block';
        } finally {
          joinSubmit.disabled = false;
          joinSubmit.textContent = 'Get Started';
        }
      }

      // Hero scroll effects
      function setupScrollEffects() {
        const heroContentWrapper = document.getElementById('hero-content-wrapper');
        const scrollIndicator = document.getElementById('scroll-indicator');
        const heroEffectLayers = document.querySelectorAll('.hero-effect-layer');
        const agentCounter = document.getElementById('agent-counter-desktop');
        let lockedHeight = window.innerHeight;

        function handleScroll() {
          const scrollY = window.scrollY;
          const viewportHeight = lockedHeight;
          const scrollProgress = Math.min(scrollY / viewportHeight, 1);

          // Hero content fade/scale
          const scale = 1 - scrollProgress * 0.4;
          const blur = scrollProgress * 8;
          const brightness = 1 - scrollProgress;
          const opacity = 1 - scrollProgress;
          const translateY = -scrollProgress * 50;

          if (heroContentWrapper) {
            heroContentWrapper.style.transformOrigin = 'center center';
            heroContentWrapper.style.transform = 'scale(' + scale + ') translateY(' + translateY + 'px)';
            heroContentWrapper.style.filter = 'blur(' + blur + 'px) brightness(' + brightness + ')';
            heroContentWrapper.style.opacity = opacity;
          }

          // Effect layers
          heroEffectLayers.forEach(el => {
            el.style.opacity = opacity;
            el.style.visibility = scrollProgress >= 1 ? 'hidden' : 'visible';
          });

          // Agent counter
          if (agentCounter) {
            agentCounter.style.opacity = opacity;
            agentCounter.style.filter = 'blur(' + blur + 'px) brightness(' + brightness + ')';
          }

          // Scroll indicator
          if (scrollIndicator) {
            const fadeStart = 20;
            const fadeEnd = 100;
            let indicatorOpacity = 1;
            let indicatorScale = 1;

            if (scrollY <= fadeStart) {
              indicatorOpacity = 1;
              indicatorScale = 1;
            } else if (scrollY >= fadeEnd) {
              indicatorOpacity = 0;
              indicatorScale = 0.5;
            } else {
              const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
              indicatorOpacity = 1 - progress;
              indicatorScale = 1 - progress * 0.5;
            }

            scrollIndicator.style.opacity = indicatorOpacity;
            scrollIndicator.style.transform = 'scale(' + indicatorScale + ')';
          }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
      }

      // Scroll reveal
      function setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
      }

      // Counter scramble animation (matches homepage)
      function setupCounterAnimation() {
        // Get both desktop and tagline counter digits
        const desktopCounter = document.getElementById('agent-counter-desktop');
        const desktopDigits = desktopCounter ? desktopCounter.querySelectorAll('.counter-digit') : [];
        const taglineDigits = document.querySelectorAll('.counter-digit-tagline');

        // Need at least one set of digits
        if (desktopDigits.length !== 4 && taglineDigits.length !== 4) return;

        let animationId = null;

        function animateScramble() {
          const target = 3700;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          if (animationId) {
            cancelAnimationFrame(animationId);
          }

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (progress >= 1) {
              // End animation - show final value
              if (desktopDigits.length === 4) {
                desktopDigits[0].textContent = '3';
                desktopDigits[1].textContent = '7';
                desktopDigits[2].textContent = '0';
                desktopDigits[3].textContent = '0';
              }
              if (taglineDigits.length === 4) {
                taglineDigits[0].textContent = '3';
                taglineDigits[1].textContent = '7';
                taglineDigits[2].textContent = '0';
                taglineDigits[3].textContent = '0';
              }
              animationId = null;
            } else {
              // Scramble effect - show random numbers that gradually approach target
              const currentValue = Math.floor(target * progress);
              const scrambleIntensity = 1 - progress;

              const digits = currentValue.toString().padStart(4, '0').split('');
              const scrambled = digits.map(function(digit, index) {
                if (Math.random() < scrambleIntensity * 0.3) {
                  if (index === 0) return '3';
                  return (Math.floor(Math.random() * 8) + 2).toString();
                }
                return digit;
              });

              scrambled.forEach(function(digit, index) {
                if (desktopDigits.length === 4) {
                  desktopDigits[index].textContent = digit;
                }
                if (taglineDigits.length === 4) {
                  taglineDigits[index].textContent = digit;
                }
              });

              animationId = requestAnimationFrame(animate);
            }
          }

          animationId = requestAnimationFrame(animate);
        }

        // Start first animation after a short delay
        setTimeout(function() {
          animateScramble();
          // Loop every 5 seconds
          setInterval(animateScramble, 5000);
        }, 500);
      }

      // Logo animation
      function setupLogoAnimation() {
        const track = document.getElementById('logo-track');
        if (!track) return;

        let position = 0;
        let velocity = 0.5;
        let lastScrollY = window.scrollY;

        function animate() {
          const singleSetWidth = track.scrollWidth / 2;
          if (singleSetWidth > 0) {
            position += velocity;
            if (velocity > 0.5) {
              velocity *= 0.98;
              if (velocity < 0.5) velocity = 0.5;
            }
            if (position >= singleSetWidth) position -= singleSetWidth;
            track.style.transform = 'translateX(-' + position + 'px)';
          }
          requestAnimationFrame(animate);
        }

        function handleScroll() {
          const currentScrollY = window.scrollY;
          const scrollDelta = Math.abs(currentScrollY - lastScrollY);
          lastScrollY = currentScrollY;
          const boost = Math.min(scrollDelta * 0.3, 8);
          if (boost > 0.5) velocity = Math.max(velocity, boost);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        requestAnimationFrame(animate);
      }

      // Reveal Mask Animation (Golden glow with rotating borders)
      function setupRevealMaskAnimation() {
        const revealGlow = document.querySelector('.reveal-glow');
        const ringOuter = document.querySelector('.reveal-ring-outer');
        const ringInner = document.querySelector('.reveal-ring-inner');

        if (!revealGlow || !ringOuter || !ringInner) return;

        // Animation state
        let time = 0;
        let lastTimestamp = 0;
        let lastScrollY = window.scrollY;
        let scrollBoost = 0;

        // Speed settings (matching RevealMaskEffect.tsx)
        const IDLE_SPEED = 0.000075;
        const SCROLL_BOOST_MAX = 0.0006;
        const SCROLL_BOOST_MULTIPLIER = 0.000024;
        const SCROLL_DECAY = 0.92;

        function handleScroll() {
          const currentScrollY = window.scrollY;
          const scrollDelta = Math.abs(currentScrollY - lastScrollY);
          lastScrollY = currentScrollY;

          if (scrollDelta > 0) {
            const boost = Math.min(scrollDelta * SCROLL_BOOST_MULTIPLIER, SCROLL_BOOST_MAX);
            scrollBoost = Math.max(scrollBoost, boost);
          }
        }

        function animate(timestamp) {
          const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
          lastTimestamp = timestamp;

          // Calculate speed with scroll boost
          const currentSpeed = IDLE_SPEED + scrollBoost;
          time += currentSpeed * deltaTime;
          scrollBoost *= SCROLL_DECAY;

          // Sine waves for organic pulsing (matching RevealMaskEffect.tsx)
          const wave1 = Math.sin(time * Math.PI * 2);
          const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5);
          const wave3 = Math.cos(time * Math.PI * 0.7);

          // Combined wave for progress
          const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
          const progress = 0.45 + combinedWave * 0.35;

          // Animation values (smaller for single person hero image - 85% of original)
          const maskSize = 76.5 - progress * 34;
          const rotation = time * 90;

          // Update glow gradient
          revealGlow.style.background = 'radial-gradient(ellipse ' + maskSize + '% ' + (maskSize * 0.7) + '% at 50% 42%, rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%)';

          // Update outer ring (rotates clockwise, morphs border-radius)
          const outerRadius = 20 + progress * 30;
          ringOuter.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
          ringOuter.style.borderRadius = outerRadius + '%';

          // Update inner ring (rotates counter-clockwise at half speed, morphs inversely)
          const innerRadius = Math.max(20, 50 - progress * 30);
          ringInner.style.transform = 'translate(-50%, -50%) rotate(' + (-rotation * 0.5) + 'deg)';
          ringInner.style.borderRadius = innerRadius + '%';

          requestAnimationFrame(animate);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        requestAnimationFrame(animate);
      }

      // What You Get - Blur Reveal Cards
      function setupWhatYouGetBlurReveal() {
        const cards = document.querySelectorAll('.wyg-blur-card');
        if (!cards.length) return;

        // Create thresholds for smooth animation
        var thresholds = [];
        for (var i = 0; i <= 50; i++) {
          thresholds.push(i / 50);
        }

        cards.forEach(function(card) {
          var hasRevealed = false; // Track if card has been fully revealed

          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              // Once fully revealed, stay revealed (don't animate out at top)
              if (hasRevealed) {
                card.style.filter = 'blur(0px)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0px)';
                return;
              }

              var p = entry.intersectionRatio;

              // Mark as revealed when fully visible
              if (p >= 0.95) {
                hasRevealed = true;
              }

              // Blur goes from 12px to 0 as card enters
              var blur = Math.max(0, 12 * (1 - p));
              // Opacity goes from 0 to 1
              var opacity = Math.min(1, p);
              // TranslateY goes from 30px to 0
              var translateY = 30 * (1 - p);

              card.style.filter = 'blur(' + blur + 'px)';
              card.style.opacity = opacity;
              card.style.transform = 'translateY(' + translateY + 'px)';
            });
          }, {
            threshold: thresholds,
            rootMargin: '-5% 0px -5% 0px'
          });
          observer.observe(card);
        });
      }

      // Why SAA - Expand Reveal Animation (cards open from edges with rounded corners)
      function setupWhySAAClipReveal() {
        var elements = document.querySelectorAll('.expand-reveal-element');
        if (!elements.length) return;

        // Easing function for smooth deceleration (easeOutQuart)
        function easeOutQuart(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function updateProgress() {
          elements.forEach(function(el) {
            var expandId = el.getAttribute('data-expand-id');
            var expandDir = el.getAttribute('data-expand-dir');
            var frameEl = document.getElementById(expandId + '-frame');
            var contentEl = document.getElementById(expandId + '-content');

            var rect = el.getBoundingClientRect();
            var windowHeight = window.innerHeight;

            // Start animation when element top enters viewport
            // End animation after 400px of scroll
            var scrollDistance = 600;
            var elementTop = rect.top;
            var startPoint = windowHeight;
            var distanceScrolled = startPoint - elementTop;

            // Clamp between 0 and 1
            var rawProgress = Math.max(0, Math.min(1, distanceScrolled / scrollDistance));
            var p = easeOutQuart(rawProgress);
            var clipPercent = 100 - (p * 100); // 100% to 0% as progress goes 0 to 1

            if (expandDir === 'left' && frameEl) {
              // Expand from left using clip-path
              frameEl.style.clipPath = 'inset(0 ' + clipPercent + '% 0 0 round 16px)';
              if (contentEl) {
                contentEl.style.opacity = Math.min(1, p * 1.5);
              }
            } else if (expandDir === 'right' && frameEl) {
              // Expand from right using clip-path
              frameEl.style.clipPath = 'inset(0 0 0 ' + clipPercent + '% round 16px)';
            } else {
              // Default: fade up (for disclaimer)
              el.style.opacity = Math.min(1, p * 1.5);
              el.style.transform = 'translateY(' + ((1 - p) * 20) + 'px)';
            }
          });
        }

        // Initial calculation
        updateProgress();

        // Update on scroll
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
      }

      // WhyOnlyAtExp - Scroll-Triggered 3D Card Stack Animation (GSAP)
      function setupWhyOnlyScrollAnimation() {
        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

        const triggerEl = document.getElementById('why-only-trigger');
        const contentEl = document.getElementById('why-only-content');
        const progressFill = document.getElementById('why-only-progress-fill');
        const cards = [
          document.getElementById('why-only-card-0'),
          document.getElementById('why-only-card-1'),
          document.getElementById('why-only-card-2')
        ];

        if (!triggerEl || !contentEl || cards.some(c => !c)) return;

        const totalCards = cards.length;

        // State for magnetic snap effect
        let rawProgress = 0;
        let displayProgress = 0;
        let lastRaw = 0;
        let velocity = 0;
        let rafId = null;

        // Grace period: 10% at start and 10% at end of scroll range
        const GRACE = 0.1;
        const CONTENT_RANGE = 1 - (GRACE * 2); // 80% of scroll for actual card movement

        // Update card transforms based on progress
        function updateCards(progress) {
          cards.forEach(function(card, index) {
            const isLastCard = index === totalCards - 1;
            // Scale so 3rd card (index 2) reaches position 0 when progress = 1
            const globalCardPosition = progress * (totalCards - 1) - index;

            let rotateX = 0, translateZ = 0, translateY = 0, opacity = 1, scale = 1;

            if (isLastCard) {
              // Last card: slides up into position, no flip
              if (globalCardPosition >= 0) {
                rotateX = 0;
                opacity = 1;
                scale = 1;
                translateZ = 0;
                translateY = 0;
              } else {
                const stackPosition = -globalCardPosition;
                translateZ = -30 * stackPosition;
                translateY = 20 * stackPosition;
                opacity = Math.max(0.4, 1 - stackPosition * 0.15);
                scale = Math.max(0.88, 1 - stackPosition * 0.04);
              }
            } else if (globalCardPosition >= 1) {
              rotateX = -90;
              opacity = 0;
              scale = 0.9;
            } else if (globalCardPosition >= 0) {
              rotateX = -globalCardPosition * 90;
              opacity = globalCardPosition > 0.7 ? 1 - ((globalCardPosition - 0.7) / 0.3) : 1;
              scale = 1 - globalCardPosition * 0.1;
            } else {
              const stackPosition = -globalCardPosition;
              translateZ = -30 * stackPosition;
              translateY = 20 * stackPosition;
              opacity = Math.max(0.4, 1 - stackPosition * 0.15);
              scale = Math.max(0.88, 1 - stackPosition * 0.04);
            }

            card.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) translateZ(' + translateZ + 'px) translateY(' + translateY + 'px) scale(' + scale + ')';
            card.style.opacity = opacity;
            card.style.zIndex = totalCards - index;
          });

          // Update progress bar
          if (progressFill) {
            progressFill.style.width = (progress * 100) + '%';
          }
        }

        // Velocity-based magnetic snap animation loop
        function animateMagnetic() {
          const raw = rawProgress;
          const currentDisplay = displayProgress;

          // Calculate velocity (change since last frame)
          const instantVelocity = Math.abs(raw - lastRaw);
          // Smooth velocity with decay
          velocity = velocity * 0.9 + instantVelocity * 0.1;
          lastRaw = raw;

          // Card positions are at 0, 0.5, 1 (for 3 cards)
          const cardStep = 1 / (totalCards - 1);
          const nearestCardIndex = Math.round(raw / cardStep);
          const nearestCardProgress = Math.max(0, Math.min(1, nearestCardIndex * cardStep));

          // When velocity is high, follow raw position
          // When velocity is low, snap to nearest card
          const velocityFactor = Math.min(1, velocity * 100); // 0 = stopped, 1 = scrolling fast

          // Blend between snap target (when stopped) and raw position (when scrolling)
          const targetProgress = nearestCardProgress * (1 - velocityFactor) + raw * velocityFactor;

          // Smooth interpolation toward target
          const newProgress = currentDisplay + (targetProgress - currentDisplay) * 0.15;

          // Always update to keep smooth animation
          if (Math.abs(newProgress - currentDisplay) > 0.0001) {
            displayProgress = newProgress;
            updateCards(newProgress);
          }

          rafId = requestAnimationFrame(animateMagnetic);
        }

        // Start the magnetic animation loop
        rafId = requestAnimationFrame(animateMagnetic);

        // Create GSAP timeline for content drift
        const tl = gsap.timeline();
        tl.to(contentEl, {
          y: -60, // Drift upward by 60px total (from +30 to -30)
          duration: 1,
          ease: 'none',
        });

        // Create ScrollTrigger for pinning and progress tracking
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'center center',
          end: '+=200%', // Extended for more buffer between card flips
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          animation: tl,
          onUpdate: function(self) {
            // Map scroll progress to card progress with grace periods
            let cardProgress = 0;

            if (self.progress <= GRACE) {
              cardProgress = 0;
            } else if (self.progress >= 1 - GRACE) {
              cardProgress = 1;
            } else {
              cardProgress = (self.progress - GRACE) / CONTENT_RANGE;
            }

            // Update raw progress - magnetic loop will interpolate
            rawProgress = cardProgress;
          },
        });

        // Initialize cards at position 0
        updateCards(0);
      }

      // ========================================
      // Built For Future - Horizontal Scroll Cards
      // ========================================

      // ========================================
      // Built For Future - Horizontal Scroll Cards (matches homepage exactly)
      // ========================================

      // ========================================
      // GrayscaleDataStream - Digital Rain Background
      // Exact copy from BuiltForFuture.tsx GrayscaleDataStream component
      // ========================================
      function initGrayscaleDataStream() {
        var container = document.getElementById('grayscale-data-stream');
        if (!container) {
          console.log('[GrayscaleDataStream] Container not found');
          return;
        }

        // Get the section to ensure proper dimensions
        var section = document.getElementById('built-for-future');
        if (!section) {
          console.log('[GrayscaleDataStream] Section not found');
          return;
        }

        // Set container to fill the section
        container.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 0;';

        var isMobile = window.innerWidth < 768;
        var columnCount = isMobile ? 8 : 20;
        var numChars = 22;
        var timeRef = 0;
        var scrollSpeedRef = 1;
        var lastScrollY = 0;
        var BASE_SPEED = 0.00028;
        var lastTimestamp = 0;

        // Scroll speed boost handler
        window.addEventListener('scroll', function() {
          var currentY = window.scrollY;
          var scrollDelta = Math.abs(currentY - lastScrollY);
          lastScrollY = currentY;
          scrollSpeedRef = 1 + Math.min(scrollDelta * 0.05, 3);
        }, { passive: true });

        // getChar function
        function getChar(colIndex, charIndex, time) {
          var flipRate = 0.6 + (colIndex % 3) * 0.3;
          var charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + charIndex * 13);
          return charSeed % 2 === 0 ? '0' : '1';
        }

        // Create columns with characters
        for (var i = 0; i < columnCount; i++) {
          var colX = (i / columnCount) * 100;
          var colWidth = 100 / columnCount;
          var speed = 0.8 + (i % 4) * 0.4;
          var offset = (i * 17) % 100;

          var colDiv = document.createElement('div');
          colDiv.style.cssText = 'position: absolute; left: ' + colX + '%; top: 0; width: ' + colWidth + '%; height: 100%; overflow: hidden; font-family: monospace; font-size: 14px; line-height: 1.4;';
          colDiv.setAttribute('data-col', i);
          colDiv.setAttribute('data-speed', speed);
          colDiv.setAttribute('data-offset', offset);

          for (var j = 0; j < numChars; j++) {
            var charDiv = document.createElement('div');
            charDiv.style.cssText = 'position: absolute; left: 0;';
            charDiv.setAttribute('data-char', j);
            charDiv.textContent = getChar(i, j, 0);
            colDiv.appendChild(charDiv);
          }

          container.appendChild(colDiv);
        }

        // Animation loop
        function animate(timestamp) {
          var deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
          lastTimestamp = timestamp;
          timeRef += BASE_SPEED * deltaTime * scrollSpeedRef;
          scrollSpeedRef = Math.max(1, scrollSpeedRef * 0.95);

          var columns = container.querySelectorAll('[data-col]');
          for (var c = 0; c < columns.length; c++) {
            var colDiv = columns[c];
            var colIndex = parseInt(colDiv.getAttribute('data-col'));
            var speed = parseFloat(colDiv.getAttribute('data-speed'));
            var offset = parseFloat(colDiv.getAttribute('data-offset'));
            var columnOffset = (timeRef * speed * 60 + offset) % 110;
            var headPosition = (columnOffset / 5) % numChars;

            var chars = colDiv.querySelectorAll('[data-char]');
            for (var k = 0; k < chars.length; k++) {
              var charDiv = chars[k];
              var charIndex = parseInt(charDiv.getAttribute('data-char'));
              var baseY = charIndex * 5;
              var charY = (baseY + columnOffset) % 110 - 10;
              var distanceFromHead = (charIndex - headPosition + numChars) % numChars;
              var isHead = distanceFromHead === 0;
              var trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              var edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;

              charDiv.style.top = charY + '%';
              charDiv.style.color = isHead ? 'rgba(180,180,180,' + (0.4 * edgeFade) + ')' : 'rgba(120,120,120,' + (trailBrightness * 0.25 * edgeFade) + ')';
              charDiv.style.textShadow = isHead ? '0 0 6px rgba(150,150,150,' + (0.3 * edgeFade) + ')' : '0 0 2px rgba(100,100,100,' + (0.1 * edgeFade) + ')';
              charDiv.style.opacity = edgeFade;
              charDiv.textContent = getChar(colIndex, charIndex, timeRef);
            }
          }

          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        console.log('[GrayscaleDataStream] Initialized with ' + columnCount + ' columns');
      }

      // ========================================
      // Built For Future - Horizontal Scroll Cards
      // Exact copy from BuiltForFuture.tsx BuiltForFuture component
      // ========================================
      function setupBuiltForFutureScrollAnimation() {
        var trigger = document.getElementById('built-future-trigger');
        var content = document.getElementById('built-future-content');
        var track = document.getElementById('built-future-track');
        var progressBar = document.getElementById('built-future-progress');

        if (!trigger || !content || !track) {
          console.log('[BuiltForFuture] Elements not found, skipping');
          return;
        }

        var BRAND_YELLOW = '#ffd700';

        // FUTURE_POINTS - exact from React
        var FUTURE_POINTS = [
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-cloud/public', text: 'Cloud-First Brokerage Model', imgClass: 'w-full h-full object-contain', imgStyle: '', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-ai-bot/public', text: 'AI-Powered Tools and Training', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.25) translate(10px, 18px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-mobile-first/public', text: 'Mobile-First Workflows', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(0.95) translate(3px, 10px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-borderless/public', text: 'Borderless Business', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.15) translate(-1px, -1px);', bgColor: 'rgba(17,17,17,0.5)' },
          { image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/saa-future-income-benjamins/public', text: 'Sustainable Income Beyond Sales', imgClass: 'w-full h-full object-cover', imgStyle: 'transform: scale(1.35) translateX(5px);', bgColor: '#111' }
        ];

        var totalCards = FUTURE_POINTS.length;

        // Responsive - exact from React
        var isMobile = window.innerWidth < 640;
        var CARD_WIDTH = isMobile ? 280 : 560;
        var CARD_GAP = isMobile ? 16 : 24;

        // Grace periods - exact from React
        var GRACE = 0.1;
        var CONTENT_RANGE = 1 - (GRACE * 2);

        // Magnetic snap state - exact from React refs
        var rawPositionRef = 0;
        var displayPositionRef = 0;
        var lastRawRef = 0;
        var velocityRef = 0;

        // Create looped cards array - exact from React
        var loopedCards = FUTURE_POINTS.slice(-2).concat(FUTURE_POINTS).concat(FUTURE_POINTS.slice(0, 2));

        // Active/inactive backgrounds - exact from React
        var activeBackground = 'radial-gradient(ellipse 120% 80% at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 70% 80%, rgba(255,200,100,0.6) 0%, transparent 40%), radial-gradient(ellipse 80% 100% at 50% 50%, rgba(255,215,0,0.7) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 20% 70%, rgba(255,180,50,0.5) 0%, transparent 50%), radial-gradient(ellipse 90% 70% at 80% 30%, rgba(255,240,200,0.4) 0%, transparent 45%), linear-gradient(180deg, rgba(255,225,150,0.9) 0%, rgba(255,200,80,0.85) 50%, rgba(255,180,50,0.9) 100%)';
        var inactiveBackground = 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))';

        // Set track gap
        track.style.gap = CARD_GAP + 'px';

        // Generate cards HTML - using inline styles (not Tailwind classes since this is vanilla HTML)
        loopedCards.forEach(function(point, loopIndex) {
          var wrapper = document.createElement('div');
          wrapper.style.cssText = 'flex-shrink: 0; width: ' + CARD_WIDTH + 'px; transition: transform 0.1s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out;';
          wrapper.dataset.loopIndex = loopIndex;

          var card = document.createElement('div');
          card.style.cssText = 'padding: 2rem; border-radius: 1rem; min-height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; transition: background 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out;';
          card.dataset.card = 'true';

          var imgContainer = document.createElement('div');
          var imgSize = isMobile ? '180px' : '200px';
          imgContainer.style.cssText = 'width: ' + imgSize + '; height: ' + imgSize + '; border-radius: 50%; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; z-index: 10; transition: background-color 0.2s ease-out, border 0.2s ease-out, box-shadow 0.2s ease-out;';
          imgContainer.setAttribute('data-img-container', 'true');

          var img = document.createElement('img');
          img.src = point.image;
          img.alt = point.text;
          img.style.cssText = 'width: 100%; height: 100%; object-fit: ' + (point.imgClass.includes('object-contain') ? 'contain' : 'cover') + ';';
          if (point.imgStyle) {
            img.style.cssText += point.imgStyle;
          }

          var title = document.createElement('h3');
          title.style.cssText = 'font-family: var(--font-amulya), sans-serif; font-weight: bold; font-size: clamp(22px, calc(20.82px + 0.47vw), 35px); text-align: center; position: relative; z-index: 10; transition: color 0.2s ease-out;';
          title.textContent = point.text;
          title.dataset.title = 'true';

          imgContainer.appendChild(img);
          card.appendChild(imgContainer);
          card.appendChild(title);
          wrapper.appendChild(card);
          track.appendChild(wrapper);
        });

        var wrappers = track.querySelectorAll('[data-loop-index]');

        // updateCards function - renders card states based on scroll position
        function updateCards(scrollPosition) {
          var progress = scrollPosition / (totalCards - 1);
          if (progressBar) {
            progressBar.style.width = (progress * 100) + '%';
          }

          // Track transform - exact formula from React
          var offset = (scrollPosition + 2) * (CARD_WIDTH + CARD_GAP);
          track.style.transform = 'translateX(calc(50vw - ' + (CARD_WIDTH / 2) + 'px - 12px - ' + offset + 'px))';

          wrappers.forEach(function(wrapper) {
            var loopIndex = parseInt(wrapper.dataset.loopIndex);
            var card = wrapper.querySelector('[data-card]');
            var imgContainer = wrapper.querySelector('[data-img-container]');
            var title = wrapper.querySelector('[data-title]');

            var actualIndex = loopIndex - 2;
            var distance = Math.abs(scrollPosition - actualIndex);
            var isActive = distance < 0.5;

            // Scale - exact from React
            var scale = Math.max(0.85, 1 - distance * 0.1);

            // Blur - exact from React
            var blurAmount = Math.min(5, distance * 10);

            // Blackout for looped cards - exact from React
            var blackoutOpacity = 0;
            if (actualIndex < 0) {
              blackoutOpacity = Math.max(0, 1 - scrollPosition);
            } else if (actualIndex > totalCards - 1) {
              blackoutOpacity = Math.max(0, (scrollPosition - (totalCards - 2)) / 1);
            }

            // Apply wrapper styles - exact from React
            wrapper.style.transform = 'scale(' + scale + ')';
            wrapper.style.filter = 'blur(' + (blurAmount + blackoutOpacity * 4) + 'px) grayscale(' + (blackoutOpacity * 100) + '%) brightness(' + (1 - blackoutOpacity * 0.6) + ')';
            wrapper.style.opacity = 1 - blackoutOpacity * 0.4;

            // Card styles - exact from React
            card.style.background = isActive ? activeBackground : inactiveBackground;
            card.style.border = isActive ? '2px solid rgba(180,150,50,0.5)' : '2px solid ' + BRAND_YELLOW + '22';
            card.style.boxShadow = isActive ? '0 0 40px 8px rgba(255,200,80,0.4), 0 0 80px 16px rgba(255,180,50,0.25)' : 'none';

            // Image container styles - exact from React
            if (imgContainer) {
              imgContainer.style.backgroundColor = isActive ? 'rgba(20,18,12,0.85)' : loopedCards[loopIndex].bgColor;
              imgContainer.style.border = isActive ? '3px solid rgba(40,35,20,0.8)' : '3px solid ' + BRAND_YELLOW;
              imgContainer.style.boxShadow = isActive ? '0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)' : 'none';
            }

            // Title color - exact from React
            if (title) {
              title.style.color = isActive ? '#2a2a2a' : '#e5e4dd';
            }
          });
        }

        // Magnetic animation loop - exact from React useLayoutEffect
        function animateMagnetic() {
          var raw = rawPositionRef;
          var lastRaw = lastRawRef;
          var currentDisplay = displayPositionRef;

          var instantVelocity = Math.abs(raw - lastRaw);
          velocityRef = velocityRef * 0.9 + instantVelocity * 0.1;
          lastRawRef = raw;

          var nearestCard = Math.round(raw);
          var clampedTarget = Math.max(0, Math.min(totalCards - 1, nearestCard));

          var velocityFactor = Math.min(1, velocityRef * 50);
          var targetPosition = clampedTarget * (1 - velocityFactor) + raw * velocityFactor;
          var newPosition = currentDisplay + (targetPosition - currentDisplay) * 0.15;

          if (Math.abs(newPosition - currentDisplay) > 0.001) {
            displayPositionRef = newPosition;
            updateCards(newPosition);
          }

          requestAnimationFrame(animateMagnetic);
        }

        requestAnimationFrame(animateMagnetic);

        // GSAP ScrollTrigger - exact from React
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
          trigger: trigger,
          start: 'center center',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: function(self) {
            var cardPosition = 0;

            if (self.progress <= GRACE) {
              cardPosition = 0;
            } else if (self.progress >= 1 - GRACE) {
              cardPosition = totalCards - 1;
            } else {
              var contentProgress = (self.progress - GRACE) / CONTENT_RANGE;
              cardPosition = contentProgress * (totalCards - 1);
            }

            rawPositionRef = cardPosition;
          }
        });

        // Y drift animation - exact from React
        gsap.to(content, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger,
            start: 'center center',
            end: '+=300%',
            scrub: 2.5
          }
        });

        // Initialize at position 0
        updateCards(0);

        // Force immediate visual update to ensure cards display correctly
        var initialOffset = 2 * (CARD_WIDTH + CARD_GAP);
        track.style.transform = 'translateX(calc(50vw - ' + (CARD_WIDTH / 2) + 'px - 12px - ' + initialOffset + 'px))';

        console.log('[BuiltForFuture] Initialized with ' + loopedCards.length + ' looped cards');
        console.log('[BuiltForFuture] CARD_WIDTH=' + CARD_WIDTH + ', CARD_GAP=' + CARD_GAP + ', initialOffset=' + initialOffset);
      }
      // Keep old function name for backwards compatibility
      function setupDeckStack() {
        setupWhyOnlyScrollAnimation();
      }

      // Check for previously submitted user
      function checkPreviousSubmission() {
        try {
          const stored = localStorage.getItem('saa_join_submitted');
          if (stored) {
            const data = JSON.parse(stored);
            // User already submitted - clicking join will show instructions directly
            document.getElementById('btn-join-alliance').addEventListener('click', function(e) {
              e.stopPropagation();
              userNameDisplay.textContent = data.firstName;
              openModal('instructions');
            }, { once: true });
          }
        } catch (e) {}
      }

      // FAQ Toggle Function
      function toggleFaq(btn) {
        const faqItem = btn.closest('.faq-item');
        if (!faqItem) return;

        // Close other open items
        document.querySelectorAll('.faq-item.active').forEach(function(item) {
          if (item !== faqItem) {
            item.classList.remove('active');
          }
        });

        // Toggle current item
        faqItem.classList.toggle('active');
      }

      // Make toggleFaq available globally
      window.toggleFaq = toggleFaq;

      // Lenis Smooth Scroll initialization
      function initLenisSmoothScroll() {
        // Skip if Lenis not available
        if (typeof Lenis === 'undefined') {
          console.log('[SmoothScroll] Lenis not loaded, skipping');
          return;
        }

        // Detect touch-PRIMARY devices (phones/tablets) - NOT laptops with touchscreens
        function checkTouchPrimaryDevice() {
          // Check if primary pointer is coarse (finger) rather than fine (mouse)
          if (window.matchMedia('(pointer: coarse)').matches) {
            return true;
          }
          // Fallback: narrow screen + touch = likely mobile
          var hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          var isNarrowScreen = window.innerWidth < 768;
          return hasTouch && isNarrowScreen;
        }

        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }

        // Skip Lenis on touch-primary devices - use native scroll
        if (checkTouchPrimaryDevice()) {
          console.log('[SmoothScroll] Skipping Lenis - touch-primary device detected');
          return;
        }

        console.log('[SmoothScroll] Initializing Lenis for desktop');

        // Defer Lenis initialization to avoid blocking main thread
        function initLenis() {
          // Initialize Lenis with default settings
          var lenis = new Lenis({
            duration: 1.2,
            easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
            infinite: false,
            lerp: 0.1,
          });

          // Stop current scroll animation on any click
          function handleClick() {
            if (lenis.isScrolling) {
              lenis.stop();
              lenis.start();
            }
          }

          window.addEventListener('pointerdown', handleClick, { capture: true, passive: true });

          // Animation frame loop for Lenis
          var rafId = null;
          function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
          }

          rafId = requestAnimationFrame(raf);
          console.log('[SmoothScroll] Lenis initialized and running');
        }

        // Use requestIdleCallback to defer initialization
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(initLenis, { timeout: 1000 });
        } else {
          setTimeout(initLenis, 50);
        }
      }

      // Wait for DOM and Stream SDK
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          initLenisSmoothScroll();
          init();
          checkPreviousSubmission();
          initStarField();
          // initDataStream(); // Old circles version replaced
          // initBuiltForFutureAnimations(); // Old circles version replaced
        });
      } else {
        initLenisSmoothScroll();
        init();
        checkPreviousSubmission();
        initStarField();
        // initDataStream(); // Old circles version replaced
        // initBuiltForFutureAnimations(); // Old circles version replaced
      }

      // Star Field Animation - Canvas-based, matches linktree template exactly
      // GrayscaleDataStream Animation for BuiltForFuture section
      function initDataStream() {
        const container = document.getElementById('data-stream');
        if (!container) return;

        const isMobile = window.innerWidth < 768;
        const columnCount = isMobile ? 8 : 20;
        const columnWidth = 100 / columnCount;

        // Create columns
        const columnConfigs = [];
        for (let i = 0; i < columnCount; i++) {
          columnConfigs.push({
            x: i * columnWidth,
            speed: 0.8 + (i % 4) * 0.4,
            offset: (i * 17) % 100,
          });
        }

        let time = 0;
        const BASE_SPEED = 0.00028;
        let lastTimestamp = 0;
        let scrollSpeed = 1;
        let lastScrollY = window.scrollY;

        // Handle scroll speed boost
        window.addEventListener('scroll', function() {
          const currentY = window.scrollY;
          const scrollDelta = Math.abs(currentY - lastScrollY);
          lastScrollY = currentY;
          scrollSpeed = 1 + Math.min(scrollDelta * 0.05, 3);
        }, { passive: true });

        // Create column elements
        columnConfigs.forEach((col, i) => {
          const colEl = document.createElement('div');
          colEl.className = 'data-stream-column';
          colEl.style.left = col.x + '%';
          colEl.style.width = columnWidth + '%';
          colEl.dataset.index = i;
          colEl.dataset.speed = col.speed;
          colEl.dataset.offset = col.offset;

          // Create char elements
          const numChars = 22;
          for (let j = 0; j < numChars; j++) {
            const charEl = document.createElement('div');
            charEl.className = 'data-stream-char';
            charEl.dataset.charIndex = j;
            colEl.appendChild(charEl);
          }
          container.appendChild(colEl);
        });

        function getChar(colIndex, charIndex, time) {
          const flipRate = 0.6 + (colIndex % 3) * 0.3;
          const charSeed = Math.floor(time * 15 * flipRate + colIndex * 7 + charIndex * 13);
          return charSeed % 2 === 0 ? '0' : '1';
        }

        function animate(timestamp) {
          const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 16;
          lastTimestamp = timestamp;
          time += BASE_SPEED * deltaTime * scrollSpeed;
          scrollSpeed = Math.max(1, scrollSpeed * 0.95);

          const columns = container.querySelectorAll('.data-stream-column');
          columns.forEach((colEl, i) => {
            const speed = parseFloat(colEl.dataset.speed);
            const offset = parseFloat(colEl.dataset.offset);
            const columnOffset = (time * speed * 60 + offset) % 110;
            const numChars = 22;
            const headPosition = (columnOffset / 5) % numChars;

            const chars = colEl.querySelectorAll('.data-stream-char');
            chars.forEach((charEl, j) => {
              const baseY = j * 5;
              const charY = (baseY + columnOffset) % 110 - 10;
              const distanceFromHead = (j - headPosition + numChars) % numChars;
              const isHead = distanceFromHead === 0;
              const trailBrightness = isHead ? 1 : Math.max(0, 1 - distanceFromHead * 0.08);
              const edgeFade = charY < 12 ? Math.max(0, charY / 12) : charY > 88 ? Math.max(0, (100 - charY) / 12) : 1;

              charEl.style.top = charY + '%';
              charEl.style.color = isHead
                ? 'rgba(180,180,180,' + (0.4 * edgeFade) + ')'
                : 'rgba(120,120,120,' + (trailBrightness * 0.25 * edgeFade) + ')';
              charEl.style.textShadow = isHead
                ? '0 0 6px rgba(150,150,150,' + (0.3 * edgeFade) + ')'
                : '0 0 2px rgba(100,100,100,' + (0.1 * edgeFade) + ')';
              charEl.style.opacity = edgeFade;
              charEl.textContent = getChar(i, j, time);
            });
          });

          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      }

      // Initialize BuiltForFuture circle animations
      function initBuiltForFutureAnimations() {
        const section = document.getElementById('built-for-future');
        if (!section) return;

        const header = section.querySelector('.built-future-header');
        const subline = section.querySelector('.built-future-subline');
        const circles = section.querySelectorAll('.future-circle');
        const texts = section.querySelectorAll('.future-text');
        const line = document.getElementById('future-line');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Animate header
              if (header) {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
              }
              // Animate subline
              if (subline) {
                subline.style.opacity = '0.7';
              }
              // Animate circles - set visible state with glow
              circles.forEach(circle => {
                circle.style.opacity = '1';
                circle.style.transform = 'scale(1)';
                circle.style.boxShadow = '0 0 30px rgba(255,215,0,0.4)';
              });
              // Animate texts
              texts.forEach(text => {
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
              });
              // Animate line
              if (line) {
                line.classList.add('animate');
              }
              observer.disconnect();
            }
          });
        }, { threshold: 0.15 });

        // Set initial hidden states
        if (header) {
          header.style.opacity = '0';
          header.style.transform = 'translateY(20px)';
        }
        if (subline) {
          subline.style.opacity = '0';
        }

        observer.observe(section);
      }

      function initStarField() {
        const canvas = document.getElementById('star-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let lastTime = 0;
        let initialHeight = 0;
        let dimensions = { width: 0, height: 0 };

        function resize(forceRegenerate) {
          const dpr = window.devicePixelRatio || 1;
          const width = window.innerWidth;
          const height = window.innerHeight;

          // Capture initial height to prevent mobile address bar issues
          if (initialHeight === 0) initialHeight = height;
          const stableHeight = Math.max(height, initialHeight);

          dimensions = { width, height: stableHeight };
          canvas.width = width * dpr;
          canvas.height = stableHeight * dpr;
          canvas.style.width = width + 'px';
          canvas.style.height = stableHeight + 'px';
          ctx.scale(dpr, dpr);

          if (forceRegenerate || stars.length === 0) {
            initStars(width, stableHeight);
          }
        }

        function initStars(width, height) {
          stars = [];
          const isMobile = width < 768;
          const count = isMobile ? 115 : 275;
          const speeds = [0.08, 0.15, 0.25]; // 3 parallax layers

          for (let i = 0; i < count; i++) {
            const layer = i % 3;
            stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              size: Math.random() * (layer * 0.4 + 0.6) + 0.3, // 0.3-1.5px
              speed: speeds[layer],
              opacity: Math.random() * 0.3 + 0.25 // 0.25-0.55 (dimmer to match homepage)
            });
          }
        }

        function draw(timestamp) {
          const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0;
          lastTime = timestamp;
          const { width, height } = dimensions;

          ctx.clearRect(0, 0, width, height);

          // Update positions and draw
          if (deltaTime > 0 && deltaTime < 0.1) {
            stars.forEach(function(star) {
              star.y -= star.speed * deltaTime * 60; // Drift upward
              if (star.y < -star.size) {
                star.y = height + star.size;
                star.x = Math.random() * width;
              }
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
              ctx.fill();
            });
          } else {
            // First frame or after tab switch - just draw without moving
            stars.forEach(function(star) {
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
              ctx.fill();
            });
          }

          requestAnimationFrame(draw);
        }

        resize(true);
        window.addEventListener('resize', function() { resize(false); });
        requestAnimationFrame(draw);
      }
    })();
  </script>

</body></html>`;
}


/**
 * Generate the Linktree-style Links page HTML for an agent
 * @param agent - Agent data from KV
 * @param siteUrl - Base URL of the site
 */
export function generateAgentLinksPageHTML(agent, siteUrl = 'https://smartagentalliance.com') {
  // Check if agent page is active
  const isActive = agent.activated ?? agent.is_active ?? false;
  if (!isActive) {
    return null;
  }

  const fullName = `${agent.display_first_name} ${agent.display_last_name}`.trim();
  const title = `${fullName} | Links`;
  const analyticsDomain = 'smartagentalliance.com';

  // Get customization settings with defaults
  const settings = agent.links_settings || {
    accentColor: '#ffd700',
    iconStyle: 'light',
    font: 'synonym',
    bio: ''
  };
  
  const accentColor = settings.accentColor || '#ffd700';
  const iconStyle = settings.iconStyle || 'light';
  const fontChoice = settings.font || 'synonym';
  const bio = settings.bio || '';
  
  // Icon color based on style
  const iconColor = iconStyle === 'light' ? '#ffffff' : '#1a1a1a';
  
  // Convert hex color to RGB for rgba variants
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 215, b: 0 };
  };
  
  const rgb = hexToRgb(accentColor);
  const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  // Curated icon set (matching dashboard)
  const LINK_ICONS = {
    'Home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    'Building': 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
    'MapPin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'Phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    'Mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    'Calendar': 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18',
    'Clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
    'Video': 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
    'Camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'FileText': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    'Download': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    'ExternalLink': 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3',
    'Globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    'User': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'Users': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    'Heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    'Star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'Award': 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
    'TrendingUp': 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
    'DollarSign': 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    'Key': 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    'Search': 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
    'MessageCircle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    'Send': 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
    'Bookmark': 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'
  };

  // Build social links array
  const socialLinks = [];
  if (agent.facebook_url) socialLinks.push({ platform: 'facebook', url: agent.facebook_url, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' });
  if (agent.instagram_url) socialLinks.push({ platform: 'instagram', url: agent.instagram_url, icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' });
  if (agent.twitter_url) socialLinks.push({ platform: 'twitter', url: agent.twitter_url, icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' });
  if (agent.youtube_url) socialLinks.push({ platform: 'youtube', url: agent.youtube_url, icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' });
  if (agent.tiktok_url) socialLinks.push({ platform: 'tiktok', url: agent.tiktok_url, icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' });
  if (agent.linkedin_url) socialLinks.push({ platform: 'linkedin', url: agent.linkedin_url, icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' });

  const socialLinksHTML = socialLinks.map(link => `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link" title="${link.platform}">
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="${link.icon}"/>
      </svg>
    </a>
  `).join('');

  // Phone display
  const phoneHTML = agent.show_phone && agent.phone ? `
    <div class="phone-section">
      <a href="tel:${escapeHTML(agent.phone)}" class="phone-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        ${escapeHTML(agent.phone)}
        ${agent.phone_text_only ? '<span class="text-only">(Text Only)</span>' : ''}
      </a>
    </div>
  ` : '';

  // Profile image
  const profileImageHTML = agent.profile_image_url ? `
    <div class="profile-image-container">
      <img src="${escapeHTML(agent.profile_image_url)}" alt="${escapeHTML(fullName)}" class="profile-image" />
    </div>
  ` : `
    <div class="profile-image-container">
      <div class="profile-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </div>
  `;

  // Bio HTML
  const bioHTML = bio ? `<p class="bio">${escapeHTML(bio)}</p>` : '';

  // Custom links from agent data (with fallback to empty array)
  const customLinks = agent.custom_links || [];

  // Default buttons - always shown
  const attractionPageUrl = `${siteUrl}/${escapeHTML(agent.slug)}/`;

  // Link ordering from settings (default: join-team first, then learn-about, then custom links)
  const linkOrder = agent.links_settings?.linkOrder || ['join-team', 'learn-about'];

  // Function to generate all links HTML in the correct order
  function generateLinksHTML(agent, customLinks, accentColor, iconColor, attractionPageUrl) {
    // Build a map of all links
    const allLinks = {};

    // Default buttons
    allLinks['join-team'] = {
      type: 'default',
      id: 'join-team',
      html: `<button onclick="openJoinModal()" class="link-button primary">Join my Team</button>`
    };
    allLinks['learn-about'] = {
      type: 'default',
      id: 'learn-about',
      html: `<a href="${attractionPageUrl}" class="link-button secondary">Learn About my Team</a>`
    };

    // Custom links
    customLinks.forEach(link => {
      const iconPath = link.icon && LINK_ICONS[link.icon] ? LINK_ICONS[link.icon] : null;
      const iconHTML = iconPath ? `
        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="${iconPath}"/>
        </svg>
      ` : '';
      allLinks[link.id] = {
        type: 'custom',
        id: link.id,
        order: link.order,
        html: `
          <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" class="link-button custom">
            ${iconHTML}
            <span>${escapeHTML(link.label)}</span>
          </a>
        `
      };
    });

    // Build ordered list: first items from linkOrder, then remaining custom links by order
    const orderedIds = [...linkOrder];

    // Add any custom links not in linkOrder, sorted by their order property
    const customLinksSorted = [...customLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
    customLinksSorted.forEach(link => {
      if (!orderedIds.includes(link.id)) {
        orderedIds.push(link.id);
      }
    });

    // Also ensure default buttons are included if not in linkOrder
    if (!orderedIds.includes('join-team')) orderedIds.push('join-team');
    if (!orderedIds.includes('learn-about')) orderedIds.push('learn-about');

    // Generate HTML
    return orderedIds
      .filter(id => allLinks[id])
      .map(id => allLinks[id].html)
      .join('');
  }

  // Font family CSS
  const fontFamily = fontChoice === 'taskor' 
    ? "'Taskor', 'Synonym', system-ui, sans-serif"
    : "'Synonym', system-ui, -apple-system, sans-serif";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="Connect with ${escapeHTML(fullName)} - Real Estate Agent at eXp Realty" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${escapeHTML(title)}" />
  <meta property="og:description" content="Connect with ${escapeHTML(fullName)} - Real Estate Agent at eXp Realty" />
  ${agent.profile_image_url ? `<meta property="og:image" content="${escapeHTML(agent.profile_image_url)}" />` : ''}

  <!-- Fonts -->
  <link rel="preconnect" href="${siteUrl}" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico" />

  <style>
    @font-face {
      font-family: 'Taskor';
      src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2') format('woff2');
      font-display: swap;
      font-weight: 400;
    }
    @font-face {
      font-family: 'Synonym';
      src: url('${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2') format('woff2');
      font-display: swap;
      font-weight: 100 900;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%);
      min-height: 100%;
    }

    body {
      font-family: ${fontFamily};
      background: transparent;
      color: #e5e4dd;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 480px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .profile-image-container {
      width: 120px;
      height: 120px;
      margin-bottom: 1rem;
      position: relative;
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid ${accentColor};
      box-shadow: 0 0 20px rgba(${rgbString}, 0.3);
    }

    .profile-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid ${accentColor};
      background: rgba(${rgbString}, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${accentColor};
    }

    /* Neon Sign H1 Effect - uses agent's accent color */
    h1 {
      font-family: 'Taskor', 'Synonym', system-ui, sans-serif;
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      font-weight: 400;
      letter-spacing: 0em;
      color: ${accentColor};
      line-height: 1.1;
      margin-bottom: 0.5rem;
      /* Enable stylistic set 01 for alternate N, E, M glyphs */
      font-feature-settings: "ss01" 1;
      /* 3D perspective for neon sign depth effect */
      transform: perspective(800px) rotateX(12deg);
      /* Multi-layer text-shadow - uses accent color for glow */
      text-shadow:
        /* WHITE CORE (3) */
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        /* ACCENT COLOR GLOW (4) */
        0 0 0.05em ${accentColor},
        0 0 0.09em rgba(${rgbString}, 0.8),
        0 0 0.13em rgba(${rgbString}, 0.55),
        0 0 0.18em rgba(${rgbString}, 0.35),
        /* METAL BACKING (4) */
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      /* GPU-accelerated depth shadow - uses accent color */
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(${rgbString}, 0.25));
      /* Glow Breathe animation - slow dramatic pulse */
      animation: h1GlowBreathe 4s ease-in-out infinite;
    }

    @keyframes h1GlowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(${rgbString}, 0.25));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(${rgbString}, 0.45));
      }
    }

    .bio {
      font-size: 0.875rem;
      color: #dcdbd5;
      margin-bottom: 1rem;
      opacity: 0.9;
      max-width: 300px;
      line-height: 1.4;
      font-family: ${fontFamily};
    }

    .subtitle {
      font-size: 0.875rem;
      color: #dcdbd5;
      margin-bottom: 1rem;
      opacity: 0.8;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .social-link {
      width: 44px;
      height: 44px;
      background: ${accentColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${iconColor};
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(${rgbString}, 0.4);
    }

    .phone-section {
      margin-bottom: 1.5rem;
    }

    .phone-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #e5e4dd;
      text-decoration: none;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .phone-link:hover {
      background: rgba(${rgbString}, 0.2);
      color: ${accentColor};
    }

    .text-only {
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .links-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .link-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.25rem;
      background: rgba(255, 255, 255, 0.1);
      color: #e5e4dd;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 500;
      font-size: 0.9375rem;
      text-align: center;
      transition: all 0.2s ease;
      border: 1px solid rgba(${rgbString}, 0.2);
      font-family: ${fontFamily};
      cursor: pointer;
    }

    .link-button:hover {
      background: rgba(${rgbString}, 0.15);
      border-color: rgba(${rgbString}, 0.4);
      transform: translateY(-1px);
    }

    .link-button .link-icon {
      flex-shrink: 0;
    }

    .link-button.custom {
      background: ${accentColor};
      color: ${iconColor};
      border: none;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(${rgbString}, 0.3);
    }

    .link-button.custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${rgbString}, 0.4);
    }

    .link-button.primary {
      background: ${accentColor};
      color: ${iconColor};
      border: none;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(${rgbString}, 0.3);
    }

    .link-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(${rgbString}, 0.4);
    }

    .link-button.secondary {
      background: rgba(${rgbString}, 0.1);
      border: 1px solid rgba(${rgbString}, 0.3);
    }

    .link-button.secondary:hover {
      background: rgba(${rgbString}, 0.2);
      border-color: rgba(${rgbString}, 0.5);
    }

    .footer {
      margin-top: auto;
      padding-top: 3rem;
      text-align: center;
    }

    .footer-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: rgba(${rgbString}, 0.6);
      text-decoration: none;
      font-size: 0.75rem;
      transition: all 0.3s ease;
    }

    .footer-logo:hover {
      color: ${accentColor};
      transform: scale(1.05);
    }

    .footer-logo-svg {
      width: 100px;
      height: 38px;
      transition: filter 0.3s ease;
    }

    .footer-logo:hover .footer-logo-svg {
      filter: drop-shadow(0 0 8px rgba(${rgbString}, 0.6));
    }

    .footer-logo-text {
      opacity: 0.7;
      font-size: 0.7rem;
    }

    /* Star Canvas Background - transparent so HTML gradient shows through */
    #star-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      background: transparent;
    }

    /* Modal styles */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal {
      background: rgb(30, 30, 30);
      border: 1px solid rgba(${rgbString}, 0.3);
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #e5e4dd;
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1;
      opacity: 0.6;
    }

    .modal-close:hover {
      opacity: 1;
    }

    .modal h2 {
      font-family: 'Taskor', 'Synonym', sans-serif;
      color: ${accentColor};
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .modal p {
      color: #dcdbd5;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      color: ${accentColor};
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(${rgbString}, 0.3);
      border-radius: 8px;
      color: #e5e4dd;
      font-size: 1rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: ${accentColor};
    }

    .form-group input::placeholder {
      color: rgba(229, 228, 221, 0.4);
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem;
      background: ${accentColor};
      color: ${iconColor};
      border: none;
      border-radius: 8px;
      font-family: 'Taskor', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(${rgbString}, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .success-message {
      text-align: center;
      padding: 1rem;
    }

    .success-message svg {
      color: #4ade80;
      margin-bottom: 1rem;
    }

    .success-message h3 {
      color: ${accentColor};
      margin-bottom: 0.5rem;
    }

    .success-message p {
      margin-bottom: 0;
    }
  </style>
</head>
<body>
  <canvas id="star-canvas"></canvas>

  <div class="container">
    ${profileImageHTML}

    <h1>${escapeHTML(fullName)}</h1>
    ${bioHTML}
    <p class="subtitle">Real Estate Agent @ eXp Realty</p>

    ${socialLinks.length > 0 ? `
    <div class="social-links">
      ${socialLinksHTML}
    </div>
    ` : ''}

    ${phoneHTML}

    <div class="links-section">
      ${generateLinksHTML(agent, customLinks, accentColor, iconColor, attractionPageUrl)}
    </div>

    <footer class="footer">
      <a href="${siteUrl}/" class="footer-logo">
        <svg class="footer-logo-svg" viewBox="0 0 201.96256 75.736626" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: rgba(${rgbString}, 1); stop-opacity: 1" />
              <stop offset="50%" style="stop-color: ${accentColor}; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: rgba(${rgbString}, 0.8); stop-opacity: 1" />
            </linearGradient>
            <linearGradient id="footerLogoHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: #ffffff; stop-opacity: 0.9" />
              <stop offset="40%" style="stop-color: rgba(${rgbString}, 0.9); stop-opacity: 1" />
              <stop offset="100%" style="stop-color: ${accentColor}; stop-opacity: 1" />
            </linearGradient>
          </defs>
          <g transform="translate(-5.5133704,-105.97189)">
            <path fill="url(#footerLogoGradient)" d="M 21.472273,180.56058 C 11.316147,178.12213 1.9355119,166.45773 6.8673475,154.38101 c 0.2284985,-0.55952 1.4152886,-0.30887 8.5218335,-0.25364 6.089186,0.0474 11.528887,-0.54887 11.563021,0.35268 0.12172,3.21493 1.548705,4.66069 2.560443,5.07358 1.092535,0.44586 18.027365,0.14064 18.956531,-0.51505 2.086142,-1.47214 2.326164,-6.74 -0.732868,-6.70809 -1.893125,0.0197 -16.677992,0.18141 -18.724365,-0.11743 -4.043916,-0.59058 -5.591737,-1.59981 -9.49172,-4.13883 -8.077325,-5.25858 -10.5671578,-12.68416 -8.96983,-21.28238 0,0 6.234294,-0.12184 10.651176,-0.37024 4.312501,-0.24253 8.14686,-0.34782 8.671149,0.65635 1.028138,1.96921 2.764824,2.67171 3.10468,3.73011 0.296847,0.92448 1.558671,0.84083 5.661272,0.85056 4.303079,0.01 9.549862,0.24636 14.627167,0.65835 6.271917,0.50893 12.606804,1.04447 18.1587,14.09205 1.256383,2.95263 -0.05146,7.82433 2.707298,0.89052 0.906748,-2.27902 1.363355,-2.02044 15.012644,-2.13873 7.507113,-0.065 13.649301,-0.23577 13.649301,-0.37936 0,-0.1436 -0.28095,-0.89482 -0.62433,-1.66938 -0.34338,-0.77455 -1.02601,-2.31327 -1.51695,-3.41938 -0.49094,-1.10612 -2.062126,-4.92722 -3.491523,-8.49135 -1.429397,-3.56413 -2.857843,-7.08356 -3.174329,-7.82097 -0.316495,-0.7374 -1.226445,-2.94962 -2.022113,-4.91605 -0.795667,-1.96641 -4.043105,-11.29798 -3.693629,-11.88325 0.458064,-0.76712 -0.18677,-0.40385 12.337194,-0.40385 9.84423,0 9.65274,0.24739 9.65274,0.24739 1.2078,1.06083 2.78957,6.78964 3.34621,8.01751 0.55721,1.22913 1.27686,2.83788 1.59864,3.57529 0.60465,1.38564 1.79312,3.9863 4.28898,9.38518 0.79543,1.72061 2.34948,5.13949 3.45345,7.59751 2.67446,5.95472 3.04484,6.75259 5.91254,12.73702 2.46283,5.1395 2.46283,5.1395 3.20091,3.24636 2.23698,-5.73776 1.98186,-5.7611 4.28454,-5.95219 1.54958,-0.1286 24.51316,0.54777 24.82611,0.0215 0,0 -3.59658,-6.2074 -5.83995,-10.49576 -8.26158,-15.79266 -13.92752,-27.26401 -13.81355,-28.2205 0.0424,-0.35537 5.59171,-0.19826 13.73661,-0.17244 11.92585,0.0378 11.19138,0.12582 11.45775,0.44068 0.7756,0.9168 5.56816,10.25269 6.3956,11.61578 0.82745,1.36309 2.32581,3.98669 3.32968,5.83019 1.00389,1.84351 2.17996,3.95518 2.61353,4.69258 0.43356,0.7374 1.35628,2.34629 2.0505,3.5753 0.6942,1.22901 3.48408,6.15623 6.19971,10.94936 2.71564,4.79315 6.57201,11.63091 8.5697,15.19503 1.99772,3.56414 3.98079,6.98302 4.40686,7.59753 1.75557,2.53202 7.19727,12.85738 7.19727,13.65646 0,1.35047 -1.83096,1.53856 -14.97656,1.53856 -15.12194,0 -11.00005,0.41867 -13.10487,-0.35263 -2.71179,-0.99372 -7.4667,-12.35312 -8.24465,-13.49738 -0.5144,-0.75665 -20.11115,-0.50211 -20.85813,0.10747 -0.30114,0.24573 -4.74222,12.87268 -5.21806,13.18149 -0.51253,0.33263 1.56565,0.31373 -13.12083,0.46948 -14.37638,0.15246 -12.92516,-0.20864 -13.7378,-0.46876 -1.39249,-0.44578 -3.05836,-6.3221 -3.28223,-6.8137 -0.2239,-0.4916 -1.69614,-6.08358 -2.6942,-7.30424 -0.46821,-0.57263 -22.000524,-0.10018 -22.427167,0.30027 -0.495999,0.46555 -2.403531,4.97746 -3.536292,7.45088 -3.647579,7.96455 -0.798091,6.48322 -14.189162,6.21687 -7.764148,-0.15444 -10.944164,0.0682 -12.663388,-0.49314 -2.370345,-0.7739 -1.493164,-2.84033 -1.713395,-2.39718 -2.970363,5.97706 -32.338174,3.84174 -36.236923,2.90565 z"/>
            <path fill="url(#footerLogoHighlight)" d="m 33.71314,127.06681 c -0.644922,-0.55276 -1.868417,-1.61286 -2.718877,-2.35578 C 28.5887,122.6096 17.54033,106.32825 20.700077,106.24689 c 18.520277,-0.47684 31.530155,-0.22018 43.622587,-0.0695 12.878883,18.49983 14.110357,21.6067 12.221476,21.31699 -20.587891,-5.5e-4 -41.658407,0.57749 -42.830997,-0.42752 z"/>
          </g>
        </svg>
        <span class="footer-logo-text">Powered by Smart Agent Alliance</span>
      </a>
    </footer>
  </div>

  <!-- Join Team Modal -->
  <div id="joinModal" class="modal-overlay">
    <div class="modal">
      <button class="modal-close" onclick="closeJoinModal()">&times;</button>
      <div id="modalContent">
        <h2>Join my Team</h2>
        <p>Enter your information below and I'll reach out to discuss how we can work together!</p>
        <form id="joinForm" onsubmit="handleJoinSubmit(event)">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required placeholder="Enter your full name" />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email" />
          </div>
          <button type="submit" class="submit-btn" id="submitBtn">Send Request</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Plausible Analytics -->
  <script defer data-domain="${analyticsDomain}" src="https://plausible.saabuildingblocks.com/js/script.js"></script>

  <script>
    const agentSlug = '${escapeHTML(agent.slug)}';
    const agentName = '${escapeHTML(fullName)}';

    // Star Canvas Animation (matches attraction page)
    (function(){
      const canvas = document.getElementById('star-canvas');
      const ctx = canvas.getContext('2d');
      let stars = [];
      let lastTime = 0;
      let initialHeight = 0;
      let dimensions = { width: 0, height: 0 };

      function resize(forceRegenerate) {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Capture initial height to prevent mobile address bar issues
        if (initialHeight === 0) initialHeight = height;
        const stableHeight = Math.max(height, initialHeight);

        dimensions = { width, height: stableHeight };
        canvas.width = width * dpr;
        canvas.height = stableHeight * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = stableHeight + 'px';
        ctx.scale(dpr, dpr);

        if (forceRegenerate || stars.length === 0) {
          initStars(width, stableHeight);
        }
      }

      function initStars(width, height) {
        stars = [];
        const isMobile = width < 768;
        const count = isMobile ? 115 : 275;
        const speeds = [0.08, 0.15, 0.25]; // 3 parallax layers

        for (let i = 0; i < count; i++) {
          const layer = i % 3;
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * (layer * 0.4 + 0.6) + 0.3, // 0.3-1.5px
            speed: speeds[layer],
            opacity: Math.random() * 0.4 + 0.4 // 0.4-0.8
          });
        }
      }

      function draw(timestamp) {
        const deltaTime = lastTime ? (timestamp - lastTime) / 1000 : 0;
        lastTime = timestamp;
        const { width, height } = dimensions;

        ctx.clearRect(0, 0, width, height);

        // Update positions and draw
        if (deltaTime > 0 && deltaTime < 0.1) {
          stars.forEach(star => {
            star.y -= star.speed * deltaTime * 60; // Drift upward
            if (star.y < -star.size) {
              star.y = height + star.size;
              star.x = Math.random() * width;
            }
          });
        }

        stars.forEach(star => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + star.opacity + ')';
          ctx.fill();
        });

        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', function() { resize(false); });
      resize(true);
      requestAnimationFrame(draw);
    })();

    function openJoinModal() {
      document.getElementById('joinModal').classList.add('active');
    }

    function closeJoinModal() {
      document.getElementById('joinModal').classList.remove('active');
    }

    // Close modal on overlay click
    document.getElementById('joinModal').addEventListener('click', function(e) {
      if (e.target === this) closeJoinModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeJoinModal();
    });

    async function handleJoinSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const submitBtn = document.getElementById('submitBtn');
      const name = form.name.value;
      const email = form.email.value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // Send to GoHighLevel via join-team API
        const response = await fetch('/api/join-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || '',
            email,
            sponsorName: agentName,
            source: 'links-page'
          })
        });

        if (response.ok) {
          document.getElementById('modalContent').innerHTML = \`
            <div class="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h3>Request Sent!</h3>
              <p>Thanks for your interest! I'll be in touch soon.</p>
            </div>
          \`;
        } else {
          throw new Error('Failed to submit');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Try Again';
        alert('Something went wrong. Please try again.');
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escape string for use in JavaScript string literals
 */
function escapeJS(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * Main handler for /{slug} routes
 * Handles both attraction pages (/{slug}) and links pages (/{slug}-links)
 */
export async function onRequest(context) {
  const { request, params, env, next } = context;
  const url = new URL(request.url);

  // Get the slug from the URL
  let slug = params.slug;
  let isLinksPage = false;

  console.log(`[agent-page] Request for slug: "${slug}"`);

  // Skip if no slug or it's a static page
  if (!slug || STATIC_SLUGS.has(slug)) {
    console.log(`[agent-page] Skipping - static slug or no slug`);
    return next();
  }

  // Skip file extensions (static assets)
  if (slug.includes('.')) {
    console.log(`[agent-page] Skipping - has file extension`);
    return next();
  }

  // Validate slug format (lowercase letters, numbers, hyphens only)
  const slugPattern = /^[a-z0-9-]+$/;
  if (!slugPattern.test(slug)) {
    console.log(`[agent-page] Skipping - invalid slug format`);
    return next();
  }

  // Check if this is a links page request (slug ends with -links)
  if (slug.endsWith('-links')) {
    isLinksPage = true;
    // Extract the actual agent slug (remove -links suffix)
    slug = slug.slice(0, -6); // Remove "-links" (6 characters)
    console.log(`[agent-page] Links page detected, agent slug: "${slug}"`);
  }

  try {
    // Check if AGENT_PAGES KV is bound
    if (!env.AGENT_PAGES) {
      console.error('[agent-page] AGENT_PAGES KV namespace not bound!');
      return next();
    }

    console.log(`[agent-page] Fetching from KV: "${slug}"`);

    // Fetch agent data from KV
    const agentData = await env.AGENT_PAGES.get(slug, { type: 'json' });

    console.log(`[agent-page] KV result: ${agentData ? 'found' : 'not found'}`);

    if (!agentData) {
      // No agent found - pass through to static Next.js 404 page
      console.log(`[agent-page] No agent found for "${slug}", passing to static 404`);
      return next();
    }

    // Get site URL from request (works on any domain)
    const siteUrl = `${url.protocol}//${url.host}`;

    // Generate the appropriate HTML page based on page type
    // Links pages get the linktree-style page, attraction pages get the full landing page funnel
    const html = isLinksPage
      ? generateAgentLinksPageHTML(agentData, siteUrl)
      : generateAttractionPageHTML(agentData, siteUrl, escapeHTML, escapeJS);

    // If page is not active, pass through to static Next.js 404 page
    if (!html) {
      console.log(`[agent-page] Agent "${slug}" is not active, passing to static 404`);
      return next();
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=3600',
        'X-Robots-Tag': 'index, follow',
        // Allow embedding in iframes from same origin (for agent portal preview)
        'Content-Security-Policy': "frame-ancestors 'self' https://saabuildingblocks.pages.dev https://smartagentalliance.com",
      },
    });
  } catch (error) {
    console.error('Error serving agent page:', error);
    // On error, pass through to static Next.js 404 page
    return next();
  }
}
