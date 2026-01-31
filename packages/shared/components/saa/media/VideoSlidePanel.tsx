'use client';

import React, { useState, useCallback } from 'react';
import { SlidePanel } from '../interactive/SlidePanel';
import { VideoPlayer } from './VideoPlayer';
import { CTAButton } from '../buttons/CTAButton';
import { JoinModal, JoinFormData } from '../interactive/JoinModal';
import { InstructionsModal } from '../interactive/InstructionsModal';

export interface VideoSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Main explainer video ID on Cloudflare Stream
const VIDEO_ID = 'f8c3f1bd9c2db2409ed0e90f60fd4d5b';
const POSTER_URL = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-realty-smart-agent-alliance-explained/desktop';

/**
 * VideoSlidePanel - The Inside Look video in a slide panel
 *
 * Contains the main explainer video with a CTA to join.
 * Used by the FloatingVideoButton and anywhere a quick video view is needed.
 */
export function VideoSlidePanel({ isOpen, onClose }: VideoSlidePanelProps) {
  const [activeModal, setActiveModal] = useState<'join' | 'instructions' | null>(null);
  const [userName, setUserName] = useState('');

  const handleJoinSuccess = useCallback((data: JoinFormData) => {
    setUserName(data.firstName);
    setActiveModal('instructions');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleClose = useCallback(() => {
    setActiveModal(null);
    onClose();
  }, [onClose]);

  return (
    <>
      <SlidePanel
        isOpen={isOpen}
        onClose={handleClose}
        title="The Inside Look"
        subtitle="Everything eXp offers. Everything SAA provides."
        size="xl"
      >
        <div className="flex flex-col gap-6">
          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer
              videoId={VIDEO_ID}
              posterUrl={POSTER_URL}
              storageKey="inside_look_panel_video"
              unlockThreshold={50}
              hideProgressArea={false}
            />
          </div>

          {/* Brief Pitch */}
          <p className="text-body opacity-80 text-center">
            One video. Everything about eXp Realty, Smart Agent Alliance, and how the model works — explained in full.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <CTAButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveModal('join');
              }}
            >
              JOIN THE ALLIANCE
            </CTAButton>
          </div>
        </div>
      </SlidePanel>

      {/* Shared Backdrop for modals */}
      {activeModal !== null && (
        <div
          className="fixed inset-0 z-[10025] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseModal}
          aria-hidden="true"
        />
      )}

      {/* Join Modal */}
      <JoinModal
        isOpen={activeModal === 'join' || activeModal === 'instructions'}
        onClose={handleCloseModal}
        onSuccess={handleJoinSuccess}
        sponsorName={null}
        hideBackdrop={true}
        zIndexOffset={6}
      />

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={activeModal === 'instructions'}
        onClose={handleCloseModal}
        userName={userName}
        hideBackdrop={true}
        zIndexOffset={7}
        onNotYou={() => {
          try {
            localStorage.removeItem('saa_join_submitted');
          } catch {}
          setActiveModal('join');
        }}
      />
    </>
  );
}

export default VideoSlidePanel;
