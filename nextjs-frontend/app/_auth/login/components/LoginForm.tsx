'use client';

/**
 * Login Form Component
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Zod validation
 * - Email/username input
 * - Password visibility toggle
 * - Remember me checkbox
 * - Error handling with animations
 * - Loading states
 * - Forgot password/username links
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PasswordInput from './PasswordInput';
import Link from 'next/link';
import { SecondaryButton } from '@/components/saa';

// Validation schema
const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(3, 'Email or username must be at least 3 characters')
    .max(100, 'Email or username is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login({
        emailOrUsername: values.emailOrUsername,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      // Login successful - redirect handled by AuthProvider
      // But we can also handle redirect param here
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      }
    } catch (err) {
      // Error is already set in auth context
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onClick={clearError}
                className="text-sm hover:underline ml-4"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Email/Username Field */}
        <FormField
          control={form.control}
          name="emailOrUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Email or Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="email@example.com or username"
                    autoComplete="username"
                    disabled={isSubmitting}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {/* Remember Me & Forgot Links */}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="border-white/20"
                  />
                </FormControl>
                <FormLabel className="text-sm text-[#dcdbd5] font-normal cursor-pointer">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="flex flex-col items-end gap-1">
            <Link
              href="/reset-password"
              className="text-sm text-[#ffd700] hover:opacity-80 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>
        </div>

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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </SecondaryButton>

        {/* Support Link */}
        <p className="text-center text-sm text-[#dcdbd5] mt-4 pb-5">
          Can&apos;t access your account?{' '}
          <Link href="/contact-support" className="text-[#ffd700] hover:opacity-80 transition-opacity">
            Contact Support
          </Link>
        </p>
      </form>
    </Form>
  );
}
