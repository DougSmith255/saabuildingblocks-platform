'use client';

import { VideoSection } from '@saa/shared/components/saa/media/VideoSection';

// Main explainer video ID on Cloudflare Stream
const VIDEO_ID = 'f8c3f1bd9c2db2409ed0e90f60fd4d5b';
const POSTER_URL = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-realty-smart-agent-alliance-explained/desktop';

/**
 * WatchAndDecide Section
 *
 * Uses the reusable VideoSection component which includes:
 * - Video player with progress tracking
 * - Progress bar with dynamic messaging
 * - "Join The Alliance" button (always visible)
 * - "Book A Call" button (appears after 50% watched)
 * - JoinModal and InstructionsModal
 *
 * This is the primary conversion point on the homepage.
 */
export function WatchAndDecide() {
  return (
    <div className="relative">
      <VideoSection
        id="watch-and-decide"
        title="The Inside Look"
        subtitle="Everything about eXp Realty, Smart Agent Alliance, and how the model works — explained in full."
        videoId={VIDEO_ID}
        posterUrl={POSTER_URL}
        storageKey="homepage_video"
        unlockThreshold={50}
        sponsorName={null} // Joins under Doug directly (Website Lead)
      />
    </div>
  );
}
