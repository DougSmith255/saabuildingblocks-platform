'use client';

/**
 * Reset Password Page
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Token-based password reset
 * - Automatic token extraction from URL
 * - New password with confirmation
 * - Password strength validation
 * - Success/error states
 * - Redirect to login on success
 * - Glass morphism design matching Master Controller
 */

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ResetPasswordForm from './components/ResetPasswordForm';
import { CyberCard } from '@saa/shared/components/saa/cards/CyberCard';

function ResetPasswordPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/agent-portal');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render form if already authenticated
  if (user) {
    return null;
  }

  // Extract token from URL
  const token = searchParams?.get('token') || '';

  return (
    <div className="w-full max-w-md">
      {/* Oversized Title - H1 auto-applies display font */}
      <h1 className="text-display text-7xl font-bold text-center mb-4" style={{ color: '#ffd700' }}>
        RESET
      </h1>

      {/* Reset Password Card */}
      <CyberCard className="w-full min-h-fit">
        <ResetPasswordForm initialToken={token} />
      </CyberCard>

      {/* Footer */}
      <div className="mt-8 text-center text-sm">
        <p className="text-[#ffd700]">
          🔒 Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}

// Export with Suspense boundary for useSearchParams()
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
