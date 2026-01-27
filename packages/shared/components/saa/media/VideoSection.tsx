'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { CTAButton } from '../buttons/CTAButton';
import { SecondaryButton } from '../buttons/SecondaryButton';
import H2 from '../headings/H2';
import { JoinModal, JoinFormData } from '../interactive/JoinModal';
import { InstructionsModal } from '../interactive/InstructionsModal';

export interface VideoSectionProps {
  /** Section title */
  title?: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Cloudflare Stream video ID */
  videoId: string;
  /** Poster image URL */
  posterUrl?: string;
  /** Storage key for progress persistence */
  storageKey?: string;
  /** Threshold percentage to unlock Book a Call (default: 50) */
  unlockThreshold?: number;
  /** Sponsor name for JoinModal (null = Website Lead under Doug) */
  sponsorName?: string | null;
  /** Optional className for the section */
  className?: string;
  /** Section ID for anchor links */
  id?: string;
  /** Hide the section title */
  hideTitle?: boolean;
  /** Custom "Join" button text */
  joinButtonText?: string;
  /** Custom "Book a Call" button text */
  bookCallButtonText?: string;
  /** Book a Call URL (default: Calendly link) */
  bookCallUrl?: string;
}

/**
 * VideoSection - Complete video section with player, buttons, and modals
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/VideoSection
 *
 * This is a self-contained, reusable section that includes:
 * - H2 title and subtitle
 * - VideoPlayer with progress tracking
 * - Progress bar with dynamic text
 * - "Join The Alliance" button (always visible)
 * - "Book A Call" button (appears after watching 50%)
 * - JoinModal for capturing leads
 * - InstructionsModal for post-join guidance
 *
 * Just drop this component on any page - no additional setup needed.
 *
 * @example
 * ```tsx
 * <VideoSection
 *   id="watch-and-decide"
 *   title="The Only Video You Need"
 *   subtitle="Everything about eXp, our team, and the opportunity - explained in full."
 *   videoId="f8c3f1bd9c2db2409ed0e90f60fd4d5b"
 *   posterUrl="https://..."
 *   storageKey="homepage_video"
 * />
 * ```
 */
export function VideoSection({
  title = 'The Only Video You Need',
  subtitle = 'Everything about eXp, our team, and the opportunity - explained in full. No follow-up research required.',
  videoId,
  posterUrl,
  storageKey = 'saa_video',
  unlockThreshold = 50,
  sponsorName = null,
  className = '',
  id,
  hideTitle = false,
  joinButtonText = 'JOIN THE ALLIANCE',
  bookCallButtonText = 'BOOK A CALL',
  bookCallUrl = 'https://team.smartagentalliance.com/widget/booking/v5LFLy12isdGJiZmTxP7',
}: VideoSectionProps) {
  const [showBookCall, setShowBookCall] = useState(false);
  // Single activePanel state - mirrors New Agents pattern
  const [activePanel, setActivePanel] = useState<'join' | 'instructions' | null>(null);
  const [userName, setUserName] = useState('');

  // Check localStorage for existing progress on mount
  useEffect(() => {
    const savedProgress = parseFloat(localStorage.getItem(`${storageKey}_progress`) || '0');
    if (savedProgress >= unlockThreshold) {
      setShowBookCall(true);
    }
  }, [storageKey, unlockThreshold]);

  const handleThresholdReached = useCallback(() => {
    setShowBookCall(true);
  }, []);

  const handleJoinSuccess = useCallback((data: JoinFormData) => {
    setUserName(data.firstName);
    // Switch to instructions panel - join panel stays open underneath (like New Agents pattern)
    setActivePanel('instructions');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActivePanel(null);
  }, []);

  return (
    <section
      id={id}
      className={`video-section relative py-16 md:py-24 px-4 sm:px-8 md:px-12 ${className}`}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        {!hideTitle && (
          <div className="text-center mb-8 md:mb-12">
            <H2>{title}</H2>
            {subtitle && (
              <p className="text-body mt-4 max-w-2xl mx-auto opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Video Player with Progress Tracking */}
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            videoId={videoId}
            posterUrl={posterUrl}
            storageKey={storageKey}
            unlockThreshold={unlockThreshold}
            onThresholdReached={handleThresholdReached}
          />

          {/* CTA Buttons */}
          <div className="video-section-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {/* Join The Alliance - always visible */}
            <CTAButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePanel('join');
              }}
            >
              {joinButtonText}
            </CTAButton>

            {/* Book A Call - greyed out until threshold, then unlocks */}
            <div
              className="transition-all duration-500"
              style={{
                opacity: showBookCall ? 1 : 0.4,
                filter: showBookCall ? 'none' : 'blur(1px) grayscale(0.8)',
                pointerEvents: showBookCall ? 'auto' : 'none',
              }}
            >
              <SecondaryButton
                href={bookCallUrl}
                onClick={(e) => {
                  e.preventDefault();
                  if (showBookCall) {
                    window.open(bookCallUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {bookCallButtonText}
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Backdrop for both panels - matches New Agents pattern */}
      {activePanel !== null && (
        <div
          className="fixed inset-0 z-[10019] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseModal}
          aria-hidden="true"
        />
      )}

      {/* Join Modal - stays open when instructions opens (like category panel in New Agents) */}
      <JoinModal
        isOpen={activePanel === 'join' || activePanel === 'instructions'}
        onClose={handleCloseModal}
        onSuccess={handleJoinSuccess}
        sponsorName={sponsorName}
        hideBackdrop={true}
        zIndexOffset={0}
      />

      {/* Instructions Modal - slides on top of join modal (like document panel in New Agents) */}
      <InstructionsModal
        isOpen={activePanel === 'instructions'}
        onClose={handleCloseModal}
        userName={userName}
        hideBackdrop={true}
        zIndexOffset={1}
        onNotYou={() => {
          // Clear the cached data and show join form
          try {
            localStorage.removeItem('saa_join_submitted');
          } catch {}
          setActivePanel('join');
        }}
      />
    </section>
  );
}

export default VideoSection;
