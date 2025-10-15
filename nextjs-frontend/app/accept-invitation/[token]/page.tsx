import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import AcceptInvitationForm from '@/components/invitations/AcceptInvitationForm';
import InvitationExpired from '@/components/invitations/InvitationExpired';
import InvitationInvalid from '@/components/invitations/InvitationInvalid';
import InvitationSuccess from '@/components/invitations/InvitationSuccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

/**
 * Route segment config
 * This page requires server-side logic and cannot be statically exported
 * force-dynamic will exclude this route from static export
 */
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    token: string;
  };
  searchParams: {
    success?: string;
  };
}

async function validateInvitationToken(token: string) {
  const supabase = await createClient();

  // Hash the token for lookup using SHA-256
  const crypto = await import('crypto');
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Fetch invitation with hashed token from user_invitations table
  const { data: invitation, error } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('token', tokenHash)
    .single();

  if (error || !invitation) {
    return { valid: false, reason: 'invalid', invitation: null };
  }

  // Check if already accepted
  if (invitation.status === 'accepted') {
    return { valid: false, reason: 'already_used', invitation };
  }

  // Check if expired - use expires_at field directly
  const now = new Date();
  const expiresAt = new Date(invitation.expires_at);
  if (now > expiresAt) {
    return { valid: false, reason: 'expired', invitation };
  }

  // Check if cancelled/revoked
  if (invitation.status === 'cancelled' || invitation.status === 'revoked') {
    return { valid: false, reason: 'revoked', invitation };
  }

  return { valid: true, reason: null, invitation };
}

export default async function AcceptInvitationPage({ params, searchParams }: PageProps) {
  const { token } = params;

  // Show success page if redirected after acceptance
  if (searchParams.success === 'true') {
    return <InvitationSuccess />;
  }

  // Validate token
  const validation = await validateInvitationToken(token);

  // Handle invalid states
  if (!validation.valid) {
    if (validation.reason === 'expired') {
      return <InvitationExpired invitation={validation.invitation} />;
    }
    if (validation.reason === 'already_used') {
      return (
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Already Used</CardTitle>
              <CardDescription>
                This invitation has already been accepted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  If you already have an account, please{' '}
                  <a href="/login" className="font-medium text-primary hover:underline">
                    log in here
                  </a>
                  .
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <InvitationInvalid />;
  }

  // Show account setup form
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AcceptInvitationForm invitation={validation.invitation} token={token} />
    </Suspense>
  );
}

export async function generateMetadata({ params: _params }: PageProps) {
  return {
    title: 'Accept Invitation | SAA Master Controller',
    description: 'Complete your account setup to join SAA Master Controller',
  };
}
