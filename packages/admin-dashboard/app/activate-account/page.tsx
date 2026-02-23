'use client';

/**
 * Activate Account Page
 *
 * Matches public site login page styling:
 * - H1 component with 3D glow/perspective effects (centered)
 * - GenericCard dark glass card
 * - FormButton gold gradient button
 */

export const dynamic = 'error';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ActivateAccountForm from './components/ActivateAccountForm';
import H1 from '@saa/shared/components/saa/headings/H1';
import { GenericCard } from '@saa/shared/components/saa/cards/GenericCard';

function ActivateAccountPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* H1 centered with flex to account for perspective transform offset */}
      <div className="flex justify-center mb-4">
        <H1 disableCloseGlow>ACTIVATE</H1>
      </div>

      {/* Card */}
      <GenericCard className="w-full">
        <ActivateAccountForm initialToken={token} />
      </GenericCard>
    </div>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <ActivateAccountPageContent />
    </Suspense>
  );
}
