'use client';

/**
 * Contact Support Page (Placeholder)
 * Phase 2: Agent Portal Authentication UI
 *
 * TODO: Implement support contact form in future phase
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 text-display">
            Agent Portal
          </h1>
        </div>

        {/* Card */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center text-display">
              Contact Support
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Get help with your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Email Support</h3>
                  <p className="text-sm text-gray-400">
                    Reach out to your system administrator for assistance with account access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <MessageSquare className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">System Administrator</h3>
                  <p className="text-sm text-gray-400">
                    Contact your organization&apos;s system administrator for immediate help.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/login" className="block">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
