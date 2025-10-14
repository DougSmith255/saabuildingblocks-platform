'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Send, Copy, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Invitation } from '@/types/invitation';

interface InvitationActionsProps {
  invitation: Invitation;
  onResend: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export function InvitationActions({
  invitation,
  onResend,
  onCancel,
}: InvitationActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const copyInvitationLink = async () => {
    const link = `${window.location.origin}/invite/${invitation.token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Link copied',
        description: 'Invitation link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await onResend(invitation.id);
      toast({
        title: 'Invitation resent',
        description: `Invitation sent to ${invitation.email}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to resend',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(invitation.id);
      toast({
        title: 'Invitation cancelled',
        description: `Invitation for ${invitation.email} has been cancelled`,
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: 'Failed to cancel',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canResend = invitation.status === 'expired' || invitation.status === 'sent';
  const canCancel = invitation.status !== 'accepted' && invitation.status !== 'cancelled';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyInvitationLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          {canResend && (
            <DropdownMenuItem onClick={handleResend} disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              Resend Invitation
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Invitation
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the invitation for <strong>{invitation.email}</strong>.
              They will no longer be able to use this invitation link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Invitation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
