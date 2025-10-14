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
 */
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
