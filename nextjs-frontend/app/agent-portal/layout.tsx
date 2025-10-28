import type { Metadata } from 'next';
import ScrollProgress from '@/components/ScrollProgress';
import GlassScrollbar from '@/components/GlassScrollbar';
import { AgentPortalHeader } from './components/AgentPortalHeader';
import { AuthProvider } from '@/app/providers/AuthProvider';

/**
 * Agent Portal Layout
 *
 * This layout overrides the root layout for the /agent-portal route.
 * Similar to Master Controller, it provides a clean interface without
 * global Header and Footer components.
 *
 * Protected by middleware - requires authentication.
 *
 * STATIC EXPORT: This entire route tree is excluded from static export
 * Requires server-side authentication and dynamic data
 */

/**
 * Route segment config - excludes /agent-portal/* from static export
 * Conditional dynamic export - allows static export to skip this route tree
 * VPS deployment: force-dynamic (requires auth and dynamic data)
 * Cloudflare Pages: undefined (route tree excluded from build)
 */
export const dynamic = process.env.NEXT_PUBLIC_BUILD_MODE === 'static'
  ? undefined
  : 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Portal - User Management',
  description: 'Agent Portal for managing users, roles, and permissions',
};

export default function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col">
      {/* Star Background inherited from root layout - DO NOT duplicate here */}

      {/* Scroll Progress Indicator - Fixed at top */}
      <ScrollProgress />

      {/* Glass Scrollbar - Dynamic visibility */}
      <GlassScrollbar />

      {/* Agent Portal Header - Custom navigation with logout */}
      <AgentPortalHeader />

      {/* Main content area - With padding for header */}
      <main
        id="main-content"
        className="flex-1 pt-20"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </div>
    </AuthProvider>
  );
}
