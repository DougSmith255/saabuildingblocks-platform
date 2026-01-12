import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import StarBackground from '@/components/shared/StarBackgroundCanvas';
import ScrollToTop from '@/components/shared/ScrollToTop';
import LayoutWrapper from './components/LayoutWrapper';
import PerformanceHints from './components/PerformanceHints';
import { SkipLink } from './components/SkipLink';
import { generateStaticCSS } from './master-controller/lib/buildTimeCSS';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read critical CSS at build time for consolidation
const criticalCSS = readFileSync(
  join(process.cwd(), 'app/styles/critical.css'),
  'utf-8'
);

/**
 * Generate consolidated CSS for static builds
 * Combines critical CSS + Master Controller CSS in correct order:
 * 1. CSS variables (:root)
 * 2. Critical layout/typography
 * 3. Master Controller settings
 *
 * Note: Public-site package is ALWAYS a static build (output: 'export')
 * No dynamic provider needed - CSS is baked in at build time
 */
async function generateConsolidatedCSS(): Promise<string> {
  const masterControllerCSS = await generateStaticCSS();

  // Consolidate in correct order to prevent FOUC
  return `
/* ========================================
   CONSOLIDATED CSS FOR STATIC EXPORT
   Order: Variables → Critical → Components
   ======================================== */

${criticalCSS}

/* Master Controller Settings (baked at build time) */
${masterControllerCSS}
`.trim();
}

/**
 * Custom Font Configurations
 * Using variable fonts for optimal performance and flexibility
 *
 * font-display: 'block' - Text invisible until font loads (max 3s block period)
 * This prevents ugly fallback fonts from showing, at cost of brief FOIT
 * Combined with preload: true, fonts load very fast so block is minimal
 */
const taskor = localFont({
  src: '../public/fonts/taskor-regular-webfont.woff2',
  variable: '--font-taskor',
  display: 'block', // Block render until font loads - prevents fallback flash
  preload: true,
  weight: '400',
});

// Amulya fonts - NOT preloaded (not used above fold - only in content areas)
// CategoryBadge now uses Taskor, so Amulya can be deferred
const amulya = localFont({
  src: '../public/fonts/Amulya-Variable.woff2',
  variable: '--font-amulya',
  display: 'swap', // Swap when loaded - allows content to render immediately
  preload: false, // Don't preload - not used above fold
  weight: '100 900',
});

const amulyaItalic = localFont({
  src: '../public/fonts/Amulya-VariableItalic.woff2',
  variable: '--font-amulya-italic',
  display: 'swap', // Italic can swap - not used above fold
  preload: false, // Don't preload italic (not used above-fold)
  weight: '100 900',
  style: 'italic',
});

const synonym = localFont({
  src: '../public/fonts/Synonym-Variable.woff2',
  variable: '--font-synonym',
  display: 'block', // Block until font loads for consistent appearance
  preload: true,
  weight: '100 900',
});

/**
 * Site Metadata Configuration
 * Optimized for SEO and social sharing
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://smartagentalliance.com'),
  title: {
    default: 'Smart Agent Alliance - For Agents Who Want More',
    template: '%s | Smart Agent Alliance',
  },
  description:
    'Join the Smart Agent Alliance and eXp Realty to build your real estate career with industry-leading commission splits, revenue share, and mentorship from Doug Smart and Karrie Hill.',
  keywords: [
    'eXp Realty',
    'real estate agent',
    'join eXp',
    'real estate career',
    'Doug Smart',
    'Karrie Hill',
    'revenue share',
    'real estate team',
  ],
  authors: [{ name: 'Smart Agent Alliance' }],
  creator: 'Smart Agent Alliance',
  publisher: 'Smart Agent Alliance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartagentalliance.com',
    siteName: 'Smart Agent Alliance',
    title: 'Smart Agent Alliance - For Agents Who Want More',
    description:
      'Join the Smart Agent Alliance and eXp Realty to build your real estate career with industry-leading commission splits, revenue share, and mentorship.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Agent Alliance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Agent Alliance - For Agents Who Want More',
    description:
      'Join eXp Realty with the Smart Agent Alliance for industry-leading commission splits and revenue share.',
    images: ['/twitter-image.jpg'],
    creator: '@smartagentalliance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

/**
 * Root Layout Component
 *
 * Provides global structure, fonts, and styling for all pages
 * Implements Next.js 15 App Router layout pattern
 *
 * Note: This layout wraps ALL routes. Child layouts (like master-controller/layout.tsx)
 * render INSIDE this layout's {children}, so they inherit Header/Footer unless
 * we conditionally render them based on the route.
 *
 * DOCTYPE is automatically generated by Next.js 15 App Router.
 * The <html> tag is the root element that Next.js wraps with <!DOCTYPE html>.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Public-site is ALWAYS a static build - generate consolidated CSS
  const consolidatedCSS = await generateConsolidatedCSS();
  console.log('🎨 Consolidated CSS generated at build time (prevents FOUC)');

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${taskor.variable} ${amulya.variable} ${amulyaItalic.variable} ${synonym.variable} notranslate`}
      translate="no"
      suppressHydrationWarning
    >
      <head>
        {/* SINGLE CONSOLIDATED STYLE BLOCK - Prevents CSS FOUC */}
        <style
          id="master-controller-static"
          dangerouslySetInnerHTML={{ __html: consolidatedCSS }}
          data-description="Consolidated CSS: Variables + Critical + Master Controller (prevents FOUC)"
        />

        {/* Performance Hints - Establish early connections */}
        <PerformanceHints />

        {/* Image preloads removed - causing render delays without improving LCP */}

        {/*
          Font Preloading Note:
          Next.js localFont() with preload: true adds preload links automatically
          for most pages. The 404 page may have slight FOUC but that's acceptable
          since it's a rare error case. Manual preloads caused duplicate downloads.
        */}

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Manifest for PWA support */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#ffd700" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#191919" />

        {/* PWA meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SAA" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Disable Google Translate popup (for decorative Japanese characters in effects) */}
        <meta name="google" content="notranslate" />

        {/* Disable browser scroll restoration - always load pages at top */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual'}`,
          }}
        />

        {/* Service Worker Registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SAA PWA: Service Worker registered with scope:', registration.scope);
                  }).catch(function(error) {
                    console.log('SAA PWA: Service Worker registration failed:', error);
                  });
                });
              }
            `,
          }}
        />

        {/* Plausible Analytics - Self-hosted, privacy-focused analytics */}
        <script
          defer
          data-domain="saabuildingblocks.pages.dev"
          src="https://plausible.saabuildingblocks.com/js/script.file-downloads.pageview-props.tagged-events.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />

        {/* Organization Schema - JSON-LD for search engines and AI */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Smart Agent Alliance',
              url: 'https://smartagentalliance.com',
              logo: 'https://smartagentalliance.com/logo.png',
              description: 'Real estate coaching and training platform helping agents build sustainable businesses through proven systems, lead generation strategies, and community support.',
              founder: [
                {
                  '@type': 'Person',
                  name: 'Doug Smart',
                },
                {
                  '@type': 'Person',
                  name: 'Karrie Smart',
                },
              ],
              sameAs: [
                'https://www.facebook.com/smartagentalliance',
                'https://www.youtube.com/@SmartAgentAlliance',
                'https://www.instagram.com/smartagentalliance',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'info@smartagentalliance.com',
              },
            }),
          }}
        />

        {/* WebSite Schema - for sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Smart Agent Alliance',
              url: 'https://smartagentalliance.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://smartagentalliance.com/blog?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className="font-sans antialiased"
        style={{
          background: 'radial-gradient(at center bottom, rgb(40, 40, 40) 0%, rgb(25, 25, 25) 100%)',
          backgroundColor: '#191919',
          margin: 0,
          padding: 0,
        }}
        suppressHydrationWarning
      >
        {/* Public-site package: Always static export with baked-in CSS */}
        {/* SmoothScroll moved to LayoutWrapper for dynamic import */}
        {/* ScrollProgress moved to LayoutWrapper to hide in embed mode */}
        <ScrollToTop />
        <SkipLink />
        <StarBackground />
        <LayoutWrapper>{children}</LayoutWrapper>


        {/* SAA Grainy Glow Filters - Global */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="grainy-glow-gold">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.84  0 0 0 0 0  0 0 0 0.8 0" />
              <feGaussianBlur stdDeviation="6" />
              <feBlend mode="screen" />
            </filter>
            <filter id="grainy-glow-green">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 1  0 0 0 0 0.53  0 0 0 0.8 0" />
              <feGaussianBlur stdDeviation="6" />
              <feBlend mode="screen" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
