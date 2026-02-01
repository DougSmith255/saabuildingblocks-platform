'use client';

import React, { useCallback } from 'react';
import { SlidePanel } from '../interactive/SlidePanel';
import { VideoSection } from './VideoSection';

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
 * Uses the shared VideoSection component in compact mode so that:
 * - Video progress is shared with the homepage (same storageKey)
 * - Book a Call unlocks after 50% watched (handled by VideoSection)
 * - Join → Instructions modal flow is handled by VideoSection
 * - Buttons stack vertically (compact mode)
 */
export function VideoSlidePanel({ isOpen, onClose }: VideoSlidePanelProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="The Inside Look"
      subtitle="Everything eXp offers. Everything SAA provides."
      size="xl"
    >
      <VideoSection
        videoId={VIDEO_ID}
        posterUrl={POSTER_URL}
        storageKey="homepage_video"
        unlockThreshold={50}
        sponsorName={null}
        hideTitle
        compact
      />
    </SlidePanel>
  );
}

export default VideoSlidePanel;
