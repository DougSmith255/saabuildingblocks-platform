'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Header from '@public-site/components/shared/Header';
import { JoinModal } from '@saa/shared/components/saa/interactive/JoinModal';
import { InstructionsModal } from '@saa/shared/components/saa/interactive/InstructionsModal';

/**
 * HeaderIsland - Header + global JoinModal system
 *
 * On the homepage (pure Astro), this island provides:
 * - The shared Header component
 * - JoinModal / InstructionsModal triggered by `open-join-modal` event
 *   (dispatched by JoinCTA button and Header's JOIN button)
 *
 * On AppShell island pages, LayoutWrapper already provides these modals,
 * so this island is NOT used there.
 */
export default function HeaderIsland() {
  const [joinPanel, setJoinPanel] = useState<'join' | 'instructions' | null>(null);
  const [joinUserName, setJoinUserName] = useState('');
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  // Listen for open-join-modal event (from JoinCTA button, Header JOIN button, etc.)
  useEffect(() => {
    const handleOpen = () => setJoinPanel('join');
    window.addEventListener('open-join-modal', handleOpen);
    return () => window.removeEventListener('open-join-modal', handleOpen);
  }, []);

  const handleJoinSuccess = useCallback((data: { firstName: string }) => {
    setJoinUserName(data.firstName);
    setJoinPanel('instructions');
  }, []);

  const handleJoinClose = useCallback(() => {
    setJoinPanel(null);
  }, []);

  return (
    <>
      <Header />
      {portalRoot && joinPanel !== null && createPortal(
        <>
          {/* Shared backdrop */}
          <div
            className="fixed inset-0 z-[10019] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleJoinClose}
            aria-hidden="true"
          />
          <JoinModal
            isOpen={joinPanel === 'join' || joinPanel === 'instructions'}
            onClose={handleJoinClose}
            onSuccess={handleJoinSuccess}
            sponsorName={null}
            hideBackdrop={true}
            zIndexOffset={0}
          />
          <InstructionsModal
            isOpen={joinPanel === 'instructions'}
            onClose={handleJoinClose}
            userName={joinUserName}
            hideBackdrop={true}
            zIndexOffset={1}
            onNotYou={() => {
              try { localStorage.removeItem('saa_join_submitted'); } catch {}
              setJoinPanel('join');
            }}
          />
        </>,
        portalRoot
      )}
    </>
  );
}
