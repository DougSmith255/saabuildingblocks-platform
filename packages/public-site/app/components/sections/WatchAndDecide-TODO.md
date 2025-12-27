# Watch & Decide Section - Implementation Plan

## Overview
Create a reusable video player component and "Join The Alliance" functionality for the homepage Watch & Decide section.

## Tasks

### 1. Analyze Agent Attraction Page
- [ ] Find the video player implementation
- [ ] Find the video frame/container styling
- [ ] Find the **video progress bar** implementation
- [ ] Find the **progress messages** that appear during video playback
- [ ] Find the **"Book a Call" button** functionality (appears after watching enough)
- [ ] Find the join form popup implementation
- [ ] Find the post-submission instructions popup
- [ ] Find the email send functionality
- [ ] Find the HighLevel database integration
- [ ] Note: This version does NOT include "Referred by (agent name)" - joins under Doug directly

### 2. Create Reusable Video Player Component
- [ ] Extract video player code from agent attraction page
- [ ] Create `/packages/shared/components/saa/media/VideoPlayer.tsx` or similar
- [ ] Include:
  - Video embed (likely Wistia or similar)
  - **Progress bar** that tracks watch progress
  - **Progress messages** that appear at certain thresholds
  - **"Book a Call" button** that appears after watching 50%+ (or whatever threshold)
- [ ] Style the frame/container consistently

### 3. Create Join Form Popup Component
- [ ] Extract form popup from agent attraction page
- [ ] Form fields needed: TBD after analysis
- [ ] Submit handler that:
  - Sends data to HighLevel
  - Triggers email with instructions
  - Shows instructions popup

### 4. Create Instructions Popup Component
- [ ] Extract instructions popup from agent attraction page
- [ ] Shows after form submission
- [ ] Contains next steps for joining

### 5. Email Functionality
- [ ] Find existing email template/function
- [ ] Ensure it sends joining instructions
- [ ] No referral agent info needed (joins under Doug)

### 6. HighLevel Integration
- [ ] Find existing HighLevel API integration
- [ ] Ensure user is added to database
- [ ] No "Referred by" field needed

### 7. Update WatchAndDecide Section
- [ ] Replace video placeholder with VideoPlayer component
- [ ] Add "JOIN THE ALLIANCE" CTAButton below video
- [ ] Wire up form popup trigger
- [ ] Test full flow including:
  - Video playback
  - Progress bar updates
  - Progress messages appearing
  - Book a Call button appearing after threshold
  - Form popup
  - Form submission
  - Instructions popup
  - Email sent
  - HighLevel database entry

---

## Analysis Notes (COMPLETED)

### Video Player Location:
- File: `/home/claude-flow/packages/public-site/functions/[slug].js` (lines 2029-2063)
- Video ID: `f8c3f1bd9c2db2409ed0e90f60fd4d5b`
- Cloudflare Stream iframe URL: `https://customer-2twfsluc6inah5at.cloudflarestream.com/f8c3f1bd9c2db2409ed0e90f60fd4d5b/iframe?controls=false&poster=...`
- SDK: `https://embed.cloudflarestream.com/embed/sdk.latest.js`

### Progress Tracking (lines 2458-2665):
- Uses localStorage with keys: `agent_{slug}_maxTime` and `agent_{slug}_progress`
- `maxWatchedTime` = furthest point watched (in seconds)
- `videoProgress` = percentage for UI display
- Progress bar fills with gradient: `linear-gradient(90deg, #ffd700, #00ff88)`
- "Book Your Call" button appears after 50% watched

### Progress Messages:
- < 50%: "Watch at least 50% to schedule your strategy call."
- >= 50%: "You're ready! Book your strategy call now."

### Join Form Modal (lines 2079-2096):
- Fields: firstName, lastName, email, country
- On submit: saves to localStorage, calls API

### Booking Form Modal (lines 2098-2142):
- More detailed form with phone, state, experience level, career plan
- Only opens after 50% video watched

### HighLevel Integration:
- File: `/home/claude-flow/packages/public-site/functions/api/join-team.js`
- Endpoint: POST `/api/join-team`
- Body: `{ firstName, lastName, email, country, sponsorName }`
- Creates contact in GHL with tag "Referred by {sponsorName}" or "Website Lead"
- Uses env vars: `GOHIGHLEVEL_API_KEY`, `GOHIGHLEVEL_LOCATION_ID`

### For Main Site Implementation:
- Since there's no referral agent, use sponsorName = null (will create "Website Lead" tag)
- Skip the booking modal (full details form)
- Just need: video player + progress + join form + confirmation popup
- Email sending appears to happen on GHL side via automation (not in code)
