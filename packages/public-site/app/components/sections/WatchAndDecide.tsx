'use client';

import { useState, useCallback, useEffect } from 'react';
import { H2, CTAButton } from '@saa/shared/components/saa';
import { VideoPlayer } from '@saa/shared/components/saa/media/VideoPlayer';
import { JoinModal, JoinFormData } from '@saa/shared/components/saa/interactive/JoinModal';
import { InstructionsModal } from '@saa/shared/components/saa/interactive/InstructionsModal';

// Main explainer video ID on Cloudflare Stream
const VIDEO_ID = 'f8c3f1bd9c2db2409ed0e90f60fd4d5b';
const POSTER_URL = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-realty-smart-agent-alliance-explained/desktop';

/**
 * WatchAndDecide Section
 * Features the main explainer video with progress tracking, H2 title,
 * and "Join The Alliance" button that appears after watching 50%.
 *
 * This is the primary conversion point - one video to explain everything.
 */
export function WatchAndDecide() {
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [userName, setUserName] = useState('');

  // Check localStorage for existing progress on mount
  useEffect(() => {
    const savedProgress = parseFloat(localStorage.getItem('homepage_video_progress') || '0');
    if (savedProgress >= 50) {
      setShowJoinButton(true);
    }
  }, []);

  const handleThresholdReached = useCallback(() => {
    setShowJoinButton(true);
  }, []);

  const handleJoinSuccess = useCallback((data: JoinFormData) => {
    setUserName(data.firstName);
    setShowJoinModal(false);
    // Small delay to allow join modal to close before showing instructions
    setTimeout(() => {
      setShowInstructions(true);
    }, 300);
  }, []);

  return (
    <section
      id="watch-and-decide"
      className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12"
    >
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <H2>The Only Video You Need</H2>
          <p className="text-body mt-4 max-w-2xl mx-auto opacity-80">
            Everything about eXp, our team, and the opportunity - explained in full. No follow-up research required.
          </p>
        </div>

        {/* Video Player with Progress Tracking */}
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            videoId={VIDEO_ID}
            posterUrl={POSTER_URL}
            storageKey="homepage_video"
            unlockThreshold={50}
            onThresholdReached={handleThresholdReached}
          />

          {/* Join The Alliance Button - appears after 50% watched */}
          <div
            className="text-center mt-8 transition-all duration-500"
            style={{
              opacity: showJoinButton ? 1 : 0,
              transform: showJoinButton ? 'translateY(0)' : 'translateY(20px)',
              pointerEvents: showJoinButton ? 'auto' : 'none',
            }}
          >
            <CTAButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowJoinModal(true);
              }}
            >
              JOIN THE ALLIANCE
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <JoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
        sponsorName={null} // Joins under Doug directly (Website Lead)
      />

      {/* Instructions Modal - shown after successful join */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        userName={userName}
      />
    </section>
  );
}
