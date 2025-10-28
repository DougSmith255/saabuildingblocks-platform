'use client';

/**
 * Activate Account Form Component
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Zod validation
 * - Token input (auto-filled from URL if available)
 * - Error handling with animations
 * - Loading states
 * - Auto-redirect to login on success
 */

import { useState, useEffect } from 'react';
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
import Link from 'next/link';

// Validation schema
const activateAccountSchema = z.object({
  token: z
    .string()
    .min(10, 'Activation token is required')
    .max(500, 'Invalid activation token'),
});

type ActivateAccountFormValues = z.infer<typeof activateAccountSchema>;

interface ActivateAccountFormProps {
  initialToken?: string;
}

export default function ActivateAccountForm({ initialToken = '' }: ActivateAccountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ActivateAccountFormValues>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      token: initialToken,
    },
  });

  // Auto-submit if token is provided in URL
  useEffect(() => {
    if (initialToken && initialToken.length >= 10) {
      form.handleSubmit(onSubmit)();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values: ActivateAccountFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call activation API
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: values.token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Activation failed. Please try again.');
      }

      // Success
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?activated=true');
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
            Account Activated!
          </h2>
          <p className="text-center text-[#dcdbd5]">
            Your account has been successfully activated.
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
            Enter the activation token sent to your email to launch your account.
          </p>
        </div>

        {/* Token Field */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#e5e4dd]">Activation Token</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your activation token"
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
              Launching...
            </>
          ) : (
            'Launch'
          )}
        </SecondaryButton>

        {/* Support Link */}
        <p className="text-center text-sm text-[#dcdbd5] mt-8 pb-5">
          Didn&apos;t receive an activation email?{' '}
          <Link href="/contact-support" className="text-[#ffd700] hover:opacity-80 transition-opacity">
            Contact Support
          </Link>
        </p>
      </form>
    </Form>
  );
}
