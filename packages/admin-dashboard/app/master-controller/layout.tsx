'use client';

/**
 * Master Controller Layout
 *
 * Protects the Master Controller with authentication and admin-only access.
 * Shows login form directly on page if not authenticated (no redirect).
 *
 * Access Control:
 * - Must be logged in
 * - Must have 'admin' role to access
 * - Non-admins see "Access Denied" message
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2, Eye, EyeOff, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/lib/rbac';

// Login form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Simple Login Form for Master Controller
 */
function MasterControllerLogin({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Success - trigger refresh
      onSuccess();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Settings className="w-16 h-16 text-[#ffd700]" />
          </div>
          <h1 className="text-3xl font-bold text-[#ffd700] mb-2">Master Controller</h1>
          <p className="text-[#dcdbd5]">Admin access required</p>
        </div>

        {/* Login Form */}
        <div
          className="p-8 rounded-lg border"
          style={{
            background: 'rgba(40, 40, 40, 0.8)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                <input
                  {...form.register('email')}
                  type="email"
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/50 transition-colors"
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                <input
                  {...form.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#dcdbd5] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-[#ffd700] text-black font-bold hover:bg-[#e5c200] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-[#dcdbd5]">
            <p>Only administrators can access the Master Controller</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Access Denied Screen
 */
function AccessDenied({ role, onLogout }: { role: string | null; onLogout: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-[#ffd700] mb-4">Access Denied</h1>
        <p className="text-[#dcdbd5] mb-2">
          The Master Controller is restricted to administrators only.
        </p>
        <p className="text-[#dcdbd5] mb-6 text-sm opacity-75">
          Your current role: <span className="text-[#00ff88]">{role || 'Unknown'}</span>
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-[#ffd700] text-black font-bold rounded-lg hover:bg-[#e5c200] transition-colors"
          >
            Sign Out & Try Different Account
          </button>
          <a
            href="/agent-portal"
            className="px-6 py-3 border border-[#00ff88] text-[#00ff88] font-bold rounded-lg hover:bg-[#00ff88] hover:text-black transition-colors inline-block"
          >
            Go to Agent Portal
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Master Controller Layout
 */
export default function MasterControllerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
  const { role, isLoading: roleLoading, isAdmin, refetch } = useUserRole();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthState('authenticated');
        refetch(); // Refresh role data
      } else {
        setAuthState('unauthenticated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const handleLoginSuccess = () => {
    setAuthState('authenticated');
    refetch();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthState('unauthenticated');
  };

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd700] mx-auto mb-4"></div>
          <p className="text-[#dcdbd5]">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login form
  if (authState === 'unauthenticated') {
    return <MasterControllerLogin onSuccess={handleLoginSuccess} />;
  }

  // Authenticated but loading role
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd700] mx-auto mb-4"></div>
          <p className="text-[#dcdbd5]">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Authenticated but not admin
  if (!isAdmin) {
    return <AccessDenied role={role} onLogout={handleLogout} />;
  }

  // Authenticated and admin - show content
  return <>{children}</>;
}
