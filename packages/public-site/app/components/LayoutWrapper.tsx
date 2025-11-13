'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of routes where header/footer should NOT render at all
  const noHeaderFooterRoutes = useMemo(() => [
    '/master-controller',
    '/login',
    '/activate',
    '/activate-account',
    '/reset-password',
    '/sign-up',
    '/_not-found', // 404 page
  ], []);

  // Check if current path matches any no-header-footer route (SSR-safe)
  const shouldHideHeaderFooter = useMemo(() => {
    // Check for is-404-page class first (set synchronously by not-found.tsx)
    if (typeof document !== 'undefined' && document.body.classList.contains('is-404-page')) {
      return true;
    }

    // If pathname is null/undefined, don't hide (let it render normally)
    if (!pathname) return false;

    return noHeaderFooterRoutes.some(route => pathname.startsWith(route));
  }, [pathname, noHeaderFooterRoutes]);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <main
        style={{ minHeight: '100vh', position: 'relative' }}
        data-no-footer={shouldHideHeaderFooter ? 'true' : undefined}
      >
        {children}
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}
