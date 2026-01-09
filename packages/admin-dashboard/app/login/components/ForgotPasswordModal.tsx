'use client';

/**
 * Forgot Password Modal Component
 * Opens as a popup to request password reset email
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Modal } from '@saa/shared/components/saa/interactive/Modal';
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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 429) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }

      // Success
      setMaskedEmail(data.data?.email || values.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setSuccess(false);
    setError(null);
    form.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      {success ? (
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" />
            <h2 className="text-2xl font-bold text-center text-[#e5e4dd]">
              Check Your Email
            </h2>
            <p className="text-center text-[#dcdbd5]">
              If an account exists for {maskedEmail}, you will receive a password reset link shortly.
            </p>
            <SecondaryButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
              className="mt-4"
            >
              Close
            </SecondaryButton>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#e5e4dd]">Forgot Password?</h2>
            <p className="text-sm text-[#dcdbd5] mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-sm hover:underline ml-4"
                    >
                      Dismiss
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e5e4dd]">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5]" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          disabled={isSubmitting}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </SecondaryButton>

              {/* Get Help Link */}
              <div className="flex justify-start mt-4">
                <a
                  href="mailto:team@smartagentalliance.com"
                  className="text-sm text-[#ffd700] hover:opacity-80 transition-opacity"
                >
                  Get Help
                </a>
              </div>
            </form>
          </Form>
        </div>
      )}
    </Modal>
  );
}
