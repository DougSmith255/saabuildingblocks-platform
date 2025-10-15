import type { Metadata } from 'next';
import StarBackground from '@/components/StarBackground';
import ScrollProgress from '@/components/ScrollProgress';
import GlassScrollbar from '@/components/GlassScrollbar';

/**
 * Login Page Layout
 *
 * Clean layout without header/footer for authentication pages.
 * Features optimized starfield background with brand colors.
 *
 * STATIC EXPORT: Excluded from static export (requires auth)
 */

/**
 * Route segment config - excludes /login from static export
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In - Agent Portal',
  description: 'Secure access to Agent Portal. Authenticate with your credentials.',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Load secondary-button CSS */}
      <link rel="stylesheet" href="/css/wordpress-components/secondary-button.css" />

      <div className="relative min-h-screen flex flex-col">
        {/* Star Background - Canvas-based animated starfield */}
        <StarBackground />

        {/* Scroll Progress Indicator - Fixed at top */}
        <ScrollProgress />

        {/* Glass Scrollbar - Dynamic visibility */}
        <GlassScrollbar />

        {/* Main content area - No header padding needed */}
        <main
          id="main-content"
          className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
          style={{
            position: 'relative',
            zIndex: 20, // Above spaceman (10)
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
