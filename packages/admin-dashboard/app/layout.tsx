import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import StarBackground from '@/components/StarBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import GlassScrollbar from '@/components/GlassScrollbar';
import { MasterControllerProvider } from './providers/MasterControllerProvider';
import LayoutWrapper from './components/LayoutWrapper';
import PerformanceHints from './components/PerformanceHints';
import { SkipLink } from './components/SkipLink';
import { generateStaticCSS } from './master-controller/lib/buildTimeCSS';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read critical CSS at build time for consolidation (if exists)
// Note: admin-dashboard is a dynamic app and doesn't require CSS consolidation
let criticalCSS = '';
try {
  criticalCSS = readFileSync(
    join(process.cwd(), 'app/styles/critical.css'),
    'utf-8'
  );
} catch (error) {
  // File doesn't exist - this is expected for dynamic apps like admin-dashboard
  console.log('⚠️  No critical.css found (expected for dynamic apps)');
}

/**
 * Generate consolidated CSS for static builds
 * Combines critical CSS + Master Controller CSS in correct order:
 * 1. CSS variables (:root)
 * 2. Critical layout/typography
 * 3. Master Controller settings
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
 */
const taskor = localFont({
  src: '../public/fonts/taskor-regular-webfont.woff2',
  variable: '--font-taskor',
  display: 'swap',
  preload: true,
  weight: '400',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const amulya = localFont({
  src: [
    {
      path: '../public/fonts/Amulya-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/Amulya-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-amulya',
  display: 'swap',
  preload: true,
  weight: '100 900',
  fallback: ['Georgia', 'serif'],
});

const synonym = localFont({
  src: '../public/fonts/Synonym-Variable.woff2',
  variable: '--font-synonym',
  display: 'swap',
  preload: false,
  weight: '100 900',
});

/**
 * Site Metadata Configuration
 * Optimized for SEO and social sharing
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://staging.smartagentalliance.com'),
  title: {
    default: 'Smart Agent Alliance - Empowering Intelligent AI Collaboration',
    template: '%s | Smart Agent Alliance',
  },
  description:
    'Join the Smart Agent Alliance to discover cutting-edge AI agent technologies, collaborative frameworks, and building blocks for the future of intelligent systems.',
  keywords: [
    'AI agents',
    'intelligent systems',
    'AI collaboration',
    'machine learning',
    'autonomous agents',
    'AI framework',
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
    url: 'https://staging.smartagentalliance.com',
    siteName: 'Smart Agent Alliance',
    title: 'Smart Agent Alliance - Empowering Intelligent AI Collaboration',
    description:
      'Discover cutting-edge AI agent technologies and collaborative frameworks for intelligent systems.',
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
    title: 'Smart Agent Alliance - Empowering Intelligent AI Collaboration',
    description:
      'Discover cutting-edge AI agent technologies and collaborative frameworks.',
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
  // Check if this is a static build
  const isStaticBuild = process.env['STATIC_BUILD'] === 'true';

  // For static builds, generate consolidated CSS at build time
  let consolidatedCSS = '';
  if (isStaticBuild) {
    consolidatedCSS = await generateConsolidatedCSS();
    console.log('🎨 Consolidated CSS generated at build time (prevents FOUC)');
  }

  return (
    <html
      lang="en"
      className={`${taskor.variable} ${amulya.variable} ${synonym.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* SINGLE CONSOLIDATED STYLE BLOCK - Prevents CSS FOUC */}
        {isStaticBuild && consolidatedCSS ? (
          <style
            id="master-controller-static"
            dangerouslySetInnerHTML={{ __html: consolidatedCSS }}
            data-description="Consolidated CSS: Variables + Critical + Master Controller (prevents FOUC)"
          />
        ) : (
          <style
            dangerouslySetInnerHTML={{ __html: criticalCSS }}
            data-description="Critical above-the-fold CSS"
          />
        )}

        {/* Performance Hints - Establish early connections */}
        <PerformanceHints />

        {/* Font Preloading - Critical fonts loaded with highest priority */}
        <link
          rel="preload"
          href="/fonts/taskor-regular-webfont.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Amulya-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Amulya-VariableItalic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

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
        <meta name="apple-mobile-web-app-title" content="SAA Portal" />
        <meta name="mobile-web-app-capable" content="yes" />
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
        {/*
          Conditional Master Controller Provider:
          - Dynamic builds (saabuildingblocks.com): Use live CSS injection
          - Static builds (smartagentalliance.com): CSS baked into HTML
        */}
        {isStaticBuild ? (
          <>
            {/* Static build - no provider needed */}
            <SkipLink />
            <StarBackground />
            <ScrollProgress />
            <GlassScrollbar />
            <LayoutWrapper>{children}</LayoutWrapper>
          </>
        ) : (
          <MasterControllerProvider>
            {/* Dynamic build - live CSS injection */}
            <SkipLink />
            <StarBackground />
            <ScrollProgress />
            <GlassScrollbar />
            <LayoutWrapper>{children}</LayoutWrapper>
          </MasterControllerProvider>
        )}

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
