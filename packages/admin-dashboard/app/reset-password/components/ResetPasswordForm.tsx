'use client';

/**
 * Reset Password Form Component
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Zod validation
 * - Token input (auto-filled from URL if available)
 * - New password with confirmation
 * - Password strength indicators
 * - Password visibility toggle
 * - Error handling with animations
 * - Loading states
 * - Auto-redirect to login on success
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Key, Loader2, CheckCircle2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@saa/shared/components/ui/form';
import { Input } from '@saa/shared/components/ui/input';
import { Alert, AlertDescription } from '@saa/shared/components/ui/alert';
import { SecondaryButton } from '@saa/shared/components/saa';
import PasswordInput from '../../login/components/PasswordInput';
import Link from 'next/link';

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Validation schema
const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(10, 'Reset token is required')
      .max(500, 'Invalid reset token'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  initialToken?: string;
}

export default function ResetPasswordForm({ initialToken = '' }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: initialToken,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call password reset API
      const response = await fetch('/api/auth/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: values.token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed. Please try again.');
      }

      // Success
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?password_reset=true');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" />
          <h2 className="text-2xl font-bold text-center text-[#e5e4dd]">
            Password Reset Successfully!
          </h2>
          <p className="text-center text-[#dcdbd5]">
            Your password has been updated.
            <br />
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-sm hover:underline ml-4"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-[#dcdbd5]">
            Enter your reset token and choose a new password.
          </p>
        </div>

        {/* Token Field */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Reset Token</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your reset token"
                    disabled={isSubmitting}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50 font-mono text-sm"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* New Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
              <p className="text-xs text-[#dcdbd5] mt-1">
                Must contain: 8+ characters, uppercase, lowercase, number, and special character
              </p>
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Submit Button - SAA Secondary Button */}
        <SecondaryButton
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!isSubmitting) {
              form.handleSubmit(onSubmit)();
            }
          }}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </SecondaryButton>

        {/* Support Link */}
        <p className="text-center text-sm text-[#dcdbd5] mt-4 pb-5">
          Need help?{' '}
          <Link href="/contact-support" className="text-[#ffd700] hover:opacity-80 transition-opacity">
            Contact Support
          </Link>
        </p>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-[#ffd700] hover:opacity-80 transition-opacity"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
