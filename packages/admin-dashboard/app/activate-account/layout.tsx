import type { Metadata } from 'next';
import StarBackground from '@/components/StarBackground';
import ScrollProgress from '@/components/ScrollProgress';
import GlassScrollbar from '@/components/GlassScrollbar';

/**
 * Activate Account Page Layout
 *
 * Clean layout without header/footer for authentication pages.
 * Matches login page layout exactly.
 */

/**
 * Route segment config - excludes /activate-account from static export
 * VPS deployment: force-dynamic (requires server rendering)
 * Cloudflare Pages: undefined (route excluded from build)
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Activate Your Account - Agent Portal',
  description: 'Activate your account to access the Agent Portal.',
  robots: 'noindex, nofollow',
};

export default function ActivateAccountLayout({
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
            zIndex: 20,
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
