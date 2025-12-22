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
 * Generate FULL Attraction Landing Page HTML
 * Standalone page with star background, hero, webinar, value stack, social proof, FAQ, etc.
 * This is the main conversion funnel page for recruiting agents.
 */
export function generateAttractionPageHTML(agent, siteUrl = 'https://smartagentalliance.com') {
  const isActive = agent.activated ?? agent.is_active ?? false;
  if (!isActive) return null;

  const fullName = `${agent.display_first_name} ${agent.display_last_name}`.trim();
  const firstName = agent.display_first_name || 'Agent';
  const title = `Team ${firstName} | Smart Agent Alliance`;
  const analyticsDomain = 'smartagentalliance.com';

  // Use agent's profile image - no fallback to Doug & Karrie
  const agentImageUrl = agent.profile_image_url || '';

  // Build social links
  const socialLinks = [];
  if (agent.facebook_url) socialLinks.push({ platform: 'Facebook', url: agent.facebook_url, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' });
  if (agent.instagram_url) socialLinks.push({ platform: 'Instagram', url: agent.instagram_url, icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' });
  if (agent.twitter_url) socialLinks.push({ platform: 'X', url: agent.twitter_url, icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' });
  if (agent.youtube_url) socialLinks.push({ platform: 'YouTube', url: agent.youtube_url, icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' });
  if (agent.tiktok_url) socialLinks.push({ platform: 'TikTok', url: agent.tiktok_url, icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' });
  if (agent.linkedin_url) socialLinks.push({ platform: 'LinkedIn', url: agent.linkedin_url, icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' });

  const socialLinksHTML = socialLinks.map(link => `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" class="social-icon" title="${link.platform}">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="${link.icon}"/></svg>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="Join ${escapeHTML(fullName)}'s team at eXp Realty through Smart Agent Alliance. Discover why agents are choosing the fastest-growing real estate team."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${escapeHTML(title)}"/>
  <meta property="og:description" content="Join Team ${escapeHTML(firstName)} at eXp Realty"/>
  <meta property="og:image" content="${escapeHTML(agentImageUrl)}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${escapeHTML(title)}"/>
  <link rel="icon" href="${siteUrl}/favicon.ico"/>
  <link rel="preconnect" href="${siteUrl}" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/Amulya_Variable-s.6f10ee89.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2" as="font" type="font/woff2" crossorigin/>
  <style>
    /* Font Faces - matching main site */
    @font-face { font-family: 'Taskor'; src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2') format('woff2'); font-display: swap; font-weight: 400; }
    @font-face { font-family: 'Amulya'; src: url('${siteUrl}/_next/static/media/Amulya_Variable-s.6f10ee89.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }
    @font-face { font-family: 'Synonym'; src: url('${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }

    /* CSS Custom Properties - Master Controller values (inlined) */
    :root {
      /* Font Stacks */
      --font-taskor: 'Taskor', serif;
      --font-amulya: 'Amulya', system-ui, sans-serif;
      --font-synonym: 'Synonym', system-ui, sans-serif;

      /* Brand Colors */
      --color-accentGreen: #00ff88;
      --color-brandGold: #ffd700;
      --color-headingText: #e5e4dd;
      --color-bodyText: #bfbdb0;
      --color-darkGray: #191818;
      --color-mediumGray: #404040;
      --color-gold-500: #ffd700;
      --color-gold-600: #e6c200;
      --color-gold-700: #b39700;

      /* Typography - H1 */
      --font-size-h1: clamp(38px, calc(27.82px + 4.07vw), 150px);
      --line-height-h1: 1.1;
      --letter-spacing-h1: 0em;
      --font-weight-h1: 400;
      --font-family-h1: var(--font-taskor), sans-serif;
      --text-color-h1: #ffd700;

      /* Typography - H2 */
      --font-size-h2: clamp(28px, calc(24.00px + 1.60vw), 72px);
      --line-height-h2: 1.1;
      --letter-spacing-h2: -0.01em;
      --font-weight-h2: 700;
      --font-family-h2: var(--font-taskor), sans-serif;
      --text-color-h2: #e5e4dd;

      /* Typography - H3 */
      --font-size-h3: clamp(27px, calc(25.36px + 0.65vw), 45px);
      --line-height-h3: 1.3;
      --letter-spacing-h3: 0em;
      --font-weight-h3: 700;
      --font-family-h3: var(--font-amulya), sans-serif;
      --text-color-h3: #e5e4dd;

      /* Typography - H4 */
      --font-size-h4: clamp(24px, calc(22.55px + 0.58vw), 40px);
      --line-height-h4: 1.3;
      --letter-spacing-h4: 0em;
      --font-weight-h4: 700;
      --font-family-h4: var(--font-amulya), sans-serif;
      --text-color-h4: #e5e4dd;

      /* Typography - H5 */
      --font-size-h5: clamp(22px, calc(20.82px + 0.47vw), 35px);
      --line-height-h5: 1.3;
      --letter-spacing-h5: 0em;
      --font-weight-h5: 700;
      --font-family-h5: var(--font-amulya), sans-serif;
      --text-color-h5: #e5e4dd;

      /* Typography - H6 */
      --font-size-h6: clamp(18px, calc(16.91px + 0.44vw), 30px);
      --line-height-h6: 1.3;
      --letter-spacing-h6: 0em;
      --font-weight-h6: 700;
      --font-family-h6: var(--font-amulya), sans-serif;
      --text-color-h6: #e5e4dd;

      /* Typography - Body */
      --font-size-body: clamp(16px, calc(14.91px + 0.44vw), 28px);
      --line-height-body: 1.4;
      --letter-spacing-body: 0em;
      --font-weight-body: 400;
      --font-family-body: var(--font-synonym), sans-serif;
      --text-color-body: #bfbdb0;

      /* Typography - Tagline */
      --font-size-tagline: clamp(21px, calc(17.45px + 1.42vw), 60px);
      --line-height-tagline: 1.1;
      --letter-spacing-tagline: 0em;
      --font-weight-tagline: 400;
      --font-family-tagline: var(--font-taskor), sans-serif;
      --text-color-tagline: #bfbdb0;

      /* Typography - Button */
      --font-size-button: clamp(16px, calc(14.55px + 0.58vw), 32px);
      --line-height-button: 1.2;
      --letter-spacing-button: 0.05em;
      --font-weight-button: 600;
      --font-family-button: var(--font-taskor), sans-serif;
      --text-color-button: #e5e4dd;

      /* Typography - Caption */
      --font-size-caption: clamp(12px, calc(11.64px + 0.15vw), 16px);
      --line-height-caption: 1.4;
      --letter-spacing-caption: 0em;
      --font-weight-caption: 400;
      --font-family-caption: var(--font-amulya), sans-serif;
      --text-color-caption: #bfbdb0;

      /* Spacing */
      --spacing-container-padding: clamp(16px, calc(10.18px + 2.33vw), 80px);
      --spacing-grid-gap: clamp(16px, calc(14.55px + 0.58vw), 32px);
      --spacing-section-margin: clamp(32px, calc(24.00px + 3.20vw), 120px);
      --grid-min-width: 300px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; scroll-behavior: smooth; }
    body {
      font-family: var(--font-family-body);
      font-size: var(--font-size-body);
      line-height: var(--line-height-body);
      color: var(--text-color-body);
      background: radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(12, 12, 12) 100%);
      background-color: rgb(12, 12, 12);
      overflow-x: hidden;
    }

    /* Typography Classes - matching Master Controller */
    .text-h2 {
      color: var(--text-color-h2);
      font-size: var(--font-size-h2);
      line-height: var(--line-height-h2);
      letter-spacing: var(--letter-spacing-h2);
      font-weight: var(--font-weight-h2);
      font-family: var(--font-family-h2);
    }
    .text-h3 {
      color: var(--text-color-h3);
      font-size: var(--font-size-h3);
      line-height: var(--line-height-h3);
      letter-spacing: var(--letter-spacing-h3);
      font-weight: var(--font-weight-h3);
      font-family: var(--font-family-h3);
    }
    .text-h4 {
      color: var(--text-color-h4);
      font-size: var(--font-size-h4);
      line-height: var(--line-height-h4);
      letter-spacing: var(--letter-spacing-h4);
      font-weight: var(--font-weight-h4);
      font-family: var(--font-family-h4);
    }
    .text-h5 {
      color: var(--text-color-h5);
      font-size: var(--font-size-h5);
      line-height: var(--line-height-h5);
      letter-spacing: var(--letter-spacing-h5);
      font-weight: var(--font-weight-h5);
      font-family: var(--font-family-h5);
    }
    .text-body {
      color: var(--text-color-body);
      font-size: var(--font-size-body);
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-body);
      font-weight: var(--font-weight-body);
      font-family: var(--font-family-body);
    }
    .text-tagline {
      color: var(--text-color-tagline);
      font-size: var(--font-size-tagline);
      line-height: var(--line-height-tagline);
      letter-spacing: var(--letter-spacing-tagline);
      font-weight: var(--font-weight-tagline);
      font-family: var(--font-family-tagline);
    }
    .text-button {
      color: var(--text-color-button);
      font-size: var(--font-size-button);
      line-height: var(--line-height-button);
      letter-spacing: var(--letter-spacing-button);
      font-weight: var(--font-weight-button);
      font-family: var(--font-family-button);
      text-transform: uppercase;
    }
    .text-caption {
      color: var(--text-color-caption);
      font-size: var(--font-size-caption);
      line-height: var(--line-height-caption);
      letter-spacing: var(--letter-spacing-caption);
      font-weight: var(--font-weight-caption);
      font-family: var(--font-family-caption);
    }
    /* Star Background - matching StarBackgroundCanvas.tsx */
    #star-canvas {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100lvh;
      z-index: 0;
      pointer-events: none;
      background-color: transparent;
    }
    @media (min-width: 768px) {
      #star-canvas {
        top: 0;
        bottom: 0;
        height: auto;
      }
    }
    /* Fixed Hero Wrapper - matching FixedHeroWrapper.tsx */
    .fixed-hero-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 0;
      pointer-events: none;
    }
    .fixed-hero-wrapper > * {
      pointer-events: auto;
    }
    .hero-spacer {
      /* Use vh for consistent height - scroll effects use initial viewport height for progress */
      height: 100vh;
    }
    /* Hero Section */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* Center content vertically like home page - animation effects are positioned relative to viewport center */
      justify-content: center;
      padding: 1.5rem;
      text-align: center;
      z-index: 1;
    }
    /* RevealMaskEffect - matching RevealMaskEffect.tsx */
    .reveal-mask-effect {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 0;
      /* Start hidden until JS initializes to prevent flash */
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }
    .reveal-mask-effect.initialized {
      opacity: 1;
    }
    .reveal-glow {
      position: absolute;
      inset: 0;
    }
    /* Effect positioning: 1/3 up from base of profile image
       The profile image is centered in the hero. We need to position the effect
       at the point that is 1/3 of the way up from the bottom of the visible image.
       Account for: centered content, H1 overlap pulling text up, mobile content shift */
    .reveal-border-outer {
      position: absolute;
      width: 80vw;
      height: 80vw;
      max-width: 700px;
      max-height: 700px;
      /* Center of effect at ~40% from top (slightly above center to account for image position) */
      top: 40%;
      left: 50%;
      border: 2px solid rgba(255,215,0,0.25);
      transform-origin: center center;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    .reveal-border-inner {
      position: absolute;
      width: 60vw;
      height: 60vw;
      max-width: 520px;
      max-height: 520px;
      top: 40%;
      left: 50%;
      border: 1px solid rgba(255,215,0,0.18);
      transform-origin: center center;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    /* Small screens: shift effect up more to match content shift */
    @media (max-width: 768px) {
      .reveal-border-outer,
      .reveal-border-inner {
        top: 35%;
      }
    }
    @media (max-width: 480px) {
      .reveal-border-outer,
      .reveal-border-inner {
        top: 32%;
      }
    }
    /* Hero Vignette - dark edge overlay that fades on scroll */
    .hero-vignette {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: calc(100% + 100px);
      background: radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%);
      pointer-events: none;
      z-index: 1;
    }
    /* Hero Content Wrapper - for scroll effects */
    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      max-width: 3000px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      transform-origin: center center;
      /* No padding - let flexbox center naturally for equal spacing above image and below buttons */
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 3000px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding-top: 8%;
    }
    /* Profile Image Container - responsive sizing with aspect ratio to prevent layout shift */
    .profile-wrapper {
      position: relative;
      /* Responsive width: smaller on mobile, larger on desktop */
      width: clamp(280px, 45vw, 700px);
      max-width: 85vw;
      /* Reserve space with aspect ratio to prevent layout shift when image loads */
      aspect-ratio: 1 / 1;
      max-height: 45dvh;
      pointer-events: none;
      z-index: 1;
    }
    /* Large screens: bigger profile image */
    @media (min-width: 1200px) {
      .profile-wrapper {
        width: clamp(500px, 40vw, 800px);
        max-height: 50dvh;
      }
    }
    /* Extra large screens */
    @media (min-width: 1800px) {
      .profile-wrapper {
        width: clamp(600px, 35vw, 900px);
      }
    }
    /* Small screens: smaller profile image */
    @media (max-width: 600px) {
      .profile-wrapper {
        width: clamp(200px, 60vw, 320px);
        max-height: 40dvh;
      }
    }
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center bottom;
      position: relative;
      z-index: 1;
      /* Gradient fade at bottom - matches homepage mask */
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.6) 88%, rgba(0,0,0,0.3) 94%, transparent 100%);
      filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
      /* Hide alt text while image loads - prevents flash of text */
      color: transparent;
      font-size: 0;
    }
    /* Text content wrapper - pulls up to overlap bottom 25% of image */
    /* Uses image-relative margin (not viewport-relative) to maintain proper overlap at all screen sizes */
    /* Formula: min(image_width / 4, max_height * 0.25) - overlap is 25% of image, capped by max-height */
    .hero-text-content {
      width: 100%;
      padding: 0 1rem;
      text-align: center;
      pointer-events: auto;
      z-index: 2;
      position: relative;
      max-width: 3000px;
      /* Pull up to overlap with bottom 25% of image - scales with image size */
      /* Image width: clamp(280px, 45vw, 700px), max-height: 45dvh */
      /* Overlap = min(width/4, 45dvh*0.25) = min(width/4, 11.25dvh) */
      margin-top: calc(min(clamp(280px, 45vw, 700px) / 4, 11.25dvh) * -1);
    }
    @media (min-width: 1200px) {
      /* Large screens: Image width: clamp(500px, 40vw, 800px), max-height: 50dvh */
      /* Overlap = min(width/4, 50dvh*0.25) = min(width/4, 12.5dvh) */
      .hero-text-content {
        margin-top: calc(min(clamp(500px, 40vw, 800px) / 4, 12.5dvh) * -1);
      }
    }
    @media (max-width: 600px) {
      /* Small screens: Image width: clamp(200px, 60vw, 320px), max-height: 40dvh */
      /* Overlap = min(width/4, 40dvh*0.25) + 20px extra on mobile */
      .hero-text-content {
        margin-top: calc((min(clamp(200px, 60vw, 320px) / 4, 10dvh) + 20px) * -1);
      }
    }
    /* H1 Glow Breathe animation - slightly reduced glow */
    @keyframes h1GlowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45));
      }
    }
    /* Screen-reader only - visually hidden but readable by bots/screen readers */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    /* Headline (H1) - slightly reduced glow */
    .headline {
      font-family: var(--font-taskor);
      font-size: clamp(38px, calc(27.82px + 4.07vw), 150px);
      font-weight: 400;
      letter-spacing: 0em;
      color: #ffd700;
      line-height: 1.1;
      /* Enable stylistic set 01 for alternate N, E, M glyphs */
      font-feature-settings: "ss01" 1;
      /* 3D perspective for neon sign depth effect */
      transform: perspective(800px) rotateX(12deg);
      /* Multi-layer text-shadow - slightly reduced glow */
      text-shadow:
        /* WHITE CORE (3) */
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        /* GOLD GLOW (4) - slightly reduced */
        0 0 0.05em #ffd700,
        0 0 0.09em rgba(255, 215, 0, 0.8),
        0 0 0.13em rgba(255, 215, 0, 0.55),
        0 0 0.18em rgba(255, 179, 71, 0.35),
        /* METAL BACKING (4) */
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      /* GPU-accelerated depth shadow - slightly reduced */
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      /* Glow Breathe animation - slow dramatic pulse */
      animation: h1GlowBreathe 4s ease-in-out infinite;
      margin-bottom: 0.5rem;
    }
    /* Tagline - matching Master Controller + Tagline.tsx glow effects */
    .tagline {
      font-family: var(--font-taskor);
      font-size: clamp(21px, calc(17.45px + 1.42vw), 60px);
      color: #bfbdb0;
      line-height: 1.1;
      letter-spacing: 0em;
      margin-bottom: 0.5rem;
      font-weight: 400;
      /* Alt glyphs for N, E, M via font ss01 stylistic set */
      font-feature-settings: "ss01" 1;
      /* 3D perspective matching main site */
      transform: rotateX(15deg);
      /* WHITE CORE glow (3) */
      text-shadow:
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8);
      /* GPU-accelerated glow via filter */
      filter: drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6));
    }
    .hero-body-text {
      font-family: var(--font-synonym), sans-serif;
      font-size: clamp(14px, calc(12px + 0.5vw), 18px);
      color: #bfbdb0;
      opacity: 0.8;
      line-height: 1.5;
      max-width: 600px;
      margin: 0 auto 1.5rem auto;
      text-align: center;
    }
    /* Tagline Counter Suffix - inline "(3700+ Agents)" */
    .tagline-counter-suffix {
      display: inline-flex;
      align-items: baseline;
      gap: 0;
    }
    .counter-numbers-mobile {
      display: inline;
      color: #bfbdb0;
      font-family: var(--font-synonym), monospace;
      font-weight: 300;
      font-size: 1em;
      text-shadow: none;
    }
    .counter-digit {
      display: inline-block;
      width: 0.6em;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    /* Social Icons */
    .social-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2.5rem;
    }
    .social-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e5e4dd;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .social-icon:hover {
      background: rgba(255,215,0,0.2);
      color: #ffd700;
      transform: translateY(-3px);
    }
    .social-icon svg { width: 20px; height: 20px; }
    /* CTA Buttons - using Taskor for button text (matching main site) */
    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--color-gold-500) 0%, var(--color-gold-600) 100%);
      color: #2a2a2a;
      font-family: var(--font-taskor);
      font-weight: 600;
      font-size: clamp(16px, calc(14.55px + 0.58vw), 32px);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(255,215,0,0.3);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(255,215,0,0.4);
    }
    .btn-secondary,
    a.btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: transparent;
      color: #e5e4dd !important;
      font-family: var(--font-taskor);
      font-weight: 600;
      font-size: clamp(16px, calc(14.55px + 0.58vw), 32px);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 50px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .btn-secondary:hover,
    a.btn-secondary:hover {
      border-color: var(--color-gold-500);
      color: var(--color-gold-500) !important;
    }
    /* Sections */
    section {
      position: relative;
      z-index: 1;
      padding: 5rem 1.5rem;
    }
    .section-container { max-width: 1900px; margin: 0 auto; }

    /* Glassmorphism Section Panels - Base */
    .glass-panel {
      background: rgba(20, 20, 20, 0.35);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 24px;
      padding: 3rem 2rem;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    /* Variant: Gold accent border (top glow) */
    .glass-panel--gold {
      border-top: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow:
        0 -4px 20px rgba(255, 215, 0, 0.08),
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 215, 0, 0.1);
    }

    /* Variant: Subtle inner glow */
    .glass-panel--glow {
      background: rgba(25, 25, 25, 0.4);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 0 60px rgba(255, 215, 0, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    /* Variant: Minimal/lighter for contrast */
    .glass-panel--light {
      background: rgba(40, 40, 40, 0.25);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    /* Variant: Bordered with stronger edges */
    .glass-panel--bordered {
      background: rgba(15, 15, 15, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 2px solid rgba(255, 215, 0, 0.2);
    }

    /* Gold Glow Section Divider */
    .section-divider {
      position: relative;
      height: 1px;
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(255, 215, 0, 0.3) 20%,
        rgba(255, 215, 0, 0.6) 50%,
        rgba(255, 215, 0, 0.3) 80%,
        transparent 100%
      );
      box-shadow:
        0 0 10px rgba(255, 215, 0, 0.3),
        0 0 20px rgba(255, 215, 0, 0.2),
        0 0 40px rgba(255, 215, 0, 0.1);
    }
    .section-divider::before {
      content: "";
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      background: #ffd700;
      border-radius: 50%;
      box-shadow:
        0 0 10px #ffd700,
        0 0 20px rgba(255, 215, 0, 0.6);
    }

    /* Scroll Reveal Animation */
    .reveal-section {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .reveal-section.visible {
      opacity: 1;
      transform: translateY(0);
    }
    /* Section Title (H2) - matching H2.tsx from main site */
    .section-title {
      font-family: var(--font-taskor);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 700;
      color: #bfbdb0;
      text-align: center;
      line-height: 1;
      margin-bottom: 3rem;
      display: flex;
      justify-content: center;
      /* Horizontal gap between words, row-gap for wrapped lines */
      /* Row gap of 0 makes metal plates touch between lines */
      gap: 0 0.5em;
      flex-wrap: wrap;
      transform: rotateX(15deg);
      padding-left: 0.35em;
      padding-right: 0.35em;
      /* Alt glyphs for N, E, M via font ss01 stylistic set */
      font-feature-settings: "ss01" 1;
    }
    /* H2 Word wrapper with metal backing plate */
    .h2-word {
      display: inline-block;
      position: relative;
      color: #bfbdb0;
      /* Vertical padding only to account for metal plate */
      padding: 0.2em 0;
      /* White core glow */
      text-shadow:
        0 0 1px #fff,
        0 0 2px #fff,
        0 0 4px rgba(255,255,255,0.8),
        0 0 8px rgba(255,255,255,0.4);
    }
    /* Metal backing plate - 3D brushed gunmetal effect */
    .h2-word::before {
      content: "";
      position: absolute;
      top: 0;
      left: -0.3em;
      right: -0.3em;
      bottom: 0;
      background: linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%);
      border-radius: 0.15em;
      z-index: -1;
      border-top: 2px solid rgba(180,180,180,0.45);
      border-left: 1px solid rgba(130,130,130,0.35);
      border-right: 1px solid rgba(60,60,60,0.6);
      border-bottom: 2px solid rgba(0,0,0,0.7);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 2px rgba(0,0,0,0.25),
        0 4px 8px rgba(0,0,0,0.5),
        0 2px 4px rgba(0,0,0,0.3);
    }
    /* Glossy highlight overlay on metal plate */
    .h2-word::after {
      content: "";
      position: absolute;
      top: 0;
      left: -0.3em;
      right: -0.3em;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 100%);
      border-radius: 0.15em 0.15em 0 0;
      z-index: -1;
      pointer-events: none;
    }
    /* Webinar Section */
    #webinar { background: transparent; }
    .video-container {
      max-width: 900px;
      margin: 0 auto 2rem;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      /* Metal frame styling - matching VideoPlayer component */
      padding: 4px;
      background: linear-gradient(145deg, rgba(80,80,80,0.6) 0%, rgba(40,40,40,0.8) 50%, rgba(60,60,60,0.6) 100%);
      border: 1px solid rgba(150,150,150,0.4);
    }
    .video-wrapper {
      position: relative;
      padding-top: 56.25%;
      background: #1a1a1a;
      cursor: pointer;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }
    .video-wrapper iframe {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      border: none;
      object-fit: cover;
      pointer-events: none; /* Disable iframe click, use overlay instead */
    }
    /* Video Overlay - clickable area for play/pause */
    .video-overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      cursor: pointer;
      background: transparent;
      transition: background 0.2s ease;
    }
    .video-overlay:hover {
      background: rgba(0,0,0,0.15);
    }
    .video-overlay:hover .overlay-play-btn {
      transform: scale(1.1);
    }
    /* Large centered play/pause button overlay */
    .overlay-play-btn {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255,215,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(255,215,0,0.3);
      transition: transform 0.2s ease, opacity 0.2s ease;
      pointer-events: none;
    }
    .overlay-play-btn svg {
      width: 36px;
      height: 36px;
      fill: #1a1a1a;
      margin-left: 4px; /* Optical centering for play triangle */
    }
    .overlay-play-btn.is-playing svg {
      margin-left: 0;
    }
    /* Hide overlay button when playing (show on hover) */
    .video-overlay.is-playing .overlay-play-btn {
      opacity: 0;
    }
    .video-overlay.is-playing:hover .overlay-play-btn {
      opacity: 1;
    }
    /* Scrubber Bar */
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
    .scrubber-container.visible {
      opacity: 1;
    }
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
    /* Custom Video Controls - matching VideoPlayer component */
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
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .control-btn:hover {
      background: rgba(255,215,0,0.2);
      border-color: rgba(255,215,0,0.4);
      color: #ffd700;
    }
    .control-btn:active {
      transform: scale(0.95);
    }
    .control-btn svg {
      width: 18px;
      height: 18px;
    }
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
    .video-time {
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
      background: rgba(255,255,255,0.2);
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
    .volume-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: #ffd700;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    @media (max-width: 600px) {
      .video-controls {
        flex-wrap: wrap;
        gap: 0.4rem;
        padding: 0.5rem;
      }
      .video-time {
        order: 10;
        width: 100%;
        text-align: center;
        margin: 0.25rem 0 0;
      }
      .volume-controls {
        margin-left: 0;
      }
      .volume-slider {
        width: 60px;
      }
    }
    .progress-area { text-align: center; margin-top: 2rem; }
    .progress-bar {
      width: 100%;
      max-width: 400px;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      margin: 0 auto 1rem;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #ffd700, #00ff88);
      border-radius: 3px;
      transition: width 0.3s;
    }
    .progress-text { color: #bfbdb0; margin-bottom: 1.5rem; }
    .book-btn {
      display: none;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--color-gold-500) 0%, var(--color-gold-600) 100%);
      color: #2a2a2a;
      font-family: var(--font-taskor);
      font-weight: 600;
      font-size: clamp(16px, calc(14.55px + 0.58vw), 32px);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(255,215,0,0.3);
    }
    .book-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(255,215,0,0.4);
    }
    .book-btn.visible { display: inline-flex; }
    /* Value Stack */
    #value-stack { background: transparent; }
    .value-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      max-width: 1400px;
      margin: 0 auto;
    }
    .value-grid .value-card {
      flex: 0 1 400px;
      max-width: 500px;
    }
    .value-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }
    .value-card:hover {
      background: rgba(255,215,0,0.05);
      border-color: rgba(255,215,0,0.2);
      transform: translateY(-5px);
    }
    .value-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffd700;
    }
    .value-icon svg { width: 28px; height: 28px; }
    /* Value Title (H3) - using master controller H3 size */
    .value-title {
      font-family: var(--font-amulya);
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      line-height: var(--line-height-h3);
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .value-desc {
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-md);
      color: rgba(255,255,255,0.7);
      line-height: 1.7;
    }
    /* Social Proof (Proven Results) */
    #social-proof { background: transparent; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      text-align: center;
    }
    /* CyberCard - 3D metal plate card */
    .cyber-card {
      perspective: 1000px;
      display: block;
      height: 100%;
    }
    .cyber-card-plate {
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(0);
      background: linear-gradient(180deg, #3d3d3d 0%, #2f2f2f 40%, #252525 100%);
      border-radius: 12px;
      border-top: 2px solid rgba(180,180,180,0.45);
      border-left: 1px solid rgba(130,130,130,0.35);
      border-right: 1px solid rgba(60,60,60,0.6);
      border-bottom: 2px solid rgba(0,0,0,0.7);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 2px rgba(0,0,0,0.25),
        0 6px 16px rgba(0,0,0,0.5),
        0 2px 6px rgba(0,0,0,0.3);
      padding: 1.5rem;
      height: 100%;
    }
    /* Glossy highlight overlay */
    .cyber-card-plate::before {
      content: "";
      position: absolute;
      inset: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, transparent 100%);
      border-radius: 12px 12px 0 0;
      z-index: 1;
      pointer-events: none;
    }
    .cyber-card-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    /* Icon circle */
    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: rgba(255,215,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon svg {
      width: 1.75rem;
      height: 1.75rem;
      stroke: #ffd700;
      fill: none;
      stroke-width: 2;
    }
    /* Stat Numbers - gold with neon glow */
    .stat-number {
      font-family: var(--font-amulya);
      font-size: var(--font-size-h3);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffd700;
      line-height: 1;
      text-shadow:
        0 0 5px rgba(255,215,0,0.6),
        0 0 10px rgba(255,215,0,0.4),
        0 0 20px rgba(255,215,0,0.25);
    }
    .stat-label {
      font-family: var(--font-synonym);
      font-size: var(--font-size-body-md);
      color: #bfbdb0;
      margin-top: 0;
    }
    /* Why eXp */
    #why-exp { background: transparent; }
    .features-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }
    .features-grid .feature-card {
      flex: 0 1 450px;
      max-width: 550px;
    }
    .feature-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: all 0.3s ease;
    }
    .feature-card:hover { border-color: rgba(255,215,0,0.3); }
    .feature-icon {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      background: rgba(255,215,0,0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffd700;
    }
    .feature-icon svg { width: 24px; height: 24px; }
    /* Feature Title (H3) - using master controller H3 size */
    .feature-title {
      font-family: var(--font-amulya);
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      line-height: var(--line-height-h3);
      color: #fff;
      margin-bottom: 0.25rem;
    }
    .feature-desc {
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-sm);
      color: rgba(255,255,255,0.7);
      line-height: 1.75;
    }
    /* FAQ */
    #faq { background: transparent; }
    .faq-list { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
    .faq-item {
      background-color: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.3s;
    }
    .faq-item:hover {
      border-color: rgba(255,215,0,0.3);
    }
    .faq-question {
      width: 100%;
      padding: 1.25rem;
      background: transparent;
      border: none;
      color: #fff;
      font-family: var(--font-amulya);
      font-size: var(--font-size-h3);
      line-height: var(--line-height-h3);
      font-weight: var(--font-weight-h3);
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .faq-question:hover { color: var(--color-gold-500); }
    .faq-icon {
      transition: transform 0.3s ease;
      color: var(--color-gold-500);
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }
    .faq-item.open .faq-icon { transform: rotate(180deg); }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
      padding: 0 1.25rem;
      font-family: var(--font-amulya);
      font-size: var(--font-size-body);
      color: #dcdbd5;
      line-height: 1.7;
    }
    .faq-item.open .faq-answer {
      max-height: 2000px;
      opacity: 1;
      padding: 0 1.25rem 1.5rem 1.25rem;
    }
    /* Final CTA - yellow gradient fading only at top */
    #final-cta {
      text-align: center;
      background: transparent;
      padding: 6rem 1.5rem;
    }
    /* Final Headline - matching .display-lg from main site */
    .final-headline {
      font-family: var(--font-amulya);
      font-size: var(--font-size-display-lg);
      font-weight: 700;
      letter-spacing: -0.015em;
      color: #fff;
      line-height: 1.15;
      margin-bottom: 1rem;
    }
    .final-subtext {
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-lg);
      color: rgba(255,255,255,0.7);
      line-height: 1.65;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .modal-overlay.active { display: flex; }
    .modal {
      background: #151517;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      position: relative;
    }
    .modal.wide { max-width: 600px; }
    .modal-close {
      position: absolute;
      top: 1rem; right: 1rem;
      width: 32px; height: 32px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close:hover { background: rgba(255,255,255,0.2); }
    /* Modal Title - using master controller H3 size */
    .modal-title {
      font-family: var(--font-amulya);
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      letter-spacing: var(--letter-spacing-h3);
      line-height: var(--line-height-h3);
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .modal-subtitle {
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-md);
      color: rgba(255,255,255,0.7);
      margin-bottom: 1.5rem;
    }
    .form-group { margin-bottom: 1rem; }
    .form-label {
      display: block;
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-sm);
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .form-input, .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-amulya);
      font-size: var(--font-size-body-md);
    }
    .form-input:focus, .form-select:focus { outline: none; border-color: var(--color-gold-500); }
    .form-input::placeholder { color: rgba(255,255,255,0.4); }
    .form-select option { background: #151517; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #e5e4dd; font-size: 0.95rem; }
    .checkbox-label input { accent-color: #ffd700; }
    .form-submit {
      width: 100%;
      margin-top: 1.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #ffd700, #e6c200);
      color: #2a2a2a;
      font-family: var(--font-taskor), sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .form-msg { margin-top: 1rem; padding: 0.75rem; border-radius: 8px; text-align: center; display: none; }
    .form-msg.success { display: block; background: rgba(0,255,136,0.1); color: #00ff88; }
    .form-msg.error { display: block; background: rgba(255,68,68,0.1); color: #ff4444; }
    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 1rem; }
      /* Shift hero content up slightly so buttons aren't at the fold */
      .hero-content-wrapper { margin-top: -5vh; }
      /* Reduce section padding on mobile for better video fit */
      .reveal-section { padding: 3rem 0.75rem; }
      .glass-panel { padding: 2rem 1rem; border-radius: 16px; }
      .video-container { border-radius: 8px; margin-bottom: 1.5rem; }
      .form-row { grid-template-columns: 1fr; }
      .cta-row { flex-direction: column; align-items: center; }
      .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
    }
    @media (max-width: 480px) {
      /* Extra small screens - minimal side padding */
      .reveal-section { padding: 2.5rem 0.5rem; }
      .glass-panel { padding: 1.5rem 0.75rem; }
      /* Shift content up more on very small screens */
      .hero-content-wrapper { margin-top: -8vh; }
      /* Make profile image larger to fill more vertical space */
      .profile-wrapper {
        width: clamp(220px, 65vw, 340px);
        max-height: 42dvh;
      }
    }
  </style>
</head>
<body>
  <canvas id="star-canvas"></canvas>

  <!-- FIXED HERO WRAPPER - hero stays fixed, content scrolls over -->
  <div class="fixed-hero-wrapper" id="fixed-hero-wrapper">
    <!-- HERO SECTION -->
    <section class="hero">
      <!-- RevealMaskEffect - Golden glow with rotating borders -->
      <div class="reveal-mask-effect hero-effect-layer" id="reveal-mask-effect">
        <div class="reveal-glow" id="reveal-glow"></div>
        <div class="reveal-border-outer" id="reveal-border-outer"></div>
        <div class="reveal-border-inner" id="reveal-border-inner"></div>
      </div>

      <!-- Hero Vignette - dark edge overlay -->
      <div class="hero-vignette hero-effect-layer" id="hero-vignette"></div>

      <!-- Hero Content Wrapper - for scroll fade/scale effects -->
      <div class="hero-content-wrapper" id="hero-content-wrapper">
        <!-- Profile Image Container - only shown if agent has a profile image -->
        ${agentImageUrl ? `
        <div class="profile-wrapper" id="profile-wrapper">
          <img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(fullName)}" class="profile-img" id="profile-img"/>
        </div>
        ` : ''}

        <!-- Text Content - pulls up to overlap image bottom -->
        <div class="hero-text-content">
          <h1 class="headline">SMART AGENT ALLIANCE</h1>
          <p class="tagline text-tagline">Join ${escapeHTML(firstName)}'s Team <span class="tagline-counter-suffix"><span class="counter-numbers-mobile">(<span class="counter-digit">3</span><span class="counter-digit">7</span><span class="counter-digit">0</span><span class="counter-digit">0</span>+ </span>Agents)</span></p>
          <p class="hero-body-text">Smart Agent Alliance is a sponsor team inside eXp Realty. Elite systems, world-class training, real community — no splits, no fees, no catch.</p>
          <div class="cta-row">
            <button class="btn-primary text-button" onclick="openJoinModal()">Join My Team</button>
            <a href="#webinar" class="btn-secondary text-button">See How It Works</a>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Spacer to maintain scroll height -->
  <div class="hero-spacer" aria-hidden="true"></div>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- VALUE STACK -->
  <section id="value-stack" class="reveal-section">
    <div class="section-container">
      <div class="glass-panel glass-panel--gold">
        <h2 class="section-title"><span class="h2-word">What</span> <span class="h2-word">You</span> <span class="h2-word">Get</span></h2>
        <div class="value-grid">
        <div class="value-card">
          <div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          <h3 class="value-title">World-Class Training</h3>
          <p class="value-desc">Access proven systems and daily coaching calls to accelerate your growth.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <h3 class="value-title">Elite Community</h3>
          <p class="value-desc">Join a network of top-producing agents who lift each other up.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          <h3 class="value-title">Revenue Share</h3>
          <p class="value-desc">Build passive income through eXp's industry-leading compensation model.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
          <h3 class="value-title">Tech & Tools</h3>
          <p class="value-desc">Cutting-edge CRM, marketing tools, and AI-powered systems at your fingertips.</p>
        </div>
        <div class="value-card">
          <div class="value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h3 class="value-title">Stock Awards</h3>
          <p class="value-desc">Earn company stock and become an owner in a publicly traded brokerage.</p>
        </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- SOCIAL PROOF -->
  <section id="social-proof" class="reveal-section">
    <div class="section-container">
      <div class="glass-panel glass-panel--glow">
        <h2 class="section-title"><span class="h2-word">Proven</span> <span class="h2-word">Results</span></h2>
        <div class="stats-grid">
        <div class="cyber-card">
          <div class="cyber-card-plate">
            <div class="cyber-card-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div class="stat-number">370+</div>
              <div class="stat-label">Agents on Our Team</div>
            </div>
          </div>
        </div>
        <div class="cyber-card">
          <div class="cyber-card-plate">
            <div class="cyber-card-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div class="stat-number">98%</div>
              <div class="stat-label">Retention Rate</div>
            </div>
          </div>
        </div>
        <div class="cyber-card">
          <div class="cyber-card-plate">
            <div class="cyber-card-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
              </div>
              <div class="stat-number">#1</div>
              <div class="stat-label">Fastest Growing Team</div>
            </div>
          </div>
        </div>
        <div class="cyber-card">
          <div class="cyber-card-plate">
            <div class="cyber-card-content">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div class="stat-number">$2B+</div>
              <div class="stat-label">In Team Volume</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- WHY EXP -->
  <section id="why-exp" class="reveal-section">
    <div class="section-container">
      <div class="glass-panel glass-panel--light">
        <h2 class="section-title"><span class="h2-word">Why</span> <span class="h2-word">eXp</span> <span class="h2-word">Realty?</span></h2>
        <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
          <div><div class="feature-title">Cloud-Based Brokerage</div><p class="feature-desc">Work from anywhere with no physical office overhead.</p></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
          <div><div class="feature-title">80/20 Commission Split</div><p class="feature-desc">Industry-leading split with $16K cap, then 100%.</p></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
          <div><div class="feature-title">Agent Attraction</div><p class="feature-desc">Earn revenue share by helping others join the team.</p></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <div><div class="feature-title">eXp University</div><p class="feature-desc">80+ hours of live training every week, on demand.</p></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
          <div><div class="feature-title">Healthcare Available</div><p class="feature-desc">Access to health insurance and retirement plans.</p></div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div class="feature-title">Icon Agent Program</div><p class="feature-desc">Get your full cap back when you hit production goals.</p></div>
        </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- FAQ -->
  <section id="faq" class="reveal-section">
    <div class="section-container">
      <div class="glass-panel glass-panel--bordered">
        <h2 class="section-title"><span class="h2-word">Frequently</span> <span class="h2-word">Asked</span> <span class="h2-word">Questions</span></h2>
        <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question">How much does it cost to join eXp Realty?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <div class="faq-answer">There's a small monthly fee and a startup fee, but no franchise fees or desk fees. Most agents find the cost is significantly lower than traditional brokerages.</div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Do I have to recruit to be successful?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <div class="faq-answer">Absolutely not. You can focus 100% on selling real estate. Revenue share is an optional benefit for those who want to build additional income streams.</div>
        </div>
        <div class="faq-item">
          <button class="faq-question">What is the eXp World virtual campus?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <div class="faq-answer">It's a virtual environment where agents can attend training, collaborate, and network. It's like having an office you can access from anywhere.</div>
        </div>
        <div class="faq-item">
          <button class="faq-question">How does revenue share work?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <div class="faq-answer">When agents you've introduced to eXp close deals, you earn a portion of the company's revenue from their transactions. It's passive income that grows over time.</div>
        </div>
        <div class="faq-item">
          <button class="faq-question">Can I keep my current team or assistants?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
          <div class="faq-answer">Yes! eXp supports teams of all sizes. You can bring your existing team members and continue operating as you do now.</div>
        </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- WEBINAR SECTION -->
  <section id="webinar" class="reveal-section">
    <div class="section-container">
      <div class="glass-panel glass-panel--gold">
        <h2 class="section-title"><span class="h2-word">See</span> <span class="h2-word">How</span> <span class="h2-word">It</span> <span class="h2-word">Works</span></h2>
        <div class="video-container">
        <div class="video-wrapper">
          <iframe id="attraction-video"
            src="https://customer-2twfsluc6inah5at.cloudflarestream.com/f8c3f1bd9c2db2409ed0e90f60fd4d5b/iframe?controls=false&poster=https%3A%2F%2Fimagedelivery.net%2FRZBQ4dWu2c_YEpklnDDxFg%2Fexp-realty-smart-agent-alliance-explained%2Fdesktop&letterboxColor=transparent"
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowfullscreen></iframe>
          <!-- Video Overlay - click to play/pause -->
          <div class="video-overlay" id="video-overlay">
            <div class="overlay-play-btn" id="overlay-play-btn">
              <svg id="overlay-play-icon" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg id="overlay-pause-icon" viewBox="0 0 24 24" style="display:none;">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </div>
          </div>
          <!-- Scrubber Bar - appears on hover -->
          <div class="scrubber-container" id="scrubber-container">
            <div class="scrubber-watched" id="scrubber-watched"></div>
            <div class="scrubber-current" id="scrubber-current"></div>
            <div class="scrubber-thumb" id="scrubber-thumb"></div>
          </div>
        </div>
        <!-- Video Controls Bar -->
        <div class="video-controls">
          <!-- Play/Pause Button -->
          <button class="control-btn control-btn--play" id="play-btn" aria-label="Play">
            <svg id="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <svg id="pause-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>

          <!-- Rewind 15s Button -->
          <button class="control-btn" id="rewind-btn" aria-label="Rewind 15 seconds" title="Rewind 15s">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span class="rewind-text">15</span>
          </button>

          <!-- Restart Button -->
          <button class="control-btn" id="restart-btn" aria-label="Restart video" title="Restart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 2v6h6"/>
              <path d="M21 12A9 9 0 0 0 6 5.3L3 8"/>
              <path d="M21 22v-6h-6"/>
              <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
            </svg>
          </button>

          <!-- Time Display -->
          <div class="video-time" id="video-time">0:00 / 0:00</div>

          <!-- Volume Controls -->
          <div class="volume-controls">
            <button class="control-btn" id="mute-btn" aria-label="Mute">
              <svg id="volume-high-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg id="volume-low-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg id="volume-mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>
            <input type="range" min="0" max="1" step="0.1" value="1" class="volume-slider" id="volume-slider" aria-label="Volume">
          </div>
        </div>
      </div>
      <div class="progress-area">
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
        <p class="progress-text" id="progress-text">Watch at least 50% to schedule your strategy call.</p>
        <button class="book-btn" id="book-btn" onclick="openBookingModal()">Book Your Call</button>
        <button class="reset-progress-btn" id="reset-progress-btn" onclick="resetVideoProgress()" style="display:none;margin-top:0.5rem;padding:0.25rem 0.5rem;font-size:0.7rem;background:#333;color:#999;border:1px solid #555;border-radius:4px;cursor:pointer;">Reset Progress (Testing)</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Gold Divider -->
  <div class="section-divider" aria-hidden="true"></div>

  <!-- FINAL CTA -->
  <section id="final-cta" class="reveal-section">
    <div class="glass-panel glass-panel--glow" style="max-width: 800px; margin: 0 auto;">
      <h2 class="final-headline">Ready to Take the Next Step?</h2>
      <p class="final-subtext">Join ${escapeHTML(firstName)} and hundreds of other agents who are building their dream careers at eXp Realty.</p>
      <div class="cta-row" style="justify-content: center;">
        <button class="btn-primary" onclick="openJoinModal()">Join My Team</button>
      </div>
    </div>
  </section>

  <!-- JOIN MODAL -->
  <div class="modal-overlay" id="join-modal" onwheel="event.stopPropagation()">
    <div class="modal" onwheel="event.stopPropagation()">
      <button class="modal-close" onclick="closeJoinModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      <h3 class="modal-title">Join Team ${escapeHTML(firstName)}</h3>
      <p class="modal-subtitle">Take the first step towards building your dream career.</p>
      <form id="join-form" onsubmit="submitJoinForm(event)">
        <div class="form-row">
          <div class="form-group"><label class="form-label">First Name *</label><input type="text" id="join-fname" class="form-input" required></div>
          <div class="form-group"><label class="form-label">Last Name *</label><input type="text" id="join-lname" class="form-input" required></div>
        </div>
        <div class="form-group"><label class="form-label">Email *</label><input type="email" id="join-email" class="form-input" required></div>
        <div class="form-group"><label class="form-label">Country *</label><select id="join-country" class="form-select" required><option value="">Select country</option><option value="US">United States</option><option value="CA">Canada</option><option value="UK">United Kingdom</option><option value="AU">Australia</option><option value="other">Other</option></select></div>
        <button type="submit" class="form-submit">Get Started</button>
        <div id="join-msg" class="form-msg"></div>
      </form>
    </div>
  </div>

  <!-- BOOKING MODAL -->
  <div class="modal-overlay" id="booking-modal" onwheel="event.stopPropagation()">
    <div class="modal wide" onwheel="event.stopPropagation()">
      <button class="modal-close" onclick="closeBookingModal()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      <h3 class="modal-title">Book Your Call</h3>
      <p class="modal-subtitle">Let's discuss how eXp can work for you.</p>
      <form id="booking-form" onsubmit="submitBookingForm(event)">
        <div class="form-row">
          <div class="form-group"><label class="form-label">First Name *</label><input type="text" id="book-fname" class="form-input" required></div>
          <div class="form-group"><label class="form-label">Last Name *</label><input type="text" id="book-lname" class="form-input" required></div>
        </div>
        <div class="form-group"><label class="form-label">Email *</label><input type="email" id="book-email" class="form-input" required></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="tel" id="book-phone" class="form-input"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Country *</label><select id="book-country" class="form-select" required onchange="updateStates()"><option value="">Select</option><option value="US">United States</option><option value="CA">Canada</option><option value="UK">United Kingdom</option><option value="AU">Australia</option><option value="other">Other</option></select></div>
          <div class="form-group"><label class="form-label">State/Province *</label><select id="book-state" class="form-select" required><option value="">Select</option></select></div>
        </div>
        <div class="form-group">
          <label class="form-label">Experience Level *</label>
          <div class="checkbox-group">
            <label class="checkbox-label"><input type="radio" name="exp" value="0 Closings" required> 0 Closings</label>
            <label class="checkbox-label"><input type="radio" name="exp" value="1-9 Closings"> 1-9 Closings</label>
            <label class="checkbox-label"><input type="radio" name="exp" value="10+ Closings"> 10+ Closings</label>
            <label class="checkbox-label"><input type="radio" name="exp" value="Team Leader"> Team Leader</label>
            <label class="checkbox-label"><input type="radio" name="exp" value="Broker Owner"> Broker Owner</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Career Plan * (select all that apply)</label>
          <div class="checkbox-group">
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Residential"> Residential</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Commercial"> Commercial</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Referral"> Referral</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Luxury"> Luxury</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Investing"> Investing</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Part-Time"> Part-Time</label>
            <label class="checkbox-label"><input type="checkbox" name="plan" value="Full-Time"> Full-Time</label>
          </div>
        </div>
        <div class="form-group"><label class="checkbox-label"><input type="checkbox" name="terms" required> I agree to be contacted about joining eXp Realty.</label></div>
        <button type="submit" class="form-submit">Book Your Call</button>
        <div id="booking-msg" class="form-msg"></div>
      </form>
    </div>
  </div>

  <script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"><\/script>
  <script>
    // Star background - matching StarBackgroundCanvas.tsx from main site
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

    // RevealMaskEffect - Golden glow animation (matching RevealMaskEffect.tsx)
    (function() {
      const IDLE_SPEED = 0.000075;
      const SCROLL_BOOST_MAX = 0.0006;
      const SCROLL_BOOST_MULTIPLIER = 0.000024;
      const SCROLL_DECAY = 0.92;
      const INITIAL_MASK_SIZE = 72;
      const INITIAL_PROGRESS = 0.45;

      let time = 0;
      let lastTimestamp = 0;
      let lastScrollY = window.scrollY;
      let scrollBoost = 0;

      const effectContainer = document.getElementById('reveal-mask-effect');
      const glowEl = document.getElementById('reveal-glow');
      const outerEl = document.getElementById('reveal-border-outer');
      const innerEl = document.getElementById('reveal-border-inner');

      // Mark as initialized after first frame to fade in smoothly
      let hasInitialized = false;

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

        const currentSpeed = IDLE_SPEED + scrollBoost;
        time += currentSpeed * deltaTime;
        scrollBoost *= SCROLL_DECAY;

        // Sine waves for organic motion
        const wave1 = Math.sin(time * Math.PI * 2);
        const wave2 = Math.sin(time * Math.PI * 1.3 + 0.5);
        const wave3 = Math.cos(time * Math.PI * 0.7);
        const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
        const progress = time === 0 ? INITIAL_PROGRESS : (0.45 + combinedWave * 0.35);

        const maskSize = time === 0 ? INITIAL_MASK_SIZE : (90 - progress * 40);
        const rotation = time * 90;

        // Update glow - use dynamic center position if available
        if (glowEl) {
          glowEl.style.background = 'radial-gradient(ellipse ' + maskSize + '% ' + (maskSize * 0.7) + '% at 50% 50%, rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%)';
        }

        // Update outer border
        if (outerEl) {
          outerEl.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';
          outerEl.style.borderRadius = (20 + progress * 30) + '%';
        }

        // Update inner border
        if (innerEl) {
          innerEl.style.transform = 'translate(-50%, -50%) rotate(' + (-rotation * 0.5) + 'deg)';
          innerEl.style.borderRadius = Math.max(20, 50 - progress * 30) + '%';
        }

        // Fade in after first frame renders correctly
        if (!hasInitialized && effectContainer) {
          hasInitialized = true;
          effectContainer.classList.add('initialized');
        }

        requestAnimationFrame(animate);
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      requestAnimationFrame(animate);
    })();

    // FixedHeroWrapper - Scroll effects (matching FixedHeroWrapper.tsx)
    (function() {
      const heroSection = document.querySelector('.hero');
      const contentWrapper = document.getElementById('hero-content-wrapper');
      const effectLayer = document.getElementById('reveal-mask-effect');
      const vignetteLayer = document.getElementById('hero-vignette');

      // Use initial viewport height to prevent mobile browser UI changes from affecting scroll progress
      // This ensures fade starts immediately on scroll, not after browser UI fully hides
      const initialViewportHeight = window.innerHeight;

      function handleScroll() {
        if (!heroSection) return;

        const scrollY = window.scrollY;
        // Use initial viewport height for consistent progress calculation
        const progress = Math.min(scrollY / initialViewportHeight, 1);

        const scale = 1 - progress * 0.4; // Scale from 1 to 0.6
        const blur = progress * 8; // Blur from 0 to 8px
        const brightness = 1 - progress; // Dim from 1 to 0
        const opacity = 1 - progress; // Fade from 1 to 0
        const translateY = -progress * 50; // Move up as it shrinks

        // Apply effects to content wrapper
        if (contentWrapper) {
          contentWrapper.style.transform = 'scale(' + scale + ') translateY(' + translateY + 'px)';
          contentWrapper.style.filter = 'blur(' + blur + 'px) brightness(' + brightness + ')';
          contentWrapper.style.opacity = opacity;
        }

        // Fade out effect layer (only fade, no blur/scale)
        if (effectLayer) {
          effectLayer.style.opacity = opacity;
          effectLayer.style.visibility = progress >= 1 ? 'hidden' : 'visible';
        }

        // Fade out vignette layer (only fade, no blur/scale)
        if (vignetteLayer) {
          vignetteLayer.style.opacity = opacity;
          vignetteLayer.style.visibility = progress >= 1 ? 'hidden' : 'visible';
        }

        // Hide section when fully scrolled
        heroSection.style.visibility = progress >= 1 ? 'hidden' : 'visible';
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    })();

    // Scroll Reveal Animation - fade in sections as they enter viewport
    (function() {
      var revealSections = document.querySelectorAll('.reveal-section');

      function checkReveal() {
        var windowHeight = window.innerHeight;
        var revealPoint = 150; // How many pixels from bottom before reveal

        revealSections.forEach(function(section) {
          var sectionTop = section.getBoundingClientRect().top;

          if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('visible');
          }
        });
      }

      window.addEventListener('scroll', checkReveal, { passive: true });
      checkReveal(); // Initial check
    })();

    // Counter Animation - Scramble effect (matching CounterAnimation.tsx)
    (function() {
      var animationRef = null;

      function findDigitElements() {
        var suffix = document.querySelector('.tagline-counter-suffix');
        if (suffix) {
          var counterEl = suffix.querySelector('.counter-numbers-mobile');
          if (counterEl) {
            var digits = counterEl.querySelectorAll('.counter-digit');
            if (digits.length === 4) return digits;
          }
        }
        return null;
      }

      function animateScramble() {
        var digitElements = findDigitElements();
        if (!digitElements) return;

        var target = 3700;
        var duration = 2000; // 2 seconds
        var startTime = performance.now();

        if (animationRef) {
          cancelAnimationFrame(animationRef);
        }

        function animate(currentTime) {
          var elapsed = currentTime - startTime;
          var progress = Math.min(elapsed / duration, 1);

          if (progress >= 1) {
            // End animation - show final value
            digitElements[0].textContent = '3';
            digitElements[1].textContent = '7';
            digitElements[2].textContent = '0';
            digitElements[3].textContent = '0';
            animationRef = null;
          } else {
            // Scramble effect - show random numbers that gradually approach target
            var currentValue = Math.floor(target * progress);
            var scrambleIntensity = 1 - progress;

            var numStr = currentValue.toString();
            while (numStr.length < 4) numStr = '0' + numStr;
            var digits = numStr.split('');

            for (var i = 0; i < digits.length; i++) {
              if (Math.random() < scrambleIntensity * 0.3) {
                // First digit stays 3 to keep 3xxx range
                if (i === 0) {
                  digitElements[i].textContent = '3';
                } else {
                  // Use 2-9 to avoid "1" width changes
                  digitElements[i].textContent = (Math.floor(Math.random() * 8) + 2).toString();
                }
              } else {
                digitElements[i].textContent = digits[i];
              }
            }

            animationRef = requestAnimationFrame(animate);
          }
        }

        animationRef = requestAnimationFrame(animate);
      }

      // Start animation after a short delay, then loop every 5 seconds
      setTimeout(function() {
        animateScramble();
        setInterval(animateScramble, 5000);
      }, 500);
    })();

    // Agent data
    const AGENT = { slug: '${escapeJS(agent.slug)}', firstName: '${escapeJS(firstName)}' };

    // Video progress tracking with custom controls
    // maxWatchedTime = furthest point user has legitimately watched to (in seconds)
    // videoProgress = percentage for UI display

    // Check for ?reset=1 URL parameter to clear progress (for testing)
    if (new URLSearchParams(window.location.search).get('reset') === '1') {
      localStorage.removeItem('agent_' + AGENT.slug + '_maxTime');
      localStorage.removeItem('agent_' + AGENT.slug + '_progress');
      // Remove the parameter from URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }

    let maxWatchedTime = parseFloat(localStorage.getItem('agent_' + AGENT.slug + '_maxTime') || '0');
    let videoProgress = parseFloat(localStorage.getItem('agent_' + AGENT.slug + '_progress') || '0');
    let savedPosition = parseFloat(localStorage.getItem('agent_' + AGENT.slug + '_position') || '0');
    let isPlaying = false;
    let player = null;
    updateProgressUI();

    // Format time as M:SS or H:MM:SS
    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return '0:00';
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      if (h > 0) {
        return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }
      return m + ':' + String(s).padStart(2, '0');
    }

    // Update time display
    function updateTimeDisplay() {
      if (!player) return;
      const current = player.currentTime || 0;
      const duration = player.duration || 0;
      const timeEl = document.getElementById('video-time');
      if (timeEl) {
        timeEl.textContent = formatTime(current) + ' / ' + formatTime(duration);
      }
    }

    // Update play/pause button state (both controls bar and overlay)
    function updatePlayButton() {
      const playIcon = document.getElementById('play-icon');
      const pauseIcon = document.getElementById('pause-icon');
      const overlayPlayIcon = document.getElementById('overlay-play-icon');
      const overlayPauseIcon = document.getElementById('overlay-pause-icon');
      const videoOverlay = document.getElementById('video-overlay');
      const overlayBtn = document.getElementById('overlay-play-btn');

      if (isPlaying) {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        // Update overlay
        if (overlayPlayIcon) overlayPlayIcon.style.display = 'none';
        if (overlayPauseIcon) overlayPauseIcon.style.display = 'block';
        if (videoOverlay) videoOverlay.classList.add('is-playing');
        if (overlayBtn) overlayBtn.classList.add('is-playing');
      } else {
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        // Update overlay
        if (overlayPlayIcon) overlayPlayIcon.style.display = 'block';
        if (overlayPauseIcon) overlayPauseIcon.style.display = 'none';
        if (videoOverlay) videoOverlay.classList.remove('is-playing');
        if (overlayBtn) overlayBtn.classList.remove('is-playing');
      }
    }

    // Update volume icon based on volume level
    function updateVolumeIcon() {
      const volumeHighIcon = document.getElementById('volume-high-icon');
      const volumeLowIcon = document.getElementById('volume-low-icon');
      const volumeMuteIcon = document.getElementById('volume-mute-icon');
      const volumeSlider = document.getElementById('volume-slider');

      if (!volumeHighIcon || !volumeLowIcon || !volumeMuteIcon) return;

      const vol = player ? player.volume : 1;
      const muted = player ? player.muted : false;

      volumeHighIcon.style.display = 'none';
      volumeLowIcon.style.display = 'none';
      volumeMuteIcon.style.display = 'none';

      if (muted || vol === 0) {
        volumeMuteIcon.style.display = 'block';
        if (volumeSlider) volumeSlider.value = 0;
      } else if (vol < 0.5) {
        volumeLowIcon.style.display = 'block';
        if (volumeSlider) volumeSlider.value = vol;
      } else {
        volumeHighIcon.style.display = 'block';
        if (volumeSlider) volumeSlider.value = vol;
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      const iframe = document.getElementById('attraction-video');
      const playBtn = document.getElementById('play-btn');
      const rewindBtn = document.getElementById('rewind-btn');
      const restartBtn = document.getElementById('restart-btn');

      if (iframe && typeof Stream !== 'undefined') {
        player = Stream(iframe);

        // Play/Pause button
        playBtn.addEventListener('click', function() {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        });

        // Restart button - go back to beginning
        restartBtn.addEventListener('click', function() {
          player.currentTime = 0;
          updateTimeDisplay();
        });

        // Rewind button - go back 15 seconds (but not before 0)
        rewindBtn.addEventListener('click', function() {
          const newTime = Math.max(0, player.currentTime - 15);
          player.currentTime = newTime;
        });

        // Volume controls
        const muteBtn = document.getElementById('mute-btn');
        const volumeSlider = document.getElementById('volume-slider');

        if (muteBtn) {
          muteBtn.addEventListener('click', function() {
            player.muted = !player.muted;
            updateVolumeIcon();
          });
        }

        if (volumeSlider) {
          volumeSlider.addEventListener('input', function() {
            player.volume = parseFloat(this.value);
            player.muted = this.value === '0';
            updateVolumeIcon();
          });
        }

        // Listen for volume changes from player
        player.addEventListener('volumechange', function() {
          updateVolumeIcon();
        });

        // Click on video overlay to play/pause
        const videoOverlay = document.getElementById('video-overlay');
        if (videoOverlay) {
          videoOverlay.addEventListener('click', function() {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          });
        }

        // Scrubber functionality
        const videoWrapper = document.querySelector('.video-wrapper');
        const scrubberContainer = document.getElementById('scrubber-container');
        const scrubberWatched = document.getElementById('scrubber-watched');
        const scrubberCurrent = document.getElementById('scrubber-current');
        const scrubberThumb = document.getElementById('scrubber-thumb');
        let isDragging = false;

        function updateScrubberUI() {
          if (!player || player.duration <= 0) return;
          const watchedPct = (maxWatchedTime / player.duration) * 100;
          const currentPct = (player.currentTime / player.duration) * 100;
          if (scrubberWatched) scrubberWatched.style.width = watchedPct + '%';
          if (scrubberCurrent) scrubberCurrent.style.width = currentPct + '%';
          if (scrubberThumb) scrubberThumb.style.left = currentPct + '%';
        }

        function calculateTimeFromPosition(clientX) {
          if (!scrubberContainer || !player || player.duration <= 0) return 0;
          const rect = scrubberContainer.getBoundingClientRect();
          const x = clientX - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          // Calculate time based on full duration, but clamp to maxWatchedTime (can't skip past what you've watched)
          const requestedTime = percentage * player.duration;
          return Math.min(requestedTime, maxWatchedTime);
        }

        if (videoWrapper && scrubberContainer) {
          videoWrapper.addEventListener('mouseenter', function() {
            scrubberContainer.classList.add('visible');
          });
          videoWrapper.addEventListener('mouseleave', function() {
            if (!isDragging) {
              scrubberContainer.classList.remove('visible');
            }
          });

          scrubberContainer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            const newTime = calculateTimeFromPosition(e.clientX);
            player.currentTime = newTime;
            updateScrubberUI();
          });

          window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const newTime = calculateTimeFromPosition(e.clientX);
            player.currentTime = newTime;
            updateScrubberUI();
          });

          window.addEventListener('mouseup', function() {
            if (isDragging) {
              isDragging = false;
              // Hide scrubber if mouse is not over video
              const rect = videoWrapper.getBoundingClientRect();
              if (event.clientX < rect.left || event.clientX > rect.right ||
                  event.clientY < rect.top || event.clientY > rect.bottom) {
                scrubberContainer.classList.remove('visible');
              }
            }
          });
        }

        // Track play state
        player.addEventListener('play', function() {
          isPlaying = true;
          updatePlayButton();
        });

        player.addEventListener('pause', function() {
          isPlaying = false;
          updatePlayButton();
        });

        player.addEventListener('ended', function() {
          isPlaying = false;
          updatePlayButton();
        });

        // Track progress and update time display
        player.addEventListener('timeupdate', function() {
          updateTimeDisplay();
          updateScrubberUI();

          // Save current position for resume on refresh/return
          localStorage.setItem('agent_' + AGENT.slug + '_position', player.currentTime.toString());

          if (player.duration > 0) {
            // Update max watched time (only increases, never decreases)
            if (player.currentTime > maxWatchedTime) {
              maxWatchedTime = player.currentTime;
              localStorage.setItem('agent_' + AGENT.slug + '_maxTime', maxWatchedTime.toString());
            }

            // Update progress percentage
            const pct = (maxWatchedTime / player.duration) * 100;
            if (pct > videoProgress) {
              videoProgress = pct;
              localStorage.setItem('agent_' + AGENT.slug + '_progress', videoProgress.toString());
              updateProgressUI();
            }
          }
        });

        // Update duration when loaded and restore saved position
        player.addEventListener('loadedmetadata', function() {
          updateTimeDisplay();
          // Restore saved position when video loads
          if (savedPosition > 0 && player.duration > 0) {
            const targetTime = Math.min(savedPosition, player.duration - 1);
            if (targetTime > 0) {
              player.currentTime = targetTime;
            }
          }
        });
      }
    });

    function updateProgressUI() {
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      const bookBtn = document.getElementById('book-btn');

      if (progressFill) {
        progressFill.style.width = Math.min(videoProgress, 100) + '%';
      }
      if (videoProgress >= 50) {
        if (progressText) progressText.textContent = "You're ready! Book your strategy call now.";
        if (bookBtn) bookBtn.classList.add('visible');
      } else {
        if (progressText) progressText.textContent = "Watch at least 50% to schedule your strategy call.";
        if (bookBtn) bookBtn.classList.remove('visible');
      }
    }

    // Reset video progress (for testing)
    function resetVideoProgress() {
      localStorage.removeItem('agent_' + AGENT.slug + '_maxTime');
      localStorage.removeItem('agent_' + AGENT.slug + '_progress');
      localStorage.removeItem('agent_' + AGENT.slug + '_position');
      maxWatchedTime = 0;
      videoProgress = 0;
      savedPosition = 0;
      updateProgressUI();
      updateTimeDisplay();
      // Also reset the video player position
      if (player) {
        player.currentTime = 0;
      }
      alert('Progress reset! Refresh the page to start fresh.');
    }

    // Triple-click on progress bar to reveal reset button (for testing)
    (function() {
      let clickCount = 0;
      let clickTimer = null;
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.addEventListener('click', function() {
          clickCount++;
          if (clickTimer) clearTimeout(clickTimer);
          clickTimer = setTimeout(function() { clickCount = 0; }, 500);
          if (clickCount >= 3) {
            const resetBtn = document.getElementById('reset-progress-btn');
            if (resetBtn) resetBtn.style.display = 'inline-block';
            clickCount = 0;
          }
        });
      }
    })();

    // Modals
    function openJoinModal() {
      document.getElementById('join-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
      prefillForm();
    }
    function closeJoinModal() {
      document.getElementById('join-modal').classList.remove('active');
      document.body.style.overflow = '';
    }
    function openBookingModal() {
      if (videoProgress < 50) { alert('Please watch at least 50% of the video first.'); return; }
      document.getElementById('booking-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
      prefillForm();
      updateStates();
    }
    function closeBookingModal() {
      document.getElementById('booking-modal').classList.remove('active');
      document.body.style.overflow = '';
    }

    function prefillForm() {
      const data = JSON.parse(localStorage.getItem('agent_lead_' + AGENT.slug) || '{}');
      ['fname', 'lname', 'email', 'country'].forEach(f => {
        const el = document.getElementById('join-' + f);
        if (el && data[f]) el.value = data[f];
        const el2 = document.getElementById('book-' + f);
        if (el2 && data[f]) el2.value = data[f];
      });
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeJoinModal(); closeBookingModal(); }});
    document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) { closeJoinModal(); closeBookingModal(); }}));

    // States
    const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    const CA_PROV = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland','Nova Scotia','Ontario','PEI','Quebec','Saskatchewan'];
    function updateStates() {
      const country = document.getElementById('book-country').value;
      const sel = document.getElementById('book-state');
      sel.innerHTML = '<option value="">Select</option>';
      const opts = country === 'US' ? US_STATES : country === 'CA' ? CA_PROV : ['N/A'];
      opts.forEach(o => { const opt = document.createElement('option'); opt.value = o; opt.textContent = o; sel.appendChild(opt); });
    }

    // Form submissions
    function submitJoinForm(e) {
      e.preventDefault();
      const data = { fname: document.getElementById('join-fname').value, lname: document.getElementById('join-lname').value, email: document.getElementById('join-email').value, country: document.getElementById('join-country').value, agent: AGENT.slug };
      localStorage.setItem('agent_lead_' + AGENT.slug, JSON.stringify(data));
      document.getElementById('join-msg').className = 'form-msg success';
      document.getElementById('join-msg').textContent = 'Thank you! We will be in touch soon.';
      setTimeout(() => { closeJoinModal(); e.target.reset(); document.getElementById('join-msg').className = 'form-msg'; }, 2000);
    }
    function submitBookingForm(e) {
      e.preventDefault();
      const plans = Array.from(document.querySelectorAll('input[name="plan"]:checked')).map(c => c.value);
      const data = { fname: document.getElementById('book-fname').value, lname: document.getElementById('book-lname').value, email: document.getElementById('book-email').value, phone: document.getElementById('book-phone').value, country: document.getElementById('book-country').value, state: document.getElementById('book-state').value, exp: document.querySelector('input[name="exp"]:checked')?.value, plans: plans, agent: AGENT.slug };
      localStorage.setItem('agent_lead_' + AGENT.slug, JSON.stringify(data));
      document.getElementById('booking-msg').className = 'form-msg success';
      document.getElementById('booking-msg').textContent = 'Booking submitted! We will send you confirmation shortly.';
      setTimeout(() => { closeBookingModal(); e.target.reset(); document.getElementById('booking-msg').className = 'form-msg'; }, 3000);
    }

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });

    // Lenis Smooth Scroll - Desktop only (matching SmoothScroll.tsx)
    (function() {
      // Skip on mobile/touch devices for native scroll performance
      var hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      var isNarrowScreen = window.innerWidth < 768;
      if (hasTouchScreen && isNarrowScreen) return;

      // Disable browser's automatic scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      // Load Lenis from CDN
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';
      script.onload = function() {
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
          lerp: 0.1
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      };
      document.head.appendChild(script);
    })();
  <\/script>
  <script defer data-domain="${analyticsDomain}" src="https://plausible.saabuildingblocks.com/js/script.js"><\/script>
</body>
</html>`;
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
  // Sort by order if available
  const sortedLinks = [...customLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  const customLinksHTML = sortedLinks.map(link => {
    const iconPath = link.icon && LINK_ICONS[link.icon] ? LINK_ICONS[link.icon] : null;
    const iconHTML = iconPath ? `
      <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <path d="${iconPath}"/>
      </svg>
    ` : '';
    return `
    <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" class="link-button custom">
      ${iconHTML}
      <span>${escapeHTML(link.label)}</span>
    </a>
  `;
  }).join('');

  // Default buttons - always shown
  const attractionPageUrl = `${siteUrl}/${escapeHTML(agent.slug)}/`;

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

    /* Neon Sign H1 Effect - slightly reduced glow for linktree */
    h1 {
      font-family: 'Taskor', 'Synonym', system-ui, sans-serif;
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      font-weight: 400;
      letter-spacing: 0em;
      color: #ffd700;
      line-height: 1.1;
      margin-bottom: 0.5rem;
      /* Enable stylistic set 01 for alternate N, E, M glyphs */
      font-feature-settings: "ss01" 1;
      /* 3D perspective for neon sign depth effect */
      transform: perspective(800px) rotateX(12deg);
      /* Multi-layer text-shadow - slightly reduced glow */
      text-shadow:
        /* WHITE CORE (3) */
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        /* GOLD GLOW (4) - slightly reduced */
        0 0 0.05em #ffd700,
        0 0 0.09em rgba(255, 215, 0, 0.8),
        0 0 0.13em rgba(255, 215, 0, 0.55),
        0 0 0.18em rgba(255, 179, 71, 0.35),
        /* METAL BACKING (4) */
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      /* GPU-accelerated depth shadow - slightly reduced */
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      /* Glow Breathe animation - slow dramatic pulse */
      animation: h1GlowBreathe 4s ease-in-out infinite;
    }

    @keyframes h1GlowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(255, 215, 0, 0.25));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.15) drop-shadow(0 0 0.15em rgba(255, 215, 0, 0.45));
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
      <!-- Default buttons -->
      <button onclick="openJoinModal()" class="link-button primary">
        Join My Team at eXp Realty
      </button>
      <a href="${attractionPageUrl}" class="link-button secondary">
        Learn About Smart Agent Alliance
      </a>

      <!-- Custom links -->
      ${customLinksHTML}
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
        <h2>Join My Team at eXp Realty</h2>
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
        // Send to GoHighLevel webhook (to be configured)
        const response = await fetch('https://saabuildingblocks.com/api/join-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            sponsorSlug: agentSlug,
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
      : generateAttractionPageHTML(agentData, siteUrl);

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
