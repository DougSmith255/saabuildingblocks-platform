import type { Metadata } from 'next';
import StarBackground from '@/components/StarBackground';
import ScrollProgress from '@/components/ScrollProgress';
import GlassScrollbar from '@/components/GlassScrollbar';

/**
 * Reset Password Page Layout
 *
 * Clean layout without header/footer for authentication pages.
 * Features optimized starfield background with brand colors.
 */

/**
 * Route segment config - excludes /reset-password from static export
 * Conditional dynamic export - allows static export to skip this route
 * VPS deployment: force-dynamic (requires auth)
 * Cloudflare Pages: undefined (route excluded from build)
 */
export const dynamic = 'error';

export const metadata: Metadata = {
  title: 'Reset Your Password - Agent Portal',
  description: 'Reset your password to regain access to the Agent Portal.',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function ResetPasswordLayout({
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
