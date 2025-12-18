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
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico" />

  <style>
    @font-face {
      font-family: 'Taskor';
      src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2') format('woff2');
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
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico" />

  <style>
    @font-face {
      font-family: 'Taskor';
      src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2') format('woff2');
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
      font-family: ${fontFamily};
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

    /* Neon Sign H1 Effect - Duplicated from main site */
    h1 {
      font-family: 'Taskor', 'Synonym', system-ui, sans-serif;
      font-size: clamp(1.5rem, 4vw, 2rem);
      color: ${accentColor};
      margin-bottom: 0.25rem;
      transform: perspective(800px) rotateX(12deg);
      text-shadow:
        /* WHITE CORE */
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        /* COLOR GLOW */
        0 0 0.07em ${accentColor},
        0 0 0.11em rgba(${rgbString}, 0.9),
        0 0 0.16em rgba(${rgbString}, 0.7),
        0 0 0.22em rgba(${rgbString}, 0.5),
        /* METAL BACKING */
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(${rgbString}, 0.3));
      animation: h1GlowBreathe 4s ease-in-out infinite;
    }

    @keyframes h1GlowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(${rgbString}, 0.3));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.2) drop-shadow(0 0 0.2em rgba(${rgbString}, 0.6));
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
      padding-top: 2rem;
      text-align: center;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: rgba(${rgbString}, 0.6);
      text-decoration: none;
      font-size: 0.8rem;
      transition: color 0.2s ease;
    }

    .footer-logo:hover {
      color: ${accentColor};
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
        radial-gradient(2px 2px at 40px 70px, rgba(${rgbString},0.2), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
        radial-gradient(2px 2px at 160px 120px, rgba(${rgbString},0.15), transparent),
        radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.3), transparent);
      background-size: 250px 200px;
      animation: twinkle 8s ease-in-out infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
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
      font-weight: 600;
      font-size: 1rem;
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
  <div class="stars"></div>

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
        Smart Agent Alliance
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
 * Escape JavaScript string
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
 * Generate a branded 404 page with space theme
 */
function generate404PageHTML(siteUrl = 'https://smartagentalliance.com') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>404 - Lost in Space | Smart Agent Alliance</title>
  <meta name="description" content="This page has been removed or never existed." />
  <meta name="robots" content="noindex, nofollow" />

  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico" />

  <!-- Fonts -->
  <link rel="preconnect" href="${siteUrl}" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2" as="font" type="font/woff2" crossorigin />

  <style>
    @font-face {
      font-family: 'Taskor';
      src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.f70f6d00.woff2') format('woff2');
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
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
    }

    .container {
      max-width: 600px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      font-family: 'Taskor', 'Synonym', system-ui, sans-serif;
      font-size: clamp(6rem, 20vw, 12rem);
      color: #ffd700;
      line-height: 1;
      margin-bottom: 1rem;
      transform: perspective(800px) rotateX(12deg);
      text-shadow:
        /* WHITE CORE */
        0 0 0.01em #fff,
        0 0 0.02em #fff,
        0 0 0.03em rgba(255,255,255,0.8),
        /* COLOR GLOW */
        0 0 0.07em #ffd700,
        0 0 0.11em rgba(255, 215, 0, 0.9),
        0 0 0.16em rgba(255, 215, 0, 0.7),
        0 0 0.22em rgba(255, 215, 0, 0.5),
        /* METAL BACKING */
        0.03em 0.03em 0 #2a2a2a,
        0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f,
        0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3));
      animation: glowBreathe 4s ease-in-out infinite;
    }

    @keyframes glowBreathe {
      0%, 100% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.1em rgba(255, 215, 0, 0.3));
      }
      50% {
        filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1.2) drop-shadow(0 0 0.2em rgba(255, 215, 0, 0.6));
      }
    }

    .message {
      font-size: clamp(1rem, 3vw, 1.25rem);
      color: #dcdbd5;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      max-width: 400px;
      line-height: 1.5;
    }

    .home-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #ffd700 0%, #e6c200 100%);
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }

    .home-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }

    .home-link svg {
      width: 20px;
      height: 20px;
    }

    /* Animated stars background */
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
        radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.3), transparent),
        radial-gradient(1.5px 1.5px at 300px 200px, rgba(255,255,255,0.35), transparent),
        radial-gradient(2px 2px at 380px 150px, rgba(255,215,0,0.18), transparent),
        radial-gradient(1px 1px at 450px 50px, rgba(255,255,255,0.3), transparent);
      background-size: 500px 400px;
      animation: twinkle 8s ease-in-out infinite, drift 60s linear infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }

    @keyframes drift {
      0% { background-position: 0 0; }
      100% { background-position: 500px 400px; }
    }

    /* Floating astronaut/satellite decoration */
    .lost-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: float 6s ease-in-out infinite;
      opacity: 0.6;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(5deg); }
      75% { transform: translateY(10px) rotate(-5deg); }
    }
  </style>
</head>
<body>
  <div class="stars"></div>

  <div class="container">
    <div class="lost-icon">🛸</div>
    <h1>404</h1>
    <p class="message">
      This signal has been lost to the void—either removed from our network or it never existed in this sector of space.
    </p>
    <a href="${siteUrl}/" class="home-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      Return to Base
    </a>
  </div>
</body>
</html>`;
}

/**
 * Generate attraction page by fetching homepage and modifying it
 * This gives the agent page the full homepage design with their image,
 * plus the webinar section, modals, and attraction funnel elements
 */
async function generateAttractionPage(agent, siteUrl, env) {
  const fullName = `${agent.display_first_name} ${agent.display_last_name}`.trim();
  const firstName = agent.display_first_name || 'Agent';

  // Get agent's profile image URL
  const agentImageUrl = agent.profile_image_url ||
    'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop';

  // Fetch the homepage HTML from static assets
  const homepageRequest = new Request(`${siteUrl}/`);
  const homepageResponse = await env.ASSETS.fetch(homepageRequest);

  if (!homepageResponse.ok) {
    return new Response('Failed to load template', { status: 500 });
  }

  let html = await homepageResponse.text();

  // === REMOVE HEADER ===
  // Remove the header element entirely
  html = html.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');

  // === REMOVE FOOTER ===
  // Remove the footer element entirely
  html = html.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

  // === REPLACE PROFILE IMAGE ===
  // Replace the entire hero img tag with agent's image
  // The original has complex srcSet with multiple resolutions - replace with simple img
  html = html.replace(
    /<img[^>]*doug-and-karrie-co-founders[^>]*>/gi,
    `<img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(fullName)} - Smart Agent Alliance" class="hero-profile-img" style="width:100%;height:auto;max-width:400px;border-radius:50%;"/>`
  );

  // Also replace any preload links for the old image
  html = html.replace(
    /<link[^>]*doug-and-karrie-co-founders[^>]*>/gi,
    `<link rel="preload" as="image" href="${escapeHTML(agentImageUrl)}" fetchPriority="high"/>`
  );

  // Replace any remaining references in src attributes
  html = html.replace(
    /src="[^"]*doug-and-karrie-co-founders[^"]*"/g,
    `src="${escapeHTML(agentImageUrl)}"`
  );

  // Replace srcSet attributes that reference the old image
  html = html.replace(
    /srcSet="[^"]*doug-and-karrie-co-founders[^"]*"/g,
    `srcSet="${escapeHTML(agentImageUrl)}"`
  );

  // === UPDATE META TAGS ===
  html = html.replace(
    /<title>Smart Agent Alliance - For Agents Who Want More<\/title>/,
    `<title>Team ${escapeHTML(firstName)} | Smart Agent Alliance</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\/>/,
    `<meta name="description" content="Join ${escapeHTML(fullName)}'s team at eXp Realty. Smart Agent Alliance member helping agents build their real estate careers."/>`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\/>/,
    `<meta property="og:title" content="Team ${escapeHTML(firstName)} | Smart Agent Alliance"/>`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\/>/,
    `<meta property="og:description" content="Join ${escapeHTML(fullName)}'s team at eXp Realty"/>`
  );
  if (agent.profile_image_url) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*"\/>/,
      `<meta property="og:image" content="${escapeHTML(agent.profile_image_url)}"/>`
    );
  }
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\/>/,
    `<meta name="twitter:title" content="Team ${escapeHTML(firstName)} | Smart Agent Alliance"/>`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\/>/,
    `<meta name="twitter:description" content="Join ${escapeHTML(fullName)}'s team at eXp Realty"/>`
  );

  // === ADD TEAM LABEL ABOVE H1 ===
  // Insert "Team [FirstName]" label before the H1
  html = html.replace(
    /(<h1[^>]*id="hero-heading"[^>]*>)/i,
    `<span class="agent-team-label">Team ${escapeHTML(firstName)}</span>$1`
  );

  // === REPLACE CTA BUTTONS ===
  // Replace "JOIN THE ALLIANCE" button with "Join My Team" that opens modal
  html = html.replace(
    /<a[^>]*href="\/join-exp-sponsor-team\/"[^>]*>[\s\S]*?JOIN THE ALLIANCE[\s\S]*?<\/a>/gi,
    `<button class="cta-button-primary" onclick="openJoinModal()">Join My Team</button>`
  );
  // Replace "LEARN MORE" button with "See How It Works" that scrolls to webinar
  html = html.replace(
    /<a[^>]*href="\/exp-realty-sponsor\/"[^>]*>[\s\S]*?LEARN MORE[\s\S]*?<\/a>/gi,
    `<a href="#webinar-section" class="cta-button-secondary">See How It Works</a>`
  );

  // === ADD ATTRACTION PAGE STYLES ===
  const attractionStyles = `
<style>
  /* Team label above H1 */
  .agent-team-label {
    display: block;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #ffd700;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  /* Webinar Section */
  #webinar-section {
    position: relative;
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
    padding: 4rem 1.5rem;
  }
  @media (min-width: 768px) {
    #webinar-section { padding: 6rem 2rem; }
  }
  .webinar-container {
    max-width: 900px;
    margin: 0 auto;
  }
  .webinar-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .webinar-header h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .video-wrapper {
    position: relative;
    padding-top: 56.25%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
    margin-bottom: 2rem;
  }
  .video-wrapper iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    border: none;
  }
  .video-progress-area {
    text-align: center;
  }
  .progress-bar-container {
    width: 100%;
    max-width: 400px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin: 0 auto 1rem;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ffd700, #00ff88);
    border-radius: 4px;
    transition: width 0.3s ease;
    width: 0%;
  }
  .video-status-message {
    font-size: 1rem;
    color: #bfbdb0;
    margin-bottom: 1.5rem;
  }
  .book-call-btn {
    display: none;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
    transition: all 0.3s ease;
  }
  .book-call-btn.visible {
    display: inline-block;
  }
  .book-call-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(255, 215, 0, 0.4);
  }

  /* Modal Styles */
  .attraction-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
  }
  .attraction-modal-overlay.active {
    display: flex;
  }
  .attraction-modal {
    background: rgb(25, 25, 28);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  .attraction-modal.wide {
    max-width: 600px;
  }
  .modal-close-btn {
    position: absolute;
    top: 1rem; right: 1rem;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: background 0.2s;
  }
  .modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .modal-subtitle {
    color: #bfbdb0;
    margin-bottom: 1.5rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  .form-input, .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #ffffff;
    font-size: 1rem;
  }
  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #ffd700;
  }
  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  .form-select option {
    background: rgb(25, 25, 28);
    color: #ffffff;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: #e5e4dd;
  }
  .checkbox-label input {
    width: 16px; height: 16px;
    accent-color: #ffd700;
  }
  .form-submit-btn {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  .form-message {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    display: none;
  }
  .form-message.success {
    display: block;
    background: rgba(0, 255, 136, 0.1);
    color: #00ff88;
  }
  .form-message.error {
    display: block;
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
  }

  /* CTA Button overrides for attraction page */
  .cta-button-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
    transition: all 0.3s ease;
    text-decoration: none;
  }
  .cta-button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(255, 215, 0, 0.4);
  }
  .cta-button-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  .cta-button-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #ffd700;
  }
</style>
</head>`;

  html = html.replace('</head>', attractionStyles);

  // === BUILD WEBINAR SECTION HTML ===
  const webinarSection = `
<!-- WEBINAR SECTION -->
<section id="webinar-section">
  <div class="webinar-container">
    <div class="webinar-header">
      <h2>See How It Works</h2>
    </div>
    <div class="video-wrapper">
      <iframe
        id="attraction-video"
        src="https://customer-2twfsluc6inah5at.cloudflarestream.com/f8c3f1bd9c2db2409ed0e90f60fd4d5b/iframe?poster=https%3A%2F%2Fcustomer-2twfsluc6inah5at.cloudflarestream.com%2Ff8c3f1bd9c2db2409ed0e90f60fd4d5b%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowfullscreen="true"
      ></iframe>
    </div>
    <div class="video-progress-area">
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progress-bar-fill"></div>
      </div>
      <p class="video-status-message" id="video-status-message">
        Finish at least 50% to schedule a call and have any remaining questions answered.
      </p>
      <button class="book-call-btn" id="book-call-btn" onclick="openBookingModal()">
        Book Your Call
      </button>
    </div>
  </div>
</section>
`;

  // === BUILD MODALS HTML ===
  const modalsHtml = `
<!-- JOIN MODAL -->
<div class="attraction-modal-overlay" id="join-modal">
  <div class="attraction-modal">
    <button class="modal-close-btn" onclick="closeJoinModal()" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <h3 class="modal-title">Join Team ${escapeHTML(firstName)}</h3>
    <p class="modal-subtitle">Take the first step towards building your real estate career.</p>
    <form id="join-form" onsubmit="submitJoinForm(event)">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">First Name *</label>
          <input type="text" id="join-fname" class="form-input" required placeholder="John">
        </div>
        <div class="form-group">
          <label class="form-label">Last Name *</label>
          <input type="text" id="join-lname" class="form-input" required placeholder="Smith">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" id="join-email" class="form-input" required placeholder="john@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Country *</label>
        <select id="join-country" class="form-select" required>
          <option value="">Select your country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button type="submit" class="form-submit-btn">Get Started</button>
      <div id="join-form-message" class="form-message"></div>
    </form>
  </div>
</div>

<!-- BOOKING MODAL -->
<div class="attraction-modal-overlay" id="booking-modal">
  <div class="attraction-modal wide">
    <button class="modal-close-btn" onclick="closeBookingModal()" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <h3 class="modal-title">Book Your Call</h3>
    <p class="modal-subtitle">You've seen the vision. Now let's talk.</p>
    <form id="booking-form" onsubmit="submitBookingForm(event)">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">First Name *</label>
          <input type="text" id="book-fname" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name *</label>
          <input type="text" id="book-lname" class="form-input" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" id="book-email" class="form-input" required>
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="tel" id="book-phone" class="form-input" placeholder="+1 (555) 123-4567">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Country *</label>
          <select id="book-country" class="form-select" required onchange="updateStateOptions()">
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">State/Province *</label>
          <select id="book-state" class="form-select" required>
            <option value="">Select state</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Experience Level *</label>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="radio" name="experience" value="0 Closings" required> 0 Closings</label>
          <label class="checkbox-label"><input type="radio" name="experience" value="1-9 Closings"> 1-9 Closings</label>
          <label class="checkbox-label"><input type="radio" name="experience" value="10+ Closings"> 10+ Closings</label>
          <label class="checkbox-label"><input type="radio" name="experience" value="Team Leader"> Team Leader</label>
          <label class="checkbox-label"><input type="radio" name="experience" value="Broker Owner"> Broker Owner</label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Career Plan * (select all that apply)</label>
        <div class="checkbox-group">
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Residential Agent"> Residential Agent</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Commercial Agent"> Commercial Agent</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Referral Agent"> Referral Agent</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="New Construction"> New Construction</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Luxury"> Luxury</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Land & Ranch"> Land & Ranch</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Investing"> Investing</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Part-Time"> Part-Time</label>
          <label class="checkbox-label"><input type="checkbox" name="career_plan" value="Full-Time"> Full-Time</label>
        </div>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" name="terms" required>
          I agree to the terms and consent to be contacted about joining eXp Realty.
        </label>
      </div>
      <button type="submit" class="form-submit-btn">Book Your Call</button>
      <div id="booking-form-message" class="form-message"></div>
    </form>
  </div>
</div>
`;

  // === BUILD SCRIPTS ===
  const attractionScripts = `
<!-- Cloudflare Stream SDK -->
<script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"><\/script>
<script>
  // Agent context
  window.AGENT_DATA = {
    slug: '${escapeJS(agent.slug)}',
    firstName: '${escapeJS(firstName)}',
    fullName: '${escapeJS(fullName)}',
    expEmail: '${escapeJS(agent.exp_email || '')}',
    legalName: '${escapeJS(agent.legal_name || fullName)}'
  };

  // Video progress tracking
  let videoProgress = 0;
  const VIDEO_STORAGE_KEY = 'agent_' + AGENT_DATA.slug + '_video_progress';

  // Load saved progress
  const savedProgress = localStorage.getItem(VIDEO_STORAGE_KEY);
  if (savedProgress) {
    videoProgress = parseFloat(savedProgress);
    updateVideoUI();
  }

  // Initialize Cloudflare Stream player
  document.addEventListener('DOMContentLoaded', function() {
    const videoIframe = document.getElementById('attraction-video');
    if (videoIframe && typeof Stream !== 'undefined') {
      const player = Stream(videoIframe);
      player.addEventListener('timeupdate', function() {
        if (player.duration > 0) {
          const currentProgress = (player.currentTime / player.duration) * 100;
          if (currentProgress > videoProgress) {
            videoProgress = currentProgress;
            localStorage.setItem(VIDEO_STORAGE_KEY, videoProgress.toString());
            updateVideoUI();
          }
        }
      });
    }
  });

  function updateVideoUI() {
    const progressFill = document.getElementById('progress-bar-fill');
    const message = document.getElementById('video-status-message');
    const bookBtn = document.getElementById('book-call-btn');

    if (progressFill) progressFill.style.width = Math.min(videoProgress, 100) + '%';

    if (videoProgress >= 50) {
      if (message) message.textContent = "You've seen the vision. Now let's talk.";
      if (bookBtn) bookBtn.classList.add('visible');
    } else {
      if (message) message.textContent = "Finish at least 50% to schedule a call and have any remaining questions answered.";
      if (bookBtn) bookBtn.classList.remove('visible');
    }
  }

  // Modal functions
  function openJoinModal() {
    document.getElementById('join-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    const savedData = localStorage.getItem('agent_lead_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      document.getElementById('join-fname').value = data.firstName || '';
      document.getElementById('join-lname').value = data.lastName || '';
      document.getElementById('join-email').value = data.email || '';
      document.getElementById('join-country').value = data.country || '';
    }
  }
  function closeJoinModal() {
    document.getElementById('join-modal').classList.remove('active');
    document.body.style.overflow = '';
  }
  function openBookingModal() {
    if (videoProgress < 50) {
      alert('Please watch at least 50% of the video before booking a call.');
      return;
    }
    document.getElementById('booking-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    const savedData = localStorage.getItem('agent_lead_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      document.getElementById('book-fname').value = data.firstName || '';
      document.getElementById('book-lname').value = data.lastName || '';
      document.getElementById('book-email').value = data.email || '';
      document.getElementById('book-country').value = data.country || '';
      updateStateOptions();
    }
  }
  function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modals on escape key or overlay click
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeJoinModal(); closeBookingModal(); }
  });
  document.querySelectorAll('.attraction-modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) { closeJoinModal(); closeBookingModal(); }
    });
  });

  // State/Province options
  const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  const CA_PROVINCES = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan'];

  function updateStateOptions() {
    const country = document.getElementById('book-country').value;
    const stateSelect = document.getElementById('book-state');
    stateSelect.innerHTML = '<option value="">Select state</option>';
    let options = [];
    if (country === 'US') options = US_STATES;
    else if (country === 'CA') options = CA_PROVINCES;
    else options = ['N/A'];
    options.forEach(function(opt) {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      stateSelect.appendChild(option);
    });
  }

  // Form submissions
  function submitJoinForm(e) {
    e.preventDefault();
    const data = {
      firstName: document.getElementById('join-fname').value,
      lastName: document.getElementById('join-lname').value,
      email: document.getElementById('join-email').value,
      country: document.getElementById('join-country').value,
      referringAgent: AGENT_DATA.slug
    };
    localStorage.setItem('agent_lead_data', JSON.stringify(data));
    const msgDiv = document.getElementById('join-form-message');
    msgDiv.textContent = 'Thank you! We will be in touch soon.';
    msgDiv.className = 'form-message success';
    setTimeout(function() {
      closeJoinModal();
      e.target.reset();
      msgDiv.className = 'form-message';
    }, 2000);
  }

  function submitBookingForm(e) {
    e.preventDefault();
    const careerPlanChecks = document.querySelectorAll('input[name="career_plan"]:checked');
    const careerPlan = Array.from(careerPlanChecks).map(function(cb) { return cb.value; });
    const data = {
      firstName: document.getElementById('book-fname').value,
      lastName: document.getElementById('book-lname').value,
      email: document.getElementById('book-email').value,
      phone: document.getElementById('book-phone').value,
      country: document.getElementById('book-country').value,
      state: document.getElementById('book-state').value,
      experience: document.querySelector('input[name="experience"]:checked')?.value,
      careerPlan: careerPlan,
      referringAgent: AGENT_DATA.slug
    };
    localStorage.setItem('agent_lead_data', JSON.stringify(data));
    const msgDiv = document.getElementById('booking-form-message');
    msgDiv.textContent = 'Booking submitted! You will receive a confirmation email shortly.';
    msgDiv.className = 'form-message success';
    setTimeout(function() {
      closeBookingModal();
      e.target.reset();
      msgDiv.className = 'form-message';
    }, 3000);
  }
<\/script>
</body>`;

  // === INJECT WEBINAR SECTION AFTER HERO ===
  // Find the end of the hero section (after the fixed hero wrapper)
  // The hero is inside FixedHeroWrapper, and content sections come after
  // We'll inject after the first </section> inside main
  html = html.replace(
    /(<\/section>\s*)([\s\S]*?<section)/i,
    `$1${webinarSection}$2`
  );

  // === INJECT MODALS BEFORE </body> ===
  html = html.replace('</body>', modalsHtml + attractionScripts);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
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
      // No agent found - show branded 404 page
      const siteUrl = `${url.protocol}//${url.host}`;
      const html404 = generate404PageHTML(siteUrl);
      return new Response(html404, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    // Get site URL from request (works on any domain)
    const siteUrl = `${url.protocol}//${url.host}`;

    // Check if agent page is active
    const isActive = agentData.activated ?? agentData.is_active ?? false;
    if (!isActive) {
      const html404 = generate404PageHTML(siteUrl);
      return new Response(html404, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    // Generate the appropriate HTML page based on page type
    if (isLinksPage) {
      const html = generateAgentLinksPageHTML(agentData, siteUrl);
      if (!html) {
        const html404 = generate404PageHTML(siteUrl);
        return new Response(html404, {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        });
      }
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=3600',
          'X-Robots-Tag': 'index, follow',
        },
      });
    } else {
      // Attraction page - fetch homepage and modify it
      return await generateAttractionPage(agentData, siteUrl, env);
    }
  } catch (error) {
    console.error('Error serving agent page:', error);
    return next();
  }
}
