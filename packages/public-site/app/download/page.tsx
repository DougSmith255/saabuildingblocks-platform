'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Download Page - Redirects to Agent Portal download section
 * This page is locked to authenticated users only via the agent portal
 */
export default function DownloadPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to agent portal download section
    router.replace('/agent-portal?section=download');
  }, [router]);

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700] mx-auto mb-4" />
        <p className="text-[#e5e4dd]/70">Redirecting to Agent Portal...</p>
      </div>
    </main>
  );
}
