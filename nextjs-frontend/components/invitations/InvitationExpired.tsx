'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, Mail, ArrowRight } from 'lucide-react';

interface InvitationExpiredProps {
  invitation: any;
}

export default function InvitationExpired({ invitation }: InvitationExpiredProps) {
  const expiresAt = invitation ? new Date(invitation.expires_at) : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <CardTitle className="text-center">Invitation Expired</CardTitle>
          <CardDescription className="text-center">
            This invitation link has expired and can no longer be used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Expired On</AlertTitle>
            <AlertDescription>
              {expiresAt ? expiresAt.toLocaleString() : 'Unknown date'}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>What to do next:</strong>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Request a New Invitation</p>
                  <p className="text-sm text-muted-foreground">
                    Contact your administrator to send you a new invitation link.
                  </p>
                </div>
              </div>

              {invitation?.email && (
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Your Email</p>
                    <p className="text-sm text-muted-foreground">{invitation.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button
              className="w-full"
              onClick={() => (window.location.href = 'mailto:support@saabuildingblocks.com')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>

            <Button variant="outline" className="w-full" onClick={() => (window.location.href = '/login')}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
