'use client';

/**
 * Activate Account Form Component
 * Two-step activation flow:
 *   Step 1: Validate token (automatic on mount)
 *   Step 2: Collect name + password, submit to /api/invitations/accept
 *   Then auto-sign-in and redirect to /agent-portal
 */

import { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, User, Mail, Check, X } from 'lucide-react';
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
import { FormButton } from '@saa/shared/components/saa';
import PasswordInput from '../../login/components/PasswordInput';
import Link from 'next/link';

// Password validation matching acceptInvitationSchema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const activateAccountSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'First name is required')
      .max(100, 'First name must not exceed 100 characters'),
    last_name: z
      .string()
      .min(1, 'Last name is required')
      .max(100, 'Last name must not exceed 100 characters'),
    email: z
      .string()
      .email('Invalid email format')
      .optional()
      .or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ActivateAccountFormValues = z.infer<typeof activateAccountSchema>;

// Password requirement checker
const passwordRequirements = [
  { label: '8+ characters', test: (pw: string) => pw.length >= 8 },
  { label: 'Uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'Number', test: (pw: string) => /[0-9]/.test(pw) },
  { label: 'Special character', test: (pw: string) => /[^a-zA-Z0-9]/.test(pw) },
];

interface ActivateAccountFormProps {
  initialToken?: string;
}

export default function ActivateAccountForm({ initialToken = '' }: ActivateAccountFormProps) {
  const [token] = useState(initialToken);
  const [step, setStep] = useState<'validating' | 'form' | 'success'>('validating');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationEmail, setInvitationEmail] = useState('');

  const form = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = form.watch('password');
  const watchedConfirm = form.watch('confirmPassword');

  // Step 1: Validate the token on mount
  const validateToken = useCallback(async () => {
    if (!token) {
      setError('No activation token provided. Please check your email for the activation link.');
      return;
    }

    try {
      const response = await fetch(`/api/invitations/validate?token=${encodeURIComponent(token)}`);
      const data = await response.json();

      if (!response.ok || !data.valid) {
        const messages: Record<string, string> = {
          not_found: 'This activation link is invalid. Please contact support.',
          expired: 'This activation link has expired. Please request a new one.',
          already_used: 'This account has already been activated. You can log in.',
          cancelled: 'This invitation has been cancelled. Please contact support.',
          rate_limit_exceeded: 'Too many attempts. Please try again in a minute.',
        };
        setError(messages[data.reason] || data.error || 'Invalid activation token.');
        return;
      }

      // Pre-fill form with data from the invitation
      form.setValue('first_name', data.first_name || '');
      form.setValue('last_name', data.last_name || '');
      setInvitationEmail(data.email || '');
      setStep('form');
    } catch {
      setError('Unable to validate your activation token. Please try again later.');
    }
  }, [token, form]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Step 2: Submit the activation form
  const onSubmit = async (values: ActivateAccountFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, string> = {
        token,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
      };

      // Only send email if user provided one (overrides invitation email)
      if (values.email && values.email.trim()) {
        body.email = values.email.trim();
      }

      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Activation failed. Please try again.');
      }

      // Account activated — auto-login and redirect to agent portal
      setStep('success');

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartagentalliance.com';
      const loginEmail = (values.email && values.email.trim()) || invitationEmail;

      // Brief delay for Supabase Auth user to propagate, then auto-login
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: loginEmail,
            password: values.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.success) {
          // Pass auth data to the public site callback via URL hash (not sent to server)
          // Uses a Cloudflare Function that bypasses the PWA service worker cache
          const authPayload = btoa(JSON.stringify({
            access_token: loginData.access_token,
            user: loginData.user,
          }));
          window.location.href = `${appUrl}/auth/callback#auth=${authPayload}`;
          return;
        }
      } catch {
        // Auto-login failed — fall through to manual login redirect
      }

      // Fallback: redirect to login page if auto-login fails
      setTimeout(() => {
        window.location.href = `${appUrl}/agent-portal/login?activated=true`;
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" />
          <h2 className="text-2xl font-bold text-center text-[#e5e4dd]">
            Account Activated!
          </h2>
          <p className="text-center text-[#dcdbd5]">
            Your account has been successfully activated.
            <br />
            Signing you in...
          </p>
        </div>
      </div>
    );
  }

  // Validating state (Step 1)
  if (step === 'validating' && !error) {
    return (
      <div className="space-y-6 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-[#ffd700] animate-spin" />
          <p className="text-center text-[#dcdbd5]">
            Validating your activation link...
          </p>
        </div>
      </div>
    );
  }

  // Error state (when token validation failed)
  if (step === 'validating' && error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300 !text-red-400 !border-red-400/50">
          <AlertDescription className="!text-red-400">{error}</AlertDescription>
        </Alert>
        <p className="text-center text-sm text-[#dcdbd5]">
          <Link href="https://smartagentalliance.com/agent-portal/login" className="text-[#ffd700] hover:opacity-80 transition-opacity">
            Go to Login
          </Link>
          {' · '}
          <a href="mailto:doug@smartagentalliance.com" className="text-[#ffd700] hover:opacity-80 transition-opacity">
            Contact Support
          </a>
        </p>
      </div>
    );
  }

  // Step 2: Account setup form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300 !text-red-400 !border-red-400/50">
            <AlertDescription className="flex items-center justify-between !text-red-400">
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

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e5e4dd]">First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="First name"
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

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#e5e4dd]">Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="Last name"
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
        </div>

        {/* Email Field (optional override) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">
                Email <span className="text-[#dcdbd5]/50 text-xs font-normal">(optional override)</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                  <Input
                    {...field}
                    type="email"
                    placeholder={invitationEmail || 'Enter email'}
                    disabled={isSubmitting}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
              <p className="text-xs text-[#dcdbd5]/40 mt-1">
                Changing your email will update your login and where we send team communications.
              </p>
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
                  autoComplete="new-password"
                  placeholder="Create a password"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
              {/* Live password requirements */}
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => {
                  const met = req.test(watchedPassword || '');
                  return (
                    <div key={req.label} className="flex items-center gap-2 text-xs transition-colors duration-200">
                      {met ? (
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-3 w-3 text-[#dcdbd5]/40 shrink-0" />
                      )}
                      <span className={met ? 'text-green-500' : 'text-[#dcdbd5]/40'}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
              {/* Passwords match indicator */}
              {watchedConfirm && (
                <div className="mt-2 flex items-center gap-2 text-xs transition-colors duration-200">
                  {watchedPassword && watchedConfirm === watchedPassword ? (
                    <>
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-[#dcdbd5]/40 shrink-0" />
                      <span className="text-[#dcdbd5]/40">Passwords match</span>
                    </>
                  )}
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Gold Submit Button — matches public site login */}
        <div style={{ marginTop: '1.5rem' }}>
          <FormButton
            isLoading={isSubmitting}
            loadingText="Activating..."
          >
            Activate Account
          </FormButton>
        </div>

        {/* Get Help — centered */}
        <div className="text-center mt-4 pb-5">
          <a
            href="mailto:doug@smartagentalliance.com"
            className="text-sm text-[#dcdbd5]/50 hover:text-[#ffd700] transition-colors"
          >
            Get Help
          </a>
        </div>
      </form>
    </Form>
  );
}
