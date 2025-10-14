'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/app/providers/AuthProvider';

/**
 * Main Layout Component
 *
 * This layout applies to all routes EXCEPT master-controller and agent-portal.
 * It provides the Header and Footer that we want on most pages.
 *
 * Route Groups: (main) is a route group that doesn't affect the URL.
 * All pages in (main) will have Header/Footer EXCEPT login routes.
 * Master-controller and agent-portal are outside this group, so they won't have Header/Footer.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide header/footer on login and auth-related routes
  const isAuthRoute = pathname?.startsWith('/login') ||
                      pathname?.startsWith('/reset-password') ||
                      pathname?.startsWith('/activate-account') ||
                      pathname?.startsWith('/forgot-username');

  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col">
      {!isAuthRoute && (
        <>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-neutral-900 focus:rounded-md"
          >
            Skip to main content
          </a>

          {/* Global Header - Fixed at top */}
          <Header />
        </>
      )}

      {/* Main content area - Add padding for fixed header only if not auth route */}
      <main
        id="main-content"
        className="flex-1"
        style={{
          paddingTop: isAuthRoute ? '0' : 'clamp(60px, 8vh, 90px)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </main>

      {/* Global Footer - Hidden on auth routes */}
      {!isAuthRoute && <Footer />}
    </div>
    </AuthProvider>
  );
}
