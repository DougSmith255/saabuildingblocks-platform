'use client';

/**
 * Login Page
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Email/username authentication
 * - Password visibility toggle
 * - Remember me functionality
 * - Forgot password/username links
 * - Redirect to Agent Portal on success
 * - Glass morphism design matching Master Controller
 *
 * STATIC EXPORT: Excluded via layout.tsx (parent has dynamic = 'force-dynamic')
 */

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './components/LoginForm';
import { CyberCardHolographic } from '@saa/shared/components/saa/cards/CyberCardHolographic';

function LoginPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      const redirect = searchParams.get('redirect') || '/agent-portal';
      router.push(redirect);
    }
  }, [user, isLoading, router, searchParams]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      {/* Oversized LOGIN Title */}
      <h1 className="text-display text-7xl font-bold text-center mb-4" style={{ color: '#ffd700' }}>
        LOGIN
      </h1>

      {/* Login Card with holographic matrix effect */}
      <CyberCardHolographic className="w-full min-h-fit">
        <LoginForm />
      </CyberCardHolographic>

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
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
