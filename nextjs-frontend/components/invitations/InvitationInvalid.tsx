'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, HelpCircle, Home, Mail } from 'lucide-react';

export default function InvitationInvalid() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-center">Invalid Invitation</CardTitle>
          <CardDescription className="text-center">
            This invitation link is not valid or has been revoked.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Link Not Recognized</AlertTitle>
            <AlertDescription>
              The invitation token could not be found in our system. It may have been revoked or is malformed.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>Common reasons:</strong>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Link was copied incorrectly</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure you copied the entire URL from the invitation email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Invitation was revoked</p>
                  <p className="text-sm text-muted-foreground">
                    The administrator may have canceled this invitation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Link is too old</p>
                  <p className="text-sm text-muted-foreground">
                    Invitation links expire after a certain period for security.
                  </p>
                </div>
              </div>
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

            <Button variant="outline" className="w-full" onClick={() => (window.location.href = '/')}>
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
