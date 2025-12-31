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
export function generateAttractionPageHTML(agent, siteUrl = 'https://smartagentalliance.com', escapeHTML, escapeJS) {
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
  const agentTagline = `Join ${displayName}'s Team (3700+ Agents)`;

  // Cloudflare Images CDN
  const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

  // Media logos for the scrolling section
  const MEDIA_LOGOS = [
    { id: 'wsj-logo', alt: 'The Wall Street Journal' },
    { id: 'cnbc-logo', alt: 'CNBC' },
    { id: 'fox-business-logo', alt: 'Fox Business' },
    { id: 'bloomberg-logo', alt: 'Bloomberg' },
    { id: 'yahoo-finance-logo', alt: 'Yahoo Finance' },
    { id: 'forbes-logo', alt: 'Forbes' },
    { id: 'business-insider-logo', alt: 'Business Insider' },
    { id: 'market-watch-logo', alt: 'MarketWatch' },
    { id: 'reuters-logo', alt: 'Reuters' },
    { id: 'usa-today-logo', alt: 'USA Today' },
    { id: 'la-times-logo', alt: 'Los Angeles Times' },
    { id: 'washington-post-logo', alt: 'The Washington Post' },
    { id: 'nasdaq-logo', alt: 'Nasdaq' },
    { id: 'barrons-logo', alt: "Barron's" },
    { id: 'new-york-post-logo', alt: 'New York Post' },
  ];

  const mediaLogosHTML = [...MEDIA_LOGOS, ...MEDIA_LOGOS].map((logo, index) => `
    <div class="logo-item" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; height: clamp(80px, 6vw, 56px); min-width: clamp(180px, 15vw, 200px);">
      <img src="${CLOUDFLARE_BASE}/${logo.id}/public" alt="${escapeHTML(logo.alt)}" loading="eager" style="height: 100%; width: auto; object-fit: contain; max-width: clamp(200px, 18vw, 240px); opacity: 0.9;" />
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>${escapeHTML(title)}</title>
  <meta name="description" content="Join ${escapeHTML(displayName)}'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support."/>
  <meta name="robots" content="index, follow"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${escapeHTML(title)}"/>
  <meta property="og:description" content="Join ${escapeHTML(displayName)}'s team at eXp Realty"/>
  ${agentImageUrl ? `<meta property="og:image" content="${escapeHTML(agentImageUrl)}"/>` : ''}
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${escapeHTML(title)}"/>
  <link rel="icon" href="${siteUrl}/favicon.ico"/>
  <link rel="preconnect" href="${siteUrl}" crossorigin/>
  <link rel="preconnect" href="https://imagedelivery.net" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/Amulya_Variable-s.6f10ee89.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2" as="font" type="font/woff2" crossorigin/>

  <!-- Plausible Analytics -->
  <script defer data-domain="${analyticsDomain}" src="https://plausible.io/js/script.js"></script>

  <style>
    /* Font Faces */
    @font-face { font-family: 'Taskor'; src: url('${siteUrl}/_next/static/media/taskor_regular_webfont-s.p.c4556052.woff2') format('woff2'); font-display: swap; font-weight: 400; }
    @font-face { font-family: 'Amulya'; src: url('${siteUrl}/_next/static/media/Amulya_Variable-s.6f10ee89.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }
    @font-face { font-family: 'Synonym'; src: url('${siteUrl}/_next/static/media/Synonym_Variable-s.p.d321a09a.woff2') format('woff2'); font-display: swap; font-weight: 100 900; }

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
      --font-size-body: clamp(16px, calc(15.27px + 0.29vw), 24px);
      --font-size-tagline: clamp(18px, calc(16.73px + 0.51vw), 32px);
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
      border-top: 1px solid rgba(255,255,255,0.1);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: var(--color-headingText);
      font-family: var(--font-taskor), sans-serif;
      font-size: 20px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 15px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5);
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .cta-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to left, rgba(255,255,255,0.15), transparent);
      width: 50%;
      transform: skewX(45deg);
    }

    .cta-button:hover { transform: translateY(-2px); }

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

    .cta-light-bar-top { top: -5px; }
    .cta-light-bar-bottom { bottom: -5px; }
    .cta-button-wrapper:hover .cta-light-bar { width: 80%; }

    @keyframes ctaLightPulse {
      0%, 100% { opacity: 0.8; box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      50% { opacity: 1; box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    /* Secondary Button */
    .secondary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      background: transparent;
      border: 2px solid rgba(255,215,0,0.5);
      border-radius: 12px;
      color: #ffd700;
      font-family: var(--font-taskor), sans-serif;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .secondary-button:hover {
      background: rgba(255,215,0,0.1);
      border-color: #ffd700;
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
      width: clamp(400px, 47.37vw, 900px);
      max-width: 95vw;
      aspect-ratio: 900 / 500;
      max-height: 50dvh;
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
      background: radial-gradient(ellipse 72% 50.4% at 50% 42%, rgba(255,215,0,0.2) 0%, rgba(255,180,0,0.12) 35%, rgba(255,150,0,0.06) 55%, transparent 80%);
    }

    .reveal-ring {
      position: absolute;
      border: 2px solid rgba(255,215,0,0.25);
      border-radius: 35%;
      left: 50%;
      top: 42%;
    }

    .reveal-ring-outer {
      width: min(80vw, 700px);
      height: min(80vw, 700px);
      transform: translate(-50%, -50%);
    }

    .reveal-ring-inner {
      width: min(60vw, 520px);
      height: min(60vw, 520px);
      border-color: rgba(255,215,0,0.18);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .hero-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 100% 100% at 50% 100%, transparent 0%, transparent 50%, rgba(0,0,0,0.5) 100%);
      pointer-events: none;
    }

    /* Agent Counter */
    .agent-counter {
      position: absolute;
      z-index: 50;
      left: 8px;
      top: 130px;
    }

    @media (min-width: 1024px) {
      .agent-counter { left: auto; right: 32px; }
    }

    .counter-digit {
      display: inline-block;
      width: 0.6em;
      text-align: center;
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: fixed;
      bottom: max(32px, calc(env(safe-area-inset-bottom, 0px) + 24px));
      right: 24px;
      pointer-events: none;
      z-index: -1;
      filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.2));
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
      border-right: 8px solid #ffd700;
      border-bottom: 8px solid #ffd700;
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

    .glass-panel-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(247,231,206,0.04) 0%, rgba(247,231,206,0.05) 50%, rgba(247,231,206,0.04) 100%);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25),
        inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 2px 4px 0 rgba(255,255,255,0.2),
        inset 0 8px 20px -8px rgba(247,231,206,0.3), inset 0 20px 40px -20px rgba(255,255,255,0.15),
        inset 0 -1px 0 0 rgba(0,0,0,0.7), inset 0 -2px 6px 0 rgba(0,0,0,0.5),
        inset 0 -10px 25px -8px rgba(0,0,0,0.6), inset 0 -25px 50px -20px rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
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

    .pillar-text {
      color: #bca24a;
      font-weight: 500;
      text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8),
        0 0 0.05em #bca24a, 0 0 0.09em rgba(188, 162, 74, 0.8),
        0 0 0.13em rgba(188, 162, 74, 0.55), 0 0 0.18em rgba(188, 162, 74, 0.35),
        0.03em 0.03em 0 #2a2a2a, 0.045em 0.045em 0 #1a1a1a,
        0.06em 0.06em 0 #0f0f0f, 0.075em 0.075em 0 #080808;
      filter: drop-shadow(0.05em 0.05em 0.08em rgba(0,0,0,0.7)) brightness(1) drop-shadow(0 0 0.08em rgba(188, 162, 74, 0.25));
      animation: pillarGlowBreathe 4s ease-in-out infinite;
    }

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
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      .md\\:col-span-5 { grid-column: span 5 / span 5; }
      .md\\:col-span-7 { grid-column: span 7 / span 7; }
      .md\\:col-span-8 { grid-column: span 8 / span 8; }
    }

    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    @media (min-width: 768px) {
      .md\\:gap-6 { gap: 1.5rem; }
    }

    /* Flex utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
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
      .md\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
      .md\\:py-32 { padding-top: 8rem; padding-bottom: 8rem; }
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

    /* Prevent body scroll when modal is open */
    body.modal-open { overflow: hidden; }
    html.modal-open { overflow: hidden; }
  </style>
</head>
<body>
  <main id="main-content">
    <!-- Hero Section - Fixed -->
    <div class="hero-fixed">
      <div class="hero-content">
        <section class="hero-section" aria-label="Hero">
          <!-- Agent Counter (Desktop) -->
          <div class="agent-counter" id="agent-counter-desktop">
            <span style="display: inline-flex; align-items: center; gap: 0.25em; font-size: clamp(1.75rem, 2.625vw, 2.1875rem);">
              <span style="display: inline; color: #bfbdb0; font-family: var(--font-synonym), monospace; font-weight: 300; font-size: calc(1em + 10px);">
                <span class="counter-digit">3</span><span class="counter-digit">7</span><span class="counter-digit">0</span><span class="counter-digit">0</span><span>+</span>
              </span>
              <span style="color: #bfbdb0; font-family: var(--font-taskor), sans-serif; font-feature-settings: 'ss01' 1; text-transform: uppercase; letter-spacing: 0.05em; text-shadow: 0 0 0.01em #fff, 0 0 0.02em #fff, 0 0 0.03em rgba(255,255,255,0.8); filter: drop-shadow(0 0 0.04em #bfbdb0) drop-shadow(0 0 0.08em rgba(191,189,176,0.6));">AGENTS</span>
            </span>
          </div>

          <!-- Reveal Mask Effect -->
          <div class="reveal-mask-effect hero-effect-layer">
            <div class="reveal-glow"></div>
            <div class="reveal-ring reveal-ring-outer"></div>
            <div class="reveal-ring reveal-ring-inner"></div>
            <div class="hero-vignette"></div>
          </div>

          <!-- Hero Content -->
          <div class="hero-content-wrapper" id="hero-content-wrapper">
            <!-- Profile Image -->
            <div class="hero-image-container">
              <div class="hero-3d-backdrop"></div>
              <img
                src="${escapeHTML(agentImageUrl)}"
                alt="${escapeHTML(displayName)} - Smart Agent Alliance"
                width="900"
                height="500"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                class="hero-image"
              />
            </div>

            <!-- Hero Text -->
            <div class="hero-text-wrapper" style="perspective: 1000px;">
              <h1 id="hero-heading" class="text-h1 h1-neon" style="font-size: clamp(50px, calc(30px + 4vw + 0.3vh), 150px); margin-bottom: 3px;">
                ${escapeHTML(displayName.toUpperCase())}
              </h1>
              <p class="text-tagline tagline">
                ${escapeHTML(agentTagline)}
              </p>
              <div class="flex justify-center items-center" style="margin-top: 14px;">
                <div class="cta-button-wrapper">
                  <div class="cta-light-bar cta-light-bar-top"></div>
                  <a href="#watch-and-decide" class="cta-button">WATCH & DECIDE</a>
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
    <div class="scroll-indicator" id="scroll-indicator">
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
          <section class="px-6" style="padding-top: calc(1.5rem + 15px); padding-bottom: calc(1.5rem + 15px);">
            <div class="mx-auto" style="max-width: 900px;">
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3 justify-center">
                  <span class="pillar-number" style="color: #ffd700; font-weight: bold; min-width: 1.5em; font-size: clamp(0.875rem, 2vw, 1rem);">01</span>
                  <span class="pillar-text text-sm" style="font-size: clamp(0.875rem, 2vw, 1rem);">Smart Agent Alliance, sponsor support built and provided at no cost to agents.</span>
                </div>
                <div class="flex items-center gap-3 justify-center">
                  <span class="pillar-number" style="color: #ffd700; font-weight: bold; min-width: 1.5em; font-size: clamp(0.875rem, 2vw, 1rem);">02</span>
                  <span class="pillar-text text-sm" style="font-size: clamp(0.875rem, 2vw, 1rem);">Inside eXp Realty, the largest independent real estate brokerage in the world.</span>
                </div>
                <div class="flex items-center gap-3 justify-center">
                  <span class="pillar-number" style="color: #ffd700; font-weight: bold; min-width: 1.5em; font-size: clamp(0.875rem, 2vw, 1rem);">03</span>
                  <span class="pillar-text text-sm" style="font-size: clamp(0.875rem, 2vw, 1rem);">Stronger Together, eXp infrastructure plus SAA systems drive higher agent success.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Why Smart Agent Alliance Section -->
    <section class="section py-24 md:py-32 px-6 overflow-hidden relative">
      <div class="section-content scroll-reveal" id="why-saa-section">
        <div class="text-center mb-12">
          <h2 class="text-h2 h2-container">
            <span class="h2-word">Why</span>
            <span class="h2-word">Smart</span>
            <span class="h2-word">Agent</span>
            <span class="h2-word">Alliance?</span>
          </h2>
        </div>
        <div class="grid md:grid-cols-12 gap-4 md:gap-6">
          <div style="grid-column: span 7 / span 7;">
            <div class="bento-card" style="height: 100%;">
              <div class="bento-card-content">
                <div class="mb-8">
                  <p class="text-2xl md:text-3xl font-bold" style="font-family: var(--font-amulya); color: #ffd700;">Elite systems. Proven training. Real community.</p>
                  <p class="text-lg mt-4 opacity-70">Most eXp sponsors offer little or no ongoing value.</p>
                  <p class="text-xl md:text-2xl font-bold mt-6" style="font-family: var(--font-amulya); color: #ffd700;">Smart Agent Alliance was built differently.</p>
                  <p class="text-lg mt-4" style="line-height: 1.7;">We invest in real systems, long-term training, and agent collaboration because our incentives are aligned with agent success.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center gap-3">
                    <span class="check-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="text-sm font-medium">Not a production team</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="check-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="text-sm font-medium">No commission splits</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="check-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="text-sm font-medium">No sponsor team fees</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="check-3d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="text-sm font-medium">No required meetings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="grid-column: span 5 / span 5;">
            <div class="bento-card" style="position: relative; overflow: hidden; height: 100%; min-height: 300px;">
              <div style="position: absolute; inset: 0; overflow: hidden;">
                <img src="${CLOUDFLARE_BASE}/saa-aligned-incentives-value-multiplication/public" alt="Smart Agent Alliance aligned incentives model" class="bento-image" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
              </div>
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);"></div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px;">
                <p class="font-bold" style="font-family: var(--font-amulya); color: #ffd700; font-size: 23px;">Aligned Incentives</p>
                <p class="text-sm opacity-70 mt-1">When you succeed, we succeed</p>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-12">
          <p class="text-body max-w-xl mx-auto" style="color: #e5e4dd;">Access to SAA systems, training, and community is tied to sponsorship at the time of joining eXp Realty.</p>
        </div>
      </div>
    </section>

    <!-- Media Logos Section (Why eXp Realty?) -->
    <section class="media-logos-section scroll-reveal" id="media-logos-section">
      <div class="text-center px-4 relative" style="z-index: 10;">
        <h2 class="text-h2 h2-container">
          <span class="h2-word">Why</span>
          <span class="h2-word">eXp</span>
          <span class="h2-word">Realty?</span>
        </h2>
        <p class="text-body mx-auto opacity-80 mb-8" style="max-width: 900px;">
          The largest independent brokerage in the world and the only cumulatively profitable public company in real estate. As an S&P 600 SmallCap company and the first cloud-based brokerage, eXp is frequently featured in major national and global media outlets.
        </p>
      </div>
      <div class="media-logos-container">
        <div class="portal-edge-left"></div>
        <div class="portal-edge-right"></div>
        <div class="logo-track-container">
          <div class="logo-track-shadow-left"></div>
          <div class="logo-track-shadow-right"></div>
          <div class="logo-track" id="logo-track">
            ${mediaLogosHTML}
          </div>
        </div>
      </div>
    </section>

    <!-- Watch and Decide Section -->
    <div class="glass-panel" style="margin: 0 16px;">
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
                    <iframe
                      id="video-iframe"
                      src="https://customer-2twfsluc6inah5at.cloudflarestream.com/f8c3f1bd9c2db2409ed0e90f60fd4d5b/iframe?controls=false&poster=${encodeURIComponent(CLOUDFLARE_BASE + '/exp-realty-smart-agent-alliance-explained/desktop')}&letterboxColor=transparent"
                      loading="lazy"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                    <div class="video-overlay" id="video-overlay">
                      <div class="overlay-play-btn" id="play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
                      <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                    <button class="control-btn" id="btn-rewind" aria-label="Rewind 15 seconds" title="Rewind 15s">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                      <span class="rewind-text">15</span>
                    </button>
                    <button class="control-btn" id="btn-restart" aria-label="Restart video" title="Restart">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
                    </button>
                    <div class="time-display" id="time-display">0:00 / 0:00</div>
                    <div class="volume-controls">
                      <button class="control-btn" id="btn-mute" aria-label="Mute">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                      </button>
                      <input type="range" min="0" max="1" step="0.1" value="1" class="volume-slider" id="volume-slider" aria-label="Volume" />
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
                <div id="book-call-wrapper" style="opacity: 0.4; filter: blur(1px) grayscale(0.8); pointer-events: none; transition: all 0.5s ease;">
                  <a href="https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7" target="_blank" rel="noopener noreferrer" class="secondary-button" id="btn-book-call">BOOK A CALL</a>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="modal">
        <h3 class="join-modal-title">Join Smart Agent Alliance</h3>
        <p class="join-modal-subtitle">Take the first step towards building your dream career at eXp Realty.</p>
        <form id="join-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name *</label>
              <input type="text" id="firstName" name="firstName" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name *</label>
              <input type="text" id="lastName" name="lastName" class="form-input" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="email">Email *</label>
            <input type="email" id="email" name="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="country">Country *</label>
            <select id="country" name="country" class="form-select" required>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="modal instructions-modal">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
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
              <p class="instruction-text">Enter <strong>${escapeHTML(agentExpEmail)}</strong> and click Search. Select <strong>${escapeHTML(agentFullLegalName)}</strong> as your sponsor.</p>
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

  <script src="https://embed.cloudflarestream.com/embed/sdk.latest.js"></script>
  <script>
    (function() {
      // Constants
      const STORAGE_KEY = 'agent_attraction_video';
      const UNLOCK_THRESHOLD = 50;
      const SPONSOR_NAME = ${JSON.stringify(displayName)};

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
        setupLogoAnimation();
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

        // Form submission
        joinForm.addEventListener('submit', handleFormSubmit);

        // Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (joinModal.classList.contains('open')) closeModal('join');
            if (instructionsModal.classList.contains('open')) closeModal('instructions');
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
      function openModal(type) {
        const modal = type === 'join' ? joinModal : instructionsModal;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
      }

      function closeModal(type) {
        const modal = type === 'join' ? joinModal : instructionsModal;
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
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

            // Show success
            joinMessage.className = 'form-message success';
            joinMessage.textContent = 'Thank you! We will be in touch soon.';
            joinMessage.style.display = 'block';

            // Close join modal and open instructions
            setTimeout(() => {
              closeModal('join');
              userNameDisplay.textContent = formData.firstName;
              setTimeout(() => openModal('instructions'), 300);

              // Reset form
              joinForm.reset();
              joinMessage.style.display = 'none';
            }, 1500);
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

      // Wait for DOM and Stream SDK
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          init();
          checkPreviousSubmission();
        });
      } else {
        init();
        checkPreviousSubmission();
      }
    })();
  </script>
</body>
</html>`;
}
